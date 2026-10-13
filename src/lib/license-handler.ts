import { activateDevice, validateDevice, deactivateDevice } from "@/lib/license";
import { rateLimit } from "@/lib/license-rate-limit";
import { logCheckoutFailure } from "@/lib/checkout-diagnostics";
export function licenseHandler(action: "activate" | "validate" | "deactivate") {
  return async ({ request }: { request: Request }) => {
    const headers = { "Cache-Control": "no-store" };
    try {
      const text = await request.text();
      if (text.length > 4096)
        return Response.json({ error: "too_large" }, { status: 413, headers });
      let b: Record<string, unknown>;
      try {
        b = JSON.parse(text);
      } catch {
        return Response.json({ error: "invalid_json" }, { status: 400, headers });
      }
      if (
        !b ||
        typeof b.license_key !== "string" ||
        b.license_key.length < 8 ||
        b.license_key.length > 256 ||
        typeof b.instance_id !== "string" ||
        !/^[a-f0-9]{64}$/.test(b.instance_id)
      )
        return Response.json({ error: "missing_fields" }, { status: 400, headers });
      if (!(await rateLimit(action, b.license_key, 30)))
        return Response.json(
          { error: "too_many_requests" },
          { status: 429, headers: { ...headers, "Retry-After": "600" } },
        );
      const input = {
        licenseKey: b.license_key,
        instanceId: b.instance_id,
        machineName: typeof b.machine_name === "string" ? b.machine_name : undefined,
      };
      const result =
        action === "activate"
          ? await activateDevice(input)
          : action === "validate"
            ? await validateDevice(input)
            : await deactivateDevice(input);
      return Response.json(result, { headers });
    } catch (error) {
      logCheckoutFailure(error);
      return Response.json({ error: "licensing_unavailable" }, { status: 503, headers });
    }
  };
}
