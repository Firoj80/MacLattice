import { isMacStorageGuide, posts } from "@/data/blog";
import { JOIN_TOOLKIT, JOIN_VIEWS } from "@/data/join";
import { PLATFORMS, SITE } from "@/data/site";
import { absUrl } from "@/lib/seo";

export const MIN_SHARE = 20;
export const MIN_LIST = 20;
/** A gap under this many percentage points is "about the same", not a difference. */
export const SAME_POINT_GAP = 5;

export type GuideRow = {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: readonly string[];
  windows: boolean;
};

export type Finding = { id: string; text: string };

export type StudyFaq = { id: string; question: string; answer: string };

export type StudyTable = { id: string; title: string; headers: string[]; rows: string[][] };

export type PublicList = { href: string; count: number; minimum: number; title: string };

export type Study = {
  path: string;
  title: string;
  description: string;
  summary: string;
  updated?: string;
  findings: Finding[];
  faqs: StudyFaq[];
  tables: StudyTable[];
  methodology: string[];
  citation: string;
  variables: string[];
  lists: PublicList[];
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function nearestPercent(count: number, total: number) {
  if (!Number.isInteger(count) || !Number.isInteger(total) || total < 1 || count < 0) {
    throw new Error("Invalid share.");
  }
  return Math.round((count / total) * 100);
}

export function shareText(count: number, total: number, noun: string) {
  return `${count} of ${total} ${noun} (${nearestPercent(count, total)}%)`;
}

function gapIsSmall(left: number, right: number, total: number) {
  return Math.abs(nearestPercent(left, total) - nearestPercent(right, total)) < SAME_POINT_GAP;
}

export function dedupeGuides(rows: readonly GuideRow[]) {
  const bySlug = new Map<string, GuideRow>();
  for (const row of rows) {
    const prev = bySlug.get(row.slug);
    if (!prev || row.date > prev.date) bySlug.set(row.slug, row);
  }
  return [...bySlug.values()];
}

export function sortGuides(rows: readonly GuideRow[]) {
  return dedupeGuides(rows).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export function defaultGuides(): GuideRow[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    author: post.author,
    tags: post.tags,
    windows: !isMacStorageGuide(post.slug),
  }));
}

function monthYear(iso: string) {
  const [year, month] = iso.split("-");
  const name = MONTHS[Number(month) - 1];
  if (!name || !year) throw new Error(`Invalid date ${iso}`);
  return `${name} ${year}`;
}

function joinAnd(items: readonly string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function platformSentence(rows: readonly GuideRow[]) {
  const total = rows.length;
  if (total < MIN_SHARE) return null;
  const windows = rows.filter((row) => row.windows).length;
  const mac = total - windows;
  const windowsText = `${shareText(windows, total, "guides")} are Windows product guides`;
  const macText = `${shareText(mac, total, "guides")} are macOS storage guides and are not a Mac download`;
  if (gapIsSmall(windows, mac, total)) {
    return `Windows product guides and macOS storage guides are about the same: ${windowsText}. ${macText}.`;
  }
  return windows > mac ? `${windowsText}. ${macText}.` : `${macText}. ${windowsText}.`;
}

export function yearSentence(rows: readonly GuideRow[]) {
  const total = rows.length;
  if (total < MIN_SHARE) return null;
  const years = new Map<string, number>();
  for (const row of rows) {
    const year = row.date.slice(0, 4);
    years.set(year, (years.get(year) ?? 0) + 1);
  }
  const entries = [...years.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length !== 2) return null;
  if (entries.reduce((sum, [, count]) => sum + count, 0) !== total) return null;
  const [first, second] = entries;
  const firstText = `${shareText(first[1], total, "guides")} are dated ${first[0]}`;
  const secondText = `${shareText(second[1], total, "guides")} are dated ${second[0]}`;
  if (gapIsSmall(first[1], second[1], total)) {
    return `${first[0]} and ${second[0]} are about the same: ${firstText}. ${secondText}.`;
  }
  return first[1] > second[1] ? `${firstText}. ${secondText}.` : `${secondText}. ${firstText}.`;
}

export function authorSentence(rows: readonly { author: string }[]) {
  const total = rows.length;
  if (total < MIN_SHARE) return null;
  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.author, (counts.get(row.author) ?? 0) + 1);
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (entries.length === 1) {
    return `${shareText(entries[0][1], total, "guides")} list ${entries[0][0]} as the author.`;
  }
  const [first, second] = entries;
  const firstText = `${shareText(first[1], total, "guides")} list ${first[0]} as the author`;
  const secondText = `${shareText(second[1], total, "guides")} list ${second[0]} as the author`;
  if (gapIsSmall(first[1], second[1], total)) {
    return `${entries.length} authors are listed. ${first[0]} and ${second[0]} are about the same: ${firstText}. ${secondText}.`;
  }
  return `${entries.length} authors are listed. ${firstText}. ${secondText}.`;
}

