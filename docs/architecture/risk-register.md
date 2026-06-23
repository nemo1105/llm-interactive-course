---
status: accepted
owner: human
last_reviewed: 2026-06-23
upstream_docs:
  - system-design.md
next_action: 用单元测试和 Playwright 覆盖已列风险。
---

# 第一章页面风险登记

## 风险

- 第一章页面仍然停留在占位表达：通过内容数据单元测试阻止第一章禁用占位表达。
- 首页占位语义被破坏：通过现有首页 Playwright 测试回归。
- 固定路由缺失或导航错位：通过 Playwright 覆盖章节首页、两个演示页和 `/chapters/02`。
- 第一章演示结构退化成文字堆叠：通过 Playwright 覆盖“正常对话区域”和“时序图区域”同时存在。
- `DemoSpec` 引用断裂：通过 Vitest 校验 step、frame、actor、message、payload 引用完整性。
- 左右状态不同步或右侧一次全出现：通过 Playwright 覆盖步进前后时序消息和聊天状态变化。
- 时序图渲染错误：通过 Playwright 断言参与者、消息线和消息 hover payload 浮层可见。
- 第一章事件只展示标题不展示实际数据：通过 Playwright 断言消息 hover 后的 payload 内容。
- 交互只展示效果不展示机制：通过页面断言同时覆盖聊天面板、第一章传输事件和完整请求响应 payload。

## 复审触发

- 如果后续要接入真实模型或真实天气 API，必须回到产品文档和架构文档确认。
- 如果第一章入口要改成首页，需重新复审路由和首页测试。
