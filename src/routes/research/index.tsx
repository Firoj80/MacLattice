import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { researchStudies } from "@/lib/research/study";
import { pageHead } from "@/lib/seo";

const studies = researchStudies();
const description = "Counts from ScanMyDisk's public guide catalog and product feature list. Not disk-scan telemetry.";

export const Route = createFileRoute("/research/")({
  component: ResearchIndex,
  head: () => pageHead({ title: "ScanMyDisk Research", description, path: "/research" }),
});

function ResearchIndex() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-medium tracking-tight text-fg">Research</h1>
        <p className="mt-5 text-lg text-muted">{description}</p>
        <ul className="mt-10 space-y-8">
          {studies.map((study) => (
            <li key={study.path}>
              <a href={study.path} className="text-xl text-fg underline-offset-2 hover:underline">
                {study.title}
              </a>
              <p className="mt-2 text-sm text-muted">{study.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
