export function TrustBar() {
  return (
    <section className="border-y border-fg/5 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {["Native macOS App", "100% Local", "No Account Required"].map((label) => (
            <div key={label} className="flex items-center gap-2 text-sm text-muted">
              <div className="size-1.5 rounded-full bg-muted/50" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
