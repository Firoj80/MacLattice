import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { FAQS } from "@/data/faq";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <h2 className="mb-12 text-center text-3xl font-bold text-fg sm:text-4xl md:text-5xl">
            Questions?
          </h2>
        </FadeIn>
        <div className="divide-y divide-fg/8 border-y border-fg/8">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={item.question} delay={0.05 * i} y={10}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="text-base font-medium text-fg sm:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-muted transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-200",
                    isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
                  )}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-muted sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
