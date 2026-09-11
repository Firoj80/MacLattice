import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { JoinShell } from "@/components/signup/join-shell";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/license")({
  component: LicensePage,
  head: () =>
    pageHead({
      title: `Recover licence | ${SITE.name}`,
      description: `Look up your ${SITE.name} licence key with the email you used at checkout.`,
      path: "/license",
    }),
});

function LicensePage() {
  const [email, setEmail] = useState("");
  const [keys, setKeys] = useState<{ license_key: string; chip: string | null }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setKeys(null);
    try {
      const res = await fetch("/api/license/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as {
        licenses?: { license_key: string; chip: string | null }[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setKeys(data.licenses ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <JoinShell compact>
      <section className="mx-auto max-w-xl px-5 py-20 sm:px-8">
        <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">Licence</p>
        <h1 className="font-display mt-3 text-4xl font-medium tracking-tight text-fg">
          Lost your key?
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-muted">
          Enter the email you used on Dodo checkout. We show every active key
          tied to that address.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-card px-3 text-[15px] text-fg outline-none ring-primary/30 focus:ring-2"
            />
          </label>
          {error ? <p className="text-sm text-red-800">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-fg disabled:opacity-60"
          >
            {busy ? "Looking up…" : "Find my key"}
          </button>
        </form>
        {keys ? (
          <div className="mt-8 rounded-[28px] border border-border bg-card p-6">
            {keys.length === 0 ? (
              <p className="text-sm text-muted">No active licence on that email.</p>
            ) : (
              <ul className="space-y-3">
                {keys.map((row) => (
                  <li key={row.license_key} className="font-display text-xl tracking-wide text-fg">
                    {row.license_key}
                    {row.chip ? (
                      <span className="ml-2 text-sm font-sans text-muted">{row.chip}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        <div className="mt-16 border-t border-border pt-10 text-sm leading-relaxed text-muted">
          <h2 className="font-display text-2xl font-medium text-fg">How the licence works</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5">
            <li>You pay {SITE.lifetimePrice} on Dodo. Dodo sends us your name, email, and payment id.</li>
            <li>We issue a key like SMD-XXXX-XXXX-XXXX-XXXX. It also appears on the thank-you page.</li>
            <li>The Mac app stores a random install id in the Keychain. First launch: paste the key, we bind that id.</li>
            <li>One Mac at a time. Activate on a second Mac is refused until you deactivate the first.</li>
            <li>The app re-checks when online. If the Mac is offline, it keeps working for 14 days.</li>
          </ol>
        </div>
      </section>
    </JoinShell>
  );
}
