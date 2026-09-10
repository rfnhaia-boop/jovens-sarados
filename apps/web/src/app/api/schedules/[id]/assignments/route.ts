export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || !isLeader(user.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  const { personId, role } = await req.json();
  if (!personId || !role?.trim()) {
    return NextResponse.json({ message: "Servo e função são obrigatórios." }, { status: 400 });
  }
  const assignment = await prisma.scheduleAssignment.create({
    data: {
      scheduleId: params.id,
      personId,
      role: role.trim(),
    },
    include: { person: { select: { id: true, name: true } } },
  });
  return NextResponse.json(assignment, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || !isLeader(user.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  const { assignmentId } = await req.json();
  await prisma.scheduleAssignment.delete({ where: { id: assignmentId } });
  return NextResponse.json({ ok: true });
}
