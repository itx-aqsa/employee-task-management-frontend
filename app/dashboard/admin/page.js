"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { apiFetch, ROLES } from "../../lib/api";
import { requireRole } from "../../lib/auth";

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalTasks: 0,
        pendingTasks: 0,
    });
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const profile = await requireRole(router, [ROLES.ADMIN]);
            if (!profile) return;

            setUser(profile);
            setIsAuthChecked(true);

            const agencyId = profile.agencyId ?? null;
            fetchEmployees(agencyId);
            fetchDashboardStats(agencyId);
        };

        init();
    }, [router]);

    const fetchEmployees = async (agencyId) => {
        try {
            const { response, data } = await apiFetch(
                "/users/employees",
                "GET",
                null,
                agencyId
            );
            console.log("[fetchEmployees] status:", response.status, "| raw response:", data, "| resolved array:", data.data);
            if (response.ok) {
                setEmployees(data.data || []);
            } else {
                console.warn("[fetchEmployees] non-OK response:", response.status, data);
            }
        } catch (error) {
            console.error("[fetchEmployees] network/parse error:", error);
        }
    };

    const fetchDashboardStats = async (agencyId) => {
        try {
            const { response, data } = await apiFetch(
                "/users/dashboard-stats",
                "GET",
                null,
                agencyId
            );
            console.log("[fetchDashboardStats] status:", response.status, "| raw response:", data);
            if (response.ok && data.data) {
                setStats(data.data);
            } else if (!response.ok) {
                console.warn("[fetchDashboardStats] non-OK response:", response.status, data);
            }
        } catch (error) {
            console.error("[fetchDashboardStats] network/parse error:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        try {
            const agencyId = user?.agencyId ?? null;
            const { response, data } = await apiFetch(
                `/users/${id}`,
                "DELETE",
                null,
                agencyId
            );

            if (!response.ok) {
                alert(data.message || "Failed to delete employee.");
                return;
            }

            alert("Employee deleted successfully.");
            fetchEmployees(agencyId);
        } catch {
            alert("Something went wrong.");
        }
    };

    if (!isAuthChecked) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar role={ROLES.ADMIN} user={user} />

            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1">
                        {user?.agencyName
                            ? `Managing ${user.agencyName}`
                            : "Manage your agency's employees and tasks"}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: "Total Employees", value: stats.totalEmployees, icon: "👥", color: "text-indigo-600" },
                        { label: "Total Tasks", value: stats.totalTasks, icon: "📋", color: "text-blue-600" },
                        { label: "Pending Tasks", value: stats.pendingTasks, icon: "⏳", color: "text-amber-600" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-slate-600 text-sm">
                                    {stat.label}
                                </h2>
                                <span className="text-xl">{stat.icon}</span>
                            </div>
                            <p className={`text-3xl font-bold mt-3 ${stat.color}`}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <button
                        onClick={() => router.push("/dashboard/admin/tasks/create")}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
                    >
                        + Create Task
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/admin/tasks")}
                        className="bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-900 text-sm font-medium transition-colors"
                    >
                        View Tasks
                    </button>
                    <button
                        onClick={() => router.push("/dashboard/admin/tasks/kanban")}
                        className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                    >
                        Kanban Board
                    </button>
                </div>

                {/* Employees table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">Employees</h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Employees in your agency
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard/admin/employee/create")}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                        >
                            + Add Employee
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {employees.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <p className="text-3xl mb-2">👥</p>
                                <p className="text-sm">No employees found</p>
                            </div>
                        ) : (
                            employees.map((employee) => (
                                <div
                                    key={employee.id}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                                            {employee.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800 text-sm">
                                                {employee.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {employee.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-slate-400">
                                            {employee._count?.tasks ?? 0}{" "}
                                            {employee._count?.tasks === 1 ? "task" : "tasks"}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/dashboard/admin/employee/edit/${employee.id}`
                                                    )
                                                }
                                                className="text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-indigo-100 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(employee.id)}
                                                className="text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-red-100 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
