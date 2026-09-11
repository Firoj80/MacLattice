import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE } from "@/data/site";
import { issueLicense, refundLicense } from "@/lib/license";

const API_KEY = process.env.DODO_PAYMENTS_API_KEY?.trim();
const PRODUCT_ID = process.env.DODO_PRODUCT_ID?.trim();
const WEBHOOK_KEY = process.env.DODO_PAYMENTS_WEBHOOK_KEY?.trim();
const MODE = process.env.DODO_PAYMENTS_ENV?.trim() === "live_mode" ? "live" : "test";

export function dodoConfigured() {
  return Boolean(API_KEY && PRODUCT_ID);
}

export function dodoProductLink() {
  const id = PRODUCT_ID || process.env.VITE_DODO_PRODUCT_ID?.trim();
  if (!id) return null;
  return `https://checkout.dodopayments.com/buy/${id}`;
}

function dodoApiHost() {
  return MODE === "live" ? "https://live.dodopayments.com" : "https://test.dodopayments.com";
}

export async function createDodoCheckout(input: {
  returnUrl: string;
  chip: string;
}) {
  if (!API_KEY || !PRODUCT_ID) {
    const link = dodoProductLink();
    if (!link) return null;
    const url = new URL(link);
    url.searchParams.set("quantity", "1");
    url.searchParams.set("redirect_url", input.returnUrl);
    return { url: url.toString(), sessionId: null as string | null };
  }

  const res = await fetch(`${dodoApiHost()}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_cart: [{ product_id: PRODUCT_ID, quantity: 1 }],
      return_url: input.returnUrl,
      metadata: { chip: input.chip, product: SITE.name },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dodo checkout failed (${res.status}): ${text.slice(0, 240)}`);
  }
  const body = (await res.json()) as { checkout_url?: string; session_id?: string };
  if (!body.checkout_url) throw new Error("Dodo checkout did not return a URL.");
  return { url: body.checkout_url, sessionId: body.session_id ?? null };
}

export function verifyDodoSignature(raw: string, request: Request) {
  if (!WEBHOOK_KEY) return false;
  const id = request.headers.get("webhook-id") ?? "";
  const ts = request.headers.get("webhook-timestamp") ?? "";
  const sig = request.headers.get("webhook-signature") ?? "";
  if (!id || !ts || !sig) return false;
  const secret = WEBHOOK_KEY.startsWith("whsec_")
    ? Buffer.from(WEBHOOK_KEY.slice(6), "base64")
    : Buffer.from(WEBHOOK_KEY);
  const expected = createHmac("sha256", secret).update(`${id}.${ts}.${raw}`).digest("base64");
  return sig.split(" ").some((part) => {
    const value = part.includes(",") ? part.split(",")[1] : part;
    try {
      const a = Buffer.from(value);
      const b = Buffer.from(expected);
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
}

type DodoPayload = {
  type?: string;
  data?: {
    payment_id?: string;
    status?: string;
    metadata?: { chip?: string };
    customer?: { email?: string; name?: string; customer_id?: string };
    license_key?: string;
    license_keys?: string[];
  };
};

export async function handleDodoEvent(payload: DodoPayload) {
  const type = payload.type ?? "";
  const data = payload.data ?? {};
  const paymentId = data.payment_id ?? null;
  const email = data.customer?.email ?? null;
  const name = data.customer?.name ?? null;
  const chip = data.metadata?.chip ?? null;
  const givenKey = data.license_key || data.license_keys?.[0] || null;

  if (type === "payment.succeeded") {
    const key = await issueLicense({ paymentId, email, name, chip, licenseKey: givenKey });
    return { ok: true, key };
  }
  if (type === "refund.succeeded" && paymentId) {
    await refundLicense(paymentId);
    return { ok: true };
  }
  return { ok: true, ignored: type };
}
