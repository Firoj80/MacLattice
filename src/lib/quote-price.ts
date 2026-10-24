import { dodoRequest, providerConfig } from "@/lib/dodo-client";
import { currencyForCountry, priceFromPreview, USD_PRICE, type LocalPrice } from "@/lib/local-pricing";
import { rateLimit } from "@/lib/license-rate-limit";

const cache = new Map<string, { until: number; price: LocalPrice }>();
const pending = new Map<string, Promise<LocalPrice>>();

export async function quoteLocalPrice(country: string, identity: string) {
  const hit = cache.get(country);
  if (hit && hit.until > Date.now()) return hit.price;
  const active = pending.get(country);
  if (active) return active;
  const task = (async () => {
    try {
      const { product } = providerConfig();
      if (!await rateLimit("pricing", identity, 20)) return USD_PRICE;
      const currency = currencyForCountry(country);
      const preview = await dodoRequest<unknown>("/checkouts/preview", {
        product_cart: [{ product_id: product, quantity: 1 }],
        billing_address: { country },
        ...(currency ? { billing_currency: currency } : {}),
      });
      const price = priceFromPreview(preview, product) ?? USD_PRICE;
      const converted = price.localized || country === "US";
      cache.set(country, { until: Date.now() + (converted ? 600_000 : 30_000), price });
      return price;
    } catch {
      cache.set(country, { until: Date.now() + 30_000, price: USD_PRICE });
      return USD_PRICE;
    }
  })();
  pending.set(country, task);
  try { return await task; } finally { pending.delete(country); }
}
