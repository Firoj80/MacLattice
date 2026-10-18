import type { Sql } from "./db";

export type EarlyBirdSales = { sold: number; limit: number; claimed: number; remaining: number; percent: number };
export function earlyBirdSales(sold: number, limit: number): EarlyBirdSales {
  if (!Number.isSafeInteger(sold) || sold < 0 || !Number.isSafeInteger(limit) || limit < 1) throw new Error("Invalid sales count.");
  const claimed = Math.min(sold, limit);
  return { sold, limit, claimed, remaining: Math.max(0, limit - sold), percent: claimed / limit * 100 };
}
export async function readEarlyBirdSales(sql: Sql, product: string, limit: number) {
  // A verified successful purchase counts even when a coupon made its total zero.
  // payment_id is unique, so webhook retries and later activation cannot add a sale twice.
  const rows = await sql<{ sold: string | number }>`select count(*)::text as sold from verified_payments
    where product_id=${product} and provider_mode='live_mode' and status='paid'`;
  return earlyBirdSales(Number(rows[0]?.sold), limit);
}
