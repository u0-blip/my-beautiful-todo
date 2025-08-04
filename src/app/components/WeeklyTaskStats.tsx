"use client";
import React, { useState, useEffect } from "react";
import { Task } from "../types";

interface WeeklyStats {
  taskId: number;
  userId: number;
  isWeekly: boolean;
  timesPerWeek: number;
  currentWeekCompletions: number;
  isCompleteForWeek: boolean;
  weeklyStats: Array<{
    weekStart: string;
    weekEnd: string;
    completions: number;
    target: number;
    isCurrentWeek: boolean;
  }>;
  recentCompletions: Array<{
    id: number;
    date: string;
  }>;
}

interface WeeklyTaskStatsProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function WeeklyTaskStats({ task, isOpen, onClose }: WeeklyTaskStatsProps) {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && task.isWeekly && task.timesPerWeek) {
      fetchWeeklyStats();
    }
  }, [isOpen, task.id]);

  async function fetchWeeklyStats() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/tasks/weekly-stats?taskId=${task.id}&userId=1`);

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to fetch weekly statistics");
        return;
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
      setError("Failed to fetch weekly statistics");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
            Weekly Progress: {task.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading statistics...</p>
          </div>
        )}

        {error && (
          <div className="text-red-600 dark:text-red-400 text-center py-4">
            {error}
          </div>
        )}

        {stats && (
          <div className="space-y-6">
            {/* Current Week Summary */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                This Week's Progress
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {stats.currentWeekCompletions} / {stats.timesPerWeek}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (stats.currentWeekCompletions / stats.timesPerWeek) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${stats.isCompleteForWeek
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  }`}>
                  {stats.isCompleteForWeek ? 'Complete!' : 'In Progress'}
                </div>
              </div>
            </div>

            {/* Weekly History */}
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                Last 4 Weeks
              </h3>
              <div className="space-y-3">
                {stats.weeklyStats.map((week, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${week.isCurrentWeek
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(week.weekStart).toLocaleDateString()} - {new Date(week.weekEnd).toLocaleDateString()}
                      </span>
                      {week.isCurrentWeek && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full text-xs">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {week.completions} / {week.target}
                      </span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, (week.completions / week.target) * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Completions */}
            {stats.recentCompletions.length > 0 && (
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                  Recent Completions This Week
                </h3>
                <div className="space-y-2">
                  {stats.recentCompletions.map((completion) => (
                    <div
                      key={completion.id}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {new Date(completion.date).toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 