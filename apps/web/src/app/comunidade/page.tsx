"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Megaphone, 
  Instagram, 
  Calendar, 
  Heart, 
  Pin, 
  ArrowLeft, 
  Search, 
  Share2, 
  Check, 
  Clock, 
  MapPin, 
  Bell,
  X
} from "lucide-react";
import { Tau } from "@/components/brand/tau";

type Notice = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
};

// Componente do Contador de Encontros Semanais
function NextMeetingCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isSaturday, setIsSaturday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      const currentDay = now.getDay(); // 0: Domingo, 6: Sábado
      
      let daysToAdd = (6 - currentDay + 7) % 7;
      if (daysToAdd === 0 && now.getHours() >= 20) {
        daysToAdd = 7;
      }
      
      target.setDate(now.getDate() + daysToAdd);
      target.setHours(17, 0, 0, 0);

      const diff = target.getTime() - now.getTime();
      
      // Se for sábado entre 17h e 20h, o encontro está acontecendo agora!
      if (currentDay === 6 && now.getHours() >= 17 && now.getHours() < 20) {
        setIsSaturday(true);
        return;
      } else {
        setIsSaturday(false);
      }

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isSaturday) {
    return (
      <div className="glass rounded-[2rem] p-6 text-center border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 shadow-lg relative overflow-hidden animate-pulse-subtle max-w-3xl mx-auto mb-12">
        <div className="absolute inset-0 bg-amber-500/[0.02] pointer-events-none" />
        <span className="inline-block rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-300 animate-bounce mb-3">
          Acontecendo Agora!
        </span>
        <h3 className="text-2xl font-black text-white">Nosso Encontro Semanal começou!</h3>
        <p className="text-sm text-white/70 mt-2">
          Venha celebrar conosco! Missa às 17h00 na Paróquia de Várzea Paulista, seguida do Encontro JS às 18h15.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-[2.5rem] p-8 border-white/10 shadow-xl max-w-3xl mx-auto mb-12 relative overflow-hidden bg-gradient-to-r from-white/[0.01] via-white/[0.03] to-white/[0.01]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="text-center md:text-left space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-300/80">Prepare o seu coração</span>
          <h3 className="text-xl font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
            <Clock className="h-5 w-5 text-amber-400" />
            Próximo Encontro de Jovens
          </h3>
          <p className="text-xs text-white/60 leading-relaxed max-w-md">
            Sábados às 17h00 com a Santa Missa, e às 18h15 com o Encontro Jovens Sarados na Paróquia de Várzea Paulista.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-lg font-black text-white shadow-inner">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-white/40 mt-1.5">Dias</span>
          </div>
          {/* Divider */}
          <span className="text-lg font-bold text-white/30 mb-5">:</span>
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-lg font-black text-white shadow-inner">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-white/40 mt-1.5">Horas</span>
          </div>
          {/* Divider */}
          <span className="text-lg font-bold text-white/30 mb-5">:</span>
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-lg font-black text-white shadow-inner">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-white/40 mt-1.5">Minutos</span>
          </div>
          {/* Divider */}
          <span className="text-lg font-bold text-white/30 mb-5">:</span>
          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center text-lg font-black text-amber-400 shadow-inner">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-white/40 mt-1.5">Seg</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComunidadePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"TODOS" | "PINNED" | "ENCONTROS">("TODOS");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    fetch("/api/notices?scope=MEMBROS")
      .then((r) => r.json())
      .then((d) => {
        const sorted = [...d].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setNotices(sorted);
        setLoading(false);
      });
  }, []);

  const getNoticeCategory = (title: string, body: string) => {
    const t = (title + " " + body).toLowerCase();
    if (t.includes("retiro") || t.includes("acampamento")) {
      return { label: "Retiro 🏕️", color: "bg-orange-500/15 border-orange-500/30 text-orange-300" };
    }
    if (t.includes("missa") || t.includes("eucaristia") || t.includes("adorar") || t.includes("adoracao")) {
      return { label: "Espiritualidade 🙏", color: "bg-amber-500/15 border-amber-500/30 text-amber-300" };
    }
    if (t.includes("social") || t.includes("doacao") || t.includes("alimento") || t.includes("caridade")) {
      return { label: "Ação Social 🤝", color: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" };
    }
    if (t.includes("formacao") || t.includes("aula") || t.includes("estudo")) {
      return { label: "Formação 📚", color: "bg-blue-500/15 border-blue-500/30 text-blue-300" };
    }
    if (t.includes("encontro") || t.includes("jovens sarados") || t.includes("culto")) {
      return { label: "Encontro 🔥", color: "bg-purple-500/15 border-purple-500/30 text-purple-300" };
    }
    return { label: "Comunicado 📢", color: "bg-white/5 border-white/10 text-white/70" };
  };

  const handleShare = (notice: Notice) => {
    const text = `📢 *${notice.title}* (Jovens Sarados Várzea Paulista)\n\n${notice.body}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(notice.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filtragem dinâmica dos comunicados
  const filteredNotices = notices.filter((n) => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === "PINNED") return n.pinned;
    if (filter === "ENCONTROS") {
      const cat = getNoticeCategory(n.title, n.body).label;
      return cat.includes("Encontro") || cat.includes("Espiritualidade");
    }
    return true;
  });

  return (
    <div className="app-bg relative min-h-screen overflow-x-hidden text-white scroll-smooth">
      {/* Orbs de fundo */}
      <div className="orb left-[-4rem] top-[-4rem] h-96 w-96 bg-amber-500/25" />
      <div className="orb right-[-4rem] top-[30%] h-80 w-80 bg-rose-500/15" />
      <div className="orb bottom-[-8rem] left-[20%] h-[30rem] w-[30rem] bg-indigo-500/20" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Topo / Header */}
        <header className="sticky top-0 z-20 px-4 py-4 sm:px-6">
          <div className="glass mx-auto max-w-5xl flex items-center justify-between rounded-full px-6 py-3.5 shadow-lg border-t-white/20 border-l-white/20">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                title="Voltar"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-sm">
                <Tau className="h-5.5 w-5.5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold tracking-tight">Jovens Sarados</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Várzea Paulista</p>
              </div>
            </div>
            <a
              href="https://www.instagram.com/js.varzeapaulista/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-apple-primary px-5 py-2 text-xs font-bold"
            >
              <Instagram className="h-3.5 w-3.5" />
              Seguir
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="px-6 py-20 text-center flex-grow flex items-center justify-center">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 border border-white/10 shadow-2xl relative">
              {/* Glow circular atrás do Tau */}
              <div className="absolute inset-0 rounded-3xl bg-amber-500/10 blur-xl" />
              <Tau className="h-16 w-16 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)] z-10" />
            </div>
            <span className="glass inline-block rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-300 border-amber-500/20">
              Geração Salva Vidas
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl text-white">
              Aqui é o<br /><span className="bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent">seu lugar</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70">
              Um lugar de fé, amizade e propósito para os jovens de Várzea
              Paulista. Vem viver essa caminhada de santidade e alegria com a gente.
            </p>
            <a
              href="#avisos"
              className="btn-apple mt-8 inline-flex items-center gap-2 px-6 py-3"
            >
              <Megaphone className="h-4.5 w-4.5" />
              Ver comunicados
            </a>
          </div>
        </section>

        {/* Contador e Avisos */}
        <section id="avisos" className="mx-auto w-full max-w-5xl px-6 py-16 scroll-mt-24">
          {/* Banner de Próximo Encontro */}
          <NextMeetingCountdown />

          {/* Cabeçalho do Mural */}
          <div className="mb-10 text-center space-y-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
              <Bell className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Mural de Avisos</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
              Fique por dentro de tudo que acontece, eventos, ações sociais e reuniões da nossa comunidade.
            </p>
          </div>

          {/* Barra de Pesquisa e Filtros */}
          <div className="mb-10 max-w-xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Pesquisar comunicados..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass pl-11 pr-4 py-2.5 rounded-full"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {(["TODOS", "PINNED", "ENCONTROS"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition duration-200 border ${
                    filter === t
                      ? "bg-amber-400 border-amber-400 text-[#1a100a] shadow-lg shadow-amber-500/15"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t === "TODOS" && "Todos"}
                  {t === "PINNED" && "Importantes 📌"}
                  {t === "ENCONTROS" && "Encontros & Missa 🙏"}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Comunicados */}
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="glass rounded-[2rem] border-dashed border-white/10 py-20 text-center max-w-lg mx-auto">
              <Megaphone className="mx-auto h-12 w-12 text-white/30" />
              <p className="mt-5 font-bold text-lg text-white">
                Nenhum comunicado encontrado
              </p>
              <p className="mt-1 text-sm text-white/50">
                Volte mais tarde ou tente ajustar a sua pesquisa de termos.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredNotices.map((n) => {
                const category = getNoticeCategory(n.title, n.body);
                return (
                  <article
                    key={n.id}
                    onClick={() => setSelectedNotice(n)}
                    className={`rounded-[2.5rem] p-7 transition-all duration-300 flex flex-col justify-between relative group hover:scale-[1.01] cursor-pointer ${
                      n.pinned
                        ? "glass-pinned border-l-4 border-l-amber-400 shadow-lg shadow-brand-500/5"
                        : "glass hover:border-white/20"
                    }`}
                  >
                    <div>
                      {/* Badge do Calendário e Tag */}
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Calendar Badge */}
                          <div className="flex flex-col items-center justify-center bg-white/5 rounded-xl border border-white/10 w-11 h-12 shrink-0">
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-300">
                              {new Date(n.createdAt)
                                .toLocaleDateString("pt-BR", { month: "short" })
                                .replace(".", "")}
                            </span>
                            <span className="text-sm font-black text-white leading-none mt-0.5">
                              {new Date(n.createdAt).toLocaleDateString("pt-BR", { day: "2-digit" })}
                            </span>
                          </div>
                          
                          {/* Tag de Categoria */}
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${category.color}`}>
                            {category.label}
                          </span>
                        </div>

                        {/* Botão de Compartilhar/Copiar */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(n);
                          }}
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5"
                          title="Copiar para compartilhar"
                        >
                          {copiedId === n.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Share2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Título e Texto */}
                      <h3 className="text-xl font-bold tracking-tight text-white mb-2 leading-tight">
                        {n.title}
                      </h3>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">
                        {n.body}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Rodapé */}
        <footer className="px-6 py-12 text-center border-t border-white/5 mt-auto">
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-orange-400 fill-orange-400/20 animate-pulse" />
            <span className="font-bold text-sm tracking-tight">
              Jovens Sarados · Várzea Paulista
            </span>
          </div>
          <p className="mt-2 text-xs text-white/40">
            Feito com fé pela equipe de comunicação. Todos os direitos reservados.
          </p>
        </footer>
      </div>

      {/* Modal / Popup de Detalhes do Aviso */}
      {selectedNotice && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className="glass rounded-[2.5rem] p-8 max-w-xl w-full shadow-2xl relative border-white/10 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de fechar */}
            <button 
              onClick={() => setSelectedNotice(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full border border-white/10 transition"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="space-y-6">
              {/* Data e categoria */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center bg-white/5 rounded-xl border border-white/10 w-11 h-12">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-300">
                    {new Date(selectedNotice.createdAt)
                      .toLocaleDateString("pt-BR", { month: "short" })
                      .replace(".", "")}
                  </span>
                  <span className="text-sm font-black text-white leading-none mt-0.5">
                    {new Date(selectedNotice.createdAt).toLocaleDateString("pt-BR", { day: "2-digit" })}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getNoticeCategory(selectedNotice.title, selectedNotice.body).color}`}>
                  {getNoticeCategory(selectedNotice.title, selectedNotice.body).label}
                </span>
              </div>

              {/* Título */}
              <h3 className="text-2xl font-black tracking-tight text-white leading-tight pr-8">
                {selectedNotice.title}
              </h3>

              {/* Corpo do texto com scroll caso seja longo */}
              <div className="max-h-[40vh] overflow-y-auto pr-2">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                  {selectedNotice.body}
                </p>
              </div>

              {/* Ações adicionais */}
              <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">Geração Salva Vidas</span>
                <button
                  onClick={() => handleShare(selectedNotice)}
                  className="btn-apple flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
                >
                  {copiedId === selectedNotice.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-white" />
                      Copiar Conteúdo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
