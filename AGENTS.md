# LLM Interactive Share Repository Guide

## Purpose

This repository is for an interactive HTML web presentation that explains LLM technologies through animated, explorable scenes.

The product goal is to start from the simplest possible conversation with a large language model and progressively reveal what happens underneath: request construction, messages, tokens, model reasoning, context, prompts, context engineering, tool use, MCP, RAG, skills, memory, evaluation, and agent workflows.

The first audience is a mixed technical audience: people with basic AI or programming concepts who may not have built an LLM system before. The experience should be precise enough for engineers, but visual and concrete enough for non-specialists to follow.

The page must remain an empty demo framework until presentation content is explicitly confirmed.

## Working Model

This repository uses Harness Engineering. Durable intent, plans, design choices, evals, release rules, and retrospective outcomes should live in repository documents instead of relying on chat memory alone.

The frontend follows the local web standard: React 19, React Router framework mode, Vite, TypeScript, Tailwind CSS v4, shadcn/ui-style primitives, TanStack React Query when remote state is introduced, Zustand for browser-local interactive state, Vitest, and Playwright.

## Lifecycle Stages

1. Repository context
   - Maintain repository maps, glossary, ownership, and working agreements.
2. Product intent
   - Define the teaching goal, audience, scope, success criteria, and open questions.
3. System design
   - Turn approved intent into animation architecture, route structure, interaction contracts, risks, and decision records.
4. Execution planning
   - Define milestones, chapter sequencing, acceptance criteria, and test strategy.
5. Quality and evals
   - Define presentation walkthrough checks, accessibility expectations, visual regression areas, and release readiness.
6. Release and feedback
   - Prepare share delivery, rollback or fallback expectations, notes, and feedback capture.
7. Retrospectives and improvements
   - Compare the delivered presentation to the plan, capture lessons, and feed durable improvements back into this repository.

## Required Documents

- Repository context: `docs/context/`
- Product intent: `docs/product/`
- Architecture: `docs/architecture/`
- Delivery planning: `docs/delivery/`
- Quality and evals: `docs/quality/`
- Release: `docs/release/`
- Retrospectives: `docs/retrospectives/`

## Gate Rules

- Do not start downstream stage work until the required upstream documents exist and are explicitly reviewed, approved, or otherwise accepted according to this repository's policy.
- When product intent changes, re-review affected architecture, delivery, quality, and release documents before implementing dependent work.
- When architecture or interaction contracts change, re-review affected delivery, quality, and release documents before claiming downstream work is current.
- Keep document metadata current when a lifecycle document is added: `status`, `owner`, `last_reviewed`, `upstream_docs`, and `next_action`.
- Use progressive disclosure for managed doc trees: keep parent indexes current and move detailed chapter contracts, animation specs, or content scripts into managed child docs when summary docs become too large or too mixed.
- Write behavior-shaping design rules, long-lived exceptions, and standing constraints into canonical docs instead of leaving them in chat or implementation folklore.
- Do not add extra compatibility logic or legacy fallback paths by default. When compatibility is necessary, state what problem it solves, what fails or degrades without it, and wait for explicit human confirmation before implementing that path.
- When implementation reveals insufficient prerequisites, surface the gap before proceeding: state what additional input, contract, data, environment, or decision would improve the work, and what risk remains if it is not supplied.
- Treat testing as a cross-cutting gate: cover success paths, failure paths, and boundary or exception paths as broadly as practical. If a path cannot be automated, record the reason, residual risk, and compensating manual, monitoring, or follow-up verification.
- Refresh this guide when workflow rules, document locations, project goals, or operating practices change.

## How to Work in This Repo

