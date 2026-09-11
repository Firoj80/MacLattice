import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BUY_HREF } from "@/lib/buy";

export const Route = createFileRoute("/signup")({
  component: function SignupToBuy() {
    useEffect(() => {
      window.location.replace(BUY_HREF);
    }, []);
    return <p className="px-6 py-24 text-center text-muted">Redirecting to checkout…</p>;
  },
});
