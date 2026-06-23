---
status: accepted
owner: human
last_reviewed: 2026-06-23
upstream_docs:
  - ../../AGENTS.md
next_action: 新增章节或播放器能力变化时，更新本索引和对应上下文指南。
---

# Repository Context

## Summary

This is a single frontend repository for an interactive LLM technology sharing page.

The repository uses a reusable `DemoPlayer` for step-by-step chapter demos. Chapter-specific content should stay in typed configuration under `app/lib/`, while reusable UI stays under `app/components/`.

## 索引

- [新增章节指南](add-chapter-guide.md)：说明如何用 `DemoSpec`、路由和测试接入后续章节。

## 相关文档位置

- 产品与课程内容：`docs/product/`
- 架构和接口合同：`docs/architecture/`
- 交付计划和测试策略：`docs/delivery/`
- 质量评估和发布判断：`docs/quality/`
