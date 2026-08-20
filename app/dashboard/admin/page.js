"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
 
export default function AdminDashboard() {

    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
      const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            router.push("/login");
            return;
        }

        const userData = JSON.parse(savedUser);
        if (userData.role !== "ADMIN") {
            router.push("/login");
            return;
        }
        setUser(userData);

    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };
    
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between bg-white rounded-xl shadow p-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>
                        {user && (
                            <div className="mt-1">
                                <p className="text-gray-500 text-sm">
                                    Welcome back, <span className="font-semibold text-gray-700">{user.name}</span>
                                </p>
                            </div>
                        )}
                    </div>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200">
                        Logout
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="font-semibold text-gray-700">
                            Total Employees
                        </h2>

                        <p className="text-3xl font-bold mt-3">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="font-semibold text-gray-700">
                            Total Tasks
                        </h2>

                        <p className="text-3xl font-bold mt-3">
                            0
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="font-semibold text-gray-700">
                            Pending Tasks
                        </h2>

                        <p className="text-3xl font-bold mt-3">
                            0
                        </p>
                    </div>

                </div>
                <button onClick={() => router.push("/dashboard/admin/tasks/create")}
                    className="mt-8 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                >
                    + Create Task
                </button>

            </div>

        </div>
    );
}