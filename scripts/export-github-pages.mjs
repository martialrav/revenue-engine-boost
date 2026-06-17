import { cp, mkdir, readdir, readFile, rm, writeFile, stat } from "node:fs/promises";
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

// Build a static SPA shell index.html from the built client assets.
const assetsDir = path.join(clientDir, "assets");
const assetFiles = existsSync(assetsDir) ? await readdir(assetsDir) : [];
const jsEntries = assetFiles.filter((f) => f.startsWith("index-") && f.endsWith(".js"));
const cssEntries = assetFiles.filter((f) => f.endsWith(".css"));

// Pick the largest JS file as the entry (TanStack Start emits two index-*.js;
// the entry is the larger one that imports the chunked one).
let entryJs = jsEntries[0];
let entrySize = 0;
for (const f of jsEntries) {
  const s = await stat(path.join(assetsDir, f));
  if (s.size > entrySize) {
    entrySize = s.size;
    entryJs = f;
  }
}

const cssLinks = cssEntries.map((f) => `    <link rel="stylesheet" href="/assets/${f}" />`).join("\n");
const moduleLinks = jsEntries
  .filter((f) => f !== entryJs)
  .map((f) => `    <link rel="modulepreload" href="/assets/${f}" />`)
  .join("\n");

const routerBootstrap = JSON.stringify({
  manifest: {
    routes: {
      __root__: {
        preloads: [`/assets/${entryJs}`],
        scripts: [{ attrs: { type: "module", async: true, src: `/assets/${entryJs}` } }],
      },
      "/": {
        preloads: jsEntries.filter((f) => f !== entryJs).map((f) => `/assets/${f}`),
      },
    },
  },
  matches: [
    { i: "__root__\0", u: Date.now(), s: "success", ssr: true },
    { i: "\0\0", u: Date.now(), s: "success", ssr: true },
  ],
  lastMatchId: "\0\0",
}).replace(/</g, "\\u003c");

const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RevengineHQ — B2B Outbound System That Fills Your Pipeline</title>
    <meta name="description" content="We build the cold email and outbound system that puts your offer in front of decision makers — consistently. From $200/mo, live in 14 days." />
    <meta property="og:title" content="RevengineHQ — We fill your pipeline. You close." />
    <meta property="og:description" content="B2B outbound system. Cold email, LinkedIn, nurture, handoff — fully managed. From $200/mo, live in 14 days." />
    <meta property="og:type" content="website" />
    <link rel="canonical" href="https://revenginelabs.info/" />
${cssLinks}
${moduleLinks}
  </head>
  <body>
    <script>
      (self.$R = self.$R || {}).tsr = [];
      self.$_TSR = {
        h() { this.hydrated = true; this.c(); },
        e() { this.streamEnded = true; this.c(); },
        c() {
          if (this.hydrated && this.streamEnded) {
            const cleanup = () => {
              if (self.$_TSR?.hydrated && self.$_TSR?.streamEnded) {
                delete self.$_TSR;
                delete self.$R.tsr;
              }
            };
            document.readyState === "loading"
              ? document.addEventListener("DOMContentLoaded", cleanup, { once: true })
              : cleanup();
          }
        },
        p(script) { this.initialized ? script() : this.buffer.push(script); },
        buffer: [],
      };
      self.$_TSR.router = ${routerBootstrap};
      self.$_TSR.e();
    </script>
    <script type="module" src="/assets/${entryJs}"></script>
  </body>
</html>
`;

await writeFile(path.join(outputDir, "index.html"), indexHtml, "utf8");
await writeFile(path.join(outputDir, "404.html"), indexHtml, "utf8");
await writeFile(path.join(outputDir, ".nojekyll"), "", "utf8");

const cnamePath = path.join(rootDir, "CNAME");
if (existsSync(cnamePath)) {
  const cname = await readFile(cnamePath, "utf8");
  await writeFile(path.join(outputDir, "CNAME"), cname, "utf8");
}

console.log("GitHub Pages bundle ready in ./github-pages");
