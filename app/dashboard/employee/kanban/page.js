"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiArrowUpRight, FiColumns, FiLayers, FiRefreshCw } from "react-icons/fi";
import KanbanBoard from "../../../components/KanbanBoard";
import Sidebar from "../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../lib/api";
import { requireRole } from "../../../lib/auth";

export default function EmployeeKanbanPage() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
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
                    setMessage(data.message || "Failed to load tasks.");
                    return;
                }
                setTasks(data.data || []);
            } catch {
                setMessage("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    const handleStatusChange = async (taskId, newStatus) => {
        const oldTask = tasks.find((t) => t.id === taskId);
        if (!oldTask) return;

        const oldStatus = oldTask.status;

        setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );

        try {
            const { response, data } = await apiFetch(
                `/tasks/${taskId}/status`,
                "PUT",
                { status: newStatus }
            );

            if (!response.ok) {
                setMessage(data.message || "Failed to update task status.");
                setTasks((prev) =>
                    prev.map((t) => (t.id === taskId ? { ...t, status: oldStatus } : t))
                );
                return;
            }

            setMessage("");
        } catch {
            setMessage("Failed to update task status.");
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, status: oldStatus } : t))
            );
        }
    };

    if (!isAuthChecked) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={ROLES.EMPLOYEE} user={user} />

            <main className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-6 sm:pt-8 md:ml-64 md:px-8 md:pb-8">
                <section className="relative isolate mb-7 overflow-hidden rounded-[2rem] bg-linear-to-br from-teal-800 via-teal-700 to-teal-600 px-6 py-7 text-white shadow-xl shadow-teal-900/10 sm:px-9 sm:py-9 lg:px-11">
                    <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10" />
                    <div aria-hidden="true" className="absolute -right-3 -top-12 -z-10 h-56 w-56 rounded-full border border-white/10" />
                    <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-50">
                                <FiColumns aria-hidden="true" className="h-3.5 w-3.5" />
                                Task flow
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Kanban Board</h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/90 sm:text-base">
                                Drag a task between columns to update its status and keep your work moving.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard/employee")}
                            className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-teal-800 shadow-lg shadow-teal-950/10 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-50 active:translate-y-0 sm:w-auto"
                        >
                            <FiLayers aria-hidden="true" className="h-4 w-4" />
                            List view
                            <FiArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </div>
                    {!loading && (
                        <div className="relative mt-7 flex items-center gap-2 border-t border-white/15 pt-4 text-xs font-medium text-teal-50/90">
                            <FiLayers aria-hidden="true" className="h-4 w-4" />
                            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} across your board
                        </div>
                    )}
                </section>

                {message && (
                    <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800 shadow-sm">
                        <FiAlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{message}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white text-center text-slate-500 shadow-sm">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                            <FiRefreshCw aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" />
                        </span>
                        <div>
                            <p className="font-semibold text-slate-700">Loading your board</p>
                            <p className="mt-1 text-sm">Your tasks will be ready in a moment.</p>
                        </div>
                    </div>
                ) : (
                    <KanbanBoard
                        tasks={tasks}
                        onStatusChange={handleStatusChange}
                        showAssignee={false}
                        variant="employee"
                    />
                )}
            </main>
        </div>
    );
}
