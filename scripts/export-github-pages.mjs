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

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

for (const entry of await readdir(clientDir, { withFileTypes: true })) {
  await cp(path.join(clientDir, entry.name), path.join(outputDir, entry.name), {
    recursive: true,
  });
}

const assetsDir = path.join(clientDir, "assets");
const assetFiles = await readdir(assetsDir);
const cssFile = assetFiles.find((file) => file.endsWith(".css"));
const jsFiles = assetFiles.filter((file) => file.endsWith(".js"));

if (!cssFile || jsFiles.length === 0) {
  throw new Error("Built client assets are missing required CSS or JS files.");
}

let entryScript = jsFiles[jsFiles.length - 1];
for (const jsFile of jsFiles) {
  const contents = await readFile(path.join(assetsDir, jsFile), "utf8");
  if (contents.includes("hydrateRoot(document") || contents.includes("createRoot(document")) {
    entryScript = jsFile;
    break;
  }
}

const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>RevengineHQ — B2B Outbound System That Fills Your Pipeline</title>
    <meta name="description" content="RevengineHQ builds the B2B outbound system that fills your pipeline with qualified opportunities." />
    <meta property="og:title" content="RevengineHQ — We fill your pipeline. You close." />
    <meta property="og:description" content="B2B outbound system. Cold email, LinkedIn, nurture, handoff — fully managed." />
    <meta property="og:type" content="website" />
    <link rel="canonical" href="https://revenginelabs.info/" />
    <link rel="stylesheet" href="/assets/${cssFile}" />
  </head>
  <body>
    <script type="module" src="/assets/${entryScript}"></script>
  </body>
</html>
`;

const siteFiles = [
  ["index.html", indexHtml],
  ["404.html", indexHtml],
  [".nojekyll", ""],
];

for (const [fileName, contents] of siteFiles) {
  await writeFile(path.join(outputDir, fileName), contents, "utf8");
}

const cnamePath = path.join(rootDir, "CNAME");
if (existsSync(cnamePath)) {
  const cname = await readFile(cnamePath, "utf8");
  await writeFile(path.join(outputDir, "CNAME"), cname, "utf8");
}

// GitHub Pages branch deployments only serve / or /docs — publish the bundle at
// the repository root so custom domains and *.github.io URLs resolve index.html.
const rootAssetsDir = path.join(rootDir, "assets");
await rm(rootAssetsDir, { recursive: true, force: true });

for (const [fileName, contents] of siteFiles) {
  await writeFile(path.join(rootDir, fileName), contents, "utf8");
}

await cp(path.join(outputDir, "assets"), rootAssetsDir, { recursive: true });

console.log("GitHub Pages bundle ready in ./github-pages and repository root");