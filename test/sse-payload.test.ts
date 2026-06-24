import { describe, expect, it } from "vitest";

import { parseSsePayload } from "../app/lib/demo-player/sse";

describe("parseSsePayload", () => {
  it("parses an SSE event with JSON data", () => {
    const events = parseSsePayload(
      'event: response.output_text.delta\ndata: {"type":"response.output_text.delta","delta":"可以改成："}',
    );

    expect(events).toEqual([
      {
        event: "response.output_text.delta",
        data: '{"type":"response.output_text.delta","delta":"可以改成："}',
        dataJson: {
          type: "response.output_text.delta",
          delta: "可以改成：",
        },
      },
    ]);
  });

  it("joins multiline data before parsing JSON", () => {
    const events = parseSsePayload('event: custom\ndata: {"a":\ndata: 1}');

    expect(events[0]?.data).toBe('{"a":\n1}');
    expect(events[0]?.dataJson).toEqual({ a: 1 });
  });

  it("keeps non-JSON data readable", () => {
    const events = parseSsePayload("event: done\ndata: [DONE]");

    expect(events).toEqual([
      {
        event: "done",
        data: "[DONE]",
      },
    ]);
  });

  it("parses multiple event blocks", () => {
    const events = parseSsePayload(
      'event: one\ndata: {"n":1}\n\nevent: two\ndata: {"n":2}',
    );

    expect(events.map((event) => event.event)).toEqual(["one", "two"]);
    expect(events.map((event) => event.dataJson)).toEqual([{ n: 1 }, { n: 2 }]);
  });
});
