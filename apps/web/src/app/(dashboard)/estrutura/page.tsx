"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, Church, Plus, Users, UserCog, Crown, Shield, ChevronDown, ChevronRight as ChevRight, X } from "lucide-react";
import { isLeader } from "@/lib/roles";

type Cell = {
  id: string;
  name: string;
  _count: { people: number };
  people: { id: string; name: string }[];
};

type Ministry = {
  id: string;
  name: string;
  active: boolean;
  _count: { memberships: number };
};

type PersonAPI = {
  id: string;
  name: string;
  role: string;
  cell: { id: string; name: string } | null;
  memberships: { ministry: { id: string; name: string } }[];
};

const ROLE_ORDER: Record<string, number> = {
  GENERAL_LEADER: 0,
  NUCLEUS_LEADER: 1,
  CELL_LEADER: 2,
  SERVANT: 3,
};

const ROLE_LABEL: Record<string, string> = {
  GENERAL_LEADER: "Líder Geral",
  NUCLEUS_LEADER: "Líder de Núcleo",
  CELL_LEADER: "Líder de Célula",
  SERVANT: "Servo",
};

const ROLE_ICON: Record<string, typeof Crown> = {
  GENERAL_LEADER: Crown,
  NUCLEUS_LEADER: Shield,
  CELL_LEADER: UserCog,
  SERVANT: Users,
};

const ROLE_STYLE: Record<string, string> = {
  GENERAL_LEADER: "border-amber-400/30 bg-amber-500/10",
  NUCLEUS_LEADER: "border-indigo-400/30 bg-indigo-500/10",
  CELL_LEADER: "border-emerald-400/30 bg-emerald-500/10",
  SERVANT: "border-white/10 bg-white/5",
};

const ROLE_TAG: Record<string, string> = {
  GENERAL_LEADER: "bg-amber-500/20 text-amber-300",
  NUCLEUS_LEADER: "bg-indigo-500/20 text-indigo-300",
  CELL_LEADER: "bg-emerald-500/20 text-emerald-300",
  SERVANT: "bg-white/10 text-white/60",
};

