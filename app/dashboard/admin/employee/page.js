"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
 
export default function EmployeeDashboard() {

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");

    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const getDashbaord = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/users/employee-dashboard",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json();
                if(!response.ok) {
                    setMessage(data.message);

                    setTimeout(() => {
                        router.push("/login");
                    }, 1000);
                    return;
                }
                setUser(data.user);
            } catch (error) {
                console.log(error);
                setMessage("Something went wrong");
            }
        }
        getDashbaord();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };    

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
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
                    <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200">
                        Logout
                    </button>
                </div>

                {message && (
                    <p className="mt-5 text-center text-red-500">
                        {message}
                    </p>
                )}

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            My Tasks
                        </h2>
                        <p className="text-gray-500 mt-2">
                            View your assigned tasks here.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            My Profile
                        </h2>
                        {user && (
                            <div className="mt-3 space-y-1">

                                <p className="text-gray-600">
                                    Name: {user.name}
                                </p>

                                <p className="text-gray-600">
                                    Email: {user.email}
                                </p>

                                <p className="text-gray-600">
                                    Role: {user.role}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}