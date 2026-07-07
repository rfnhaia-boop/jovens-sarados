import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Painel interno não deve ser indexado
      disallow: ["/painel", "/galeria", "/avisos", "/calendario", "/equipe", "/ministerios", "/aprendizado", "/biblioteca", "/estrutura", "/login", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
