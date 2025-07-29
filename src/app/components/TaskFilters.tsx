"use client";
import React from "react";
import { Filters } from "../types";

interface TaskFiltersProps {
    filters: Filters;
    allTags: string[];
    onFilterChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    onResetFilters: () => void;
    onExport: () => void;
}

export default function TaskFilters({
    filters,
    allTags,
    onFilterChange,
    onResetFilters,
    onExport
}: TaskFiltersProps) {
    return (
        <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-3 items-center bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 shadow">
            <select
                name="tag"
                value={filters.tag}
                onChange={onFilterChange}
                className="border dark:border-gray-600 rounded px-2 py-1 text-green-900 dark:text-green-100 bg-white dark:bg-gray-700"
                title="Filter by tag"
            >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>
            <select
                name="size"
                value={filters.size}
                onChange={onFilterChange}
                className="border dark:border-gray-600 rounded px-2 py-1 text-green-900 dark:text-green-100 bg-white dark:bg-gray-700"
                title="Filter by size"
            >
                <option value="">All Sizes</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Big">Big</option>
            </select>
            <select
                name="urgency"
                value={filters.urgency}
                onChange={onFilterChange}
                className="border dark:border-gray-600 rounded px-2 py-1 text-green-900 dark:text-green-100 bg-white dark:bg-gray-700"
                title="Filter by urgency"
            >
                <option value="">All Urgencies</option>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
            </select>
            <select
                name="completed"
                value={filters.completed}
                onChange={onFilterChange}
                className="border dark:border-gray-600 rounded px-2 py-1 text-green-900 dark:text-green-100 bg-white dark:bg-gray-700"
                title="Filter by completion"
            >
                <option value="">All Statuses</option>
                <option value="true">Completed</option>
                <option value="false">Incomplete</option>
            </select>
            <select
                name="due"
                value={filters.due}
                onChange={onFilterChange}
                className="border dark:border-gray-600 rounded px-2 py-1 text-green-900 dark:text-green-100 bg-white dark:bg-gray-700"
                title="Filter by due date"
            >
                <option value="">All Due Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="overdue">Overdue</option>
            </select>
            <select
                name="sort"
                value={filters.sort}
                onChange={onFilterChange}
                className="border dark:border-gray-600 rounded px-2 py-1 text-green-900 dark:text-green-100 bg-white dark:bg-gray-700"
                title="Sort by"
            >
                <option value="created">Sort: Created</option>
                <option value="due">Sort: Due Date</option>
            </select>
            <button
                className="ml-auto bg-green-200 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600 text-green-900 dark:text-green-100 px-3 py-1 rounded shadow text-sm transition-colors"
                onClick={onResetFilters}
                type="button"
            >
                Reset Filters
            </button>
            <button
                className="bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-900 dark:text-blue-100 px-3 py-1 rounded shadow text-sm transition-colors"
                onClick={onExport}
                type="button"
            >
                Export to JSON
            </button>
        </div>
    );
} 