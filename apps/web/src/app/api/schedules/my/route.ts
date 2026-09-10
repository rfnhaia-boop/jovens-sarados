export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }
  const assignments = await prisma.scheduleAssignment.findMany({
    where: { personId: user.id },
    include: {
      schedule: {
        select: { id: true, title: true, date: true },
      },
    },
    orderBy: { schedule: { date: "asc" } },
  });
  return NextResponse.json(assignments);
}
