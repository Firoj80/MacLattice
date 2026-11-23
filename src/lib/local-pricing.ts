// Standard USD pricing. Currency localization disabled per store policy.
export type LocalPrice = { currency: string; early: string; regular: string; localized: boolean };
export const USD_PRICE: LocalPrice = { currency: "USD", early: "$6.99", regular: "$14.99", localized: false };

export function currencyForCountry(_country?: string): string | undefined {
  return "USD";
}

export function pricingCountry(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return "US";
}

export function countryFromTimeZone(_zone?: string): string | undefined {
  return "US";
}

export function priceFromPreview(_preview: unknown, _product?: string): LocalPrice {
  return USD_PRICE;
}
