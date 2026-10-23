"use client";

import { useState, useRef } from "react";
import {
    FiActivity,
    FiAlertTriangle,
    FiCheckCircle,
    FiClock,
    FiFlag,
    FiMove,
} from "react-icons/fi";

const STATUS_COLUMNS = [
    {
        key: "PENDING",
        label: "Pending",
        color: "bg-yellow-100 border-yellow-300",
        headerColor: "bg-yellow-200 text-yellow-800",
        dotColor: "bg-yellow-500",
        employeeColor: "border-amber-200/80 bg-amber-50/40",
        employeeHeader: "bg-amber-50 text-amber-900",
        employeeDot: "bg-amber-500",
        employeeRing: "ring-amber-300",
        adminColor: "border-amber-200/80 bg-amber-50/40",
        adminHeader: "bg-amber-50 text-amber-900",
        adminDot: "bg-amber-500",
        adminRing: "ring-amber-300",
        icon: FiClock,
    },
    {
        key: "IN_PROGRESS",
        label: "In Progress",
        color: "bg-blue-100 border-blue-300",
        headerColor: "bg-blue-200 text-blue-800",
        dotColor: "bg-blue-500",
        employeeColor: "border-blue-200/80 bg-blue-50/40",
        employeeHeader: "bg-blue-50 text-blue-900",
        employeeDot: "bg-blue-500",
        employeeRing: "ring-blue-300",
        adminColor: "border-teal-200/80 bg-teal-50/40",
        adminHeader: "bg-teal-50 text-teal-900",
        adminDot: "bg-teal-600",
        adminRing: "ring-teal-300",
        icon: FiActivity,
    },
    {
        key: "COMPLETED",
        label: "Completed",
        color: "bg-green-100 border-green-300",
        headerColor: "bg-green-200 text-green-800",
        dotColor: "bg-green-500",
        employeeColor: "border-green-200/80 bg-green-50/40",
        employeeHeader: "bg-green-50 text-green-900",
        employeeDot: "bg-green-500",
        employeeRing: "ring-green-300",
        adminColor: "border-emerald-200/80 bg-emerald-50/40",
        adminHeader: "bg-emerald-50 text-emerald-900",
        adminDot: "bg-emerald-500",
        adminRing: "ring-emerald-300",
        icon: FiCheckCircle,
    },
];

const PRIORITY_COLORS = {
    HIGH: "bg-red-100 text-red-700 border border-red-200",
    MEDIUM: "bg-orange-100 text-orange-700 border border-orange-200",
    LOW: "bg-gray-100 text-gray-600 border border-gray-200",
};

const PRIORITY_ICONS = {
    HIGH: FiAlertTriangle,
    MEDIUM: FiFlag,
    LOW: FiCheckCircle,
};

function TaskCard({ task, draggable, onDragStart, onDragEnd, showAssignee, employeeVariant, adminVariant }) {
    const PriorityIcon = PRIORITY_ICONS[task.priority] || FiFlag;

    return (
        <article
            draggable={draggable}
            onDragStart={draggable ? onDragStart : undefined}
            onDragEnd={draggable ? onDragEnd : undefined}
            className={`${
                employeeVariant
                    ? "group select-none rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.025] transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-900/[0.06]"
                    : adminVariant
                        ? "group select-none rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-900/[0.025] transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-900/[0.06]"
                        : `select-none rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${draggable ? "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow" : ""}`
            } ${employeeVariant && draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
            {employeeVariant || adminVariant ? (
                <>
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM}`}>
                            <PriorityIcon aria-hidden="true" className="h-3 w-3" />
                            {task.priority}
                        </span>
                        {draggable && <FiMove aria-hidden="true" className={`mt-1 h-4 w-4 text-slate-300 transition-colors group-hover:text-teal-700`} />}
                    </div>
                    <h3 className="break-words text-sm font-semibold leading-5 text-slate-900">
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                            {task.description}
                        </p>
                    )}
                    {showAssignee && task.user && (
                        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${employeeVariant ? "bg-teal-50 text-teal-700" : "bg-teal-50 text-teal-800"}`}>
                                {task.user.name?.charAt(0).toUpperCase()}
                            </span>
                            <span className="max-w-36 truncate text-xs font-medium text-slate-500">
                                {task.user.name}
                            </span>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <p className="text-sm font-semibold leading-snug text-gray-800">
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">
                            {task.description}
                        </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM}`}>
                            {task.priority}
                        </span>
                        {showAssignee && task.user && (
                            <span className="max-w-30 truncate text-xs text-gray-500">
                                {task.user.name}
                            </span>
                        )}
                    </div>
                </>
            )}
        </article>
    );
}

