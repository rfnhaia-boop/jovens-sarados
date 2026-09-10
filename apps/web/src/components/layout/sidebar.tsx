"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Images,
  Calendar,
  Megaphone,
  Network,
  Users,
  Church,
  GraduationCap,
  Library,
  Sparkles,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tau } from "@/components/brand/tau";
import { cn } from "@/lib/utils";
import { roleLabel, isLeader } from "@/lib/roles";

const nav = [
  { href: "/painel", label: "Início", icon: LayoutGrid, leaderOnly: false },
  { href: "/galeria", label: "Galeria", icon: Images, leaderOnly: false },
  { href: "/avisos", label: "Avisos", icon: Megaphone, leaderOnly: false },
  { href: "/escalas", label: "Escalas", icon: ClipboardList, leaderOnly: false },
  { href: "/calendario", label: "Calendário", icon: Calendar, leaderOnly: false },
  { href: "/js", label: "Página do JS", icon: Sparkles, leaderOnly: false },
  { href: "/equipe", label: "Equipe", icon: Users, leaderOnly: false },
  { href: "/ministerios", label: "Ministérios", icon: Church, leaderOnly: false },
  { href: "/aprendizado", label: "Aprendizado", icon: GraduationCap, leaderOnly: false },
  { href: "/biblioteca", label: "Biblioteca", icon: Library, leaderOnly: false },
  { href: "/estrutura", label: "Estrutura", icon: Network, leaderOnly: true },
];

type User = { name: string; role: string };

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  // lê preferência salva
  useEffect(() => {
    setCollapsed(localStorage.getItem("js_sidebar_collapsed") === "1");
  }, []);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("js_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "glass-strong relative z-10 flex flex-col rounded-2xl text-white transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Marca + toggle */}
      <div
        className={cn(
          "flex items-center border-b border-white/10 py-5",
          collapsed ? "flex-col gap-3 px-3" : "gap-3 px-6"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-300/25 bg-brand-500/10">
          <Tau className="h-6 w-6" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold leading-tight tracking-tight">
              Jovens Sarados
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
              Comunicação
            </p>
          </div>
        )}
        <button
          onClick={toggle}
          className="rounded-full bg-white/5 p-1.5 text-white/50 transition hover:bg-brand-300/15 hover:text-white"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav
          .filter((item) => !item.leaderOnly || isLeader(user?.role))
          .map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-xl text-sm font-medium transition",
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
                  active
                    ? "bg-brand-300/15 font-semibold text-brand-100 ring-1 ring-brand-300/20"
                    : "text-white/55 hover:bg-white/6 hover:text-white/90"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
      </nav>

      {/* Usuário / sair */}
      <div className="border-t border-white/10 px-3 py-4">
        <div
          className={cn(
            "flex items-center rounded-xl py-2",
            collapsed ? "flex-col gap-2 px-0" : "gap-3 px-3"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-sm font-semibold shadow-lg">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user?.name ?? "..."}
              </p>
              <p className="truncate text-xs text-white/60">
                {user ? roleLabel(user.role) : ""}
              </p>
            </div>
          )}
          <button
            onClick={logout}
          className="rounded-full bg-white/5 p-1.5 text-white/40 transition-all duration-200 hover:bg-brand-300/15 hover:text-white/80"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
