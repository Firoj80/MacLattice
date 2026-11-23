import { createContext, useContext, type ReactNode } from "react";
import { SITE } from "@/data/site";
import { USD_PRICE, type LocalPrice } from "@/lib/local-pricing";

const base = {
  lifetimePrice: SITE.lifetimePrice as string,
  regularPrice: SITE.regularPrice as string,
  localized: false,
  currency: "USD",
};

const PricingContext = createContext(base);

export function LocalPricingProvider({ children }: { children: ReactNode; initial?: LocalPrice }) {
  return <PricingContext.Provider value={base}>{children}</PricingContext.Provider>;
}

export function useLocalPricing() {
  return useContext(PricingContext);
}

export function PricingNote() {
  return (
    <p className="mt-3 text-center text-xs leading-relaxed text-muted">
      Prices in USD ($6.99). One-time payment. Taxes confirmed at checkout.
    </p>
  );
}
