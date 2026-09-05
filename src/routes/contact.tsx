import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () =>
    pageHead({
      title: "Contact Us | MacLattice",
      description: "Get in touch with the MacLattice team for support, questions, or feedback.",
      path: "/contact",
    }),
});

function ContactPage() {
  return (
    <SiteShell>
      <section className="min-h-screen bg-black py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">Contact Us</h1>
            <p className="text-gray-400">Have questions? We're here to help.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center transition-colors hover:bg-white/[0.07]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Email Support</h3>
              <p className="mb-6 font-light text-gray-400">
                For general inquiries, refunds, and technical support.
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="font-medium text-primary hover:underline"
              >
                {SITE.email}
              </a>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center transition-colors hover:bg-white/[0.07]">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4500]/20">
                <svg className="h-6 w-6 text-[#FF4500]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.051l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.282.058.563.058.841 0 2.47-3.111 4.496-6.964 4.496-3.855 0-6.96-2.026-6.96-4.496 0-.285.02-.568.058-.853A1.76 1.76 0 0 1 4.398 12c0-.968.786-1.754 1.754-1.754.463 0 .875.18 1.179.475 1.187-.822 2.807-1.377 4.591-1.472l.806-3.747 3.033.638a1.24 1.24 0 0 1-.005.138c0 .688.562 1.249 1.249 1.249zM9.508 13.74c-.563 0-1.023.46-1.023 1.024 0 .563.46 1.024 1.023 1.024s1.024-.461 1.024-1.024c.001-.564-.46-1.024-1.024-1.024zm4.984 0c-.563 0-1.023.46-1.023 1.024 0 .563.46 1.024 1.023 1.024s1.024-.461 1.024-1.024c0-.564-.46-1.024-1.024-1.024zm-4.398 3.238a.18.18 0 0 0-.047.25 3.513 3.513 0 0 0 3.953 1.439c.643-.198 1.117-.6 1.398-.99a.182.182 0 0 0-.045-.251.183.183 0 0 0-.253.047 3.167 3.167 0 0 1-3.696 1.062 3.165 3.165 0 0 1-1.063-1.306.183.183 0 0 0-.247-.051z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">Reddit Community</h3>
              <p className="mb-6 font-light text-gray-400">
                Join the discussion, get tips, and share your feedback.
              </p>
              <a
                href={SITE.reddit}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                r/maclattice
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
