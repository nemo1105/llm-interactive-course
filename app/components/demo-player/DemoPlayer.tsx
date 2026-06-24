import { Code2 } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { DemoPlayerState } from "../../lib/demo-player/player";
import type {
  DemoMessage,
  DemoSpec,
  PayloadVariantSpec,
  PayloadSpec,
  SequenceActorKind,
  SequenceActorSpec,
  SequenceLoopSpec,
  SequenceMessageKind,
  SequenceMessageSpec,
} from "../../lib/demo-player/types";
import { PayloadJsonTree } from "./PayloadJsonTree";
import { PayloadSseTree } from "./PayloadSseTree";

const actorTone: Record<SequenceActorKind, string> = {
  user: "border-sky-300 bg-sky-50 text-sky-950",
  server: "border-emerald-300 bg-emerald-50 text-emerald-950",
  model: "border-violet-300 bg-violet-50 text-violet-950",
  tool: "border-amber-300 bg-amber-50 text-amber-950",
  context: "border-cyan-300 bg-cyan-50 text-cyan-950",
  agent: "border-indigo-300 bg-indigo-50 text-indigo-950",
  gate: "border-rose-300 bg-rose-50 text-rose-950",
  metric: "border-slate-300 bg-slate-50 text-slate-950",
  memory: "border-teal-300 bg-teal-50 text-teal-950",
  skill: "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-950",
  environment: "border-lime-300 bg-lime-50 text-lime-950",
  channel: "border-blue-300 bg-blue-50 text-blue-950",
  connector: "border-purple-300 bg-purple-50 text-purple-950",
  scheduler: "border-stone-300 bg-stone-50 text-stone-950",
  file: "border-orange-300 bg-orange-50 text-orange-950",
  human: "border-pink-300 bg-pink-50 text-pink-950",
};

const messageTone: Record<
  SequenceMessageKind,
  {
    activeLine: string;
    activeLeftArrow: string;
    activeRightArrow: string;
    activeLabel: string;
  }
> = {
  message: {
    activeLine: "border-sky-600",
    activeLeftArrow: "border-r-sky-600",
    activeRightArrow: "border-l-sky-600",
    activeLabel: "border-sky-500 bg-sky-50 text-sky-950",
  },
  "api-request": {
    activeLine: "border-emerald-600",
    activeLeftArrow: "border-r-emerald-600",
    activeRightArrow: "border-l-emerald-600",
    activeLabel: "border-emerald-500 bg-emerald-50 text-emerald-950",
  },
  "api-response": {
    activeLine: "border-violet-600",
    activeLeftArrow: "border-r-violet-600",
    activeRightArrow: "border-l-violet-600",
    activeLabel: "border-violet-500 bg-violet-50 text-violet-950",
  },
  stream: {
    activeLine: "border-cyan-600",
    activeLeftArrow: "border-r-cyan-600",
    activeRightArrow: "border-l-cyan-600",
    activeLabel: "border-cyan-500 bg-cyan-50 text-cyan-950",
  },
  "tool-call": {
    activeLine: "border-amber-600",
    activeLeftArrow: "border-r-amber-600",
    activeRightArrow: "border-l-amber-600",
    activeLabel: "border-amber-500 bg-amber-50 text-amber-950",
  },
  "tool-result": {
    activeLine: "border-orange-600",
    activeLeftArrow: "border-r-orange-600",
    activeRightArrow: "border-l-orange-600",
    activeLabel: "border-orange-500 bg-orange-50 text-orange-950",
  },
  ui: {
    activeLine: "border-slate-700",
    activeLeftArrow: "border-r-slate-700",
    activeRightArrow: "border-l-slate-700",
    activeLabel: "border-slate-500 bg-slate-100 text-slate-950",
  },
  approval: {
    activeLine: "border-rose-600",
    activeLeftArrow: "border-r-rose-600",
    activeRightArrow: "border-l-rose-600",
    activeLabel: "border-rose-500 bg-rose-50 text-rose-950",
  },
  "channel-message": {
    activeLine: "border-blue-600",
    activeLeftArrow: "border-r-blue-600",
    activeRightArrow: "border-l-blue-600",
    activeLabel: "border-blue-500 bg-blue-50 text-blue-950",
  },
  "connector-auth": {
    activeLine: "border-purple-600",
    activeLeftArrow: "border-r-purple-600",
    activeRightArrow: "border-l-purple-600",
    activeLabel: "border-purple-500 bg-purple-50 text-purple-950",
  },
};

