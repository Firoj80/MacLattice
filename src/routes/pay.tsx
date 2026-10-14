import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pay")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "pricing", statusCode: 301, replace: true });
  },
});
