"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KanbanBoard from "../../../../components/KanbanBoard";

export default function AdminKanbanPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                const profileRes = await fetch(
                    "http://localhost:5000/users/profile",
                    { credentials: "include" }
                );
                const profileData = await profileRes.json();

                if (!profileRes.ok || profileData.data.role !== "ADMIN") {
                    router.push("/login");
                    return;
                }

                const tasksRes = await fetch("http://localhost:5000/tasks", {
                    credentials: "include",
                });
                const tasksData = await tasksRes.json();
                if (!tasksRes.ok) {
                    setMessage(tasksData.message);
                    return;
                }
                setTasks(tasksData.data);
            } catch (error) {
                console.log(error);
                setMessage("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Tasks Kanban Board
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Overview of all tasks by status
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() =>
                                router.push("/dashboard/admin/tasks/create")
                            }
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                        >
                            + Create Task
                        </button>
                        <button
                            onClick={() =>
                                router.push("/dashboard/admin/tasks")
                            }
                            className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            List View
                        </button>
                        <button
                            onClick={() =>
                                router.push("/dashboard/admin")
                            }
                            className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors"
                        >
                            Dashboard
                        </button>
                    </div>
                </div>

                {message && (
                    <p className="text-red-500 mb-4">{message}</p>
                )}

                {/* Board */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        Loading tasks...
                    </div>
                ) : (
                    <KanbanBoard
                        tasks={tasks}
                        showAssignee={true}
                    />
                )}
            </div>
        </div>
    );
}
