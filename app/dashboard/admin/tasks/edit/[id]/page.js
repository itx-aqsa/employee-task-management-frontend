"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditTaskPage() {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({ title: "", description: "", priority: "MEDIUM", userId: "" });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const params = useParams();
    const router = useRouter();
    const taskId = params.id;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        const getData = async () => {
            try {
                const [empRes, taskRes] = await Promise.all([
                    fetch("http://localhost:5000/users/employees", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`http://localhost:5000/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                const empData = await empRes.json();
                const taskData = await taskRes.json();

                if (empRes.ok) setEmployees(empData.data);
                if (taskRes.ok) {
                    const task = taskData.data;
                    setFormData({ title: task.title, description: task.description || "", priority: task.priority, userId: String(task.userId) });
                } else {
                    setMessage({ text: taskData.message, type: "error" });
                }
            } catch { setMessage({ text: "Something went wrong.", type: "error" }); }
            finally { setLoading(false); }
        };
        getData();
    }, [taskId, router]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: "", type: "" });
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...formData, userId: Number(formData.userId) }),
            });
            const data = await response.json();
            if (!response.ok) { setMessage({ text: data.message, type: "error" }); return; }
            setMessage({ text: "Task updated successfully!", type: "success" });
            setTimeout(() => router.push("/dashboard/admin/tasks"), 1000);
        } catch { setMessage({ text: "Something went wrong.", type: "error" }); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center text-slate-400">
                    <p className="text-3xl mb-2">⏳</p>
                    <p>Loading task data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">TM</span>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">TaskManager</p>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/dashboard/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                        <span>🏠</span> Dashboard
                    </Link>
                    <Link href="/dashboard/admin/tasks" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium text-sm">
                        <span>📋</span> Tasks
                    </Link>
                    <Link href="/dashboard/admin/employee/create" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                        <span>➕</span> Add Employee
                    </Link>
                    <Link href="/dashboard/admin/tasks/create" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                        <span>✏️</span> Create Task
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/login"); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-8">
                <div className="mb-8">
                    <button onClick={() => router.back()} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4">
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Task</h1>
                    <p className="text-slate-500 mt-1">Update task information</p>
                </div>

                <div className="max-w-xl bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title</label>
                            <input
                                type="text" name="title" value={formData.title} onChange={handleChange}
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                            <textarea
                                name="description" value={formData.description} onChange={handleChange}
                                rows="4"
                                className="w-full text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                            <select
                                name="priority" value={formData.priority} onChange={handleChange}
                                className="w-full text-slate-900 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign To</label>
                            <select
                                name="userId" value={formData.userId} onChange={handleChange}
                                className="w-full text-slate-900 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            >
                                <option value="">Select an employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.name} — {emp.email}</option>
                                ))}
                            </select>
                        </div>

                        {message.text && (
                            <div className={`text-sm rounded-xl px-4 py-3 border ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit" disabled={saving}
                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button" onClick={() => router.push("/dashboard/admin/tasks")}
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
