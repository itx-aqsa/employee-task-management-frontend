"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState({ totalEmployees: 0, totalTasks: 0, pendingTasks: 0 });

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        const getProfile = async () => {
            try {
                const response = await fetch("http://localhost:5000/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (!response.ok) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/login");
                    return;
                }
                if (data.data.role !== "ADMIN") { router.push("/login"); return; }
                setUser(data.data);
                getEmployee();
                getDashboardStats();
            } catch {
                router.push("/login");
            }
        };
        getProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const getEmployee = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/users/employees", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) setEmployees(data.data);
        } catch (error) { console.log(error); }
    };

    const getDashboardStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/users/dashboard-stats", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (response.ok) setStats(data.data);
        } catch (error) { console.log(error); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) { alert(data.message); return; }
            getEmployee();
        } catch (error) { console.log(error); alert("Something went wrong"); }
    };

    const statCards = [
        { label: "Total Employees", value: stats.totalEmployees, icon: "👥", color: "bg-blue-50 text-blue-600" },
        { label: "Total Tasks", value: stats.totalTasks, icon: "📋", color: "bg-indigo-50 text-indigo-600" },
        { label: "Pending Tasks", value: stats.pendingTasks, icon: "⏳", color: "bg-amber-50 text-amber-600" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">TM</span>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">TaskManager</p>
                            <p className="text-xs text-slate-400">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/dashboard/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium text-sm">
                        <span>🏠</span> Dashboard
                    </Link>
                    <Link href="/dashboard/admin/tasks" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                        <span>📋</span> Tasks
                    </Link>
                    <Link href="/dashboard/admin/employee/create" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                        <span>➕</span> Add Employee
                    </Link>
                    <Link href="/dashboard/admin/tasks/create" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                        <span>✏️</span> Create Task
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    {user && (
                        <div className="flex items-center gap-3 mb-3 px-1">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">
                        {user ? `Welcome back, ${user.name}` : "Loading..."}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {statCards.map((s) => (
                        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.color}`}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{s.label}</p>
                                <p className="text-3xl font-bold text-slate-900 mt-0.5">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => router.push("/dashboard/admin/tasks/create")}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm text-sm"
                    >
                        + Create Task
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/admin/tasks")}
                        className="bg-white text-slate-700 px-5 py-2.5 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
                    >
                        View All Tasks
                    </button>
                </div>

                {/* Employees table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Employees</h2>
                            <p className="text-sm text-slate-500 mt-0.5">Manage your team members</p>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard/admin/employee/create")}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                            + Add Employee
                        </button>
                    </div>

                    <div className="p-6">
                        {employees.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <p className="text-3xl mb-2">👥</p>
                                <p>No employees yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {employees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                                                {employee.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{employee.name}</p>
                                                <p className="text-sm text-slate-400">{employee.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => router.push(`/dashboard/admin/employee/edit/${employee.id}`)}
                                                className="text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-lg px-3 py-1.5 text-sm hover:bg-indigo-100 transition-colors font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
                                                className="text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-1.5 text-sm hover:bg-red-100 transition-colors font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
