export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-bg relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      <div className="orb left-[-6rem] top-[-4rem] h-80 w-80 bg-amber-500/30" />
      <div className="orb bottom-[-8rem] right-[-4rem] h-96 w-96 bg-indigo-500/20" />
      <div className="orb right-[10%] top-[60%] h-72 w-72 bg-rose-500/15" />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