type PayloadFormat = "chat" | "responses";
type PayloadPlacement = "above" | "below" | "left" | "right";

type PayloadAnchor = {
  left: number;
  maxHeight: number;
  placement: PayloadPlacement;
  top: number;
  width: number;
};

type HoveredPayload = {
  payload: PayloadSpec;
  anchor: PayloadAnchor;
};

const activeSequenceScrollGap = 24;
const payloadPopoverGap = 12;
const payloadPopoverMargin = 16;
const payloadPopoverMinHeight = 160;
const payloadPopoverMinWidth = 320;
const payloadPopoverPreferredHeight = 420;
const payloadPopoverPreferredWidth = 544;
const chatMessageBottomGap = 24;
const payloadFormatStorageKey = "llm-interactive-share.payload-format";

export function DemoPlayer({ spec, state }: { spec: DemoSpec; state: DemoPlayerState }) {
  const payloadById = useMemo(
    () => new Map(spec.payloads.map((payload) => [payload.id, payload])),
    [spec.payloads],
  );

  return (
    <section className="grid min-h-0 flex-1 grid-rows-[minmax(15rem,0.42fr)_minmax(0,0.58fr)] gap-4 overflow-hidden px-4 py-4 sm:px-6 lg:grid-cols-[minmax(23rem,0.38fr)_minmax(0,0.62fr)] lg:grid-rows-1 lg:px-10">
      <ConversationPane spec={spec} state={state} />
      <SequencePane
        payloadById={payloadById}
        spec={spec}
        state={state}
      />
    </section>
  );
}

function ConversationPane({ spec, state }: { spec: DemoSpec; state: DemoPlayerState }) {
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const focusMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messageListRef.current;
    const message = focusMessageRef.current;

    if (!container || !message) {
      return;
    }

    const maxScrollTop = container.scrollHeight - container.clientHeight;

    if (maxScrollTop <= 1) {
      container.scrollTo({ top: 0 });
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const messageRect = message.getBoundingClientRect();
    const visibleBottom = containerRect.bottom - chatMessageBottomGap;
    const distanceToBottom = visibleBottom - messageRect.bottom;

    if (distanceToBottom >= 0 && distanceToBottom <= chatMessageBottomGap * 2) {
      return;
    }

    const targetScrollTop = container.scrollTop + messageRect.bottom - visibleBottom;

    container.scrollTo({
      behavior: "smooth",
      top: Math.min(Math.max(0, targetScrollTop), maxScrollTop),
    });
  }, [state.currentStepIndex, state.focusMessageId]);

  return (
    <section
      aria-label="正常对话区域"
      className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="shrink-0 border-b border-slate-200 px-5 py-4">
        <div className="text-sm font-semibold text-slate-700">{spec.conversationTitle}</div>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {state.currentFrame.subtitle ?? spec.conversationSubtitle}
        </p>
      </div>
      <div
        aria-label="聊天消息列表"
        className="grid min-h-0 flex-1 content-start gap-4 overflow-y-auto px-5 py-5"
        ref={messageListRef}
      >
        {state.currentFrame.messages.map((message) => (
          <MessageBubble
            active={message.id === state.focusMessageId}
            key={message.id}
            message={message}
            messageRef={message.id === state.focusMessageId ? focusMessageRef : undefined}
          />
        ))}
      </div>
    </section>
  );
}

