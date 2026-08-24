"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TasksPage() {
    
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState("");
    
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const getTasks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/tasks",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();
                if (!response.ok) {
                    setMessage(data.message);
                    return;
                }
                setTasks(data.data);
            } catch (error) {
                console.log(error);
                setMessage("Something went wrong");
            }
        };
        getTasks();
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Tasks
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage all employee tasks
                        </p>
                    </div>

                    <button onClick={() => router.push("/dashboard/admin/tasks/create") }
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                    >
                        + Create Task
                    </button>
                </div>

                {message && (
                    <p className="text-red-500 mb-4">
                        {message}
                    </p>
                )}

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Title
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Employee
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Priority
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {tasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">
                                                {task.title}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {task.description}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">
                                                {task.user?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {task.user?.email}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium">
                                                {task.priority}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium">
                                                {task.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {tasks.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-gray-500">
                                            No tasks found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}