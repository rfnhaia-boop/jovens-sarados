export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const people = await prisma.person.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      cell: { select: { id: true, name: true } },
      memberships: {
        where: { status: "APPROVED" },
        select: { ministry: { select: { id: true, name: true } } },
      },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(people);
}
