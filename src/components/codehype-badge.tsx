export function CodeHypeBadge({ className = "mt-5 inline-block max-w-[180px]" }: { className?: string }) {
  return (
    <a
      href="https://www.codehype.ai/product/scan-my-disk?utm_source=codehype_badge"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <img
        src="https://www.codehype.ai/badges/scan-my-disk.svg?variant=find-us&v=20"
        alt="Featured on CodeHype"
        width={180}
        height={65}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full max-h-[65px] border-0"
      />
    </a>
  );
}
