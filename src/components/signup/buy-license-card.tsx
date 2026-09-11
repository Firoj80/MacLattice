import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { SITE } from "@/data/site";

type Chip = "silicon" | "intel";

const FEATURES = [
  "Eight disk visualisations",
  "Duplicate files, photos & videos",
  "Saved scan comparison",
  "Cleanup presets (Safe, Developer, Cache)",
  "App uninstaller + leftovers",
  "Snapshots & live monitor",
];

export function BuyLicenseCard() {
  const [chip, setChip] = useState<Chip>("silicon");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chip, origin: window.location.origin }),
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
    <div
      id="buy"
      className="flex h-full min-h-full flex-col overflow-hidden rounded-[28px] border-2 border-primary bg-card shadow-[0_24px_60px_rgb(33_86_74/0.18)]"
    >
      <div className="bg-primary px-6 py-6 text-primary-fg md:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">Lifetime licence</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="font-display text-5xl leading-none font-medium tracking-tight sm:text-6xl">
            {SITE.lifetimePrice}
          </span>
          <span className="mb-1 text-sm font-medium opacity-80">once · forever</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h2 className="font-display text-2xl leading-tight font-medium tracking-tight text-fg">
          Everything in one licence
        </h2>
        <ul className="mt-5 flex-1 space-y-2.5">
          {FEATURES.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] text-fg">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3.5">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">After we ship</p>
          <p className="mt-1 text-[15px] leading-snug font-medium text-fg">
            We email the Mac app to you. Keep your licence key from checkout — that’s how you unlock it.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <fieldset>
            <legend className="mb-1.5 block text-xs font-medium tracking-wide text-muted">
              Your Mac
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["silicon", "Apple Silicon"],
                  ["intel", "Intel"],
                ] as const
              ).map(([id, label]) => (
                <label
                  key={id}
                  className={`flex h-11 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold ${
                    chip === id
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-border bg-bg text-fg"
                  }`}
                >
                  <input
                    type="radio"
                    name="chip"
                    value={id}
                    checked={chip === id}
                    onChange={() => setChip(id)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          {error ? (
            <p className="text-sm text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-fg transition-transform duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? "Redirecting…" : `Buy Lifetime Licence in ${SITE.lifetimePrice}`}
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-muted">15-day refund · one Mac at a time</p>
      </div>
    </div>
  );
}
