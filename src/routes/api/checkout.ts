import { createFileRoute } from "@tanstack/react-router";
import { rateLimit } from "@/lib/license-rate-limit";
import { createDodoCheckout } from "@/lib/dodo";
import { pricingCountry } from "@/lib/local-pricing";
import { logCheckoutFailure } from "@/lib/checkout-diagnostics";
export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (
            !(await rateLimit(
              "checkout",
              request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local",
              20,
            ))
          )
            return Response.json({ error: "too_many_requests" }, { status: 429 });
          const country = pricingCountry(request.headers.get("x-vercel-ip-country"));
          let bodyAttribution: { ml_visitor_id?: string; ml_session_id?: string } | undefined;
          try {
            const body = (await request.clone().json()) as Record<string, unknown>;
            if (body && typeof body === "object") {
              bodyAttribution = {
                ml_visitor_id:
                  typeof body.ml_visitor_id === "string" ? body.ml_visitor_id : undefined,
                ml_session_id:
                  typeof body.ml_session_id === "string" ? body.ml_session_id : undefined,
              };
            }
          } catch {
            // body is not JSON or empty
          }
          const s = await createDodoCheckout(request.headers.get("cookie"), country, bodyAttribution);
          return Response.json(
            { url: s.url, provider: "dodo" },
            { headers: { "Set-Cookie": s.cookie, "Cache-Control": "no-store" } },
          );
        } catch (error) {
          logCheckoutFailure(error);
          return Response.json(
            { error: "Checkout is temporarily unavailable. Please try again later." },
            { status: 503 },
          );
        }
      },
    },
  },
});
