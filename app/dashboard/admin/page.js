"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
 
export default function AdminDashboard() {

    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const getProfile = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/users/profile",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json();
                if(!response.ok) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    router.push("/login");
                    return;
                }

                if (data.data.role !== "ADMIN") {
                    router.push("/login");
                    return;
                }
                setUser(data.data);

                const employeesResponse = await fetch (
                    "http://localhost:5000/users/employees",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                )

                const employeesData = await employeesResponse.json();
                if(employeesResponse.ok) {
                    setEmployees(employeesData.data);
                }
            } catch (error) {
                console.log(error);
                router.push("/login");
            }
        }  
        getProfile();

    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/login");
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you wnat to delete this employee?");
        if(!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/users/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
                return;
            }
            alert("Employee deleted successfully");
            getEmployees();

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between bg-white rounded-xl shadow p-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>
                        {user && (
                            <p className="text-gray-500 text-sm mt-1">
                                Welcome back, {user.name}
                            </p>
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
                        <div className="mt-4 space-y-3">
                            {employees.length === 0 ? (
                                <p className="text-gray-500">
                                    No employees found
                                </p>
                            ) : (
                                employees.map((employee) => (
                                    <div key={employee.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 truncate">
                                                {employee.name}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {employee.email}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1 shrink-0">
                                            <button 
                                                onClick={() =>
                                                    router.push(`/dashboard/admin/employee/edit/${employee.id}`)
                                                }
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 rounded-md px-3 py-1 hover:bg-blue-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded-md px-3 py-1 hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* <p className="text-3xl font-bold mt-3">
                            0
                        </p> */}
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

                <button
                    onClick={() => router.push("/dashboard/admin/tasks")}
                    className="mt-8 ml-3 bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900"
                >
                    View Tasks
                </button>

                <button onClick={() => router.push("/dashboard/admin/employee/create")}
                    className="mt-8 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700"
                >
                    + Add Employee
                </button>

            </div>

        </div>
    );
}