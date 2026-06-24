import {
  resolvePayloadExpansion,
} from "../../lib/demo-player/payload-tree";
import { parseSsePayload } from "../../lib/demo-player/sse";
import type {
  PayloadExpansionSpec,
  PayloadSpec,
  SsePayloadVariantSpec,
} from "../../lib/demo-player/types";
import { PayloadJsonValueTree } from "./PayloadJsonTree";

export function PayloadSseTree({
  payload,
  variant,
}: {
  payload: PayloadSpec;
  variant: SsePayloadVariantSpec;
}) {
  const events = parseSsePayload(variant.content);
  const expansion = resolvePayloadExpansion(
    payloadExpansion(payload),
    payloadExpansion(variant),
  );

  return (
    <div
      aria-label="SSE 事件传输数据"
      className="min-h-0 flex-1 overflow-auto p-3"
    >
      <div className="grid gap-3">
        {events.map((event, index) => (
          <section
            className="overflow-hidden rounded-md border border-white/10 bg-slate-950/70"
            key={`${event.event}-${index}`}
          >
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/5 px-3 py-2">
              <span className="rounded bg-cyan-400/15 px-2 py-0.5 text-[0.65rem] font-semibold text-cyan-100">
                SSE event
              </span>
              <span className="break-all text-xs font-semibold text-slate-100">
                {event.event}
              </span>
              {event.id ? (
                <span className="text-[0.65rem] text-slate-400">id: {event.id}</span>
              ) : null}
              {event.retry ? (
                <span className="text-[0.65rem] text-slate-400">retry: {event.retry}</span>
              ) : null}
            </div>
            {event.dataJson !== undefined ? (
              <PayloadJsonValueTree
                ariaLabel="SSE data JSON"
                data={event.dataJson}
                expansion={expansion}
                treeKey={`${variant.id}-${index}`}
              />
            ) : (
              <pre className="whitespace-pre-wrap break-words p-3 text-xs leading-5 text-slate-100">
                {event.data}
              </pre>
            )}
          </section>
        ))}
      </div>
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
