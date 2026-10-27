import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = fileURLToPath(new URL(`../src/${specifier.slice(2)}`, import.meta.url));
    const file = existsSync(base) ? base : `${base}.ts`;
    return nextResolve(pathToFileURL(file).href, context);
  }
  return nextResolve(specifier, context);
}
