import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { JoinShell } from "@/components/signup/join-shell";
import { SITE } from "@/data/site";
import { DODO_TEST } from "@/lib/buy";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/pay")({
  component: TestPayPage,
  head: () =>
    pageHead({
      title: `Test checkout | ${SITE.name}`,
      description: `Dodo test-mode checkout for ${SITE.name}.`,
      path: "/pay",
    }),
});

function TestPayPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState<string>(DODO_TEST.card);
  const [expiry, setExpiry] = useState<string>(DODO_TEST.expiry);
  const [cvv, setCvv] = useState<string>(DODO_TEST.cvv);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const chip =
      new URLSearchParams(window.location.search).get("chip") === "intel"
        ? "intel"
        : "silicon";
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test: true,
          chip,
          name,
          email,
          origin: window.location.origin,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setBusy(false);
    }
  }

  return (
    <JoinShell compact>
      <section className="mx-auto max-w-md px-5 py-14 sm:px-8">
        <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
          Dodo test mode
        </p>
        <h1 className="font-display mt-4 text-3xl font-medium tracking-tight text-fg">
          Pay {SITE.lifetimePrice} for life
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          No live Dodo product is connected yet, so this uses Dodo’s official test
          cards. Nothing is charged. Live checkout starts when your product ID is set.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <label className="block text-sm font-medium text-fg">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-fg outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm font-medium text-fg">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-fg outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm font-medium text-fg">
            Card
            <input
              required
              inputMode="numeric"
              value={card}
              onChange={(e) => setCard(e.target.value.replace(/\s/g, ""))}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 tracking-wide text-fg outline-none focus:border-primary"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-fg">
              Expiry
              <input
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-fg outline-none focus:border-primary"
              />
            </label>
            <label className="block text-sm font-medium text-fg">
              CVV
              <input
                required
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-card px-3 text-fg outline-none focus:border-primary"
              />
            </label>
          </div>
          <p className="text-xs text-muted">
            Success card: {DODO_TEST.card} · {DODO_TEST.expiry} · {DODO_TEST.cvv}
          </p>
          {error ? (
            <p className="text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-fg disabled:opacity-60"
          >
            {busy ? "Paying…" : `Pay ${SITE.lifetimePrice} (test)`}
          </button>
        </form>
      </section>
    </JoinShell>
  );
}
