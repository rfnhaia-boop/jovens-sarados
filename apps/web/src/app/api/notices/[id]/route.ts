import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const notice = await prisma.notice.update({
    where: { id: params.id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.body !== undefined ? { body: data.body } : {}),
      ...(data.scope !== undefined ? { scope: data.scope } : {}),
      ...(data.pinned !== undefined ? { pinned: data.pinned } : {}),
    },
  });
  return NextResponse.json(notice);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.notice.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
