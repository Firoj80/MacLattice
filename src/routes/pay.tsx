import { createFileRoute } from "@tanstack/react-router";
import { JoinShell } from "@/components/signup/join-shell";

export const Route = createFileRoute("/pay")({
  head: () => ({
    meta: [
      { title: "Checkout | Scan My Disk" },
      {
        name: "description",
        content: "Scan My Disk checkout is hosted by Dodo. This page is not a product guide.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: () => (
    <JoinShell compact>
      <section className="mx-auto max-w-xl px-5 py-20">
        <h1 className="text-3xl font-medium text-fg">Secure checkout</h1>
        <p className="mt-4 text-muted">
          Payment details are entered only on Dodo's hosted checkout.
        </p>
        <a
          href="/buy"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 font-semibold text-primary-fg"
        >
          Continue to checkout
        </a>
      </section>
    </JoinShell>
  ),
});