function MessageBubble({
  active,
  message,
  messageRef,
}: {
  active: boolean;
  message: DemoMessage;
  messageRef?: RefObject<HTMLDivElement | null>;
}) {
  const isUser = message.role === "用户";

  return (
    <div
      className={[
        "min-w-0 max-w-[92%] rounded-lg border px-4 py-3 transition-all",
        isUser
          ? "justify-self-end border-sky-200 bg-sky-50"
          : "justify-self-start border-emerald-200 bg-emerald-50",
        active ? "ring-2 ring-orange-400 ring-offset-2" : "",
      ].join(" ")}
      ref={messageRef}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">{message.role}</p>
        {message.state ? (
          <span className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-medium text-slate-500">
            {message.state}
          </span>
        ) : null}
      </div>
      <p className="mt-2 break-words text-sm leading-6 text-slate-800">{message.text}</p>
      {message.streaming ? (
        <span
          aria-label="助手回复正在流式生成"
          className="mt-2 inline-block h-4 w-1 animate-pulse rounded-full bg-emerald-500 align-text-bottom"
        />
      ) : null}
    </div>
  );
}

function SequencePane({
  payloadById,
  spec,
  state,
}: {
  payloadById: Map<string, PayloadSpec>;
  spec: DemoSpec;
  state: DemoPlayerState;
}) {
  const [hoveredPayload, setHoveredPayload] = useState<HoveredPayload | undefined>();
  const hideTimerRef = useRef<number | undefined>(undefined);
  const isInteractingWithPayloadRef = useRef(false);
  const activeMessageRef = useRef<HTMLButtonElement | null>(null);
  const payloadPopoverRef = useRef<HTMLElement | null>(null);
  const previousStepIndexRef = useRef(state.currentStepIndex);
  const sequenceScrollRef = useRef<HTMLDivElement | null>(null);

  function clearHideTimer() {
    if (hideTimerRef.current !== undefined) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = undefined;
    }
  }

  function showPayload(payload: PayloadSpec | undefined, target: HTMLElement) {
    if (!payload) {
      return;
    }

    clearHideTimer();
    isInteractingWithPayloadRef.current = false;
    setHoveredPayload({
      payload,
      anchor: getPayloadAnchor(target.getBoundingClientRect()),
    });
  }

  function scheduleHidePayload({ respectFocus = true }: { respectFocus?: boolean } = {}) {
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      if (
        isInteractingWithPayloadRef.current ||
        (respectFocus && payloadPopoverRef.current?.contains(document.activeElement))
      ) {
        return;
      }

      setHoveredPayload(undefined);
    }, 700);
  }

  function keepPayloadVisible() {
    isInteractingWithPayloadRef.current = true;
    clearHideTimer();
  }

  function leavePayloadVisibleArea() {
    isInteractingWithPayloadRef.current = false;
    scheduleHidePayload({ respectFocus: false });
  }

  function hidePayload() {
    isInteractingWithPayloadRef.current = false;
    clearHideTimer();
    setHoveredPayload(undefined);
  }

  useEffect(() => {
    hidePayload();

    const previousStepIndex = previousStepIndexRef.current;
    previousStepIndexRef.current = state.currentStepIndex;

    if (state.currentStepIndex <= previousStepIndex) {
      return;
    }

    const activeMessage = activeMessageRef.current;
    const sequenceScroll = sequenceScrollRef.current;

    if (!activeMessage || !sequenceScroll) {
      return;
    }

    window.requestAnimationFrame(() => {
      scrollActiveSequenceMessageIntoView(activeMessage, sequenceScroll);
    });
  }, [state.currentStepIndex]);

  return (
    <section
      aria-label="时序图区域"
      className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-700">{spec.flowTitle}</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">{spec.flowSubtitle}</p>
        </div>
      </div>

      <div
        aria-label="时序图滚动区域"
        className="min-h-0 flex-1 overflow-auto p-4"
        ref={sequenceScrollRef}
      >
        <SequenceDiagram
          actors={state.visibleActors}
          activeActorIds={state.activeActorIds}
          activeMessageId={state.activeMessageId}
          activeMessageRef={activeMessageRef}
          loops={state.visibleLoops}
          messages={state.visibleMessages}
          payloadById={payloadById}
          onHidePayload={scheduleHidePayload}
          onShowPayload={showPayload}
        />
      </div>
      <PayloadPopover
        anchor={hoveredPayload?.anchor}
        key={hoveredPayload?.payload.id ?? "empty-payload"}
        onMouseEnter={keepPayloadVisible}
        onMouseLeave={leavePayloadVisibleArea}
        payload={hoveredPayload?.payload}
        popoverRef={payloadPopoverRef}
      />
    </section>
  );
}

