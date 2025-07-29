import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const where: Record<string, unknown> = {};
  if (searchParams.has("taskId")) where.taskId = Number(searchParams.get("taskId"));
  const comments = await prisma.comment.findMany({
    where,
    orderBy: { timestamp: "asc" }
  });
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const { text, taskId } = await req.json();
  if (!text || !taskId) return NextResponse.json({ error: "Text and taskId required" }, { status: 400 });
  const comment = await prisma.comment.create({
    data: {
      text,
      taskId: Number(taskId)
    }
  });
  return NextResponse.json(comment);
} 