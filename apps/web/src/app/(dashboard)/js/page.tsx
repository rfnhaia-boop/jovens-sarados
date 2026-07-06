"use client";

import { useEffect, useState } from "react";
import { Megaphone, Instagram, Calendar, Pin, Sparkles, Heart, Quote, ExternalLink, X, ZoomIn } from "lucide-react";
import { Tau } from "@/components/brand/tau";
import { InstagramCard } from "@/components/instagram/instagram-card";

type Notice = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
};

const realPhotos = [
  { src: "/images/js/media__1783228809188.jpg", alt: "Comunidade JS Letras", caption: "Nossa Missão nos Sábados" }, // JS letters
  { src: "/images/js/media__1783228809172.jpg", alt: "Encontro Jovens Sarados", caption: "Família Jovens Sarados" }, // Church hall
  { src: "/images/js/media__1783228809175.jpg", alt: "Oração e Fé", caption: "Momento de Clamor e Entrega" }, // Praying profile
  { src: "/images/js/media__1783228809195.jpg", alt: "Santa Missa e Encontro", caption: "A Missa é o Coração de Tudo" }, // Altar group
  { src: "/images/js/media__1783228809208.jpg", alt: "Fraternidade e Apoio", caption: "Juntos na Caminhada de Fé" }, // Praying line
  { src: "/images/js/media__1783229137456.jpg", alt: "Apoio e Oração", caption: "Consolo e Irmandade" }, // Crying/Praying
  { src: "/images/js/media__1783229137485.jpg", alt: "Retiro JS", caption: "Encontro Geral da Juventude" }, // Altar group purple
  { src: "/images/js/media__1783229137486.jpg", alt: "Devoção Mariana", caption: "Consagrados a Nossa Senhora" }, // Our Lady statue
  { src: "/images/js/media__1783229167164.jpg", alt: "Clamor ao Espírito", caption: "Incendeia nossa Alma" }, // Hands raised
  { src: "/images/js/media__1783229167174.jpg", alt: "Contemplação", caption: "Momento de Adoração" }, // Crucifix dark
  { src: "/images/js/media__1783229167187.jpg", alt: "Juventude Santa", caption: "Exultantes na Fé" }, // Crucifix light group
  { src: "/images/js/media__1783229191811.jpg", alt: "Pregação e Encontro", caption: "Anúncio do Amor de Deus" }, // Praying hands
  { src: "/images/js/media__1783229191833.jpg", alt: "Comunidade Unida", caption: "Povo Adorador" }, // Praying line
  { src: "/images/js/media__1783255007025.jpg", alt: "Essência de Jesus", caption: "Viva uma vida que exala a essência de Jesus" },
  { src: "/images/js/media__1783255007026.jpg", alt: "Fraternidade e Oração", caption: "Ainda que vier noites traiçoeiras" },
  { src: "/images/js/media__1783255007033.jpg", alt: "Família Jovens Sarados", caption: "Nossa comunidade reunida" }
];

