/**
 * Server-only Telegram alerting utility.
 * Sends instant notifications to the administrator when checkout or backend services fail.
 *
 * Configured via:
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_ADMIN_CHAT_ID (or TELEGRAM_CHAT_ID)
 */

export type AlertLevel = "🔴 CRITICAL" | "🟠 WARNING" | "🔵 INFO";

export interface AlertPayload {
  level: AlertLevel;
  title: string;
  /** Deduplication / rate-limiting key. Identical keys are suppressed within RATE_WINDOW_MS. */
  rateKey: string;
  /** Key-value details included in the message body. */
  details?: Record<string, string | number | boolean | null | undefined>;
}

const RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes rate-limit per key
const sentTimestamps = new Map<string, number>();

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function formatAlertMessage(payload: AlertPayload, envName?: string): string {
  const env =
    envName ??
    (typeof process !== "undefined"
      ? process.env.VERCEL_ENV || (process.env.NODE_ENV ?? "development")
      : "development");
  const time = new Date().toISOString();

  const lines: string[] = [
    `${payload.level} <b>${escapeHtml(payload.title)}</b>`,
    `<i>env: ${escapeHtml(env)} | ${escapeHtml(time)}</i>`,
  ];

  if (payload.details) {
    const detailLines = Object.entries(payload.details)
      .filter(([, val]) => val !== undefined && val !== null)
      .map(([k, val]) => `• <b>${escapeHtml(k)}:</b> <code>${escapeHtml(String(val))}</code>`);
    if (detailLines.length > 0) {
      lines.push("");
      lines.push(...detailLines);
    }
  }

  return lines.join("\n");
}

export function shouldSendAlert(rateKey: string, now = Date.now()): boolean {
  const last = sentTimestamps.get(rateKey) ?? 0;
  if (now - last < RATE_WINDOW_MS) {
    return false;
  }
  sentTimestamps.set(rateKey, now);

  // Periodically trim stale keys if map grows
  if (sentTimestamps.size > 200) {
    for (const [k, ts] of sentTimestamps.entries()) {
      if (now - ts > RATE_WINDOW_MS * 2) {
        sentTimestamps.delete(k);
      }
    }
  }
  return true;
}

export function resetSentAlertsForTesting(): void {
  sentTimestamps.clear();
}

/**
 * Sends a Telegram alert immediately, returning whether delivery was attempted and succeeded.
 */
export async function sendTelegramAlertNow(payload: AlertPayload): Promise<boolean> {
  try {
    const token = typeof process !== "undefined" ? process.env.TELEGRAM_BOT_TOKEN?.trim() : undefined;
    const chatId =
      typeof process !== "undefined"
        ? (process.env.TELEGRAM_ADMIN_CHAT_ID ?? process.env.TELEGRAM_CHAT_ID)?.trim()
        : undefined;

    if (!token || !chatId) {
      return false;
    }

    if (!shouldSendAlert(payload.rateKey)) {
      return false;
    }

    const text = formatAlertMessage(payload);
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[telegram-notify] failed to send (${res.status}): ${errText}`);
      return false;
    }

    return true;
  } catch (err) {
    console.warn(
      "[telegram-notify] unexpected error sending alert:",
      err instanceof Error ? err.message : String(err),
    );
    return false;
  }
}

/**
 * Fire-and-forget: does NOT block the caller and never throws.
 */
export function alertTelegram(payload: AlertPayload): void {
  void sendTelegramAlertNow(payload);
}
