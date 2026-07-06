"use client";

import { useEffect, useState } from "react";
import { X, UploadCloud, Plus } from "lucide-react";

type Category = { id: string; name: string; type: string };

const KINDS = [
  { value: "PHOTO", label: "Foto" },
  { value: "REELS", label: "Reels" },
  { value: "STORY", label: "Story" },
];

export function UploadDialog({
  open,
  onClose,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState("PHOTO");
  const [takenOn, setTakenOn] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("PERSON");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) loadCategories();
  }, [open]);

  async function loadCategories() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }

  async function addCategory() {
    if (!newName.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, type: newType }),
    });
    const cat = await res.json();
    setNewName("");
    await loadCategories();
    setSelected((s) => [...s, cat.id]);
  }

  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  async function submit() {
    if (!file) return;
    setSaving(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("kind", kind);
    if (takenOn) fd.append("takenOn", takenOn);
    selected.forEach((id) => fd.append("categoryIds", id));
    await fetch("/api/media", { method: "POST", body: fd });
    setSaving(false);
    setFile(null);
    setSelected([]);
    setTakenOn("");
    onUploaded();
    onClose();
  }

  if (!open) return null;

  const people = categories.filter((c) => c.type === "PERSON");
  const events = categories.filter((c) => c.type === "EVENT");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-md">
      <div className="glass-strong max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[2rem] p-8 text-white shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Enviar mídia</h2>
            <p className="text-xs text-white/50 mt-1">Selecione o arquivo e as categorias.</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/5 transition duration-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Arquivo */}
        <label className="mb-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/15 bg-black/15 py-10 text-center transition-all duration-300 hover:border-white/30 hover:bg-black/10">
          <UploadCloud className="h-8 w-8 text-white/80" />
          <span className="mt-2 text-sm font-medium text-white/80">
            {file ? file.name : "Clique para escolher um arquivo"}
          </span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        {/* Tipo */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/50">
            Tipo
          </label>
          <div className="flex gap-2">
            {KINDS.map((k) => (
              <button
                key={k.value}
                onClick={() => setKind(k.value)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  kind === k.value
                    ? "border-white/30 bg-white/12 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                    : "border-white/10 text-white/50 hover:bg-white/5"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/50">
            Dia da foto
          </label>
          <input
            type="date"
            value={takenOn}
            onChange={(e) => setTakenOn(e.target.value)}
            className="input-glass w-full [color-scheme:dark]"
          />
        </div>

        {/* Categorias */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/50">
            Categorias (pessoa / evento)
          </label>
          <div className="flex flex-wrap gap-2">
            {[...people, ...events].map((c) => (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  selected.includes(c.id)
                    ? "border-white/30 bg-white/12 text-white"
                    : "border-white/10 text-white/50 hover:bg-white/5"
                }`}
              >
                {c.type === "PERSON" ? "👤" : "📅"} {c.name}
              </button>
            ))}
            {categories.length === 0 && (
              <span className="text-xs text-white/50">
                Nenhuma categoria ainda. Crie abaixo.
              </span>
            )}
          </div>
        </div>

        {/* Nova categoria */}
        <div className="mb-6 rounded-2xl border border-white/8 bg-black/15 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
            Criar categoria
          </p>
          <div className="mb-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => setNewType("PERSON")}
              className={`rounded-xl border px-3 py-1.5 text-[10px] font-medium transition ${
                newType === "PERSON"
                  ? "border-white/30 bg-white/12 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                  : "border-white/10 text-white/50 hover:bg-white/5"
              }`}
            >
              👤 Pessoa
            </button>
            <button
              type="button"
              onClick={() => setNewType("EVENT")}
              className={`rounded-xl border px-3 py-1.5 text-[10px] font-medium transition ${
                newType === "EVENT"
                  ? "border-white/30 bg-white/12 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                  : "border-white/10 text-white/50 hover:bg-white/5"
              }`}
            >
              📅 Evento
            </button>
          </div>
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Guilherme, Carreão..."
              className="input-glass flex-1 py-2"
            />
            <button
              onClick={addCategory}
              className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!file || saving}
          className="btn-apple-primary w-full py-3.5"
        >
          {saving ? "Enviando..." : "Enviar para a galeria"}
        </button>
      </div>
    </div>
  );
}
