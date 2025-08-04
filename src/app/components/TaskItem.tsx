"use client";
import React, { useState } from "react";
import { frogs } from "../frogs";
import { Task } from "../types";
import TaskComments from "./TaskComments";
import WeeklyTaskStats from "./WeeklyTaskStats";

interface TaskItemProps {
    task: Task;
    frog: { name: string; svg: string };
    onTaskUpdate: (updatedTask: Task) => void;
    onTaskDeleted: (taskId: number) => void;
    onNewCompletedTask?: (newTask: Task) => void;
    isCompleted?: boolean;
}

export default function TaskItem({
    task,
    frog,
    onTaskUpdate,
    onTaskDeleted,
    onNewCompletedTask,
    isCompleted = false
}: TaskItemProps) {
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [weeklyStatsOpen, setWeeklyStatsOpen] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleToggleComplete() {
        setCompleting(true);

        try {
            const res = await fetch(`/api/tasks?id=${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    completed: !task.completed,
                    userId: 1 // Default user ID for now
                }),
            });

            if (res.ok) {
                const response = await res.json();
                onTaskUpdate(response);

                // If this was a weekly task completion, we need to add the new completed task to the list
                if (response.newCompletedTask && onNewCompletedTask) {
                    onNewCompletedTask(response.newCompletedTask);
                }
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
        <li className={`rounded-xl shadow-lg p-4 flex gap-4 items-start border-l-8 transition-all duration-500 ${task.completed
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-8 border-green-500 shadow-green-200 dark:shadow-green-900/30 transform scale-[1.02] hover:scale-[1.03]'
            : 'bg-white/90 dark:bg-gray-800/90 border-green-800/60 dark:border-green-600/60 hover:bg-green-50 dark:hover:bg-gray-700/90'
            }`}>
            <div className="shrink-0 w-12 h-12 relative" title={frog.name}>
                <span dangerouslySetInnerHTML={{ __html: frog.svg }} />
                {task.completed && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold text-lg transition-all duration-300 ${task.completed
                        ? 'text-green-700 dark:text-green-300 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
                        : 'text-green-900 dark:text-green-100'
                        }`}>
                        {task.completed && <span className="mr-2">🎉</span>}
                        {task.title}
                        {task.completed && <span className="ml-2">✨</span>}
                    </span>
                </div>
                <div className={`text-sm mb-2 transition-all duration-300 ${task.completed
                    ? 'text-green-600 dark:text-green-300 italic'
                    : 'text-green-800 dark:text-green-200'
                    }`}>
                    {task.completed && <span className="mr-1">💫</span>}
                    {task.description}
                    {task.completed && <span className="ml-1">💫</span>}
                </div>
                {task.completed && task.completedAt && (
                    <div className="text-xs text-green-500 dark:text-green-400 mb-2">
                        ✨ Completed on {new Date(task.completedAt).toLocaleDateString()} at {new Date(task.completedAt).toLocaleTimeString()}
                    </div>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs transition-all duration-300 ${task.completed
                        ? 'bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 shadow-sm'
                        : 'bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100'
                        }`}>Size: {task.size}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs transition-all duration-300 ${task.completed
                        ? 'bg-emerald-200 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-200 shadow-sm'
                        : (task.urgency === 'Critical' ? 'bg-red-400 dark:bg-red-600 text-white' : task.urgency === 'High' ? 'bg-orange-300 dark:bg-orange-600 text-orange-900 dark:text-orange-100' : task.urgency === 'Normal' ? 'bg-yellow-200 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100' : 'bg-green-200 dark:bg-green-600 text-green-900 dark:text-green-100')
                        }`}>Urgency: {task.urgency}</span>
                    {task.dueDate && (
                        <span className={`px-2 py-0.5 rounded-full text-xs transition-all duration-300 ${task.completed
                            ? 'bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 shadow-sm'
                            : 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100'
                            }`}>Due: {new Date(task.dueDate).toLocaleString()}</span>
                    )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {task.tags.map((t) => (
                        <span key={t.tag.name} className={`px-2 py-0.5 rounded-full text-xs transition-all duration-300 ${task.completed
                            ? 'bg-emerald-300 dark:bg-emerald-600 text-emerald-900 dark:text-emerald-100 shadow-sm'
                            : 'bg-emerald-200 dark:bg-emerald-700 text-emerald-900 dark:text-emerald-100'
                            }`}>#{t.tag.name}</span>
                    ))}
                </div>

                {/* Weekly Task Progress */}
                {task.isWeekly && task.timesPerWeek && (
                    <div className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium transition-all duration-300 ${task.completed
                                ? 'text-green-600 dark:text-green-300'
                                : 'text-green-800 dark:text-green-200'
                                }`}>
                                {task.completed && <span className="mr-1">🎯</span>}
                                Weekly Progress: {task.weeklyCompletionCount || 0} / {task.timesPerWeek}
                                {task.completed && <span className="ml-1">🏆</span>}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${task.completed
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg'
                                    : 'bg-green-600'
                                    }`}
                                style={{
                                    width: `${Math.min(100, ((task.weeklyCompletionCount || 0) / task.timesPerWeek) * 100)}%`
                                }}
                            ></div>
                        </div>
                        <div className="flex gap-1 mt-1">
                            {Array.from({ length: task.timesPerWeek }, (_, i) => (
                                <span
                                    key={i}
                                    className={`w-3 h-3 rounded-full border transition-all duration-300 ${i < (task.weeklyCompletionCount || 0)
                                        ? task.completed
                                            ? 'bg-gradient-to-r from-green-400 to-emerald-400 border-green-400 shadow-sm animate-pulse'
                                            : 'bg-green-500 border-green-500'
                                        : 'bg-transparent border-gray-300 dark:border-gray-600'
                                        }`}
                                    title={`Completion ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex gap-2 mb-2">
                    <button
                        className="text-green-700 dark:text-green-400 hover:underline text-xs"
                        onClick={() => setCommentsOpen(!commentsOpen)}
                    >
                        {commentsOpen ? "Hide Comments" : "Show Comments"}
                    </button>
                    {task.isWeekly && task.timesPerWeek && (
                        <button
                            className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                            onClick={() => setWeeklyStatsOpen(true)}
                        >
                            Weekly Stats
                        </button>
                    )}
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
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={handleToggleComplete}
                        disabled={completing}
                        className={`w-6 h-6 transition-all duration-300 cursor-pointer ${task.completed
                            ? 'text-green-600 bg-green-100 dark:bg-green-800 border-green-500 dark:border-green-400 rounded-lg shadow-lg scale-110'
                            : 'text-green-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 focus:ring-2'
                            } disabled:opacity-60`}
                        title={
                            task.isWeekly
                                ? `Add completion (${task.weeklyCompletionCount || 0}/${task.timesPerWeek})`
                                : (task.completed ? "Mark as incomplete" : "Mark as complete")
                        }
                    />
                    {task.completed && (
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center animate-ping">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Weekly Stats Modal */}
            <WeeklyTaskStats
                task={task}
                isOpen={weeklyStatsOpen}
                onClose={() => setWeeklyStatsOpen(false)}
            />
        </li>
    );
} 