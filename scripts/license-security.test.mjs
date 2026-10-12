import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, generateKeyPairSync, verify } from "node:crypto";
import { verifyDodoSignature } from "../src/lib/webhook-signature.ts";
import { certificate } from "../src/lib/license-certificate.ts";
test("signed webhook: correct body accepted, tampering, stale/future timestamps, missing secret and wrong signature rejected", () => {
  const old = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  const secret = Buffer.from("a".repeat(32));
  process.env.DODO_PAYMENTS_WEBHOOK_KEY = "whsec_" + secret.toString("base64");
  const raw = '{"type":"payment.succeeded"}',
    id = "evt-fixture";
  const request = (timestamp, signature) =>
    new Request("https://example.test", {
      headers: {
        "webhook-id": id,
        "webhook-timestamp": String(timestamp),
        "webhook-signature": signature,
      },
    });
  const now = Math.floor(Date.now() / 1000),
    sig = (t) => "v1," + createHmac("sha256", secret).update(`${id}.${t}.${raw}`).digest("base64");
  try {
    assert.equal(verifyDodoSignature(raw, request(now, sig(now))), true);
    assert.equal(verifyDodoSignature(raw + " ", request(now, sig(now))), false);
    assert.equal(verifyDodoSignature(raw, request(now - 600, sig(now - 600))), false);
    assert.equal(verifyDodoSignature(raw, request(now + 600, sig(now + 600))), false);
    assert.equal(verifyDodoSignature(raw, request(now, "v2,abc")), false);
    delete process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    assert.equal(verifyDodoSignature(raw, request(now, sig(now))), false);
  } finally {
    if (old === undefined) delete process.env.DODO_PAYMENTS_WEBHOOK_KEY;
    else process.env.DODO_PAYMENTS_WEBHOOK_KEY = old;
  }
});
test("certificate binds product, device, key hash, mode and expiry; forged payload fails verification", () => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const old = process.env.LICENSE_SIGNING_PRIVATE_KEY;
  process.env.LICENSE_SIGNING_PRIVATE_KEY = privateKey
    .export({ type: "pkcs8", format: "pem" })
    .toString();
  try {
    const c = certificate(
      "key-fixture",
      "device-fixture",
      "lki-fixture",
      "pdt-fixture",
      "test_mode",
    );
    const data = JSON.parse(Buffer.from(c.payload, "base64url").toString());
    assert.equal(data.device_id, "device-fixture");
    assert.equal(data.product_id, "pdt-fixture");
    assert.equal(data.mode, "test_mode");
    assert.equal(data.expires_at - data.issued_at, 14 * 86400);
    assert.equal(data.license_hash.length, 64);
    assert.equal(
      verify(
        "RSA-SHA256",
        Buffer.from(c.payload),
        publicKey,
        Buffer.from(c.signature, "base64url"),
      ),
      true,
    );
    assert.equal(
      verify(
        "RSA-SHA256",
        Buffer.from(c.payload + "x"),
        publicKey,
        Buffer.from(c.signature, "base64url"),
      ),
      false,
    );
  } finally {
    if (old === undefined) delete process.env.LICENSE_SIGNING_PRIVATE_KEY;
    else process.env.LICENSE_SIGNING_PRIVATE_KEY = old;
  }
});