function PayloadFormatToggle({
  format,
  onChange,
  tone = "light",
}: {
  format: PayloadFormat;
  onChange: (format: PayloadFormat) => void;
  tone?: "dark" | "light";
}) {
  const wrapperClass =
    tone === "dark"
      ? "inline-flex shrink-0 rounded-sm border border-white/10 bg-white/5 p-0.5"
      : "inline-flex shrink-0 rounded-sm border border-slate-200 bg-slate-50 p-0.5";
  const inactiveClass =
    tone === "dark" ? "text-slate-400 hover:bg-white/10" : "text-slate-500 hover:bg-white";

  return (
    <div aria-label="传输数据格式切换" className={wrapperClass}>
      <button
        aria-pressed={format === "chat"}
        className={[
          "rounded-[3px] px-1.5 py-0.5 text-[10px] font-medium leading-none transition-colors",
          format === "chat" ? "bg-white text-slate-950 shadow-sm" : inactiveClass,
        ].join(" ")}
        onClick={() => onChange("chat")}
        type="button"
      >
        Chat Completions
      </button>
      <button
        aria-pressed={format === "responses"}
        className={[
          "rounded-[3px] px-1.5 py-0.5 text-[10px] font-medium leading-none transition-colors",
          format === "responses" ? "bg-white text-slate-950 shadow-sm" : inactiveClass,
        ].join(" ")}
        onClick={() => onChange("responses")}
        type="button"
      >
        Responses API
      </button>
    </div>
  );
}

function SequenceDiagram({
  actors,
  activeActorIds,
  activeMessageId,
  activeMessageRef,
  messages,
  loops,
  payloadById,
  onHidePayload,
  onShowPayload,
}: {
  actors: SequenceActorSpec[];
  activeActorIds: string[];
  activeMessageId?: string;
  activeMessageRef: RefObject<HTMLButtonElement | null>;
  loops: SequenceLoopSpec[];
  messages: SequenceMessageSpec[];
  payloadById: Map<string, PayloadSpec>;
  onHidePayload: () => void;
  onShowPayload: (payload: PayloadSpec | undefined, target: HTMLElement) => void;
}) {
  const actorIndexById = useMemo(
    () => new Map(actors.map((actor, index) => [actor.id, index])),
    [actors],
  );
  const activeActorSet = new Set(activeActorIds);
  const rowHeight = 82;
  const bodyHeight = Math.max(messages.length, 1) * rowHeight + 30;
  const showBottomActors = messages.length >= 5;

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50">
      <div className="min-w-[41rem] px-4 pb-5 pt-4">
        <SequenceActorRow
          activeActorSet={activeActorSet}
          actors={actors}
          label="时序图顶部参与者"
        />

        <div className="relative mt-3" style={{ height: `${bodyHeight}px` }}>
          {actors.map((actor, index) => (
            <Lifeline
              active={activeActorSet.has(actor.id)}
              actorCount={actors.length}
              index={index}
              key={actor.id}
            />
          ))}
          {messages.length === 0 ? (
            <div className="absolute inset-x-0 top-8 text-center text-sm text-slate-500">
              当前步骤还没有传输事件。
            </div>
          ) : null}
          {loops.map((loop) => (
            <SequenceLoopMarker
              key={loop.id}
              loop={loop}
              messages={messages}
              rowHeight={rowHeight}
            />
          ))}
          {messages.map((message, index) => {
            const fromIndex = actorIndexById.get(message.from);
            const toIndex = actorIndexById.get(message.to);

            if (fromIndex === undefined || toIndex === undefined) {
              return null;
            }

            return (
              <SequenceMessage
                actorCount={actors.length}
                active={message.id === activeMessageId}
                activeMessageRef={activeMessageRef}
                fromIndex={fromIndex}
                key={message.id}
                message={message}
                onHidePayload={onHidePayload}
                onShowPayload={onShowPayload}
                payload={message.payloadId ? payloadById.get(message.payloadId) : undefined}
                rowHeight={rowHeight}
                rowIndex={index}
                toIndex={toIndex}
              />
            );
          })}
        </div>
        {showBottomActors ? (
          <SequenceActorRow
            activeActorSet={activeActorSet}
            actors={actors}
            label="时序图底部参与者"
            position="bottom"
          />
        ) : null}
      </div>
    </div>
  );
}

