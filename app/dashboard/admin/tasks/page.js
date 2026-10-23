"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiColumns, FiPlus } from "react-icons/fi";
import Sidebar from "../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../lib/api";
import { requireRole } from "../../../lib/auth";

const priorityBadge = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    LOW: "bg-green-100 text-green-700",
};

const statusBadge = {
    PENDING: "bg-slate-100 text-slate-600",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
};

const statusLabel = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
};

export default function TasksPage() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState("");
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.ADMIN]);
            if (!profile) return;

            setUser(profile);
            setIsAuthChecked(true);

            const agencyId = profile.agencyId ?? null;
            fetchTasks(agencyId);
        };

        init();
    }, [router]);

    const fetchTasks = async (agencyId) => {
        try {
            const { response, data } = await apiFetch(
                "/tasks",
                "GET",
                null,
                agencyId
            );
            console.log("[fetchTasks] status:", response.status, "| raw response:", data, "| resolved array:", data.data);

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                console.warn("[fetchTasks] non-OK response:", response.status, data);
                setMessage(data.message || "Failed to load tasks.");
                return;
            }

            setTasks(data.data || []);
        } catch (error) {
            console.error("[fetchTasks] network/parse error:", error);
            setMessage("Something went wrong.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            const agencyId = user?.agencyId ?? null;
            const { response, data } = await apiFetch(
                `/tasks/${id}`,
                "DELETE",
                null,
                agencyId
            );

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                setMessage(data.message || "Failed to delete task.");
                return;
            }

            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch {
            setMessage("Something went wrong.");
        }
    };

    if (!isAuthChecked) return null;

    return (
        <div className="min-h-screen bg-slate-100/80 md:flex">
            <Sidebar role={ROLES.ADMIN} user={user} adminDashboard />

            <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 md:ml-64 md:px-8 md:pb-10 md:pt-8">
                <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-5 rounded-[1.75rem] bg-slate-950 px-6 py-7 text-white shadow-lg shadow-slate-900/10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">Work management</span>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tasks</h1>
                        <p className="mt-1 text-sm text-slate-300">Manage all employee tasks</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => router.push("/dashboard/admin/tasks/kanban")}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                        >
                            <FiColumns aria-hidden="true" className="h-4 w-4" />
                            Kanban View
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/admin/tasks/create")}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-orange-300"
                        >
                            <FiPlus aria-hidden="true" className="h-4 w-4" /> Create Task
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
                        {message}
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Task</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Assigned To</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Priority</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-16 text-slate-400">
                                            <p className="text-3xl mb-2">📋</p>
                                            <p>No tasks found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="border-b border-slate-100 transition-colors hover:bg-teal-50/40"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-800">{task.title}</p>
                                                {task.description && (
                                                    <p className="text-sm text-slate-400 mt-0.5 truncate max-w-xs">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100 text-xs font-semibold text-teal-800 ring-1 ring-inset ring-teal-200/70">
                                                        {task.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">{task.user?.name}</p>
                                                        <p className="text-xs text-slate-400">{task.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityBadge[task.priority] || "bg-slate-100 text-slate-600"}`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[task.status] || "bg-slate-100 text-slate-600"}`}>
                                                    {statusLabel[task.status] || task.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => router.push(`/dashboard/admin/tasks/edit/${task.id}`)}
                                                        className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 transition hover:bg-teal-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-red-100 transition-colors"
                                                    >
                                                        Delete
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
                </div>
            </main>
        </div>
    );
}
