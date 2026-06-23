import { describe, expect, it } from "vitest";

import { landingContent } from "../app/lib/landing-content";

describe("landingContent", () => {
  it("keeps only approved course-level copy", () => {
    expect(landingContent.courseName).toBe("LLM 技术全景课");
    expect(landingContent.heroPromise).toBe("建立完整地图");
    expect("format" in landingContent).toBe(false);
  });

  it("keeps the homepage action free of chapter display copy", () => {
    expect(landingContent.primaryAction).toEqual({
      label: "开始体验",
      href: "/chapters/01",
    });
    expect("chapterEntries" in landingContent).toBe(false);
    expect("outlinePlaceholders" in landingContent).toBe(false);
  });

  it("does not expose reservation or meeting actions", () => {
    expect("primaryCta" in landingContent).toBe(false);
    expect("meeting" in landingContent).toBe(false);
  });

  it("does not expose development status labels", () => {
    const serialized = JSON.stringify(landingContent);

    expect(serialized).not.toContain("已确认");
    expect(serialized).not.toContain("待确认");
  });

  it("defines the seven approved course value items", () => {
    expect(landingContent.valueItems.map((item) => item.title)).toEqual([
      "把零散概念串成一条主线",
      "看懂真实 LLM 应用的系统边界",
      "理解成本、延迟和质量的取舍",
      "建立工程判断力",
      "提升调试和排障能力",
      "建立 agent 的前置基础",
      "降低团队沟通成本",
    ]);
    expect(landingContent.valueItems.every((item) => item.checkpoints.length === 3)).toBe(true);
  });
});
