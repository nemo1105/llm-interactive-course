# LLM Interactive Share

An interactive web presentation for explaining LLM technologies from the ground up.

Start locally:

```bash
pnpm install
pnpm run dev
```

Verification:

```bash
pnpm run verify:iteration
```

`pnpm run test:e2e` and `pnpm run verify:iteration` start Playwright through a small wrapper that allocates an isolated local port, so multiple local agents can run e2e tests without sharing `5173`. To use a fixed port for debugging:

```bash
PLAYWRIGHT_PORT=5173 pnpm run test:e2e
```

To test an already running server without starting another one:

```bash
PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 pnpm run test:e2e
```
