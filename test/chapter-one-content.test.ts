import { describe, expect, it } from "vitest";

import {
  shouldExpandPayloadJsonNode,
} from "../app/lib/demo-player/payload-tree";
import { buildDemoPlayerState, validateDemoSpec } from "../app/lib/demo-player/player";
import { chapterOneContent, getChapterDemo } from "../app/lib/chapter-one-content";

describe("chapterOneContent", () => {
  it("defines the chapter homepage and two stable demo routes", () => {
    expect(chapterOneContent.homepageRoute).toBe("/chapters/01");
    expect(chapterOneContent.nextChapterRoute).toBe("/chapters/02");
    expect(chapterOneContent.demos.map((demo) => demo.id)).toEqual(["direct", "tool-call"]);
    expect(chapterOneContent.demos.map((demo) => demo.route)).toEqual([
      "/chapters/01/demos/direct",
      "/chapters/01/demos/tool-call",
    ]);
  });

  it("keeps every demo config internally valid", () => {
    for (const demo of chapterOneContent.demos) {
      expect(validateDemoSpec(demo)).toEqual([]);
      expect(demo.frames.length).toBeGreaterThan(1);
      expect(demo.actors.length).toBeGreaterThan(1);
      expect(demo.messages.length).toBeGreaterThan(0);
      expect(demo.payloads.length).toBeGreaterThan(0);
      expect(demo.steps.length).toBeGreaterThan(1);
      for (const step of demo.steps) {
        const frame = demo.frames.find((candidate) => candidate.id === step.leftFrameId);

        expect(frame?.messages.some((message) => message.id === step.focusMessageId)).toBe(true);
      }
      for (const payload of demo.payloads) {
        for (const variant of payload.variants) {
          if (variant.language === "json") {
            expect(typeof variant.content).not.toBe("string");
          }
        }
      }
    }
  });

  it("derives visible sequence messages from the current step only", () => {
    const toolDemo = getChapterDemo("tool-call");
    const firstStep = buildDemoPlayerState(toolDemo, 0);
    const executeStep = buildDemoPlayerState(toolDemo, 3);

    expect(firstStep.visibleActors.map((actor) => actor.label)).toEqual([
      "用户",
      "应用服务器",
      "大模型",
      "get_weather",
    ]);
    expect(firstStep.visibleMessages.map((message) => message.id)).toEqual(["tool-user-server"]);
    expect(firstStep.visibleMessages.map((message) => message.label)).not.toContain("执行 get_weather");

    expect(executeStep.currentFrame.id).toBe("tool-frame-processing");
    expect(executeStep.focusMessageId).toBe("tool-assistant-processing");
    expect(executeStep.visibleMessages.map((message) => message.id)).toContain("tool-server-weather");
    expect(executeStep.activeMessageId).toBe("tool-server-weather");
    expect(executeStep.activePayload?.id).toBe("tool-execute-input");
  });

  it("keeps the first sequence message tied to official API request formats", () => {
    const directDemo = getChapterDemo("direct");
    const sendMessage = directDemo.messages.find((message) => message.id === "direct-user-server");
    const sendPayload = directDemo.payloads.find((payload) => payload.id === "direct-send-message");

    expect(directDemo.actors.map((actor) => actor.label)).toEqual(["用户", "应用服务器", "大模型"]);
    expect(sendMessage?.label).toBe("发送消息");
    expect(sendPayload?.variants.map((variant) => variant.label)).toEqual([
      "Chat Completions request",
      "Responses API request",
    ]);
    expect(sendPayload?.variants[0].content).toMatchObject({
      messages: expect.any(Array),
      model: "gpt-5.5",
    });
    expect(sendPayload?.variants[1].content).toMatchObject({
      input: directQuestionText(),
      instructions: "You are a helpful assistant.",
    });
  });

  it("uses teaching-first JSON tree expansion defaults", () => {
    expect(shouldExpandPayloadJsonNode([], {}, 0)).toBe(true);
    expect(shouldExpandPayloadJsonNode(["messages"], [], 1)).toBe(true);
    expect(shouldExpandPayloadJsonNode(["choices"], [], 1)).toBe(true);
    expect(shouldExpandPayloadJsonNode(["tool_calls"], [], 2)).toBe(true);
    expect(shouldExpandPayloadJsonNode([0, "tool_calls"], {}, 5)).toBe(true);
    expect(shouldExpandPayloadJsonNode(["usage"], {}, 1)).toBe(false);
    expect(shouldExpandPayloadJsonNode(["metadata"], {}, 1)).toBe(false);
    expect(shouldExpandPayloadJsonNode(["prompt_tokens_details"], {}, 2)).toBe(false);
    expect(shouldExpandPayloadJsonNode(["unlisted_deep_key"], {}, 3)).toBe(false);
  });

  it("keeps get_weather only in the mock tool-call demo", () => {
    expect(JSON.stringify(getChapterDemo("direct"))).not.toContain("get_weather");
    expect(JSON.stringify(getChapterDemo("tool-call"))).toContain("get_weather");
    expect(getChapterDemo("tool-call").steps.map((step) => step.id)).toEqual([
      "tool-step-user",
      "tool-step-initial-request",
      "tool-step-tool-call",
      "tool-step-execute",
      "tool-step-result",
      "tool-step-writeback",
      "tool-step-final-response",
      "tool-step-display",
    ]);
  });

  it("uses concrete realistic examples and rejects placeholder wording", () => {
    const serialized = JSON.stringify(chapterOneContent);

    expect(serialized).toContain("上海");
    expect(serialized).toContain("2026-06-24");
    expect(serialized).toContain("22-25℃");
    expect(serialized).toContain("降水概率 82%");
    expect(serialized).toContain("建议带伞");
    expect(serialized).toContain("我这段话有点绕");
    expect(serialized).toContain("请求大模型");
    expect(serialized).not.toMatch(/一个简单问题|天气类问题|抽象工具结果|抽象占位/);
  });
});

function directQuestionText(): string {
  return "我这段话有点绕，帮我改得更清楚：我们明天可能需要稍微提前一点到会议室，因为投影设备可能要调试。";
}
