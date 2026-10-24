import { createFileRoute } from "@tanstack/react-router";
import { pricingCountry } from "@/lib/local-pricing";
import { quoteLocalPrice } from "@/lib/quote-price";

export const Route = createFileRoute("/api/pricing")({ server: { handlers: { GET: async ({ request }) => {
  // Browser region wins when it sends one, so a phone in India is not stuck on a
  // US edge country. Otherwise use the hosting provider's country header.
  const country = pricingCountry(new URL(request.url).searchParams.get("country"))
    ?? pricingCountry(request.headers.get("x-vercel-ip-country"))
    ?? "US";
  const price = await quoteLocalPrice(country, request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local");
  return Response.json(price, { headers: { "Cache-Control": "private, no-store" } });
} } } });
