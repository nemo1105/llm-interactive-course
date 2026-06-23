---
status: accepted
owner: human
last_reviewed: 2026-06-23
upstream_docs:
  - system-design.md
next_action: 实现时保持 `DemoSpec`、播放器派生状态、标准时序图和第一章配置一致。
---

# 第一章页面接口合同

## 路由合同

- `/chapters/01` 渲染第一章首页。
- `/chapters/01/demos/direct` 渲染普通对话演示页。
- `/chapters/01/demos/tool-call` 渲染工具调用演示页。
- `/chapters/02` 渲染第二章中性预留页，不写入未确认章节内容。
- `/` 保持现有首页占位体验，不自动跳转到章节页。

## 内容数据合同

- 每个演示必须配置为 `DemoSpec`，包含稳定 `id`、中文标题、路由、说明、聊天帧、时序参与者、时序消息、payload 和有序 step。
- 每个 step 必须引用一个存在的 `leftFrameId`，并声明该 frame 中存在的 `focusMessageId`；step 还可声明本步新增显示的消息、当前高亮参与者、当前高亮消息和当前 payload。
- 时序参与者必须包含稳定 `id`、中文标签和参与者类型；普通对话至少包含“用户、应用服务器、大模型”。
- 时序消息必须包含稳定 `id`、from、to、中文标签、消息类型和可选 payload；消息类型至少支持普通消息、API 请求、API 响应、工具调用、工具结果和界面更新。
- payload 必须能展示模型请求、模型响应、工具参数、工具返回或界面状态更新中的一种；同一传输需要对比 Chat Completions 和 Responses API 时，payload 必须以 variants 提供两种格式，并由 payload 浮层右上角格式切换按钮单一展示。
- `language: "json"` 的 payload content 必须是结构化 JSON 值，由播放器渲染为可折叠 JSON 树；`language: "text"` 的 payload content 保持字符串渲染。
- payload 或 variant 可配置 `defaultExpandedKeys`、`defaultCollapsedKeys` 和 `autoExpandDepth`；variant 配置优先于 payload 配置，未配置时使用教学默认策略。
- 教学默认策略展开 `messages`、`input`、`output`、`choices`、`message`、`content`、`tool_calls`、`function`、`arguments`、`tools` 等主干字段，折叠 `usage`、token 明细、`metadata`、`annotations`、`logprobs`、`reasoning` 等辅助字段。
- 第一章首条 `发送消息` 时序消息必须提供 Chat Completions 和 Responses API 两个官方格式 payload，由浮层切换入口选择展示实际 JSON 数据。
- variants 的 `label` 和 `language` 只作为内部选择依据，不在 payload 浮层正文中展示；浮层不得显示 `Chat Completions request`、`Responses API response`、`json` 这类冗余格式标题或语言标签。
- 工具调用演示必须包含 `get_weather` mock 工具请求、上海天气 mock 结果、二次模型请求和最终回答。
- 普通对话演示不得包含工具调用摘要。
- 工具调用演示内容数据包含城市、日期、温度区间、降水概率和最终回答样例。

## 组件交互合同

- 章节首页右上角提供进入演示和下一章入口。
- 演示页仅保留单一顶部工具栏，不展示章节介绍区；顶部工具栏提供返回章节首页、演示选择、下一章入口、步骤进度、步骤说明和步进操作。
- 演示页使用通用 `DemoPlayer` 渲染。
- `DemoPlayer` 提供上一步、下一步、重播、当前步计数和当前步骤说明。
- `DemoPlayer` 用当前 step 派生左侧聊天帧和右侧标准时序图消息线；未来消息线不出现在当前图中。
- `DemoPlayer` 在点击下一步后必须把新出现的当前时序消息线滚动到右侧时序图内部容器的可见区域，不得触发页面级滚动或改变顶部工具栏按钮位置。
- `DemoPlayer` 在桌面双栏布局中固定左侧聊天面板和右侧时序图面板，只允许各自内部内容区域滚动；当前 step 的 `focusMessageId` 对应消息必须高亮，消息列表未溢出时从顶部自然排列，溢出时才滚动并让聚焦消息尽量靠近可视区域底部。
- 当前已出现时序消息达到 5 条及以上时，标准时序图底部重复展示所有参与者；少于 5 条消息时不展示底部参与者行。
- 悬浮或聚焦已出现的消息标签时，消息旁浮层展示对应 payload；没有 hover/focus 时不常驻展示当前传输数据。
- payload 浮层定位支持右侧、左侧、下方、上方四个方向，并由播放器根据视口空间、消息标签位置和顶部工具栏自动选择；浮层必须保持在视口内，内容过长时在内部滚动。
- payload 浮层右上角提供 Chat Completions 和 Responses API 两个切换按钮；同一时刻只展示当前浮层选中的一种格式。
- JSON payload 树必须支持展开折叠，并在格式切换后按当前 variant 的默认展开策略重新渲染。
