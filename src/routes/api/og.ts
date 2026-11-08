import { createFileRoute } from "@tanstack/react-router";
import { getPost } from "@/data/blog";
import { blogSeoTitle } from "@/data/blog-seo";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine = 38): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 3); // Max 3 lines
}

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");
        const titleParam = url.searchParams.get("title");

        let displayTitle = "ScanMyDisk — Visual Disk Space Analyzer";
        let displayKicker = "Windows 10 & 11 • 8 Visual Maps • $5 Lifetime";

        if (slug) {
          const post = getPost(slug);
          if (post) {
            displayTitle = blogSeoTitle(post.slug, post.title);
            displayKicker = post.tags.slice(0, 3).join(" • ") || "Windows Storage Guide";
          }
        } else if (titleParam) {
          displayTitle = titleParam;
        }

        const lines = wrapText(displayTitle, 36);
        const lineHeight = 64;
        const startY = lines.length === 1 ? 280 : lines.length === 2 ? 250 : 220;

        const titleTspans = lines
          .map(
            (line, index) =>
              `<tspan x="80" y="${startY + index * lineHeight}">${escapeXml(line)}</tspan>`
          )
          .join("");

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e17" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <linearGradient id="borderGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(56, 189, 248, 0.4)" />
      <stop offset="100%" stop-color="rgba(129, 140, 248, 0.1)" />
    </linearGradient>
    <radialGradient id="ambient" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="rgba(56, 189, 248, 0.18)" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#ambient)" />

  <!-- Outer Glass Frame -->
  <rect x="32" y="32" width="1136" height="566" rx="24" fill="none" stroke="url(#borderGlow)" stroke-width="2" />

  <!-- Brand / Kicker Header -->
  <g transform="translate(80, 100)">
    <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#brand)" />
    <text x="14" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="#0f172a">S</text>
    <text x="56" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" fill="#f8fafc">ScanMyDisk</text>
    <text x="210" y="27" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" fill="#38bdf8" letter-spacing="1.5">/ ${escapeXml(displayKicker.toUpperCase())}</text>
  </g>

  <!-- Title Text -->
  <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
    ${titleTspans}
  </text>

  <!-- Bottom Badges / Value Props -->
  <g transform="translate(80, 500)">
    <!-- Badge 1: 8 Visual Maps -->
    <rect x="0" y="0" width="180" height="42" rx="12" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
    <text x="20" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#e2e8f0">8 Visual Maps</text>

    <!-- Badge 2: 3-Pass Duplicates -->
    <rect x="196" y="0" width="220" height="42" rx="12" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1" />
    <text x="216" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#e2e8f0">3-Pass Duplicate Hash</text>

    <!-- Badge 3: Price -->
    <rect x="432" y="0" width="160" height="42" rx="12" fill="rgba(56, 189, 248, 0.12)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
    <text x="452" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#38bdf8">$5 Lifetime</text>

    <!-- Right Side Domain -->
    <text x="1040" y="28" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#94a3b8">scanmydisk.com</text>
  </g>
</svg>`;

        return new Response(svg, {
          status: 200,
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
