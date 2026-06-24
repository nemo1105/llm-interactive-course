---
status: accepted
owner: human
last_reviewed: 2026-06-24
upstream_docs:
  - ../architecture/system-design.md
next_action: 按顺序完成文档 gate、内容数据、路由页面、流式循环标记和测试验证。
---

# 第一章页面执行计划

## 工作切片

1. 确认产品 gate：把第一章章节文档更新为 accepted，并记录第一章具体示例边界。
2. 建立实现合同：补齐第一章系统设计、接口合同、风险、验收和测试计划。
3. 实现基础能力：新增 `DemoSpec` 类型、引用校验、步进状态派生和通用 `DemoPlayer`。
4. 实现标准时序图：渲染参与者、生命线、横向消息线、当前激活状态、消息 hover/focus payload 浮层和浮层右上角 API 格式切换。
5. 实现内容数据：在 `app/lib/` 中维护章节首页、三个演示、聊天帧、时序参与者、时序消息、step 序列、流式循环标记和完整 payload。
6. 实现路由组：新增 `/chapters/01`、`/chapters/01/demos/direct`、`/chapters/01/demos/streaming`、`/chapters/01/demos/tool-call` 和 `/chapters/02`。
7. 实现页面：章节首页展示本章介绍；演示页仅保留单一顶部工具栏，顶部承载导航和步进控制，并调用通用 `DemoPlayer` 渲染左右固定工作台。
8. 验证回归：新增 Vitest 和 Playwright 覆盖，并运行完整迭代验证。

## 依赖

- 第一章产品内容已由用户确认。
- 示例数据策略已确认：使用具体上海天气 mock 数据和第一章改写对话；流式输出复用无工具调用改写例子。
- 本次不依赖后端、真实模型、网络权限或环境变量。
