"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../../lib/api";
import { requireRole } from "../../../../lib/auth";

export default function CreateTask() {
    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        userId: "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
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
        };

        init();
    }, [router]);

    const fetchEmployees = async (agencyId) => {
        try {
            const { response, data } = await apiFetch(
                "/users/employees",
                "GET",
                null,
                agencyId
            );

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                setMessage({ text: data.message || "Failed to load employees.", type: "error" });
                return;
            }

            setEmployees(data.data || []);
        } catch {
            setMessage({ text: "Something went wrong.", type: "error" });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const agencyId = user?.agencyId ?? null;

            if (!agencyId) {
                setMessage({ text: "Unable to determine your agency. Please re-login.", type: "error" });
                return;
            }

            const body = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                userId: formData.userId, // UUID string — must NOT be cast to Number
                agencyId,
            };

            console.log("[CreateTask] submitting body:", body);

            const { response, data } = await apiFetch("/tasks", "POST", body, agencyId);

            console.log("[CreateTask] response status:", response.status, "body:", data);

            if (!response.ok) {
                if (response.status === 401) {
                    router.push("/login");
                    return;
                }
                // Surface whatever the backend actually returned
                const errText =
                    data?.message ||
                    data?.error ||
                    data?.detail ||
                    (Array.isArray(data?.errors)
                        ? data.errors.map((e) => e.message ?? e).join(", ")
                        : null) ||
                    `Request failed with status ${response.status}`;
                setMessage({ text: errText, type: "error" });
                return;
            }

            setMessage({ text: "Task created successfully!", type: "success" });
            setFormData({ title: "", description: "", priority: "MEDIUM", userId: "" });
        } catch (err) {
            console.error("[CreateTask] unexpected error:", err);
            setMessage({ text: err?.message || "Something went wrong.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthChecked) return null;

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
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Create Task</h1>
                    <p className="text-slate-500 mt-1">Assign a new task to an employee</p>
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
                                placeholder="Enter task title"
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
                                placeholder="Enter task description"
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
                                disabled={loading}
                                className="rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating..." : "Create Task"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard/admin")}
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
