import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/download")({ server: { handlers: { GET: () => {
 const url = process.env.LICENSE_INSTALLER_URL?.trim() || "https://github.com/Firoj80/MacLattice/releases/download/windows-v0.1.13/ScanMyDisk-Setup-x64.exe";
 if (!url || !url.startsWith("https://github.com/Firoj80/MacLattice/releases/download/")) return new Response("Download is temporarily unavailable. Please try again shortly.", { status: 503 });
 return new Response(null, { status: 302, headers: { Location: url, "Cache-Control": "no-store" } });
} } } });
