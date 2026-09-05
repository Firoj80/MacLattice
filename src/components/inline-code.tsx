import type { ReactNode } from "react";

const CODE = /`([^`]+)`/g;

export function InlineRich({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(CODE);
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <code
        key={match.index}
        className="rounded-md bg-fg/10 px-1.5 py-0.5 font-mono text-[0.9em] text-accent"
      >
        {match[1]}
      </code>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
