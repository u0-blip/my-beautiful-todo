"use client";
import React from "react";
import TaskItem from "./TaskItem";
import { frogs } from "../frogs";
import { Task, Comment } from "../types";

interface TaskListProps {
    title: string;
    tasks: Task[];
    onTaskUpdate: (updatedTask: Task) => void;
    onTaskDeleted: (taskId: number) => void;
    onNewCompletedTask?: (newTask: Task) => void;
    isCompleted?: boolean;
    emptyMessage?: string;
    onClose?: () => void;
    showCloseButton?: boolean;
}

export default function TaskList({
    title,
    tasks,
    onTaskUpdate,
    onTaskDeleted,
    onNewCompletedTask,
    isCompleted = false,
    emptyMessage,
    onClose,
    showCloseButton = false
}: TaskListProps) {

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h2>
                {showCloseButton && onClose && (
                    <button
                        onClick={onClose}
                        className="bg-red-200 hover:bg-red-300 dark:bg-red-700 dark:hover:bg-red-600 text-red-900 dark:text-red-100 px-3 py-1 rounded shadow text-sm transition-colors"
                    >
                        ✕ Close
                    </button>
                )}
            </div>
            {tasks.length > 0 ? (
                <ul className="flex flex-col gap-4">
                    {tasks.map((task) => {
                        // Use originalTaskId for completion tasks to keep the same frog
                        const taskIdForFrog = task.originalTaskId || task.id;
                        const frog = frogs[taskIdForFrog % frogs.length];
                        return (
                            <TaskItem
                                key={task.id}
                                task={task}
                                frog={frog}
                                onTaskUpdate={onTaskUpdate}
                                onTaskDeleted={onTaskDeleted}
                                onNewCompletedTask={onNewCompletedTask}
                                isCompleted={isCompleted}
                            />
                        );
                    })}
                </ul>
            ) : (
                emptyMessage && <div className="text-white text-lg">{emptyMessage}</div>
            )}
        </div>
    );
} 