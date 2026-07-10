export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";

// Lista células com contagem de pessoas
export async function GET() {
  const cells = await prisma.cell.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { people: true } },
      people: {
        where: { role: "CELL_LEADER" },
        select: { id: true, name: true },
      },
    },
  });
  return NextResponse.json(cells);
}

// Cria célula e, opcionalmente, já o líder dela
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!isLeader(user?.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  const { name, leaderName, leaderEmail } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json(
      { message: "Nome da célula é obrigatório." },
      { status: 400 }
    );
  }

  const cell = await prisma.cell.create({ data: { name: name.trim() } });

  if (leaderName?.trim() && leaderEmail?.trim()) {
    await prisma.person.create({
      data: {
        name: leaderName.trim(),
        email: leaderEmail.trim().toLowerCase(),
        role: "CELL_LEADER",
        cellId: cell.id,
      },
    });
  }

  return NextResponse.json(cell, { status: 201 });
}
