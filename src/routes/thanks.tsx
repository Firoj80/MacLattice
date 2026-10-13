import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  const [key, setKey] = useState(""),
    [download, setDownload] = useState<string | null>(null),
    [message, setMessage] = useState("Checking your purchase…"),
    [copied, setCopied] = useState(false);
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
      <section className="mx-auto max-w-xl px-5 py-20 sm:px-8">
        <p className="text-sm font-medium text-primary">Scan My Disk for Windows</p>
        <h1 className="font-display mt-3 text-4xl font-medium text-fg">
          {key ? "Your lifetime license is ready." : "Confirming your purchase"}
        </h1>
        <p role="status" className="mt-4 text-base text-muted">
          {message}
        </p>
        {!key && <button className="mt-5 inline-flex h-11 items-center rounded-xl bg-primary px-4 font-semibold text-primary-fg" onClick={() => { setMessage("Checking your purchase…"); setRetry(value => value + 1); }}>Check again</button>}
        {key && (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-muted">License key</p>
            <p className="mt-3 break-all text-2xl text-fg">{key}</p>
            <button
              className="mt-5 inline-flex h-11 items-center rounded-xl bg-primary px-4 font-semibold text-primary-fg"
              onClick={() => void navigator.clipboard.writeText(key).then(() => setCopied(true))}
            >
              {copied ? "Copied" : "Copy key"}
            </button>
            {download ? (
              <>
              <p className="mt-4 text-sm text-muted">Your download should start automatically. If it does not, use the button below.</p>
              <a
                href={download}
                download="ScanMyDisk-Setup-x64.exe"
                className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 font-semibold text-primary-fg"
              >
                Download Windows installer
              </a>
              </>
            ) : (
              <p className="mt-4 text-sm text-muted">
                The Windows installer download will appear here once the release is available.
              </p>
            )}
          </div>
        )}
        <p className="mt-8 text-sm text-muted">
          Keep your license email. One PC at a time; activation requires an internet connection.
          Need help? support@scanmydisk.com
        </p>
      </section>
    </JoinShell>
  );
}
