import { createFileRoute } from "@tanstack/react-router";
import { findByPayment } from "@/lib/license";

export const Route = createFileRoute("/api/license/order")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const paymentId = new URL(request.url).searchParams.get("payment_id");
        if (!paymentId) return Response.json({ ok: false }, { status: 400 });
        const row = await findByPayment(paymentId);
        if (!row) return Response.json({ ok: false }, { status: 404 });
        return Response.json({
          ok: true,
          license_key: row.license_key,
          chip: row.chip,
        });
      },
    },
  },
});
