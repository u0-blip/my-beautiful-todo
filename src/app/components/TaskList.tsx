"use client";
import React from "react";
import TaskItem from "./TaskItem";
import { frogs } from "../frogs";
import { Task, Comment } from "../types";

interface TaskListProps {
    title: string;
    tasks: Task[];
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
    emptyMessage?: string;
}

export default function TaskList({
    title,
    tasks,
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
                                openComments={openComments}
                                comments={comments}
                                commentInputs={commentInputs}
                                commentLoading={commentLoading}
                                commentSubmitting={commentSubmitting}
                                deletingTasks={deletingTasks}
                                completingTasks={completingTasks}
                                onToggleComments={onToggleComments}
                                onCommentInput={onCommentInput}
                                onAddComment={onAddComment}
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