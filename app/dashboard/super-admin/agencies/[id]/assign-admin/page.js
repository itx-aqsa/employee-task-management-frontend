"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../../../lib/api";
import { requireRole } from "../../../../../lib/auth";

export default function AssignAdminPage() {
    const [user, setUser] = useState(null);
    // Admins created during this session — tracked locally because the backend
    // does not yet expose a filtered GET /users?role=ADMIN endpoint.
    const [createdAdmins, setCreatedAdmins] = useState([]);
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
            // Payload matches the backend userSchema exactly:
            // { name, email, password, role? }
            // agencyId is NOT in the schema so it is intentionally omitted.
            const body = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: ROLES.ADMIN,
            };

            const { response, data } = await apiFetch("/users", "POST", body);

            if (!response.ok) {
                // Surface the exact Zod / business-logic message from the backend.
                const errText =
                    data?.message ||
                    data?.detail ||
                    `Request failed (${response.status})`;
                setMessage({ text: errText, type: "error" });
                return;
            }

            const newAdmin = data.data; // { id, name, email, role, ... }

            // Append to the session-local admin list so the panel refreshes.
            setCreatedAdmins((prev) => [
                ...prev,
                {
                    id: newAdmin?.id ?? Date.now(),
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                },
            ]);

            setMessage({
                text: `Admin "${formData.name.trim()}" created successfully.`,
                type: "success",
            });
            setFormData({ name: "", email: "", password: "" });
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
                        Create Agency Admin
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Create a new user account with the Admin role
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* ── Form ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <h2 className="text-base font-semibold text-slate-800 mb-5">
                            Admin Details
                        </h2>

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
                                    <strong>ADMIN</strong> role. The admin can then log in
                                    and manage their agency.
                                </p>
                            </div>

                            {/* Feedback banner */}
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
                                    onClick={() =>
                                        router.push("/dashboard/super-admin/agencies")
                                    }
                                    className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ── Admins created this session ── */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100">
                            <h2 className="text-base font-semibold text-slate-800">
                                Created This Session
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Admin accounts created during this visit
                            </p>
                        </div>

                        {createdAdmins.length === 0 ? (
                            <div className="text-center py-16 text-slate-400">
                                <p className="text-3xl mb-2">👤</p>
                                <p className="text-sm">No admins created yet</p>
                                <p className="text-xs mt-1">
                                    Use the form to create one
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-50">
                                {createdAdmins.map((admin) => (
                                    <li
                                        key={admin.id}
                                        className="flex items-center gap-3 px-6 py-4"
                                    >
                                        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                                            {admin.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">
                                                {admin.name}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate">
                                                {admin.email}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 flex-shrink-0">
                                            ✓ Created
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
