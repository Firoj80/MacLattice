import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SITE } from "@/data/site";
import { countryFromTimeZone, pricingCountry, type LocalPrice } from "@/lib/local-pricing";

const base = { lifetimePrice: SITE.lifetimePrice as string, regularPrice: SITE.regularPrice as string, localized: false, currency: "USD" };
function shown(price: LocalPrice) {
  return { lifetimePrice: price.early, regularPrice: price.regular, localized: price.localized, currency: price.currency };
}
const PricingContext = createContext(base);
export function LocalPricingProvider({ children, initial }: { children: ReactNode; initial?: LocalPrice }) {
  const [price, setPrice] = useState(initial ? shown(initial) : base);
  useEffect(() => {
    const controller = new AbortController();
    let country: string | undefined;
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      country = countryFromTimeZone(zone);
      if (!country) for (const language of navigator.languages) {
        country = pricingCountry(new Intl.Locale(language).region);
        if (country) break;
      }
    } catch { /* USD stays visible when region detection is unavailable. */ }
    fetch(`/api/pricing${country ? `?country=${country}` : ""}`, { signal: controller.signal })
      .then(async response => response.ok ? response.json() as Promise<LocalPrice> : undefined)
      .then(value => {
        if (value && /^[A-Z]{3}$/.test(value.currency) && typeof value.early === "string" && value.early.length < 40 && typeof value.regular === "string" && value.regular.length < 40) {
          setPrice(shown(value));
        }
      }).catch(() => { /* A failed quote must never block the page or checkout. */ });
    return () => controller.abort();
  }, []);
  return <PricingContext.Provider value={price}>{children}</PricingContext.Provider>;
}
export function useLocalPricing() { return useContext(PricingContext); }
export function PricingNote() {
  const price = useLocalPricing();
  return <p className="mt-3 text-center text-xs leading-relaxed text-muted">{price.localized ? `Estimated ${price.currency} pricing. ` : "Prices in USD. "}Final currency, fees and tax confirmed at checkout.</p>;
}
