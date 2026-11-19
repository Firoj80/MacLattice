import { alertTelegram } from "@/lib/notify";

/** Log configuration presence and error category, never credentials or buyer data. */
export function logCheckoutFailure(error: unknown, context = "checkout") {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  const providerCode =
    error && typeof error === "object" && "providerCode" in error && typeof error.providerCode === "string"
      ? error.providerCode
      : undefined;
  const providerMessage =
    error && typeof error === "object" && "providerMessage" in error && typeof error.providerMessage === "string"
      ? error.providerMessage
      : undefined;

  const databaseConfigured = Boolean(process.env.DATABASE_URL?.trim());
  const apiKeyConfigured = Boolean(process.env.DODO_PAYMENTS_API_KEY?.trim());
  const productConfigured = Boolean(process.env.DODO_PRODUCT_ID?.trim());
  const modeValid = ["test_mode", "live_mode"].includes(process.env.DODO_PAYMENTS_ENV?.trim() ?? "");
  const providerStatus =
    error instanceof Error ? /^Payment provider request failed \((\d{3})\)\.$/.exec(error.message)?.[1] : undefined;
  const rawErrorMessage = error instanceof Error ? error.message : String(error);

  console.error(`[${context}] unavailable`, {
    databaseConfigured,
    apiKeyConfigured,
    productConfigured,
    modeValid,
    databaseCode: typeof code === "string" && /^[0-9A-Z]{5}$/.test(code) ? code : undefined,
    providerStatus,
    providerCode,
    providerMessage,
  });

  alertTelegram({
    level: "🔴 CRITICAL",
    title: context === "webhook" ? "Dodo Webhook Event Failed" : "Checkout Unavailable for Customer",
    rateKey: `checkout-${context}-${providerCode || providerStatus || "err"}`,
    details: {
      action: context === "webhook" ? "Webhook Event Processing" : "Checkout Session Creation",
      error: rawErrorMessage.slice(0, 150),
      database: databaseConfigured ? "Configured" : "MISSING",
      dodoApiKey: apiKeyConfigured ? "Configured" : "MISSING",
      dodoProduct: productConfigured ? "Configured" : "MISSING",
      dodoMode: process.env.DODO_PAYMENTS_ENV ?? "MISSING",
      providerStatus: providerStatus ?? "N/A",
      providerCode: providerCode ?? "N/A",
      providerMessage: providerMessage ?? "N/A",
    },
  });
}
