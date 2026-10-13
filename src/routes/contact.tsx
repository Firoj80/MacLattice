import { createFileRoute } from "@tanstack/react-router";
import { Mail, Clock, MessageSquare, RotateCcw, ArrowRight } from "lucide-react";
import { JoinShell } from "@/components/signup/join-shell";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () =>
    pageHead({
      title: `Contact Us | ${SITE.name}`,
      description: `Get in touch with the ${SITE.name} team for technical support, licence help, or refund requests.`,
      path: "/contact",
    }),
});

function ContactPage() {
  return (
    <JoinShell compact>
      <section className="glow-ambient mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400">
            <MessageSquare className="size-3.5" />
            <span>Support &amp; Inquiries</span>
          </div>
          <h1 className="text-gradient font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How can we help?
          </h1>
          <p className="mt-4 text-base text-muted">
            Have questions about {SITE.name}, need licence assistance, or requesting a refund? Reach out directly.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Email Support Card */}
          <div className="glass-card flex flex-col justify-between rounded-3xl p-7 transition-all duration-200">
            <div>
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                <Mail className="size-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Direct Email Support</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                For installation help, bug reports, and general feedback. You will talk to a human on the engineering team.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-sky-400">
                <Clock className="size-3.5" />
                <span>Typical reply in under 24 hours</span>
              </div>
            </div>
            <div className="mt-8">
              <a
                href={`mailto:${SITE.email}`}
                className="btn-primary group w-full !py-3.5 !text-sm"
              >
                <span>Email {SITE.email}</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Refund & Guarantee Card */}
          <div className="glass-card flex flex-col justify-between rounded-3xl p-7 transition-all duration-200">
            <div>
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                <RotateCcw className="size-6" />
              </div>
              <h2 className="text-xl font-bold text-white">15-Day Money-Back Guarantee</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                If {SITE.name} doesn't save you gigabytes or isn't right for your setup, email us within 15 days with your order ID for an immediate refund.
              </p>
              <p className="mt-4 text-xs text-muted">
                No lengthy dispute process or awkward questions.
              </p>
            </div>
            <div className="mt-8">
              <a
                href={`mailto:${SITE.email}?subject=Refund%20Request`}
                className="btn-secondary group w-full !py-3.5 !text-sm"
              >
                <span>Request a Refund</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </JoinShell>
  );
}

