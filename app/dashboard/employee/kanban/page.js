"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Kanban Board</h1>
                        <p className="text-slate-500 mt-1">
                            Drag cards to update their status
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/dashboard/employee")}
                        className="bg-slate-200 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-300 text-sm font-medium transition-colors"
                    >
                        List View
                    </button>
                </div>

                {message && (
                    <p className="text-sm text-red-500 mb-4">{message}</p>
                )}

                {loading ? (
                    <div className="text-center py-20 text-slate-400">
                        Loading tasks...
                    </div>
                ) : (
                    <KanbanBoard
                        tasks={tasks}
                        onStatusChange={handleStatusChange}
                        showAssignee={false}
                    />
                )}
            </main>
        </div>
    );
}