export function tagSpreadSentence(tagCounts: readonly number[]) {
  const total = tagCounts.length;
  if (total < MIN_SHARE) return null;
  const once = tagCounts.filter((count) => count === 1).length;
  const multi = tagCounts.filter((count) => count >= 2).length;
  if (once + multi !== total) return null;
  const onceText = `${shareText(once, total, "tags")} appear on one guide`;
  const multiText = `${shareText(multi, total, "tags")} appear on two or more guides`;
  if (gapIsSmall(once, multi, total)) {
    return `Tags used once and tags used more than once are about the same: ${onceText}. ${multiText}.`;
  }
  return once > multi ? `${onceText}. ${multiText}.` : `${multiText}. ${onceText}.`;
}

export function busiestDatesSentence(rows: readonly GuideRow[]) {
  const total = rows.length;
  if (total < MIN_SHARE) return null;
  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.date, (counts.get(row.date) ?? 0) + 1);
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]));
  if (entries.length < 2) return null;
  const [first, second] = entries;
  const firstText = `${shareText(first[1], total, "guides")} are dated ${first[0]}`;
  const secondText = `${shareText(second[1], total, "guides")} are dated ${second[0]}`;
  if (gapIsSmall(first[1], second[1], total)) {
    return `${first[0]} and ${second[0]} are about the same: ${firstText}. ${secondText}.`;
  }
  return `${firstText}. ${secondText}.`;
}

function windowsTagSentence(rows: readonly GuideRow[]) {
  const total = rows.length;
  if (total < MIN_SHARE) return null;
  const tagged = rows.filter((row) => row.tags.includes("Windows"));
  const windows = rows.filter((row) => row.windows);
  const same =
    tagged.length === windows.length && tagged.every((row) => windows.some((guide) => guide.slug === row.slug));
  const base = `The Windows tag is on ${shareText(tagged.length, total, "guides")}.`;
  return same ? `${base} That is the same set as the Windows product guides.` : base;
}

function finding(id: string, text: string | null): Finding | null {
  return text ? { id, text } : null;
}

function faq(id: string, question: string, answer: string | undefined): StudyFaq | null {
  return answer ? { id, question, answer } : null;
}

export function guideListTitle(rows: readonly GuideRow[]) {
  const sorted = sortGuides(rows);
  const year = sorted[0]?.date.slice(0, 4);
  return year ? `${sorted.length} Disk Space Guides (${year})` : `${sorted.length} Disk Space Guides`;
}

export function guideListLede(rows: readonly GuideRow[]) {
  const sorted = sortGuides(rows);
  const newest = sorted.slice(0, Math.min(3, sorted.length)).map((row) => row.title);
  const newestClause =
    newest.length === 0
      ? ""
      : newest.length === 1
        ? `The newest is ${newest[0]}.`
        : `The ${newest.length} newest are ${joinAnd(newest)}.`;
  const dateClause = sorted[0] ? `The last guide date is ${sorted[0].date}.` : "";
  return [
    `ScanMyDisk publishes ${sorted.length} disk-space guides, ranked by publish date, newest first.`,
    platformSentence(sorted),
    newestClause,
    dateClause,
  ]
    .filter(Boolean)
    .join(" ");
}

export function guideLists(rows: readonly GuideRow[] = defaultGuides()): PublicList[] {
  const sorted = sortGuides(rows);
  const list = { href: "/blog", count: sorted.length, minimum: MIN_LIST, title: guideListTitle(sorted) };
  return list.count >= list.minimum ? [list] : [];
}

