import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Copy, Check, Download, Loader2, RefreshCw, ArrowRight, ShieldCheck } from "lucide-react";
import { JoinShell } from "@/components/signup/join-shell";
import { pageHead } from "@/lib/seo";
import { startInstallerDownload } from "@/lib/installer-download";

export const Route = createFileRoute("/thanks")({
  component: ThanksPage,
  head: () =>
    pageHead({
      title: "Your purchase | Scan My Disk",
      description: "Verify your purchase and receive your Windows license.",
      path: "/thanks",
    }),
});

function ThanksPage() {
  const [key, setKey] = useState("");
  const [download, setDownload] = useState<string | null>(null);
  const [message, setMessage] = useState("Checking your purchase…");
  const [copied, setCopied] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("order_id");
    if (!id) {
      setMessage(
        "Open this page from your checkout. Your license will also arrive in your Dodo purchase email.",
      );
      return;
    }
    let stopped = false,
      count = 0;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const r = await fetch(`/api/license/order?order_id=${encodeURIComponent(id)}`, {
          cache: "no-store",
        });
        if (!r.ok) {
          if (!stopped)
            setMessage(
              "This checkout session could not be verified. Check your purchase email or contact support.",
            );
          return;
        }
        const d = (await r.json()) as { license_key?: string; installer_url?: string };
        if (stopped) return;
        if (d.license_key) {
          setKey(d.license_key);
          setDownload(d.installer_url ?? null);
          setMessage("Your payment and license have been verified.");
          if (d.installer_url) startInstallerDownload(id, d.license_key, d.installer_url);
          return;
        }
        setMessage("Waiting for payment confirmation and your license. This can take a moment.");
      } catch {
        if (!stopped) setMessage("Verification is temporarily unavailable. Retrying…");
      }
      if (!stopped && ++count < 30) timer = setTimeout(() => void poll(), 3000);
      else if (!stopped)
        setMessage(
          "Your license is still processing. Check your Dodo email or reload this page shortly.",
        );
    };
    void poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [retry]);

  return (
    <JoinShell compact>
      <section className="glow-ambient mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400">
            <ShieldCheck className="size-3.5" />
            <span>Order Confirmed · Scan My Disk</span>
          </div>
          <h1 className="text-gradient font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {key ? "Your lifetime license is ready!" : "Confirming your purchase"}
          </h1>
          <p role="status" className="mx-auto mt-4 max-w-lg text-base text-muted">
            {message}
          </p>

          {!key && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-sm text-sky-400">
                <Loader2 className="size-4 animate-spin" />
                <span>Polling payment gateway…</span>
              </div>
              <button
                className="btn-secondary mt-2 inline-flex items-center gap-2"
                onClick={() => {
                  setMessage("Checking your purchase…");
                  setRetry((value) => value + 1);
                }}
              >
                <RefreshCw className="size-3.5" />
                <span>Check again</span>
              </button>
            </div>
          )}
        </div>

        {key && (
          <div className="glow-card glass-card mt-10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-semibold tracking-wider text-sky-400 uppercase">
                Your License Key
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                Lifetime Active
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <code className="flex-1 rounded-xl border border-white/10 bg-black/60 p-3.5 font-mono text-base font-semibold text-white break-all select-all sm:text-lg">
                {key}
              </code>
              <button
                type="button"
                className={`btn-primary shrink-0 gap-2 transition-all duration-200 ${
                  copied ? "!bg-emerald-500 !text-white" : ""
                }`}
                onClick={() => {
                  void navigator.clipboard.writeText(key).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  });
                }}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span>{copied ? "Copied!" : "Copy Key"}</span>
              </button>
            </div>

            {/* Installer Download Section */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white">Next Step: Download the Windows App</h3>
              <p className="mt-1 text-xs text-muted">
                Your download should trigger automatically. If it didn't, click the button below:
              </p>
              {download ? (
                <a
                  href={download}
                  download="ScanMyDisk-Setup-x64.exe"
                  className="btn-primary group mt-4 w-full !py-3.5 !text-sm shadow-[0_0_24px_rgba(255,255,255,0.2)]"
                >
                  <Download className="size-4" />
                  <span>Download ScanMyDisk-Setup-x64.exe</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              ) : (
                <a
                  href="/api/download"
                  className="btn-primary group mt-4 w-full !py-3.5 !text-sm shadow-[0_0_24px_rgba(255,255,255,0.2)]"
                >
                  <Download className="size-4" />
                  <span>Download Windows App</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              )}
            </div>

            {/* Quickstart steps */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h4 className="text-xs font-semibold tracking-wider text-white uppercase">
                Quick Setup (30 Seconds)
              </h4>
              <ol className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-sky-400">1.</span>
                  <span>Run <code>ScanMyDisk-Setup-x64.exe</code> to install.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-sky-400">2.</span>
                  <span>Paste your license key above into the license box on first launch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-sky-400">3.</span>
                  <span>Select any drive or directory and reclaim gigabytes!</span>
                </li>
              </ol>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted">
          A receipt with your licence key was also sent to your email. Need help?{" "}
          <a href="mailto:support@scanmydisk.com" className="text-sky-400 underline underline-offset-4 hover:text-sky-300">
            support@scanmydisk.com
          </a>
        </p>
      </section>
    </JoinShell>
  );
}
