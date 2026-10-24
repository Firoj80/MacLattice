// Display guidance only. Dodo remains authoritative for billing and tax.
// Country → currency matches Dodo Adaptive Currency. Unknown countries stay on USD.
const COUNTRY_CURRENCY: Record<string, string> = {
  AD: "EUR", AE: "AED", AL: "ALL", AM: "AMD", AT: "EUR", AU: "AUD", AW: "AWG", AZ: "AZN",
  BA: "BAM", BD: "BDT", BE: "EUR", BF: "XOF", BJ: "XOF", BM: "BMD", BN: "BND", BO: "BOB",
  BR: "BRL", BS: "BSD", BW: "BWP", BZ: "BZD", CA: "CAD", CF: "XAF", CG: "XAF", CH: "CHF",
  CI: "XOF", CL: "CLP", CM: "XAF", CN: "CNY", CR: "CRC", CY: "EUR", CZ: "CZK", DE: "EUR",
  DK: "DKK", DO: "DOP", EE: "EUR", EG: "EGP", ES: "EUR", ET: "ETB", FI: "EUR", FJ: "FJD",
  FR: "EUR", GA: "XAF", GB: "GBP", GE: "GEL", GL: "DKK", GM: "GMD", GQ: "XAF", GR: "EUR",
  GT: "GTQ", GW: "XOF", GY: "GYD", HK: "HKD", HN: "HNL", HR: "EUR", HU: "HUF", ID: "IDR",
  IE: "EUR", IL: "ILS", IN: "INR", IT: "EUR", JP: "JPY", KR: "KRW", KZ: "KZT", LI: "CHF",
  LK: "LKR", LR: "LRD", LS: "LSL", LT: "EUR", LU: "EUR", LV: "EUR", MA: "MAD", MC: "EUR",
  ME: "EUR", MK: "MKD", ML: "XOF", MO: "MOP", MT: "EUR", MU: "MUR", MV: "MVR", MW: "MWK",
  MX: "MXN", MY: "MYR", NE: "XOF", NG: "NGN", NL: "EUR", NO: "NOK", NP: "NPR", NR: "AUD",
  NZ: "NZD", PE: "PEN", PG: "PGK", PH: "PHP", PL: "PLN", PT: "EUR", PY: "PYG", QA: "QAR",
  RO: "RON", RS: "RSD", SA: "SAR", SB: "SBD", SC: "SCR", SE: "SEK", SG: "SGD", SI: "EUR",
  SK: "EUR", SM: "EUR", SN: "XOF", SZ: "SZL", TD: "XAF", TG: "XOF", TH: "THB", TO: "TOP",
  TR: "TRY", TW: "TWD", TZ: "TZS", UY: "UYU", VN: "VND", WS: "WST", ZA: "ZAR", ZM: "ZMW",
};

const TIMEZONES: Record<string, string> = {
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Dubai": "AE", "Asia/Singapore": "SG",
  "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Hong_Kong": "HK", "Asia/Shanghai": "CN",
  "Asia/Bangkok": "TH", "Asia/Jakarta": "ID", "Asia/Manila": "PH", "Asia/Kuala_Lumpur": "MY",
  "Asia/Dhaka": "BD", "Asia/Karachi": "PK", "Asia/Colombo": "LK", "Asia/Kathmandu": "NP",
  "Europe/London": "GB", "Europe/Paris": "FR", "Europe/Berlin": "DE", "Europe/Madrid": "ES",
  "Europe/Rome": "IT", "Europe/Amsterdam": "NL", "Europe/Warsaw": "PL", "Europe/Stockholm": "SE",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US",
  "America/Toronto": "CA", "America/Sao_Paulo": "BR", "America/Mexico_City": "MX",
  "Australia/Sydney": "AU", "Pacific/Auckland": "NZ",
};

export function currencyForCountry(country: string | undefined) {
  return country ? COUNTRY_CURRENCY[country] : undefined;
}

export function pricingCountry(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const country = value.toUpperCase();
  if (country === "US") return "US";
  return COUNTRY_CURRENCY[country] ? country : undefined;
}

export function countryFromTimeZone(zone: string | undefined) {
  return zone ? pricingCountry(TIMEZONES[zone]) : undefined;
}

export type LocalPrice = { currency: string; early: string; regular: string; localized: boolean };
export const USD_PRICE: LocalPrice = { currency: "USD", early: "$5", regular: "$9.99", localized: false };
export function priceFromPreview(preview: unknown, product: string): LocalPrice | undefined {
  const p = preview as { currency?: string; product_cart?: { product_id: string; quantity: number; og_currency?: string; og_price?: number; currency: string; discounted_price: number }[] } | null;
  if (!p || !/^[A-Z]{3}$/.test(p.currency ?? "") || !Array.isArray(p.product_cart)) return;
  const item = p.product_cart.find((entry) => entry.product_id === product && entry.quantity === 1);
  if (!item || item.currency !== p.currency || !Number.isSafeInteger(item.discounted_price) || item.discounted_price <= 0) return;
  // A dollar quote must still be the $5 catalogue price. A converted quote keeps
  // Dodo's local amount even when it rewrites og_currency away from USD.
  if (p.currency === "USD" && (item.og_currency !== "USD" || item.og_price !== 500)) return;
  try {
    const currency = p.currency!;
    const formatter = new Intl.NumberFormat("en", { style: "currency", currency, currencyDisplay: "narrowSymbol" });
    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    const amount = item.discounted_price / 10 ** digits;
    const regular = amount * 9.99 / 5;
    return { currency, early: formatter.format(amount), regular: formatter.format(regular), localized: currency !== "USD" };
  } catch { return; }
}
