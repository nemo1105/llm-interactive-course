import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const base = isGitHubPages ? "/llm-interactive-course/" : "/";

export default defineConfig({
  base,
  plugins: [...reactRouter(), ...tailwindcss()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
