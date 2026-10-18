import { useEffect, useState } from "react";
import { SITE } from "@/data/site";
import { earlyBirdSales, type EarlyBirdSales } from "@/lib/early-bird";

export function EarlyBirdProgress() {
  const [sales, setSales] = useState<EarlyBirdSales | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let disposed = false;
    let active: AbortController | undefined;
    async function refresh() {
      if (document.visibilityState === "hidden" || active) return;
      active = new AbortController();
      const timeout = window.setTimeout(() => active?.abort(), 10_000);
      try {
        const response = await fetch("/api/early-bird", { cache: "no-store", signal: active.signal });
        if (!response.ok) throw new Error("Sales unavailable");
        const value = await response.json();
        if (value.limit !== SITE.earlyBirdLimit) throw new Error("Offer mismatch");
        const verified = earlyBirdSales(value.sold, value.limit);
        if (!disposed) { setSales(verified); setUnavailable(false); }
      } catch { if (!disposed) setUnavailable(true); }
      finally { clearTimeout(timeout); active = undefined; }
    }
    void refresh();
    const interval = window.setInterval(() => void refresh(), 30_000);
    const onReturn = () => void refresh();
    window.addEventListener("focus", onReturn);
    document.addEventListener("visibilitychange", onReturn);
    return () => { disposed = true; clearInterval(interval); active?.abort(); window.removeEventListener("focus", onReturn); document.removeEventListener("visibilitychange", onReturn); };
  }, []);

  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between gap-3 text-sm" aria-live="polite" aria-atomic="true">
        <span className="font-semibold tabular-nums text-fg">{sales ? `${sales.claimed}/${sales.limit} licenses sold` : unavailable ? "Sales count unavailable" : "Checking live sales…"}</span>
        {sales && <span className="text-muted">{sales.remaining === 0 ? "All claimed" : `${sales.remaining} remaining`}</span>}
      </div>
      {sales ? <div role="progressbar" aria-label="Early-bird licenses sold" aria-valuemin={0} aria-valuemax={sales.limit} aria-valuenow={sales.claimed} aria-valuetext={`${sales.claimed} of ${sales.limit} licenses sold`} className="h-2 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary" style={{ width: `${sales.percent}%` }} />
      </div> : <div aria-hidden="true" className="h-2 rounded-full bg-border" />}
      <p className="mt-2 text-xs leading-relaxed text-muted">{unavailable && sales ? "Last verified count. Reconnecting…" : "Updated automatically after successful purchases."}</p>
    </div>
  );
}
