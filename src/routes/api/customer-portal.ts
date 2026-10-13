import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/customer-portal")({ server: { handlers: { GET: () => {
 try {
 const url = new URL(process.env.DODO_CUSTOMER_PORTAL_URL ?? "");
 if (url.origin !== "https://customer.dodopayments.com" || !/^\/login\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname) || url.search || url.hash) throw new Error("Invalid portal");
 return new Response(null, { status: 302, headers: { Location: url.href, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
 } catch { return new Response("Customer Portal is being connected. Your licence is also in your Dodo purchase email. Contact support@scanmydisk.com for help.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } }); }
} } } });
