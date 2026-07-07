"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Church, Users, Sparkles, Megaphone, Instagram, Calendar, Quote, Compass, Heart, Cross, BookOpen, Utensils, MapPin, Clock, Star, X, ZoomIn, Menu } from "lucide-react";
import { Tau } from "@/components/brand/tau";
import { EucaristiaReveal } from "@/components/landing/eucaristia-reveal";

type Ministry = { id: string; name: string };

const VERSICULOS = [
  { text: "Ninguém te despreze por seres jovem; mas sê um modelo para os fiéis, na palavra, na conduta, no amor, na fé, na pureza.", ref: "1 Timóteo 4:12" },
  { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
  { text: "Sede fortes e corajosos! Não temais, nem vos assusteis, porque o Senhor, vosso Deus, estará convosco por onde quer que andeis.", ref: "Josué 1:9" },
  { text: "Lembra-te do teu Criador nos dias da tua juventude, antes que venham os dias maus.", ref: "Eclesiastes 12:1" },
  { text: "Eu vim para que tenham vida e a tenham em abundância.", ref: "João 10:10" },
  { text: "Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias.", ref: "Isaías 40:31" },
  { text: "Acende em nós o fogo do teu Espírito. Somos jovens sarados pela graça, curados pelo amor.", ref: "Oração JS" },
  { text: "Santidade não é privilégio de poucos, mas vocação de todos.", ref: "São João Paulo II" },
];

const PEDRINHAS = [
  { icon: Cross, title: "Terço", desc: "Rezar o terço todos os dias." },
  { icon: Church, title: "Eucaristia", desc: "Viver a Santa Missa." },
  { icon: BookOpen, title: "Palavra", desc: "Meditar a Palavra de Deus." },
  { icon: Utensils, title: "Jejum", desc: "Oferecer o jejum semanal." },
  { icon: Heart, title: "Confissão", desc: "Buscar o sacramento sempre." },
];

const realPhotos = [
  { src: "/images/js/media__1783228809188.jpg", alt: "Comunidade JS Letras", caption: "Nossa Missão nos Sábados" }, // JS letters
  { src: "/images/js/eucaristia.jpg", alt: "Santíssimo Sacramento", caption: "Jesus Eucarístico: O Centro de Tudo" }, // Eucharist Center
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

const heroPhotos = [
  "/images/js/media__1783228809188.jpg", // Group JS letters
  "/images/js/media__1783228809175.jpg", // Oração e Fé (intimate prayer)
  "/images/js/media__1783229137456.jpg", // Apoio e Oração (fraternity)
  "/images/js/media__1783228809195.jpg", // Santa Missa (liturgy/altar)
  "/images/js/media__1783229167164.jpg", // Clamor ao Espírito (charismatic hands raised)
  "/images/js/media__1783255007033.jpg"  // Família Jovens Sarados (fellowship)
];

export default function LandingPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [currentHeroPhoto, setCurrentHeroPhoto] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroPhoto((prev) => (prev + 1) % heroPhotos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animação de entrada das seções no scroll
  useEffect(() => {
    const sections = document.querySelectorAll("section[id], section.reveal-target");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    sections.forEach((el) => {
      el.classList.add("reveal");
      // Se já está visível na tela (acima da dobra), mostra direto
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("reveal-visible");
      } else {
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/ministries")
      .then((r) => r.json())
      .then(setMinistries)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#05070f] relative min-h-screen text-white scroll-smooth">
      {/* Top Section with Gold/Amber background */}
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#05070f]">
        
        {/* Background Slideshow covering the ENTIRE section */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {heroPhotos.map((src, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt="Jovens Sarados"
              className="absolute inset-0 w-full h-[115%] object-cover transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: idx === currentHeroPhoto ? 0.35 : 0,
                transform: `translateY(${scrollY * 0.08}px)`,
              }}
            />
          ))}
          {/* Blue and black mesh gradient overlay over the full screen */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/70 to-[#05070f]/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.18),transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgba(245,158,11,0.10),transparent_40%)]" />
          {/* Subtle grid pattern texture */}
          <div className="absolute inset-0 grid-texture opacity-50 pointer-events-none" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 w-full px-4 py-4 sm:px-6 backdrop-blur-md bg-[#05070f]/15 border-b border-white/5 transition-all">
          <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3.5 shadow-lg border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-sm">
                <Tau className="h-5.5 w-5.5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-black tracking-tight">Jovens Sarados</p>
                <p className="text-[9px] font-medium uppercase tracking-wider text-white/50">
                  Paróquia Cristo Redentor · Várzea Paulista
                </p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
              <Link href="/#missao" className="hover:text-white transition">Nossa Missão</Link>
              <Link href="/#pedrinhas" className="hover:text-white transition">5 Pedrinhas</Link>
              <Link href="/#projetos" className="hover:text-white transition">Frentes de Missão</Link>
              <Link href="/#acolhimento" className="hover:text-white transition">Como Participar</Link>
              <Link href="/comunidade" className="hover:text-white transition flex items-center gap-1">
                <Megaphone className="h-3.5 w-3.5" />
                Mural de Avisos
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-apple bg-white/5 hover:bg-white/10 text-white border-white/10 px-5 py-2 hidden sm:inline-flex">
                Painel do Servo
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition"
                aria-label="Abrir menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Menu mobile */}
          {menuOpen && (
            <div className="md:hidden mx-auto max-w-6xl mt-2 glass rounded-2xl p-4 shadow-lg border-white/10 flex flex-col gap-1">
              {[
                { href: "/#missao", label: "Nossa Missão" },
                { href: "/#pedrinhas", label: "5 Pedrinhas" },
                { href: "/#projetos", label: "Frentes de Missão" },
                { href: "/#acolhimento", label: "Como Participar" },
                { href: "/comunidade", label: "Mural de Avisos" },
                { href: "/login", label: "Painel do Servo" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Hero Section Content */}
        <section className="mx-auto flex w-full max-w-5xl flex-1 items-center px-6 pb-20 pt-20 sm:pb-28 sm:pt-28 relative z-10">
          <div className="max-w-3xl text-left space-y-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 shadow-xl backdrop-blur-md">
              <Tau className="h-10 w-10 drop-shadow-[0_0_18px_rgba(59,130,246,0.45)]" />
            </div>
            
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-300 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Geração Salva Vidas
            </span>
            
            <h1 className="text-6xl font-black leading-[1.02] tracking-tight text-white sm:text-8xl">
              Jovens <span className="bg-gradient-to-r from-blue-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">Sarados</span>
            </h1>
            
            <p className="max-w-xl text-base md:text-lg font-medium leading-8 text-white/75">
              Aqui é o seu lugar: a comunidade de Jovens Sarados da Paróquia Cristo Redentor em Várzea Paulista. Em busca de santidade, amizade e propósito.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a href="#missao" className="btn-apple-primary px-8 py-3.5 text-sm">
                Conhecer a missão
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/comunidade" className="btn-apple px-8 py-3.5 text-sm bg-white/5 hover:bg-white/10 text-white border-white/10">
                <Megaphone className="h-4.5 w-4.5 text-blue-400" />
                Mural de avisos
              </Link>
            </div>

            <SaturdayCountdown />
          </div>
        </section>
      </div>

      {/* Seção Acolhimento (Perfis de Jovens) - Fundo Índigo/Roxo */}
      <section id="acolhimento" className="w-full py-20 scroll-mt-12 bg-gradient-to-b from-[#05070f] via-[#080a14] to-[#05070f]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Queremos te acolher</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-white">Há um lugar para você aqui</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Nunca Veio */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/40 p-8 text-white flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-500/30 hover:shadow-[0_20px_40px_rgba(245,158,11,0.08)]">
              {/* Background glowing orb */}
              <div className="absolute -right-16 -bottom-16 w-36 h-36 rounded-full bg-amber-500/[0.03] blur-3xl group-hover:bg-amber-500/[0.08] group-hover:scale-125 transition-all duration-700 pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-transform duration-500 group-hover:scale-110">
                  <Compass className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-amber-300">Nunca participou?</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light mt-2.5">
                    Queremos fazer parte da sua caminhada. Se você busca viver um louvor alegre, ter uma experiência real com Deus e fazer amigos verdadeiros: sinta-se em casa! Te esperamos no próximo sábado.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-amber-400/80 group-hover:text-amber-300 transition-colors pointer-events-none">
                Venha conhecer
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 2: Afastado */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/40 p-8 text-white flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-1.5 hover:border-orange-500/30 hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)]">
              {/* Background glowing orb */}
              <div className="absolute -right-16 -bottom-16 w-36 h-36 rounded-full bg-orange-500/[0.03] blur-3xl group-hover:bg-orange-500/[0.08] group-hover:scale-125 transition-all duration-700 pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-transform duration-500 group-hover:scale-110">
                  <Heart className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-orange-300">Está afastado?</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light mt-2.5">
                    Não importa o tempo ou a distância, a sua história com Deus continua viva. A chama não se apagou e a comunidade te espera para recomeçar. Seu lugar continua guardado aqui.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-orange-400/80 group-hover:text-orange-300 transition-colors pointer-events-none">
                Reacenda a chama
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>

            {/* Card 3: Já Participa */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/40 p-8 text-white flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:-translate-y-1.5 hover:border-purple-500/30 hover:shadow-[0_20px_40px_rgba(168,85,247,0.08)]">
              {/* Background glowing orb */}
              <div className="absolute -right-16 -bottom-16 w-36 h-36 rounded-full bg-purple-500/[0.03] blur-3xl group-hover:bg-purple-500/[0.08] group-hover:scale-125 transition-all duration-700 pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-transform duration-500 group-hover:scale-110">
                  <Sparkles className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-purple-300">Já caminha conosco?</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light mt-2.5">
                    Sua perseverança fortalece a nossa família. Continue firme nas missões diárias e ajude outros jovens a encontrarem esse mesmo abraço do Pai. A missão precisa do seu sim!
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-purple-400/80 group-hover:text-purple-300 transition-colors pointer-events-none">
                Fortaleça seu Sim
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Seção Missão Sábado (Timeline + Imagem) - Fundo Carvão/Âmbar */}
        <section id="missao" className="w-full py-24 scroll-mt-12 bg-gradient-to-b from-[#05070f] via-[#140f09] to-[#05070f]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Carrossel de fotos */}
            <MissionCarousel photos={realPhotos} />

            {/* Programação Sábado */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nossa rotina semanal</span>
                <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-white leading-tight">Toda semana, nossa missão aos Sábados</h2>
                <p className="text-sm text-white/60 mt-3 font-light leading-relaxed">
                  A nossa missão semanal se inicia sempre alimentada pela Eucaristia. É dela que extraímos as forças e a graça para levar o fogo do Espírito aos outros jovens.
                </p>
              </div>

              <div className="space-y-4">
                {/* Item 1 */}
                <div className="glass rounded-2xl p-5 flex items-start gap-4 hover:bg-white/10 transition">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25 shrink-0">
                    <Church className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">17h00 · Santa Missa (Paróquia Cristo Redentor)</h3>
                    <p className="text-xs text-white/60 mt-1 font-light leading-relaxed">
                      O início de tudo. Celebramos a Eucaristia juntos na Paróquia Cristo Redentor, entregando a semana que passou e nos abastecendo de Jesus Cristo no altar.
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="glass rounded-2xl p-5 flex items-start gap-4 hover:bg-white/10 transition">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/25 shrink-0">
                    <Tau className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">18h15 · Encontro JS / Missão</h3>
                    <p className="text-xs text-white/60 mt-1 font-light leading-relaxed">
                      O nosso encontro comunitário. Um momento de louvor inflamado, pregação kerigmática, adoração profunda ao Santíssimo Sacramento e partilhas sinceras de amizade.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <PedrinhasInterativas />

      {/* Seção Projetos/Frentes de Missão (Bento Grid) */}
      <section id="projetos" className="w-full py-24 bg-gradient-to-b from-[#05070f] via-[#090b14] to-[#05070f] scroll-mt-12 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/[0.03] blur-[150px] pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Nossa Atuação</span>
              <h2 className="text-3xl font-black text-white mt-1">Frentes de Missão</h2>
              <p className="text-xs text-white/50 mt-1 max-w-md">
                Conheça os projetos e atividades que transformam a realidade de milhares de jovens em Várzea Paulista.
              </p>
            </div>
            <Link 
              href="/comunidade" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider shrink-0"
            >
              Ver mural de avisos
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Grupos de Oração (col-span-2) */}
            <Link href="/ministerios" className="md:col-span-2 relative group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50 aspect-[16/9] md:aspect-auto md:h-[350px] cursor-pointer shadow-xl transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] block">
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/js/media__1783229167187.jpg"
                alt="Grupos de Oração"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/40 to-transparent pointer-events-none" />
              
              {/* Badge Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border border-white/20 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl text-lg md:text-2xl font-black tracking-widest text-white uppercase shadow-lg">
                  # YOUTH
                </div>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-xl font-bold text-white tracking-tight">Grupos de Oração</h3>
                <p className="text-xs text-white/60 font-light mt-1 max-w-md">
                  Encontros semanais de louvor, pregação e adoração para incendiar a fé da juventude.
                </p>
              </div>
            </Link>

            {/* Card 2: Missões Sociais (col-span-1) */}
            <Link href="/comunidade" className="relative group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50 aspect-[4/3] md:aspect-auto md:h-[350px] cursor-pointer shadow-xl transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] block">
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/js/media__1783228809208.jpg"
                alt="Missões Sociais"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/40 to-transparent pointer-events-none" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-xl font-bold text-white tracking-tight">Missões Sociais</h3>
                <p className="text-xs text-white/60 font-light mt-1">
                  Ações solidárias de apoio aos necessitados e evangelização ativa.
                </p>
              </div>
            </Link>

            {/* Card 3: Retiros (col-span-3 - Full Width) */}
            <Link href="/calendario" className="md:col-span-3 relative group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50 aspect-[21/9] cursor-pointer shadow-xl transition-all duration-500 hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] block">
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/js/media__1783229191833.jpg"
                alt="Retiros"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/40 to-transparent pointer-events-none" />

              {/* Title */}
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-xl font-bold text-white tracking-tight">Retiros</h3>
                <p className="text-xs text-white/60 font-light mt-1 max-w-xl">
                  Finais de semana dedicados ao silêncio, pregações profundas e forte experiência com o Espírito Santo.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <VersiculoCarousel />

      {/* Seção Padroeiros */}
      <section id="padroeiros" className="w-full py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070f] via-[#12080a] to-[#05070f]" />
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 w-[400px] h-[400px] rounded-full bg-orange-500/[0.03] blur-[100px]" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-4">
              Nossos Intercessores
            </span>
            <h2 className="text-4xl font-black tracking-tight text-white">
              Padroeiros dos Jovens Sarados
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm font-light leading-relaxed text-white/55">
              Caminhamos sob a proteção e intercessão de Nossa Senhora da Alegria e São João Paulo II — exemplos de fé, coragem e entrega total a Deus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nossa Senhora da Alegria */}
            <div className="group relative rounded-[2rem] border border-white/[0.08] bg-white/[0.02] overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-white/15 hover:shadow-2xl hover:shadow-amber-500/10">
              <div className="aspect-square relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/js/nsa-alegria.png"
                  alt="Nossa Senhora da Alegria"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Padroeira</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">Nossa Senhora da Alegria</h3>
                <p className="mt-2 text-sm text-white/60 font-light leading-relaxed">
                  Mãe da alegria verdadeira, nos ensina a encontrar a felicidade que vem de Deus. Alegrai-nos, Senhora!
                </p>
                <p className="mt-3 text-xs italic text-amber-300/70">&ldquo;Alegrai-vos no Senhor, sempre!&rdquo; — Filipenses 4:4</p>
              </div>
            </div>

            {/* São João Paulo II */}
            <div className="group relative rounded-[2rem] border border-white/[0.08] bg-white/[0.02] overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-white/15 hover:shadow-2xl hover:shadow-amber-500/10">
              <div className="aspect-square relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/js/sjp2.png"
                  alt="São João Paulo II"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-amber-300 fill-amber-300" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Patrono · 22 de Outubro</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">São João Paulo II</h3>
                <p className="mt-2 text-sm text-white/60 font-light leading-relaxed">
                  O Papa da juventude, que nos desafia a ser santos. Rogai pelos sarados!
                </p>
                <p className="mt-3 text-xs italic text-amber-300/70">&ldquo;Não tenham medo! Abram as portas a Cristo!&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EucaristiaReveal />

      {/* Rodapé e Seções Finais - Fundo escuro com gradiente */}
      <div className="w-full bg-gradient-to-b from-[#05070f] to-[#020307] pt-12">
        {/* Seção Instagram */}
        <section id="redes" className="mx-auto w-full max-w-5xl px-6 pb-16">
          <div className="glass rounded-[2rem] p-8 space-y-8 border-t-white/10 border-l-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 shadow-md">
                  <Instagram className="h-5.5 w-5.5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Conecte-se com nossa Missão</h3>
                  <p className="text-xs text-white/50">Acompanhe fotos, avisos e a vida diária no @js.varzeapaulista</p>
                </div>
              </div>
              <a
                href="https://www.instagram.com/js.varzeapaulista/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-apple-primary px-6 py-2.5 text-xs font-bold shrink-0"
              >
                Acessar Instagram
              </a>
            </div>

            {/* Mockup Instagram Grid com Fotos Reais */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {realPhotos.slice(0, 6).map((photo, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedPhoto(photo.src)}
                  className="aspect-square bg-white/5 rounded-xl border border-white/5 overflow-hidden relative group cursor-pointer shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <Instagram className="h-4 w-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ministérios */}
        {ministries.length > 0 && (
          <section className="mx-auto w-full max-w-5xl px-6 pb-16">
            <div className="mb-6 flex items-center justify-center gap-2 text-white/70">
              <Church className="h-5 w-5" />
              <h2 className="text-sm font-bold uppercase tracking-widest">
                Nossos Ministérios
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {ministries.map((m) => (
                <span
                  key={m.id}
                  className="glass rounded-full px-5 py-2.5 text-sm font-semibold text-white/90 shadow-sm border-t-white/10"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTA Final */}
        <section className="mx-auto w-full max-w-5xl px-6 py-16">
          <div className="glass-strong relative overflow-hidden rounded-[2.5rem] p-10 text-center shadow-2xl sm:p-14">
            <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
                <Tau className="h-10 w-10 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Seu lugar já está reservado
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base font-light leading-relaxed text-white/70">
                Não importa de onde você vem. Vem viver uma experiência real com
                Deus e encontrar uma família. Te esperamos no próximo sábado!
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-300" />
                  Várzea Paulista
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-300" />
                  Sábados, 17h
                </span>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://www.instagram.com/js.varzeapaulista/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-apple-primary px-8 py-3.5 text-sm"
                >
                  <Instagram className="h-4 w-4" />
                  Falar com a gente
                </a>
                <Link href="/comunidade" className="btn-apple px-8 py-3.5 text-sm">
                  <Megaphone className="h-4 w-4" />
                  Ver os avisos
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="border-t border-white/5 px-6 py-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Tau className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold">Jovens Sarados</p>
                <p className="text-[9px] font-medium uppercase tracking-wider text-white/50">
                  Paróquia Cristo Redentor · Várzea Paulista
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/50">
              <Star className="h-3.5 w-3.5 text-amber-300" />
              N. Sra. da Alegria
              <span className="text-white/20">·</span>
              <Star className="h-3.5 w-3.5 text-amber-300" />
              São João Paulo II
            </div>

            <a
              href="https://www.instagram.com/js.varzeapaulista/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-apple px-4 py-2 text-xs"
            >
              <Instagram className="h-3.5 w-3.5" />
              @js.varzeapaulista
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-white/40">
            Feito com fé pela equipe de comunicação. Geração Salva Vidas.
          </p>
        </footer>
      </div>

      {/* Botão flutuante Instagram */}
      <a
        href="https://www.instagram.com/js.varzeapaulista/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Seguir no Instagram"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-500 text-white shadow-2xl shadow-pink-500/30 transition-all duration-300 hover:scale-110 hover:shadow-pink-500/50"
      >
        <Instagram className="h-7 w-7" />
      </a>

      {/* Lightbox / Visualizador de Fotos Ampliadas */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 transition duration-200"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="h-6 w-6" />
          </button>
          
          <div 
            className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl scale-in"
            onClick={(e) => e.stopPropagation()}
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

function SaturdayCountdown() {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number } | null>(null);
  const [isNow, setIsNow] = useState(false);

  useEffect(() => {
    function update() {
      const now = new Date();
      // Próximo sábado às 17h
      const next = new Date(now);
      const day = now.getDay(); // 0=dom, 6=sáb
      let daysUntil = (6 - day + 7) % 7;
      if (daysUntil === 0) {
        // É sábado: se já passou das 20h, vai pro próximo
        if (now.getHours() >= 20) daysUntil = 7;
      }
      next.setDate(now.getDate() + daysUntil);
      next.setHours(17, 0, 0, 0);

      const diff = next.getTime() - now.getTime();
      if (diff <= 0) {
        setIsNow(true);
        setTimeLeft(null);
        return;
      }
      setIsNow(false);
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
      });
    }
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  if (isNow) {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-3 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-sm font-bold text-emerald-300">É agora! Encontro acontecendo hoje — vem!</span>
      </div>
    );
  }

  if (!timeLeft) return null;

  return (
    <div className="inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-amber-300">
        <Clock className="h-4 w-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">Próximo encontro</span>
      </div>
      <div className="flex items-center gap-3 text-white">
        {[
          { value: timeLeft.d, label: timeLeft.d === 1 ? "dia" : "dias" },
          { value: timeLeft.h, label: "h" },
          { value: timeLeft.m, label: "min" },
        ].map((item, i) => (
          <div key={i} className="flex items-baseline gap-1">
            <span className="text-xl font-black tabular-nums">{item.value}</span>
            <span className="text-[10px] font-bold text-white/50 uppercase">{item.label}</span>
          </div>
        ))}
        <span className="text-xs text-white/40 font-medium hidden sm:inline">· Sábado, 17h</span>
      </div>
    </div>
  );
}

function MissionCarousel({ photos }: { photos: typeof realPhotos }) {
  const slides = [photos[1], photos[4], photos[7], photos[9], photos[11], photos[13]];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="glass rounded-[2rem] overflow-hidden shadow-2xl relative order-last lg:order-first">
      <div className="aspect-video sm:aspect-square w-full relative">
        {slides.map((photo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={photo.src}
            alt={photo.alt}
            loading={i === 0 ? undefined : "lazy"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
      </div>
      <div className="p-6 absolute bottom-0 left-0 right-0 text-white">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Missão Semanal</span>
        <h4 className="text-lg font-extrabold transition-opacity duration-500">{slides[current].caption}</h4>
        <div className="flex gap-1.5 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-amber-400" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PedrinhaCard({ pedrinha, index }: { pedrinha: typeof PEDRINHAS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const colors = [
    { grad: "from-amber-500 to-orange-600", glow: "rgba(245,158,11,0.4)", shadow: "shadow-amber-500/30" },
    { grad: "from-orange-500 to-red-500", glow: "rgba(249,115,22,0.4)", shadow: "shadow-orange-500/30" },
    { grad: "from-emerald-500 to-teal-600", glow: "rgba(16,185,129,0.4)", shadow: "shadow-emerald-500/30" },
    { grad: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.4)", shadow: "shadow-violet-500/30" },
    { grad: "from-rose-500 to-pink-600", glow: "rgba(244,63,94,0.4)", shadow: "shadow-rose-500/30" },
  ];
  const c = colors[index];
  const Icon = pedrinha.icon;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -20, y: (x - 0.5) * 20 });
    setGlowPos({ x: x * 100, y: y * 100 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
      className="relative rounded-[1.75rem] border border-white/[0.08] bg-white/[0.03] p-7 text-center backdrop-blur-sm cursor-pointer select-none"
      style={{
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
      }}
    >
      {/* Glow que segue o mouse */}
      <div
        className="absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${c.glow}, transparent 60%)`,
        }}
      />
      {/* Borda brilhante no hover */}
      <div
        className="absolute inset-0 rounded-[1.75rem] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      />
      <div className="relative">
        <span className="inline-block mb-4 text-[11px] font-black text-white/20 tracking-widest">
          0{index + 1}
        </span>
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${c.grad} text-white ${c.shadow} shadow-lg transition-all duration-300`}
          style={{
            transform: isHovered ? "translateY(-4px) scale(1.1)" : "translateY(0) scale(1)",
            boxShadow: isHovered ? `0 12px 30px -8px ${c.glow}` : undefined,
          }}
        >
          <Icon className="h-8 w-8" style={{
            filter: isHovered ? "drop-shadow(0 0 8px rgba(255,255,255,0.5))" : "none",
            transition: "filter 0.3s",
          }} />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">{pedrinha.title}</h3>
        <p className="mt-2 text-xs font-light text-white/50 leading-relaxed">{pedrinha.desc}</p>
      </div>
    </div>
  );
}

function PedrinhasInterativas() {
  return (
    <section id="pedrinhas" className="w-full py-24 scroll-mt-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070f] via-[#15110a] to-[#05070f]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/[0.05] blur-[150px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-300 mb-4">
            O nosso caminho
          </span>
          <h2 className="text-4xl font-black tracking-tight text-white">
            As 5 Pedrinhas
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm font-light leading-relaxed text-white/55">
            As armas diárias do jovem sarado para vencer os gigantes — assim
            como Davi venceu Golias com 5 pedrinhas.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {PEDRINHAS.map((p, i) => (
            <PedrinhaCard key={p.title} pedrinha={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VersiculoCarousel() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % VERSICULOS.length);
        setFade(true);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const v = VERSICULOS[current];

  return (
    <section className="w-full py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070f] via-[#0c0914] to-[#05070f]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-500/[0.03] blur-[100px]" />
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] via-transparent to-orange-500/[0.02] pointer-events-none" />
          <div className="relative">
            <Quote className="h-10 w-10 text-amber-400/80 mx-auto mb-6" />
            <div
              className="transition-all duration-500 min-h-[120px] flex flex-col items-center justify-center"
              style={{ opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(8px)" }}
            >
              <p className="text-xl md:text-2xl font-light italic text-white/90 leading-relaxed max-w-2xl">
                &ldquo;{v.text}&rdquo;
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300 mt-5">
                — {v.ref}
              </p>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {VERSICULOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true); }, 300); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-5 bg-amber-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
