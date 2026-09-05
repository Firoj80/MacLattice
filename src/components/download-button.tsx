import type { MouseEvent } from "react";
import { AppleIcon } from "@/components/apple-icon";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

type Variant = "solid" | "ghost" | "nav";

const styles: Record<Variant, string> = {
  solid:
    "min-w-60 px-6 py-3 text-base font-medium text-bg bg-fg hover:bg-fg/90 shadow-lg hover:scale-[1.03]",
  ghost:
    "min-w-60 px-6 py-3 text-base font-medium text-fg bg-fg/10 hover:bg-fg/20 border border-fg/20 hover:scale-[1.03]",
  nav: "px-4 py-2 text-sm font-medium text-bg bg-fg hover:bg-fg/90 hover:scale-[1.02]",
};

export function startDownloadThenRedirect(fileUrl: string) {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.rel = "noopener";
  const name = fileUrl.split("/").pop();
  if (name) link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    window.location.href = SITE.afterDownload;
  }, 1200);
}

function onDownloadClick(event: MouseEvent<HTMLAnchorElement>, fileUrl: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }
  event.preventDefault();
  startDownloadThenRedirect(fileUrl);
}

export function DownloadButton({
  href = SITE.siliconDmg,
  label = "Download",
  variant = "solid",
  className,
}: {
  href?: string;
  label?: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={(event) => onDownloadClick(event, href)}
      className={cn(
        "inline-flex items-center justify-center rounded-xl whitespace-nowrap transition-all",
        styles[variant],
        className,
      )}
    >
      <AppleIcon className={variant === "nav" ? "size-4 mr-1.5" : "size-5 mr-2"} />
      {label}
    </a>
  );
}
