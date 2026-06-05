import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const clientDir = path.join(distDir, "client");
const serverEntryPath = path.join(distDir, "server", "index.mjs");
const outputDir = path.join(rootDir, "github-pages");

if (!existsSync(clientDir) || !existsSync(serverEntryPath)) {
  throw new Error("Build output missing. Run `bun run build` or `bun run build:github-pages` first.");
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const entry of await readdir(clientDir, { withFileTypes: true })) {
  await cp(path.join(clientDir, entry.name), path.join(outputDir, entry.name), {
    recursive: true,
  });
}

const serverModule = await import(pathToFileURL(serverEntryPath).href);
const serverEntry = serverModule.default ?? serverModule;

const response = await serverEntry.fetch(
  new Request("https://revenginelabs.info/"),
  {},
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`Failed to render homepage HTML: ${response.status} ${response.statusText}`);
}

let indexHtml = await response.text();
indexHtml = indexHtml
  .replaceAll('href="/client/', 'href="/')
  .replaceAll("href='/client/", "href='/")
  .replaceAll('src="/client/', 'src="/')
  .replaceAll("src='/client/", "src='/");

await writeFile(path.join(outputDir, "index.html"), indexHtml, "utf8");
await writeFile(path.join(outputDir, "404.html"), indexHtml, "utf8");
await writeFile(path.join(outputDir, ".nojekyll"), "", "utf8");

const cnamePath = path.join(rootDir, "CNAME");
if (existsSync(cnamePath)) {
  const cname = await readFile(cnamePath, "utf8");
  await writeFile(path.join(outputDir, "CNAME"), cname, "utf8");
}

console.log("GitHub Pages bundle ready in ./github-pages");