export function guideStudy(rows: readonly GuideRow[] = defaultGuides()): Study {
  const sorted = sortGuides(rows);
  const total = sorted.length;
  const newest = sorted[0]?.date;
  const oldest = sorted[sorted.length - 1]?.date;
  const year = newest?.slice(0, 4);
  const title = year ? `Disk Guide Statistics ${year}: ${total} Analyzed` : `Disk Guide Statistics: ${total} Analyzed`;
  const platform = platformSentence(sorted);
  const years = yearSentence(sorted);
  const authors = authorSentence(sorted);
  const tagCounts = tagTotals(sorted);
  const tags = tagSpreadSentence(tagCounts);
  const dates = busiestDatesSentence(sorted);
  const windowsTag = windowsTagSentence(sorted);
  const span =
    total >= MIN_SHARE && newest && oldest
      ? `The newest guide date is ${newest} and the oldest is ${oldest}.`
      : null;
  const countText = total >= MIN_SHARE ? `ScanMyDisk publishes ${total} public disk-space guides.` : null;
  const findings = [
    finding("guide-count", countText),
    finding("guide-span", span),
    finding("platform-split", platform),
    finding("year-split", years),
    finding("author", authors),
    finding("busiest-dates", dates),
    finding("tag-spread", tags),
    finding("windows-tag", windowsTag),
  ].filter((item): item is Finding => Boolean(item));
  const description = [countText, platform, newest ? `Newest guide date: ${newest}.` : ""].filter(Boolean).join(" ");
  const byPlatform = new Map<string, number>();
  for (const row of sorted) {
    const key = row.windows ? "Windows product guides" : "macOS storage guides";
    byPlatform.set(key, (byPlatform.get(key) ?? 0) + 1);
  }
  const byYear = new Map<string, number>();
  for (const row of sorted) {
    const key = row.date.slice(0, 4);
    byYear.set(key, (byYear.get(key) ?? 0) + 1);
  }
  const tagMap = new Map<string, number>();
  for (const row of sorted) {
    for (const tag of new Set(row.tags)) tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
  }
  const dateMap = new Map<string, number>();
  for (const row of sorted) dateMap.set(row.date, (dateMap.get(row.date) ?? 0) + 1);
  const shareHeader = total >= MIN_SHARE ? `Share of ${total} guides` : "Guides";
  return {
    path: "/research/guides",
    title,
    description,
    summary: platform ?? countText ?? "Guide catalog count.",
    updated: newest,
    findings,
    faqs: [
      faq("faq-guide-count", "How many disk-space guides does ScanMyDisk publish?", countText ?? undefined),
      faq("faq-platform", "How many of the guides are Windows product guides?", platform ?? undefined),
      faq("faq-year", "Which years are the guides from?", years ?? undefined),
      faq("faq-author", "Who is listed as the author?", authors ?? undefined),
      faq("faq-tags", "How many tags appear on only one guide?", tags ?? undefined),
    ].filter((item): item is StudyFaq => Boolean(item)),
    tables: [
      {
        id: "by-platform",
        title: "By platform",
        headers: ["Platform", "Guides", shareHeader],
        rows: [...byPlatform.entries()].map(([name, count]) => [
          name,
          String(count),
          total >= MIN_SHARE ? `${nearestPercent(count, total)}%` : String(count),
        ]),
      },
      {
        id: "by-year",
        title: "By guide date",
        headers: ["Year", "Guides", shareHeader],
        rows: [...byYear.entries()]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([name, count]) => [name, String(count), total >= MIN_SHARE ? `${nearestPercent(count, total)}%` : String(count)]),
      },
      {
        id: "by-date",
        title: "By publish date",
        headers: ["Date", "Guides"],
        rows: [...dateMap.entries()]
          .sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0]))
          .map(([date, count]) => [date, String(count)]),
      },
      {
        id: "by-tag",
        title: "By tag",
        headers: ["Tag", "Guides"],
        rows: [...tagMap.entries()]
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .map(([tag, count]) => [tag, String(count)]),
      },
      {
        id: "guide-roster",
        title: "Guides in rank order",
        headers: ["Guide", "Date", "Kind"],
        rows: sorted.map((row) => [row.title, row.date, row.windows ? "Windows product guide" : "macOS storage guide"]),
      },
    ],
    methodology: [
      "Source: the public guide catalog shipped with this site. Each row is one published guide. This is not a survey and not a sample of disk scans.",
      "Included: every guide in that catalog. Duplicate slugs keep the newer date. Nothing else is added.",
      "Excluded: licence sales, page-view counts, customer accounts, and any gigabyte figure written inside a guide. Those figures are examples, not measurements.",
      "Windows product guides are the guides outside the macOS storage set. The other guides are macOS storage articles. They are not a Mac download.",
      "Rank: publish date, newest first. The same date is ordered by title.",
      `Shares use the nearest whole percent. A gap under ${SAME_POINT_GAP} points is described as about the same. A share is omitted when its denominator is under ${MIN_SHARE}.`,
      "Updated means the newest guide date in the catalog, not the day this page was built.",
    ],
    citation: newest
      ? `ScanMyDisk. ${title}. ${absUrl("/research/guides")}. Data through ${monthYear(newest)}.`
      : `ScanMyDisk. ${title}. ${absUrl("/research/guides")}.`,
    variables: ["guide count", "platform", "guide year", "author", "tag", "publish date"],
    lists: guideLists(sorted),
  };
}

function tagTotals(rows: readonly GuideRow[]) {
  const tagMap = new Map<string, number>();
  for (const row of rows) {
    for (const tag of new Set(row.tags)) tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
  }
  return [...tagMap.values()];
}

export function priceFact() {
  return `${SITE.lifetimePrice} for the first ${SITE.earlyBirdLimit} licenses, then ${SITE.regularPrice}`;
}

