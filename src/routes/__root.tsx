import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/seo";
import appCss from "../styles.css?url";
import { WebsiteAnalytics } from "@/components/website-analytics";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: HOME_TITLE },
      { name: "theme-color", content: "#000000" },
      { name: "description", content: HOME_DESCRIPTION },
      { name: "author", content: "Scan My Disk" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png", sizes: "64x64" },
      { rel: "icon", type: "image/png", href: "/favicon-32.png", sizes: "32x32" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", href: "/icon.png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/apple-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;600;700&family=Inter:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(){var k="smd-chunk-reload";window.addEventListener("vite:preloadError",function(e){e.preventDefault();try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,"1")}catch(err){}location.reload()})})();`,
      },
    ],
  }),
  component: () => (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg font-sans text-fg antialiased">
        <Outlet />
        <WebsiteAnalytics />
        <Scripts />
      </body>
    </html>
  ),
});
