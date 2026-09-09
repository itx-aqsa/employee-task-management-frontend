"use client";

import { useState, useRef } from "react";

const STATUS_COLUMNS = [
    {
        key: "PENDING",
        label: "Pending",
        color: "bg-yellow-100 border-yellow-300",
        headerColor: "bg-yellow-200 text-yellow-800",
        dotColor: "bg-yellow-500",
    },
    {
        key: "IN_PROGRESS",
        label: "In Progress",
        color: "bg-blue-100 border-blue-300",
        headerColor: "bg-blue-200 text-blue-800",
        dotColor: "bg-blue-500",
    },
    {
        key: "COMPLETED",
        label: "Completed",
        color: "bg-green-100 border-green-300",
        headerColor: "bg-green-200 text-green-800",
        dotColor: "bg-green-500",
    },
];

const PRIORITY_COLORS = {
    HIGH: "bg-red-100 text-red-700 border border-red-200",
    MEDIUM: "bg-orange-100 text-orange-700 border border-orange-200",
    LOW: "bg-gray-100 text-gray-600 border border-gray-200",
};

function TaskCard({ task, draggable, onDragStart, onDragEnd, showAssignee }) {
    return (
        <div
            draggable={draggable}
            onDragStart={draggable ? onDragStart : undefined}
            onDragEnd={draggable ? onDragEnd : undefined}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 select-none ${
                draggable ? "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow" : ""
            }`}
        >
            <p className="font-semibold text-gray-800 text-sm leading-snug">
                {task.title}
            </p>
            {task.description && (
                <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">
                    {task.description}
                </p>
            )}
            <div className="flex items-center justify-between mt-3">
                <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.MEDIUM
                    }`}
                >
                    {task.priority}
                </span>
                {showAssignee && task.user && (
                    <span className="text-xs text-gray-500 truncate max-w-30">
                        {task.user.name}
                    </span>
                )}
            </div>
        </div>
    );
}

function KanbanColumn({column, tasks, draggable, 
    onDragStart, onDragEnd, onDragOver, onDrop,
    isDragOver, showAssignee,
}) {
    return (
        <div
            className={`flex flex-col rounded-xl border-2 min-h-100 transition-colors ${
                column.color
            } ${isDragOver ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}
            onDragOver={draggable ? onDragOver : undefined}
            onDrop={draggable ? onDrop : undefined}
        >           
            <div
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg ${column.headerColor}`}
            >
                <span
                    className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`}
                />
                <span className="font-semibold text-sm">{column.label}</span>
                <span className="ml-auto text-xs font-medium opacity-70">
                    {tasks.length}
                </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3 p-3 flex-1">
                {tasks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-xs text-gray-400 italic">
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
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default function KanbanBoard({ tasks, onStatusChange, showAssignee = false }) {
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const draggedTask = useRef(null);

    const draggable = !!onStatusChange;

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                />
            ))}
        </div>
    );
}
