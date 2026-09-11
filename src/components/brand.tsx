import { Link } from "@tanstack/react-router";
import { SITE } from "@/data/site";

export function BrandMark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const img = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const text = size === "sm" ? "text-base" : "text-lg";
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 font-display font-semibold tracking-tight text-fg ${text} ${className}`}
    >
      <img
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className={`${img} rounded-lg shadow-[0_4px_12px_rgb(0_0_0/0.18)]`}
      />
      <span>{SITE.name}</span>
    </Link>
  );
}