- After presentation content is confirmed, build the actual interactive teaching experience as the first screen. Do not create a marketing landing page for this project.
- 未经确认的演讲内容不得写入页面。任何章节标题、讲解文案、示例、概念分层、流程节点、动画脚本、演示数据或视觉化表达，必须先和用户完整确认后，才能进入 `app/` 中会被页面渲染的代码、数据或样式。
- Before content is approved, pages may only contain neutral framework labels, layout regions, controls, and empty placeholders.
- After content is approved, keep the narrative concrete: every concept should be tied back to what happens during or around an LLM conversation.
- 所有课程文档、章节合同、动画规格、概念解释和课程目录正文必须使用中文；必要英文只保留为技术名词、API 名称、代码标识符、路径、配置字段或 metadata 字段名。
- 课程文档和页面表达必须具体直观。确认后的课程内容应使用真实感对话、具体对象、具体数据和可观察状态变化；不得用“简单问题”“天气类问题”“抽象结果”等占位式表达替代真实示例。
- 用户说“记住”时，必须把对应约束写入仓库文档，而不是只依赖聊天记忆；写入前必须判断它是全局规则还是特定场景规则。
- 全局规则只能写在 `AGENTS.md` 中，不得在非 `AGENTS.md` 项目文档中重复描述；特定章节、页面、演示、mock 数据或实现取舍的规则，写入对应 lifecycle 文档。
- Keep pages and routes orchestration-focused. Put reusable UI under `app/components/`, pure teaching data and transforms under `app/lib/`, and interactive browser-local state under `app/stores/`.
- Keep route declarations in `app/routes.ts`, root providers and global shell in `app/root.tsx`, and Playwright specs under `e2e/specs/`.
- 章节路由使用固定模式：章节首页为 `/chapters/NN`，章节演示页为 `/chapters/NN/demos/<demo-id>`；未确认的下一章可以预留中性占位页，但不得写入未确认课程内容。
- 当前课程页面使用全宽布局。章节演示页仅保留单一顶部工具栏，不额外展示章节介绍区；顶部工具栏同时承载演示选择、章节导航、步骤进度、步骤说明和步进操作，不再额外设置底部固定操作条或右侧吸顶步骤卡片；演示主体优先采用左右两侧区域：左侧展示真实聊天效果，右侧展示标准时序图；时序图消息标签通过 hover/focus 查看实际传输数据，多种 API 格式由 payload 浮层右上角切换按钮单一展示。
- 所有演示必须可步进；左侧对话状态和右侧时序图进度必须由同一个 step 游标驱动。右侧可能对应左侧一个状态下的多步，每一步都必须逐步出现，不能一次性全部展示；右侧当前事件必须明确对应左侧某个消息块，并在步进时让该消息块保持可见和高亮。
- 左右分栏演示使用固定工作台布局，页面主体不承担演示内容的垂直滚动；左侧聊天面板和右侧时序图面板各自固定在主体区域内，仅内部内容区域滚动。聊天消息少时自然从顶部排列，消息多到溢出时，当前事件对应气泡应靠近可视区底部；右侧时序图新增事件只滚动右侧内部容器，不得改变顶部步进按钮位置或带走左侧关键聊天内容。
- 标准时序图默认采用参与者、生命线和横向消息线样式；流程图和节点图默认使用成熟图组件或库，不得在已有成熟组件能满足需求时手写低质量图形系统。
- 章节演示必须优先通过 JSON 配置驱动通用演示播放器；新增章节特性应升级基础播放器、类型和校验能力，不得在章节组件中重造一套演示运行时。
- 教学界面中的数据弹窗、解释浮层和辅助信息面板必须智能利用视口空间，优先保证信息完整可读、贴近当前教学对象、不遮挡关键消息线或操作控件；可使用上下左右任一合理位置，长内容应在浮层内部滚动。
- Prefer visual and interactive explanation over long static prose. Text on screen should be short, purposeful, and connected to the current interaction.
- Use `AGENTS.md` as the local entry point into the Harness Engineering skill pack; keep non-`AGENTS.md` project docs focused on repo-specific facts, lifecycle outputs, and event evidence.
- 凡技能文档中已经定义的通用流程规范、阶段路由、交付约束或方法论说明，项目侧文档均不应重复描述。项目文档应聚焦仓库本地事实、业务与技术决策、阶段产物及事件证据；可复用的通用流程要求统一以对应技能文档与 AGENTS.md 为准。
- Keep this file concise and link out to detailed docs instead of duplicating templates.
- Keep human-maintained docs portable; avoid absolute local paths or editor-specific URIs.
- When new user information conflicts with current docs or assumptions, confirm the conflict before concluding that the rule changed or the implementation is wrong.
- Do not describe work as implemented or verified without corresponding repository evidence such as diffs, command output, tests, or other concrete artifacts.
- Do not claim verification from success-path evidence alone when meaningful failure, boundary, or exception behavior exists.

## When to Escalate to Humans

- Scope or priority changes materially affect teaching goals, audience fit, cost, or timeline.
- The chapter order, conceptual framing, or technical depth remains unresolved.
- Visual design direction or interaction mechanics would materially change the presentation style.
- Release risk exceeds the agreed tolerance.
- Process changes require organizational approval.

## Reference Map

- Repository context details: `docs/context/index.md`
- Product intent details: `docs/product/`
- Architecture details: `docs/architecture/`
- Delivery details: `docs/delivery/`
- Quality details: `docs/quality/`
- Release details: `docs/release/`
- Retrospective details: `docs/retrospectives/`
