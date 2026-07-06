import { prisma } from "./prisma";

export const IG_USERNAME = "js.varzeapaulista";
const ACTOR = "apify~instagram-profile-scraper";

export type IgPost = {
  shortCode: string;
  url: string;
  displayUrl: string;
  type: string;
  likesCount: number;
  commentsCount: number;
  caption: string;
  timestamp: string;
};

export type IgProfile = {
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  profilePicUrl: string;
  posts: IgPost[];
};

// Normaliza um item cru do actor Apify no formato que usamos
export function normalize(item: any): IgProfile {
  return {
    username: item.username,
    fullName: item.fullName ?? "",
    biography: item.biography ?? "",
    followersCount: item.followersCount ?? 0,
    followsCount: item.followsCount ?? 0,
    postsCount: item.postsCount ?? 0,
    profilePicUrl: item.profilePicUrl ?? "",
    posts: (item.latestPosts ?? []).slice(0, 12).map((p: any) => ({
      shortCode: p.shortCode,
      url: p.url,
      displayUrl: p.displayUrl,
      type: p.type,
      likesCount: p.likesCount ?? 0,
      commentsCount: p.commentsCount ?? 0,
      caption: p.caption ?? "",
      timestamp: p.timestamp ?? "",
    })),
  };
}

// Chama a Apify pra buscar dados frescos e salva no cache (precisa APIFY_TOKEN)
export async function refreshInstagram(username = IG_USERNAME) {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error("APIFY_TOKEN não configurado.");

  const res = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] }),
    }
  );
  if (!res.ok) throw new Error(`Apify retornou ${res.status}`);
  const items = await res.json();
  if (!Array.isArray(items) || !items[0]) throw new Error("Sem dados.");

  const profile = normalize(items[0]);
  await prisma.instagramCache.upsert({
    where: { id: username },
    update: { data: JSON.stringify(profile) },
    create: { id: username, data: JSON.stringify(profile) },
  });
  return profile;
}

// Lê o cache (sem chamar Apify)
export async function getCachedInstagram(username = IG_USERNAME) {
  const row = await prisma.instagramCache.findUnique({ where: { id: username } });
  if (!row) return null;
  return {
    profile: JSON.parse(row.data) as IgProfile,
    updatedAt: row.updatedAt,
  };
}
