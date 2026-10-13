/** Attribution is optional and never serves as purchase or license authorization. */
export function datafastVisitorId(cookieHeader: string | null): string | undefined {
  const values = (cookieHeader ?? "").split(";")
    .map((part) => part.trim())
    .filter((part) => part.startsWith("datafast_visitor_id="));
  if (values.length !== 1) return undefined;
  try {
    const value = decodeURIComponent(values[0].slice("datafast_visitor_id=".length));
    return /^[a-zA-Z0-9_-]{1,128}$/.test(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

/** Preserve campaign attribution without sending order IDs or other query data. */
export function datafastPageUrl(href: string): string {
  const incoming = new URL(href);
  const safe = new URL(incoming.pathname, incoming.origin);
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = incoming.searchParams.get(key);
    if (value) safe.searchParams.set(key, value.slice(0, 200));
  }
  return safe.href;
}
