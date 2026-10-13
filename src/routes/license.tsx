import { createFileRoute } from "@tanstack/react-router";
import { Download, KeyRound, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { JoinShell } from "@/components/signup/join-shell";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/license")({
  component: LicensePage,
  head: () =>
    pageHead({
      title: `Your licence and downloads | ${SITE.name}`,
      description: "Download the latest Windows installer or recover your lifetime license key securely.",
      path: "/license",
    }),
});

function LicensePage() {
  return (
    <JoinShell compact>
      <section className="glow-ambient mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400">
            <span>Customer Portal &amp; Downloads</span>
          </div>
          <h1 className="text-gradient font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your licence. Your download.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Get right back into {SITE.name} without paying again. Download the latest Windows setup or retrieve your license key instantly.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Download Card */}
          <div className="glass-card flex flex-col justify-between rounded-3xl p-7 transition-all duration-200">
            <div>
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                <Download className="size-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Download Windows App</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Official setup executable for Windows 10 &amp; 11 (64-bit). No installer bloatware or background services.
              </p>
              <div className="mt-5 space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-sky-400" />
                  <span>Version 0.1.5 · Native x64 build</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-sky-400" />
                  <span>100% offline scanning capable</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="/api/download"
                className="btn-primary group w-full !py-3.5 !text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <span>Download Windows Setup (.exe)</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <p className="mt-2.5 text-center text-[11px] text-muted">
                Tip: If Windows SmartScreen pops up, click <em>More info</em> then <em>Run anyway</em>.
              </p>
            </div>
          </div>

          {/* License Recovery Card */}
          <div className="glass-card flex flex-col justify-between rounded-3xl p-7 transition-all duration-200">
            <div>
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                <KeyRound className="size-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Recover Licence Key</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Retrieve your lifetime key through Dodo's secure customer portal using the email address you purchased with.
              </p>
              <ol className="mt-5 list-decimal space-y-2 pl-4 text-xs leading-relaxed text-white/70">
                <li>Open portal and enter your checkout email.</li>
                <li>Click the magic link sent to your inbox.</li>
                <li>Copy your key and paste it on app launch.</li>
              </ol>
            </div>

            <div className="mt-8">
              <a
                href="/api/customer-portal"
                className="btn-secondary group w-full !py-3.5 !text-sm"
              >
                <ShieldCheck className="size-4 text-sky-400" />
                <span>Open Secure Customer Portal</span>
              </a>
              <p className="mt-2.5 text-center text-[11px] text-muted">
                Active on one PC at a time. Easily deactivates to move machines.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="glass-card mt-8 rounded-2xl p-6 text-center sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="size-5 shrink-0 text-sky-400" />
              <p className="text-sm text-muted">
                Questions or lost access to your checkout email? We're here to help:
              </p>
            </div>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm font-medium text-sky-400 underline underline-offset-4 transition-colors hover:text-sky-300"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </section>
    </JoinShell>
  );
}

