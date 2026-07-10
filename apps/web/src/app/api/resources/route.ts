export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function GET() {
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(resources);
}

// Aceita JSON (link) ou multipart (upload de arquivo). Só líder.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!isLeader(user?.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string) || "";
    const description = (form.get("description") as string) || "";
    const type = (form.get("type") as string) || "ARQUIVO";
    if (!file || !title.trim()) {
      return NextResponse.json(
        { message: "Arquivo e título são obrigatórios." },
        { status: 400 }
      );
    }
    await mkdir(UPLOAD_DIR, { recursive: true });
    const ext = file.name.split(".").pop() || "bin";
    const filename = `${randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOAD_DIR, filename), bytes);
    const resource = await prisma.resource.create({
      data: {
        title: title.trim(),
        description: description.trim() || null,
        type,
        url: `/uploads/${filename}`,
      },
    });
    return NextResponse.json(resource, { status: 201 });
  }

  // link externo
  const { title, description, type, url } = await req.json();
  if (!title?.trim() || !url?.trim()) {
    return NextResponse.json(
      { message: "Título e link são obrigatórios." },
      { status: 400 }
    );
  }
  const resource = await prisma.resource.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      type: type || "LINK",
      url: url.trim(),
    },
  });
  return NextResponse.json(resource, { status: 201 });
}
