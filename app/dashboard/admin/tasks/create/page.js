"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateTask() {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        userId: "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getEmployees = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/users/employees",
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

                    setMessage({
                        text: data.message,
                        type: "error",
                    });
                    return;
                }

                setEmployees(data.data);
            } catch (error) {
                console.log(error);

                setMessage({
                    text: "Something went wrong.",
                    type: "error",
                });
            }
        };

        getEmployees();
    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const response = await fetch(
                "http://localhost:5000/tasks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }

                setMessage({
                    text: data.message,
                    type: "error",
                });
                return;
            }

            setMessage({
                text: "Task created successfully!",
                type: "success",
            });

            setFormData({
                title: "",
                description: "",
                priority: "MEDIUM",
                userId: "",
            });
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
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
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
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium text-sm"
                    >
                        <span>✏️</span> Create Task
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={async () => {
                            try {
                                await fetch(
                                    "http://localhost:5000/users/logout",
                                    {
                                        method: "POST",
                                        credentials: "include",
                                    }
                                );
                            } catch (error) {
                                console.log(error);
                            }

                            router.push("/login");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4"
                    >
                        ← Back
                    </button>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Create Task
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Assign a new task to an employee
                    </p>
                </div>

                <div className="max-w-xl bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Task Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                                required
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter task description"
                                rows="4"
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Priority
                            </label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full text-slate-900 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Assign To
                            </label>

                            <select
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                                className="w-full text-slate-900 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            >
                                <option value="">
                                    Select an employee
                                </option>

                                {employees.map((emp) => (
                                    <option
                                        key={emp.id}
                                        value={emp.id}
                                    >
                                        {emp.name} — {emp.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {message.text && (
                            <div
                                className={`text-sm rounded-xl px-4 py-3 border ${
                                    message.type === "success"
                                        ? "bg-green-50 border-green-200 text-green-700"
                                        : "bg-red-50 border-red-200 text-red-700"
                                }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Task"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push("/dashboard/admin")
                                }
                                className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}