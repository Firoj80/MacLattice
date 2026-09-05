import { SITE } from "@/data/site";
import { FAQS } from "@/data/faq";

export const KEYWORDS =
  "mac storage analyzer,mac disk space visualizer,clean xcode derived data,shrink docker.raw mac,delete node_modules recursively,android studio cache cleaner,mac system data cleaner,remove app leftovers mac,treemap mac,disk usage map,DaisyDisk alternative,macOS sequential read speed,visualize large files,MacLattice";

export const HOME_TITLE = "MacLattice - Free Mac Storage Analyzer | See What's Taking Up Space";

export const HOME_DESCRIPTION =
  "MacLattice is a free Mac storage analyzer that shows exactly what's taking up space on your Mac. Visualize disk usage with an interactive treemap. Download free for macOS Sonoma, Sequoia & Apple Silicon.";

export const TWITTER_TITLE = "MacLattice - Free Mac Storage Analyzer";

export const TWITTER_DESCRIPTION =
  "See exactly what's taking up space on your Mac. Free storage analyzer with interactive treemap visualization.";

export const OG_IMAGE_ALT = "MacLattice - Mac Storage Analyzer Interface";

export function absUrl(path = "/") {
  if (path.startsWith("http")) return path;
  const base = SITE.origin.replace(/\/$/, "");
  if (path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function ogImage() {
  return absUrl("/app-screenshot.webp");
}

export function pageHead({
  title,
  description,
  path,
  type = "website",
  published,
  ogTitle,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  published?: string;
  ogTitle?: string;
}) {
  const url = absUrl(path);
  const image = ogImage();
  const socialTitle = ogTitle ?? title;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: SITE.name },
      { name: "keywords", content: KEYWORDS },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "800" },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { property: "og:type", content: type },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: type === "article" ? socialTitle : TWITTER_TITLE },
      { name: "twitter:description", content: type === "article" ? description : TWITTER_DESCRIPTION },
      { name: "twitter:image", content: image },
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
        operatingSystem: "macOS",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free download with optional Pro upgrade for $12.99",
        },
        description:
          "MacLattice is a free Mac storage analyzer that shows exactly what's taking up space on your Mac with an interactive treemap visualization.",
        screenshot: ogImage(),
        softwareVersion: "1.0",
        downloadUrl: SITE.siliconDmg,
        featureList: [
          "Interactive treemap visualization",
          "Fast full-disk scanning",
          "Privacy-focused (100% local)",
          "Apple Silicon optimized",
          "macOS Sonoma and Sequoia support",
        ],
        url: absUrl("/"),
      },
      {
        "@type": "Organization",
        name: SITE.name,
        url: absUrl("/"),
        logo: absUrl("/icon.png"),
        email: SITE.email,
        sameAs: [SITE.reddit],
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
