"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList, Plus, X, Trash2, UserPlus, Calendar, ChevronDown, ChevronRight,
} from "lucide-react";
import { isLeader } from "@/lib/roles";

type Person = { id: string; name: string };
type Assignment = {
  id: string;
  role: string;
  person: Person;
};
type Schedule = {
  id: string;
  title: string;
  date: string;
  createdBy: Person;
  assignments: Assignment[];
};
type MyAssignment = {
  id: string;
  role: string;
  schedule: { id: string; title: string; date: string };
};

const ROLE_SUGGESTIONS = ["Louvor", "Acolhimento", "Pregação", "Oração", "Mídia", "Limpeza", "Técnica"];

export default function EscalasPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [myAssignments, setMyAssignments] = useState<MyAssignment[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUserRole(d.user?.role ?? null));
  }, []);

  async function load() {
    setLoading(true);
    const [s, my, p] = await Promise.all([
      fetch("/api/schedules").then((r) => r.json()),
      fetch("/api/schedules/my").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/people").then((r) => r.json()),
    ]);
    setSchedules(s);
    setMyAssignments(my);
    setPeople(p);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createSchedule() {
    if (!title.trim() || !date) return;
    setSaving(true);
    await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date }),
    });
    setSaving(false);
    setTitle("");
    setDate("");
    setShowCreate(false);
    load();
  }

  async function deleteSchedule(id: string) {
    await fetch(`/api/schedules/${id}`, { method: "DELETE" });
    load();
  }

  const leader = isLeader(userRole);
  const upcoming = myAssignments.filter(
    (a) => new Date(a.schedule.date) >= new Date(new Date().toDateString())
  );

  return (
    <div className="mx-auto max-w-5xl p-6 sm:p-8">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Escalas</h1>
          <p className="mt-1.5 text-sm text-white/60">
            Gerencie quem serve em cada evento.
          </p>
        </div>
        {leader && (
          <button onClick={() => setShowCreate(true)} className="btn-apple-primary px-4 py-2 text-sm">
            <Plus className="h-4 w-4" /> Nova escala
          </button>
        )}
      </header>

      {/* Minhas escalas (servo) */}
      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white/80">
            <Calendar className="h-4 w-4 text-brand-300" /> Minhas próximas escalas
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((a) => (
              <div key={a.id} className="glass rounded-2xl p-4 text-white">
                <p className="text-lg font-bold">{a.schedule.title}</p>
                <p className="text-xs text-white/50">
                  {new Date(a.schedule.date).toLocaleDateString("pt-BR", {
                    weekday: "long", day: "numeric", month: "long",
                  })}
                </p>
                <span className="mt-2 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-200">
                  {a.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="glass rounded-3xl py-16 text-center text-white/40">
          <ClipboardList className="mx-auto h-10 w-10 text-white/15" />
          <p className="mt-3 text-sm">Nenhuma escala criada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((s) => (
            <ScheduleCard
              key={s.id}
              schedule={s}
              people={people}
              isLeader={leader}
              onChanged={load}
              onDelete={() => deleteSchedule(s.id)}
            />
          ))}
        </div>
      )}

      {/* Modal criar escala */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
          <div className="glass-strong w-full max-w-md rounded-3xl p-6 text-white">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Nova Escala</h2>
              <button onClick={() => setShowCreate(false)} className="text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-white/40">Nome do evento</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Maranatá, Culto Jovem..." className="input-glass" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-white/40">Data</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-glass" />
              </div>
              <button onClick={createSchedule} disabled={saving || !title.trim() || !date} className="btn-apple-primary w-full">
                {saving ? "Criando..." : "Criar escala"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleCard({
  schedule,
  people,
  isLeader,
  onChanged,
  onDelete,
}: {
  schedule: Schedule;
  people: Person[];
  isLeader: boolean;
  onChanged: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [personId, setPersonId] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  const assignedIds = new Set(schedule.assignments.map((a) => a.person.id));
  const available = people.filter((p) => !assignedIds.has(p.id));
  const isPast = new Date(schedule.date) < new Date(new Date().toDateString());

  async function addAssignment() {
    if (!personId || !role.trim()) return;
    setSaving(true);
    await fetch(`/api/schedules/${schedule.id}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId, role }),
    });
    setSaving(false);
    setPersonId("");
    setRole("");
    setAdding(false);
    onChanged();
  }

  async function removeAssignment(assignmentId: string) {
    await fetch(`/api/schedules/${schedule.id}/assignments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId }),
    });
    onChanged();
  }

  const dateStr = new Date(schedule.date).toLocaleDateString("pt-BR", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className={`glass rounded-3xl p-5 text-white ${isPast ? "opacity-50" : ""}`}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 text-left">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/20 text-brand-200">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold">{schedule.title}</h3>
          <p className="text-xs text-white/50">{dateStr} · {schedule.assignments.length} servo{schedule.assignments.length !== 1 ? "s" : ""}</p>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-white/40" /> : <ChevronRight className="h-4 w-4 text-white/40" />}
      </button>

      {open && (
        <div className="mt-4">
          {schedule.assignments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/10 py-6 text-center text-sm text-white/40">
              Nenhum servo escalado ainda.
            </p>
          ) : (
            <div className="space-y-2">
              {schedule.assignments.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/70">
                    {a.person.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{a.person.name}</p>
                    <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-medium text-brand-200">
                      {a.role}
                    </span>
                  </div>
                  {isLeader && (
                    <button onClick={() => removeAssignment(a.id)} className="text-white/30 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {isLeader && !adding && (
            <div className="mt-3 flex gap-2">
              <button onClick={() => setAdding(true)} className="btn-apple px-3 py-2 text-xs">
                <UserPlus className="h-4 w-4" /> Escalar servo
              </button>
              <button onClick={onDelete} className="btn-apple px-3 py-2 text-xs text-red-300 hover:text-red-200">
                <Trash2 className="h-4 w-4" /> Excluir escala
              </button>
            </div>
          )}

          {isLeader && adding && (
            <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-white/40">Servo</label>
                <select value={personId} onChange={(e) => setPersonId(e.target.value)} className="input-glass">
                  <option value="">Selecione...</option>
                  {available.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-white/40">Função</label>
                <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex: Louvor, Acolhimento..." className="input-glass" list="role-suggestions" />
                <datalist id="role-suggestions">
                  {ROLE_SUGGESTIONS.map((r) => <option key={r} value={r} />)}
                </datalist>
              </div>
              <div className="flex gap-2">
                <button onClick={addAssignment} disabled={saving || !personId || !role.trim()} className="btn-apple-primary flex-1 py-2 text-xs">
                  {saving ? "Salvando..." : "Confirmar"}
                </button>
                <button onClick={() => { setAdding(false); setPersonId(""); setRole(""); }} className="btn-apple px-3 py-2 text-xs">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
