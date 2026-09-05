import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { DownloadButton } from "@/components/download-button";
import { ROTATING_WORDS, SITE } from "@/data/site";

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,0,85,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 h-[400px] w-[400px] opacity-20 blur-3xl"
          style={{
            background: "linear-gradient(135deg, #FF0055 0%, #FF6B35 100%)",
            transform: "rotate(-12deg)",
          }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] opacity-15 blur-3xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            transform: "rotate(12deg)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-4xl leading-[1.05] font-bold tracking-tight text-fg sm:text-5xl md:text-6xl">
          Built for Mac users
          <br />
          who like to know{" "}
          <span className="relative inline-block h-[1.1em] w-[14ch] overflow-hidden align-bottom">
            {ROTATING_WORDS.map((word, i) => (
              <span
                key={word}
                className="absolute inset-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-500"
                style={{
                  opacity: i === index ? 1 : 0,
                  transform: i === index ? "translateY(0)" : "translateY(100%)",
                }}
              >
                {word}.
              </span>
            ))}
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          Reclaim gigabytes in seconds. 100% local and privacy-first.
        </p>
        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <DownloadButton href={SITE.siliconDmg} label="Free Download · Silicon" />
          <DownloadButton
            href={SITE.intelDmg}
            label="Free Download · Intel"
            variant="ghost"
          />
        </div>
        <div className="mb-12 flex items-center justify-center gap-2">
          <div className="flex items-center space-x-2 rounded-full border border-fg/10 bg-fg/5 px-4 py-2 backdrop-blur-sm">
            <ShieldCheck className="size-4 text-emerald-400" />
            <span className="text-sm font-medium text-neutral-300">
              Notarized by Apple
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-8 w-full max-w-5xl px-0 sm:mt-16 sm:px-6">
        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-50 blur-2xl" />
        <div className="relative overflow-hidden rounded-xl border border-fg/10 shadow-2xl shadow-primary/10">
          <img
            src="/app-screenshot.webp"
            alt="MacLattice - Storage visualization interface"
            className="block h-auto w-full"
            width={1200}
            height={800}
          />
        </div>
      </div>
    </section>
  );
}
