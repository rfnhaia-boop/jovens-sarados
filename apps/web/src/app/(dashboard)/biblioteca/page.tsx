"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Library,
  Plus,
  X,
  Download,
  ExternalLink,
  Trash2,
  Wand2,
  FileText,
  Link2,
  File,
} from "lucide-react";
import { isLeader } from "@/lib/roles";

type Resource = {
  id: string;
  title: string;
  description?: string;
  type: string;
  url: string;
};

const TYPES = [
  { value: "PRESET", label: "Preset", icon: Wand2 },
  { value: "PDF", label: "PDF", icon: FileText },
  { value: "LINK", label: "Link", icon: Link2 },
  { value: "ARQUIVO", label: "Arquivo", icon: File },
];

function typeMeta(v: string) {
  return TYPES.find((t) => t.value === v) ?? TYPES[3];
}

export default function BibliotecaPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openNew, setOpenNew] = useState(false);

  const load = useCallback(async () => {
    const me = await fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .catch(() => ({ user: null }));
    setRole(me.user?.role ?? null);
    const data = await fetch("/api/resources").then((r) => r.json());
    setResources(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    await fetch(`/api/resources/${id}`, { method: "DELETE" });
    load();
  }

  const leader = isLeader(role);
  const isExternal = (r: Resource) => r.type === "LINK" || /^https?:\/\//.test(r.url);

  return (
    <div className="mx-auto max-w-6xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Biblioteca
          </h1>
          <p className="mt-1.5 text-sm text-white/60">
            Presets, materiais e recursos do Jovem Sarado — tudo num lugar só.
          </p>
        </div>
        {leader && (
          <button onClick={() => setOpenNew(true)} className="btn-apple-primary">
            <Plus className="h-5 w-5" />
            Adicionar
          </button>
        )}
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : resources.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-24 text-center text-white">
          <Library className="h-12 w-12 text-white/40" />
          <h3 className="mt-4 font-semibold">Biblioteca vazia</h3>
          <p className="mt-1 max-w-sm text-sm text-white/50">
            {leader
              ? "Adicione o primeiro preset, PDF ou link."
              : "Em breve o líder vai disponibilizar os recursos aqui."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => {
            const meta = typeMeta(r.type);
            const Icon = meta.icon;
            const external = isExternal(r);
            return (
              <div
                key={r.id}
                className="glass glass-hover group flex flex-col rounded-2xl p-5 text-white"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  {leader && (
                    <button
                      onClick={() => remove(r.id)}
                      className="text-white/30 opacity-0 transition hover:text-red-300 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h3 className="font-bold leading-tight">{r.title}</h3>
                {r.description && (
                  <p className="mt-1 flex-1 text-sm text-white/60">
                    {r.description}
                  </p>
                )}
                <a
                  href={r.url}
                  target="_blank"
                  download={!external}
                  className="btn-apple mt-4 justify-center"
                >
                  {external ? (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      Abrir
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Baixar
                    </>
                  )}
                </a>
              </div>
            );
          })}
        </div>
      )}

      {openNew && (
        <NewResourceDialog onClose={() => setOpenNew(false)} onSaved={load} />
      )}
    </div>
  );
}

function NewResourceDialog({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("PRESET");
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim()) return;
    setSaving(true);
    if (mode === "upload" && file) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title);
      fd.append("description", description);
      fd.append("type", type);
      await fetch("/api/resources", { method: "POST", body: fd });
    } else {
      await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, type: "LINK", url }),
      });
    }
    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
      <div className="glass-strong max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 text-white">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Adicionar recurso</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (ex: Preset Reels Dourado)"
            className="input-glass"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Descrição curta"
            className="input-glass resize-none"
          />

          {/* Tipo */}
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  type === t.value
                    ? "border-white/30 bg-white/15 text-white"
                    : "border-white/10 text-white/50 hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Modo: upload ou link */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode("upload")}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                mode === "upload"
                  ? "border-white/30 bg-white/12 text-white"
                  : "border-white/10 text-white/50 hover:bg-white/5"
              }`}
            >
              Enviar arquivo
            </button>
            <button
              onClick={() => setMode("link")}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                mode === "link"
                  ? "border-white/30 bg-white/12 text-white"
                  : "border-white/10 text-white/50 hover:bg-white/5"
              }`}
            >
              Colar link
            </button>
          </div>

          {mode === "upload" ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-black/15 py-6 text-center text-sm text-white/70 transition hover:border-white/30">
              {file ? file.name : "Clique para escolher o arquivo"}
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          ) : (
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="input-glass"
            />
          )}

          <button
            onClick={submit}
            disabled={
              saving ||
              !title.trim() ||
              (mode === "upload" ? !file : !url.trim())
            }
            className="btn-apple-primary w-full"
          >
            {saving ? "Salvando..." : "Adicionar à biblioteca"}
          </button>
        </div>
      </div>
    </div>
  );
}
