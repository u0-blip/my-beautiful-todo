import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tags = await prisma.tag.findMany();
  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const tag = await prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name }
  });
  return NextResponse.json(tag);
} 