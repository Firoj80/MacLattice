import { useEffect } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function WebsiteAnalytics() {
  const { user, isPending } = useCurrentUserState();

  useEffect(() => {
    if (isPending || !user || user.isDevFallback) return;
    window.minilytics?.("identify", {
      user_id: user.id,
      email: user.primaryEmail ?? undefined,
      name: user.displayName ?? undefined,
    });
  }, [user, isPending]);

  return null;
}
