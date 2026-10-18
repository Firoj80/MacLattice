import { useLocalPricing } from "@/components/local-pricing";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/data/site";
import { BUY_HREF } from "@/lib/buy";

export function HeaderBuy({ className = "" }: { className?: string }) {
  const price = useLocalPricing();
  return (
    <a
      href={BUY_HREF}
      className={`purchase-button group !min-h-11 !px-4 !text-xs sm:!text-sm ${className}`}
    >
      <span><span className="sm:hidden">Get Pro</span><span className="hidden sm:inline">Early bird</span> · {price.lifetimePrice}</span>
      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}
