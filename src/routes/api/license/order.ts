import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";
import { getSql } from "@/lib/db";
export const Route = createFileRoute("/api/license/order")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const id = new URL(request.url).searchParams.get("order_id");
        const cookie = request.headers
          .get("cookie")
          ?.split(";")
          .map((x) => x.trim())
          .find((x) => x.startsWith("smd_checkout="))
          ?.slice(13);
        const [cookieId, token] = cookie?.split(".") ?? [];
        if (!id || id !== cookieId || !token)
          return Response.json(
            { ok: false },
            { status: 403, headers: { "Cache-Control": "no-store" } },
          );
        const sql = await getSql();
        const rows = await sql<{
          access_hash: string;
          license_key: string | null;
        }>`select o.access_hash,l.license_key from checkout_orders o
 left join licenses l on l.payment_id=o.payment_id and l.status='active'
 left join verified_payments p on p.payment_id=o.payment_id
 where o.id=${id} and o.created_at>now()-interval '24 hours' and (p.status='paid' or p.status is null)`;
        const expected = Buffer.from(rows[0]?.access_hash ?? "", "hex"),
          actual = createHash("sha256").update(token).digest();
        if (expected.length !== actual.length || !timingSafeEqual(expected, actual))
          return Response.json({ ok: false }, { status: 403 });
        let installer: string | null = null;
        const configured = process.env.LICENSE_INSTALLER_URL;
        if (configured) {
          const url = new URL(configured);
          if (url.protocol === "https:") installer = url.toString();
        }
        return Response.json(
          {
            ok: true,
            license_key: rows[0]?.license_key ?? null,
            installer_url: rows[0]?.license_key ? installer : null,
          },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
