export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lista todas as categorias (opcionalmente filtra por tipo: ?type=PERSON)
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const categories = await prisma.category.findMany({
    where: type ? { type } : undefined,
    orderBy: { name: "asc" },
    include: { _count: { select: { media: true } } },
  });
  return NextResponse.json(categories);
}

// Cria uma categoria nova (pessoa ou evento)
export async function POST(req: NextRequest) {
  const { name, type } = await req.json();
  if (!name?.trim() || !type) {
    return NextResponse.json(
      { message: "Nome e tipo são obrigatórios." },
      { status: 400 }
    );
  }
  const category = await prisma.category.upsert({
    where: { name_type: { name: name.trim(), type } },
    update: {},
    create: { name: name.trim(), type },
  });
  return NextResponse.json(category, { status: 201 });
}
