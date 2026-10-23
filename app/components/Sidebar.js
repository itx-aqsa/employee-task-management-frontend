"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiColumns, FiHome, FiLogOut, FiClipboard, FiPlus, FiUsers, FiBriefcase } from "react-icons/fi";
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
        accentClass: "bg-teal-600",
    },
    [ROLES.ADMIN]: {
        links: ADMIN_LINKS,
        panelLabel: "Admin Panel",
        accentClass: "bg-teal-600",
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
export default function Sidebar({ role, user, adminDashboard = false, superAdminAgencies = false, superAdminOverview = false, employeeTheme = false }) {
    const router = useRouter();
    const pathname = usePathname();

    const config = ROLE_CONFIG[role] || ROLE_CONFIG[ROLES.EMPLOYEE];
    const isEmployee = role === ROLES.EMPLOYEE;
    const isAdminDashboard = role === ROLES.ADMIN && adminDashboard;
    const isSuperAdminAgencies = role === ROLES.SUPER_ADMIN && superAdminAgencies;
    const isSuperAdminOverview = role === ROLES.SUPER_ADMIN && superAdminOverview;
    const isSuperAdminMobilePage = isSuperAdminAgencies || isSuperAdminOverview;
    const hasMobileDock = isEmployee || isAdminDashboard || isSuperAdminMobilePage;
    const accentClass = employeeTheme
        ? "bg-teal-600"
        : isAdminDashboard
            ? "bg-teal-600"
            : isSuperAdminOverview
                ? "bg-teal-600"
                : config.accentClass;

    const handleLogout = () => logout(router);

    return (
        <aside className={`${
            hasMobileDock
                ? "fixed inset-x-0 bottom-0 z-30 flex h-[4.5rem] w-full flex-row border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur-md md:inset-y-0 md:left-0 md:right-auto md:h-full md:w-64 md:flex-col md:border-r md:border-t-0 md:shadow-none"
                : "fixed z-10 flex h-full w-64 flex-col border-r border-slate-100 bg-white"
        }`}>
            {/* Brand header */}
            <div className={`${hasMobileDock ? "hidden md:block" : "block"} border-b border-slate-100 p-6`}>
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 ${accentClass} rounded-xl flex items-center justify-center shadow-sm`}
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
                <div className={`${hasMobileDock ? "hidden md:block" : "block"} px-4 pt-4`}>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                        <div
                            className={`w-7 h-7 ${accentClass} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
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
            <nav className={`${hasMobileDock ? "flex w-full flex-1 items-stretch justify-around gap-1 p-1.5 md:mt-2 md:block md:space-y-1 md:p-4" : "mt-2 flex-1 space-y-1 p-4"}`}>
                {config.links.map(({ href, icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`${hasMobileDock
                                ? "flex min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors sm:text-xs md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2.5 md:text-sm"
                                : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                            } ${
                                isActive
                                    ? employeeTheme || isSuperAdminOverview
                                        ? "bg-teal-50 text-teal-700 md:ring-1 md:ring-inset md:ring-teal-100"
                                        : role === ROLES.SUPER_ADMIN
                                        ? "bg-teal-50 text-teal-700 md:ring-1 md:ring-inset md:ring-teal-100"
                                        : role === ROLES.EMPLOYEE
                                            ? "bg-teal-50 text-teal-700 md:ring-1 md:ring-inset md:ring-teal-100"
                                            : isAdminDashboard
                                            ? "bg-teal-50 text-teal-700 md:ring-1 md:ring-inset md:ring-teal-100"
                                                : "bg-teal-50 text-teal-700"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            <span className={hasMobileDock ? "text-base leading-none md:text-inherit" : ""}>
                                {role === ROLES.EMPLOYEE
                                    ? href.includes("kanban")
                                        ? <FiColumns aria-hidden="true" className="h-4 w-4" />
                                        : <FiHome aria-hidden="true" className="h-4 w-4" />
                                    : isAdminDashboard
                                        ? href.endsWith("/tasks/create")
                                            ? <FiPlus aria-hidden="true" className="h-4 w-4" />
                                            : href.endsWith("/employee/create")
                                                ? <FiUsers aria-hidden="true" className="h-4 w-4" />
                                                : href.endsWith("/tasks")
                                                    ? <FiClipboard aria-hidden="true" className="h-4 w-4" />
                                                    : <FiHome aria-hidden="true" className="h-4 w-4" />
                                        : isSuperAdminMobilePage
                                            ? href.endsWith("/agencies/create")
                                                ? <FiPlus aria-hidden="true" className="h-4 w-4" />
                                                : href.endsWith("/agencies")
                                                    ? <FiBriefcase aria-hidden="true" className="h-4 w-4" />
                                                    : <FiHome aria-hidden="true" className="h-4 w-4" />
                                            : icon}
                            </span>
                            <span className={hasMobileDock ? "max-w-full truncate" : ""}>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className={`${hasMobileDock ? "flex shrink-0 items-center border-l border-slate-100 p-1.5 md:block md:border-l-0 md:border-t md:p-4" : "border-t border-slate-100 p-4"}`}>
                <button
                    onClick={handleLogout}
                    className={`${hasMobileDock ? "flex h-full flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-medium text-red-600 transition-colors hover:bg-red-50 md:h-auto md:w-full md:flex-row md:gap-2 md:px-3 md:py-2 md:text-sm" : "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"}`}
                >
                    {role === ROLES.EMPLOYEE ? (<FiLogOut aria-hidden="true" className="h-4 w-4" />) : (<span>🚪</span>)} Logout
                </button>
            </div>
        </aside>
    );
}
