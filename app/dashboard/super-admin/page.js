"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FiActivity,
    FiArrowUpRight,
    FiBriefcase,
    FiCheckCircle,
    FiClipboard,
    FiClock,
    FiUserCheck,
    FiUsers,
} from "react-icons/fi";
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

    const fetchPlatformStats = useCallback(async () => {
        try {
            const { response, data } = await apiFetch("/users/platform-stats");
            if (response.ok && data.data) {
                setPlatformStats((prev) => ({ ...prev, ...data.data }));
            }
        } catch (error) {
            console.error("Failed to fetch platform stats:", error);
        }
    }, []);

    const fetchAgencies = useCallback(async () => {
        try {
            const { response, data } = await apiFetch("/agencies");
            if (response.ok && data.data) {
                setAgencies(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch agencies:", error);
        }
    }, []);

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
    }, [fetchAgencies, fetchPlatformStats, router]);

    if (!isAuthChecked) return null;

    const statCards = [
        { label: "Agencies", value: platformStats.totalAgencies, icon: FiBriefcase, color: "text-teal-700", bg: "bg-teal-100", accent: "from-teal-500 to-cyan-500" },
        { label: "Admins", value: platformStats.totalAdmins, icon: FiUserCheck, color: "text-teal-700", bg: "bg-teal-100", accent: "from-teal-500 to-teal-600" },
        { label: "Employees", value: platformStats.totalEmployees, icon: FiUsers, color: "text-teal-700", bg: "bg-teal-100", accent: "from-teal-500 to-teal-600" },
        { label: "Total Tasks", value: platformStats.totalTasks, icon: FiClipboard, color: "text-slate-700", bg: "bg-slate-100", accent: "from-slate-500 to-slate-700" },
        { label: "Pending", value: platformStats.pendingTasks, icon: FiClock, color: "text-amber-700", bg: "bg-amber-100", accent: "from-amber-400 to-amber-500" },
        { label: "In Progress", value: platformStats.inProgressTasks, icon: FiActivity, color: "text-sky-700", bg: "bg-sky-100", accent: "from-sky-500 to-blue-600" },
        { label: "Completed", value: platformStats.completedTasks, icon: FiCheckCircle, color: "text-green-700", bg: "bg-green-100", accent: "from-green-400 to-emerald-500" },
    ];

    return (
        <div className="min-h-screen bg-slate-100/70 md:flex">
            <Sidebar role={ROLES.SUPER_ADMIN} user={user} superAdminOverview employeeTheme />

            <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 sm:pt-8 md:ml-64 md:px-8 md:pb-8">
                <div className="mx-auto max-w-9xl">
                    <header className="relative isolate mb-7 overflow-hidden rounded-[2rem] bg-linear-to-br from-teal-800 via-teal-700 to-teal-600 px-6 py-7 text-white shadow-xl shadow-teal-900/10 sm:px-9 sm:py-9">
                        <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10" />
                        <div aria-hidden="true" className="absolute -right-3 -top-12 -z-10 h-56 w-56 rounded-full border border-white/10" />
                        <div aria-hidden="true" className="absolute -bottom-36 right-1/3 -z-10 h-72 w-72 rounded-full bg-teal-600/50 blur-2xl" />
                        <div className="relative">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-50">
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                SUPER ADMIN · PLATFORM CONTROL
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">Platform Overview</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-teal-50/90 sm:text-base">
                                Global statistics and agency activity across your platform.
                            </p>
                        </div>
                        <div className="relative mt-7 flex items-center gap-2 border-t border-white/15 pt-5 text-sm text-teal-50/90">
                            <span className="h-2 w-2 rounded-full bg-green-400" />
                            <span>Platform data overview</span>
                            {user?.name && <span className="ml-auto hidden text-teal-50/70 sm:inline">Signed in as {user.name}</span>}
                        </div>
                    </header>

                    <section aria-label="Platform statistics" className="mb-8">
                        <div className="mb-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Platform metrics</p>
                            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">At a glance</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:gap-4">
                            {statCards.map((stat) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.label} className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.025] transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/[0.06] sm:p-5">
                                        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.accent}`} />
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 sm:text-sm">{stat.label}</p>
                                                <p className={`mt-2 text-2xl font-semibold tracking-tight sm:text-3xl ${stat.color}`}>{stat.value}</p>
                                            </div>
                                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.bg} transition-transform group-hover:rotate-[-5deg]`}>
                                                <Icon aria-hidden="true" className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-teal-500" />
                                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">Agencies</h2>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">All registered agencies on the platform</p>
                            </div>
                            <button onClick={() => router.push("/dashboard/super-admin/agencies")} className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-teal-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-50 focus:outline-none focus:ring-4 focus:ring-teal-200">
                                View all <FiArrowUpRight aria-hidden="true" className="h-4 w-4" />
                            </button>
                        </div>

                        {agencies.length === 0 ? (
                            <div className="px-6 py-14 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><FiBriefcase aria-hidden="true" className="h-6 w-6" /></div>
                                <p className="mt-4 text-sm font-semibold text-slate-800">No agencies found</p>
                                <p className="mt-1 text-sm text-slate-500">Registered workspaces will appear here.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {agencies.slice(0, 8).map((agency) => (
                                    <div key={agency.id} className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-teal-50/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-sm font-bold text-teal-800 ring-1 ring-inset ring-teal-200/70">
                                                {agency.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">{agency.name}</p>
                                                {agency.domain && <p className="mt-0.5 truncate text-xs text-slate-500">{agency.domain}</p>}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pl-[3.25rem] text-xs text-slate-500 sm:pl-0">
                                            <span className="inline-flex items-center gap-1.5"><FiUsers aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />{agency._count?.users ?? 0} users</span>
                                            <span className="inline-flex items-center gap-1.5"><FiClipboard aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />{agency._count?.tasks ?? 0} tasks</span>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${agency.isActive ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${agency.isActive ? "bg-green-500" : "bg-red-500"}`} />
                                                {agency.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs text-slate-500 sm:px-6">
                            <span>Showing {Math.min(agencies.length, 8)} of {agencies.length} agencies</span>
                            <span className="hidden items-center gap-1.5 sm:inline-flex"><FiBriefcase aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" /> Platform directory</span>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
