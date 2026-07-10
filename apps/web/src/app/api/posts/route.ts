export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }
  const { title, description, date, platform } = await req.json();
  if (!title?.trim() || !date || !platform) {
    return NextResponse.json(
      { message: "Título, data e plataforma são obrigatórios." },
      { status: 400 }
    );
  }
  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      date: new Date(date),
      platform,
    },
  });
  return NextResponse.json(post, { status: 201 });
}
