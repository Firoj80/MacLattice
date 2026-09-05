import { STEPS } from "@/data/site";
import { FadeIn } from "@/components/fade-in";

export function HowItWorks() {
  return (
    <section className="border-y border-fg/5 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center md:mb-20">
          <FadeIn>
            <h2 className="mb-4 text-3xl font-bold text-fg sm:text-4xl md:text-5xl">
              Get started in seconds.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-lg text-muted">No complex setup. Just download and go.</p>
          </FadeIn>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <FadeIn key={step.n} delay={0.1 * i} className="text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-fg/10 bg-fg/5 font-mono text-sm font-semibold text-primary">
                {step.n}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-fg">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.body}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
