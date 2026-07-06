"use client";

import { useEffect, useState, useCallback } from "react";
import { GraduationCap, Plus, X, PlayCircle, Trash2 } from "lucide-react";
import { isLeader } from "@/lib/roles";

type Lesson = {
  id: string;
  title: string;
  description?: string;
  category: string;
  videoUrl?: string;
  content?: string;
};

const CATEGORIES = [
  { value: "FOTO", label: "📷 Foto" },
  { value: "REELS", label: "🎬 Reels" },
  { value: "STORIES", label: "⚡ Stories" },
  { value: "INSTAGRAM", label: "📈 Instagram" },
  { value: "GERAL", label: "✨ Geral" },
];

function catLabel(v: string) {
  return CATEGORIES.find((c) => c.value === v)?.label ?? v;
}

function toEmbed(url?: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export default function AprendizadoPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [playing, setPlaying] = useState<Lesson | null>(null);

  const load = useCallback(async () => {
    const me = await fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .catch(() => ({ user: null }));
    setRole(me.user?.role ?? null);
    const data = await fetch("/api/lessons").then((r) => r.json());
    setLessons(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    await fetch(`/api/lessons/${id}`, { method: "DELETE" });
    load();
  }

  const leader = isLeader(role);
  const shown = filter ? lessons.filter((l) => l.category === filter) : lessons;

  return (
    <div className="mx-auto max-w-6xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Aprendizado
          </h1>
          <p className="mt-1.5 text-sm text-white/60">
            Aprenda a tirar foto, gravar reels e stories, e a crescer no
            Instagram.
          </p>
        </div>
        {leader && (
          <button onClick={() => setOpenNew(true)} className="btn-apple-primary">
            <Plus className="h-5 w-5" />
            Nova aula
          </button>
        )}
      </header>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            !filter
              ? "border-white/25 bg-white/12 text-white"
              : "border-white/10 text-white/50 hover:bg-white/8"
          }`}
        >
          Todas
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filter === c.value
                ? "border-white/25 bg-white/12 text-white"
                : "border-white/10 text-white/50 hover:bg-white/8"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : shown.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-24 text-center text-white">
          <GraduationCap className="h-12 w-12 text-white/40" />
          <h3 className="mt-4 font-semibold">Nenhuma aula ainda</h3>
          <p className="mt-1 max-w-sm text-sm text-white/50">
            {leader
              ? "Crie a primeira aula pra ensinar a equipe."
              : "Em breve o líder vai publicar as aulas aqui."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((l) => (
            <div
              key={l.id}
              className="glass glass-hover group flex flex-col rounded-2xl p-5 text-white"
            >
              <div className="mb-2 flex items-start justify-between">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/80">
                  {catLabel(l.category)}
                </span>
                {leader && (
                  <button
                    onClick={() => remove(l.id)}
                    className="text-white/30 opacity-0 transition hover:text-red-300 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h3 className="font-bold leading-tight">{l.title}</h3>
              {l.description && (
                <p className="mt-1 flex-1 text-sm text-white/60">
                  {l.description}
                </p>
              )}
              {(l.videoUrl || l.content) && (
                <button
                  onClick={() => setPlaying(l)}
                  className="btn-apple mt-4 justify-center"
                >
                  <PlayCircle className="h-4 w-4" />
                  Assistir
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {playing && (
        <PlayerDialog lesson={playing} onClose={() => setPlaying(null)} />
      )}
      {openNew && (
        <NewLessonDialog onClose={() => setOpenNew(false)} onSaved={load} />
      )}
    </div>
  );
}

function PlayerDialog({
  lesson,
  onClose,
}: {
  lesson: Lesson;
  onClose: () => void;
}) {
  const embed = toEmbed(lesson.videoUrl);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="glass-strong w-full max-w-2xl overflow-hidden rounded-3xl p-6 text-white">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-lg font-bold">{lesson.title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        {embed ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl">
            <iframe
              src={embed}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : lesson.videoUrl ? (
          <a
            href={lesson.videoUrl}
            target="_blank"
            className="btn-apple-primary w-full justify-center"
          >
            Abrir vídeo
          </a>
        ) : null}
        {lesson.content && (
          <p className="mt-4 whitespace-pre-wrap text-sm text-white/70">
            {lesson.content}
          </p>
        )}
      </div>
    </div>
  );
}

function NewLessonDialog({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("FOTO");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim()) return;
    setSaving(true);
    await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, videoUrl, content }),
    });
    setSaving(false);
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
      <div className="glass-strong max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 text-white">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Nova aula</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título da aula"
            className="input-glass"
          />
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  category === c.value
                    ? "border-white/30 bg-white/15 text-white"
                    : "border-white/10 text-white/50 hover:bg-white/5"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Link do vídeo (YouTube) — opcional"
            className="input-glass"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Resumo curto"
            className="input-glass resize-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Conteúdo / passo a passo (opcional)"
            className="input-glass resize-none"
          />
          <button
            onClick={submit}
            disabled={saving || !title.trim()}
            className="btn-apple-primary w-full"
          >
            {saving ? "Publicando..." : "Publicar aula"}
          </button>
        </div>
      </div>
    </div>
  );
}
