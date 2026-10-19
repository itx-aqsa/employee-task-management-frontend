"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                setMessage(data.message || "Failed to load tasks.");
                return;
            }

            setTasks(data.data || []);
        } catch {
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
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={ROLES.ADMIN} user={user} />

            <main className="flex-1 ml-64 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
                        <p className="text-slate-500 mt-1">Manage all employee tasks</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push("/dashboard/admin/tasks/kanban")}
                            className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                        >
                            Kanban View
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/admin/tasks/create")}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
                        >
                            + Create Task
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
                        {message}
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Task</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Assigned To</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
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
                                            className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
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
                                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">
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
                                                        className="text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-indigo-100 transition-colors"
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
            </main>
        </div>
    );
}