function SequenceLoopMarker({
  loop,
  messages,
  rowHeight,
}: {
  loop: SequenceLoopSpec;
  messages: SequenceMessageSpec[];
  rowHeight: number;
}) {
  const loopIndexes = loop.messageIds
    .map((messageId) => messages.findIndex((message) => message.id === messageId))
    .filter((index) => index >= 0);

  if (loopIndexes.length === 0) {
    return null;
  }

  const firstIndex = Math.min(...loopIndexes);
  const lastIndex = Math.max(...loopIndexes);
  const top = firstIndex * rowHeight + 4;
  const height = (lastIndex - firstIndex + 1) * rowHeight + 4;

  return (
    <div
      aria-label={`循环标记：${loop.label}`}
      className="pointer-events-none absolute inset-x-2 rounded-lg border-2 border-dashed border-cyan-300 bg-cyan-50/35"
      style={{ height: `${height}px`, top: `${top}px` }}
    >
      <span className="absolute -top-3 left-3 rounded bg-cyan-100 px-2 py-0.5 text-[0.65rem] font-semibold text-cyan-900 shadow-sm">
        loop: {loop.label}
      </span>
    </div>
  );
}

function SequenceActorRow({
  activeActorSet,
  actors,
  label,
  position = "top",
}: {
  activeActorSet: Set<string>;
  actors: SequenceActorSpec[];
  label: string;
  position?: "bottom" | "top";
}) {
  return (
    <div
      aria-label={label}
      className={[
        "grid gap-4",
        position === "bottom" ? "mt-3 border-t border-slate-200 pt-3" : "",
      ].join(" ")}
      style={{ gridTemplateColumns: `repeat(${actors.length}, minmax(9rem, 1fr))` }}
    >
      {actors.map((actor) => (
        <SequenceActor
          actor={actor}
          active={activeActorSet.has(actor.id)}
          key={actor.id}
          position={position}
        />
      ))}
    </div>
  );
}

function SequenceActor({
  actor,
  active,
  position = "top",
}: {
  actor: SequenceActorSpec;
  active: boolean;
  position?: "bottom" | "top";
}) {
  const isBottom = position === "bottom";

  return (
    <div
      className={[
        "rounded-lg border text-center shadow-sm transition-all",
        isBottom ? "px-3 py-2" : "px-3 py-3",
        actorTone[actor.kind],
        active ? "ring-2 ring-emerald-400 ring-offset-2" : "",
      ].join(" ")}
    >
      <div className={isBottom ? "text-xs font-semibold" : "text-sm font-semibold"}>
        {actor.label}
      </div>
      <div
        className={[
          "mx-auto h-1 rounded-full transition-colors",
          isBottom ? "mt-2 w-10" : "mt-3 w-14",
          active ? "bg-emerald-500" : "bg-slate-200",
        ].join(" ")}
      />
    </div>
  );
}

function Lifeline({
  active,
  actorCount,
  index,
}: {
  active: boolean;
  actorCount: number;
  index: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        "absolute top-0 bottom-0 border-l-2 border-dashed",
        active ? "border-emerald-300" : "border-slate-300",
      ].join(" ")}
      style={{ left: `${actorCenterPercent(index, actorCount)}%` }}
    />
  );
}

