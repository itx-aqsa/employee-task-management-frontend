"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function EmployeeDashboard() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                // Verify authentication and get profile
                const profileResponse = await fetch(
                    "http://localhost:5000/users/profile",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const profileData = await profileResponse.json();

                if (!profileResponse.ok) {
                    router.push("/login");
                    return;
                }

                if (profileData.data.role !== "EMPLOYEE") {
                    router.push("/login");
                    return;
                }

                setUser(profileData.data);
                setIsAuthChecked(true);

                // Fetch employee's tasks
                const tasksResponse = await fetch(
                    "http://localhost:5000/tasks/my-tasks",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                const tasksData = await tasksResponse.json();

                if (!tasksResponse.ok) {
                    setMessage({
                        text: tasksData.message,
                        type: "error",
                    });
                    return;
                }

                setTasks(tasksData.data);
            } catch (error) {
                console.log(error);
                setMessage({
                    text: "Something went wrong.",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await fetch(
                `http://localhost:5000/tasks/${taskId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage({
                    text: data.message,
                    type: "error",
                });
                return;
            }

            setTasks((previousTasks) =>
                previousTasks.map((task) =>
                    task.id === taskId
                        ? { ...task, status: newStatus }
                        : task
                )
            );

            setMessage({
                text: "Task status updated successfully.",
                type: "success",
            });

            setTimeout(() => {
                setMessage({ text: "", type: "" });
            }, 2500);
        } catch (error) {
            console.log(error);

            setMessage({
                text: "Something went wrong.",
                type: "error",
            });
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

    const taskCounts = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "PENDING").length,
        inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
        completed: tasks.filter((t) => t.status === "COMPLETED").length,
    };

    if (!isAuthChecked) return null;

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
                                Employee Portal
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium text-sm">
                        <span>🏠</span> Dashboard
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    {user && (
                        <div className="flex items-center gap-3 mb-3 px-1">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>

                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-slate-800 truncate">
                                    {user.name}
                                </p>

                                <p className="text-xs text-slate-400 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}

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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        My Dashboard
                    </h1>

                    <p className="text-slate-500 mt-1">
                        {user
                            ? `Welcome back, ${user.name}`
                            : "Loading..."}
                    </p>
                </div>

                {/* Task stat cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Total Tasks",
                            value: taskCounts.total,
                            color: "bg-indigo-50 text-indigo-600",
                            icon: "📋",
                        },
                        {
                            label: "Pending",
                            value: taskCounts.pending,
                            color: "bg-amber-50 text-amber-600",
                            icon: "⏳",
                        },
                        {
                            label: "In Progress",
                            value: taskCounts.inProgress,
                            color: "bg-blue-50 text-blue-600",
                            icon: "🔄",
                        },
                        {
                            label: "Completed",
                            value: taskCounts.completed,
                            color: "bg-green-50 text-green-600",
                            icon: "✅",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-3"
                        >
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}
                            >
                                {s.icon}
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    {s.label}
                                </p>

                                <p className="text-2xl font-bold text-slate-900">
                                    {s.value}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feedback */}
                {message.text && (
                    <div
                        className={`text-sm rounded-xl px-4 py-3 border mb-6 ${
                            message.type === "success"
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-red-50 border-red-200 text-red-700"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Tasks table */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-900">
                                My Tasks
                            </h2>

                            <p className="text-sm text-slate-500 mt-0.5">
                                Tasks assigned to you
                            </p>
                        </div>

                        {loading ? (
                            <div className="p-10 text-center text-slate-400">
                                <p className="text-2xl mb-2">⏳</p>
                                <p>Loading your tasks...</p>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <p className="text-2xl mb-2">📭</p>
                                <p>No tasks assigned yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50">
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                Title
                                            </th>

                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                Priority
                                            </th>

                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr
                                                key={task.id}
                                                className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-slate-800">
                                                        {task.title}
                                                    </p>

                                                    {task.description && (
                                                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                                                            {task.description}
                                                        </p>
                                                    )}
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
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                task.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer ${
                                                            statusBadge[
                                                                task.status
                                                            ] ||
                                                            "bg-slate-100 text-slate-600"
                                                        }`}
                                                    >
                                                        <option value="PENDING">
                                                            Pending
                                                        </option>

                                                        <option value="IN_PROGRESS">
                                                            In Progress
                                                        </option>

                                                        <option value="COMPLETED">
                                                            Completed
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Profile card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-fit">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">
                            My Profile
                        </h2>

                        {user && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
                                        {user.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <p className="text-xs text-slate-400 mb-0.5">
                                            Full Name
                                        </p>

                                        <p className="text-sm font-medium text-slate-800">
                                            {user.name}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <p className="text-xs text-slate-400 mb-0.5">
                                            Email
                                        </p>

                                        <p className="text-sm font-medium text-slate-800">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <p className="text-xs text-slate-400 mb-0.5">
                                            Role
                                        </p>

                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}