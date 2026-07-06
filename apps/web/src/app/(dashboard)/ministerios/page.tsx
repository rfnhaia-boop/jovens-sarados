"use client";

import { useEffect, useState, useCallback } from "react";
import { Church, Check, X, Clock, Plus, UserCheck } from "lucide-react";
import { isLeader } from "@/lib/roles";

type Ministry = { id: string; name: string; _count?: { memberships: number } };
type Mine = { id: string; status: string; ministry: { id: string; name: string } };
type Pending = {
  id: string;
  person: { id: string; name: string; email: string };
  ministry: { id: string; name: string };
};

export default function MinisteriosPage() {
  const [role, setRole] = useState<string | null>(null);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [mine, setMine] = useState<Mine[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const me = await fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .catch(() => ({ user: null }));
    const userRole = me.user?.role ?? null;
    setRole(userRole);

    const reqs: Promise<any>[] = [
      fetch("/api/ministries").then((r) => r.json()),
      fetch("/api/memberships?scope=mine").then((r) => r.json()),
    ];
    if (isLeader(userRole)) {
      reqs.push(fetch("/api/memberships?scope=pending").then((r) => r.json()));
    }
    const [mins, mineData, pend] = await Promise.all(reqs);
    setMinistries(mins);
    setMine(mineData);
    setPending(pend ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function solicitar(ministryId: string) {
    await fetch("/api/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ministryId }),
    });
    load();
  }

  async function aprovar(id: string) {
    await fetch(`/api/memberships/${id}`, { method: "PATCH" });
    load();
  }

  async function recusar(id: string) {
    await fetch(`/api/memberships/${id}`, { method: "DELETE" });
    load();
  }

  function statusOf(ministryId: string): string | null {
    return mine.find((m) => m.ministry.id === ministryId)?.status ?? null;
  }

  const leader = isLeader(role);

  return (
    <div className="mx-auto max-w-6xl p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Ministérios
        </h1>
        <p className="mt-1.5 text-sm text-white/60">
          {leader
            ? "Aprove as solicitações e veja quem serve em cada ministério."
            : "Peça para entrar nos ministérios em que você foi chamado a servir."}
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Solicitações pendentes (líder) */}
          {leader && (
            <section className="glass rounded-3xl p-6 text-white">
              <div className="mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-300" />
                <h2 className="text-lg font-bold">Solicitações pendentes</h2>
                {pending.length > 0 && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-200">
                    {pending.length}
                  </span>
                )}
              </div>
              {pending.length === 0 ? (
                <p className="text-sm text-white/50">
                  Nenhuma solicitação no momento.
                </p>
              ) : (
                <div className="space-y-2">
                  {pending.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold">{p.person.name}</p>
                        <p className="text-xs text-white/50">
                          quer entrar em{" "}
                          <span className="text-white/80">{p.ministry.name}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => aprovar(p.id)}
                          className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/30"
                        >
                          <Check className="h-4 w-4" />
                          Aprovar
                        </button>
                        <button
                          onClick={() => recusar(p.id)}
                          className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:bg-red-500/20 hover:text-red-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Lista de ministérios */}
          <section className="glass rounded-3xl p-6 text-white">
            <div className="mb-4 flex items-center gap-2">
              <Church className="h-5 w-5" />
              <h2 className="text-lg font-bold">
                {leader ? "Todos os ministérios" : "Ministérios disponíveis"}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ministries.map((m) => {
                const status = statusOf(m.id);
                return (
                  <div
                    key={m.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-semibold">{m.name}</p>
                    <div className="mt-3">
                      {leader ? (
                        <span className="text-xs text-white/50">
                          {m._count?.memberships ?? 0} servo(s)
                        </span>
                      ) : status === "APPROVED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                          <Check className="h-3.5 w-3.5" />
                          Você participa
                        </span>
                      ) : status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200">
                          <Clock className="h-3.5 w-3.5" />
                          Aguardando aprovação
                        </span>
                      ) : (
                        <button
                          onClick={() => solicitar(m.id)}
                          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Solicitar entrada
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
