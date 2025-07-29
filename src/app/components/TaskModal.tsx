"use client";
import React from "react";
import { frogs } from "../frogs";
import { TaskForm } from "../types";

interface TaskModalProps {
    showModal: boolean;
    frogIdx: number;
    form: TaskForm;
    formError: string;
    submitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onRerollFrog: () => void;
}

export default function TaskModal({
    showModal,
    frogIdx,
    form,
    formError,
    submitting,
    onSubmit,
    onClose,
    onChange,
    onRerollFrog
}: TaskModalProps) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <form
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative flex flex-col gap-4"
                onSubmit={onSubmit}
            >
                <button
                    type="button"
                    className="absolute top-3 right-3 text-green-900 hover:text-red-600 text-2xl"
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
                        className="text-xs text-green-700 hover:underline"
                        onClick={onRerollFrog}
                        tabIndex={-1}
                    >
                        Reroll Frog
                    </button>
                </div>
                <label htmlFor="task-title" className="font-semibold text-green-900">Title *</label>
                <input
                    id="task-title"
                    name="title"
                    className="border rounded px-3 py-2 mb-1"
                    value={form.title}
                    onChange={onChange}
                    required
                    maxLength={100}
                    autoFocus
                    placeholder="Enter task title"
                    title="Task title"
                />
                <label htmlFor="task-desc" className="font-semibold text-green-900">Description</label>
                <textarea
                    id="task-desc"
                    name="description"
                    className="border rounded px-3 py-2 mb-1"
                    value={form.description}
                    onChange={onChange}
                    rows={2}
                    maxLength={300}
                    placeholder="Enter description (optional)"
                    title="Task description"
                />
                <label htmlFor="task-due" className="font-semibold text-green-900">Due Date & Time</label>
                <input
                    id="task-due"
                    name="dueDate"
                    type="datetime-local"
                    className="border rounded px-3 py-2 mb-1"
                    value={form.dueDate}
                    onChange={onChange}
                    placeholder="Due date and time"
                    title="Due date and time"
                />
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label htmlFor="task-size" className="font-semibold text-green-900">Size</label>
                        <select
                            id="task-size"
                            name="size"
                            className="border rounded px-3 py-2 w-full"
                            value={form.size}
                            onChange={onChange}
                            title="Task size"
                        >
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Big">Big</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="task-urgency" className="font-semibold text-green-900">Urgency</label>
                        <select
                            id="task-urgency"
                            name="urgency"
                            className="border rounded px-3 py-2 w-full"
                            value={form.urgency}
                            onChange={onChange}
                            title="Task urgency"
                        >
                            <option value="Low">Low</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>
                <label htmlFor="task-tags" className="font-semibold text-green-900">Tags (comma or space separated)</label>
                <input
                    id="task-tags"
                    name="tags"
                    className="border rounded px-3 py-2 mb-1"
                    value={form.tags}
                    onChange={onChange}
                    placeholder="e.g. work, frog, urgent"
                    maxLength={100}
                    title="Task tags"
                />
                {formError && <div className="text-red-600 text-sm mt-1">{formError}</div>}
                <button
                    type="submit"
                    className="mt-2 bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full shadow-lg disabled:opacity-60"
                    disabled={submitting}
                >
                    {submitting ? "Adding..." : "Add Task"}
                </button>
            </form>
        </div>
    );
} 