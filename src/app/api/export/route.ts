import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      tags: { include: { tag: true } },
      comments: true
    }
  });
  const exportData = tasks.map((task: {
    title: string;
    description: string | null;
    size: string;
    urgency: string;
    tags: { tag: { name: string } }[];
    dueDate: Date | null;
    createdAt: Date;
    comments: { text: string; timestamp: Date }[];
  }) => ({
    title: task.title,
    description: task.description,
    size: task.size,
    urgency: task.urgency,
    tags: task.tags.map((t: { tag: { name: string } }) => t.tag.name),
    due_date: task.dueDate,
    created_at: task.createdAt,
    comments: task.comments.map((c: { text: string; timestamp: Date }) => ({ text: c.text, timestamp: c.timestamp }))
  }));
  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=tasks-export.json"
    }
  });
} 