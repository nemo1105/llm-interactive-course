---
status: draft
owner: human
last_reviewed: 2026-06-24
upstream_docs:
  - ../course-development-standard.md
  - ../course-catalog.md
next_action: 请用户复审本章页面效果；确认后继续按同一标准复查后续章节。
---

# 13. MCP：工具和上下文的标准化连接

## 复审边界

本文档是第 13 章课程内容合同。页面实现必须遵循全局章节编写要求：左侧只展示用户真实可见聊天，右侧时序图只展示真实发生的主链路事件，概念信息通过 payload、章节文字或独立演示说明呈现。

本章承接前序章节已经建立的推理接口、上下文和工具调用心智模型，只增加本章要讲的新机制。

## 学习目标

学习者完成本章后，应能解释：

- MCP tools 暴露可执行动作。
- MCP resources 暴露可读取资料。
- MCP prompts 暴露可复用提示模板。
- 权限、审批和质量仍由 host 与工程层负责。

## 原理讲法

MCP 是 host/client/server 之间的协议层，模型仍然通过 host 提供的工具和上下文使用外部能力。

本章不把概念名词画成时序图参与者。时序图参与者只使用真实系统 actor、运行时、工具、外部系统或用户；本章机制通过请求 payload、工具结果、响应结构和章节说明展开。

## 具体实例

日历 MCP server 暴露 list_events 工具、“今天日程”resource 和会议纪要 prompt，host 发现后提供给模型使用。

## 教学流程

- `/chapters/13/demos/mcp-discovery`：从手写工具到标准化连接。展示 host、client、server 如何发现工具、资源和 prompts。
  1. 启动 client：host 通过 MCP client 连接日历 server。
  2. 发现能力：server 暴露 tools、resources、prompts。
  3. 提供工具声明：模型看到的是 host 转换后的工具声明。
  4. 通过 MCP 调用：模型请求 list_events 后，host 通过 client 调用 server。
  5. 读取资源和 prompt：resource 和 prompt 可以被 host 读出后放进模型上下文。

## 交互与演示想法

- 左侧聊天只展示用户真实输入、助手思考状态和最终助手回答。
- 右侧标准时序图逐步展示用户、应用服务器、大模型、真实工具或外部系统之间的主链路事件。
- 当前步骤的关键上下文、参数、工具声明、工具结果、来源、审批状态或评估结果通过 payload 浮层展示。
- 反事实、错误示例或概念对照不插入主链路；需要展示时使用独立 demo 或 payload 注释说明。

## 边界与常见误解

- 本章不讲 RAG 召回；MCP 先解决工具和上下文连接标准化。
- 不要把上下文、提示词、token 预算、参数、role、消息、缓存规则、技能说明或决策点画成时序图参与者。
- 不要把应用内部说明写进左侧聊天气泡。
- 不要引入真实外部 API、真实第三方账号、真实 OAuth、真实邮件或生产动作；课程页面使用 mock payload 展示机制。

## 内容复审验收标准

- 本章文档、课程目录和页面数据保持同一示例、同一主链路和同一核心机制。
- 本章左侧聊天只包含用户和助手真实可见消息。
- 本章主时序图只展示真实发生的系统事件。
- 本章 payload 能展示关键上下文或工程机制，而不是只展示标题。
- 本章不提前深入后续章节负责的机制。
