"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../../../lib/api";
import { requireRole } from "../../../../../lib/auth";

export default function EditTaskPage() {
    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        userId: "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const params = useParams();
    const router = useRouter();
    const taskId = params.id;

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.ADMIN]);
            if (!profile) return;

            setUser(profile);
            const agencyId = profile.agencyId ?? null;

            try {
                const [employeeRes, taskRes] = await Promise.all([
                    apiFetch("/users/employees", "GET", null, agencyId),
                    apiFetch(`/tasks/${taskId}`, "GET", null, agencyId),
                ]);

                if (!employeeRes.response.ok) {
                    if (employeeRes.response.status === 401) {
                        router.push("/login");
                        return;
                    }
                    setMessage({ text: employeeRes.data.message || "Failed to load employees.", type: "error" });
                    return;
                }

                setEmployees(employeeRes.data.data || []);

                if (!taskRes.response.ok) {
                    if (taskRes.response.status === 401) {
                        router.push("/login");
                        return;
                    }
                    setMessage({ text: taskRes.data.message || "Failed to load task.", type: "error" });
                    return;
                }

                const task = taskRes.data.data;
                setFormData({
                    title: task.title,
                    description: task.description || "",
                    priority: task.priority,
                    userId: String(task.userId),
                });
            } catch {
                setMessage({ text: "Something went wrong.", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [taskId, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: "", type: "" });

        try {
            const agencyId = user?.agencyId ?? null;
            const { response, data } = await apiFetch(
                `/tasks/${taskId}`,
                "PUT",
                {
                    title: formData.title,
                    description: formData.description,
                    priority: formData.priority,
                    userId: formData.userId, // UUID string — must NOT be cast to Number
                },
                agencyId
            );

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                setMessage({ text: data.message || "Failed to update task.", type: "error" });
                return;
            }

            setMessage({ text: "Task updated successfully!", type: "success" });
            setTimeout(() => router.push("/dashboard/admin/tasks"), 1000);
        } catch {
            setMessage({ text: "Something went wrong.", type: "error" });
        } finally {
            setSaving(false);
        }
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
        <div className="min-h-screen bg-slate-100/80 md:flex">
            <Sidebar role={ROLES.ADMIN} user={user} adminDashboard />

            <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 md:ml-64 md:px-8 md:pb-10 md:pt-8">
                <div className="mx-auto max-w-7xl">
                <div className="mb-8 border-b border-slate-200 pb-6">
                    <button
                        onClick={() => router.back()}
                        className="mb-4 flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-teal-700"
                    >
                        ← Back
                    </button>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Edit Task</h1>
                    <p className="text-slate-500 mt-1">Update task details</p>
                </div>

                <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/5 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Task Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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
                                rows="4"
                                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
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
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                            >
                                <option value="">Select an employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
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
                                disabled={saving}
                                className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/admin/tasks")}
                                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </main>
        </div>
    );
}
