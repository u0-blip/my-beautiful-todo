"use client";
import React, { useState } from "react";
import { frogs } from "../frogs";
import { Task } from "../types";
import TaskComments from "./TaskComments";

interface TaskItemProps {
    task: Task;
    frog: { name: string; svg: string };
    onTaskUpdate: (updatedTask: Task) => void;
    onTaskDeleted: (taskId: number) => void;
    isCompleted?: boolean;
}

export default function TaskItem({
    task,
    frog,
    onTaskUpdate,
    onTaskDeleted,
    isCompleted = false
}: TaskItemProps) {
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleToggleComplete() {
        setCompleting(true);

        try {
            const res = await fetch(`/api/tasks?id=${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !task.completed }),
            });

            if (res.ok) {
                const updatedTask = await res.json();
                onTaskUpdate(updatedTask);
            } else {
                alert("Failed to update task. Please try again.");
            }
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task. Please try again.");
        } finally {
            setCompleting(false);
        }
    }

    async function handleDeleteTask() {
        if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
            return;
        }

        setDeleting(true);

        try {
            const res = await fetch(`/api/tasks?id=${task.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                onTaskDeleted(task.id);
            } else {
                alert("Failed to delete task. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <li className={`bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg p-4 flex gap-4 items-start border-l-8 border-green-800/60 dark:border-green-600/60 hover:bg-green-50 dark:hover:bg-gray-700/90 transition ${isCompleted ? 'opacity-75' : ''}`}>
            <span className="shrink-0 w-12 h-12" title={frog.name} dangerouslySetInnerHTML={{ __html: frog.svg }} />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold text-lg ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-green-900 dark:text-green-100'}`}>{task.title}</span>
                </div>
                <div className="text-green-800 dark:text-green-200 text-sm mb-2">{task.description}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-full text-xs">Size: {task.size}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${task.urgency === 'Critical' ? 'bg-red-400 dark:bg-red-600 text-white' : task.urgency === 'High' ? 'bg-orange-300 dark:bg-orange-600 text-orange-900 dark:text-orange-100' : task.urgency === 'Normal' ? 'bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100' : 'bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100'}`}>Urgency: {task.urgency}</span>
                    {task.dueDate && <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 rounded-full text-xs">Due: {new Date(task.dueDate).toLocaleString()}</span>}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {task.tags.map((t) => (
                        <span key={t.tag.name} className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-700 text-emerald-900 dark:text-emerald-100 rounded-full text-xs">#{t.tag.name}</span>
                    ))}
                </div>
                <div className="flex gap-2 mb-2">
                    <button
                        className="text-green-700 dark:text-green-400 hover:underline text-xs"
                        onClick={() => setCommentsOpen(!commentsOpen)}
                    >
                        {commentsOpen ? "Hide Comments" : "Show Comments"}
                    </button>
                    <button
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-60 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={handleDeleteTask}
                        disabled={deleting}
                        title="Delete task"
                    >
                        {deleting ? (
                            <span className="text-xs">Deleting...</span>
                        ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
                <TaskComments
                    taskId={task.id}
                    isOpen={commentsOpen}
                    onToggle={() => setCommentsOpen(!commentsOpen)}
                />
            </div>
            <div className="shrink-0 flex items-center">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggleComplete}
                    disabled={completing}
                    className="w-5 h-5 text-green-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 focus:ring-2 disabled:opacity-60 cursor-pointer"
                    title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                />
            </div>
        </li>
    );
} 