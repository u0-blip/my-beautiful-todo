import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

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
      const start = new Date(now.setHours(0,0,0,0));
      const end = new Date(now.setHours(23,59,59,999));
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
  return NextResponse.json(tasks);
}

// POST: Create a new task
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { title, description, dueDate, size, urgency, tags } = data;
  if (!title || !size || !urgency) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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