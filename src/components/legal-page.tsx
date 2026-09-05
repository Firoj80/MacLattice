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
      <section className="min-h-screen bg-black py-24">
        <div className="mx-auto max-w-4xl px-4 text-gray-300 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-4xl font-bold text-white">{title}</h1>
          <p className="mb-8 text-sm text-gray-500">Last Updated: {updated}</p>
          <div className="space-y-8">{children}</div>
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
      <h2 className="mb-4 text-2xl font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}
