"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTaskPage() {

    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({ title: "", description: "", priority: "MEDIUM", userId: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    
    const params = useParams();
    const router = useRouter();
    const taskId = params.id;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const getData = async () => {
            try {
                const employeeResponse = await fetch(
                    "http://localhost:5000/users/employees",
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const employeeData = await employeeResponse.json();
                if (!employeeResponse.ok) {
                    setMessage(employeeData.message);
                    return;
                }

                setEmployees(employeeData.data);
                const taskResponse = await fetch(
                    `http://localhost:5000/tasks/${taskId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const taskData = await taskResponse.json();
                if (!taskResponse.ok) {
                    setMessage(taskData.message);
                    return;
                }

                const task = taskData.data;
                setFormData({
                    title: task.title,
                    description: task.description || "",
                    priority: task.priority,
                    userId: String(task.userId)
                });
            } catch (error) {
                console.log(error);
                setMessage("Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [taskId, router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/tasks/${taskId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title: formData.title,
                        description: formData.description,
                        priority: formData.priority,
                        userId: Number(formData.userId)
                    })
                }
            );

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            setMessage("Task updated successfully");
            setTimeout(() => {
                router.push("/dashboard/admin/tasks");
            }, 1000);

        } catch (error) {
            console.log(error);
            setMessage("Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow p-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Task
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Update task information
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Title
                            </label>
                            <input
                                type="text" name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="LOW">
                                    Low
                                </option>

                                <option value="MEDIUM">
                                    Medium
                                </option>

                                <option value="HIGH">
                                    High
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign To
                            </label>
                            <select
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">
                                    Select Employee
                                </option>

                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name} - {employee.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700">
                                Update Task
                            </button>

                            <button type="button"
                                onClick={() => router.push("/dashboard/admin/tasks")}
                                className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {message && (
                        <p className="mt-5 text-sm text-gray-600">
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}