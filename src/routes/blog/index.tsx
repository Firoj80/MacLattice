import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { JsonLd } from "@/components/json-ld";
import { allTags, posts } from "@/data/blog";
import { pageHead, absUrl } from "@/lib/seo";
import { listPostViews } from "@/lib/post-views";
import { formatDate } from "@/lib/utils";
import { defaultGuides, guideListLede, guideListTitle, sortGuides } from "@/lib/research/study";

const guides = defaultGuides();
const listTitle = guideListTitle(guides);
const listLede = guideListLede(guides);
const ranked = sortGuides(guides);

export const Route = createFileRoute("/blog/")({
  loader: () => listPostViews().catch(() => []),
  component: BlogIndex,
  head: () =>
    pageHead({
      title: listTitle,
      description: listLede,
      path: "/blog",
    }),
});

function BlogIndex() {
  const viewRows = Route.useLoaderData();
  const views = new Map(viewRows.map((row) => [row.slug, row.views]));
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked
      .map((guide) => posts.find((item) => item.slug === guide.slug))
      .filter((post): post is (typeof posts)[number] => Boolean(post))
      .filter((post) => {
        if (tag && !post.tags.includes(tag)) return false;
        if (!q) return true;
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((item) => item.toLowerCase().includes(q))
        );
      });
  }, [query, tag]);

  return (
    <SiteShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: listTitle,
          numberOfItems: ranked.length,
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          itemListElement: ranked.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: guide.title,
            url: absUrl(`/blog/${guide.slug}`),
          })),
        }}
      />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="font-display mb-6 text-4xl font-medium tracking-tight text-fg md:text-5xl">{listTitle}</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted">{listLede}</p>
          <p className="mt-4 text-sm">
            <a href="/research/guides" className="text-muted underline-offset-2 hover:text-fg hover:underline">
              How this count is calculated
            </a>
          </p>
        </header>

        <div className="flex flex-col gap-12 md:flex-row">
          <aside className="h-fit w-full space-y-8 md:sticky md:top-24 md:w-64">
            <div className="space-y-3">
              <label className="text-xs font-bold tracking-widest text-muted uppercase">
                Search
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find a guide..."
                  className="block w-full rounded-xl border border-border bg-card py-3 pr-3 pl-9 text-sm text-fg transition-all placeholder:text-muted/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-bold tracking-widest text-muted uppercase">
                Topics
              </label>
              <div className="flex flex-wrap gap-2 md:flex-col">
                <button
                  type="button"
                  onClick={() => setTag(null)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                    tag === null
                      ? "border-primary/30 bg-primary/10 font-medium text-primary"
                      : "border-transparent text-muted hover:bg-fg/5 hover:text-fg"
                  }`}
                >
                  All Guides
                </button>
                {allTags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t === tag ? null : t)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                      tag === t
                        ? "border-primary/30 bg-primary/10 font-medium text-primary"
                        : "border-transparent text-muted hover:bg-fg/5 hover:text-fg"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            {filtered.length === 0 ? (
              <p className="text-muted">No guides match that search.</p>
            ) : (
              filtered.map((post) => (
                <article
                  key={post.slug}
                  className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/25 md:p-8"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <time className="text-[12px] font-medium text-muted" dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                      <span className="text-[12px] font-medium text-muted tabular-nums">
                        {(views.get(post.slug) ?? 0).toLocaleString()} views
                      </span>
                      <div className="flex gap-2">
                        {post.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-primary/60 uppercase"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        className="transition-colors hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="leading-relaxed text-muted">{post.excerpt}</p>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Read Full Story
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-muted">
          <Link to="/post-views" className="hover:text-fg">
            See view counts
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
