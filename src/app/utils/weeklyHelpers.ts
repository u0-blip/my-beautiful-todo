import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const startOfWeek = new Date(d);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

export function getEndOfWeek(date: Date = new Date()): Date {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

export async function getWeeklyCompletionCount(taskId: number, userId: number): Promise<number> {
  const startOfWeek = getStartOfWeek();
  const endOfWeek = getEndOfWeek();

  return prisma.taskCompletion.count({
    where: {
      taskId,
      userId,
      date: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
  });
}

export async function isTaskCompleteForWeek(taskId: number, userId: number): Promise<boolean> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { isWeekly: true, timesPerWeek: true }
  });

  if (!task || !task.isWeekly || !task.timesPerWeek) {
    return false;
  }

  const completionCount = await getWeeklyCompletionCount(taskId, userId);
  return completionCount >= task.timesPerWeek;
}

export async function createTaskCompletion(taskId: number, userId: number): Promise<void> {
  await prisma.taskCompletion.create({
    data: {
      taskId,
      userId,
      date: new Date(),
    },
  });
} 