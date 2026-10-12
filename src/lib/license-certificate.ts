import { createPrivateKey, sign, createHash } from "node:crypto";
export const GRACE_DAYS = 14;
export function signingKey() {
  const pem = process.env.LICENSE_SIGNING_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!pem) throw new Error("License signing is not configured.");
  const key = createPrivateKey(pem);
  if (key.asymmetricKeyType !== "rsa" || (key.asymmetricKeyDetails?.modulusLength ?? 0) < 2048)
    throw new Error("Invalid signing key.");
  return key;
}
export function certificate(
  key: string,
  device: string,
  instance: string,
  product: string,
  mode: string,
) {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      version: 1,
      issuer: "https://www.scanmydisk.com",
      audience: "ScanMyDisk.Windows",
      product_id: product,
      mode,
      license_hash: createHash("sha256").update(key).digest("hex"),
      device_id: device,
      instance_id: instance,
      issued_at: now,
      expires_at: now + GRACE_DAYS * 86400,
    }),
  ).toString("base64url");
  return {
    payload,
    signature: sign("RSA-SHA256", Buffer.from(payload), signingKey()).toString("base64url"),
  };
}
