import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jovens Sarados",
  description: "Painel dos Servos — Ministério de Comunicação",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