export function productStudy(): Study {
  const views = JOIN_VIEWS.map((view) => view.name);
  const tools = JOIN_TOOLKIT.map((item) => item.name);
  const platforms = Object.values(PLATFORMS);
  const platformText = `The catalog lists ${platforms.length} platforms. ${platforms
    .map((platform) => `${platform.name} is ${platform.status === "available" ? "available" : "coming soon"}`)
    .join(". ")}.`;
  const viewText = `The homepage lists ${views.length} disk views: ${joinAnd(views)}.`;
  const toolText = `The homepage toolkit lists ${tools.length} items: ${joinAnd(tools)}.`;
  const priceText = `The catalogue price is ${priceFact()}.`;
  const findings = [
    finding("view-count", viewText),
    finding("toolkit-count", toolText),
    finding("platforms", platformText),
    finding("price", priceText),
  ].filter((item): item is Finding => Boolean(item));
  const year = guideStudy().updated?.slice(0, 4);
  const title = `ScanMyDisk Product Facts${year ? ` ${year}` : ""}: ${views.length} Views`;
  return {
    path: "/research/product",
    title,
    description: `${viewText} ${platformText} ${priceText}`,
    summary: viewText,
    findings,
    faqs: [
      faq("faq-views", "How many disk views does ScanMyDisk list?", viewText),
      faq("faq-platforms", "Which platforms does the catalog mark as available?", platformText),
      faq("faq-price", "What is the ScanMyDisk catalogue price?", priceText),
    ].filter((item): item is StudyFaq => Boolean(item)),
    tables: [
      {
        id: "views",
        title: "Disk views",
        headers: ["#", "View"],
        rows: views.map((name, index) => [String(index + 1), name]),
      },
      {
        id: "toolkit",
        title: "Toolkit items",
        headers: ["#", "Item"],
        rows: tools.map((name, index) => [String(index + 1), name]),
      },
      {
        id: "platforms",
        title: "Platforms",
        headers: ["Platform", "Status"],
        rows: platforms.map((platform) => [platform.name, platform.status === "available" ? "Available" : "Coming soon"]),
      },
    ],
    methodology: [
      "Source: the feature lists and platform flags the homepage, Windows page, and macOS page render. This is a catalog census, not a user study.",
      "Included: each named view, each toolkit item, each platform flag, and the catalogue price fields.",
      "Excluded: cleanup preset names that appear only in prose, sales counts, and anything measured on a customer's disk. Shares are not calculated, because each of these lists has fewer than 20 rows.",
      "The title year is the year of the newest published guide. The feature list has no measurement date, so this page does not give one.",
      "The sentences follow the lists. If a platform flag changes, the sentence changes.",
    ],
    citation: `ScanMyDisk. ${title}. ${absUrl("/research/product")}. Catalog facts, no measurement date.`,
    variables: ["disk view", "toolkit item", "platform status", "catalogue price"],
    lists: [],
  };
}

export function researchStudies() {
  return [guideStudy(), productStudy()];
}

export function studyMarkdown(study: Study) {
  const lines = [study.description, ""];
  lines.push("## Findings", "");
  for (const item of study.findings) {
    lines.push(`<a id="${item.id}"></a>`);
    lines.push("", item.text, "", `[Link to this finding](${absUrl(`${study.path}#${item.id}`)})`, "");
  }
  for (const table of study.tables) {
    lines.push(`## ${table.title}`, "");
    lines.push(`| ${table.headers.join(" | ")} |`);
    lines.push(`| ${table.headers.map(() => "---").join(" | ")} |`);
    for (const row of table.rows) lines.push(`| ${row.join(" | ")} |`);
    lines.push("");
  }
  if (study.lists.length) {
    lines.push("## Lists", "");
    for (const list of study.lists) {
      lines.push(`- [${list.title}](${absUrl(list.href)}) — ${list.count} items`);
    }
    lines.push("");
  }
  lines.push("## Methodology", "");
  for (const step of study.methodology) lines.push(`- ${step}`);
  lines.push("", "## Citation", "", study.citation, "", "## Questions", "");
  for (const item of study.faqs) {
    lines.push(`<a id="${item.id}"></a>`, "", `### ${item.question}`, "", item.answer, "", `[Link to this answer](${absUrl(`${study.path}#${item.id}`)})`, "");
  }
  return lines.join("\n");
}

export function studyJsonLd(study: Study) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: study.title,
        description: study.description,
        url: absUrl(study.path),
        ...(study.updated ? { dateModified: study.updated } : {}),
      },
      {
        "@type": "Dataset",
        name: study.title,
        description: study.description,
        url: absUrl(study.path),
        creator: { "@type": "Organization", name: SITE.brand, url: absUrl("/") },
        ...(study.updated ? { dateModified: study.updated } : {}),
        variableMeasured: study.variables,
        measurementTechnique: study.methodology.join(" "),
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "text/markdown",
          contentUrl: absUrl(`${study.path}.md`),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: study.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
