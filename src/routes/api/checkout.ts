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
          const s = await createDodoCheckout(request.headers.get("cookie"), country);
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
