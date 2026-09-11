import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BUY_HREF } from "@/lib/buy";

export function DownloadButton({
  label = "Buy licence",
  className,
}: {
  href?: string;
  label?: string;
  variant?: string;
  className?: string;
}) {
  return (
    <a
      href={BUY_HREF}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-medium whitespace-nowrap text-bg bg-fg transition-all hover:bg-fg/90",
        className,
      )}
    >
      {label}
    </a>
  );
}

export function startDownloadThenRedirect(_fileUrl?: string) {
  window.location.href = BUY_HREF;
}

export function AccountCta({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a href={BUY_HREF} className={className}>
      {children ?? "Buy licence"}
    </a>
  );
}