function KanbanColumn({
    column,
    tasks,
    draggable,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    isDragOver,
    showAssignee,
    employeeVariant,
    adminVariant,
}) {
    const ColumnIcon = column.icon;

    return (
        <section
            className={`${
                employeeVariant
                    ? `flex min-h-[22rem] flex-col overflow-hidden rounded-[1.5rem] border bg-white shadow-sm shadow-slate-900/[0.025] transition duration-200 ${column.employeeColor} ${isDragOver ? `ring-2 ${column.employeeRing} ring-offset-2 ring-offset-slate-100` : ""}`
                    : adminVariant
                        ? `flex min-h-[22rem] flex-col overflow-hidden rounded-[1.5rem] border bg-white shadow-sm shadow-slate-900/[0.025] transition duration-200 ${column.adminColor} ${isDragOver ? `ring-2 ${column.adminRing} ring-offset-2 ring-offset-slate-100` : ""}`
                        : `flex min-h-100 flex-col rounded-xl border-2 transition-colors ${column.color} ${isDragOver ? "ring-2 ring-blue-400 ring-offset-1" : ""}`
            }`}
            onDragOver={draggable ? onDragOver : undefined}
            onDrop={draggable ? onDrop : undefined}
        >
            {employeeVariant || adminVariant ? (
                <div className={`flex items-center gap-3 border-b border-black/5 px-4 py-4 sm:px-5 ${employeeVariant ? column.employeeHeader : column.adminHeader}`}>
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 shadow-sm ring-1 ring-black/5`}>
                        <ColumnIcon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div>
                        <h2 className="text-sm font-bold">{column.label}</h2>
                        <p className="mt-0.5 text-[10px] font-medium opacity-70">Tasks in this stage</p>
                    </div>
                    <span className="ml-auto rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold shadow-sm ring-1 ring-black/5">
                        {tasks.length}
                    </span>
                </div>
            ) : (
                <div className={`flex items-center gap-2 rounded-t-lg px-4 py-3 ${column.headerColor}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${column.dotColor}`} />
                    <span className="text-sm font-semibold">{column.label}</span>
                    <span className="ml-auto text-xs font-medium opacity-70">{tasks.length}</span>
                </div>
            )}

            <div className={`flex flex-1 flex-col ${employeeVariant || adminVariant ? "gap-3 p-3 sm:p-4" : "gap-3 p-3"}`}>
                {tasks.length === 0 ? (
                    <div className={`flex flex-1 items-center justify-center ${employeeVariant || adminVariant ? "rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5" : ""}`}>
                        <p className={`text-xs ${employeeVariant || adminVariant ? "font-medium text-slate-400" : "italic text-gray-400"}`}>
                            No tasks
                        </p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            draggable={draggable}
                            onDragStart={() => onDragStart(task)}
                            onDragEnd={onDragEnd}
                            showAssignee={showAssignee}
                            employeeVariant={employeeVariant}
                            adminVariant={adminVariant}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default function KanbanBoard({ tasks, onStatusChange, showAssignee = false, variant = "default" }) {
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const draggedTask = useRef(null);

    const draggable = !!onStatusChange;
    const employeeVariant = variant === "employee";
    const adminVariant = variant === "admin";

    const grouped = STATUS_COLUMNS.reduce((acc, col) => {
        acc[col.key] = tasks.filter((t) => t.status === col.key);
        return acc;
    }, {});

    const handleDragStart = (task) => {
        draggedTask.current = task;
    };

    const handleDragEnd = () => {
        draggedTask.current = null;
        setDragOverColumn(null);
    };

    const handleDragOver = (e, colKey) => {
        e.preventDefault();
        setDragOverColumn(colKey);
    };

    const handleDrop = (e, colKey) => {
        e.preventDefault();
        setDragOverColumn(null);
        const task = draggedTask.current;
        if (!task || task.status === colKey) return;
        onStatusChange(task.id, colKey);
    };

    return (
        <div className={employeeVariant || adminVariant
            ? "grid grid-cols-1 gap-4 md:grid-flow-col md:auto-cols-[minmax(270px,1fr)] md:grid-cols-none md:overflow-x-auto md:pb-3 xl:grid-flow-row xl:auto-cols-auto xl:grid-cols-3 xl:overflow-visible xl:pb-0"
            : "grid grid-cols-1 gap-4 md:grid-cols-3"}>
            {STATUS_COLUMNS.map((col) => (
                <KanbanColumn
                    key={col.key}
                    column={col}
                    tasks={grouped[col.key] || []}
                    draggable={draggable}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, col.key)}
                    onDrop={(e) => handleDrop(e, col.key)}
                    isDragOver={dragOverColumn === col.key}
                    showAssignee={showAssignee}
                    employeeVariant={employeeVariant}
                    adminVariant={adminVariant}
                />
            ))}
        </div>
    );
}
