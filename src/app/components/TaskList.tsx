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
    isCompleted?: boolean;
    emptyMessage?: string;
}

export default function TaskList({
    title,
    tasks,
    onTaskUpdate,
    onTaskDeleted,
    isCompleted = false,
    emptyMessage
}: TaskListProps) {

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">{title}</h2>
            {tasks.length > 0 ? (
                <ul className="flex flex-col gap-4">
                    {tasks.map((task) => {
                        const frog = frogs[task.id % frogs.length];
                        return (
                            <TaskItem
                                key={task.id}
                                task={task}
                                frog={frog}
                                onTaskUpdate={onTaskUpdate}
                                onTaskDeleted={onTaskDeleted}
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