import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () =>
    pageHead({
      title: "Privacy Policy | MacLattice",
      description:
        "MacLattice privacy policy. Your files never leave your Mac — all scanning happens 100% locally.",
      path: "/privacy",
    }),
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="January 24, 2026">
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
            <strong>Local Files:</strong> Your files never leave your Mac. We only analyze
            metadata (like size and type) locally to provide visualizations, without ever
            accessing the content of your documents.
          </p>
        </div>
      </LegalSection>
      <LegalSection title="3. Data We Collect">
        <p>We may collect minimal usage data to handle subscriptions and license validation:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            <strong>Payment Information:</strong> Processed securely by our payment
            provider (Dodo Payments). We do not store your credit card details.
          </li>
          <li>
            <strong>License Keys:</strong> To validate your Pro subscription.
          </li>
          <li>
            <strong>Email Address:</strong> Used for sending license keys and critical
            product updates.
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="4. Error & Crash Reporting">
        <p>
          To improve the reliability of {SITE.name}, we use Sentry.io for automated crash
          reporting. We have implemented strict, device-level protections to ensure your
          privacy:
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            <strong>Zero-PII Policy:</strong> We do not collect personal names, email
            addresses, or IP addresses in crash reports.
          </li>
          <li>
            <strong>Local Scrubbing:</strong> All sensitive data is sanitized directly on
            your device before it ever reaches the cloud.
          </li>
          <li>
            <strong>Path Anonymization:</strong> We automatically redact folder names and
            usernames in file paths (e.g.,{" "}
            <code className="rounded bg-white/5 px-1 text-primary">
              /Users/[redacted]/...
            </code>
            ) so your private folder structure remains anonymous.
          </li>
          <li>
            <strong>Minimal Footprint:</strong> We do not use Sentry for session tracking,
            performance monitoring, or device identification.
          </li>
        </ul>
      </LegalSection>
      <LegalSection title="5. Third-Party Services">
        <p>We use the following trusted third-party services:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            <strong>Dodo Payments:</strong> For payment processing and subscription
            management.
          </li>
          <li>
            <strong>Sentry.io:</strong> For anonymous crash reporting and error tracking.
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
