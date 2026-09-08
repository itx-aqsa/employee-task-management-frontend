"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (!savedUser || !token) {
            router.push("/login");
            return;
        }

        const userData = JSON.parse(savedUser);
        if(userData.role !== "EMPLOYEE") {
            router.push("/login");
            return;
        }
        setUser(userData);

        const getMyTasks = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/tasks/my-tasks",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
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
            } finally {
                setLoading(false);
            }
        };

        getMyTasks();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">

                <div className="flex items-center justify-between bg-white rounded-xl shadow p-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Employee Dashboard
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
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            My Tasks
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Tasks assigned to you
                        </p>
                        {loading ? (
                            <p className="text-gray-500 mt-6">
                                Loading tasks...
                            </p>
                        ) : tasks.length === 0 ? (
                            <p className="text-gray-500 mt-6">
                                No tasks assigned to you.
                            </p>
                        ) : (
                            <div className="overflow-x-auto mt-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Title
                                            </th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Description
                                            </th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Priority
                                            </th>
                                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map((task) => (
                                            <tr key={task.id} className="border-b last:border-b-0">
                                                <td className="px-4 py-4 text-gray-800 font-medium">
                                                    {task.title}
                                                </td>
                                                <td className="px-4 py-4 text-gray-600">
                                                    {task.description || "-"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                                                        {task.priority}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                                                        {task.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {message && (
                            <p className="mt-5 text-center text-red-500">{message}</p>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            My Profile
                        </h2>
                        {user && (
                            <div className="mt-3 space-y-1">
                                <p className="text-gray-600">Name: {user.name}</p>
                                <p className="text-gray-600">Email: {user.email}</p>
                                <p className="text-gray-600">Role: {user.role}</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
