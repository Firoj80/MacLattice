/** Log configuration presence and error category, never credentials or buyer data. */
export function logCheckoutFailure(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  console.error("[checkout] unavailable", {
    databaseConfigured: Boolean(process.env.DATABASE_URL?.trim()),
    apiKeyConfigured: Boolean(process.env.DODO_PAYMENTS_API_KEY?.trim()),
    productConfigured: Boolean(process.env.DODO_PRODUCT_ID?.trim()),
    modeValid: ["test_mode", "live_mode"].includes(process.env.DODO_PAYMENTS_ENV?.trim() ?? ""),
    databaseCode: typeof code === "string" && /^[0-9A-Z]{5}$/.test(code) ? code : undefined,
    providerStatus: error instanceof Error ? /^Payment provider request failed \((\d{3})\)\.$/.exec(error.message)?.[1] : undefined,
  });
}
