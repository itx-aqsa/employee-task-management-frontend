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
        }
    };

    if (!isAuthChecked) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={ROLES.SUPER_ADMIN} user={user} />

            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Agencies</h1>
                    <p className="text-slate-500 mt-1">
                        Manage all registered agencies on the platform
                    </p>
                </div>

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
                                        <td colSpan="6" className="text-center py-16 text-slate-400">
                                            <p className="text-3xl mb-2">🏢</p>
                                            <p>No agencies found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    agencies.map((agency) => (
                                        <tr
                                            key={agency.id}
                                            className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 font-bold text-sm">
                                                        {agency.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-medium text-slate-800">
                                                        {agency.name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {agency.domain || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {agency._count?.users ?? 0}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {agency._count?.tasks ?? 0}
                                            </td>
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
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(agency.id, agency.isActive)
                                                    }
                                                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                                                        agency.isActive
                                                            ? "text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                                                            : "text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
                                                    }`}
                                                >
                                                    {agency.isActive ? "Deactivate" : "Activate"}
                                                </button>
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
