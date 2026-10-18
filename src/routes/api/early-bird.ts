import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { providerConfig } from "@/lib/dodo-client";
import { readEarlyBirdSales, type EarlyBirdSales } from "@/lib/early-bird";
import { SITE } from "@/data/site";

let cached: { product: string; until: number; data: EarlyBirdSales } | undefined;
let pending: Promise<EarlyBirdSales> | undefined;
export const Route = createFileRoute("/api/early-bird")({ server: { handlers: { GET: async () => {
  try {
    const { product, mode } = providerConfig();
    if (mode !== "live_mode") throw new Error("Live sales are unavailable.");
    let data: EarlyBirdSales;
    if (cached?.product === product && cached.until > Date.now()) data = cached.data;
    else {
      pending ??= (async () => {
        const result = await readEarlyBirdSales(await getSql(), product, SITE.earlyBirdLimit);
        cached = { product, until: Date.now() + 10_000, data: result };
        return result;
      })().finally(() => { pending = undefined; });
      data = await pending;
    }
    // Only aggregate counts leave the server. No customer, payment or license identifiers.
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Sales count is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
} } } });
