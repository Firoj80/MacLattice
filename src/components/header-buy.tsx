import { ArrowRight } from "lucide-react";
import { SITE } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";

export function HeaderBuy({ className = "" }: { className?: string }) {
  return (
    <a
      href={BUY_HREF}
      className={`btn-primary group !px-3.5 !py-1.5 !text-xs sm:!px-4 sm:!py-2 sm:!text-sm ${className}`}
    >
      <span>Get Pro · {SITE.lifetimePrice}</span>
      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}
