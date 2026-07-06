"use client";

import { useEffect, useRef, useState } from "react";

const LEFT = [
  "/images/js/media__1783228809172.jpg",
  "/images/js/media__1783228809208.jpg",
  "/images/js/media__1783229137456.jpg",
  "/images/js/media__1783229167164.jpg",
];

const RIGHT = [
  "/images/js/media__1783229137485.jpg",
  "/images/js/media__1783229191833.jpg",
  "/images/js/media__1783229167187.jpg",
  "/images/js/media__1783255007033.jpg",
];

const EUCARISTIA = "/images/js/eucaristia.jpg";

export function EucaristiaReveal() {
  const ref = useRef<HTMLElement>(null);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    let raf = 0;
    function update() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Pinned sticky scrolling animation progress (h-[250vh] section height)
        const scrollableRange = rect.height - vh;
        const p = scrollableRange > 0 ? Math.min(1, Math.max(0, -rect.top / scrollableRange)) : 0;
        setProg(p);
      });
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Smooth easing for transition
  const ease = prog * prog * (3 - 2 * prog);
  const shift = ease * 105; // Slides completely off-screen left and right
  const panelScale = 1 - ease * 0.05;
  const euScale = 0.8 + ease * 0.2;
  const euOpacity = ease;
  const textShown = Math.max(0, (ease - 0.5) / 0.5);

  return (
    <section ref={ref} className="relative h-[250vh] bg-[#0c0a09]">
      {/* Container Sticky que trava e preenche a tela inteira (h-screen w-full) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        
        {/* Eucaristia ao centro (Jesus vem para a frente) */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#070605] pointer-events-none"
          style={{ opacity: euOpacity }}
        >
          <div
            className="relative h-[65vh] w-[min(85vw,480px)] overflow-hidden rounded-[2.5rem] border border-amber-300/25 shadow-2xl"
            style={{ transform: `scale(${euScale})` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={EUCARISTIA}
              alt="Santíssimo Sacramento"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          </div>
          
          <div
            className="absolute bottom-10 px-6 text-center"
            style={{
              opacity: textShown,
              transform: `translateY(${(1 - textShown) * 12}px)`,
            }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              Ele é o centro
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Jesus Cristo no centro de tudo
            </h2>
          </div>
        </div>

        {/* Cortina Esquerda (Preenche a metade esquerda da tela e desliza) */}
        <div
          className="absolute left-0 top-0 z-20 grid h-full w-1/2 grid-cols-2 grid-rows-2 gap-3 p-3 will-change-transform bg-[#0c0a09] border-r border-white/5"
          style={{
            transform: `translateX(-${shift}%) scale(${panelScale})`,
          }}
        >
          {LEFT.map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 shadow-xl relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Cortina Direita (Preenche a metade direita da tela e desliza) */}
        <div
          className="absolute right-0 top-0 z-20 grid h-full w-1/2 grid-cols-2 grid-rows-2 gap-3 p-3 will-change-transform bg-[#0c0a09] border-l border-white/5"
          style={{
            transform: `translateX(${shift}%) scale(${panelScale})`,
          }}
        >
          {RIGHT.map((src) => (
            <div
              key={src}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 shadow-xl relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Indicador de scroll e dica de ação */}
        <div
          className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center text-white/80 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: 1 - Math.min(1, ease * 2.5) }}
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
            Nossos Encontros e Missões
          </span>
          <p className="text-[11px] font-semibold text-white/60 mt-1 uppercase tracking-wider">
            Role a página para revelar
          </p>
          <div className="mx-auto mt-2 h-7 w-4.5 rounded-full border border-white/20 flex items-start justify-center p-0.5">
            <div className="h-1.5 w-1 bg-amber-400 rounded-full animate-bounce mt-0.5" />
          </div>
        </div>

      </div>
    </section>
  );
}
