import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { softwareJsonLd } from "@/lib/seo";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <JsonLd data={softwareJsonLd()} />
      <SiteHeader />
      <main className="min-h-screen pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
