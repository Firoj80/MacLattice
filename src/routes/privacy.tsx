import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () =>
    pageHead({
      title: "Privacy Policy | Scan My Disk",
      description:
        "Scan My Disk privacy policy. Your files never leave your Windows PC — all scanning happens 100% locally.",
      path: "/privacy",
    }),
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 13, 2026">
      <LegalSection title="1. Introduction">
        <p>
          {SITE.name} ("we", "us", or "our") respects your
          privacy. This Privacy Policy explains how we collect, use, and protect your
          information when you use our desktop application and website.
        </p>
      </LegalSection>
      <LegalSection title="2. Data We Don't Collect">
        <div className="space-y-4">
          <p>
            <strong>Scanned Results:</strong> {SITE.name} runs 100% locally on your
            machine. We do not store, upload, or transmit your individual file names,
            folder structures, or the results of your disk scans to any server. Your
            privacy is baked into the app by design.
          </p>
          <p>
            <strong>Local Files:</strong> Your files never leave your Windows PC. We only analyze
            metadata (like size and type) locally to provide visualizations, without ever
            accessing the content of your documents.
          </p>
        </div>
      </LegalSection>
      <LegalSection title="3. Data We Collect">
        <p>We may collect minimal usage data to handle purchases and license validation:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            <strong>Payment Information:</strong> Processed securely by our payment
            provider (Dodo Payments). We do not store your credit card details.
          </li>
          <li>
            <strong>License Keys:</strong> To validate your lifetime license.
          </li>
          <li>
            <strong>Email Address:</strong> Used for sending license keys and critical
            product updates.
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="4. Website Analytics">
        <p>
          We use DataFast to understand website visits and navigation. Its SDK processes
          page paths, referring websites, browser and device information, and visitor
          and session identifiers stored in your browser. Analytics requests also
          expose network information such as your IP address to the service.
          We do not send your license key, purchase email, scanned files, or checkout
          order query parameters as analytics events. Website analytics is separate
          from local disk scanning in the Windows app.
          We also pass the DataFast visitor identifier to Dodo Payments in checkout
          metadata so completed payments can be attributed to referring websites
          and marketing campaigns in DataFast.
        </p>
      </LegalSection>      <LegalSection title="5. Third-Party Services">
        <p>We use the following trusted third-party services:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            <strong>Dodo Payments:</strong> For payment processing and license
            management.
          </li>
          <li>
            <strong>DataFast:</strong> For website traffic and navigation analytics.
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="6. Contact Us">
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">
            {SITE.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

