"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Calendar as CalIcon,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Trash2,
  Pencil,
} from "lucide-react";

type Post = {
  id: string;
  title: string;
  description?: string;
  date: string;
  platform: string;
  status: string;
};

const PLATFORMS = [
  { value: "INSTAGRAM", label: "Feed", color: "bg-pink-500/25 text-pink-200 border-pink-400/30", dot: "bg-pink-400" },
  { value: "STORIES", label: "Stories", color: "bg-amber-500/25 text-amber-200 border-amber-400/30", dot: "bg-amber-400" },
  { value: "REELS", label: "Reels", color: "bg-indigo-500/25 text-indigo-200 border-indigo-400/30", dot: "bg-indigo-400" },
  { value: "OUTRO", label: "Outro", color: "bg-white/15 text-white/80 border-white/20", dot: "bg-white/60" },
];

function platMeta(v: string) {
  return PLATFORMS.find((p) => p.value === v) ?? PLATFORMS[3];
}

const STATUS_COLOR: Record<string, string> = {
  PUBLICADO: "bg-emerald-400",
  PLANEJADO: "bg-amber-400",
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarioPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ref, setRef] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [presetDate, setPresetDate] = useState("");

  const load = useCallback(async () => {
    const data = await fetch("/api/posts").then((r) => r.json());
    setPosts(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const year = ref.getFullYear();
  const month = ref.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function postsOn(day: number) {
    const key = ymd(new Date(year, month, day));
    return posts.filter((p) => p.date.slice(0, 10) === key);
  }

  async function toggleStatus(p: Post) {
    await fetch(`/api/posts/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: p.status === "PUBLICADO" ? "PLANEJADO" : "PUBLICADO" }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    load();
  }

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const monthCount = posts.filter((p) => {
    const d = new Date(p.date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;

  const selectedPosts = selectedDay ? postsOn(selectedDay) : [];
  const pubCount = selectedPosts.filter((p) => p.status === "PUBLICADO").length;
  const planCount = selectedPosts.filter((p) => p.status === "PLANEJADO").length;

  return (
    <div className="mx-auto max-w-6xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Calendário</h1>
          <p className="mt-1.5 text-sm text-white/60">
            {monthCount} post(s) em {MONTHS[month]}. Planeje o conteúdo do mês.
          </p>
        </div>
        <button
          onClick={() => { setPresetDate(ymd(today)); setOpenNew(true); }}
          className="btn-apple-primary"
        >
          <Plus className="h-5 w-5" /> Novo post
        </button>
      </header>

      {/* Navegação de mês */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setRef(new Date(year, month - 1, 1))} className="btn-apple px-3 py-2">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-bold text-white">
          {MONTHS[month]} <span className="text-white/50">{year}</span>
        </h2>
        <button onClick={() => setRef(new Date(year, month + 1, 1))} className="btn-apple px-3 py-2">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-6">
        {/* Grade */}
        <div className="glass flex-1 rounded-3xl p-4">
          <div className="mb-2 grid grid-cols-7 gap-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1 text-center text-[11px] font-bold uppercase tracking-wider text-white/40">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {cells.map((day, i) => {
              const dayPosts = day ? postsOn(day) : [];
              const pub = dayPosts.filter((p) => p.status === "PUBLICADO").length;
              const plan = dayPosts.filter((p) => p.status === "PLANEJADO").length;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={i}
                  onClick={() => day && setSelectedDay(isSelected ? null : day)}
                  disabled={!day}
                  className={`relative min-h-[72px] rounded-2xl border p-2 text-left transition ${
                    day
                      ? isSelected
                        ? "border-amber-400/40 bg-amber-500/10 ring-1 ring-amber-400/30"
                        : "border-white/10 bg-white/5 hover:bg-white/8"
                      : "border-transparent"
                  }`}
                >
                  {day && (
                    <>
                      <span className={`text-xs font-semibold ${
                        isToday(day)
                          ? "flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                          : "text-white/60"
                      }`}>
                        {day}
                      </span>
                      {/* Indicadores coloridos */}
                      {(pub > 0 || plan > 0) && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {pub > 0 && (
                            <span className="flex items-center gap-0.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-400" />
                              <span className="text-[10px] font-bold text-emerald-300">{pub}</span>
                            </span>
                          )}
                          {plan > 0 && (
                            <span className="flex items-center gap-0.5">
                              <span className="h-2 w-2 rounded-full bg-amber-400" />
                              <span className="text-[10px] font-bold text-amber-300">{plan}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-3">
            <span className="flex items-center gap-1.5 text-[11px] text-white/50">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Publicado
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-white/50">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Planejado
            </span>
            <span className="ml-auto text-[11px] text-white/30">Clique num dia para ver detalhes</span>
          </div>
        </div>

        {/* Painel lateral — detalhes do dia */}
        <div className="w-80 shrink-0">
          <div className="glass sticky top-8 rounded-3xl p-5 text-white">
            {selectedDay ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {WEEKDAYS[new Date(year, month, selectedDay).getDay()]}
                    </p>
                    <h3 className="text-2xl font-black">
                      {selectedDay} <span className="text-base font-medium text-white/50">{MONTHS[month].slice(0, 3)}</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setPresetDate(ymd(new Date(year, month, selectedDay)));
                      setOpenNew(true);
                    }}
                    className="btn-apple-primary px-3 py-2 text-xs"
                  >
                    <Plus className="h-4 w-4" /> Adicionar
                  </button>
                </div>

                {selectedPosts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 py-10 text-center">
                    <CalIcon className="mx-auto h-8 w-8 text-white/20" />
                    <p className="mt-2 text-sm text-white/40">Nenhum post neste dia</p>
                    <button
                      onClick={() => {
                        setPresetDate(ymd(new Date(year, month, selectedDay)));
                        setOpenNew(true);
                      }}
                      className="mt-3 text-xs font-semibold text-amber-300 hover:text-amber-200"
                    >
                      + Criar primeiro post
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Resumo */}
                    <div className="flex gap-2">
                      {pubCount > 0 && (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                          {pubCount} publicado{pubCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {planCount > 0 && (
                        <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                          {planCount} planejado{planCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Lista de posts */}
                    {selectedPosts.map((p) => {
                      const meta = platMeta(p.platform);
                      return (
                        <div
                          key={p.id}
                          className={`rounded-2xl border p-3 ${meta.color}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_COLOR[p.status] ?? "bg-white/40"}`} />
                                <span className="truncate text-sm font-bold">{p.title}</span>
                              </div>
                              <span className="mt-0.5 block text-[10px] uppercase tracking-wider opacity-60">
                                {meta.label} • {p.status === "PUBLICADO" ? "Publicado" : "Planejado"}
                              </span>
                              {p.description && (
                                <p className="mt-1.5 text-xs leading-relaxed opacity-70">{p.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex gap-1.5">
                            <button
                              onClick={() => toggleStatus(p)}
                              className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1 text-[10px] font-semibold hover:bg-black/40 transition"
                            >
                              <Check className="h-3 w-3" />
                              {p.status === "PUBLICADO" ? "Desmarcar" : "Publicar"}
                            </button>
                            <button
                              onClick={() => setEditingPost(p)}
                              className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1 text-[10px] font-semibold hover:bg-black/40 transition"
                            >
                              <Pencil className="h-3 w-3" /> Editar
                            </button>
                            <button
                              onClick={() => remove(p.id)}
                              className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1 text-[10px] font-semibold hover:bg-red-500/40 transition"
                            >
                              <Trash2 className="h-3 w-3" /> Apagar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="py-10 text-center">
                <CalIcon className="mx-auto h-10 w-10 text-white/15" />
                <p className="mt-3 text-sm font-medium text-white/40">
                  Selecione um dia no calendário
                </p>
                <p className="mt-1 text-xs text-white/25">para ver e gerenciar os posts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal novo post */}
      {openNew && (
        <PostDialog
          date={presetDate}
          onClose={() => setOpenNew(false)}
          onSaved={() => { load(); setOpenNew(false); }}
        />
      )}

      {/* Modal editar post */}
      {editingPost && (
        <PostDialog
          post={editingPost}
          date={editingPost.date.slice(0, 10)}
          onClose={() => setEditingPost(null)}
          onSaved={() => { load(); setEditingPost(null); }}
        />
      )}
    </div>
  );
}

function PostDialog({
  post,
  date,
  onClose,
  onSaved,
}: {
  post?: Post;
  date: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!post;
  const [title, setTitle] = useState(post?.title ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [platform, setPlatform] = useState(post?.platform ?? "INSTAGRAM");
  const [when, setWhen] = useState(date);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim() || !when) return;
    setSaving(true);
    if (isEdit) {
      await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date: when, platform }),
      });
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date: when, platform }),
      });
    }
    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
      <div className="glass-strong w-full max-w-lg rounded-3xl p-6 text-white">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isEdit ? "Editar post" : "Novo post"}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do post" className="input-glass" />
          <input type="date" value={when} onChange={(e) => setWhen(e.target.value)} className="input-glass [color-scheme:dark]" />
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  platform === p.value
                    ? "border-white/30 bg-white/15 text-white"
                    : "border-white/10 text-white/50 hover:bg-white/5"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Ideia / legenda (opcional)"
            className="input-glass resize-none"
          />
          <button
            onClick={submit}
            disabled={saving || !title.trim() || !when}
            className="btn-apple-primary w-full"
          >
            {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Agendar post"}
          </button>
        </div>
      </div>
    </div>
  );
}