function SequenceMessage({
  active,
  activeMessageRef,
  actorCount,
  fromIndex,
  message,
  onHidePayload,
  onShowPayload,
  payload,
  rowHeight,
  rowIndex,
  toIndex,
}: {
  active: boolean;
  activeMessageRef: RefObject<HTMLButtonElement | null>;
  actorCount: number;
  fromIndex: number;
  message: SequenceMessageSpec;
  onHidePayload: () => void;
  onShowPayload: (payload: PayloadSpec | undefined, target: HTMLElement) => void;
  payload?: PayloadSpec;
  rowHeight: number;
  rowIndex: number;
  toIndex: number;
}) {
  const fromPercent = actorCenterPercent(fromIndex, actorCount);
  const toPercent = actorCenterPercent(toIndex, actorCount);
  const leftPercent = Math.min(fromPercent, toPercent);
  const widthPercent = Math.abs(toPercent - fromPercent);
  const middlePercent = leftPercent + widthPercent / 2;
  const isForward = toPercent > fromPercent;
  const tone = messageTone[message.kind];
  const lineClass = active ? tone.activeLine : "border-slate-400";
  const labelClass = active
    ? tone.activeLabel
    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400";
  const arrowClass = isForward
    ? [
        "absolute -right-1 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[5px] border-l-[9px] border-y-transparent",
        active ? tone.activeRightArrow : "border-l-slate-400",
      ].join(" ")
    : [
        "absolute -left-1 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[5px] border-r-[9px] border-y-transparent",
        active ? tone.activeLeftArrow : "border-r-slate-400",
      ].join(" ");

  return (
    <div
      className="absolute inset-x-0"
      style={{ height: `${rowHeight}px`, top: `${rowIndex * rowHeight}px` }}
    >
      <div
        aria-hidden="true"
        className={[
          "absolute top-[3rem] border-t-2 transition-colors",
          lineClass,
          active ? "shadow-[0_0_0_3px_rgba(16,185,129,0.1)]" : "",
        ].join(" ")}
        style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
      >
        <span className={arrowClass} />
      </div>

      <div className="absolute top-3 -translate-x-1/2" style={{ left: `${middlePercent}%` }}>
        <button
          className={[
            "max-w-44 rounded-md border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
            labelClass,
          ].join(" ")}
          onBlur={onHidePayload}
          onFocus={(event) => onShowPayload(payload, event.currentTarget)}
          onMouseEnter={(event) => onShowPayload(payload, event.currentTarget)}
          onMouseLeave={onHidePayload}
          ref={active ? activeMessageRef : undefined}
          type="button"
        >
          {message.label}
        </button>
      </div>
    </div>
  );
}

