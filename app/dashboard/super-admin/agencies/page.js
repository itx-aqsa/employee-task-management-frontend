"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FiArrowUpRight,
    FiBriefcase,
    FiCheckCircle,
    FiClipboard,
    FiPlus,
    FiUsers,
    FiXCircle,
} from "react-icons/fi";
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

    const fetchAgencies = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.SUPER_ADMIN]);
            if (!profile) return;
            setUser(profile);
            setIsAuthChecked(true);
            fetchAgencies();
        };
        init();
    }, [fetchAgencies, router]);

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
                prev.map((agency) =>
                    agency.id === agencyId ? { ...agency, isActive: !currentStatus } : agency
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

    const activeCount = agencies.filter((agency) => agency.isActive).length;
    const inactiveCount = agencies.length - activeCount;
    const stats = [
        { label: "Total agencies", value: agencies.length, icon: FiBriefcase, iconClass: "bg-teal-100 text-teal-700", bar: "from-teal-500 to-teal-600" },
        { label: "Active", value: activeCount, icon: FiCheckCircle, iconClass: "bg-green-100 text-green-700", bar: "from-green-400 to-emerald-500" },
        { label: "Inactive", value: inactiveCount, icon: FiXCircle, iconClass: "bg-red-100 text-red-700", bar: "from-red-400 to-rose-500" },
    ];

    return (
        <div className="min-h-screen bg-slate-100/70 md:flex">
            <Sidebar role={ROLES.SUPER_ADMIN} user={user} superAdminAgencies employeeTheme />

            <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 md:ml-64 md:px-8 md:pb-10 md:pt-8">
                <div className="mx-auto max-w-9xl">
                    <header className="relative isolate mb-8 overflow-hidden rounded-[2rem] bg-linear-to-br from-teal-800 via-teal-700 to-teal-600 px-6 py-7 text-white shadow-xl shadow-teal-900/10 sm:px-9 sm:py-9">
                        <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10" />
                        <div aria-hidden="true" className="absolute -right-3 -top-12 -z-10 h-56 w-56 rounded-full border border-white/10" />
                        <div aria-hidden="true" className="absolute -bottom-36 right-1/3 -z-10 h-72 w-72 rounded-full bg-teal-600/50 blur-2xl" />
                        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-50">
                                    <FiBriefcase aria-hidden="true" className="h-3.5 w-3.5" />
                                    PLATFORM DIRECTORY
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">Agencies</h1>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/90 sm:text-base">
                                    Manage registered workspaces, access, and activity across the platform.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push("/dashboard/super-admin/agencies/create")}
                                className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-teal-800 shadow-lg shadow-teal-950/10 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-xl active:translate-y-0 sm:w-auto"
                            >
                                <FiPlus aria-hidden="true" className="h-4 w-4" /> New Agency
                            </button>
                        </div>
                        <div className="relative mt-7 flex items-center gap-2 border-t border-white/15 pt-5 text-sm text-teal-50/90">
                            <span className="h-2 w-2 rounded-full bg-white" />
                            <span>Platform administration</span>
                            <FiArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 text-teal-50" />
                        </div>
                    </header>

                    {message.text && (
                        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                            {message.text}
                        </div>
                    )}

                    <section aria-label="Agency totals" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.label} className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.025] transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/[0.06] sm:p-6">
                                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.bar}`} />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
                                        </div>
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.iconClass} transition-transform group-hover:rotate-[-5deg]`}>
                                            <Icon aria-hidden="true" className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs text-slate-400">Current platform count</p>
                                </div>
                            );
                        })}
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-5 sm:px-6">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-teal-500" />
                                <h2 className="text-lg font-semibold tracking-tight text-slate-900">Agency directory</h2>
                            </div>
                            <p className="text-sm text-slate-500">Workspace details, team size, and access status.</p>
                        </div>

                        {agencies.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><FiBriefcase aria-hidden="true" className="h-6 w-6" /></div>
                                <p className="mt-4 text-sm font-semibold text-slate-800">No agencies yet</p>
                                <p className="mt-1 text-sm text-slate-500">Create the first agency to start organizing platform workspaces.</p>
                            </div>
                        ) : (
                            <>
                                <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(130px,1fr)_90px_90px_100px_210px] items-center gap-4 bg-slate-50/80 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 xl:grid">
                                    <span>Agency</span><span>Domain</span><span>Users</span><span>Tasks</span><span>Status</span><span className="text-right">Actions</span>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {agencies.map((agency) => (
                                        <article key={agency.id} className="grid gap-4 px-5 py-5 transition-colors hover:bg-teal-50/40 sm:px-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(130px,1fr)_90px_90px_100px_210px] xl:items-center xl:gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-sm font-bold text-teal-800 ring-1 ring-inset ring-teal-200/70">
                                                    {agency.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{agency.name}</p>
                                                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{agency.description || "No description provided"}</p>
                                                </div>
                                            </div>
                                            <div className="flex min-w-0 items-center justify-between gap-3 text-sm text-slate-600 xl:block">
                                                <span className="text-xs text-slate-400 xl:hidden">Domain</span>
                                                <span className="truncate">{agency.domain || "—"}</span>
                                            </div>
                                            <div className="flex items-center justify-between xl:block">
                                                <span className="text-xs text-slate-400 xl:hidden">Users</span>
                                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700"><FiUsers aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />{agency._count?.users ?? 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between xl:block">
                                                <span className="text-xs text-slate-400 xl:hidden">Tasks</span>
                                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700"><FiClipboard aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />{agency._count?.tasks ?? 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between xl:block">
                                                <span className="text-xs text-slate-400 xl:hidden">Status</span>
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${agency.isActive ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200" : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${agency.isActive ? "bg-green-500" : "bg-red-500"}`} />
                                                    {agency.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3 xl:justify-end xl:border-0 xl:pt-0">
                                                <button onClick={() => router.push(`/dashboard/super-admin/agencies/${agency.id}/assign-admin`)} className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 transition hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-200">
                                                    Assign Admin
                                                </button>
                                                <button disabled={togglingId === agency.id} onClick={() => handleToggleStatus(agency.id, agency.isActive)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 ${agency.isActive ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-100" : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-100"}`}>
                                                    {togglingId === agency.id ? "Updating..." : agency.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs text-slate-500 sm:px-6">
                            <span>{agencies.length} {agencies.length === 1 ? "agency" : "agencies"}</span>
                            <span className="inline-flex items-center gap-1.5"><FiBriefcase aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" /> Platform directory</span>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
