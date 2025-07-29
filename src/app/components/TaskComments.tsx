"use client";
import React, { useState, useEffect } from "react";
import { Comment } from "../types";

interface TaskCommentsProps {
    taskId: number;
    isOpen: boolean;
    onToggle: () => void;
}

export default function TaskComments({ taskId, isOpen, onToggle }: TaskCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentInput, setCommentInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && comments.length === 0) {
            fetchComments();
        }
    }, [isOpen, taskId]);

    async function fetchComments() {
        setLoading(true);
        try {
            const res = await fetch(`/api/comments?taskId=${taskId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddComment() {
        const text = commentInput.trim();
        if (!text) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, taskId }),
            });

            if (res.ok) {
                const newComment = await res.json();
                setComments(prev => [...prev, newComment]);
                setCommentInput("");
            }
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setSubmitting(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="bg-green-50 dark:bg-green-900/20 rounded p-2 mt-1">
            {loading ? (
                <div className="text-green-900 dark:text-green-100 text-xs">Loading comments...</div>
            ) : (
                <>
                    <div className="flex flex-col gap-1 mb-2 max-h-32 overflow-y-auto">
                        {comments.length === 0 ? (
                            <div className="text-green-900 dark:text-green-100 text-xs">No comments yet.</div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-2 items-baseline">
                                    <span className="text-green-900 dark:text-green-100 text-xs">{comment.text}</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-[10px]">
                                        {new Date(comment.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex gap-2 mt-1">
                        <input
                            className="border dark:border-gray-600 rounded px-2 py-1 text-xs flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            value={commentInput}
                            onChange={e => setCommentInput(e.target.value)}
                            placeholder="Add a comment..."
                            maxLength={200}
                            title="Add a comment"
                            onKeyPress={e => e.key === 'Enter' && handleAddComment()}
                        />
                        <button
                            className="bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded px-3 py-1 text-xs disabled:opacity-60 transition-colors"
                            onClick={handleAddComment}
                            disabled={submitting || !commentInput.trim()}
                            type="button"
                        >
                            {submitting ? "Adding..." : "Add"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
} 