"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, X, Pin, Trash2, Calendar, AlertCircle, Pencil } from "lucide-react";
import { toast } from "@/components/ui/toast";

type Notice = {
  id: string;
  title: string;
  body: string;
  scope: string;
  pinned: boolean;
  author: string;
  createdAt: string;
};

const SCOPES = [
  {
    value: "COMUNICACAO",
    label: "Só Comunicação",
    hint: "visível apenas para este ministério",
    color: "bg-brand-500/15 text-brand-200 border-brand-500/25 backdrop-blur-sm",
  },
  {
    value: "SERVOS",
    label: "Todos os servos",
    hint: "visível para todos os ministérios",
    color: "bg-emerald-500/15 text-emerald-200 border-emerald-500/25 backdrop-blur-sm",
  },
  {
    value: "MEMBROS",
    label: "Membros (site)",
    hint: "publicado no mural do site público",
    color: "bg-amber-500/15 text-amber-200 border-amber-500/25 backdrop-blur-sm",
  },
];

function scopeMeta(value: string) {
  return SCOPES.find((s) => s.value === value) ?? SCOPES[0];
}

export default function AvisosPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/notices");
    const data = await res.json();
    // Sort pinned notices first
    const sorted = [...data].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setNotices(sorted);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Aviso apagado.");
    } else {
      toast("Não foi possível apagar o aviso.", "error");
    }
    load();
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Avisos</h1>
          <p className="mt-1.5 text-white/60 text-sm">
            Mural de comunicados. Crie avisos direcionados para cada público do ministério.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn-apple-primary self-start sm:self-center"
        >
          <Plus className="h-5 w-5" />
          Novo aviso
        </button>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-3xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-8 w-8 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="skeleton h-3.5 w-full" />
                <div className="skeleton h-3.5 w-5/6" />
                <div className="skeleton h-3.5 w-3/5" />
              </div>
              <div className="flex items-center justify-between pt-3">
                <div className="skeleton h-6 w-28 rounded-full" />
                <div className="skeleton h-3.5 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-3xl border-dashed border-white/10 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/70 shadow-inner">
            <Megaphone className="h-8 w-8" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-white">Nenhum aviso no mural</h3>
          <p className="mt-2 max-w-sm text-sm text-white/60 leading-relaxed">
            Publique o primeiro comunicado e escolha se ele vai só para
            a comunicação interna, todos os servos ou para o site público.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {notices.map((n) => {
            const meta = scopeMeta(n.scope);
            return (
              <div
                key={n.id}
                className={`group rounded-3xl p-6 text-white flex flex-col justify-between ${
                  n.pinned
                    ? "glass-pinned glass-pinned-hover"
                    : "glass glass-hover"
                }`}
              >
                <div>
                  <div className="mb-3.5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {n.pinned && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-amber-300" title="Aviso Fixado">
                          <Pin className="h-3 w-3 fill-amber-300" />
                        </span>
                      )}
                      <h3 className="font-bold text-base tracking-tight text-white leading-tight">
                        {n.title}
                      </h3>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditing(n)}
                        className="opacity-40 group-hover:opacity-100 text-white/70 hover:text-amber-300 bg-white/5 hover:bg-amber-500/15 p-2 rounded-full border border-white/5 hover:border-amber-500/20 transition-all duration-300 shadow-sm"
                        title="Editar aviso"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(n.id)}
                        className="opacity-40 group-hover:opacity-100 text-white/70 hover:text-red-400 bg-white/5 hover:bg-red-500/15 p-2 rounded-full border border-white/5 hover:border-red-500/20 transition-all duration-300 shadow-sm"
                        title="Apagar aviso"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-white/70 leading-relaxed">
                    {n.body}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(n.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NoticeDialog
        open={open}
        onClose={() => setOpen(false)}
        onSaved={load}
      />

      {editing && (
        <NoticeDialog
          open={true}
          notice={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { load(); setEditing(null); }}
        />
      )}
    </div>
  );
}

function NoticeDialog({
  open,
  notice,
  onClose,
  onSaved,
}: {
  open: boolean;
  notice?: Notice;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!notice;
  const [title, setTitle] = useState(notice?.title ?? "");
  const [body, setBody] = useState(notice?.body ?? "");
  const [scope, setScope] = useState(notice?.scope ?? "COMUNICACAO");
  const [pinned, setPinned] = useState(notice?.pinned ?? false);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    if (isEdit) {
      await fetch(`/api/notices/${notice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, scope, pinned }),
      });
    } else {
      await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, scope, pinned }),
      });
    }
    setSaving(false);
    toast(isEdit ? "Aviso atualizado!" : "Aviso publicado!");
    if (!isEdit) {
      setTitle("");
      setBody("");
      setScope("COMUNICACAO");
      setPinned(false);
    }
    onSaved();
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-md transition-all duration-300">
      <div className="glass-strong max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] p-8 text-white shadow-2xl relative border-t-white/20 border-l-white/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{isEdit ? "Editar aviso" : "Novo aviso"}</h2>
            <p className="text-xs text-white/50 mt-1">Preencha os campos para publicar no painel.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/5 transition duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/50">
              Título
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reunião de alinhamento no sábado"
              className="input-glass"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/50">
              Mensagem
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Escreva o comunicado..."
              className="input-glass resize-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-white/50">
              Quem vai ver este aviso?
            </label>
            <div className="space-y-2">
              {SCOPES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setScope(s.value)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-5 py-3.5 text-left transition-all duration-300 ${
                    scope === s.value
                      ? "border-white/30 bg-white/12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                      : "border-white/10 bg-black/10 hover:bg-white/5"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{s.label}</p>
                    <p className="text-xs text-white/50 mt-0.5">{s.hint}</p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      scope === s.value
                        ? "border-amber-400 bg-amber-400"
                        : "border-white/30 bg-transparent"
                    }`}
                  >
                    {scope === s.value && (
                      <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="mb-6 flex cursor-pointer items-center gap-3 text-sm text-white/80 select-none">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="h-5 w-5 rounded border border-white/20 bg-black/20 accent-amber-500 cursor-pointer"
              />
              <span className="text-sm">Fixar no topo do mural (destaque dourado)</span>
            </label>
          </div>

          <button
            onClick={submit}
            disabled={saving || !title.trim() || !body.trim()}
            className="btn-apple-primary w-full py-3.5"
          >
            {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Publicar aviso"}
          </button>
        </div>
      </div>
    </div>
  );
}

