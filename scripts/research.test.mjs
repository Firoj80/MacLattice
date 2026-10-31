import assert from "node:assert/strict";
import test from "node:test";
import {
  MIN_LIST,
  authorSentence,
  busiestDatesSentence,
  defaultGuides,
  guideListTitle,
  guideLists,
  guideStudy,
  nearestPercent,
  platformSentence,
  sortGuides,
  tagSpreadSentence,
  yearSentence,
} from "../src/lib/research/study.ts";

function row(partial) {
  return {
    slug: partial.slug,
    title: partial.title ?? partial.slug,
    date: partial.date ?? "2026-01-01",
    author: partial.author ?? "Firoj Alam",
    tags: partial.tags ?? [],
    windows: partial.windows ?? false,
  };
}

test("live guide catalog shares add up and match the headline counts", () => {
  const rows = defaultGuides();
  const study = guideStudy(rows);
  assert.equal(rows.length, 22);
  assert.equal(rows.filter((item) => item.windows).length, 6);
  assert.equal(rows.filter((item) => !item.windows).length, 16);
  assert.equal(nearestPercent(16, 22), 73);
  assert.equal(nearestPercent(6, 22), 27);
  assert.equal(nearestPercent(17, 22), 77);
  assert.equal(nearestPercent(5, 22), 23);
  assert.equal(nearestPercent(30, 47), 64);
  assert.equal(nearestPercent(17, 47), 36);
  const platform = study.tables.find((table) => table.id === "by-platform");
  const year = study.tables.find((table) => table.id === "by-year");
  const tags = study.tables.find((table) => table.id === "by-tag");
  const roster = study.tables.find((table) => table.id === "guide-roster");
  assert.equal(platform.rows.reduce((sum, item) => sum + Number(item[1]), 0), 22);
  assert.equal(year.rows.reduce((sum, item) => sum + Number(item[1]), 0), 22);
  assert.equal(tags.rows.reduce((sum, item) => sum + Number(item[1]), 0), rows.reduce((sum, item) => sum + new Set(item.tags).size, 0));
  assert.equal(roster.rows.length, 22);
  assert.match(study.findings.find((item) => item.id === "platform-split").text, /16 of 22 guides \(73%\).*6 of 22 guides \(27%\)/);
  assert.match(study.findings.find((item) => item.id === "year-split").text, /17 of 22 guides \(77%\).*5 of 22 guides \(23%\)/);
  assert.match(study.findings.find((item) => item.id === "author").text, /22 of 22 guides \(100%\) list Firoj Alam/);
  assert.match(study.findings.find((item) => item.id === "tag-spread").text, /30 of 47 tags \(64%\).*17 of 47 tags \(36%\)/);
  assert.match(study.findings.find((item) => item.id === "busiest-dates").text, /6 of 22 guides \(27%\) are dated 2026-10-15/);
  assert.equal(study.updated, "2026-10-15");
  assert.equal(study.title, "Disk Guide Statistics 2026: 22 Analyzed");
  assert.ok(study.title.length <= 60);
  assert.equal(guideListTitle(rows), "22 Disk Space Guides (2026)");
  assert.ok(guideListTitle(rows).length <= 60);
  const ids = [...study.findings.map((item) => item.id), ...study.faqs.map((item) => item.id)];
  assert.equal(new Set(ids).size, ids.length);
  for (const list of study.lists) assert.ok(list.count >= list.minimum);
  assert.equal(study.lists[0].href, "/blog");
  assert.equal(study.lists[0].count, 22);
  assert.equal(MIN_LIST, 20);
});

test("comparisons flip with the counts and small gaps stay about the same", () => {
  const macHeavy = [
    ...Array.from({ length: 16 }, (_, index) => row({ slug: `m${index}`, windows: false })),
    ...Array.from({ length: 6 }, (_, index) => row({ slug: `w${index}`, windows: true })),
  ];
  const windowsHeavy = [
    ...Array.from({ length: 6 }, (_, index) => row({ slug: `m${index}`, windows: false })),
    ...Array.from({ length: 16 }, (_, index) => row({ slug: `w${index}`, windows: true })),
  ];
  const macText = platformSentence(macHeavy);
  const windowsText = platformSentence(windowsHeavy);
  assert.match(macText, /^16 of 22 guides \(73%\) are macOS storage guides/);
  assert.match(windowsText, /^16 of 22 guides \(73%\) are Windows product guides/);
  assert.notEqual(macText, windowsText);
  const tied = [
    ...Array.from({ length: 11 }, (_, index) => row({ slug: `m${index}`, windows: false, date: "2026-01-01" })),
    ...Array.from({ length: 11 }, (_, index) => row({ slug: `w${index}`, windows: true, date: "2025-01-01" })),
  ];
  assert.match(platformSentence(tied), /about the same/);
  assert.match(yearSentence(tied), /about the same/);
  const authors = [
    ...Array.from({ length: 11 }, (_, index) => row({ slug: `a${index}`, author: "Ada" })),
    ...Array.from({ length: 11 }, (_, index) => row({ slug: `b${index}`, author: "Firoj Alam" })),
  ];
  assert.match(authorSentence(authors), /about the same/);
  const dates = [
    ...Array.from({ length: 11 }, (_, index) => row({ slug: `d${index}`, date: "2026-02-01" })),
    ...Array.from({ length: 11 }, (_, index) => row({ slug: `e${index}`, date: "2026-03-01" })),
  ];
  assert.match(busiestDatesSentence(dates), /about the same/);
});

test("thin guide data produces no share findings", () => {
  const rows = Array.from({ length: 5 }, (_, index) => row({ slug: `t${index}`, windows: index < 2, tags: ["Windows"] }));
  const study = guideStudy(rows);
  assert.equal(study.findings.length, 0);
  assert.equal(study.faqs.length, 0);
  assert.equal(study.lists.length, 0);
  assert.equal(platformSentence(rows), null);
  assert.equal(tagSpreadSentence([1, 1, 1]), null);
  assert.equal(guideLists(rows).length, 0);
});

test("duplicate guide slugs collapse before ranking", () => {
  const rows = [
    row({ slug: "same", title: "Older", date: "2026-01-01" }),
    row({ slug: "same", title: "Newer", date: "2026-05-01" }),
    ...Array.from({ length: 20 }, (_, index) => row({ slug: `x${index}`, date: "2026-04-01" })),
  ];
  const sorted = sortGuides(rows);
  assert.equal(sorted.length, 21);
  assert.equal(sorted[0].title, "Newer");
});

test("tag bands do not overlap", () => {
  const once = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const multi = [2, 2, 3, 4, 5, 6, 7, 8];
  const text = tagSpreadSentence([...once, ...multi]);
  assert.match(text, /12 of 20 tags \(60%\) appear on one guide/);
  assert.match(text, /8 of 20 tags \(40%\) appear on two or more guides/);
});
