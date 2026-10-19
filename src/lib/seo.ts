import { FAQS } from "@/data/faq";
import {
  availabilitySentence,
  macOSAvailable,
  operatingSystems,
  PLATFORM_FAQ,
  SITE,
  socialAvailability,
} from "@/data/site";

export const HOME_TITLE = "ScanMyDisk – Visual Disk Space Analyzer for Windows/macOS";

export const HOME_DESCRIPTION = `ScanMyDisk helps you visualize disk usage, find large files, duplicates, caches and cleanup opportunities. ${availabilitySentence()}`;

export const TWITTER_TITLE = "ScanMyDisk – Visual Disk Space Analyzer";

export const TWITTER_DESCRIPTION = `Visualize disk usage, large files, duplicates and caches. ${socialAvailability()}`;

export const OG_IMAGE_ALT = "ScanMyDisk Windows disk analyzer treemap";

export const PRODUCT_DESCRIPTION = macOSAvailable()
  ? "ScanMyDisk is a visual disk space analyzer and storage visualizer. It shows what is using disk space, including large files, duplicates and caches. Available for Windows 10, Windows 11 and macOS."
  : "ScanMyDisk is a visual disk space analyzer and storage visualizer. It shows what is using disk space, including large files, duplicates and caches. Currently available for Windows 10 and Windows 11. A macOS version is coming soon.";

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
  ogDescription,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  published?: string;
  ogTitle?: string;
  ogDescription?: string;
  index?: boolean;
}) {
  const url = absUrl(path);
  const image = ogImage();
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? description;
  const robots = index ? "index, follow" : "noindex, nofollow";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: SITE.brand },
      { name: "robots", content: robots },
      {
        name: "googlebot",
        content: index
          ? "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
          : "noindex, nofollow",
      },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: socialDescription },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE.brand },
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
      { name: "twitter:title", content: type === "article" ? socialTitle : socialTitle },
      { name: "twitter:description", content: socialDescription },
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
        name: SITE.brand,
        alternateName: SITE.name,
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: "Disk space analyzer",
        operatingSystem: operatingSystems(),
        offers: {
          "@type": "Offer",
          price: "5",
          priceCurrency: "USD",
          description: "One-time lifetime licence for $5",
        },
        description: PRODUCT_DESCRIPTION,
        screenshot: ogImage(),
        softwareVersion: "0.1.11",
        featureList: [
          "Disk usage visualization",
          "Storage visualizer",
          "Large file and folder finder",
          "Duplicate detection",
          "Local analysis — files stay on the device",
        ],
        url: absUrl("/"),
      },
      {
        "@type": "Organization",
        name: SITE.brand,
        alternateName: SITE.name,
        url: absUrl("/"),
        logo: absUrl("/icon.png"),
        email: SITE.email,
      },
      {
        "@type": "WebSite",
        name: SITE.brand,
        alternateName: SITE.name,
        url: absUrl("/"),
        description: HOME_DESCRIPTION,
      },
    ],
  };
}

export function faqJsonLd(items: readonly { q: string; a: string }[] = PLATFORM_FAQ) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function legacyFaqJsonLd() {
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
    author: { "@type": "Organization", name: SITE.brand },
    publisher: {
      "@type": "Organization",
      name: SITE.brand,
      logo: { "@type": "ImageObject", url: absUrl("/icon.png") },
    },
    datePublished: post.date,
    dateModified: post.date,
    image: ogImage(),
    mainEntityOfPage: absUrl(`/blog/${post.slug}`),
    url: absUrl(`/blog/${post.slug}`),
  };
}
