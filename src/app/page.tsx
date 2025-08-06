"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Task, Filters } from "./types";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";
import TaskModal from "./components/TaskModal";
import AuthModal from "./components/AuthModal";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allCompletedTasks, setAllCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

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

  // Function to fetch all completed tasks
  const fetchAllCompletedTasks = async () => {
    const params = new URLSearchParams();
    params.append("showAllCompleted", "true");
    params.append("completed", "true");
    if (filters.sort) params.append("sort", filters.sort);

    const response = await fetch(`/api/tasks?${params.toString()}`);
    const data = await response.json();
    setAllCompletedTasks(data);
    setShowAllCompleted(true);
  };

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleExport() {
    window.open("/api/export", "_blank");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 relative">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg flex items-center gap-2">
          🐸 Rainforest Frogs Todo
        </h1>
        <div className="flex gap-2">
          <button
            className="bg-green-200 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600 text-green-900 dark:text-green-100 px-3 py-1 rounded shadow text-sm transition-colors"
            onClick={() => setShowSignup(true)}
            type="button"
          >
            Signup
          </button>
          <button
            className="bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-600 text-blue-900 dark:text-blue-100 px-3 py-1 rounded shadow text-sm transition-colors"
            onClick={() => setShowLogin(true)}
            type="button"
          >
            Login
          </button>
          <Link
            href="/admin"
            className="bg-purple-200 hover:bg-purple-300 dark:bg-purple-700 dark:hover:bg-purple-600 text-purple-900 dark:text-purple-100 px-3 py-1 rounded shadow text-sm transition-colors"
          >
            Admin
          </Link>
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
            {/* Completed Tasks Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">Done</h2>
                <button
                  onClick={fetchAllCompletedTasks}
                  className="bg-green-200 hover:bg-green-300 dark:bg-green-700 dark:hover:bg-green-600 text-green-900 dark:text-green-100 px-4 py-2 rounded-lg shadow text-sm transition-colors flex items-center gap-2"
                >
                  <span>📋</span>
                  See All Completed Tasks
                </button>
              </div>

              {showAllCompleted ? (
                <TaskList
                  title="All Completed Tasks"
                  tasks={allCompletedTasks}
                  onTaskUpdate={(updatedTask) => {
                    setAllCompletedTasks(prev => prev.map(task =>
                      task.id === updatedTask.id ? updatedTask : task
                    ));
                    setTasks(prev => prev.map(task =>
                      task.id === updatedTask.id ? updatedTask : task
                    ));
                  }}
                  onTaskDeleted={(taskId) => {
                    setAllCompletedTasks(prev => prev.filter(task => task.id !== taskId));
                    setTasks(prev => prev.filter(task => task.id !== taskId));
                  }}
                  onNewCompletedTask={(newTask) => {
                    setAllCompletedTasks(prev => [newTask, ...prev]);
                    setTasks(prev => [newTask, ...prev]);
                  }}
                  isCompleted={true}
                  onClose={() => setShowAllCompleted(false)}
                  showCloseButton={true}
                />
              ) : (
                <TaskList
                  title="Recently Completed"
                  tasks={tasks.filter(task => task.completed)}
                  onTaskUpdate={(updatedTask) => {
                    setTasks(prev => prev.map(task =>
                      task.id === updatedTask.id ? updatedTask : task
                    ));
                  }}
                  onTaskDeleted={(taskId) => {
                    setTasks(prev => prev.filter(task => task.id !== taskId));
                  }}
                  onNewCompletedTask={(newTask) => {
                    setTasks(prev => [newTask, ...prev]);
                    // Also add to allCompletedTasks if we're showing all completed
                    if (showAllCompleted) {
                      setAllCompletedTasks(prev => [newTask, ...prev]);
                    }
                  }}
                  isCompleted={true}
                  emptyMessage="No recently completed tasks"
                />
              )}
            </div>

            {/* Current Tasks Section */}
            <TaskList
              title="Current Tasks"
              tasks={tasks.filter(task => {
                // Filter out completed tasks
                if (task.completed) return false;

                // Filter out weekly tasks that are complete for the week
                if (task.isWeekly && task.timesPerWeek && task.weeklyCompletionCount) {
                  return task.weeklyCompletionCount < task.timesPerWeek;
                }

                return true;
              })}
              onTaskUpdate={(updatedTask) => {
                setTasks(prev => prev.map(task =>
                  task.id === updatedTask.id ? updatedTask : task
                ));
              }}
              onTaskDeleted={(taskId) => {
                setTasks(prev => prev.filter(task => task.id !== taskId));
              }}
              onNewCompletedTask={(newTask) => {
                setTasks(prev => [newTask, ...prev]);
              }}
              emptyMessage="You have no active tasks"
            />
          </>
        )}
      </div>
      <button
        className="fixed bottom-8 right-8 bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-full shadow-lg p-5 text-3xl flex items-center justify-center transition-transform hover:scale-110"
        title="Add Task"
        onClick={openModal}
      >
        +
      </button>
      <TaskModal
        showModal={showModal}
        onClose={closeModal}
        onTaskCreated={(newTask) => {
          setTasks(prev => [newTask, ...prev]);
        }}
      />
      <AuthModal
        type="signup"
        show={showSignup}
        onClose={() => setShowSignup(false)}
      />
      <AuthModal
        type="login"
        show={showLogin}
        onClose={() => setShowLogin(false)}
      />
      <div className="absolute inset-0 pointer-events-none select-none opacity-10" aria-hidden>
        {/* Subtle rainforest leaves/frogs background can be added here */}
      </div>
    </main>
  );
}
