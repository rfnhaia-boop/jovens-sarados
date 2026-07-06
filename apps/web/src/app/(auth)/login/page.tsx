"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Tau } from "@/components/brand/tau";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "E-mail ou senha inválidos.");
      }
      window.location.href = "/painel";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Voltar */}
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-200/20 bg-brand-500/10 shadow-2xl shadow-black/20">
          <Tau className="h-9 w-9 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Jovens Sarados
        </h1>
        <p className="mt-2 text-sm font-medium text-brand-200/80">
          Painel dos Servos · Comunicação
        </p>
      </div>

      <div className="glass-strong rounded-2xl p-8 text-white">
        <h2 className="mb-1 text-xl font-bold">Bem-vindo de volta</h2>
        <p className="mb-6 text-sm text-white/60">
          Entre para acessar a galeria e a agenda do ministério.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* E-mail */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="input-glass py-3 pl-11 pr-4 placeholder-white/35"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-glass py-3 pl-11 pr-11 placeholder-white/35"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-apple-primary w-full py-3"
          >
            {loading ? "Entrando..." : "Entrar"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs font-medium text-brand-200/70">
        Acesso exclusivo aos servos do ministério.
      </p>
    </div>
  );
}
