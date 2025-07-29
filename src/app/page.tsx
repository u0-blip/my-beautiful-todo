"use client";
import React, { useEffect, useState } from "react";
import { frogs } from "./frogs";
import { Task, Comment, TaskForm, AuthForm, Filters } from "./types";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";
import TaskModal from "./components/TaskModal";
import AuthModal from "./components/AuthModal";

function getRandomFrogIndex() {
  return Math.floor(Math.random() * frogs.length);
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [frogIdx, setFrogIdx] = useState(getRandomFrogIndex());
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    dueDate: "",
    size: "Small",
    urgency: "Normal",
    tags: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    tag: "",
    size: "",
    urgency: "",
    completed: "",
    due: "",
    sort: "created"
  });
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [authForm, setAuthForm] = useState<AuthForm>({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [deletingTasks, setDeletingTasks] = useState<{ [taskId: number]: boolean }>({});
  const [completingTasks, setCompletingTasks] = useState<{ [taskId: number]: boolean }>({});

  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => setAllTags(data.map((t: { name: string }) => t.name)));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.tag) params.append("tags", filters.tag);
    if (filters.size) params.append("size", filters.size);
    if (filters.urgency) params.append("urgency", filters.urgency);
    if (filters.completed) params.append("completed", filters.completed);
    if (filters.due) params.append("due", filters.due);
    if (filters.sort) params.append("sort", filters.sort);
    fetch(`/api/tasks?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, [filters]);

  function openModal() {
    setShowModal(true);
    setFrogIdx(getRandomFrogIndex());
    setForm({
      title: "",
      description: "",
      dueDate: "",
      size: "Small",
      urgency: "Normal",
      tags: "",
    });
    setFormError("");
  }

  function closeModal() {
    setShowModal(false);
    setFormError("");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleRerollFrog() {
    setFrogIdx(getRandomFrogIndex());
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim()) {
      setFormError("Title is required");
      return;
    }
    setSubmitting(true);
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
      }),
    });
    if (!res.ok) {
      setFormError("Failed to create task");
      setSubmitting(false);
      return;
    }
    const newTask = await res.json();
    setTasks([newTask, ...tasks]);
    setShowModal(false);
    setSubmitting(false);
  }



  async function handleDeleteTask(taskId: number) {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }

    setDeletingTasks((prev) => ({ ...prev, [taskId]: true }));
    const res = await fetch(`/api/tasks?id=${taskId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTasks((prev) => prev.filter(task => task.id !== taskId));
    } else {
      alert("Failed to delete task. Please try again.");
    }

    setDeletingTasks((prev) => ({ ...prev, [taskId]: false }));
  }

  async function handleToggleComplete(taskId: number, currentCompleted: boolean) {
    setCompletingTasks((prev) => ({ ...prev, [taskId]: true }));

    const res = await fetch(`/api/tasks?id=${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentCompleted }),
    });

    if (res.ok) {
      setTasks((prev) =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, completed: !currentCompleted }
            : task
        )
      );
    } else {
      alert("Failed to update task. Please try again.");
    }

    setCompletingTasks((prev) => ({ ...prev, [taskId]: false }));
  }

  function handleExport() {
    window.open("/api/export", "_blank");
  }

  async function handleAuthSubmit(type: "signup" | "login") {
    setAuthError("");
    setAuthLoading(true);
    const res = await fetch(`/api/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm),
    });
    if (!res.ok) {
      const data = await res.json();
      setAuthError(data.error || "Failed");
      setAuthLoading(false);
      return;
    }
    setAuthLoading(false);
    setShowSignup(false);
    setShowLogin(false);
    setAuthForm({ email: "", password: "" });
    setAuthError("");
    // Optionally: set user state here
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-500 p-4 relative">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg flex items-center gap-2">
          🐸 Rainforest Frogs Todo
        </h1>
        <div className="flex gap-2">
          <button
            className="bg-green-200 hover:bg-green-300 text-green-900 px-3 py-1 rounded shadow text-sm"
            onClick={() => setShowSignup(true)}
            type="button"
          >
            Signup
          </button>
          <button
            className="bg-blue-200 hover:bg-blue-300 text-blue-900 px-3 py-1 rounded shadow text-sm"
            onClick={() => setShowLogin(true)}
            type="button"
          >
            Login
          </button>
        </div>
      </div>
      <TaskFilters
        filters={filters}
        allTags={allTags}
        onFilterChange={handleFilterChange}
        onResetFilters={() => setFilters({ tag: "", size: "", urgency: "", completed: "", due: "", sort: "created" })}
        onExport={handleExport}
      />
      {/* Change from grid to list */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-white text-xl">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-white text-xl">No tasks yet. Add your first frog task!</div>
        ) : (
          <>
            <TaskList
              title="Current Tasks"
              tasks={tasks.filter(task => !task.completed)}
              deletingTasks={deletingTasks}
              completingTasks={completingTasks}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              emptyMessage="You have no active tasks"
            />

            <TaskList
              title="Done"
              tasks={tasks.filter(task => task.completed)}
              deletingTasks={deletingTasks}
              completingTasks={completingTasks}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              isCompleted={true}
            />
          </>
        )}
      </div>
      <button
        className="fixed bottom-8 right-8 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg p-5 text-3xl flex items-center justify-center transition-transform hover:scale-110"
        title="Add Task"
        onClick={openModal}
      >
        +
      </button>
      <TaskModal
        showModal={showModal}
        frogIdx={frogIdx}
        form={form}
        formError={formError}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={closeModal}
        onChange={handleChange}
        onRerollFrog={handleRerollFrog}
      />
      <AuthModal
        type="signup"
        show={showSignup}
        authForm={authForm}
        authError={authError}
        authLoading={authLoading}
        onSubmit={e => { e.preventDefault(); handleAuthSubmit("signup"); }}
        onClose={() => setShowSignup(false)}
        onChange={e => setAuthForm(f => ({ ...f, [e.target.name]: e.target.value }))}
      />
      <AuthModal
        type="login"
        show={showLogin}
        authForm={authForm}
        authError={authError}
        authLoading={authLoading}
        onSubmit={e => { e.preventDefault(); handleAuthSubmit("login"); }}
        onClose={() => setShowLogin(false)}
        onChange={e => setAuthForm(f => ({ ...f, [e.target.name]: e.target.value }))}
      />
      <div className="absolute inset-0 pointer-events-none select-none opacity-10" aria-hidden>
        {/* Subtle rainforest leaves/frogs background can be added here */}
      </div>
    </main>
  );
}
