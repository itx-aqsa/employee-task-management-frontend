"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../../../lib/api";
import { requireRole } from "../../../../../lib/auth";

export default function AssignAdminPage() {
    const [user, setUser] = useState(null);
    const [agency, setAgency] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
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
            fetchAgency();
            fetchAdmins();
        };
        init();
    }, [router, agencyId]);

    const fetchAgency = async () => {
        try {
            const { response, data } = await apiFetch(`/agencies/${agencyId}`);
            if (response.ok) {
                setAgency(data.data || null);
            }
        } catch {
            // non-fatal — the page still renders the form
        }
    };

    const fetchAdmins = async () => {
        try {
            // Fetch users belonging to this agency who have the ADMIN role.
            const { response, data } = await apiFetch(
                `/users?agencyId=${agencyId}&role=ADMIN`
            );
            if (response.ok) {
                setAdmins(data.data || []);
            }
        } catch {
            // non-fatal
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const body = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: ROLES.ADMIN,
            };

            const { response, data } = await apiFetch("/users", "POST", body);

            if (!response.ok) {
                // surface the exact backend message (Zod field error, duplicate email, etc.)
                const errText =
                    data?.message ||
                    data?.detail ||
                    `Request failed (${response.status})`;
                setMessage({ text: errText, type: "error" });
                return;
            }

            setMessage({
                text: `Admin "${formData.name}" created and assigned to agency.`,
                type: "success",
            });
            setFormData({ name: "", email: "", password: "" });
            fetchAdmins();
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

                    {agency ? (
                        <div className="flex items-center gap-4 mb-1">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 font-bold text-lg">
                                {agency.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {agency.name}
                                </h1>
                                <p className="text-slate-500 text-sm">
                                    Assign an Admin to this agency
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Assign Agency Admin
                            </h1>
                            <p className="text-slate-500 mt-1">
                                Create an admin account tied to this agency
                            </p>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Create admin form */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <h2 className="text-base font-semibold text-slate-800 mb-5">
                            Create Agency Admin
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
                                    placeholder="admin@agency.com"
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
                                    className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                                />
                            </div>

                            {/* Role info pill */}
                            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                                <span className="text-indigo-500">ℹ️</span>
                                <p className="text-xs text-indigo-700">
                                    This account will be created with the{" "}
                                    <strong>ADMIN</strong> role and automatically
                                    scoped to this agency.
                                </p>
                            </div>

                            {/* Feedback */}
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

                    {/* Existing admins panel */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100">
                            <h2 className="text-base font-semibold text-slate-800">
                                Current Admins
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Admins already assigned to this agency
                            </p>
                        </div>

                        {admins.length === 0 ? (
                            <div className="text-center py-16 text-slate-400">
                                <p className="text-3xl mb-2">👤</p>
                                <p className="text-sm">No admins assigned yet</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-50">
                                {admins.map((admin) => (
                                    <li
                                        key={admin.id}
                                        className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors"
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
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 flex-shrink-0">
                                            ADMIN
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
