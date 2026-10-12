import { generateKeyPairSync } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
const folder = ".local-license";
mkdirSync(folder, { recursive: true });
if (existsSync(`${folder}/private.pem`)) throw new Error("Existing signing key preserved.");
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 3072,
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
});
writeFileSync(`${folder}/private.pem`, privateKey, { mode: 0o600 });
writeFileSync(`${folder}/public.pem`, publicKey);
console.log("Created local signing key files. Private key was not printed.");
