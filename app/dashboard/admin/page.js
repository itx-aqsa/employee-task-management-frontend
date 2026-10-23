"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FiArrowUpRight,
    FiClipboard,
    FiEdit2,
    FiMoreHorizontal,
    FiPlus,
    FiSearch,
    FiShield,
    FiUsers,
} from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import { apiFetch, ROLES } from "../../lib/api";
import { requireRole } from "../../lib/auth";

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalTasks: 0,
        pendingTasks: 0,
    });
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.ADMIN]);
            if (!profile) return;

            setUser(profile);
            setIsAuthChecked(true);

            const agencyId = profile.agencyId ?? null;
            fetchEmployees(agencyId);
            fetchDashboardStats(agencyId);
        };

        init();
    }, [router]);

    async function fetchEmployees(agencyId) {
        try {
            const { response, data } = await apiFetch(
                "/users/employees",
                "GET",
                null,
                agencyId
            );
            console.log("[fetchEmployees] status:", response.status, "| raw response:", data, "| resolved array:", data.data);
            if (response.ok) {
                setEmployees(data.data || []);
            } else {
                console.warn("[fetchEmployees] non-OK response:", response.status, data);
            }
        } catch (error) {
            console.error("[fetchEmployees] network/parse error:", error);
        }
    }

    async function fetchDashboardStats(agencyId) {
        try {
            const { response, data } = await apiFetch(
                "/users/dashboard-stats",
                "GET",
                null,
                agencyId
            );
            console.log("[fetchDashboardStats] status:", response.status, "| raw response:", data);
            if (response.ok && data.data) {
                setStats(data.data);
            } else if (!response.ok) {
                console.warn("[fetchDashboardStats] non-OK response:", response.status, data);
            }
        } catch (error) {
            console.error("[fetchDashboardStats] network/parse error:", error);
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        try {
            const agencyId = user?.agencyId ?? null;
            const { response, data } = await apiFetch(
                `/users/${id}`,
                "DELETE",
                null,
                agencyId
            );

            if (!response.ok) {
                alert(data.message || "Failed to delete employee.");
                return;
            }

            alert("Employee deleted successfully.");
            fetchEmployees(agencyId);
        } catch {
            alert("Something went wrong.");
        }
    };

    if (!isAuthChecked) return null;

    const metrics = [
        {
            label: "Total Employees",
            value: stats.totalEmployees,
            detail: "People in your agency",
            icon: FiUsers,
            iconColor: "text-teal-700",
            iconBg: "bg-teal-100",
            accent: "from-teal-500 to-teal-600",
        },
        {
            label: "Total Tasks",
            value: stats.totalTasks,
            detail: "Across your team",
            icon: FiClipboard,
            iconColor: "text-teal-700",
            iconBg: "bg-teal-100",
            accent: "from-teal-500 to-teal-600",
        },
        {
            label: "Pending Tasks",
            value: stats.pendingTasks,
            detail: "Still in progress",
            icon: FiShield,
            iconColor: "text-amber-700",
            iconBg: "bg-amber-100",
            accent: "from-amber-400 to-amber-500",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-100/70 md:flex">
            <Sidebar role={ROLES.ADMIN} user={user} adminDashboard employeeTheme />

            <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 md:ml-64 md:px-8 md:pb-10 md:pt-8 xl:px-10">
                <div className="mx-auto max-w-7xl">
                    <header className="relative isolate mb-8 overflow-hidden rounded-[2rem] bg-linear-to-br from-teal-800 via-teal-700 to-teal-600 px-6 py-7 text-white shadow-xl shadow-teal-900/10 sm:px-9 sm:py-9">
                        <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10" />
                        <div aria-hidden="true" className="absolute -right-3 -top-12 -z-10 h-56 w-56 rounded-full border border-white/10" />
                        <div aria-hidden="true" className="absolute -bottom-36 right-1/3 -z-10 h-72 w-72 rounded-full bg-teal-600/50 blur-2xl" />
                        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                            <div className="max-w-2xl">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-50">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                    ADMIN WORKSPACE
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">
                                    Good to see you, {user?.name?.split(" ")[0] || "Admin"}.
                                </h1>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/90 sm:text-base">
                                    {user?.agencyName
                                        ? `A clear view of people and work across ${user.agencyName}.`
                                        : "A clear view of your people, priorities, and work in progress."}
                                </p>
                            </div>
                            <button
                                onClick={() => router.push("/dashboard/admin/tasks/create")}
                                className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-teal-800 shadow-lg shadow-teal-950/10 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-xl active:translate-y-0 sm:w-auto"
                            >
                                <FiPlus aria-hidden="true" className="h-4 w-4" />
                                Create Task
                            </button>
                        </div>
                        <div className="relative mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 sm:flex sm:items-center sm:gap-8">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-teal-50/80">Workspace</p>
                                <p className="mt-1 text-sm font-medium text-white">{user?.agencyName || "Agency overview"}</p>
                            </div>
                            <div className="hidden h-9 w-px bg-white/10 sm:block" />
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-teal-50/80">Your role</p>
                                <p className="mt-1 text-sm font-medium text-white">Agency administrator</p>
                            </div>
                        </div>
                    </header>

                    <section aria-label="Agency statistics" className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {metrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                                <div key={metric.label} className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.025] transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/[0.06] sm:p-6">
                                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${metric.accent}`} />
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                                            <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">{metric.value}</p>
                                            <p className="mt-2 text-xs text-slate-400">{metric.detail}</p>
                                        </div>
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${metric.iconBg} ${metric.iconColor} transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-105`}>
                                            <Icon aria-hidden="true" className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                        <span className={`h-1.5 w-1.5 rounded-full ${index < 2 ? "bg-teal-500" : "bg-amber-400"}`} />
                                        Live agency total
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    <section className="mb-8">
                        <div className="mb-4 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Workspace tools</p>
                                <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Take the next step</h2>
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <button onClick={() => router.push("/dashboard/admin/tasks/create")} className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-200 hover:bg-teal-50 hover:shadow-md hover:shadow-teal-900/5">
                                <span className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white"><FiPlus aria-hidden="true" className="h-5 w-5" /></span>
                                    <span><span className="block text-sm font-semibold text-slate-900">Create a task</span><span className="mt-0.5 block text-xs text-slate-500">Add work for your team</span></span>
                                </span>
                                <FiArrowUpRight aria-hidden="true" className="h-4 w-4 text-teal-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </button>
                            <button onClick={() => router.push("/dashboard/admin/tasks")} className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-200 hover:bg-teal-50 hover:shadow-md hover:shadow-teal-900/5">
                                <span className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white"><FiClipboard aria-hidden="true" className="h-5 w-5" /></span>
                                    <span><span className="block text-sm font-semibold text-slate-900">View tasks</span><span className="mt-0.5 block text-xs text-slate-500">Review assignments and progress</span></span>
                                </span>
                                <FiArrowUpRight aria-hidden="true" className="h-4 w-4 text-teal-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </button>
                            <button onClick={() => router.push("/dashboard/admin/tasks/kanban")} className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-200 hover:bg-teal-50 hover:shadow-md hover:shadow-teal-900/5 sm:col-span-2 xl:col-span-1">
                                <span className="flex items-center gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white"><FiMoreHorizontal aria-hidden="true" className="h-5 w-5" /></span>
                                    <span><span className="block text-sm font-semibold text-slate-900">Kanban board</span><span className="mt-0.5 block text-xs text-slate-500">See work by status</span></span>
                                </span>
                                <FiArrowUpRight aria-hidden="true" className="h-4 w-4 text-teal-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-teal-500" />
                                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">People in your agency</h2>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">Manage employee access and see their assigned workload.</p>
                            </div>
                            <button onClick={() => router.push("/dashboard/admin/employee/create")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">
                                <FiPlus aria-hidden="true" className="h-4 w-4" /> Add Employee
                            </button>
                        </div>

                        {employees.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><FiUsers aria-hidden="true" className="h-6 w-6" /></div>
                                <p className="mt-4 text-sm font-semibold text-slate-800">No employees found</p>
                                <p className="mt-1 text-sm text-slate-500">Add a team member to get your agency workspace started.</p>
                            </div>
                        ) : (
                            <>
                                <div className="hidden grid-cols-[minmax(0,1fr)_120px_176px] items-center gap-4 bg-slate-50/80 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:grid">
                                    <span>Employee</span><span>Workload</span><span className="text-right">Actions</span>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {employees.map((employee) => (
                                        <div key={employee.id} className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-teal-50/40 sm:grid sm:grid-cols-[minmax(0,1fr)_120px_176px] sm:items-center sm:gap-4 sm:px-6">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-sm font-bold text-teal-800 ring-1 ring-inset ring-teal-200/70">
                                                    {employee.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{employee.name}</p>
                                                    <p className="truncate text-xs text-slate-500">{employee.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:block">
                                                <span className="text-xs text-slate-400 sm:hidden">Assigned workload</span>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                    <FiClipboard aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" />
                                                    {employee._count?.tasks ?? 0} {employee._count?.tasks === 1 ? "task" : "tasks"}
                                                </span>
                                            </div>
                                            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                                                <button onClick={() => router.push(`/dashboard/admin/employee/edit/${employee.id}`)} className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 py-2 text-xs font-semibold text-teal-800 transition hover:border-teal-300 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-200">
                                                    <FiEdit2 aria-hidden="true" className="h-3.5 w-3.5" /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(employee.id)} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs text-slate-500 sm:px-6">
                            <span>{employees.length} {employees.length === 1 ? "employee" : "employees"}</span>
                            <span className="inline-flex items-center gap-1.5"><FiSearch aria-hidden="true" className="h-3.5 w-3.5 text-teal-700" /> Agency directory</span>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
