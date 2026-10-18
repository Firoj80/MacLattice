// Display guidance only. Dodo remains authoritative for billing and tax.
export const PRICING_COUNTRIES = new Set("US IN GB CA AU NZ JP KR CN HK SG MY ID TH PH VN BD PK LK NP AE SA QA KW BH OM ZA NG KE EG BR MX AR CL CO PE CH NO SE DK PL CZ HU RO BG TR IL EU AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK".split(" "));
export function pricingCountry(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const country = value.toUpperCase();
  return PRICING_COUNTRIES.has(country) ? country : undefined;
}

export type LocalPrice = { currency: string; early: string; regular: string; localized: boolean };
export function priceFromPreview(preview: unknown, product: string): LocalPrice | undefined {
  const p = preview as { currency?: string; product_cart?: { product_id: string; quantity: number; og_currency: string; og_price: number; currency: string; discounted_price: number }[] } | null;
  if (!p || !/^[A-Z]{3}$/.test(p.currency ?? "") || !Array.isArray(p.product_cart) || p.product_cart.length !== 1) return;
  const item = p.product_cart[0];
  // Never advertise the $5 offer using a different product or an out-of-date base price.
  if (item.product_id !== product || item.quantity !== 1 || item.og_currency !== "USD" || item.og_price !== 500 || item.currency !== p.currency || !Number.isSafeInteger(item.discounted_price) || item.discounted_price <= 0) return;
  try {
    const currency = p.currency!;
    const formatter = new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: "narrowSymbol" });
    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    const amount = item.discounted_price / 10 ** digits;
    return { currency, early: formatter.format(amount), regular: formatter.format(amount * 9.99 / 5), localized: currency !== "USD" };
  } catch { return; }
}
