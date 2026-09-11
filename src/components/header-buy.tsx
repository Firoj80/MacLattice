import { SITE } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";

export function HeaderBuy({ className = "" }: { className?: string }) {
  return (
    <a
      href={BUY_HREF}
      className={`group inline-flex h-10 items-center gap-2 rounded-full bg-primary pl-4 pr-1.5 text-[13px] font-semibold text-primary-fg shadow-[0_8px_20px_rgb(33_86_74/0.28)] ring-1 ring-primary/20 transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_12px_28px_rgb(33_86_74/0.35)] ${className}`}
    >
      <span className="hidden sm:inline">Buy Lifetime Licence in</span>
      <span className="sm:hidden">Lifetime in</span>
      <span className="inline-flex h-7 items-center rounded-full bg-primary-fg px-2.5 font-display text-sm font-medium tracking-tight text-primary">
        {SITE.lifetimePrice}
      </span>
    </a>
  );
}
