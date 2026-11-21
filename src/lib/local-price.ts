import { createServerFn } from "@tanstack/react-start";
import { USD_PRICE } from "@/lib/local-pricing";

export const getLocalPrice = createServerFn({ method: "GET" }).handler(async () => {
  return USD_PRICE;
});
