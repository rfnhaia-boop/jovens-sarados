"use client";

import { useEffect, useState } from "react";
import { Images, UploadCloud, PlayCircle } from "lucide-react";
import { UploadDialog } from "@/components/media/upload-dialog";

type Media = {
  id: string;
  name: string;
  kind: string;
  url: string;
  createdAt: string;
  categories: { category: { id: string; name: string; type: string } }[];
};

const KIND_LABEL: Record<string, string> = {
  PHOTO: "Foto",
  REELS: "Reels",
  STORY: "Story",
};

export default function GaleriaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [openUpload, setOpenUpload] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/media");
    setMedia(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // monta lista de categorias existentes a partir das mídias
  const allCats = Array.from(
    new Map(
      media
        .flatMap((m) => m.categories.map((c) => c.category))
        .map((c) => [c.id, c])
    ).values()
  );

  const shown = filter
    ? media.filter((m) => m.categories.some((c) => c.category.id === filter))
    : media;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Galeria
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Fotos, reels e stories do ministério.
          </p>
        </div>
        <button
          onClick={() => setOpenUpload(true)}
          className="btn-apple-primary flex items-center gap-2"
        >
          <UploadCloud className="h-5 w-5" />
          Enviar arquivos
        </button>
      </header>

      {/* Filtros por categoria */}
      {allCats.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter(null)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              !filter
                ? "border-white/25 bg-white/12 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                : "border-white/10 text-white/50 hover:bg-white/8 hover:text-white/70"
            }`}
          >
            Todas
          </button>
          {allCats.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                filter === c.id
                  ? "border-white/25 bg-white/12 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  : "border-white/10 text-white/50 hover:bg-white/8 hover:text-white/70"
              }`}
            >
              {c.type === "PERSON" ? "👤" : "📅"} {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Conteúdo */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      ) : shown.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-24 text-center">
          <div className="glass flex h-20 w-20 items-center justify-center rounded-3xl">
            <Images className="h-10 w-10 text-white/80" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-white">
            Nenhum arquivo ainda
          </h3>
          <p className="mt-2 max-w-sm text-sm text-white/50">
            Comece enviando as primeiras fotos e vídeos do ministério.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((m) => (
            <div
              key={m.id}
              className="glass glass-hover group overflow-hidden rounded-2xl shadow-lg shadow-black/20"
            >
              <div className="relative aspect-square bg-black/30">
                {m.kind === "PHOTO" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.url}
                    alt={m.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video src={m.url} className="h-full w-full object-cover" />
                )}
                {m.kind !== "PHOTO" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                  </div>
                )}
                <span className="absolute left-2.5 top-2.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                  {KIND_LABEL[m.kind] ?? m.kind}
                </span>
              </div>
              <div className="p-3">
                <div className="flex flex-wrap gap-1.5">
                  {m.categories.map((c) => (
                    <span
                      key={c.category.id}
                      className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80 border border-white/10"
                    >
                      {c.category.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUploaded={load}
      />
    </div>
  );
}
