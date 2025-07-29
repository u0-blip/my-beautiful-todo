"use client";
import React from "react";
import TaskItem from "./TaskItem";
import { frogs } from "../frogs";
import { Task, Comment } from "../types";

interface TaskListProps {
    title: string;
    tasks: Task[];
    deletingTasks: { [taskId: number]: boolean };
    completingTasks: { [taskId: number]: boolean };
    onDeleteTask: (taskId: number) => void;
    onToggleComplete: (taskId: number, currentCompleted: boolean) => void;
    isCompleted?: boolean;
    emptyMessage?: string;
}

export default function TaskList({
    title,
    tasks,
    deletingTasks,
    completingTasks,
    onDeleteTask,
    onToggleComplete,
    isCompleted = false,
    emptyMessage
}: TaskListProps) {
    if (tasks.length === 0) {
        return null;
    }

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
                                deletingTasks={deletingTasks}
                                completingTasks={completingTasks}
                                onDeleteTask={onDeleteTask}
                                onToggleComplete={onToggleComplete}
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