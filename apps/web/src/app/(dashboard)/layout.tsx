import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-bg relative flex h-screen w-full gap-3 overflow-hidden p-3">
      <div className="orb left-[-4rem] top-[-4rem] h-96 w-96 bg-amber-500/30" />
      <div className="orb bottom-[-6rem] right-[20%] h-[30rem] w-[30rem] bg-indigo-500/25" />
      <div className="orb right-[-4rem] top-[15%] h-80 w-80 bg-rose-500/20" />

      <Sidebar className="m-0 h-full" />
      
      <main className="relative z-10 h-full flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-[#171310]/80 shadow-2xl shadow-black/25">
        {children}
      </main>

      <Toaster />
    </div>
  );
}


