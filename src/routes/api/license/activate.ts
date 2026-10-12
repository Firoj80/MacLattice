import { createFileRoute } from "@tanstack/react-router";
import { licenseHandler } from "@/lib/license-handler";
export const Route = createFileRoute("/api/license/activate")({
  server: { handlers: { POST: licenseHandler("activate") } },
});
