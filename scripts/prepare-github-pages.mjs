import { cp, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const clientDirectory = path.resolve("build/client");
const basenameDirectory = path.join(clientDirectory, "llm-interactive-course");
const spaFallback = path.join(clientDirectory, "index.html");
const notFoundFallback = path.join(clientDirectory, "404.html");

if (!existsSync(clientDirectory)) {
  throw new Error("Missing build/client. Run the GitHub Pages build first.");
}

if (!existsSync(basenameDirectory)) {
  throw new Error("Missing build/client/llm-interactive-course prerender output.");
}

if (existsSync(spaFallback)) {
  await cp(spaFallback, notFoundFallback);
}

await cp(basenameDirectory, clientDirectory, {
  force: true,
  recursive: true,
});
await rm(basenameDirectory, { force: true, recursive: true });
await writeFile(path.join(clientDirectory, ".nojekyll"), "");
