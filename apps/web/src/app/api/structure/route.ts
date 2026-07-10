export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Visão consolidada da estrutura (para a tela de consulta "Equipe")
export async function GET() {
  const [generalLeaders, cells, ministries] = await Promise.all([
    prisma.person.findMany({
      where: { role: "GENERAL_LEADER" },
      select: { id: true, name: true, role: true },
    }),
    prisma.cell.findMany({
      orderBy: { name: "asc" },
      include: {
        people: {
          select: { id: true, name: true, role: true },
          orderBy: { name: "asc" },
        },
      },
    }),
    prisma.ministry.findMany({
      orderBy: { name: "asc" },
      include: {
        memberships: {
          where: { status: "APPROVED" },
          include: { person: { select: { id: true, name: true } } },
        },
      },
    }),
  ]);

  return NextResponse.json({
    generalLeaders,
    cells: cells.map((c) => ({
      id: c.id,
      name: c.name,
      leaders: c.people.filter((p) => p.role === "CELL_LEADER"),
      servants: c.people.filter((p) => p.role === "SERVANT"),
      total: c.people.length,
    })),
    ministries: ministries.map((m) => ({
      id: m.id,
      name: m.name,
      members: m.memberships.map((mm) => mm.person),
    })),
  });
}
