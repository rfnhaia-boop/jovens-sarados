import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";

// GET ?scope=mine → minhas solicitações | ?scope=pending → pendentes (só líder)
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }
  const scope = req.nextUrl.searchParams.get("scope") ?? "mine";

  if (scope === "pending") {
    if (!isLeader(user.role)) {
      return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
    }
    const pending = await prisma.ministryMembership.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: {
        person: { select: { id: true, name: true, email: true } },
        ministry: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(pending);
  }

  // minhas
  const mine = await prisma.ministryMembership.findMany({
    where: { personId: user.id },
    include: { ministry: { select: { id: true, name: true } } },
  });
  return NextResponse.json(mine);
}

// POST → servo solicita entrada num ministério
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }
  const { ministryId } = await req.json();
  if (!ministryId) {
    return NextResponse.json(
      { message: "Ministério é obrigatório." },
      { status: 400 }
    );
  }
  const membership = await prisma.ministryMembership.upsert({
    where: { personId_ministryId: { personId: user.id, ministryId } },
    update: {},
    create: { personId: user.id, ministryId, status: "PENDING" },
    include: { ministry: { select: { id: true, name: true } } },
  });
  return NextResponse.json(membership, { status: 201 });
}
