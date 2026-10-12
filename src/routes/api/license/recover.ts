import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/license/recover")({
  server: {
    handlers: {
      POST: () =>
        Response.json(
          {
            error:
              "For your privacy, licenses cannot be looked up by email alone. Check your Dodo purchase email or contact support@scanmydisk.com.",
          },
          { status: 403, headers: { "Cache-Control": "no-store" } },
        ),
    },
  },
});
