export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    orderBy: { date: "desc" },
    include: {
      createdBy: { select: { id: true, name: true } },
      assignments: {
        include: { person: { select: { id: true, name: true } } },
        orderBy: { role: "asc" },
      },
    },
  });
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !isLeader(user.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  const { title, date } = await req.json();
  if (!title?.trim() || !date) {
    return NextResponse.json({ message: "Título e data são obrigatórios." }, { status: 400 });
  }
  const schedule = await prisma.schedule.create({
    data: {
      title: title.trim(),
      date: new Date(date),
      createdById: user.id,
    },
  });
  return NextResponse.json(schedule, { status: 201 });
}
