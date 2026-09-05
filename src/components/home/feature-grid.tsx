import {
  Activity,
  LayoutGrid,
  RotateCw,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { FEATURES } from "@/data/site";

const ICONS = {
  rotate: RotateCw,
  grid: LayoutGrid,
  shield: Shield,
  trash: Trash2,
  search: Search,
  activity: Activity,
} as const;

export function FeatureGrid() {
  return (
    <section id="features" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center md:mb-20">
          <FadeIn>
            <h2 className="mb-4 text-3xl font-bold text-fg sm:text-4xl md:text-5xl">
              Everything you need.
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mx-auto max-w-xl text-lg text-muted">
              Powerful features designed to make disk management simple, fast, and
              secure.
            </p>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.icon];
            return (
              <FadeIn key={feature.name} delay={0.08 * i}>
                <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]">
                  <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-primary/10">
                    <Icon className="size-5 text-white transition-colors group-hover:text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-fg">{feature.name}</h3>
                  <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
