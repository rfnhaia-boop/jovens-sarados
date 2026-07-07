import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jovens Sarados · Várzea Paulista",
    template: "%s · Jovens Sarados",
  },
  description:
    "Comunidade de jovens católicos da Paróquia Cristo Redentor em Várzea Paulista. Encontros todos os sábados: Santa Missa às 17h e Encontro JS às 18h15. Vem viver santidade, amizade e propósito!",
  keywords: [
    "jovens sarados",
    "grupo de jovens",
    "Várzea Paulista",
    "juventude católica",
    "Paróquia Cristo Redentor",
    "grupo de oração",
    "pastoral da juventude",
  ],
  icons: {
    icon: "/images/js/logo-tau.png",
    apple: "/images/js/logo-tau.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Jovens Sarados",
    title: "Jovens Sarados · Geração Salva Vidas",
    description:
      "Comunidade de jovens católicos em Várzea Paulista. Te esperamos no próximo sábado — Missa às 17h e Encontro JS às 18h15!",
    images: [
      {
        url: "/images/js/media__1783228809188.jpg",
        width: 1200,
        height: 630,
        alt: "Comunidade Jovens Sarados reunida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jovens Sarados · Geração Salva Vidas",
    description:
      "Comunidade de jovens católicos em Várzea Paulista. Te esperamos no próximo sábado!",
    images: ["/images/js/media__1783228809188.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
