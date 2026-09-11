import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () =>
    pageHead({
      title: `Contact Us | ${SITE.name}`,
      description: `Get in touch with the ${SITE.name} team for support, questions, or feedback.`,
      path: "/contact",
    }),
});

function ContactPage() {
  return (
    <SiteShell>
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h1 className="font-display mb-4 text-4xl font-medium tracking-tight text-fg">Contact Us</h1>
            <p className="text-muted">Have questions? We're here to help.</p>
          </div>
          <div className="mx-auto max-w-md">
            <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-fg">Email Support</h3>
              <p className="mb-6 font-light text-muted">
                For general inquiries, refunds, and technical support.
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="font-medium text-primary hover:underline"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
