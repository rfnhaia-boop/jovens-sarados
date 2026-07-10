export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

// Lista as mídias, com suas categorias
export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    include: { categories: { include: { category: true } } },
  });
  return NextResponse.json(media);
}

// Faz upload de um arquivo e salva na galeria com categorias
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const kind = (form.get("kind") as string) || "PHOTO";
  const takenOnRaw = form.get("takenOn") as string | null;
  const categoryIds = form.getAll("categoryIds") as string[];

  if (!file) {
    return NextResponse.json(
      { message: "Nenhum arquivo enviado." },
      { status: 400 }
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.name.split(".").pop() || "bin";
  const filename = `${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(join(UPLOAD_DIR, filename), bytes);

  const media = await prisma.media.create({
    data: {
      name: file.name,
      kind,
      url: `/uploads/${filename}`,
      size: bytes.length,
      takenOn: takenOnRaw ? new Date(takenOnRaw) : null,
      categories: {
        create: categoryIds
          .filter(Boolean)
          .map((categoryId) => ({ categoryId })),
      },
    },
    include: { categories: { include: { category: true } } },
  });

  return NextResponse.json(media, { status: 201 });
}
