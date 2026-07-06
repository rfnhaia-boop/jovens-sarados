import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      { message: "Informe e-mail e senha." },
      { status: 400 }
    );
  }

  const person = await prisma.person.findUnique({
    where: { email: String(email).trim().toLowerCase() },
  });

  if (!person || !person.passwordHash || !verifyPassword(password, person.passwordHash)) {
    return NextResponse.json(
      { message: "E-mail ou senha inválidos." },
      { status: 401 }
    );
  }

  const token = await createSession(person.id);
  setSessionCookie(token);

  return NextResponse.json({
    user: {
      id: person.id,
      name: person.name,
      email: person.email,
      role: person.role,
    },
  });
}
