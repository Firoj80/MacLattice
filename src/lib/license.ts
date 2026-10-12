import { getSql } from "@/lib/db";
import { certificate, signingKey, GRACE_DAYS } from "@/lib/license-certificate";
import { dodoRequest, providerConfig, type ProviderLicense } from "@/lib/dodo-client";
import { verifyPayment } from "@/lib/dodo";
export { GRACE_DAYS };
async function purchasedLicense(key: string) {
  const { product, mode } = providerConfig(),
    sql = await getSql();
  const rows = await sql<{
    provider_id: string;
  }>`select l.provider_id from licenses l join verified_payments p on p.payment_id=l.payment_id where l.license_key=${key} and l.status='active' and l.product_id=${product} and l.provider_mode=${mode} and p.status='paid'`;
  if (!rows[0]?.provider_id) return null;
  const p = await dodoRequest<ProviderLicense>(
    `/license_keys/${encodeURIComponent(rows[0].provider_id)}`,
  );
  if (
    p.key !== key ||
    p.product_id !== product ||
    p.status !== "active" ||
    (p.expires_at && Date.parse(p.expires_at) <= Date.now())
  )
    return null;
  if (!p.payment_id) return null;
  const payment = await verifyPayment(p.payment_id);
  const buyerName = payment.customer?.name?.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 100) || null;
  return { product, mode, buyerName };
}
export async function activateDevice(input: {
  licenseKey: string;
  instanceId: string;
  machineName?: string | null;
}) {
  signingKey();
  const key = input.licenseKey.trim(),
    device = input.instanceId.trim(),
    license = await purchasedLicense(key);
  if (!license)
    return {
      ok: false as const,
      error: "invalid_key",
      message: "Invalid license or purchase verification is still pending.",
    };
  const sql = await getSql(),
    rows = await sql<{
      provider_instance_id: string;
    }>`select provider_instance_id from license_devices where license_key=${key} and instance_id=${device} and deactivated_at is null`;
  let instance = rows[0]?.provider_instance_id;
  if (instance) {
    const r = await dodoRequest<{ valid: boolean }>("/licenses/validate", {
      license_key: key,
      license_key_instance_id: instance,
    });
    if (!r.valid)
      return {
        ok: false as const,
        error: "not_activated",
        message: "This activation is no longer valid.",
      };
  } else {
    const r = await dodoRequest<{ id: string; product: { product_id: string } }>(
      "/licenses/activate",
      { license_key: key, name: device },
    );
    if (!r.id || r.product?.product_id !== license.product)
      throw new Error("Activation product mismatch.");
    instance = r.id;
    await sql`insert into license_devices(license_key,instance_id,machine_name,provider_instance_id) values (${key},${device},${input.machineName?.slice(0, 100) ?? null},${instance}) on conflict(license_key,instance_id) do update set provider_instance_id=excluded.provider_instance_id,deactivated_at=null,last_seen_at=now()`;
  }
  return {
    ok: true as const,
    instanceId: device,
    graceDays: GRACE_DAYS,
    certificate: certificate(key, device, instance, license.product, license.mode, license.buyerName),
  };
}
export async function validateDevice(input: { licenseKey: string; instanceId?: string | null }) {
  if (!input.instanceId) return { valid: false as const, error: "missing_device" };
  const key = input.licenseKey.trim(),
    device = input.instanceId.trim(),
    license = await purchasedLicense(key);
  if (!license) return { valid: false as const, error: "invalid_key" };
  const sql = await getSql(),
    rows = await sql<{
      provider_instance_id: string;
    }>`select provider_instance_id from license_devices where license_key=${key} and instance_id=${device} and deactivated_at is null`;
  const instance = rows[0]?.provider_instance_id;
  if (!instance) return { valid: false as const, error: "not_activated" };
  const r = await dodoRequest<{ valid: boolean }>("/licenses/validate", {
    license_key: key,
    license_key_instance_id: instance,
  });
  if (!r.valid) return { valid: false as const, error: "invalid_key" };
  return {
    valid: true as const,
    graceDays: GRACE_DAYS,
    certificate: certificate(key, device, instance, license.product, license.mode, license.buyerName),
  };
}
export async function deactivateDevice(input: { licenseKey: string; instanceId: string }) {
  const sql = await getSql(),
    key = input.licenseKey.trim(),
    device = input.instanceId.trim();
  const rows = await sql<{
    provider_instance_id: string;
  }>`select provider_instance_id from license_devices where license_key=${key} and instance_id=${device} and deactivated_at is null`;
  if (rows[0]?.provider_instance_id)
    await dodoRequest("/licenses/deactivate", {
      license_key: key,
      license_key_instance_id: rows[0].provider_instance_id,
    });
  await sql`update license_devices set deactivated_at=now() where license_key=${key} and instance_id=${device}`;
  return { ok: true as const };
}
