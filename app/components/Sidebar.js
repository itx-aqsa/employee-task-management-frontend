"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../lib/auth";
import { useRouter } from "next/navigation";
import { ROLES } from "../lib/api";

const SUPER_ADMIN_LINKS = [
    { href: "/dashboard/super-admin", icon: "🏠", label: "Overview" },
    { href: "/dashboard/super-admin/agencies", icon: "🏢", label: "Agencies" },
    { href: "/dashboard/super-admin/agencies/create", icon: "➕", label: "New Agency" },
];

const ADMIN_LINKS = [
    { href: "/dashboard/admin", icon: "🏠", label: "Dashboard" },
    { href: "/dashboard/admin/tasks", icon: "📋", label: "Tasks" },
    { href: "/dashboard/admin/tasks/create", icon: "✏️", label: "Create Task" },
    { href: "/dashboard/admin/employee/create", icon: "➕", label: "Add Employee" },
];

const EMPLOYEE_LINKS = [
    { href: "/dashboard/employee", icon: "🏠", label: "My Tasks" },
    { href: "/dashboard/employee/kanban", icon: "📌", label: "Kanban Board" },
];

const ROLE_CONFIG = {
    [ROLES.SUPER_ADMIN]: {
        links: SUPER_ADMIN_LINKS,
        panelLabel: "Super Admin",
        accentClass: "bg-purple-600",
    },
    [ROLES.ADMIN]: {
        links: ADMIN_LINKS,
        panelLabel: "Admin Panel",
        accentClass: "bg-indigo-600",
    },
    [ROLES.EMPLOYEE]: {
        links: EMPLOYEE_LINKS,
        panelLabel: "Employee",
        accentClass: "bg-teal-600",
    },
};

/**
 * Role-aware sidebar.
 */
export default function Sidebar({ role, user }) {
    const router = useRouter();
    const pathname = usePathname();

    const config = ROLE_CONFIG[role] || ROLE_CONFIG[ROLES.EMPLOYEE];

    const handleLogout = () => logout(router);

    return (
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-10">
            {/* Brand header */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 ${config.accentClass} rounded-xl flex items-center justify-center shadow-sm`}
                    >
                        <span className="text-white font-bold text-sm">TM</span>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800 text-sm">
                            TaskManager
                        </p>
                        <p className="text-xs text-slate-400">{config.panelLabel}</p>
                    </div>
                </div>
            </div>

            {/* User pill */}
            {user && (
                <div className="px-4 pt-4">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                        <div
                            className={`w-7 h-7 ${config.accentClass} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                        >
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-slate-400">{role}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation links */}
            <nav className="flex-1 p-4 space-y-1 mt-2">
                {config.links.map(({ href, icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                                isActive
                                    ? role === ROLES.SUPER_ADMIN
                                        ? "bg-purple-50 text-purple-700"
                                        : "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            <span>{icon}</span>
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                >
                    <span>🚪</span> Logout
                </button>
            </div>
        </aside>
    );
}
