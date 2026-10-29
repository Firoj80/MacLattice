export function AtAGlance({ rows }: { rows: readonly { label: string; value: string }[] }) {
  return (
    <dl className="grid gap-3 text-left sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="rounded-lg border border-border px-3 py-2">
          <dt className="text-xs text-muted">{row.label}</dt>
          <dd className="text-sm text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
