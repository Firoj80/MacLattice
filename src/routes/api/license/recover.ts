import { createFileRoute } from "@tanstack/react-router";
import { findByEmail } from "@/lib/license";

export const Route = createFileRoute("/api/license/recover")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as { email?: string };
        const email = body.email?.trim() ?? "";
        if (!email.includes("@")) {
          return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
        }
        const rows = await findByEmail(email);
        return Response.json({
          ok: true,
          licenses: rows.map((r) => ({
            license_key: r.license_key,
            chip: r.chip,
          })),
        });
      },
    },
  },
});
