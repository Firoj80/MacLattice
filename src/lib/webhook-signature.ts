import { createHmac, timingSafeEqual } from "node:crypto";
export function verifyDodoSignature(raw: string, request: Request) {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY?.trim(),
    id = request.headers.get("webhook-id") ?? "",
    ts = request.headers.get("webhook-timestamp") ?? "",
    sig = request.headers.get("webhook-signature") ?? "";
  if (!secret || !id || !/^\d+$/.test(ts) || Math.abs(Date.now() / 1000 - Number(ts)) > 300)
    return false;
  const expected = createHmac("sha256", Buffer.from(secret.replace(/^whsec_/, ""), "base64"))
    .update(`${id}.${ts}.${raw}`)
    .digest();
  return sig.split(" ").some((part) => {
    const [version, value] = part.split(",");
    if (version !== "v1" || !value) return false;
    const b = Buffer.from(value, "base64");
    return b.length === expected.length && timingSafeEqual(b, expected);
  });
}
