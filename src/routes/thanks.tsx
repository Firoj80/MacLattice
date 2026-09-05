import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/data/site";
import { HOME_DESCRIPTION, HOME_TITLE, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/thanks")({
  component: ThanksPage,
  head: () => pageHead({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/thanks" }),
});

function ThanksPage() {
  return (
    <SiteShell>
      <section className="flex min-h-screen items-center justify-center bg-black py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Thank You for Your Purchase!
          </h1>
          <p className="mb-8 text-xl text-gray-400">
            Welcome to {SITE.name} Pro. Your license key has been sent to your email.
          </p>
          <p className="mt-8 text-sm text-gray-500">
            Didn't receive your email? Check your spam folder or contact{" "}
            <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">
              {SITE.email}
            </a>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
