import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { getStartOfWeek, getEndOfWeek } from "@/app/utils/weeklyHelpers";

const prisma = new PrismaClient();

// GET: Get weekly completion statistics for a specific task
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  const userId = searchParams.get("userId") || "1"; // Default to user 1

  if (!taskId) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const id = parseInt(taskId);
  const uid = parseInt(userId);

  if (isNaN(id) || isNaN(uid)) {
    return NextResponse.json({ error: "Invalid task ID or user ID" }, { status: 400 });
  }

  try {
    // Get the task to check if it's weekly
    const task = await prisma.task.findUnique({
      where: { id },
      select: { isWeekly: true, timesPerWeek: true }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (!task.isWeekly || !task.timesPerWeek) {
      return NextResponse.json({
        error: "This task is not a weekly task",
        isWeekly: false
      }, { status: 400 });
    }

    // Get completions for the current week
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();

    const weeklyCompletions = await prisma.taskCompletion.findMany({
      where: {
        taskId: id,
        userId: uid,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Get completions for the last 4 weeks for trend analysis
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const recentCompletions = await prisma.taskCompletion.findMany({
      where: {
        taskId: id,
        userId: uid,
        date: {
          gte: fourWeeksAgo,
        },
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Group completions by week
    const weeklyStats = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startOfWeek);
      weekStart.setDate(weekStart.getDate() - (7 * i));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekCompletions = recentCompletions.filter(
        completion => completion.date >= weekStart && completion.date <= weekEnd
      );

      weeklyStats.unshift({
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        completions: weekCompletions.length,
        target: task.timesPerWeek,
        isCurrentWeek: i === 0
      });
    }

    return NextResponse.json({
      taskId: id,
      userId: uid,
      isWeekly: true,
      timesPerWeek: task.timesPerWeek,
      currentWeekCompletions: weeklyCompletions.length,
      isCompleteForWeek: weeklyCompletions.length >= task.timesPerWeek,
      weeklyStats,
      recentCompletions: weeklyCompletions.map(c => ({
        id: c.id,
        date: c.date.toISOString()
      }))
    });

  } catch (error) {
    console.error("Error getting weekly stats:", error);
    return NextResponse.json({ error: "Failed to get weekly statistics" }, { status: 500 });
  }
} 