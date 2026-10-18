import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { generateKeyPairSync, verify } from "node:crypto";
import { spawnSync } from "node:child_process";

test("publisher signs structured release notes and rejects invalid version/date/content", () => {
  const root = mkdtempSync(join(tmpdir(), "scanmydisk-notes-"));
  mkdirSync(join(root, "public"));
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  writeFileSync(join(root, "fixture.pem"), privateKey.export({ type: "pkcs8", format: "pem" }));
  writeFileSync(join(root, "fixture.exe"), "disposable fixture");
  const details = { Version: "0.1.10", ReleasedAt: "2026-10-18", Added: ["Startup update checks"], Improved: ["Background downloads"], Fixed: ["Stream deadline"] };
  const script = resolve("scripts/publish-update-manifest.mjs");
  const run = value => {
    writeFileSync(join(root, "notes.json"), JSON.stringify(value));
    return spawnSync(process.execPath, [script, "0.1.10", join(root, "fixture.exe"), join(root, "fixture.pem"), "Fixture summary", join(root, "notes.json")], { cwd: root, encoding: "utf8" });
  };
  assert.equal(run(details).status, 0);
  const envelope = JSON.parse(readFileSync(join(root, "public/update.json"), "utf8"));
  assert.ok(verify("RSA-SHA256", Buffer.from(envelope.payload, "ascii"), publicKey, Buffer.from(envelope.signature, "base64")));
  const signed = JSON.parse(Buffer.from(envelope.payload, "base64"));
  assert.deepEqual(signed.releaseNotes.Added, details.Added);
  assert.equal(signed.releaseNotes.ReleasedAt, details.ReleasedAt);
  assert.notEqual(run({ ...details, Version: "9.0.0" }).status, 0);
  assert.notEqual(run({ ...details, ReleasedAt: null }).status, 0);
  assert.notEqual(run({ ...details, ReleasedAt: "2026-02-30" }).status, 0);
  assert.notEqual(run({ ...details, Added: [""] }).status, 0);
  assert.equal(JSON.parse(readFileSync(join(root, "public/update.json"), "utf8")).payload, envelope.payload);
});
