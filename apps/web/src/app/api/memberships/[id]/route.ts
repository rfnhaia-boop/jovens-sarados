export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";

// PATCH → líder aprova a solicitação
export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!isLeader(user?.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  const membership = await prisma.ministryMembership.update({
    where: { id: params.id },
    data: { status: "APPROVED" },
  });
  return NextResponse.json(membership);
}

// DELETE → líder recusa/remove, ou o próprio servo cancela a solicitação
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }
  const membership = await prisma.ministryMembership.findUnique({
    where: { id: params.id },
  });
  if (!membership) {
    return NextResponse.json({ message: "Não encontrado." }, { status: 404 });
  }
  if (!isLeader(user.role) && membership.personId !== user.id) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  await prisma.ministryMembership.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
