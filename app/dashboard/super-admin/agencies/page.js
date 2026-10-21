"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../lib/api";
import { requireRole } from "../../../lib/auth";

export default function AgenciesPage() {
    const [user, setUser] = useState(null);
    const [agencies, setAgencies] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.SUPER_ADMIN]);
            if (!profile) return;
            setUser(profile);
            setIsAuthChecked(true);
            fetchAgencies();
        };
        init();
    }, [router]);

    const fetchAgencies = async () => {
        try {
            const { response, data } = await apiFetch("/agencies");
            if (!response.ok) {
                setMessage({ text: data.message || "Failed to load agencies.", type: "error" });
                return;
            }
            setAgencies(data.data || []);
        } catch {
            setMessage({ text: "Something went wrong.", type: "error" });
        }
    };

    const handleToggleStatus = async (agencyId, currentStatus) => {
        setTogglingId(agencyId);
        try {
            const { response, data } = await apiFetch(
                `/agencies/${agencyId}`,
                "PUT",
                { isActive: !currentStatus }
            );

            if (!response.ok) {
                setMessage({ text: data.message || "Failed to update agency.", type: "error" });
                return;
            }

            setAgencies((prev) =>
                prev.map((a) =>
                    a.id === agencyId ? { ...a, isActive: !currentStatus } : a
                )
            );
            setMessage({ text: "Agency status updated.", type: "success" });
        } catch {
            setMessage({ text: "Something went wrong.", type: "error" });
        } finally {
            setTogglingId(null);
        }
    };

    if (!isAuthChecked) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={ROLES.SUPER_ADMIN} user={user} />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Agencies</h1>
                        <p className="text-slate-500 mt-1">
                            Manage all registered agencies on the platform
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            router.push("/dashboard/super-admin/agencies/create")
                        }
                        className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm"
                    >
                        <span>＋</span> New Agency
                    </button>
                </div>

                {/* Feedback banner */}
                {message.text && (
                    <div
                        className={`mb-6 text-sm rounded-xl px-4 py-3 border ${
                            message.type === "success"
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Stats strip */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        {
                            label: "Total Agencies",
                            value: agencies.length,
                            icon: "🏢",
                            color: "text-purple-600",
                            bg: "bg-purple-50",
                        },
                        {
                            label: "Active",
                            value: agencies.filter((a) => a.isActive).length,
                            icon: "✅",
                            color: "text-green-600",
                            bg: "bg-green-50",
                        },
                        {
                            label: "Inactive",
                            value: agencies.filter((a) => !a.isActive).length,
                            icon: "🔴",
                            color: "text-red-600",
                            bg: "bg-red-50",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4"
                        >
                            <div
                                className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center text-xl`}
                            >
                                {stat.icon}
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </p>
                                <p className="text-xs text-slate-400">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Agencies table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Agency
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Domain
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Users
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Tasks
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Status
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {agencies.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-20 text-slate-400">
                                            <p className="text-4xl mb-3">🏢</p>
                                            <p className="font-medium text-slate-500">
                                                No agencies yet
                                            </p>
                                            <p className="text-sm mt-1">
                                                Click "New Agency" to create the first one.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    agencies.map((agency) => (
                                        <tr
                                            key={agency.id}
                                            className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                                        >
                                            {/* Agency name + avatar */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 font-bold text-sm flex-shrink-0">
                                                        {agency.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800 text-sm">
                                                            {agency.name}
                                                        </p>
                                                        {agency.description && (
                                                            <p className="text-xs text-slate-400 truncate max-w-[200px]">
                                                                {agency.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Domain */}
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {agency.domain || "—"}
                                            </td>
                                            {/* Users count */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                                                    👤 {agency._count?.users ?? 0}
                                                </span>
                                            </td>
                                            {/* Tasks count */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                                                    📋 {agency._count?.tasks ?? 0}
                                                </span>
                                            </td>
                                            {/* Status badge */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                        agency.isActive
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-600"
                                                    }`}
                                                >
                                                    {agency.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/dashboard/super-admin/agencies/${agency.id}/assign-admin`
                                                            )
                                                        }
                                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-colors"
                                                    >
                                                        Assign Admin
                                                    </button>
                                                    <button
                                                        disabled={togglingId === agency.id}
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                agency.id,
                                                                agency.isActive
                                                            )
                                                        }
                                                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                                                            agency.isActive
                                                                ? "text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                                                                : "text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                                                        }`}
                                                    >
                                                        {togglingId === agency.id
                                                            ? "…"
                                                            : agency.isActive
                                                            ? "Deactivate"
                                                            : "Activate"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
