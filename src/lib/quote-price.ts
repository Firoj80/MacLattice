import { USD_PRICE, type LocalPrice } from "@/lib/local-pricing";

export async function quoteLocalPrice(_country?: string, _identity?: string): Promise<LocalPrice> {
  return USD_PRICE;
}
