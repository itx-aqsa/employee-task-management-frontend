"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KanbanBoard from "../../../../components/KanbanBoard";
import Sidebar from "../../../../components/Sidebar";
import { apiFetch, ROLES } from "../../../../lib/api";
import { requireRole } from "../../../../lib/auth";

export default function AdminKanbanPage() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
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
            try {
                const { response, data } = await apiFetch(
                    "/tasks",
                    "GET",
                    null,
                    agencyId
                );
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

    if (!isAuthChecked) return null;

    return (
        <div className="min-h-screen bg-slate-100/80 md:flex">
            <Sidebar role={ROLES.ADMIN} user={user} adminDashboard />

            <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 md:ml-64 md:px-8 md:pb-10 md:pt-8">
                <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-5 rounded-[1.75rem] bg-slate-950 px-6 py-7 text-white shadow-lg shadow-slate-900/10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">Work management</span>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Kanban Board</h1>
                        <p className="mt-1 text-sm text-slate-300">
                            Overview of all agency tasks by status
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => router.push("/dashboard/admin/tasks/create")}
                            className="rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-orange-300"
                        >
                            + Create Task
                        </button>
                        <button
                            onClick={() => router.push("/dashboard/admin/tasks")}
                            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                        >
                            List View
                        </button>
                    </div>
                </div>

                {message && (
                    <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>
                )}

                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center text-slate-400 shadow-sm">
                        Loading tasks...
                    </div>
                ) : (
                    <KanbanBoard tasks={tasks} showAssignee={true} variant="admin" />
                )}
                </div>
            </main>
        </div>
    );
}
