import { useLocalPricing } from "@/components/local-pricing";
import { ArrowRight } from "lucide-react";
import { BUY_HREF } from "@/lib/buy";

export function HeaderBuy({ className = "" }: { className?: string }) {
  const price = useLocalPricing();
  return (
    <a
      href={BUY_HREF}
      data-ml-goal="checkout_click"
      data-ml-goal-plan="pro"
      className={`purchase-button group !min-h-11 !px-4 !text-xs sm:!text-sm ${className}`}
    >
      <span>Get Now · {price.lifetimePrice}</span>
      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}
