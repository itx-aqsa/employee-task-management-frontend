"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const getTasks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/tasks",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push("/login");
                        return;
                    }

                    setMessage(data.message);
                    return;
                }

                setTasks(data.data);
            } catch (error) {
                console.log(error);
                setMessage("Something went wrong");
            }
        };

        getTasks();
    }, [router]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/tasks/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }

                setMessage(data.message);
                return;
            }

            setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
            console.log(error);
            setMessage("Something went wrong");
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/users/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.log(error);
        }

        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">
                                TM
                            </span>
                        </div>

                        <div>
                            <p className="font-semibold text-slate-800 text-sm">
                                TaskManager
                            </p>
                            <p className="text-xs text-slate-400">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/dashboard/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                    >
                        <span>🏠</span> Dashboard
                    </Link>

                    <Link
                        href="/dashboard/admin/tasks"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium text-sm"
                    >
                        <span>📋</span> Tasks
                    </Link>

                    <Link
                        href="/dashboard/admin/employee/create"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                    >
                        <span>➕</span> Add Employee
                    </Link>

                    <Link
                        href="/dashboard/admin/tasks/create"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                    >
                        <span>✏️</span> Create Task
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 ml-64 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Tasks
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Manage all employee tasks
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() =>
                                router.push(
                                    "/dashboard/admin/tasks/kanban"
                                )
                            }
                            className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700"
                        >
                            Kanban View
                        </button>

                        <button
                            onClick={() =>
                                router.push(
                                    "/dashboard/admin/tasks/create"
                                )
                            }
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
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
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Task
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Assigned To
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Priority
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
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-16 text-slate-400"
                                        >
                                            <p className="text-3xl mb-2">
                                                📋
                                            </p>

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
                                                <p className="font-medium text-slate-800">
                                                    {task.title}
                                                </p>

                                                {task.description && (
                                                    <p className="text-sm text-slate-400 mt-0.5 truncate max-w-xs">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">
                                                        {task.user?.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">
                                                            {task.user?.name}
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            {task.user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                        priorityBadge[
                                                            task.priority
                                                        ] ||
                                                        "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {task.priority}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                        statusBadge[
                                                            task.status
                                                        ] ||
                                                        "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {statusLabel[
                                                        task.status
                                                    ] || task.status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/dashboard/admin/tasks/edit/${task.id}`
                                                            )
                                                        }
                                                        className="text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-indigo-100 transition-colors"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                task.id
                                                            )
                                                        }
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