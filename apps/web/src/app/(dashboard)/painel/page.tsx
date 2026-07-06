import { Images, Calendar, HardDrive, Users, ArrowRight } from "lucide-react";

const stats = [
  { label: "Arquivos na galeria", value: "2", icon: Images, hint: "fotos, vídeos e artes" },
  { label: "Posts agendados", value: "0", icon: Calendar, hint: "próximos 30 dias" },
  { label: "Armazenamento", value: "0 GB", icon: HardDrive, hint: "de 10 GB grátis" },
  { label: "Servos ativos", value: "1", icon: Users, hint: "no ministério" },
];

export default function PainelPage() {
  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8">
      <header className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-3">Painel de comunicação</p>
          <h1 className="text-3xl font-black tracking-tight text-white">
          Olá, Rafael 👋
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Um resumo rápido para organizar avisos, mídia e calendário do ministério.
          </p>
        </div>
        <a href="/avisos" className="btn-apple-primary shrink-0 px-5 py-2.5 text-sm">
          Criar aviso
          <ArrowRight className="h-4 w-4" />
        </a>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="glass glass-hover rounded-2xl p-5 text-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-white/50">
                  {s.label}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-300/15 text-brand-200 ring-1 ring-brand-300/25">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-5 text-4xl font-black tracking-tight">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-white/40">{s.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        <a
          href="/galeria"
          className="glass glass-hover group rounded-2xl p-7 text-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-300/15 text-brand-200 ring-1 ring-brand-300/25">
              <Images className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/60" />
          </div>
          <h3 className="mt-5 text-lg font-bold tracking-tight">
            Galeria de mídia
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Suba e organize fotos, vídeos e artes do ministério.
          </p>
        </a>

        <a
          href="/calendario"
          className="glass glass-hover group rounded-2xl p-7 text-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-300/15 text-brand-200 ring-1 ring-brand-300/25">
              <Calendar className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/60" />
          </div>
          <h3 className="mt-5 text-lg font-bold tracking-tight">
            Calendário de posts
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Planeje o que vai ao ar e quando publicar.
          </p>
        </a>
      </div>
    </div>
  );
}
