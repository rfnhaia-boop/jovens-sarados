"use client";

import { useEffect, useState } from "react";
import {
  Instagram,
  ExternalLink,
  Heart,
  MessageCircle,
  Users,
  Grid3x3,
  TrendingUp,
  RefreshCw,
  PlayCircle,
} from "lucide-react";

type Post = {
  shortCode: string;
  url: string;
  displayUrl: string;
  type: string;
  likesCount: number;
  commentsCount: number;
  caption: string;
  timestamp: string;
};
type Profile = {
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  profilePicUrl: string;
  posts: Post[];
};

function fmt(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return String(n);
}

export function InstagramCard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const d = await fetch("/api/instagram").then((r) => r.json());
    setProfile(d.profile);
    setUpdatedAt(d.updatedAt);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function refresh() {
    setRefreshing(true);
    const r = await fetch("/api/instagram", { method: "POST" });
    if (r.ok) await load();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <div className="glass flex h-64 items-center justify-center rounded-[2rem]">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass rounded-[2rem] p-6 text-center text-white">
        <Instagram className="mx-auto h-8 w-8 text-white/40" />
        <p className="mt-3 text-sm text-white/70">
          Análise do Instagram indisponível.
        </p>
      </div>
    );
  }

  const posts = profile.posts ?? [];
  const avgLikes = posts.length
    ? Math.round(posts.reduce((s, p) => s + p.likesCount, 0) / posts.length)
    : 0;
  const avgComments = posts.length
    ? Math.round(posts.reduce((s, p) => s + p.commentsCount, 0) / posts.length)
    : 0;
  const engagement = profile.followersCount
    ? (((avgLikes + avgComments) / profile.followersCount) * 100).toFixed(1)
    : "0";

  return (
    <div className="glass space-y-5 rounded-[2rem] p-6 text-white">
      {/* Cabeçalho do perfil */}
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 p-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.profilePicUrl}
            alt={profile.username}
            className="h-12 w-12 rounded-[0.9rem] object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{profile.fullName}</p>
          <p className="text-[11px] text-white/50">@{profile.username}</p>
        </div>
        <a
          href={`https://www.instagram.com/${profile.username}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-apple rounded-full p-2"
          title="Abrir no Instagram"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Stats principais */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-white/10 bg-white/5 py-2.5">
          <p className="text-lg font-black">{fmt(profile.followersCount)}</p>
          <p className="flex items-center justify-center gap-1 text-[10px] text-white/50">
            <Users className="h-3 w-3" /> Seguidores
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 py-2.5">
          <p className="text-lg font-black">{fmt(profile.postsCount)}</p>
          <p className="flex items-center justify-center gap-1 text-[10px] text-white/50">
            <Grid3x3 className="h-3 w-3" /> Posts
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 py-2.5">
          <p className="text-lg font-black text-amber-300">{engagement}%</p>
          <p className="flex items-center justify-center gap-1 text-[10px] text-white/50">
            <TrendingUp className="h-3 w-3" /> Engaj.
          </p>
        </div>
      </div>

      {/* Média de interações */}
      <div className="flex items-center justify-around rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm">
        <span className="flex items-center gap-1.5 text-white/80">
          <Heart className="h-4 w-4 text-rose-400" /> {avgLikes}
          <span className="text-[10px] text-white/40">média</span>
        </span>
        <span className="flex items-center gap-1.5 text-white/80">
          <MessageCircle className="h-4 w-4 text-sky-400" /> {avgComments}
          <span className="text-[10px] text-white/40">média</span>
        </span>
      </div>

      {/* Últimos posts */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/50">
          Últimos posts
        </p>
        <div className="grid grid-cols-3 gap-2">
          {posts.slice(0, 6).map((p) => (
            <a
              key={p.shortCode}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-indigo-500/20"
              title={p.caption}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.displayUrl}
                alt=""
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility =
                    "hidden";
                }}
              />
              {p.type === "Video" && (
                <PlayCircle className="absolute right-1 top-1 h-4 w-4 text-white drop-shadow" />
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
                <span className="flex items-center gap-1 text-[10px] font-semibold">
                  <Heart className="h-2.5 w-2.5 fill-white" /> {p.likesCount}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Rodapé: atualizar */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-[10px] text-white/40">
          {updatedAt
            ? "Atualizado em " +
              new Date(updatedAt).toLocaleDateString("pt-BR")
            : ""}
        </span>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          title="Atualizar dados (líder)"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Atualizar
        </button>
      </div>
    </div>
  );
}
