import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Lista ministérios com contagem de servos
export async function GET() {
  const ministries = await prisma.ministry.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { memberships: true } },
    },
  });
  return NextResponse.json(ministries);
}

// Cria um ministério
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!isLeader(user?.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json(
      { message: "Nome do ministério é obrigatório." },
      { status: 400 }
    );
  }
  const slug = slugify(name);
  const ministry = await prisma.ministry.upsert({
    where: { slug },
    update: {},
    create: { name: name.trim(), slug },
  });
  return NextResponse.json(ministry, { status: 201 });
}
