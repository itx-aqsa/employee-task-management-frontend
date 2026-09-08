"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TasksPage() {
    
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState("");
    
    const router = useRouter();

    useEffect(() => {
        const getTasks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/tasks",
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push("/login");
                        return;
                    }
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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if(!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/tasks/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            )

            const data = await response.json();
            if(!response.ok) {
                setMessage(data.message);
                return;
            }

            setMessage(data.message);
            setTasks((previousTasks) => {
                return previousTasks.filter((task) => task.id !== id)
            })
        } catch (error) {
            console.log(error);
            setMessage("Something went wrong")
        }
    }


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

                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push("/dashboard/admin/tasks/kanban")}
                            className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700"
                        >
                            Kanban View
                        </button>
                        <button onClick={() => router.push("/dashboard/admin/tasks/create")}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                        >
                            + Create Task
                        </button>
                    </div>
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
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                                        Actions
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
                                            <span className="text-sm font-medium text-gray-800">
                                                {task.priority}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-800">
                                                {task.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/admin/tasks/edit/${task.id}`) }
                                                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(task.id)}
                                                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {tasks.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-gray-500">
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