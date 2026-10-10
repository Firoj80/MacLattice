import { SITE } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";

export function HeaderBuy({ className = "" }: { className?: string }) {
  return (
    <a
      href={BUY_HREF}
      className={`inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:scale-[1.02] hover:bg-white/90 ${className}`}
    >
      Get Pro · {SITE.lifetimePrice}
    </a>
  );
}
