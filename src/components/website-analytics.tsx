import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

let clientPromise: Promise<Awaited<ReturnType<typeof import("datafast").initDataFast>>> | undefined;
let lastPath: string | undefined;

export function WebsiteAnalytics() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    // Keep previews out of production analytics; initialize only in the browser.
    if (!['scanmydisk.com', 'www.scanmydisk.com'].includes(window.location.hostname)) return;
    let cancelled = false;
    clientPromise ??= import("datafast").then(({ initDataFast }) => initDataFast({
      websiteId: "dfid_JjIOQMyebuP5FTXMMJieU",
      domain: "www.scanmydisk.com",
      autoCapturePageviews: false,
    }));
    void clientPromise.then(async (client) => {
      if (cancelled || lastPath === pathname) return;
      lastPath = pathname;
      // Checkout query strings contain order identifiers; never track full URLs.
      await client.trackPageview(pathname);
    }).catch(() => {
      // Analytics failures must not interrupt checkout or the website.
      clientPromise = undefined;
      lastPath = undefined;
    });
    return () => { cancelled = true; };
  }, [pathname]);

  return null;
}
