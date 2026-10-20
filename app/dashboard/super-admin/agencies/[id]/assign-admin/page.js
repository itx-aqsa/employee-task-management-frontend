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
            };

            const { response, data } = await apiFetch(
                `/agencies/${agencyId}/admins`,
                "POST",
                body
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
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={ROLES.SUPER_ADMIN} user={user} />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/dashboard/super-admin/agencies")}
                        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4 transition-colors"
                    >
                        ← Back to Agencies
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Assign Agency Admin
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Create an admin account and assign it to this agency
                    </p>
                </div>

                {/* Form card */}
                <div className="max-w-xl bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                            />
                        </div>

                        {/* Info pill */}
                        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                            <span>ℹ️</span>
                            <p className="text-xs text-indigo-700">
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
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating…" : "Create Admin"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/super-admin/agencies")}
                                className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
