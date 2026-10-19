# SEO decisions

Read this before changing titles, index rules, or the Mac guides.

## 2026-10-18 — Whole-site audit

- Stage is early/growth. Inferred from a mid-October 2026 launch, 31 sitemap URLs, and no Search Console data. Not confirmed with traffic.
- Do not noindex the older Mac storage guides. The owner rejected that on 2026-10-17. Correct the product claims inside them instead.
- Do not change the homepage title away from `ScanMyDisk – Visual Disk Space Analyzer for Windows/macOS`. The owner set that title on 2026-10-17. It does conflict with the body and with schema (`operatingSystem` is Windows only, macOS is coming soon). Leave it until the owner asks.
- Canonical host stays `https://www.scanmydisk.com` because the apex URL 308-redirects there.
- Do not disavow links. No backlink export and no manual action were available.
- Do not polish titles again until Search Console has a baseline. Next work is factual fixes on the Mac guides, then Windows how-to coverage.

## 2026-10-19 — Search Console baseline

- Last 28 days through 17 October: 7 clicks, 172 impressions. Indexing snapshot on 12 October: 19 indexed, 19 discovered-not-indexed, 6 redirects, 1 proper canonical. Not a penalty.
- Pages closest to page 1 were the older Mac guides. Windows guides had more impressions and weaker positions.

## 2026-10-19 — Mac guide claims corrected

Changed product sentences in the old Mac guides only. They now say $5, Windows today, no free tier, macOS coming soon. Titles, URLs, and Mac folder instructions were left as they were. Do not edit the product claims in these posts again before 2026-11-16.

The owner set every byline to Firoj Alam on 2026-10-19. Do not change it back to "Scan My Disk team".

## Open flags

- Search Console is connected. The owner submitted the sitemap about 13 October 2026.
- `/buy` is disallowed in robots.txt and 302s to Dodo. If Google already stored an old checkout URL, it cannot see a noindex tag while crawling is blocked.
- Another project, github.com/belov-sergei/scan-my-disk, uses the same product name. Microsoft ScanDisk is a different old utility.
