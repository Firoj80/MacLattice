import { readFileSync, writeFileSync, statSync, existsSync } from "node:fs";
import { createHash, createPrivateKey, sign } from "node:crypto";
import { resolve } from "node:path";

const [version, installer, pemPath, notes = "Improvements to Scan My Disk. Saved scans and licenses are retained.", releaseNotesPath] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+$/.test(version ?? "") || !installer || !pemPath) throw new Error("Usage: node scripts/publish-update-manifest.mjs VERSION INSTALLER PRIVATE_PEM_PATH");
const bytes = readFileSync(installer);
const key = createPrivateKey(readFileSync(pemPath));
const release = { version, url: `https://github.com/Firoj80/MacLattice/releases/download/windows-v${version}/ScanMyDisk-Setup-x64.exe`, sha256: createHash("sha256").update(bytes).digest("hex"), size: statSync(installer).size, notes, audience: "ScanMyDisk.Windows.Update" };
const detailsPath = releaseNotesPath ?? (existsSync(resolve(`docs/releases/windows-${version}.json`)) ? resolve(`docs/releases/windows-${version}.json`) : undefined);
if (detailsPath) {
  const details = JSON.parse(readFileSync(detailsPath, "utf8"));
  if (details.Version !== version || !/^\d{4}-\d{2}-\d{2}$/.test(details.ReleasedAt ?? "") || Number.isNaN(Date.parse(details.ReleasedAt)) || new Date(details.ReleasedAt).toISOString().slice(0, 10) !== details.ReleasedAt || ![details.Added, details.Improved, details.Fixed].every(section => Array.isArray(section) && section.length <= 40 && section.every(line => typeof line === "string" && line.trim() && line.length <= 1500)) || (details.Summary !== undefined && (typeof details.Summary !== "string" || details.Summary.length > 1500))) throw new Error("Release notes must match the version, include a valid release date, and contain bounded Added/Improved/Fixed arrays.");
  release.releaseNotes = { Version: details.Version, ReleasedAt: details.ReleasedAt, Added: details.Added, Improved: details.Improved, Fixed: details.Fixed, Summary: details.Summary ?? "" };
}
const payload = Buffer.from(JSON.stringify(release)).toString("base64");
const signature = sign("RSA-SHA256", Buffer.from(payload, "ascii"), key).toString("base64");
const envelope = JSON.stringify({ payload, signature });
if (envelope.length > 32768) throw new Error("Signed update manifest exceeds the Windows updater limit.");
writeFileSync(resolve("public/update.json"), envelope + "\n");
console.log(`Signed update manifest for ${version}; installer ${release.size} bytes.`);
