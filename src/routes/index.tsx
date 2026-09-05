import { createFileRoute } from "@tanstack/react-router";
import { FAQ } from "@/components/home/faq";
import { FeatureGrid } from "@/components/home/feature-grid";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Showcase } from "@/components/home/showcase";
import { TrustBar } from "@/components/home/trust-bar";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { faqJsonLd, HOME_DESCRIPTION, HOME_TITLE, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => pageHead({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }),
});

function Home() {
  return (
    <SiteShell>
      <JsonLd data={faqJsonLd()} />
      <Hero />
      <TrustBar />
      <FeatureGrid />
      <Showcase />
      <HowItWorks />
      <FAQ />
    </SiteShell>
  );
}
