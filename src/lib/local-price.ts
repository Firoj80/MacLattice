import { createServerFn } from "@tanstack/react-start";
import { pricingCountry, USD_PRICE } from "@/lib/local-pricing";

export const getLocalPrice = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const { quoteLocalPrice } = await import("@/lib/quote-price");
    const request = getRequest();
    const url = new URL(request?.url ?? "https://www.scanmydisk.com/");
    const country = pricingCountry(url.searchParams.get("country"))
      ?? pricingCountry(request?.headers.get("x-vercel-ip-country"))
      ?? "US";
    const identity = request?.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
    return await quoteLocalPrice(country, identity);
  } catch {
    return USD_PRICE;
  }
});