import type { JsonValue } from "./types";

export type ParsedSseEvent = {
  id?: string;
  event: string;
  data: string;
  dataJson?: JsonValue;
  retry?: string;
};

export function parseSsePayload(content: string): ParsedSseEvent[] {
  const blocks = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trimEnd())
    .filter((block) => block.trim().length > 0);

  return blocks.map(parseSseBlock);
}

function parseSseBlock(block: string): ParsedSseEvent {
  const dataLines: string[] = [];
  let event = "message";
  let id: string | undefined;
  let retry: string | undefined;

  for (const rawLine of block.split("\n")) {
    if (rawLine.startsWith(":")) {
      continue;
    }

    const separatorIndex = rawLine.indexOf(":");
    const field = separatorIndex >= 0 ? rawLine.slice(0, separatorIndex) : rawLine;
    const rawValue = separatorIndex >= 0 ? rawLine.slice(separatorIndex + 1) : "";
    const value = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;

    if (field === "event") {
      event = value || event;
    } else if (field === "data") {
      dataLines.push(value);
    } else if (field === "id") {
      id = value;
    } else if (field === "retry") {
      retry = value;
    }
  }

  const data = dataLines.join("\n");
  const dataJson = parseJsonValue(data);

  return {
    ...(id !== undefined ? { id } : {}),
    event,
    data,
    ...(dataJson !== undefined ? { dataJson } : {}),
    ...(retry !== undefined ? { retry } : {}),
  };
}

function parseJsonValue(value: string): JsonValue | undefined {
  const trimmed = value.trim();

  if (!trimmed || trimmed === "[DONE]") {
    return undefined;
  }

  try {
    return JSON.parse(trimmed) as JsonValue;
  } catch {
    return undefined;
  }
}
