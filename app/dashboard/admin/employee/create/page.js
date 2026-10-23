"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../../lib/api";
import { requireRole } from "../../../../lib/auth";

export default function CreateEmployee() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.ADMIN]);
            if (!profile) return;

            setUser(profile);
            setIsAuthChecked(true);
        };

        init();
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const agencyId = user?.agencyId ?? null;

            if (!agencyId) {
                setMessage({ text: "Unable to determine your agency. Please re-login.", type: "error" });
                return;
            }

            const body = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: "EMPLOYEE",
                agencyId,
            };

            const { response, data } = await apiFetch(
                "/users",
                "POST",
                body,
                agencyId  // also sets X-Agency-Id header
            );

            if (!response.ok) {
                setMessage({ text: data.message || "Failed to create employee.", type: "error" });
                return;
            }

            setMessage({ text: "Employee created successfully!", type: "success" });
            setFormData({ name: "", email: "", password: "" });
        } catch {
            setMessage({ text: "Something went wrong.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthChecked) return null;

    return (
        <div className="min-h-screen bg-slate-100/80 md:flex">
            <Sidebar role={ROLES.ADMIN} user={user} adminDashboard />

            <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 md:ml-64 md:px-8 md:pb-10 md:pt-8">
                <div className="mx-auto max-w-7xl">
                <div className="mb-8 border-b border-slate-200 pb-6">
                    <button
                        onClick={() => router.back()}
                        className="mb-4 flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-teal-700"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Add Employee</h1>
                    <p className="text-slate-500 mt-1">Create a new employee account</p>
                </div>

                <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Agency context */}
                        {user?.agencyId && (
                            <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3">
                                <span>🏢</span>
                                <p className="text-xs text-teal-800">
                                    This employee will be added to your agency{" "}
                                    <strong>(ID: {user.agencyId})</strong>.
                                </p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter employee name"
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="employee@example.com"
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Temporary Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        {message.text && (
                            <div
                                className={`text-sm rounded-xl px-4 py-3 border ${
                                    message.type === "success"
                                        ? "bg-green-50 border-green-200 text-green-700"
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating..." : "Create Employee"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/admin")}
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
