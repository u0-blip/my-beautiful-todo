"use client";
import React, { useState } from "react";
import { frogs } from "../frogs";
import { TaskForm, Task } from "../types";

interface TaskModalProps {
    showModal: boolean;
    onClose: () => void;
    onTaskCreated: (task: Task) => void;
}

export default function TaskModal({
    showModal,
    onClose,
    onTaskCreated
}: TaskModalProps) {
    const [frogIdx, setFrogIdx] = useState(() => Math.floor(Math.random() * frogs.length));
    const [form, setForm] = useState<TaskForm>({
        title: "",
        description: "",
        dueDate: "",
        size: "Small",
        urgency: "Normal",
        tags: "",
        isWeekly: false,
        timesPerWeek: 1,
    });
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!showModal) return null;

    function handleRerollFrog() {
        setFrogIdx(Math.floor(Math.random() * frogs.length));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        if (!form.title.trim()) {
            setFormError("Title is required");
            return;
        }

        setSubmitting(true);

        try {
            // Parse tags (comma or space separated)
            const tagsArr = form.tags.split(/[, ]+/).filter(Boolean);

            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
                    size: form.size,
                    urgency: form.urgency,
                    tags: tagsArr,
                    isWeekly: form.isWeekly,
                    timesPerWeek: form.isWeekly ? form.timesPerWeek : undefined,
                }),
            });

            if (!res.ok) {
                setFormError("Failed to create task");
                return;
            }

            const newTask = await res.json();
            onTaskCreated(newTask);

            // Reset form
            setForm({
                title: "",
                description: "",
                dueDate: "",
                size: "Small",
                urgency: "Normal",
                tags: "",
                isWeekly: false,
                timesPerWeek: 1,
            });
            setFormError("");
            onClose();
        } catch (error) {
            setFormError("Failed to create task");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <button
                    type="button"
                    className="absolute top-3 right-3 text-green-900 dark:text-green-400 hover:text-red-600 dark:hover:text-red-400 text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <div className="flex flex-col items-center gap-2 mb-2">
                    <span
                        className="w-16 h-16"
                        title={frogs[frogIdx].name}
                        dangerouslySetInnerHTML={{ __html: frogs[frogIdx].svg }}
                    />
                    <button
                        type="button"
                        className="text-xs text-green-700 dark:text-green-400 hover:underline"
                        onClick={handleRerollFrog}
                        tabIndex={-1}
                    >
                        Reroll Frog
                    </button>
                </div>
                <label htmlFor="task-title" className="font-semibold text-green-900 dark:text-green-100">Title *</label>
                <input
                    id="task-title"
                    name="title"
                    className="border dark:border-gray-600 rounded px-3 py-2 mb-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    value={form.title}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    autoFocus
                    placeholder="Enter task title"
                    title="Task title"
                />
                <label htmlFor="task-desc" className="font-semibold text-green-900 dark:text-green-100">Description</label>
                <textarea
                    id="task-desc"
                    name="description"
                    className="border dark:border-gray-600 rounded px-3 py-2 mb-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    value={form.description}
                    onChange={handleChange}
                    rows={2}
                    maxLength={300}
                    placeholder="Enter description (optional)"
                    title="Task description"
                />
                <label htmlFor="task-due" className="font-semibold text-green-900 dark:text-green-100">Due Date & Time</label>
                <input
                    id="task-due"
                    name="dueDate"
                    type="datetime-local"
                    className="border dark:border-gray-600 rounded px-3 py-2 mb-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={form.dueDate}
                    onChange={handleChange}
                    placeholder="Due date and time"
                    title="Due date and time"
                />
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label htmlFor="task-size" className="font-semibold text-green-900 dark:text-green-100">Size</label>
                        <select
                            id="task-size"
                            name="size"
                            className="border dark:border-gray-600 rounded px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={form.size}
                            onChange={handleChange}
                            title="Task size"
                        >
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Big">Big</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="task-urgency" className="font-semibold text-green-900 dark:text-green-100">Urgency</label>
                        <select
                            id="task-urgency"
                            name="urgency"
                            className="border dark:border-gray-600 rounded px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={form.urgency}
                            onChange={handleChange}
                            title="Task urgency"
                        >
                            <option value="Low">Low</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                {/* Weekly Task Configuration */}
                <div className="flex items-center gap-2 mb-2">
                    <input
                        id="task-weekly"
                        name="isWeekly"
                        type="checkbox"
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={form.isWeekly}
                        onChange={(e) => setForm({ ...form, isWeekly: e.target.checked })}
                    />
                    <label htmlFor="task-weekly" className="font-semibold text-green-900 dark:text-green-100">
                        Weekly Task
                    </label>
                </div>

                {form.isWeekly && (
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label htmlFor="task-times-per-week" className="font-semibold text-green-900 dark:text-green-100">
                                Times per Week
                            </label>
                            <input
                                id="task-times-per-week"
                                name="timesPerWeek"
                                type="number"
                                min="1"
                                max="7"
                                className="border dark:border-gray-600 rounded px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={form.timesPerWeek}
                                onChange={(e) => setForm({ ...form, timesPerWeek: parseInt(e.target.value) || 1 })}
                                placeholder="e.g. 3"
                            />
                        </div>
                    </div>
                )}

                <label htmlFor="task-tags" className="font-semibold text-green-900 dark:text-green-100">Tags (comma or space separated)</label>
                <input
                    id="task-tags"
                    name="tags"
                    className="border dark:border-gray-600 rounded px-3 py-2 mb-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="e.g. work, frog, urgent"
                    maxLength={100}
                    title="Task tags"
                />
                {formError && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{formError}</div>}
                <button
                    type="submit"
                    className="mt-2 bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg disabled:opacity-60 transition-colors"
                    disabled={submitting}
                >
                    {submitting ? "Adding..." : "Add Task"}
                </button>
            </form>
        </div>
    );
} 