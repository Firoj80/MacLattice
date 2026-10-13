import { readFileSync, writeFileSync, statSync } from "node:fs";
import { createHash, createPrivateKey, sign } from "node:crypto";
import { resolve } from "node:path";

const [version, installer, pemPath] = process.argv.slice(2);
if (!/^\d+\.\d+\.\d+$/.test(version ?? "") || !installer || !pemPath) throw new Error("Usage: node scripts/publish-update-manifest.mjs VERSION INSTALLER PRIVATE_PEM_PATH");
const bytes = readFileSync(installer);
const key = createPrivateKey(readFileSync(pemPath));
const release = { version, url: `https://github.com/Firoj80/MacLattice/releases/download/windows-v${version}/ScanMyDisk-Setup-x64.exe`, sha256: createHash("sha256").update(bytes).digest("hex"), size: statSync(installer).size, notes: "In-app update downloads and secure customer portal access. Saved scans and licenses are retained.", audience: "ScanMyDisk.Windows.Update" };
const payload = Buffer.from(JSON.stringify(release)).toString("base64");
const signature = sign("RSA-SHA256", Buffer.from(payload, "ascii"), key).toString("base64");
writeFileSync(resolve("public/update.json"), JSON.stringify({ payload, signature }) + "\n");
console.log(`Signed update manifest for ${version}; installer ${release.size} bytes.`);
