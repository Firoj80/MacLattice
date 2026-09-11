import type { ReactNode } from "react";

function localizeHref(href: string) {
  if (!href || href === "#") return "/";
  return href;
}

function renderInline(text: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const re =
    /(!\[([^\]]*)\]\(([^)]+)\))|(\[([^\]]+)\]\(([^)]+)\))|(\*\*(.+?)\*\*)|(`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) tokens.push(text.slice(last, match.index));
    if (match[1]) {
      tokens.push(
        <img
          key={key++}
          src={match[3]}
          alt={match[2]}
          className="my-6 w-full rounded-2xl border border-border shadow-xl"
        />,
      );
    } else if (match[4]) {
      const href = localizeHref(match[6]);
      const label = match[5].replace(/\*\*/g, "");
      tokens.push(
        <a
          key={key++}
          href={href}
          className="text-primary no-underline hover:underline"
        >
          {label}
        </a>,
      );
    } else if (match[7]) {
      tokens.push(
        <strong key={key++} className="font-semibold text-fg">
          {match[8]}
        </strong>,
      );
    } else if (match[9]) {
      tokens.push(
        <code
          key={key++}
          className="rounded bg-primary/8 px-1 font-mono text-[0.9em] text-primary"
        >
          {match[10]}
        </code>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) tokens.push(text.slice(last));
  return tokens;
}

function isTableBlock(lines: string[]) {
  return lines.length >= 2 && lines.filter((l) => l.trim().startsWith("|")).length >= 2;
}

function Table({ lines }: { lines: string[] }) {
  const rows = lines
    .filter((l) => l.trim().includes("|"))
    .map((l) => {
      const cells = l
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());
      while (cells.length && cells[0] === "") cells.shift();
      while (cells.length && cells[cells.length - 1] === "") cells.pop();
      return cells;
    })
    .filter((r) => r.length > 0 && !r.every((c) => /^[-:]+$/.test(c)));
  if (rows.length === 0) return null;
  const [head, ...body] = rows;
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-fg/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-fg/5 text-fg">
          <tr>
            {head.map((c, i) => (
              <th key={i} className="px-4 py-3 font-semibold">
                {renderInline(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className="border-t border-fg/10">
              {head.map((_, ci) => (
                <td key={ci} className="px-4 py-3 text-muted">
                  {renderInline(row[ci] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Paragraph({ text, k }: { text: string; k: string }) {
  const lines = text.split("\n");
  const nodes: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let idx = 0;

  const flushPara = () => {
    if (!para.length) return;
    nodes.push(
      <p key={`${k}-p-${idx++}`} className="mb-4 leading-relaxed text-muted">
        {renderInline(para.join(" "))}
      </p>,
    );
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    nodes.push(
      <ul key={`${k}-ul-${idx++}`} className="my-4 list-disc space-y-2 pl-6 text-muted">
        {list.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const line of lines) {
    if (/^\s*-\s+/.test(line)) {
      flushPara();
      list.push(line.replace(/^\s*-\s+/, ""));
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return <>{nodes}</>;
}

export function MarkdownBody({ markdown }: { markdown: string }) {
  const blocks = markdown.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const nodes: ReactNode[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const raw = blocks[i].trim();
    if (!raw) continue;
    const lines = raw.split("\n");

    if (isTableBlock(lines)) {
      nodes.push(<Table key={i} lines={lines} />);
      continue;
    }

    if (lines[0].startsWith("```")) {
      const code = lines.slice(1).join("\n").replace(/```$/, "");
      nodes.push(
        <pre
          key={i}
          className="my-4 overflow-x-auto rounded-xl border border-border bg-card p-4 font-mono text-sm text-fg"
        >
          <code>{code}</code>
        </pre>,
      );
      continue;
    }

    const first = lines[0];
    if (first.startsWith("### ")) {
      nodes.push(
        <h3 key={`${i}-h`} className="mt-10 mb-3 text-xl font-semibold text-fg">
          {renderInline(first.slice(4))}
        </h3>,
      );
      if (lines.length > 1) {
        nodes.push(<Paragraph key={`${i}-b`} k={`${i}-b`} text={lines.slice(1).join("\n")} />);
      }
      continue;
    }
    if (first.startsWith("## ")) {
      nodes.push(
        <h2 key={`${i}-h`} className="font-display mt-10 mb-4 text-2xl font-medium text-fg">
          {renderInline(first.slice(3))}
        </h2>,
      );
      if (lines.length > 1) {
        nodes.push(<Paragraph key={`${i}-b`} k={`${i}-b`} text={lines.slice(1).join("\n")} />);
      }
      continue;
    }
    if (first.startsWith("# ")) {
      nodes.push(
        <h1 key={i} className="mb-6 text-3xl font-bold text-fg">
          {renderInline(first.slice(2))}
        </h1>,
      );
      continue;
    }
    if (first.startsWith("> ")) {
      nodes.push(
        <blockquote
          key={i}
          className="my-4 border-l-2 border-primary/50 pl-4 text-muted italic"
        >
          {renderInline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "))}
        </blockquote>,
      );
      continue;
    }

    nodes.push(<Paragraph key={i} k={String(i)} text={raw} />);
  }

  return <div className="max-w-none">{nodes}</div>;
}
