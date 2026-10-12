export type ProviderLicense = {
  id: string;
  key: string;
  product_id: string;
  customer_id: string;
  payment_id?: string;
  source: string;
  status: string;
  expires_at?: string | null;
  activations_limit?: number | null;
};
export function providerConfig() {
  if (process.env.VERCEL === "1" && !process.env.DATABASE_URL?.trim())
    throw new Error("Database is not configured.");
  const apiKey = process.env.DODO_PAYMENTS_API_KEY?.trim(),
    product = process.env.DODO_PRODUCT_ID?.trim(),
    mode = process.env.DODO_PAYMENTS_ENV?.trim();
  if (!apiKey || !product || !["test_mode", "live_mode"].includes(mode ?? ""))
    throw new Error("Dodo is not configured.");
  return {
    apiKey,
    product,
    mode: mode!,
    host: mode === "live_mode" ? "https://live.dodopayments.com" : "https://test.dodopayments.com",
  };
}
export async function dodoRequest<T>(path: string, body?: unknown): Promise<T> {
  const c = providerConfig();
  const r = await fetch(c.host + path, {
    method: body === undefined ? "GET" : "POST",
    headers: { Authorization: `Bearer ${c.apiKey}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error(`Payment provider request failed (${r.status}).`);
  const text = await r.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
