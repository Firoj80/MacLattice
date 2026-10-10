import { Link } from "@tanstack/react-router";
import { SITE } from "@/data/site";

export function BrandMark({ className = "" }: { className?: string; size?: "sm" | "md" }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-80 ${className}`}
    >
      <img src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 rounded-md" />
      <span>{SITE.name}</span>
    </Link>
  );
}
