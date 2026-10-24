import { createServerFn } from "@tanstack/react-start";
import { posts } from "@/data/blog";

const knownSlugs = new Set(posts.map((post) => post.slug));

export type PostView = {
  slug: string;
  title: string;
  views: number;
};

function isBot(userAgent: string) {
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|lighthouse/i.test(
    userAgent,
  );
}

async function readCounts() {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql<{ slug: string; views: number }>`
    select slug, views from post_views
  `;
  const counts = new Map(rows.map((row) => [row.slug, Number(row.views) || 0]));
  return posts
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      views: counts.get(post.slug) ?? 0,
    }))
    .sort((a, b) => b.views - a.views || a.title.localeCompare(b.title));
}

export const listPostViews = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await readCounts();
  } catch (error) {
    console.error("listPostViews failed", error);
    return posts.map((post) => ({ slug: post.slug, title: post.title, views: 0 }));
  }
});

export const recordPostView = createServerFn({ method: "POST" })
  .inputValidator((slug: unknown) => {
    if (typeof slug !== "string" || !knownSlugs.has(slug)) {
      throw new Error("Unknown post");
    }
    return slug;
  })
  .handler(async ({ data: slug }) => {
    const empty = { slug, views: 0, counted: false };
    try {
      const { getRequest, getCookie, setCookie } = await import("@tanstack/react-start/server");
      const request = getRequest();
      const userAgent = request?.headers.get("user-agent") ?? "";
      if (!request || !userAgent || isBot(userAgent)) {
        const rows = await readCounts();
        return { slug, views: rows.find((row) => row.slug === slug)?.views ?? 0, counted: false };
      }

      const today = new Date().toISOString().slice(0, 10);
      const raw = getCookie("smd_pv") ?? "";
      const [stamp, list = ""] = raw.split("|");
      const seen = new Set((stamp === today ? list : "").split(",").filter(Boolean));
      if (seen.has(slug)) {
        const rows = await readCounts();
        return { slug, views: rows.find((row) => row.slug === slug)?.views ?? 0, counted: false };
      }

      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql<{ views: number }>`
        insert into post_views (slug, views)
        values (${slug}, 1)
        on conflict (slug) do update
          set views = post_views.views + 1,
              updated_at = now()
        returning views
      `;
      seen.add(slug);
      setCookie("smd_pv", `${today}|${[...seen].join(",")}`, {
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        httpOnly: true,
        secure: new URL(request.url).protocol === "https:",
      });
      return { slug, views: Number(rows[0]?.views) || 1, counted: true };
    } catch (error) {
      console.error("recordPostView failed", error);
      return empty;
    }
  });
