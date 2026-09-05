import { useLayoutEffect, useRef } from "react";
import { SHOWCASES } from "@/data/site";
import { InlineRich } from "@/components/inline-code";

function lerp(progress: number, input: number[], output: number[]) {
  if (progress <= input[0]) return output[0];
  const last = input.length - 1;
  if (progress >= input[last]) return output[last];
  for (let i = 0; i < last; i++) {
    const from = input[i];
    const to = input[i + 1];
    if (progress >= from && progress <= to) {
      const t = to === from ? 0 : (progress - from) / (to - from);
      return output[i] + (output[i + 1] - output[i]) * t;
    }
  }
  return output[last];
}

export function Showcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const apply = (progress: number) => {
      const total = SHOWCASES.length;
      SHOWCASES.forEach((_, i) => {
        const start = i / total;
        const end = (i + 1) / total;
        const size = 1 / total;
        const opacity = reduce
          ? 1
          : lerp(
              progress,
              [start, start + 0.15 * size, end - 0.15 * size, end],
              [0, 1, 1, 0],
            );
        const y = reduce ? 0 : lerp(progress, [start, end], [50, -50]);
        const text = textRefs.current[i];
        const image = imageRefs.current[i];
        if (text) text.style.opacity = String(opacity);
        if (image) {
          image.style.opacity = String(opacity);
          image.style.transform = `translate3d(0, ${y}px, 0)`;
        }
      });
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const range = section.offsetHeight - window.innerHeight;
      const progress = range <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / range));
      apply(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="bg-black">
      <div ref={sectionRef} className="hidden md:block">
        <div className="mx-auto max-w-[1400px]">
          {SHOWCASES.map((item, i) => (
            <div
              key={item.title}
              className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
            >
              <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 items-center gap-8 px-6 lg:gap-16 lg:px-12">
                <div
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                  className="flex flex-col justify-center pl-8"
                  style={{ opacity: 0 }}
                >
                  <h3 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-white lg:text-5xl">
                    {item.title}
                  </h3>
                  <p className="max-w-lg text-xl leading-relaxed text-neutral-400">
                    <InlineRich text={item.description} />
                  </p>
                </div>
                <div className="relative flex h-[50vh] w-full items-center justify-center lg:h-[70vh]">
                  <div
                    ref={(el) => {
                      imageRefs.current[i] = el;
                    }}
                    className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
                    style={{ opacity: 0, transform: "translate3d(0, 50px, 0)" }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full bg-neutral-900/50 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-16 px-6 py-16 md:hidden">
        {SHOWCASES.map((item) => (
          <div key={item.title} className="space-y-6">
            <h3 className="text-3xl font-bold text-white">{item.title}</h3>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full bg-neutral-900/50 object-contain"
              />
            </div>
            <p className="text-lg leading-relaxed text-neutral-400">
              <InlineRich text={item.description} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
