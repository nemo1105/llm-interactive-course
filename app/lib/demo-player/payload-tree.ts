import type { PayloadExpansionSpec } from "./types";

const teachingExpandedKeys = [
  "arguments",
  "choices",
  "content",
  "delta",
  "function",
  "input",
  "message",
  "messages",
  "output",
  "tool_calls",
  "tools",
];

const teachingCollapsedKeys = [
  "annotations",
  "completion_tokens_details",
  "error",
  "incomplete_details",
  "input_tokens_details",
  "logprobs",
  "metadata",
  "output_tokens_details",
  "prompt_tokens_details",
  "reasoning",
  "refusal",
  "usage",
];

export const defaultPayloadExpansion: Required<PayloadExpansionSpec> = {
  autoExpandDepth: 2,
  defaultCollapsedKeys: teachingCollapsedKeys,
  defaultExpandedKeys: teachingExpandedKeys,
};

export function resolvePayloadExpansion(
  payloadExpansion?: PayloadExpansionSpec,
  variantExpansion?: PayloadExpansionSpec,
): Required<PayloadExpansionSpec> {
  return {
    autoExpandDepth:
      variantExpansion?.autoExpandDepth ??
      payloadExpansion?.autoExpandDepth ??
      defaultPayloadExpansion.autoExpandDepth,
    defaultCollapsedKeys:
      variantExpansion?.defaultCollapsedKeys ??
      payloadExpansion?.defaultCollapsedKeys ??
      defaultPayloadExpansion.defaultCollapsedKeys,
    defaultExpandedKeys:
      variantExpansion?.defaultExpandedKeys ??
      payloadExpansion?.defaultExpandedKeys ??
      defaultPayloadExpansion.defaultExpandedKeys,
  };
}

export function shouldExpandPayloadJsonNode(
  keyPath: readonly (string | number)[],
  _data: unknown,
  level: number,
  expansion: Required<PayloadExpansionSpec> = defaultPayloadExpansion,
): boolean {
  if (level === 0) {
    return true;
  }

  const key = keyPath[0];
  const keyName = typeof key === "number" ? String(key) : key;
  const parentKey = keyPath[1];
  const parentKeyName = typeof parentKey === "number" ? String(parentKey) : parentKey;

  if (expansion.defaultCollapsedKeys.includes(keyName)) {
    return false;
  }

  if (
    typeof key === "number" &&
    parentKeyName &&
    expansion.defaultExpandedKeys.includes(parentKeyName)
  ) {
    return true;
  }

  if (expansion.defaultExpandedKeys.includes(keyName)) {
    return true;
  }

  return level <= expansion.autoExpandDepth;
}
