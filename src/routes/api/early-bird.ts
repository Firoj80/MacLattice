import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { providerConfig } from "@/lib/dodo-client";
import { readEarlyBirdSales, type EarlyBirdSales } from "@/lib/early-bird";
import { alertTelegram } from "@/lib/notify";
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
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[early-bird] 503 —", errorMsg);
    alertTelegram({
      level: "🟠 WARNING",
      title: "Early-Bird Badge 503 Unavailable",
      rateKey: "early-bird-503",
      details: {
        error: errorMsg.slice(0, 150),
        database: Boolean(process.env.DATABASE_URL?.trim()) ? "Configured" : "MISSING",
        dodoApiKey: Boolean(process.env.DODO_PAYMENTS_API_KEY?.trim()) ? "Configured" : "MISSING",
        dodoProduct: Boolean(process.env.DODO_PRODUCT_ID?.trim()) ? "Configured" : "MISSING",
        dodoMode: process.env.DODO_PAYMENTS_ENV ?? "MISSING",
      },
    });
    return Response.json({ error: "Sales count is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
} } } });
