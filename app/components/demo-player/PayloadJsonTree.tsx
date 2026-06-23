import { JSONTree, type KeyPath } from "react-json-tree";
import type { ReactNode } from "react";

import {
  resolvePayloadExpansion,
  shouldExpandPayloadJsonNode,
} from "../../lib/demo-player/payload-tree";
import type {
  JsonPayloadVariantSpec,
  PayloadExpansionSpec,
  PayloadSpec,
} from "../../lib/demo-player/types";

const payloadJsonTheme = {
  scheme: "payload-dark",
  author: "LLM Interactive Share",
  base00: "#020617",
  base01: "#0f172a",
  base02: "#1e293b",
  base03: "#64748b",
  base04: "#94a3b8",
  base05: "#e2e8f0",
  base06: "#f8fafc",
  base07: "#ffffff",
  base08: "#fca5a5",
  base09: "#fdba74",
  base0A: "#fde68a",
  base0B: "#86efac",
  base0C: "#67e8f9",
  base0D: "#93c5fd",
  base0E: "#c4b5fd",
  base0F: "#f9a8d4",
};

export function PayloadJsonTree({
  payload,
  variant,
}: {
  payload: PayloadSpec;
  variant: JsonPayloadVariantSpec;
}) {
  const expansion = resolvePayloadExpansion(
    payloadExpansion(payload),
    payloadExpansion(variant),
  );

  return (
    <div
      aria-label="JSON 树传输数据"
      className="payload-json-tree min-h-0 flex-1 overflow-auto p-3"
    >
      <JSONTree
        collectionLimit={80}
        data={variant.content}
        hideRoot
        invertTheme={false}
        key={variant.id}
        labelRenderer={payloadLabelRenderer}
        shouldExpandNodeInitially={(keyPath, data, level) =>
          shouldExpandPayloadJsonNode(keyPath, data, level, expansion)
        }
        theme={payloadJsonTheme}
        valueRenderer={(valueAsString) => String(valueAsString)}
      />
    </div>
  );
}

function payloadExpansion(source: PayloadExpansionSpec): PayloadExpansionSpec {
  return {
    autoExpandDepth: source.autoExpandDepth,
    defaultCollapsedKeys: source.defaultCollapsedKeys,
    defaultExpandedKeys: source.defaultExpandedKeys,
  };
}

function payloadLabelRenderer(keyPath: KeyPath): ReactNode {
  const key = keyPath[0];
  const label = typeof key === "number" ? String(key) : `"${key}"`;

  return <span>{label}: </span>;
}
