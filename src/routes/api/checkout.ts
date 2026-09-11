import { createFileRoute } from "@tanstack/react-router";
import { createDodoCheckout } from "@/lib/dodo";
import { issueLicense } from "@/lib/license";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          chip?: string;
          origin?: string;
        };
        const chip = body.chip === "intel" ? "intel" : "silicon";
        const origin = (body.origin || SITE.origin).replace(/\/$/, "");
        const returnUrl = `${origin}/thanks`;

        try {
          const session = await createDodoCheckout({ returnUrl, chip });
          if (session) {
            return Response.json({ url: session.url, provider: "dodo" });
          }
        } catch (err) {
          return Response.json(
            { error: err instanceof Error ? err.message : "Checkout failed" },
            { status: 502 },
          );
        }

        const key = await issueLicense({
          paymentId: `preview_${Date.now()}`,
          email: null,
          name: null,
          chip,
        });
        const thanks = new URL("/thanks", origin);
        thanks.searchParams.set("status", "preview");
        thanks.searchParams.set("license_key", key);
        thanks.searchParams.set("chip", chip);
        return Response.json({ url: thanks.toString(), provider: "preview" });
      },
    },
  },
});
