import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { posts } from "../src/data/blog.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

const BASE_URL = "https://www.scanmydisk.com";

const staticRoutes = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/blog", priority: 0.9, changefreq: "weekly" },
  { path: "/contact", priority: 0.4, changefreq: "yearly" },
  { path: "/privacy", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
  { path: "/refund-policy", priority: 0.3, changefreq: "yearly" },
  { path: "/pricing", priority: 0.9, changefreq: "monthly" },
];

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add static routes
  for (const route of staticRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route.path === "/" ? "" : route.path}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority.toFixed(1)}</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const post of posts) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${post.date}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf-8");
  console.log("✅ Sitemap generated successfully at public/sitemap.xml");
}

generateSitemap();