function PayloadPopover({
  anchor,
  onMouseEnter,
  onMouseLeave,
  payload,
  popoverRef,
}: {
  anchor?: PayloadAnchor;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  payload?: PayloadSpec;
  popoverRef: RefObject<HTMLElement | null>;
}) {
  const [payloadFormat, setPayloadFormat] = useState<PayloadFormat>(readStoredPayloadFormat);
  const variant = payload ? selectPayloadVariant(payload, payloadFormat) : undefined;
  const showFormatToggle = payload ? hasApiFormatVariants(payload) : false;
  const lockHeight =
    showFormatToggle && Boolean(anchor && anchor.maxHeight < payloadPopoverPreferredHeight);

  function changePayloadFormat(format: PayloadFormat) {
    setPayloadFormat(format);
    writeStoredPayloadFormat(format);
  }

  if (!payload || !variant || !anchor) {
    return null;
  }

  return (
    <aside
      aria-label="当前传输数据"
      className={[
        "fixed z-[100] flex max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-950 p-3 text-white shadow-2xl",
        payloadPlacementTransform[anchor.placement],
      ].join(" ")}
      onFocus={onMouseEnter}
      onMouseDown={onMouseEnter}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={popoverRef}
      style={{
        height: lockHeight ? `${anchor.maxHeight}px` : undefined,
        left: `${anchor.left}px`,
        maxHeight: `${anchor.maxHeight}px`,
        top: `${anchor.top}px`,
        width: `${anchor.width}px`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
            <Code2 aria-hidden="true" className="size-4" />
            当前传输数据
          </div>
          <h2 className="mt-2 text-sm font-semibold">{payload.title}</h2>
        </div>
        {showFormatToggle ? (
          <PayloadFormatToggle
            format={payloadFormat}
            onChange={changePayloadFormat}
            tone="dark"
          />
        ) : null}
      </div>
      <section
        className={[
          "mt-3 flex min-h-0 flex-col overflow-hidden rounded-md border border-white/10 bg-black/30",
          lockHeight ? "flex-1" : "",
        ].join(" ")}
      >
        {variant.language === "json" ? (
          <PayloadJsonTree
            payload={payload}
            variant={variant}
          />
        ) : variant.language === "sse" ? (
          <PayloadSseTree
            payload={payload}
            variant={variant}
          />
        ) : (
          <pre
            className={[
              "min-h-0 overflow-auto whitespace-pre-wrap break-words p-3 text-xs leading-5 text-slate-100",
              lockHeight ? "flex-1" : "",
            ].join(" ")}
          >
            {variant.content}
          </pre>
        )}
      </section>
    </aside>
  );
}

const payloadPlacementTransform: Record<PayloadPlacement, string> = {
  above: "-translate-x-1/2 -translate-y-full",
  below: "-translate-x-1/2",
  left: "-translate-x-full -translate-y-1/2",
  right: "-translate-y-1/2",
};

function scrollActiveSequenceMessageIntoView(
  activeMessage: HTMLElement,
  sequenceScroll: HTMLElement,
) {
  const containerRect = sequenceScroll.getBoundingClientRect();
  const rect = activeMessage.getBoundingClientRect();
  const topGuard = containerRect.top + activeSequenceScrollGap;
  const bottomGuard = containerRect.bottom - activeSequenceScrollGap;

  if (rect.top >= topGuard && rect.bottom <= bottomGuard) {
    return;
  }

  const availableHeight = Math.max(80, bottomGuard - topGuard);
  const targetCenter = topGuard + availableHeight / 2;
  const messageCenter = rect.top + rect.height / 2;
  const targetScrollTop = sequenceScroll.scrollTop + messageCenter - targetCenter;
  const maxScrollTop = sequenceScroll.scrollHeight - sequenceScroll.clientHeight;

  sequenceScroll.scrollTo({
    behavior: "smooth",
    top: Math.min(Math.max(0, targetScrollTop), maxScrollTop),
  });
}

function getPayloadAnchor(rect: DOMRect): PayloadAnchor {
  const safeBounds = getPayloadSafeBounds();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const viewportWidth = window.innerWidth;
  const fullWidth = viewportWidth - payloadPopoverMargin * 2;
  const horizontalWidth = Math.min(payloadPopoverPreferredWidth, fullWidth);
  const rightWidth = Math.min(
    payloadPopoverPreferredWidth,
    Math.max(0, viewportWidth - rect.right - payloadPopoverGap - payloadPopoverMargin),
  );
  const leftWidth = Math.min(
    payloadPopoverPreferredWidth,
    Math.max(0, rect.left - payloadPopoverGap - payloadPopoverMargin),
  );
  const verticalHeight = safeBounds.bottom - safeBounds.top;
  const belowHeight = safeBounds.bottom - rect.bottom - payloadPopoverGap;
  const aboveHeight = rect.top - payloadPopoverGap - safeBounds.top;
  const candidates = [
    buildSidePayloadAnchor("right", rect.right + payloadPopoverGap, centerY, rightWidth, verticalHeight, safeBounds),
    buildSidePayloadAnchor("left", rect.left - payloadPopoverGap, centerY, leftWidth, verticalHeight, safeBounds),
    buildVerticalPayloadAnchor("below", centerX, rect.bottom + payloadPopoverGap, horizontalWidth, belowHeight),
    buildVerticalPayloadAnchor("above", centerX, rect.top - payloadPopoverGap, horizontalWidth, aboveHeight),
  ];
  const validCandidates = candidates.filter(
    (candidate) =>
      candidate.anchor.width >= payloadPopoverMinWidth &&
      candidate.anchor.maxHeight >= payloadPopoverMinHeight,
  );
  const bestCandidate = (validCandidates.length > 0 ? validCandidates : candidates).reduce(
    (best, candidate) => (candidate.score > best.score ? candidate : best),
  );

  return bestCandidate.anchor;
}

function buildSidePayloadAnchor(
  placement: Extract<PayloadPlacement, "left" | "right">,
  left: number,
  centerY: number,
  width: number,
  availableHeight: number,
  safeBounds: { bottom: number; top: number },
): { anchor: PayloadAnchor; score: number } {
  const maxHeight = Math.max(120, Math.min(payloadPopoverPreferredHeight, availableHeight));
  const top = clamp(centerY, safeBounds.top + maxHeight / 2, safeBounds.bottom - maxHeight / 2);
  const readableWidth = Math.max(0, width);
  const sideSpaceBonus =
    readableWidth >= payloadPopoverMinWidth && maxHeight >= payloadPopoverMinHeight
      ? payloadPopoverPreferredWidth * payloadPopoverMinHeight * 0.45
      : 0;

  return {
    anchor: {
      left,
      maxHeight,
      placement,
      top,
      width: Math.max(payloadPopoverMinWidth, readableWidth),
    },
    score: readableWidth * maxHeight + sideSpaceBonus,
  };
}

function buildVerticalPayloadAnchor(
  placement: Extract<PayloadPlacement, "above" | "below">,
  centerX: number,
  top: number,
  width: number,
  availableHeight: number,
): { anchor: PayloadAnchor; score: number } {
  const maxHeight = Math.max(120, Math.min(payloadPopoverPreferredHeight, availableHeight));
  const resolvedWidth = Math.max(payloadPopoverMinWidth, width);
  const halfWidth = resolvedWidth / 2;
  const left = clamp(
    centerX,
    payloadPopoverMargin + halfWidth,
    window.innerWidth - payloadPopoverMargin - halfWidth,
  );

  return {
    anchor: {
      left,
      maxHeight,
      placement,
      top,
      width: resolvedWidth,
    },
    score: Math.max(0, Math.min(payloadPopoverPreferredHeight, availableHeight)) * resolvedWidth,
  };
}

function getPayloadSafeBounds(): { bottom: number; top: number } {
  const toolbar = document.querySelector<HTMLElement>('[aria-label="演示顶部工具栏"]');
  const toolbarRect = toolbar?.getBoundingClientRect();
  const top = toolbarRect
    ? Math.max(payloadPopoverMargin, toolbarRect.bottom + payloadPopoverGap)
    : payloadPopoverMargin;

  return {
    bottom: window.innerHeight - payloadPopoverMargin,
    top,
  };
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function selectPayloadVariant(
  payload: PayloadSpec,
  payloadFormat: PayloadFormat,
): PayloadVariantSpec | undefined {
  const preferredLabel = payloadFormat === "chat" ? "chat completions" : "responses";
  const preferredVariant = payload.variants.find((variant) =>
    variant.label.toLowerCase().includes(preferredLabel),
  );

  return preferredVariant ?? payload.variants[0];
}

function readStoredPayloadFormat(): PayloadFormat {
  if (typeof window === "undefined") {
    return "chat";
  }

  try {
    const storedFormat = window.localStorage.getItem(payloadFormatStorageKey);

    return storedFormat === "responses" ? "responses" : "chat";
  } catch {
    return "chat";
  }
}

function writeStoredPayloadFormat(format: PayloadFormat) {
  try {
    window.localStorage.setItem(payloadFormatStorageKey, format);
  } catch {
    // localStorage can be unavailable in private or restricted contexts.
  }
}

function hasApiFormatVariants(payload: PayloadSpec): boolean {
  const labels = payload.variants.map((variant) => variant.label.toLowerCase());

  return (
    labels.some((label) => label.includes("chat completions")) &&
    labels.some((label) => label.includes("responses"))
  );
}

function actorCenterPercent(index: number, actorCount: number): number {
  return ((index + 0.5) / actorCount) * 100;
}
