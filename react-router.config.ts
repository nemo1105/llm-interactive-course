import type { Config } from "@react-router/dev/config";

import { getStaticRoutePaths } from "./app/lib/static-routes";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basename = isGitHubPages ? "/llm-interactive-course/" : "/";

export default {
  appDirectory: "app",
  ssr: false,
  basename,
  prerender: getStaticRoutePaths(),
} satisfies Config;
