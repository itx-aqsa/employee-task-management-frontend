"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FiActivity,
    FiAlertCircle,
    FiArrowUpRight,
    FiCheckCircle,
    FiClock,
    FiInbox,
    FiLayers,
    FiMail,
    FiRefreshCw,
    FiShield,
    FiUser,
} from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import { apiFetch, ROLES } from "../../lib/api";
import { requireRole } from "../../lib/auth";

const priorityBadge = {
    HIGH: "bg-red-50 text-red-700 ring-red-200",
    MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
    LOW: "bg-green-50 text-green-700 ring-green-200",
};

const priorityIcon = {
    HIGH: FiAlertCircle,
    MEDIUM: FiActivity,
    LOW: FiCheckCircle,
};

const statusBadge = {
    PENDING: "bg-slate-100 text-slate-600",
    IN_PROGRESS: "bg-blue-50 text-blue-700",
    COMPLETED: "bg-green-50 text-green-700",
};

const statusRail = {
    PENDING: "border-l-slate-300",
    IN_PROGRESS: "border-l-blue-400",
    COMPLETED: "border-l-green-400",
};

const statusIcon = {
    PENDING: FiClock,
    IN_PROGRESS: FiRefreshCw,
    COMPLETED: FiCheckCircle,
};

export default function EmployeeDashboard() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(true);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.EMPLOYEE]);
            if (!profile) return;

            setUser(profile);
            setIsAuthChecked(true);

            try {
                const { response, data } = await apiFetch("/tasks/my-tasks");

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push("/login");
                        return;
                    }
                    setMessage({ text: data.message || "Failed to load tasks.", type: "error" });
                    return;
                }

                setTasks(data.data || []);
            } catch {
                setMessage({ text: "Something went wrong.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const { response, data } = await apiFetch(
                `/tasks/${taskId}/status`,
                "PUT",
                { status: newStatus }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                setMessage({ text: data.message || "Failed to update status.", type: "error" });
                return;
            }

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                )
            );

            setMessage({ text: "Task status updated successfully.", type: "success" });
            setTimeout(() => setMessage({ text: "", type: "" }), 2500);
        } catch {
            setMessage({ text: "Something went wrong.", type: "error" });
        }
    };

    const taskCounts = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "PENDING").length,
        inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
        completed: tasks.filter((t) => t.status === "COMPLETED").length,
    };

    const completionRate = taskCounts.total
        ? Math.round((taskCounts.completed / taskCounts.total) * 100)
        : 0;

    if (!isAuthChecked) return null;

    const statCards = [
        { label: "Total tasks", value: taskCounts.total, icon: FiLayers, tone: "teal" },
        { label: "Pending", value: taskCounts.pending, icon: FiClock, tone: "amber" },
        { label: "In progress", value: taskCounts.inProgress, icon: FiRefreshCw, tone: "blue" },
        { label: "Completed", value: taskCounts.completed, icon: FiCheckCircle, tone: "green" },
    ];

    const statTone = {
        teal: "bg-teal-50 text-teal-700 ring-teal-100",
        amber: "bg-amber-50 text-amber-700 ring-amber-100",
        blue: "bg-blue-50 text-blue-700 ring-blue-100",
        green: "bg-green-50 text-green-700 ring-green-100",
    };

    return (
        <div className="min-h-screen bg-slate-100/70">
            <Sidebar role={ROLES.EMPLOYEE} user={user} />

            <main className="min-w-0 w-full px-4 pb-24 pt-5 sm:px-6 sm:pt-8 md:ml-64 md:w-auto md:px-8 md:pb-8">
                <section className="relative isolate mb-7 overflow-hidden rounded-[2rem] bg-linear-to-br from-teal-800 via-teal-700 to-teal-600 px-6 py-7 text-white shadow-xl shadow-teal-900/10 sm:px-9 sm:py-9 lg:px-11 lg:py-10">
                    <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10" />
                    <div aria-hidden="true" className="absolute -right-3 -top-12 -z-10 h-56 w-56 rounded-full border border-white/10" />
                    <div aria-hidden="true" className="absolute -bottom-36 right-1/3 -z-10 h-72 w-72 rounded-full bg-teal-600/50 blur-2xl" />

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-50">
                                <FiActivity aria-hidden="true" className="h-3.5 w-3.5" />
                                Employee workspace
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">
                                Good to see you, {user?.name?.split(" ")[0] || "there"}.
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/90 sm:text-base">
                                Here&apos;s your work at a glance. Keep your priorities moving and your team in sync.
                            </p>
                        </div>

                        <button
                            onClick={() => router.push("/dashboard/employee/kanban")}
                            className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-teal-800 shadow-lg shadow-teal-950/10 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-50 hover:shadow-xl active:translate-y-0 sm:w-auto"
                        >
                            <FiLayers aria-hidden="true" className="h-4 w-4" />
                            Open Kanban board
                            <FiArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-medium text-teal-50/90">
                            {loading ? "Your task overview is loading" : `${taskCounts.total} ${taskCounts.total === 1 ? "task" : "tasks"} in your workspace`}
                        </p>
                        <div className="flex items-center gap-3 sm:w-64">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-teal-950/25">
                                <div
                                    className="h-full rounded-full bg-white transition-[width] duration-700 ease-out"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                            <span className="min-w-10 text-right text-xs font-semibold text-white">{completionRate}%</span>
                        </div>
                    </div>
                </section>

                <section aria-label="Task statistics" className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {statCards.map(({ label, value, icon: Icon, tone }) => (
                        <div
                            key={label}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.025] transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/[0.06] sm:p-5"
                        >
                            <div className="mb-5 flex items-start justify-between gap-2">
                                <span className="text-xs font-semibold text-slate-500 sm:text-sm">{label}</span>
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${statTone[tone]}`}>
                                    <Icon aria-hidden="true" className="h-4 w-4" />
                                </span>
                            </div>
                            <p className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{value}</p>
                            <div className={`absolute inset-x-0 bottom-0 h-1 ${tone === "teal" ? "bg-teal-500" : tone === "amber" ? "bg-amber-400" : tone === "blue" ? "bg-blue-400" : "bg-green-500"}`} />
                        </div>
                    ))}
                </section>

                {message.text && (
                    <div
                        role="status"
                        className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm shadow-sm ${
                            message.type === "success"
                                ? "border-green-200 bg-green-50 text-green-800"
                                : "border-red-200 bg-red-50 text-red-800"
                        }`}
                    >
                        {message.type === "success"
                            ? <FiCheckCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                            : <FiAlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
                    <section className="min-w-0 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.025]">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
                            <div>
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">Your queue</p>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">Assigned tasks</h2>
                                <p className="mt-1 text-sm text-slate-500">Review details and update progress as you work.</p>
                            </div>
                            {!loading && tasks.length > 0 && (
                                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 ring-1 ring-inset ring-teal-100">
                                    <FiLayers aria-hidden="true" className="h-3.5 w-3.5" />
                                    {tasks.length}
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center text-slate-500" role="status">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                                    <FiRefreshCw aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" />
                                </span>
                                <div>
                                    <p className="font-semibold text-slate-700">Loading your tasks</p>
                                    <p className="mt-1 text-sm">Your latest assignments will appear here.</p>
                                </div>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
                                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                    <FiInbox aria-hidden="true" className="h-6 w-6" />
                                </span>
                                <h3 className="font-semibold text-slate-800">No tasks assigned yet</h3>
                                <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">When a task is assigned to you, it will show up in this list.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {tasks.map((task) => {
                                    const PriorityIcon = priorityIcon[task.priority] || FiActivity;
                                    const StatusIcon = statusIcon[task.status] || FiActivity;
                                    return (
                                        <article key={task.id} className={`border-l-4 px-5 py-5 transition-colors hover:bg-slate-50/80 sm:px-7 ${statusRail[task.status] || "border-l-slate-300"}`}>
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${priorityBadge[task.priority] || "bg-slate-50 text-slate-600 ring-slate-200"}`}>
                                                            <PriorityIcon aria-hidden="true" className="h-3 w-3" />
                                                            {task.priority}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusBadge[task.status] || "bg-slate-100 text-slate-600"}`}>
                                                            <StatusIcon aria-hidden="true" className="h-3 w-3" />
                                                            {task.status?.replaceAll("_", " ")}
                                                        </span>
                                                    </div>
                                                    <h3 className="break-words text-base font-semibold text-slate-900">{task.title}</h3>
                                                    {task.description && (
                                                        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">{task.description}</p>
                                                    )}
                                                </div>
                                                <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-500">
                                                    <span className="sm:hidden">Update status</span>
                                                    <span className="hidden sm:inline">Status</span>
                                                    <select
                                                        aria-label={`Status for ${task.title}`}
                                                        value={task.status}
                                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                        className={`cursor-pointer rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-semibold outline-none ring-1 ring-inset ring-slate-200 transition focus:ring-2 focus:ring-teal-500 ${statusBadge[task.status] || "bg-slate-100 text-slate-600"}`}
                                                    >
                                                        <option value="PENDING">Pending</option>
                                                        <option value="IN_PROGRESS">In Progress</option>
                                                        <option value="COMPLETED">Completed</option>
                                                    </select>
                                                </label>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <aside className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.025]">
                        <div className="relative overflow-hidden bg-linear-to-br from-teal-700 to-teal-600 px-6 pb-8 pt-6 text-white">
                            <div aria-hidden="true" className="absolute -right-10 -top-16 h-44 w-44 rounded-full border border-white/15" />
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-100">Your account</p>
                                    <h2 className="mt-1 text-xl font-bold tracking-tight">Profile</h2>
                                </div>
                                <FiActivity aria-hidden="true" className="h-5 w-5 text-teal-100" />
                            </div>
                            {user && (
                                <div className="relative mt-7 flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-2xl font-bold shadow-lg shadow-teal-950/10 backdrop-blur-sm">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold">{user.name}</p>
                                        <p className="mt-1 truncate text-xs text-teal-50/85">{user.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {user && (
                            <div className="space-y-3 p-5 sm:p-6">
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/70">
                                        <FiUser aria-hidden="true" className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Full name</p>
                                        <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200/70">
                                        <FiMail aria-hidden="true" className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Email address</p>
                                        <p className="mt-0.5 break-all text-sm font-semibold text-slate-800">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm ring-1 ring-slate-200/70">
                                        <FiShield aria-hidden="true" className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Role</p>
                                        <p className="mt-0.5 text-sm font-semibold text-slate-800">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
}
