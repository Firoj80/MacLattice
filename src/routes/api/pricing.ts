import { createFileRoute } from "@tanstack/react-router";
import { dodoRequest, providerConfig } from "@/lib/dodo-client";
import { priceFromPreview, pricingCountry, currencyForCountry, type LocalPrice } from "@/lib/local-pricing";
import { rateLimit } from "@/lib/license-rate-limit";

const fallback: LocalPrice = { currency: "USD", early: "$5", regular: "$9.99", localized: false };
const cache = new Map<string, { until: number; price: LocalPrice }>();
const pending = new Map<string, Promise<LocalPrice>>();
async function quote(country: string, identity: string) {
  const hit = cache.get(country);
  if (hit && hit.until > Date.now()) return hit.price;
  const active = pending.get(country);
  if (active) return active;
  const task = (async () => {
    try {
      const { product } = providerConfig();
      if (!await rateLimit("pricing", identity, 20)) return fallback;
      const currency = currencyForCountry(country);
      const preview = await dodoRequest<unknown>("/checkouts/preview", {
        product_cart: [{ product_id: product, quantity: 1 }],
        billing_address: { country },
        ...(currency ? { billing_currency: currency } : {}),
      });
      const price = priceFromPreview(preview, product) ?? fallback;
      cache.set(country, { until: Date.now() + 600_000, price });
      return price;
    } catch {
      cache.set(country, { until: Date.now() + 30_000, price: fallback });
      return fallback;
    }
  })();
  pending.set(country, task);
  try { return await task; } finally { pending.delete(country); }
}
export const Route = createFileRoute("/api/pricing")({ server: { handlers: { GET: async ({ request }) => {
  // Vercel supplies the country in production; browser region is a local/dev fallback.
  const country = pricingCountry(request.headers.get("x-vercel-ip-country"))
    ?? pricingCountry(new URL(request.url).searchParams.get("country")) ?? "US";
  const price = await quote(country, request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local");
  return Response.json(price, { headers: { "Cache-Control": "private, no-store" } });
} } } });
