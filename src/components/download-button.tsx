import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** Local account CTA — no third-party downloads. */
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
    <Link
      to="/"
      hash="create"
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-medium whitespace-nowrap text-bg bg-fg transition-all hover:bg-fg/90",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function startDownloadThenRedirect(_fileUrl?: string) {
  window.location.href = "/#create";
}

export function AccountCta({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Link to="/" hash="create" className={className}>
      {children ?? "Buy licence"}
    </Link>
  );
}
