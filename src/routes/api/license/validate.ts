import { createFileRoute } from "@tanstack/react-router";
import { validateDevice } from "@/lib/license";

export const Route = createFileRoute("/api/license/validate")({
  server: {
    handlers: {
      OPTIONS: () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          license_key?: string;
          instance_id?: string;
        };
        if (!body.license_key) {
          return Response.json({ valid: false, error: "missing_fields" }, { status: 400 });
        }
        const result = await validateDevice({
          licenseKey: body.license_key,
          instanceId: body.instance_id,
        });
        return Response.json(result, {
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      },
    },
  },
});
