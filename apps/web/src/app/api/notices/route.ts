export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lista avisos (opcional: ?scope=COMUNICACAO)
export async function GET(req: NextRequest) {
  const scope = req.nextUrl.searchParams.get("scope");
  const notices = await prisma.notice.findMany({
    where: scope ? { scope } : undefined,
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(notices);
}

// Cria um aviso
export async function POST(req: NextRequest) {
  const { title, body, scope, pinned } = await req.json();
  if (!title?.trim() || !body?.trim() || !scope) {
    return NextResponse.json(
      { message: "Título, mensagem e alcance são obrigatórios." },
      { status: 400 }
    );
  }
  const notice = await prisma.notice.create({
    data: {
      title: title.trim(),
      body: body.trim(),
      scope,
      pinned: !!pinned,
    },
  });
  return NextResponse.json(notice, { status: 201 });
}