export default function JSPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const container = document.querySelector("main") || window;
    
    const handleScroll = (e: Event) => {
      const target = e.target;
      if (!target) return;
      if (target === document || target === window) {
        setScrollY(window.scrollY);
      } else if (target instanceof HTMLElement) {
        setScrollY(target.scrollTop || 0);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll({ target: container } as unknown as Event);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      })
      .catch(() => setLoading(false));
  }, []);

  // Parallax offsets
  const bannerY = scrollY * 0.15;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-x-hidden">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-amber-400" />
            Página do JS
          </h1>
          <p className="mt-1.5 text-white/60 text-sm">
            Portal de integração, fotos reais da nossa comunidade, redes sociais e mural público do Jovens Sarados Várzea Paulista.
          </p>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda/Centro - Banner e Mural de Avisos */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Banner Principal com Foto do Grupo (Com Parallax) */}
          <div className="glass rounded-[2rem] overflow-hidden relative group h-72 sm:h-96">
            <div 
              className="absolute inset-0 w-full h-[120%] transition-transform duration-100 ease-out"
              style={{
                transform: `translateY(${-bannerY}px)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={realPhotos[0].src}
                alt={realPhotos[0].alt}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            </div>
            
            {/* Selo Flutuante */}
            <span className="absolute left-6 top-6 glass border-amber-500/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 rounded-full z-10">
              Geração Salva Vidas
            </span>

            {/* Conteúdo sobreposto */}
            <div className="p-8 absolute bottom-0 left-0 right-0 text-white z-10">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                  <Tau className="h-7 w-7 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Várzea Paulista</h2>
                  <p className="text-xs text-white/60">{realPhotos[0].caption}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mural de Avisos do Site (MEMBROS) */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 px-2">
              <Megaphone className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Mural Público (Membros)</h2>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center glass rounded-3xl">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            ) : notices.length === 0 ? (
              <div className="glass rounded-3xl border-dashed border-white/15 py-12 text-center text-white">
                <Megaphone className="mx-auto h-10 w-10 text-white/40 mb-3" />
                <p className="font-semibold text-sm">Nenhum aviso público ativo</p>
                <p className="text-xs text-white/50 mt-1">Crie um aviso com o escopo "Membros (site)" para aparecer aqui.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {notices.slice(0, 4).map((n) => (
                  <article
                    key={n.id}
                    className={`rounded-3xl p-5 text-white flex flex-col justify-between transition-all duration-300 ${
                      n.pinned
                        ? "glass-pinned glass-pinned-hover"
                        : "glass glass-hover"
                    }`}
                  >
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2 text-white/50">
                        <div className="flex items-center gap-1 text-[11px] font-semibold tracking-wide">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(n.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                            })}
                          </span>
                        </div>
                        {n.pinned && (
                          <Pin className="h-3 w-3 fill-amber-300 text-amber-300" />
                        )}
                      </div>
                      <h3 className="text-sm font-bold tracking-tight text-white mb-1.5 leading-snug">
                        {n.title}
                      </h3>
                      <p className="text-xs text-white/70 line-clamp-3 leading-relaxed">
                        {n.body}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita - Mensagem e Redes Sociais */}
        <div className="space-y-6">
          
          {/* Card Mensagem Espiritual */}
          <div className="glass rounded-[2rem] p-6 text-white relative overflow-hidden">
            {/* Efeito Glow */}
            <div className="absolute right-[-4rem] top-[-4rem] h-32 w-32 bg-amber-500/10 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-2 mb-4">
              <Quote className="h-5 w-5 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Mensagem do Ministério</h3>
            </div>
            
            <p className="text-sm italic text-white/80 leading-relaxed font-light mb-6">
              "Jovens, se fordes aquilo que deveis ser, colocareis fogo no mundo inteiro! Não tenhais medo de responder com generosidade ao chamado de Deus."
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <p className="text-xs font-bold">Santa Catarina de Sena</p>
                <p className="text-[10px] text-white/50">Padroeira Secundária</p>
              </div>
              <button 
                onClick={() => setLiked(!liked)}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/5 transition duration-200"
              >
                <Heart className={`h-4 w-4 transition ${liked ? "fill-red-500 text-red-500 scale-110" : ""}`} />
              </button>
            </div>
          </div>

          {/* Análise real do Instagram (via Apify) */}
          <InstagramCard />

        </div>

      </div>

      {/* Seção Completa: Galeria de Fotos com Parallax Staggered */}
      <section className="space-y-6 pt-6 pb-12">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-400" />
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Galeria de Momentos JS</h2>
          </div>
          <span className="text-xs text-white/50 glass px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            {realPhotos.length} fotos reais
          </span>
        </div>

        {/* Masonry-like Parallax Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {realPhotos.map((photo, i) => {
            return (
              <div
                key={i}
                onClick={() => setSelectedPhoto(photo.src)}
                className="glass rounded-3xl overflow-hidden relative group aspect-[4/5] cursor-pointer shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300 ease-out"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Details overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs font-extrabold text-amber-400 tracking-tight flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1">
                    <ZoomIn className="h-3.5 w-3.5" />
                    Ampliar Foto
                  </span>
                  <h3 className="text-sm font-bold tracking-tight text-white line-clamp-1 leading-snug">
                    {photo.alt}
                  </h3>
                  <p className="text-[10px] text-white/60 mt-0.5 line-clamp-1">
                    {photo.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox / Visualizador de Fotos Ampliadas */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 transition duration-200"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="h-6 w-6" />
          </button>
          
          <div 
            className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl scale-in"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking image
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedPhoto} 
              alt="Visualização ampliada" 
              className="max-w-full max-h-[85vh] object-contain" 
            />
          </div>
          
          <div className="mt-4 text-center text-white/55 text-xs font-medium">
            Clique fora da imagem ou no botão para fechar
          </div>
        </div>
      )}
    </div>
  );
}