export default function EstruturaPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [people, setPeople] = useState<PersonAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"tree" | "leadership" | "cells" | "ministries">("tree");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => {
        if (isLeader(d.user?.role)) setAllowed(true);
        else { setAllowed(false); router.replace("/equipe"); }
      })
      .catch(() => { setAllowed(false); router.replace("/equipe"); });
  }, [router]);

  const [cellName, setCellName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [savingCell, setSavingCell] = useState(false);
  const [minName, setMinName] = useState("");
  const [savingMin, setSavingMin] = useState(false);

  async function load() {
    setLoading(true);
    const [c, m, p] = await Promise.all([
      fetch("/api/cells").then((r) => r.json()),
      fetch("/api/ministries").then((r) => r.json()),
      fetch("/api/people").then((r) => r.json()),
    ]);
    setCells(c);
    setMinistries(m);
    setPeople(p);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addCell() {
    if (!cellName.trim()) return;
    setSavingCell(true);
    await fetch("/api/cells", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cellName, leaderName, leaderEmail }),
    });
    setSavingCell(false);
    setCellName(""); setLeaderName(""); setLeaderEmail("");
    load();
  }

  async function addMinistry() {
    if (!minName.trim()) return;
    setSavingMin(true);
    await fetch("/api/ministries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: minName }),
    });
    setSavingMin(false);
    setMinName("");
    load();
  }

  if (allowed !== true) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  const grouped = Object.entries(
    people.reduce<Record<string, PersonAPI[]>>((acc, p) => {
      (acc[p.role] ??= []).push(p);
      return acc;
    }, {})
  ).sort(([a], [b]) => (ROLE_ORDER[a] ?? 9) - (ROLE_ORDER[b] ?? 9));

  return (
    <div className="mx-auto max-w-6xl p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Estrutura</h1>
        <p className="mt-1.5 text-sm text-white/60">
          Hierarquia, células e ministérios da missão.
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {([
          { key: "tree", label: "Árvore Hierárquica", icon: Users },
          { key: "leadership", label: "Liderança", icon: Crown },
          { key: "cells", label: "Células", icon: Home },
          { key: "ministries", label: "Ministérios", icon: Church },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.key
                ? "bg-white/15 text-white border border-white/20"
                : "text-white/50 hover:bg-white/5 border border-transparent"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : (
        <>
          {/* ÁRVORE HIERÁRQUICA */}
          {tab === "tree" && (
            <div className="space-y-6">
              {grouped.map(([role, members]) => {
                const Icon = ROLE_ICON[role] ?? Users;
                return (
                  <TreeGroup key={role} role={role} icon={Icon} members={members} ministries={ministries} />
                );
              })}
              {people.length === 0 && (
                <div className="glass rounded-3xl py-16 text-center text-white/40">
                  <Users className="mx-auto h-10 w-10 text-white/15" />
                  <p className="mt-3 text-sm">Nenhum servo cadastrado ainda.</p>
                </div>
              )}
            </div>
          )}

          {/* LIDERANÇA (Geral + Núcleo) */}
          {tab === "leadership" && (
            <LeadershipTab people={people} cells={cells} onChanged={load} />
          )}

          {/* CÉLULAS */}
          {tab === "cells" && (
            <section className="glass rounded-3xl p-6 text-white">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Home className="h-5 w-5" /></div>
                <h2 className="text-lg font-bold">Células</h2>
              </div>
              <div className="mb-5 space-y-2 rounded-2xl border border-white/10 bg-black/10 p-4">
                <input value={cellName} onChange={(e) => setCellName(e.target.value)} placeholder="Nome da célula (ex: Célula Norte)" className="input-glass" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={leaderName} onChange={(e) => setLeaderName(e.target.value)} placeholder="Líder da célula" className="input-glass" />
                  <input value={leaderEmail} onChange={(e) => setLeaderEmail(e.target.value)} placeholder="E-mail do líder" className="input-glass" />
                </div>
                <button onClick={addCell} disabled={savingCell || !cellName.trim()} className="btn-apple-primary w-full">
                  <Plus className="h-4 w-4" /> {savingCell ? "Salvando..." : "Cadastrar célula"}
                </button>
              </div>
              {cells.length === 0 ? (
                <p className="text-sm text-white/50">Nenhuma célula ainda.</p>
              ) : (
                <div className="space-y-2">
                  {cells.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold">{c.name}</p>
                        <p className="text-xs text-white/50">{c.people[0] ? `Líder: ${c.people[0].name}` : "Sem líder definido"}</p>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70">
                        <Users className="h-3.5 w-3.5" /> {c._count.people}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* MINISTÉRIOS */}
          {tab === "ministries" && (
            <section className="glass rounded-3xl p-6 text-white">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Church className="h-5 w-5" /></div>
                <h2 className="text-lg font-bold">Ministérios</h2>
              </div>
              <div className="mb-5 flex gap-2 rounded-2xl border border-white/10 bg-black/10 p-4">
                <input value={minName} onChange={(e) => setMinName(e.target.value)} placeholder="Nome do ministério (ex: Louvor)" className="input-glass" />
                <button onClick={addMinistry} disabled={savingMin || !minName.trim()} className="btn-apple-primary shrink-0">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {ministries.length === 0 ? (
                <p className="text-sm text-white/50">Nenhum ministério ainda.</p>
              ) : (
                <div className="space-y-2">
                  {ministries.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-white/60" />
                        <p className="text-sm font-semibold">{m.name}</p>
                      </div>
                      <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70">
                        <Users className="h-3.5 w-3.5" /> {m._count.memberships} servos
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function LeadershipTab({
  people,
  cells,
  onChanged,
}: {
  people: PersonAPI[];
  cells: Cell[];
  onChanged: () => void;
}) {
  const [promoteRole, setPromoteRole] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [newMode, setNewMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const generals = people.filter((p) => p.role === "GENERAL_LEADER");
  const nucleus = people.filter((p) => p.role === "NUCLEUS_LEADER");
  const promotable = people.filter((p) => p.role !== "GENERAL_LEADER" && p.role !== "NUCLEUS_LEADER");

  async function promote() {
    if (!promoteRole || !selectedPersonId) return;
    setSaving(true);
    await fetch(`/api/people/${selectedPersonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: promoteRole }),
    });
    setSaving(false);
    setSelectedPersonId("");
    setPromoteRole(null);
    onChanged();
  }

  async function createNew() {
    if (!promoteRole || !newName.trim() || !newEmail.trim()) return;
    setSaving(true);
    await fetch("/api/cells", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Sem célula",
        leaderName: newName,
        leaderEmail: newEmail,
      }),
    });
    // Find the newly created person and promote
    const ppl = await fetch("/api/people").then((r) => r.json());
    const found = ppl.find((p: PersonAPI) => p.name === newName);
    if (found) {
      await fetch(`/api/people/${found.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: promoteRole }),
      });
    }
    setSaving(false);
    setNewName("");
    setNewEmail("");
    setNewMode(false);
    setPromoteRole(null);
    onChanged();
  }

  function renderSection(
    role: string,
    label: string,
    desc: string,
    members: PersonAPI[],
    iconClass: string,
    tagClass: string,
    borderClass: string,
    Icon: typeof Crown,
  ) {
    return (
      <section className="glass rounded-3xl p-6 text-white">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{label}</h2>
              <p className="text-xs text-white/40">{desc}</p>
            </div>
          </div>
          <button
            onClick={() => { setPromoteRole(role); setNewMode(false); setSelectedPersonId(""); }}
            className="btn-apple px-3 py-2 text-xs"
          >
            <Plus className="h-4 w-4" /> Novo
          </button>
        </div>

        {members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-8 text-center">
            <Icon className="mx-auto h-8 w-8 text-white/15" />
            <p className="mt-2 text-sm text-white/40">Nenhum {label.toLowerCase()}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((p) => (
              <div key={p.id} className={`flex items-center gap-3 rounded-xl border ${borderClass} px-4 py-3`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tagClass} text-sm font-bold`}>
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-white/40">{p.cell?.name ?? "Sem célula"}</p>
                </div>
                {p.memberships.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.memberships.map((m) => (
                      <span key={m.ministry.id} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                        {m.ministry.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {renderSection(
          "GENERAL_LEADER", "Líder Geral", "Responsável por toda a missão",
          generals, "bg-amber-500/20 text-amber-300", "bg-amber-500/20 text-amber-300",
          "border-amber-400/20 bg-amber-500/5", Crown
        )}
        {renderSection(
          "NUCLEUS_LEADER", "Líderes de Núcleo", "Coordenam grupos de células",
          nucleus, "bg-indigo-500/20 text-indigo-300", "bg-indigo-500/20 text-indigo-300",
          "border-indigo-400/20 bg-indigo-500/5", Shield
        )}
      </div>

      {/* Modal de promoção/criação */}
      {promoteRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
          <div className="glass-strong w-full max-w-md rounded-3xl p-6 text-white">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {promoteRole === "GENERAL_LEADER" ? "Novo Líder Geral" : "Novo Líder de Núcleo"}
              </h2>
              <button onClick={() => setPromoteRole(null)} className="text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Toggle: promover existente vs criar novo */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setNewMode(false)}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  !newMode ? "border-white/30 bg-white/15 text-white" : "border-white/10 text-white/50"
                }`}
              >
                Promover servo existente
              </button>
              <button
                onClick={() => setNewMode(true)}
                className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  newMode ? "border-white/30 bg-white/15 text-white" : "border-white/10 text-white/50"
                }`}
              >
                Criar novo líder
              </button>
            </div>

            {!newMode ? (
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Selecione a pessoa
                </label>
                {promotable.length === 0 ? (
                  <p className="text-sm text-white/50">Nenhum servo disponível para promover.</p>
                ) : (
                  <div className="max-h-60 space-y-1.5 overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-2">
                    {promotable.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPersonId(p.id)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                          selectedPersonId === p.id
                            ? "border border-amber-400/30 bg-amber-500/15 ring-1 ring-amber-400/20"
                            : "border border-transparent hover:bg-white/5"
                        }`}
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          selectedPersonId === p.id
                            ? "bg-amber-500/25 text-amber-300"
                            : "bg-white/10 text-white/60"
                        }`}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                          <p className="text-[10px] text-white/40">
                            {ROLE_LABEL[p.role] ?? p.role}
                            {p.cell ? ` • ${p.cell.name}` : ""}
                          </p>
                        </div>
                        {selectedPersonId === p.id && (
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={promote}
                  disabled={saving || !selectedPersonId}
                  className="btn-apple-primary w-full"
                >
                  {saving ? "Promovendo..." : "Promover"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome completo"
                  className="input-glass"
                />
                <input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="E-mail"
                  className="input-glass"
                />
                <button
                  onClick={createNew}
                  disabled={saving || !newName.trim() || !newEmail.trim()}
                  className="btn-apple-primary w-full"
                >
                  {saving ? "Criando..." : "Criar líder"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function TreeGroup({
  role,
  icon: Icon,
  members,
  ministries,
}: {
  role: string;
  icon: typeof Crown;
  members: PersonAPI[];
  ministries: Ministry[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`rounded-3xl border p-5 ${ROLE_STYLE[role] ?? "border-white/10 bg-white/5"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ROLE_TAG[role] ?? "bg-white/10 text-white/60"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white">{ROLE_LABEL[role] ?? role}</h3>
          <p className="text-xs text-white/50">{members.length} pessoa{members.length !== 1 ? "s" : ""}</p>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-white/40" /> : <ChevRight className="h-4 w-4 text-white/40" />}
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/10 bg-black/15 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/70">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                  {p.cell && (
                    <p className="text-[10px] text-white/40">{p.cell.name}</p>
                  )}
                </div>
              </div>
              {p.memberships.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.memberships.map((m) => (
                    <span
                      key={m.ministry.id}
                      className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60"
                    >
                      {m.ministry.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Linha conectora visual entre grupos */}
      <div className="mt-3 flex justify-center">
        <div className="h-4 w-px bg-white/10" />
      </div>
    </div>
  );
}
