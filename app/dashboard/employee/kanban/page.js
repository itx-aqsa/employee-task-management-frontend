"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KanbanBoard from "../../../components/KanbanBoard";

export default function EmployeeKanbanPage() {
    const [user, setUser] = useState(null);
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

                if (!profileRes.ok || profileData.data.role !== "EMPLOYEE") {
                    router.push("/login");
                    return;
                }
                setUser(profileData.data);

                const tasksRes = await fetch(
                    "http://localhost:5000/tasks/my-tasks",
                    { credentials: "include" }
                );
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

    const handleStatusChange = async (taskId, newStatus) => {
        const oldTask = tasks.find((task) => task.id === taskId);
        if(!oldTask) {
            return;
        }

        const oldStatus = oldTask.status;
        setTasks((prev) =>
            prev.map((task) => (
                task.id === taskId ? 
                { ...task, status: newStatus } : task)
            )
        );

        try {
            const res = await fetch(
                `http://localhost:5000/tasks/${taskId}/status`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || "Failed to update task status");
                
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === taskId ? 
                        { ...task, status: task._prevStatus || task.status } : task
                    )
                );
                return;
            }
            setMessage("");
        } catch (error) {
            console.log(error);
            setMessage("Failed to update task status");

            setTasks((prev) => 
                prev.map((task) => 
                    task.id === taskId ?
                    {...task, status: oldStatus} : task
                )
            )
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
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between bg-white rounded-xl shadow p-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            My Kanban Board
                        </h1>
                        {user && (
                            <p className="text-gray-500 mt-1">
                                Welcome back,{" "}
                                <span className="font-semibold text-gray-700">
                                    {user.name}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push("/dashboard/employee")}
                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            List View
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {message && (
                    <p className="text-center mb-4 text-sm text-red-500">
                        {message}
                    </p>
                )}

                {/* Hint */}
                <p className="text-sm text-gray-500 mb-4">
                    Drag and drop cards to update their status.
                </p>

                {/* Board */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        Loading tasks...
                    </div>
                ) : (
                    <KanbanBoard
                        tasks={tasks}
                        onStatusChange={handleStatusChange}
                        showAssignee={false}
                    />
                )}
            </div>
        </div>
    );
}
