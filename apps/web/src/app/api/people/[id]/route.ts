export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";
import { hashPassword } from "@/lib/password";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user || !isLeader(user.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  const data = await req.json();
  const person = await prisma.person.update({
    where: { id: params.id },
    data: {
      ...(data.role ? { role: data.role } : {}),
      ...(data.name ? { name: data.name } : {}),
      ...(data.email ? { email: data.email.toLowerCase() } : {}),
      ...(data.cellId !== undefined ? { cellId: data.cellId || null } : {}),
      ...(data.password ? { passwordHash: hashPassword(data.password) } : {}),
    },
  });
  return NextResponse.json(person);
}
