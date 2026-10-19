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
            const { response, data } = await apiFetch(
                "/users",
                "POST",
                formData,
                agencyId
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
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={ROLES.ADMIN} user={user} />

            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Add Employee</h1>
                    <p className="text-slate-500 mt-1">Create a new employee account</p>
                </div>

                <div className="max-w-xl bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating..." : "Create Employee"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/admin")}
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
