import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const lessons = await prisma.lesson.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(lessons);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!isLeader(user?.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  const { title, description, category, videoUrl, content } = await req.json();
  if (!title?.trim() || !category) {
    return NextResponse.json(
      { message: "Título e categoria são obrigatórios." },
      { status: 400 }
    );
  }
  const lesson = await prisma.lesson.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      category,
      videoUrl: videoUrl?.trim() || null,
      content: content?.trim() || null,
    },
  });
  return NextResponse.json(lesson, { status: 201 });
}
