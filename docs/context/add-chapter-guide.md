---
status: accepted
owner: human
last_reviewed: 2026-06-23
upstream_docs:
  - ../../AGENTS.md
  - ../architecture/system-design.md
  - ../architecture/interface-contracts.md
next_action: 新增第二章或后续章节时，按本指南复用 DemoSpec 和 DemoPlayer；如果新增演示能力，先更新基础播放器和接口合同。
---

# 新增章节指南

## 目标

新增章节时，优先复用当前的通用演示能力：用结构化配置描述左侧聊天、右侧时序图、传输数据和 step 序列，由 `DemoPlayer` 统一渲染和步进。

当前不是“只放一个 JSON 文件就自动生成完整章节”的形态。更准确地说：

- 演示主体已经由 `DemoSpec` 配置驱动。
- 章节首页、路由声明和 route metadata 仍需要少量代码接入。
- 如果新章节需要新的交互能力，应升级通用播放器，而不是在章节组件里重写一套演示运行时。

## 新增前置条件

- 章节内容必须已确认；未经确认的章节标题、正文、示例、mock 数据、流程节点和动画脚本不得进入 `app/`。
- 课程文档和页面表达使用中文；英文仅保留为技术名词、API 名称、代码标识符、路径或配置字段。
- 示例必须具体直观：使用真实感对话、具体城市或对象、具体数据和可观察状态变化，避免“简单问题”“抽象结果”等占位表达。
- 如果章节引入新的能力，例如 RAG 检索、长期记忆、评估面板、agent loop、多模型协作，先更新架构和接口合同，再实现播放器扩展。

## 配置内容

每个演示配置为一个 `DemoSpec`，核心字段如下：

- `id`、`title`、`shortTitle`、`route`：演示标识、标题和路由。
- `summary`、`outcome`：章节首页展示的演示说明。
- `conversationTitle`、`conversationSubtitle`：左侧聊天面板标题和默认说明。
- `flowTitle`、`flowSubtitle`：右侧时序图标题和默认说明。
- `actors`：时序图参与者，例如“用户”“应用服务器”“大模型”“工具”。
- `messages`：右侧时序消息线，包含 `from`、`to`、`label`、`kind` 和可选 `payloadId`。
- `frames`：左侧聊天帧，每帧包含当前应展示的消息气泡。
- `payloads`：消息 hover/focus 后展示的实际传输数据；同一传输可用 variants 提供不同 API 格式。
- `steps`：步进序列；每一步声明左侧帧、左侧聚焦消息、右侧新增消息、当前高亮消息和当前 payload。

`steps` 是左右同步的核心。每一步必须保证：

- `leftFrameId` 指向一个存在的聊天帧。
- `focusMessageId` 指向该聊天帧内存在的消息。
- `revealMessageIds` 只写本步新增出现的右侧时序消息。
- `activeMessageId` 指向当前高亮的右侧消息线。
- `payloadId` 可显式指定当前传输数据；不写时使用当前消息线绑定的 payload。

## 新增步骤

1. 在 `docs/product/chapters/` 新增章节内容合同，确认本章讲什么、不讲什么、示例和 mock 数据。
2. 如交互或播放器能力变化，同步更新 `docs/architecture/`、`docs/delivery/` 和 `docs/quality/` 中相关文档。
3. 在 `app/lib/` 新增章节内容配置文件，参考第一章的 `chapter-one-content.ts`：
   - 定义章节内容对象。
   - 定义一个或多个 `DemoSpec`。
   - 提供 `getChapterDemo(...)` 之类的稳定读取函数。
4. 为章节首页和每个 demo 增加 route module，并在 `app/routes.ts` 注册：
   - 章节首页：`/chapters/NN`
   - 演示页：`/chapters/NN/demos/<demo-id>`
5. 页面层复用当前演示页结构：
   - 顶部单一工具栏承载章节导航、演示选择和步进控制。
   - 主体使用左右固定工作台。
   - 左侧聊天和右侧时序图只在内部滚动。
6. 增加或扩展 Vitest：
   - 校验每个 `DemoSpec` 引用完整。
   - 校验每个 step 的 `focusMessageId` 存在于当前 frame。
   - 校验具体示例数据存在，禁用占位表达不存在。
7. 增加或扩展 Playwright：
   - 覆盖章节首页、演示切换、步进同步、未来消息隐藏。
   - 覆盖顶部工具栏稳定、页面不发生文档级滚动。
   - 覆盖右侧新增时序消息进入内部滚动容器可见区域。
   - 覆盖 payload hover/focus、格式切换和浮层边界。

## 什么时候只改配置

以下情况通常只需要新增章节内容配置、route module 和测试：

- 左侧仍是聊天气泡。
- 右侧仍是参与者、生命线和横向消息线组成的标准时序图。
- 演示仍按单一 step 游标推进。
- 当前事件只需要展示 JSON 或文本 payload。
- payload 的格式切换仍可用现有 variants 表达。

## 什么时候升级基础能力

以下情况不要在章节里临时写专用 UI，应先升级 `DemoPlayer`、类型和校验：

- 右侧不再只是时序消息线，而需要检索列表、上下文窗口、评估表格或 agent 状态机。
- 左侧同一步需要多个聚焦区域或非聊天气泡展示。
- step 需要分支、回放速度、自动播放、暂停点或用户选择。
- payload 需要新的展示形态，例如 diff、表格、token 片段、引用来源或可折叠树。
- 章节之间需要共享新的导航、状态或章节注册机制。

升级基础能力时，同步更新：

- `app/lib/demo-player/types.ts`
- `app/lib/demo-player/player.ts`
- `app/components/demo-player/`
- `docs/architecture/interface-contracts.md`
- `docs/delivery/test-strategy.md`
- 对应 Vitest 和 Playwright 回归。

## 验收命令

完成新增章节后至少运行：

```bash
pnpm run docs:lint
pnpm run typecheck
pnpm run test:unit
pnpm run test:e2e
```

最终交付前运行：

```bash
pnpm run verify:iteration
```
