import { describe, expect, it } from "vitest";

import { landingContent } from "../app/lib/landing-content";

describe("landingContent", () => {
  it("keeps only approved course-level copy", () => {
    expect(landingContent.courseName).toBe("LLM 技术全景课");
    expect(landingContent.heroPromise).toBe("建立完整地图");
    expect(landingContent.format).toBe("内部分享展示页");
  });

  it("keeps unapproved outline modules as placeholders", () => {
    expect(landingContent.outlinePlaceholders).toHaveLength(4);
    expect(landingContent.outlinePlaceholders.every((item) => item.status === "待确认")).toBe(
      true,
    );
    expect(landingContent.outlinePlaceholders.map((item) => item.label)).toEqual([
      "模块 01",
      "模块 02",
      "模块 03",
      "模块 04",
    ]);
  });

  it("does not expose reservation or meeting actions", () => {
    expect("primaryCta" in landingContent).toBe(false);
    expect("meeting" in landingContent).toBe(false);
  });

  it("focuses value while keeping unconfirmed value items marked", () => {
    expect(landingContent.valueItems[0]).toMatchObject({
      title: "建立完整地图",
      status: "已确认",
    });
    expect(landingContent.valueItems.slice(1).every((item) => item.status === "待确认")).toBe(
      true,
    );
  });
});
