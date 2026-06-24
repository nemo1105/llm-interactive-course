---
status: accepted
owner: human
last_reviewed: 2026-06-24
upstream_docs:
  - execution-plan.md
next_action: 完成第一章页面后进入人工内容和视觉复审。
---

# 第一章页面里程碑计划

## 里程碑

- M1 文档 gate 完成：产品、架构、交付和质量文档可追溯。
- M2 基础播放器完成：`DemoSpec`、步进派生、标准时序图、流式循环标记和消息 hover payload 浮层可用。
- M3 路由组完成：`/chapters/01`、三个演示页和 `/chapters/02` 可访问。
- M4 页面可交互：第一章演示页逐步展示真实聊天、标准时序图和完整 payload。
- M5 自动化验证完成：docs、typecheck、unit 和 e2e 全部通过。

## 滑期处理

- 如果 M2、M3 或 M4 未通过，优先缩减视觉细节，不缩减内容边界和测试覆盖。
- 如果 M5 未通过，修复失败证据，不弱化测试断言。
