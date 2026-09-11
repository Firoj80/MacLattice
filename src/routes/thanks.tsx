import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { JoinShell } from "@/components/signup/join-shell";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/thanks")({
  component: ThanksPage,
  head: () =>
    pageHead({
      title: `Thank you | ${SITE.name}`,
      description: `Your ${SITE.name} lifetime licence.`,
      path: "/thanks",
    }),
});

function ThanksPage() {
  const [key, setKey] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const fromUrl = q.get("license_key") ?? "";
    const paymentId = q.get("payment_id") ?? "";
    setEmail(q.get("email") ?? "");
    setPreview(q.get("status") === "preview");
    if (fromUrl) {
      setKey(fromUrl);
      return;
    }
    if (!paymentId) return;
    void fetch(`/api/license/order?payment_id=${encodeURIComponent(paymentId)}`)
      .then((r) => r.json())
      .then((data: { license_key?: string }) => {
        if (data.license_key) setKey(data.license_key);
      })
      .catch(() => undefined);
  }, []);

  async function copy() {
    if (!key) return;
    await navigator.clipboard.writeText(key);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <JoinShell compact>
      <section className="mx-auto max-w-xl px-5 py-20 sm:px-8">
        <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
          {preview ? "Preview licence" : "Payment received"}
        </p>
        <h1 className="font-display mt-3 text-4xl leading-tight font-medium tracking-tight text-fg">
          Your lifetime key is ready.
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">
          {email ? (
            <>
              Dodo has <span className="text-fg">{email}</span>. When the app
              ships we send the build there. Keep this key — paste it on first launch.
            </>
          ) : (
            <>
              Keep this key. When the Mac app ships we email the download to the
              address you used at Dodo checkout.
            </>
          )}
        </p>

        <div className="mt-8 rounded-[28px] border border-border bg-card p-6">
          <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Licence key</p>
          <p className="font-display mt-3 break-all text-2xl tracking-wide text-fg">
            {key || "Issuing… check this page again in a few seconds."}
          </p>
          {key ? (
            <button
              type="button"
              onClick={() => void copy()}
              className="mt-5 inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
            >
              {copied ? "Copied" : "Copy key"}
            </button>
          ) : null}
        </div>

        <ul className="mt-8 space-y-2 text-sm leading-relaxed text-muted">
          <li>One Mac at a time. Deactivate in Settings to move it.</li>
          <li>Offline grace is 14 days after the last successful check.</li>
          <li>
            Lost the key?{" "}
            <Link to="/license" className="text-primary underline-offset-4 hover:underline">
              Recover it here
            </Link>
            .
          </li>
        </ul>
      </section>
    </JoinShell>
  );
}
