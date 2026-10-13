import { createFileRoute } from "@tanstack/react-router";
import { JoinShell } from "@/components/signup/join-shell";
import { SITE } from "@/data/site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/license")({ component: LicensePage, head: () => pageHead({ title: `Your licence and downloads | ${SITE.name}`, description: "Recover your licence securely and download the latest Windows app.", path: "/license" }) });
function LicensePage() {
 return <JoinShell compact><section className="mx-auto max-w-xl px-5 py-20 sm:px-8">
 <p className="text-xs font-medium tracking-widest text-primary uppercase">Already purchased?</p>
 <h1 className="font-display mt-3 text-4xl font-medium tracking-tight text-fg">Your licence. Your download.</h1>
 <p className="mt-4 text-base leading-relaxed text-muted">Get back into Scan My Disk without buying again. Download the latest installer, or recover your licence through Dodo’s secure customer portal.</p>
 <a href="/api/download" className="mt-8 flex min-h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg">Download Windows app</a>
 <a href="/api/customer-portal" className="mt-3 flex min-h-12 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-fg">Recover licence · Customer Portal</a>
 <div className="mt-10 rounded-2xl border border-border bg-card p-6"><h2 className="font-display text-xl font-medium text-fg">Recover your licence securely</h2>
 <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted"><li>Open the Customer Portal and enter the email used at checkout.</li><li>Open the secure sign-in link Dodo sends to your inbox.</li><li>Find your purchase and copy its licence key into the Windows app.</li></ol>
 <p className="mt-5 text-sm leading-relaxed text-muted">No second payment is needed. Your key activates one PC at a time. To move to another PC, deactivate the old PC from the app’s License screen first.</p></div>
 <p className="mt-8 text-sm leading-relaxed text-muted">The portal also provides purchase history and invoices. Need help? <a className="text-fg underline" href="mailto:support@scanmydisk.com">support@scanmydisk.com</a></p>
 </section></JoinShell>;
}
