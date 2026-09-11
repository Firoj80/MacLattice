import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () =>
    pageHead({
      title: "Terms of Service | Scan My Disk",
      description:
        "Scan My Disk terms of service. One-time purchase, lifetime access, 15-day money-back guarantee.",
      path: "/terms",
    }),
});

function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="January 1, 2026">
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By downloading, installing, or using {SITE.name}, you agree to be bound by these
          Terms of Service. If you do not agree, do not use the software.
        </p>
      </LegalSection>
      <LegalSection title="2. License Grant">
        <p>
          We grant you a revocable, non-exclusive, non-transferable license to use the{" "}
          {SITE.name} software for personal or commercial purposes in accordance with the
          license you have purchased.
        </p>
      </LegalSection>
      <LegalSection title="3. Pro License">
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            <strong>Fees:</strong> The Pro version is available for a one-time payment of
            $12.99.
          </li>
          <li>
            <strong>Lifetime Access:</strong> Your purchase includes lifetime access to all
            current features and future updates.
          </li>
          <li>
            <strong>Refunds:</strong> We offer a 15-day money-back guarantee. No questions
            asked.
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="4. Disclaimer of Warranties">
        <p>
          The software is provided "as is" without warranty of any kind. You use
          the software at your own risk. {SITE.name} is not responsible for any data loss
          that may occur while using the software's deletion features.
        </p>
      </LegalSection>
      <LegalSection title="5. Governing Law">
        <p>
          These terms shall be governed by the laws of India, without regard to its
          conflict of law provisions.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
