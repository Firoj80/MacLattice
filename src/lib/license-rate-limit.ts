import { createHash } from "node:crypto";
import { getSql } from "@/lib/db";
export async function rateLimit(scope: string, identity: string, limit: number) {
  const bucket = createHash("sha256")
      .update(scope + ":" + identity)
      .digest("hex"),
    sql = await getSql();
  const rows = await sql<{
    attempts: number;
  }>`insert into licensing_rate_limits(bucket) values (${bucket}) on conflict(bucket) do update set attempts=case when licensing_rate_limits.window_start<now()-interval '10 minutes' then 1 else licensing_rate_limits.attempts+1 end,window_start=case when licensing_rate_limits.window_start<now()-interval '10 minutes' then now() else licensing_rate_limits.window_start end returning attempts`;
  return rows[0].attempts <= limit;
}
