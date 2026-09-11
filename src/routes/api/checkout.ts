import { createFileRoute } from "@tanstack/react-router";
import { createDodoCheckout } from "@/lib/dodo";
import { generateLicenseKey, issueLicense } from "@/lib/license";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          chip?: string;
          origin?: string;
          test?: boolean;
          name?: string;
          email?: string;
        };
        const chip = body.chip === "intel" ? "intel" : "silicon";
        const origin = (body.origin || SITE.origin).replace(/\/$/, "");
        const returnUrl = `${origin}/thanks`;

        if (!body.test) {
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
        }

        const email = body.email?.trim() || null;
        const name = body.name?.trim() || null;
        let key = generateLicenseKey();
        try {
          key = await issueLicense({
            paymentId: `test_${Date.now()}`,
            email,
            name,
            chip,
            licenseKey: key,
          });
        } catch {
          // PGLite/Neon unavailable — still hand the buyer a key on screen.
        }
        const thanks = new URL("/thanks", origin);
        thanks.searchParams.set("status", "test");
        thanks.searchParams.set("license_key", key);
        thanks.searchParams.set("chip", chip);
        if (email) thanks.searchParams.set("email", email);
        return Response.json({ url: thanks.toString(), provider: "test" });
      },
    },
  },
});
