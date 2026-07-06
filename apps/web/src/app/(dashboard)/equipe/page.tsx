"use client";

import { useEffect, useState } from "react";
import { Crown, Home, Church, User, Users } from "lucide-react";
import { roleLabel } from "@/lib/roles";

type Person = { id: string; name: string; role?: string };
type Cell = {
  id: string;
  name: string;
  leaders: Person[];
  servants: Person[];
  total: number;
};
type Ministry = { id: string; name: string; members: Person[] };
type Data = {
  generalLeaders: Person[];
  cells: Cell[];
  ministries: Ministry[];
};

export default function EquipePage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/structure")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Equipe
        </h1>
        <p className="mt-1.5 text-sm text-white/60">
          Conheça a liderança, as células e quem serve em cada ministério.
        </p>
      </header>

      {loading || !data ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Liderança geral */}
          <section className="glass rounded-3xl p-6 text-white">
            <div className="mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-300" />
              <h2 className="text-lg font-bold">Liderança Geral</h2>
            </div>
            {data.generalLeaders.length === 0 ? (
              <p className="text-sm text-white/50">Não definida.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {data.generalLeaders.map((p) => (
                  <span
                    key={p.id}
                    className="flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-100"
                  >
                    <Crown className="h-3.5 w-3.5" />
                    {p.name}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Células */}
          <section className="glass rounded-3xl p-6 text-white">
            <div className="mb-4 flex items-center gap-2">
              <Home className="h-5 w-5" />
              <h2 className="text-lg font-bold">Células</h2>
            </div>
            {data.cells.length === 0 ? (
              <p className="text-sm text-white/50">Nenhuma célula ainda.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.cells.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-semibold">{c.name}</p>
                      <span className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                        <Users className="h-3 w-3" />
                        {c.total}
                      </span>
                    </div>
                    {c.leaders.map((l) => (
                      <p
                        key={l.id}
                        className="flex items-center gap-1.5 text-sm text-amber-200"
                      >
                        <Crown className="h-3.5 w-3.5" />
                        {l.name}
                      </p>
                    ))}
                    {c.servants.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {c.servants.map((s) => (
                          <span
                            key={s.id}
                            className="flex items-center gap-1 rounded-full bg-white/8 px-2 py-0.5 text-xs text-white/70"
                          >
                            <User className="h-3 w-3" />
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Ministérios */}
          <section className="glass rounded-3xl p-6 text-white">
            <div className="mb-4 flex items-center gap-2">
              <Church className="h-5 w-5" />
              <h2 className="text-lg font-bold">Ministérios</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.ministries.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="mb-2 font-semibold">{m.name}</p>
                  {m.members.length === 0 ? (
                    <p className="text-xs text-white/40">Ninguém ainda</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {m.members.map((s) => (
                        <span
                          key={s.id}
                          className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-white/70"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
