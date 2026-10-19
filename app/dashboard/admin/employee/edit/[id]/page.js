"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../../../lib/api";
import { requireRole } from "../../../../../lib/auth";

export default function EditEmployee() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.ADMIN]);
            if (!profile) return;

            setUser(profile);
            const agencyId = profile.agencyId ?? null;

            try {
                const { response, data } = await apiFetch(
                    `/users/${params.id}`,
                    "GET",
                    null,
                    agencyId
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push("/login");
                        return;
                    }
                    setMessage({ text: data.message || "Failed to load employee.", type: "error" });
                    return;
                }

                setFormData({
                    name: data.data.name,
                    email: data.data.email,
                    password: "",
                });
            } catch {
                setMessage({ text: "Something went wrong.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [params.id, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: "", type: "" });

        try {
            const agencyId = user?.agencyId ?? null;
            const { response, data } = await apiFetch(
                `/users/${params.id}`,
                "PUT",
                formData,
                agencyId
            );

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                setMessage({ text: data.message || "Failed to update employee.", type: "error" });
                return;
            }

            setMessage({ text: "Employee updated successfully!", type: "success" });
        } catch {
            setMessage({ text: "Something went wrong.", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center text-slate-400">
                    <p className="text-3xl mb-2">⏳</p>
                    <p>Loading employee data...</p>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold text-slate-900">Edit Employee</h1>
                    <p className="text-slate-500 mt-1">Update employee information</p>
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
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave empty to keep current password"
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                Leave blank to keep the existing password
                            </p>
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
                                disabled={saving}
                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save Changes"}
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
