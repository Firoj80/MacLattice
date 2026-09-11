import { randomBytes } from "node:crypto";
import { getSql } from "@/lib/db";

export const GRACE_DAYS = 14;
export const ACTIVATIONS_LIMIT = 1;

export type Chip = "silicon" | "intel";

export function generateLicenseKey() {
  const raw = randomBytes(8).toString("hex").toUpperCase();
  return `SMD-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
}

export async function issueLicense(input: {
  paymentId?: string | null;
  email?: string | null;
  name?: string | null;
  chip?: string | null;
  licenseKey?: string | null;
}) {
  const sql = await getSql();
  if (input.paymentId) {
    const existing = await sql<{ license_key: string }>`
      select license_key from licenses where payment_id = ${input.paymentId} limit 1
    `;
    if (existing[0]) return existing[0].license_key;
  }
  const key = input.licenseKey?.trim() || generateLicenseKey();
  await sql`
    insert into licenses (license_key, payment_id, customer_email, customer_name, chip, status, activations_limit)
    values (
      ${key},
      ${input.paymentId ?? null},
      ${input.email?.trim().toLowerCase() || null},
      ${input.name?.trim() || null},
      ${input.chip || null},
      'active',
      ${ACTIVATIONS_LIMIT}
    )
    on conflict (license_key) do nothing
  `;
  return key;
}

export async function findLicense(key: string) {
  const sql = await getSql();
  const rows = await sql<{
    license_key: string;
    status: string;
    activations_limit: number;
    customer_email: string | null;
    customer_name: string | null;
    chip: string | null;
    payment_id: string | null;
  }>`
    select license_key, status, activations_limit, customer_email, customer_name, chip, payment_id
    from licenses
    where upper(license_key) = ${key.trim().toUpperCase()}
    limit 1
  `;
  return rows[0] ?? null;
}

export async function findByPayment(paymentId: string) {
  const sql = await getSql();
  const rows = await sql<{ license_key: string; customer_email: string | null; chip: string | null }>`
    select license_key, customer_email, chip from licenses where payment_id = ${paymentId} limit 1
  `;
  return rows[0] ?? null;
}

export async function findByEmail(email: string) {
  const sql = await getSql();
  return sql<{ license_key: string; chip: string | null; created_at: string }>`
    select license_key, chip, created_at::text as created_at
    from licenses
    where lower(customer_email) = ${email.trim().toLowerCase()}
      and status = 'active'
    order by created_at desc
  `;
}

async function activeDevices(key: string) {
  const sql = await getSql();
  return sql<{ instance_id: string; machine_name: string | null; last_seen_at: string }>`
    select instance_id, machine_name, last_seen_at::text as last_seen_at
    from license_devices
    where license_key = ${key} and deactivated_at is null
  `;
}

export async function activateDevice(input: {
  licenseKey: string;
  instanceId: string;
  machineName?: string | null;
}) {
  const license = await findLicense(input.licenseKey);
  if (!license || license.status !== "active") {
    return { ok: false as const, error: "invalid_key", message: "This licence key is not valid." };
  }
  const key = license.license_key;
  const sql = await getSql();
  const instanceId = input.instanceId.trim();
  const existing = await sql<{ instance_id: string; deactivated_at: string | null }>`
    select instance_id, deactivated_at::text as deactivated_at
    from license_devices
    where license_key = ${key} and instance_id = ${instanceId}
    limit 1
  `;
  if (existing[0] && !existing[0].deactivated_at) {
    await sql`
      update license_devices
      set last_seen_at = now(), machine_name = coalesce(${input.machineName ?? null}, machine_name)
      where license_key = ${key} and instance_id = ${instanceId}
    `;
    return { ok: true as const, instanceId, graceDays: GRACE_DAYS };
  }

  const active = await activeDevices(key);
  const other = active.filter((d) => d.instance_id !== instanceId);
  if (other.length >= license.activations_limit) {
    return {
      ok: false as const,
      error: "device_limit",
      message:
        "This licence is already active on another Mac. Deactivate it there first (Settings → Deactivate this Mac).",
      devices: other.map((d) => d.machine_name || "Mac"),
    };
  }

  if (existing[0]) {
    await sql`
      update license_devices
      set deactivated_at = null, last_seen_at = now(), activated_at = now(),
          machine_name = coalesce(${input.machineName ?? null}, machine_name)
      where license_key = ${key} and instance_id = ${instanceId}
    `;
  } else {
    await sql`
      insert into license_devices (license_key, instance_id, machine_name)
      values (${key}, ${instanceId}, ${input.machineName ?? null})
    `;
  }
  return { ok: true as const, instanceId, graceDays: GRACE_DAYS };
}

export async function validateDevice(input: { licenseKey: string; instanceId?: string | null }) {
  const license = await findLicense(input.licenseKey);
  if (!license || license.status !== "active") {
    return { valid: false as const, error: "invalid_key" };
  }
  const key = license.license_key;
  if (!input.instanceId) {
    return { valid: true as const, graceDays: GRACE_DAYS, activationsLimit: license.activations_limit };
  }
  const sql = await getSql();
  const rows = await sql<{ instance_id: string; deactivated_at: string | null }>`
    select instance_id, deactivated_at::text as deactivated_at
    from license_devices
    where license_key = ${key} and instance_id = ${input.instanceId.trim()}
    limit 1
  `;
  const row = rows[0];
  if (!row || row.deactivated_at) {
    return { valid: false as const, error: "not_activated" };
  }
  await sql`
    update license_devices set last_seen_at = now()
    where license_key = ${key} and instance_id = ${input.instanceId.trim()}
  `;
  return { valid: true as const, graceDays: GRACE_DAYS, activationsLimit: license.activations_limit };
}

export async function deactivateDevice(input: { licenseKey: string; instanceId: string }) {
  const license = await findLicense(input.licenseKey);
  if (!license) return { ok: true as const };
  const key = license.license_key;
  const sql = await getSql();
  await sql`
    update license_devices
    set deactivated_at = now()
    where license_key = ${key}
      and instance_id = ${input.instanceId.trim()}
      and deactivated_at is null
  `;
  return { ok: true as const };
}

export async function refundLicense(paymentId: string) {
  const sql = await getSql();
  await sql`update licenses set status = 'refunded' where payment_id = ${paymentId}`;
}
