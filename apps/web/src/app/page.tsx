"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Church, Users, Sparkles, Megaphone, Instagram, Calendar, Quote, Compass, Heart, Cross, BookOpen, Utensils, MapPin, Clock, Star, X, ZoomIn } from "lucide-react";
import { Tau } from "@/components/brand/tau";
import { EucaristiaReveal } from "@/components/landing/eucaristia-reveal";

type Ministry = { id: string; name: string };

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

export default function LandingPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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
    <div className="bg-[#0c0a09] relative min-h-screen text-white scroll-smooth">
      {/* Top Section with Gold/Amber background */}
      <div className="app-bg relative min-h-screen flex flex-col justify-between">
        {/* Orbs de fundo */}
        <div className="orb left-[-4rem] top-[-4rem] h-[32rem] w-[32rem] bg-amber-500/25" />
        <div className="orb bottom-[-8rem] right-[10%] h-[35rem] w-[35rem] bg-indigo-500/20" />
        <div className="orb right-[-4rem] top-[25%] h-96 w-96 bg-rose-500/15" />
        {/* Header */}
        <header className="px-4 py-4 sm:px-6">
          <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3.5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-sm">
                <Tau className="h-5.5 w-5.5" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-black tracking-tight">Jovens Sarados</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                  Várzea Paulista
                </p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
              <a href="#missao" className="hover:text-white transition">Nossa Missão</a>
              <a href="#pedrinhas" className="hover:text-white transition">5 Pedrinhas</a>
              <a href="#galeria" className="hover:text-white transition">Galeria</a>
              <a href="#acolhimento" className="hover:text-white transition">Como Participar</a>
              <Link href="/comunidade" className="hover:text-white transition flex items-center gap-1">
                <Megaphone className="h-3.5 w-3.5" />
                Mural de Avisos
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-apple px-4 py-2 text-xs font-semibold">
                Painel do Servo
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mx-auto flex w-full max-w-6xl flex-1 items-end px-4 pb-8 pt-8 sm:px-6 lg:pb-12">
          <div className="relative min-h-[560px] w-full overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-black/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={realPhotos[0].src}
              alt="Jovens Sarados reunidos em missão"
              className="absolute inset-0 w-full h-[120%] object-cover transition-transform duration-100 ease-out"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#11100e]/95 via-[#11100e]/74 to-[#11100e]/28" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#11100e]/90 to-transparent" />

            <div className="relative flex min-h-[560px] max-w-3xl flex-col justify-end px-6 py-10 text-left sm:px-10 lg:px-14">
              <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-200/25 bg-brand-500/10 shadow-xl">
                <Tau className="h-10 w-10 drop-shadow-[0_0_18px_rgba(249,115,22,0.45)]" />
              </div>
              <span className="eyebrow">Geração Salva Vidas</span>
              <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-7xl">
                Jovens Sarados
              </h1>
            
              <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/75 sm:text-lg">
                Aqui é o seu lugar: uma comunidade de jovens católicos em busca
                de santidade, amizade e propósito em Várzea Paulista.
              </p>
            
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#missao" className="btn-apple-primary px-8 py-3.5 text-sm">
                  Conhecer a missão
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/comunidade" className="btn-apple px-8 py-3.5 text-sm">
                  <Megaphone className="h-4.5 w-4.5 text-brand-200" />
                  Mural de avisos
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Seção Acolhimento (Perfis de Jovens) - Fundo Índigo/Roxo */}
      <section id="acolhimento" className="w-full py-20 scroll-mt-12 bg-gradient-to-b from-[#0c0a09] via-[#0d081b] to-[#0c0a09]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Queremos te acolher</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-white">Não importa a sua história</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Nunca Veio */}
            <div className="glass rounded-[2rem] p-6 text-white flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 shadow-md">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 mb-4">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white mb-2">Nunca participou?</h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  Se você está curioso e busca viver um louvor alegre, ter uma experiência real com Deus e fazer novos amigos: sinta-se em casa! Te esperamos no próximo sábado de braços abertos.
                </p>
              </div>
            </div>

            {/* Card 2: Afastado */}
            <div className="glass rounded-[2rem] p-6 text-white flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 shadow-md border-amber-500/20">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-4">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white mb-2">Está afastado?</h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  A rotina cansou ou você acabou se distanciando por algum motivo? Saiba que a chama não se apagou e os braços da comunidade continuam abertos para você. Seu lugar continua intacto aqui.
                </p>
              </div>
            </div>

            {/* Card 3: Já Participa */}
            <div className="glass rounded-[2rem] p-6 text-white flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 shadow-md">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 mb-4">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white mb-2">Já caminha conosco?</h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">
                  Continue firme na caminhada, seja perseverante nas missões diárias e traga mais um coração para ser inflamado pelo Espírito Santo. A colheita é grande e a missão precisa do seu sim!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Seção Missão Sábado (Timeline + Imagem) - Fundo Carvão/Âmbar */}
        <section id="missao" className="w-full py-24 scroll-mt-12 bg-gradient-to-b from-[#0c0a09] via-[#1a110a] to-[#0c0a09]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Foto com moldura 3D */}
            <div className="glass rounded-[2rem] overflow-hidden shadow-2xl relative group order-last lg:order-first">
              <div className="aspect-video sm:aspect-square w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={realPhotos[1].src}
                  alt="Missão Jovens Sarados"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>
              <div className="p-6 absolute bottom-0 left-0 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Missão Semanal</span>
                <h4 className="text-lg font-extrabold">{realPhotos[1].caption}</h4>
              </div>
            </div>

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
                    <h3 className="text-base font-bold text-white">17h00 · Santa Missa (Paróquia)</h3>
                    <p className="text-xs text-white/60 mt-1 font-light leading-relaxed">
                      O início de tudo. Celebramos a Eucaristia juntos na Paróquia de Várzea Paulista, entregando a semana que passou e nos abastecendo de Jesus Cristo no altar.
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

      {/* Seção As 5 Pedrinhas - Fundo Bronze/Ouro escuro */}
      <section id="pedrinhas" className="w-full py-20 scroll-mt-12 bg-gradient-to-b from-[#0c0a09] via-[#1b140d] to-[#0c0a09]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
              O nosso caminho
            </span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white">
              As 5 Pedrinhas
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm font-light leading-relaxed text-white/60">
              As armas diárias do jovem sarado para vencer os gigantes — assim
              como Davi venceu Golias com 5 pedrinhas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {PEDRINHAS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="glass glass-hover flex flex-col items-center rounded-[1.5rem] p-5 text-center"
                >
                  <span className="mb-3 text-xs font-bold text-amber-300/70">
                    0{i + 1}
                  </span>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <p className="mt-1 text-xs font-light text-white/50">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção Versículo Bíblico - Fundo sólido escuro */}
      <section className="w-full py-16 bg-[#0c0a09]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="glass rounded-[2rem] p-8 text-center relative overflow-hidden shadow-xl border-t-white/15 border-l-white/15">
            {/* Glow sutil */}
            <div className="absolute inset-0 bg-amber-500/[0.02] pointer-events-none" />
            <Quote className="h-8 w-8 text-amber-400 mx-auto mb-4" />
            <p className="text-lg md:text-xl font-light italic text-white/90 leading-relaxed max-w-2xl mx-auto">
              "Ninguém te despreze por seres jovem; mas sê um modelo para os fiéis, na palavra, na conduta, no amor, na fé, na pureza."
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300 mt-4">- 1 Timóteo 4:12</p>
          </div>
        </div>
      </section>

      <EucaristiaReveal />

      {/* Rodapé e Seções Finais - Fundo escuro com gradiente */}
      <div className="w-full bg-gradient-to-b from-[#0c0a09] to-[#070605] pt-12">
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
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                  Várzea Paulista
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
