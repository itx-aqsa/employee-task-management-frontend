"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../../../lib/api";
import { requireRole } from "../../../../../lib/auth";

export default function AssignAdminPage() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const router = useRouter();
    const params = useParams();
    const agencyId = params.id;

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.SUPER_ADMIN]);
            if (!profile) return;
            setUser(profile);
            setIsAuthChecked(true);
        };
        init();
    }, [router]);

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const body = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: "ADMIN",
                agencyId: Number(agencyId),
            };

            const { response, data } = await apiFetch(
                `/agencies/${agencyId}/admins`,
                "POST",
                body,
                agencyId  // sets X-Agency-Id header for backend middleware
            );

            if (!response.ok) {
                const errText =
                    data?.message ||
                    data?.detail ||
                    `Request failed (${response.status})`;
                setMessage({ text: errText, type: "error" });
                return;
            }

            // Redirect to agencies list — the page refetches and the
            // user count for this agency will reflect the new admin.
            router.push("/dashboard/super-admin/agencies");
        } catch (err) {
            setMessage({
                text: err?.message || "Something went wrong. Please try again.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthChecked) return null;

    return (
        <div className="min-h-screen bg-slate-100/70 md:flex">
            <Sidebar role={ROLES.SUPER_ADMIN} user={user} superAdminAgencies employeeTheme />

            <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 md:ml-64 md:px-8 md:pb-10 md:pt-8">
                <div className="mx-auto max-w-9xl">
                {/* Header */}
                <div className="relative isolate mb-8 overflow-hidden rounded-[1.75rem] bg-linear-to-br from-teal-800 via-teal-700 to-teal-600 px-6 py-7 text-white shadow-lg shadow-teal-900/10 sm:px-8">
                    <div aria-hidden="true" className="absolute -right-12 -top-20 -z-10 h-56 w-56 rounded-full border-[24px] border-white/10" />
                    <button
                        onClick={() => router.push("/dashboard/super-admin/agencies")}
                        className="mb-5 flex items-center gap-1 text-sm font-medium text-teal-50/80 transition-colors hover:text-white"
                    >
                        ← Back to Agencies
                    </button>
                    <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-50">Agency access</p>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">
                        Assign Agency Admin
                    </h1>
                    <p className="mt-2 text-sm text-teal-50/80 sm:text-base">
                        Create an admin account and assign it to this agency
                    </p>
                </div>

                {/* Form card */}
                <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.025] sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Administrator details</h2>
                            <p className="mt-1 text-sm text-slate-500">Create the account that will manage this agency.</p>
                        </div>
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter admin's full name"
                                required
                                minLength={2}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Temporary Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        {/* Info pill */}
                        <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">
                            <span>ℹ️</span>
                            <p className="text-xs text-teal-800">
                                This account will be created with the{" "}
                                <strong>ADMIN</strong> role and linked to this agency.
                            </p>
                        </div>

                        {/* Error banner — only shown on failure; success navigates away */}
                        {message.text && (
                            <div className="text-sm rounded-xl px-4 py-3 border bg-red-50 border-red-200 text-red-700">
                                {message.text}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating…" : "Create Admin"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/super-admin/agencies")}
                                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </main>
        </div>
    );
}
