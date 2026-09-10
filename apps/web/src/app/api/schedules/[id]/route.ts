export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || !isLeader(user.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  await prisma.schedule.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
