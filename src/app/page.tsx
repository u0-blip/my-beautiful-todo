"use client";
import React, { useEffect, useState } from "react";
import { frogs } from "./frogs";

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  size: string;
  urgency: string;
  completed: boolean;
  createdAt: string;
  tags: { tag: { name: string } }[];
}

interface Comment {
  id: number;
  text: string;
  timestamp: string;
  taskId: number;
}

function getRandomFrogIndex() {
  return Math.floor(Math.random() * frogs.length);
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [frogIdx, setFrogIdx] = useState(getRandomFrogIndex());
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    size: "Small",
    urgency: "Normal",
    tags: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    tag: "",
    size: "",
    urgency: "",
    completed: "",
    due: "",
    sort: "created"
  });
  const [allTags, setAllTags] = useState<string[]>([]);
  const [openComments, setOpenComments] = useState<{ [taskId: number]: boolean }>({});
  const [comments, setComments] = useState<{ [taskId: number]: Comment[] }>({});
  const [commentInputs, setCommentInputs] = useState<{ [taskId: number]: string }>({});
  const [commentLoading, setCommentLoading] = useState<{ [taskId: number]: boolean }>({});
  const [commentSubmitting, setCommentSubmitting] = useState<{ [taskId: number]: boolean }>({});
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

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

  function toggleComments(taskId: number) {
    setOpenComments((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    if (!comments[taskId]) {
      setCommentLoading((prev) => ({ ...prev, [taskId]: true }));
      fetch(`/api/comments?taskId=${taskId}`)
        .then((res) => res.json())
        .then((data) => {
          setComments((prev) => ({ ...prev, [taskId]: data }));
          setCommentLoading((prev) => ({ ...prev, [taskId]: false }));
        });
    }
  }

  function handleCommentInput(taskId: number, value: string) {
    setCommentInputs((prev) => ({ ...prev, [taskId]: value }));
  }

  async function handleAddComment(taskId: number) {
    const text = commentInputs[taskId]?.trim();
    if (!text) return;
    setCommentSubmitting((prev) => ({ ...prev, [taskId]: true }));
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, taskId }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => ({ ...prev, [taskId]: [...(prev[taskId] || []), newComment] }));
      setCommentInputs((prev) => ({ ...prev, [taskId]: "" }));
    }
    setCommentSubmitting((prev) => ({ ...prev, [taskId]: false }));
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
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap gap-3 items-center bg-white/80 rounded-xl p-4 shadow">
        <select
          name="tag"
          value={filters.tag}
          onChange={handleFilterChange}
          className="border rounded px-2 py-1 text-green-900"
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
          onChange={handleFilterChange}
          className="border rounded px-2 py-1 text-green-900"
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
          onChange={handleFilterChange}
          className="border rounded px-2 py-1 text-green-900"
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
          onChange={handleFilterChange}
          className="border rounded px-2 py-1 text-green-900"
          title="Filter by completion"
        >
          <option value="">All Statuses</option>
          <option value="true">Completed</option>
          <option value="false">Incomplete</option>
        </select>
        <select
          name="due"
          value={filters.due}
          onChange={handleFilterChange}
          className="border rounded px-2 py-1 text-green-900"
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
          onChange={handleFilterChange}
          className="border rounded px-2 py-1 text-green-900"
          title="Sort by"
        >
          <option value="created">Sort: Created</option>
          <option value="due">Sort: Due Date</option>
        </select>
        <button
          className="ml-auto bg-green-200 hover:bg-green-300 text-green-900 px-3 py-1 rounded shadow text-sm"
          onClick={() => setFilters({ tag: "", size: "", urgency: "", completed: "", due: "", sort: "created" })}
          type="button"
        >
          Reset Filters
        </button>
        <button
          className="bg-blue-200 hover:bg-blue-300 text-blue-900 px-3 py-1 rounded shadow text-sm"
          onClick={handleExport}
          type="button"
        >
          Export to JSON
        </button>
      </div>
      {/* Change from grid to list */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-white text-xl">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-white text-xl">No tasks yet. Add your first frog task!</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {tasks.map((task) => {
              const frog = frogs[task.id % frogs.length];
              return (
                <li key={task.id} className="bg-white/90 rounded-xl shadow-lg p-4 flex gap-4 items-start border-l-8 border-green-800/60 hover:bg-green-50 transition">
                  <span className="shrink-0 w-12 h-12" title={frog.name} dangerouslySetInnerHTML={{ __html: frog.svg }} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-green-900">{task.title}</span>
                      {task.completed && <span className="ml-2 px-2 py-0.5 bg-green-200 text-green-900 rounded-full text-xs">Done</span>}
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
                    <button
                      className="text-green-700 hover:underline text-xs mb-2"
                      onClick={() => toggleComments(task.id)}
                    >
                      {openComments[task.id] ? "Hide Comments" : "Show Comments"}
                    </button>
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
                                onChange={e => handleCommentInput(task.id, e.target.value)}
                                placeholder="Add a comment..."
                                maxLength={200}
                                title="Add a comment"
                              />
                              <button
                                className="bg-green-700 hover:bg-green-800 text-white rounded px-3 py-1 text-xs disabled:opacity-60"
                                onClick={() => handleAddComment(task.id)}
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
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <button
        className="fixed bottom-8 right-8 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg p-5 text-3xl flex items-center justify-center transition-transform hover:scale-110"
        title="Add Task"
        onClick={openModal}
      >
        +
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-green-900 hover:text-red-600 text-2xl"
              onClick={closeModal}
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
                onClick={handleRerollFrog}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
                  onChange={handleChange}
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
            <label htmlFor="task-tags" className="font-semibold text-green-900">Tags (comma or space separated)</label>
            <input
              id="task-tags"
              name="tags"
              className="border rounded px-3 py-2 mb-1"
              value={form.tags}
              onChange={handleChange}
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
      )}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs relative flex flex-col gap-4"
            onSubmit={e => { e.preventDefault(); handleAuthSubmit("signup"); }}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-green-900 hover:text-red-600 text-2xl"
              onClick={() => setShowSignup(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-green-900 mb-2">Signup</h2>
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-3 py-2"
              value={authForm.email}
              onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded px-3 py-2"
              value={authForm.password}
              onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
              required
            />
            {authError && <div className="text-red-600 text-sm mt-1">{authError}</div>}
            <button
              type="submit"
              className="mt-2 bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full shadow-lg disabled:opacity-60"
              disabled={authLoading}
            >
              {authLoading ? "Signing up..." : "Signup"}
            </button>
          </form>
        </div>
      )}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs relative flex flex-col gap-4"
            onSubmit={e => { e.preventDefault(); handleAuthSubmit("login"); }}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-green-900 hover:text-red-600 text-2xl"
              onClick={() => setShowLogin(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-blue-900 mb-2">Login</h2>
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-3 py-2"
              value={authForm.email}
              onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded px-3 py-2"
              value={authForm.password}
              onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}
              required
            />
            {authError && <div className="text-red-600 text-sm mt-1">{authError}</div>}
            <button
              type="submit"
              className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full shadow-lg disabled:opacity-60"
              disabled={authLoading}
            >
              {authLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10" aria-hidden>
        {/* Subtle rainforest leaves/frogs background can be added here */}
      </div>
    </main>
  );
}
