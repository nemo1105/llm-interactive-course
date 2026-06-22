import { existsSync, readFileSync } from "node:fs";

const requiredFiles = ["AGENTS.md", "docs/context/index.md"];
const requiredText = [
  "LLM Interactive Share",
  "未经确认的演讲内容不得写入页面",
  "凡技能文档中已经定义的通用流程规范、阶段路由、交付约束或方法论说明，项目侧文档均不应重复描述。",
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    failures.push(`Missing required documentation file: ${file}`);
  }
}

if (existsSync("AGENTS.md")) {
  const guide = readFileSync("AGENTS.md", "utf8");

  for (const text of requiredText) {
    if (!guide.includes(text)) {
      failures.push(`AGENTS.md does not contain required text: ${text}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Documentation checks passed.");
