/** Full-page GET that 302s to Dodo. Use <a href> so checkout opens immediately. */
export const BUY_HREF = "/buy";

export function buyHref(chip?: "silicon" | "intel") {
  if (!chip) return BUY_HREF;
  return `${BUY_HREF}?chip=${chip}`;
}

/** Official Dodo test cards — https://docs.dodopayments.com/miscellaneous/testing-process */
export const DODO_TEST = {
  card: "4242424242424242",
  expiry: "06/32",
  cvv: "123",
} as const;
