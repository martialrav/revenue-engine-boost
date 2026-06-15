import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const clientDir = path.join(distDir, "client");
const outputDir = path.join(rootDir, "github-pages");

if (!existsSync(clientDir)) {
  throw new Error("Build output missing. Run `bun run build` or `bun run build:github-pages` first.");
}

const prerenderedIndex = path.join(clientDir, "index.html");
if (!existsSync(prerenderedIndex)) {
  throw new Error(
    "Prerendered index.html is missing. Enable tanstackStart.prerender in vite.config.ts before exporting.",
  );
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const entry of await readdir(clientDir, { withFileTypes: true })) {
  await cp(path.join(clientDir, entry.name), path.join(outputDir, entry.name), {
    recursive: true,
  });
}

let indexHtml = await readFile(prerenderedIndex, "utf8");
indexHtml = indexHtml.replace(
  /<link rel="canonical" href="[^"]*"\/>/,
  '<link rel="canonical" href="https://revenginelabs.info/" />',
);

await writeFile(path.join(outputDir, "index.html"), indexHtml, "utf8");
await writeFile(path.join(outputDir, "404.html"), indexHtml, "utf8");
await writeFile(path.join(outputDir, ".nojekyll"), "", "utf8");

const cnamePath = path.join(rootDir, "CNAME");
if (existsSync(cnamePath)) {
  const cname = await readFile(cnamePath, "utf8");
  await writeFile(path.join(outputDir, "CNAME"), cname, "utf8");
}

console.log("GitHub Pages bundle ready in ./github-pages");
