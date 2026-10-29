import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import type { Study } from "@/lib/research/study";
import { studyJsonLd } from "@/lib/research/study";
import { absUrl } from "@/lib/seo";

export function ResearchArticle({ study }: { study: Study }) {
  return (
    <SiteShell>
      <JsonLd data={studyJsonLd(study)} />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold tracking-wider text-muted uppercase">Research</p>
        <h1 className="font-display mt-3 text-4xl font-medium tracking-tight text-fg">{study.title}</h1>
        <p className="mt-5 text-lg text-muted">{study.description}</p>
        {study.updated ? <p className="mt-3 text-sm text-muted">Data through {study.updated}.</p> : null}
        <section className="mt-12 space-y-8">
          <h2 className="font-display text-2xl font-medium text-fg">Findings</h2>
          {study.findings.map((finding) => (
            <div key={finding.id} id={finding.id} className="scroll-mt-24">
              <p className="text-fg">{finding.text}</p>
              <a href={`#${finding.id}`} className="mt-2 inline-block text-xs text-muted hover:text-fg">
                Link to this finding
              </a>
            </div>
          ))}
        </section>
        {study.tables.map((table) => (
          <section key={table.id} className="mt-12">
            <h2 className="font-display text-2xl font-medium text-fg">{table.title}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted">
                    {table.headers.map((header) => (
                      <th key={header} className="py-2 pr-4 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row.join("|")} className="border-b border-border text-fg">
                      {row.map((cell, index) => (
                        <td key={`${index}-${cell}`} className="py-2 pr-4 align-top">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        {study.lists.length ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-medium text-fg">Lists</h2>
            <ul className="mt-4 space-y-2">
              {study.lists.map((list) => (
                <li key={list.href}>
                  <a href={list.href} className="text-fg underline-offset-2 hover:underline">
                    {list.title}
                  </a>
                  <span className="text-muted"> — {list.count} items</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-fg">Methodology</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            {study.methodology.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </section>
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium text-fg">Citation</h2>
          <p className="mt-4 text-sm text-fg">{study.citation}</p>
        </section>
        <section className="mt-12 space-y-8">
          <h2 className="font-display text-2xl font-medium text-fg">Questions</h2>
          {study.faqs.map((item) => (
            <div key={item.id} id={item.id} className="scroll-mt-24">
              <h3 className="text-lg font-medium text-fg">{item.question}</h3>
              <p className="mt-2 text-muted">{item.answer}</p>
              <a href={`#${item.id}`} className="mt-2 inline-block text-xs text-muted hover:text-fg">
                Link to this answer
              </a>
            </div>
          ))}
        </section>
        <p className="mt-12 text-sm">
          <a href={absUrl("/research")} className="text-muted hover:text-fg">
            All research
          </a>
        </p>
      </article>
    </SiteShell>
  );
}
