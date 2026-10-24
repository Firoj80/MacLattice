import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { listPostViews } from "@/lib/post-views";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/post-views")({
  loader: () => listPostViews(),
  head: () =>
    pageHead({
      title: "Post views | ScanMyDisk",
      description: "Private view counts for ScanMyDisk guides.",
      path: "/post-views",
      index: false,
    }),
  component: PostViewsPage,
});

function PostViewsPage() {
  const rows = Route.useLoaderData();
  const total = rows.reduce((sum, row) => sum + row.views, 0);

  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-3xl font-medium tracking-tight text-fg">Post views</h1>
        <p className="mt-2 text-sm text-muted">
          {total.toLocaleString()} total. One browser counts once per guide per day. Bots are
          skipped.
        </p>
        <ol className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
          {rows.map((row) => (
            <li key={row.slug} className="flex items-baseline justify-between gap-4 px-4 py-3">
              <Link
                to="/blog/$slug"
                params={{ slug: row.slug }}
                className="text-sm text-fg hover:text-primary"
              >
                {row.title}
              </Link>
              <span className="shrink-0 text-sm font-medium text-muted tabular-nums">
                {row.views.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </SiteShell>
  );
}
