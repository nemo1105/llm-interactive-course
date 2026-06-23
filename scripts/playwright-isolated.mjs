import { spawn } from "node:child_process";
import { createServer } from "node:net";

const host = "127.0.0.1";

async function findAvailablePort() {
  const server = createServer();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, host, resolve);
  });

  const address = server.address();

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  if (!address || typeof address === "string") {
    throw new Error("Unable to allocate a local Playwright port.");
  }

  return address.port;
}

const env = { ...process.env };

if (!env.PLAYWRIGHT_BASE_URL && !env.PLAYWRIGHT_PORT) {
  env.PLAYWRIGHT_PORT = String(await findAvailablePort());
}

const child = spawn(
  "pnpm",
  ["exec", "playwright", "test", ...process.argv.slice(2)],
  {
    env,
    stdio: "inherit",
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
