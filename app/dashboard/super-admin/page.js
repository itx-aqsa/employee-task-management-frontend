"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { apiFetch, ROLES } from "../../lib/api";
import { requireRole } from "../../lib/auth";

export default function SuperAdminDashboard() {
    const [user, setUser] = useState(null);
    const [platformStats, setPlatformStats] = useState({
        totalAgencies: 0,
        totalAdmins: 0,
        totalEmployees: 0,
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
    });
    const [agencies, setAgencies] = useState([]);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.SUPER_ADMIN]);
            if (!profile) return;

            setUser(profile);
            setIsAuthChecked(true);

            fetchPlatformStats();
            fetchAgencies();
        };

        init();
    }, [router]);

    const fetchPlatformStats = async () => {
        try {
            const { response, data } = await apiFetch("/users/platform-stats");
            if (response.ok && data.data) {
                setPlatformStats((prev) => ({ ...prev, ...data.data }));
            }
        } catch (error) {
            console.error("Failed to fetch platform stats:", error);
        }
    };

    const fetchAgencies = async () => {
        try {
            const { response, data } = await apiFetch("/agencies");
            if (response.ok && data.data) {
                setAgencies(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch agencies:", error);
        }
    };

    if (!isAuthChecked) return null;

    const statCards = [
        { label: "Agencies", value: platformStats.totalAgencies, icon: "🏢", color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Admins", value: platformStats.totalAdmins, icon: "👤", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Employees", value: platformStats.totalEmployees, icon: "👥", color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Total Tasks", value: platformStats.totalTasks, icon: "📋", color: "text-slate-600", bg: "bg-slate-50" },
        { label: "Pending", value: platformStats.pendingTasks, icon: "⏳", color: "text-amber-600", bg: "bg-amber-50" },
        { label: "In Progress", value: platformStats.inProgressTasks, icon: "🔄", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Completed", value: platformStats.completedTasks, icon: "✅", color: "text-green-600", bg: "bg-green-50" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={ROLES.SUPER_ADMIN} user={user} />

            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Platform Overview
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Global statistics across all agencies
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-10">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3"
                        >
                            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center text-lg`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Agencies section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">
                                Agencies
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                All registered agencies on the platform
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard/super-admin/agencies")}
                            className="text-sm text-indigo-600 font-medium hover:underline"
                        >
                            View all →
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {agencies.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <p className="text-3xl mb-2">🏢</p>
                                <p className="text-sm">No agencies found</p>
                            </div>
                        ) : (
                            agencies.slice(0, 8).map((agency) => (
                                <div
                                    key={agency.id}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-700 font-bold text-sm">
                                            {agency.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">
                                                {agency.name}
                                            </p>
                                            {agency.domain && (
                                                <p className="text-xs text-slate-400">
                                                    {agency.domain}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span>
                                            {agency._count?.users ?? 0} users
                                        </span>
                                        <span>
                                            {agency._count?.tasks ?? 0} tasks
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full font-medium ${
                                                agency.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {agency.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
