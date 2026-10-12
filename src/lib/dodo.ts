export { verifyDodoSignature } from "@/lib/webhook-signature";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { getSql } from "@/lib/db";
import { dodoRequest, providerConfig, type ProviderLicense } from "@/lib/dodo-client";
export async function createDodoCheckout() {
  const { product } = providerConfig(),
    id = randomUUID(),
    token = randomBytes(32).toString("base64url"),
    hash = createHash("sha256").update(token).digest("hex");
  const sql = await getSql();
  await sql`insert into checkout_orders(id,access_hash) values (${id},${hash})`;
  const session = await dodoRequest<{ checkout_url: string; session_id: string }>("/checkouts", {
    product_cart: [{ product_id: product, quantity: 1 }],
    return_url: `https://www.scanmydisk.com/thanks?order_id=${id}`,
    metadata: { order_id: id, platform: "windows" },
  });
  if (new URL(session.checkout_url).protocol !== "https:") throw new Error("Invalid checkout URL.");
  await sql`update checkout_orders set session_id=${session.session_id} where id=${id}`;
  return {
    url: session.checkout_url,
    cookie: `smd_checkout=${id}.${token}; HttpOnly; Secure; SameSite=Lax; Domain=scanmydisk.com; Path=/; Max-Age=86400`,
  };
}
type Payment = {
  payment_id: string;
  status: string;
  product_cart?: { product_id: string }[];
  metadata?: { order_id?: string };
};
export async function verifyPayment(id: string) {
  const { product, mode } = providerConfig(),
    p = await dodoRequest<Payment>(`/payments/${encodeURIComponent(id)}`);
  if (
    p.payment_id !== id ||
    p.status !== "succeeded" ||
    !p.product_cart?.some((item) => item.product_id === product)
  )
    throw new Error("Purchase product mismatch.");
  const sql = await getSql();
  await sql`insert into verified_payments(payment_id,product_id,status,provider_mode) values (${id},${product},'paid',${mode}) on conflict(payment_id) do nothing`;
  if (p.metadata?.order_id)
    await sql`update checkout_orders set payment_id=${id} where id=${p.metadata.order_id} and (payment_id is null or payment_id=${id})`;
}
export async function importProviderLicense(id: string) {
  const { product, mode } = providerConfig();
  // Isolated compatibility adapter: Dodo still supports this endpoint, but it is deprecated in favour of grants.
  const l = await dodoRequest<ProviderLicense>(`/license_keys/${encodeURIComponent(id)}`);
  if (l.id !== id || l.product_id !== product || l.source !== "auto" || !l.payment_id || !l.key)
    throw new Error("License product mismatch.");
  await verifyPayment(l.payment_id);
  const sql = await getSql();
  await sql`insert into licenses(license_key,payment_id,provider_id,product_id,provider_mode,status,activations_limit)
 select ${l.key},${l.payment_id},${l.id},${product},${mode},${l.status},${l.activations_limit ?? 1}
 from verified_payments where payment_id=${l.payment_id} and status='paid'
 on conflict(license_key) do update set status=case when licenses.status='refunded' then 'refunded' else excluded.status end`;
}
export async function handleDodoEvent(
  payload: { type?: string; data?: Record<string, unknown> },
  eventId: string,
) {
  const sql = await getSql();
  if ((await sql`select event_id from dodo_webhook_events where event_id=${eventId}`).length)
    return;
  const d = payload.data ?? {};
  if (payload.type === "payment.succeeded") {
    if (typeof d.payment_id !== "string") throw new Error("Missing payment ID.");
    await verifyPayment(d.payment_id);
  } else if (payload.type === "license_key.created") {
    if (typeof d.id !== "string") throw new Error("Missing license ID.");
    await importProviderLicense(d.id);
  } else if (payload.type === "refund.succeeded") {
    if (typeof d.payment_id !== "string") throw new Error("Missing refund payment ID.");
    const { mode } = providerConfig();
    await sql`insert into verified_payments(payment_id,status,provider_mode) values (${d.payment_id},'refunded',${mode}) on conflict(payment_id) do update set status='refunded'`;
    await sql`update licenses set status='refunded' where payment_id=${d.payment_id}`;
  }
  await sql`insert into dodo_webhook_events(event_id) values (${eventId}) on conflict do nothing`;
}
