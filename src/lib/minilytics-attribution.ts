declare global {
  interface Window {
    minilytics?: ((cmd: "goal" | "identify" | "pageview", a?: any, b?: any) => void) & {
      attribution?: () => { ml_visitor_id?: string; ml_session_id?: string };
    };
  }
}

export type MinilyticsAttribution = {
  ml_visitor_id: string;
  ml_session_id: string;
};

/**
 * Extract Minilytics visitor (`ml_vid`) and session (`ml_sid`) cookies from a Cookie header.
 */
export function minilyticsAttribution(cookieHeader: string | null = null): MinilyticsAttribution {
  const result: MinilyticsAttribution = {
    ml_visitor_id: "",
    ml_session_id: "",
  };

  if (!cookieHeader) return result;

  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    const rawVal = part.slice(idx + 1).trim();

    if (name === "ml_vid") {
      try {
        const val = decodeURIComponent(rawVal);
        if (/^[a-zA-Z0-9_-]{1,128}$/.test(val)) {
          result.ml_visitor_id = val;
        }
      } catch {
        // ignore invalid encoding
      }
    } else if (name === "ml_sid") {
      try {
        const val = decodeURIComponent(rawVal);
        if (/^[a-zA-Z0-9_-]{1,128}$/.test(val)) {
          result.ml_session_id = val;
        }
      } catch {
        // ignore invalid encoding
      }
    }
  }

  return result;
}

export function extractMinilyticsAttribution(
  cookieHeader: string | null = null,
  fallback?: Partial<MinilyticsAttribution>
): MinilyticsAttribution {
  const fromCookie = minilyticsAttribution(cookieHeader);
  return {
    ml_visitor_id: fromCookie.ml_visitor_id || fallback?.ml_visitor_id || "",
    ml_session_id: fromCookie.ml_session_id || fallback?.ml_session_id || "",
  };
}
