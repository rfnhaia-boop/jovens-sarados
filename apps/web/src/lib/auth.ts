import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE = "js_session";
const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

// Cria uma sessão no banco e devolve o token
export async function createSession(personId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + THIRTY_DAYS);
  await prisma.session.create({ data: { token, personId, expiresAt } });
  return token;
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS / 1000,
  });
}

export async function clearSession() {
  const token = cookies().get(COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookies().delete(COOKIE);
}

// Retorna a pessoa logada (ou null)
export async function getCurrentUser() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { person: { include: { cell: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  const { passwordHash, ...person } = session.person;
  return person;
}
