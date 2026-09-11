import { createFileRoute } from "@tanstack/react-router";
import { activateDevice } from "@/lib/license";

export const Route = createFileRoute("/api/license/activate")({
  server: {
    handlers: {
      OPTIONS: () => cors(),
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          license_key?: string;
          instance_id?: string;
          machine_name?: string;
        };
        if (!body.license_key || !body.instance_id) {
          return Response.json(
            { ok: false, error: "missing_fields" },
            { status: 400, headers: corsHeaders() },
          );
        }
        const result = await activateDevice({
          licenseKey: body.license_key,
          instanceId: body.instance_id,
          machineName: body.machine_name,
        });
        return Response.json(result, {
          status: result.ok ? 200 : result.error === "device_limit" ? 409 : 400,
          headers: corsHeaders(),
        });
      },
    },
  },
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
function cors() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
