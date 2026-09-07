"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTask() {

    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({ title: "", description: "", priority: "MEDIUM", userId: "" });
    const [message, setMessage] = useState("");
    
    const router = useRouter();

    useEffect(() => {
        const getEmployees = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/users/employees",
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
                setEmployees(data.data);

            } catch (error) {
                console.log(error);
                setMessage("Something went wrong");
            }
        };
        getEmployees();

    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:5000/tasks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message);
                return;
            }

            setMessage("Task created successfully");
            setFormData({ title: "", description: "", priority: "MEDIUM", userId: "" });

        } catch (error) {
            console.log(error);
            setMessage("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow p-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Create Task
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Assign a task to an employee
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Title
                            </label>
                            <input
                                type="text" name="title"
                                value={formData.title} onChange={handleChange}
                                placeholder="Enter task title"
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
                                placeholder="Enter task description"
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

                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {employee.name} - {employee.email}
                                    </option>

                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700">
                                Create Task
                            </button>

                            <button type="button"
                                onClick={() => router.push("/dashboard/admin")}
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