import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPage,
  head: () =>
    pageHead({
      title: "Refund Policy | Scan My Disk",
      description: "Scan My Disk refund policy. 15-day money-back guarantee, no questions asked.",
      path: "/refund-policy",
    }),
});

function RefundPage() {
  return (
    <LegalPage title="Refund Policy" updated="January 1, 2026">
      <LegalSection title="15-Day Money-Back Guarantee">
        <p>
          We want you to be completely satisfied with {SITE.name}. If you are not happy
          with your purchase for any reason, we offer a full refund within 15 days of your
          initial purchase. No questions asked.
        </p>
      </LegalSection>
      <LegalSection title="How to Request a Refund">
        <p>
          To initiate a refund, please email our support team at{" "}
          <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">
            {SITE.email}
          </a>{" "}
          with the following details:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Order ID or the email address used for purchase.</li>
          <li>A brief reason for the refund (this helps us improve).</li>
        </ul>
      </LegalSection>
      <LegalSection title="Processing Time">
        <p>
          Refunds are typically processed within 3-5 business days. The funds will be
          returned to your original payment method.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
