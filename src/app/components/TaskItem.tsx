"use client";
import React from "react";
import { frogs } from "../frogs";
import { Task, Comment } from "../types";

interface TaskItemProps {
    task: Task;
    frog: { name: string; svg: string };
    openComments: { [taskId: number]: boolean };
    comments: { [taskId: number]: Comment[] };
    commentInputs: { [taskId: number]: string };
    commentLoading: { [taskId: number]: boolean };
    commentSubmitting: { [taskId: number]: boolean };
    deletingTasks: { [taskId: number]: boolean };
    completingTasks: { [taskId: number]: boolean };
    onToggleComments: (taskId: number) => void;
    onCommentInput: (taskId: number, value: string) => void;
    onAddComment: (taskId: number) => void;
    onDeleteTask: (taskId: number) => void;
    onToggleComplete: (taskId: number, currentCompleted: boolean) => void;
    isCompleted?: boolean;
}

export default function TaskItem({
    task,
    frog,
    openComments,
    comments,
    commentInputs,
    commentLoading,
    commentSubmitting,
    deletingTasks,
    completingTasks,
    onToggleComments,
    onCommentInput,
    onAddComment,
    onDeleteTask,
    onToggleComplete,
    isCompleted = false
}: TaskItemProps) {
    return (
        <li className={`bg-white/90 rounded-xl shadow-lg p-4 flex gap-4 items-start border-l-8 border-green-800/60 hover:bg-green-50 transition ${isCompleted ? 'opacity-75' : ''}`}>
            <span className="shrink-0 w-12 h-12" title={frog.name} dangerouslySetInnerHTML={{ __html: frog.svg }} />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-green-900'}`}>{task.title}</span>
                </div>
                <div className="text-green-800 text-sm mb-2">{task.description}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-900 rounded-full text-xs">Size: {task.size}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${task.urgency === 'Critical' ? 'bg-red-400 text-white' : task.urgency === 'High' ? 'bg-orange-300 text-orange-900' : task.urgency === 'Normal' ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'}`}>Urgency: {task.urgency}</span>
                    {task.dueDate && <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded-full text-xs">Due: {new Date(task.dueDate).toLocaleString()}</span>}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {task.tags.map((t) => (
                        <span key={t.tag.name} className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full text-xs">#{t.tag.name}</span>
                    ))}
                </div>
                <div className="flex gap-2 mb-2">
                    <button
                        className="text-green-700 hover:underline text-xs"
                        onClick={() => onToggleComments(task.id)}
                    >
                        {openComments[task.id] ? "Hide Comments" : "Show Comments"}
                    </button>
                    <button
                        className="text-red-600 hover:text-red-800 disabled:opacity-60 p-1 rounded hover:bg-red-50 transition-colors"
                        onClick={() => onDeleteTask(task.id)}
                        disabled={deletingTasks[task.id]}
                        title="Delete task"
                    >
                        {deletingTasks[task.id] ? (
                            <span className="text-xs">Deleting...</span>
                        ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
                {openComments[task.id] && (
                    <div className="bg-green-50 rounded p-2 mt-1">
                        {commentLoading[task.id] ? (
                            <div className="text-green-900 text-xs">Loading comments...</div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-1 mb-2 max-h-32 overflow-y-auto">
                                    {(comments[task.id] || []).length === 0 ? (
                                        <div className="text-green-900 text-xs">No comments yet.</div>
                                    ) : (
                                        comments[task.id].map((c) => (
                                            <div key={c.id} className="flex gap-2 items-baseline">
                                                <span className="text-green-900 text-xs">{c.text}</span>
                                                <span className="text-gray-500 text-[10px]">{new Date(c.timestamp).toLocaleString()}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        className="border rounded px-2 py-1 text-xs flex-1"
                                        value={commentInputs[task.id] || ""}
                                        onChange={e => onCommentInput(task.id, e.target.value)}
                                        placeholder="Add a comment..."
                                        maxLength={200}
                                        title="Add a comment"
                                    />
                                    <button
                                        className="bg-green-700 hover:bg-green-800 text-white rounded px-3 py-1 text-xs disabled:opacity-60"
                                        onClick={() => onAddComment(task.id)}
                                        disabled={commentSubmitting[task.id] || !(commentInputs[task.id]?.trim())}
                                        type="button"
                                    >
                                        {commentSubmitting[task.id] ? "Adding..." : "Add"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="shrink-0 flex items-center">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id, task.completed)}
                    disabled={completingTasks[task.id]}
                    className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 disabled:opacity-60 cursor-pointer"
                    title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                />
            </div>
        </li>
    );
} 