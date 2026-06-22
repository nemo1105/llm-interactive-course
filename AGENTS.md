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
- Keep pages and routes orchestration-focused. Put reusable UI under `app/components/`, pure teaching data and transforms under `app/lib/`, and interactive browser-local state under `app/stores/`.
- Keep route declarations in `app/routes.ts`, root providers and global shell in `app/root.tsx`, and Playwright specs under `e2e/specs/`.
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
