import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/$")({
  loader: () => {
    throw notFound();
  },
  head: () => ({
    meta: [
      { title: "Page not found | Scan My Disk" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-muted">That page does not exist.</p>
        <Link to="/" className="mt-6 inline-block text-sm text-primary">
          Back home
        </Link>
      </div>
    </SiteShell>
  );
}
