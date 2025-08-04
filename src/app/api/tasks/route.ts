import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { createTaskCompletion, getWeeklyCompletionCount, isTaskCompleteForWeek } from "@/app/utils/weeklyHelpers";

const prisma = new PrismaClient();

type TagConnect = { where: { name: string }, create: { name: string } };

// GET: List tasks with optional filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Filtering logic (size, urgency, tags, completed, dueDate)
  const where: Record<string, unknown> = {};
  if (searchParams.has("size")) where.size = searchParams.get("size");
  if (searchParams.has("urgency")) where.urgency = searchParams.get("urgency");
  if (searchParams.has("completed")) where.completed = searchParams.get("completed") === "true";
  if (searchParams.has("due")) {
    const due = searchParams.get("due");
    const now = new Date();
    if (due === "today") {
      const start = new Date(now.setHours(0, 0, 0, 0));
      const end = new Date(now.setHours(23, 59, 59, 999));
      where.dueDate = { gte: start, lte: end };
    } else if (due === "week") {
      const start = new Date(now.setDate(now.getDate() - now.getDay()));
      const end = new Date(now.setDate(start.getDate() + 6));
      where.dueDate = { gte: start, lte: end };
    } else if (due === "overdue") {
      where.dueDate = { lt: new Date() };
      where.completed = false;
    }
  }
  // Tag filtering
  if (searchParams.has("tags")) {
    const tags = searchParams.getAll("tags");
    where.tags = {
      some: {
        tag: {
          name: { in: tags }
        }
      }
    };
  }
  // Sorting
  let orderBy: Record<string, unknown>[] = [{ createdAt: "asc" }];
  if (searchParams.has("sort")) {
    const sort = searchParams.get("sort");
    if (sort === "due") orderBy = [{ dueDate: "asc" }];
    if (sort === "created") orderBy = [{ createdAt: "asc" }];
  }
  const tasks = await prisma.task.findMany({
    where,
    orderBy,
    include: {
      tags: { include: { tag: true } },
      comments: true
    }
  });

  // Add weekly completion information for weekly tasks
  const tasksWithWeeklyInfo = await Promise.all(
    tasks.map(async (task) => {
      if (task.isWeekly && task.timesPerWeek) {
        const weeklyCompletionCount = await getWeeklyCompletionCount(task.id, 1); // Default to user 1
        return {
          ...task,
          weeklyCompletionCount,
        };
      }
      return task;
    })
  );

  return NextResponse.json(tasksWithWeeklyInfo);
}

// POST: Create a new task
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { title, description, dueDate, size, urgency, tags, isWeekly, timesPerWeek } = data;
  if (!title || !size || !urgency) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate weekly task parameters
  if (isWeekly && (!timesPerWeek || timesPerWeek < 1)) {
    return NextResponse.json({ error: "Weekly tasks must specify timesPerWeek >= 1" }, { status: 400 });
  }

  // Create or connect tags
  const tagConnect = tags?.map((name: string) => ({
    where: { name },
    create: { name }
  })) || [];

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      size,
      urgency,
      isWeekly: isWeekly || false,
      timesPerWeek: isWeekly ? timesPerWeek : null,
      tags: {
        create: tagConnect.map((tc: TagConnect) => ({ tag: { connectOrCreate: tc } }))
      }
    },
    include: {
      tags: { include: { tag: true } },
      comments: true
    }
  });
  return NextResponse.json(task);
}

// DELETE: Delete a task by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("id");

  if (!taskId) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const id = parseInt(taskId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }

  try {
    // Delete related records first (comments, task tags, and task completions)
    await prisma.comment.deleteMany({
      where: { taskId: id }
    });

    await prisma.taskTag.deleteMany({
      where: { taskId: id }
    });

    await prisma.taskCompletion.deleteMany({
      where: { taskId: id }
    });

    // Delete the task
    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}

// PATCH: Update a task (e.g., mark as completed)
export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("id");

  if (!taskId) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const id = parseInt(taskId);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }

  try {
    const data = await req.json();
    const { completed, userId } = data;

    if (typeof completed !== 'boolean') {
      return NextResponse.json({ error: "Completed status is required" }, { status: 400 });
    }

    // Get the task to check if it's weekly
    const task = await prisma.task.findUnique({
      where: { id },
      select: { isWeekly: true, timesPerWeek: true }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    let updatedCompleted = completed;

    // Handle weekly task logic
    if (task.isWeekly && task.timesPerWeek) {
      if (completed) {
        // Create a completion record
        await createTaskCompletion(id, userId || 1); // Default to user 1 if not provided

        // Check if task is complete for the week
        const isCompleteForWeek = await isTaskCompleteForWeek(id, userId || 1);
        updatedCompleted = isCompleteForWeek;
      } else {
        // For uncompleting, we could remove the latest completion record
        // For now, just set completed to false
        updatedCompleted = false;
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed: updatedCompleted },
      include: {
        tags: { include: { tag: true } },
        comments: true
      }
    });

    // Get weekly completion count for response
    let weeklyCompletionCount = null;
    if (task.isWeekly && task.timesPerWeek) {
      weeklyCompletionCount = await getWeeklyCompletionCount(id, userId || 1);
    }

    return NextResponse.json({
      ...updatedTask,
      weeklyCompletionCount,
      timesPerWeek: task.timesPerWeek
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}