import { SITE } from "@/data/site";
import { FAQS } from "@/data/faq";

export const HOME_TITLE = "Scan My Disk — See what's taking up space | $5 lifetime";

export const HOME_DESCRIPTION =
  "Scan My Disk is a Windows disk analyzer that shows exactly what's taking up space. Eight views, duplicate detection, saved scan comparison, and cleanup presets. $5 lifetime.";

export const TWITTER_TITLE = "Scan My Disk — Windows disk analyzer";

export const TWITTER_DESCRIPTION =
  "See exactly what's taking up space on your PC. $5 lifetime. No subscription.";

export const OG_IMAGE_ALT = "Scan My Disk for Windows showing a real Windows system-folder scan in its disk usage treemap";

export function absUrl(path = "/") {
  if (path.startsWith("http")) return path;
  const base = SITE.origin.replace(/\/$/, "");
  if (path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function ogImage() {
  // New path on purpose. X caches the old /og.jpg DissectMac card forever
  // because that file is served with Cache-Control: immutable.
  return absUrl("/x-share-v3.jpg");
}

export function pageHead({
  title,
  description,
  path,
  type = "website",
  published,
  ogTitle,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  published?: string;
  ogTitle?: string;
  index?: boolean;
}) {
  const url = absUrl(path);
  const image = ogImage();
  const socialTitle = ogTitle ?? title;
  const robots = index ? "index, follow" : "noindex, nofollow";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: SITE.name },
      { name: "robots", content: robots },
      {
        name: "googlebot",
        content: index
          ? "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
          : "noindex, nofollow",
      },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: image },
      { property: "og:image:secure_url", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { property: "og:type", content: type },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@scanmydisk" },
      { name: "twitter:creator", content: "@scanmydisk" },
      { name: "twitter:domain", content: "scanmydisk.com" },
      { name: "twitter:url", content: url },
      { name: "twitter:title", content: type === "article" ? socialTitle : TWITTER_TITLE },
      { name: "twitter:description", content: type === "article" ? description : TWITTER_DESCRIPTION },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
      ...(published ? [{ property: "article:published_time", content: published }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function softwareJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: SITE.name,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Windows",
        offers: {
          "@type": "Offer",
          price: "5",
          priceCurrency: "USD",
          description: "One-time lifetime licence for $5",
        },
        description:
          "Scan My Disk is a Windows disk analyzer that shows exactly what's taking up space, with interactive visualisations.",
        screenshot: ogImage(),
        softwareVersion: "0.1.7",
        featureList: [
          "Interactive treemap visualization",
          "Fast disk scanning",
          "Privacy-focused (100% local)",
          "Windows app",
        ],
        url: absUrl("/"),
      },
      {
        "@type": "Organization",
        name: SITE.name,
        url: absUrl("/"),
        logo: absUrl("/icon.png"),
        email: SITE.email,
      },
      {
        "@type": "WebSite",
        name: SITE.name,
        url: absUrl("/"),
        description: HOME_DESCRIPTION,
      },
    ],
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: absUrl("/icon.png") },
    },
    datePublished: post.date,
    dateModified: post.date,
    image: ogImage(),
    mainEntityOfPage: absUrl(`/blog/${post.slug}`),
    url: absUrl(`/blog/${post.slug}`),
  };
}
