import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <SiteShell>
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-muted sm:px-6 lg:px-8">
          <h1 className="font-display mb-8 text-4xl font-medium tracking-tight text-fg">{title}</h1>
          <p className="mb-8 text-sm text-muted">Last Updated: {updated}</p>
          <div className="space-y-8 leading-relaxed">{children}</div>
        </div>
      </section>
    </SiteShell>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display mb-4 text-2xl font-medium text-fg">{title}</h2>
      {children}
    </section>
  );
}
