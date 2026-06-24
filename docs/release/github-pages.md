---
status: accepted
owner: human
last_reviewed: 2026-06-24
upstream_docs:
  - launch-plan.md
  - ../quality/release-readiness.md
next_action: GitHub Pages 首次部署完成后，记录实际访问 URL 和人工走查结论。
---

# GitHub Pages 发布运行说明

## 发布方式

当前静态发布目标是 GitHub Pages。仓库远端为 `nemo1105/llm-interactive-course`，因此公开访问路径使用仓库子路径 `/llm-interactive-course/`。

发布流水线由 `.github/workflows/pages.yml` 执行：

- `push` 到 `main` 或手动触发 `workflow_dispatch` 时启动。
- 先安装依赖和 Playwright Chromium，再运行 `pnpm run verify:iteration`。
- 通过后运行 `pnpm run build:github-pages` 生成静态产物。
- 将 `build/client` 上传为 GitHub Pages artifact，并部署到 Pages 环境。

GitHub 仓库设置中，Pages source 应选择 GitHub Actions。

## 构建约定

本地普通构建和开发仍使用根路径 `/`。只有 `GITHUB_PAGES=true` 时，React Router 的 `basename` 和 Vite 的 `base` 才切换为 `/llm-interactive-course/`。

`pnpm run build:github-pages` 会生成可直接上传到 GitHub Pages 的 `build/client`：

- 章节首页和演示页会被预渲染为静态 HTML。
- 静态资源引用带有 `/llm-interactive-course/` 前缀，匹配 Pages 的访问路径。
- `404.html` 作为刷新深层路由时的 SPA fallback。
- `.nojekyll` 用于避免 GitHub Pages 对下划线路径做 Jekyll 处理。

## 本地开发行为

本地开发不需要也不应该带 GitHub Pages 子路径。开发命令仍是：

```sh
pnpm run dev
```

本地访问地址仍从根路径进入，例如：

- `/`
- `/chapters/01`
- `/chapters/02/demos/history-replay`

这让日常开发、Playwright 测试和课程路由保持简单。只有发布构建会带上仓库子路径。

## 首次部署检查

首次启用 Pages 后，应人工检查：

- GitHub Actions 的 Pages workflow 成功完成。
- Pages 公开 URL 可以访问首页。
- 刷新 `/llm-interactive-course/chapters/01` 和任意演示深层路由不会 404。
- 章节 03 及以后仍按当前状态展示“未审校”，首页演示入口不可点击。
- 浏览器控制台没有资源路径 404。
