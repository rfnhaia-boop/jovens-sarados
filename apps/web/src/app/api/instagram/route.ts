import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isLeader } from "@/lib/roles";
import { getCachedInstagram, refreshInstagram } from "@/lib/instagram";

const STALE_MS = 1000 * 60 * 60 * 12; // 12h

export async function GET() {
  let cached = await getCachedInstagram();

  // se não tem cache OU está velho e há token, tenta atualizar
  const stale = cached && Date.now() - cached.updatedAt.getTime() > STALE_MS;
  if ((!cached || stale) && process.env.APIFY_TOKEN) {
    try {
      const profile = await refreshInstagram();
      cached = { profile, updatedAt: new Date() };
    } catch {
      // mantém o cache antigo se falhar
    }
  }

  if (!cached) {
    return NextResponse.json({ profile: null, updatedAt: null });
  }
  return NextResponse.json({
    profile: cached.profile,
    updatedAt: cached.updatedAt,
  });
}

// Força atualização (só líder)
export async function POST() {
  const user = await getCurrentUser();
  if (!isLeader(user?.role)) {
    return NextResponse.json({ message: "Sem permissão." }, { status: 403 });
  }
  try {
    const profile = await refreshInstagram();
    return NextResponse.json({ profile, updatedAt: new Date() });
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "Erro ao atualizar." },
      { status: 500 }
    );
  }
}
