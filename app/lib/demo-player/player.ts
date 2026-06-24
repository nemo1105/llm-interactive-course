import type {
  ConversationFrame,
  DemoSpec,
  DemoStep,
  DemoValidationIssue,
  PayloadSpec,
  SequenceActorSpec,
  SequenceLoopSpec,
  SequenceMessageSpec,
} from "./types";

export type DemoPlayerState = {
  currentStepIndex: number;
  currentStep: DemoStep;
  currentFrame: ConversationFrame;
  visibleActors: SequenceActorSpec[];
  visibleLoops: SequenceLoopSpec[];
  visibleMessages: SequenceMessageSpec[];
  activeActorIds: string[];
  activeMessageId?: string;
  activePayload?: PayloadSpec;
  focusMessageId?: string;
};

export function clampStepIndex(spec: DemoSpec, stepIndex: number): number {
  return Math.min(Math.max(stepIndex, 0), Math.max(spec.steps.length - 1, 0));
}

export function buildDemoPlayerState(spec: DemoSpec, stepIndex: number): DemoPlayerState {
  const currentStepIndex = clampStepIndex(spec, stepIndex);
  const currentStep = spec.steps[currentStepIndex] ?? spec.steps[0];
  const currentFrame =
    spec.frames.find((frame) => frame.id === currentStep?.leftFrameId) ?? spec.frames[0];

  const visibleMessageIds = new Set<string>();

  for (const step of spec.steps.slice(0, currentStepIndex + 1)) {
    for (const messageId of step.revealMessageIds ?? []) {
      visibleMessageIds.add(messageId);
    }
  }

  const visibleMessages = spec.messages.filter((message) => visibleMessageIds.has(message.id));
  const visibleLoops = (spec.loops ?? [])
    .map((loop) => ({
      ...loop,
      messageIds: loop.messageIds.filter((messageId) => visibleMessageIds.has(messageId)),
    }))
    .filter((loop) => loop.messageIds.length > 0);
  const activeMessage = currentStep?.activeMessageId
    ? spec.messages.find((message) => message.id === currentStep.activeMessageId)
    : undefined;
  const activePayloadId = currentStep?.payloadId ?? activeMessage?.payloadId;
  const activePayload = activePayloadId
    ? spec.payloads.find((payload) => payload.id === activePayloadId)
    : undefined;

  return {
    currentStepIndex,
    currentStep,
    currentFrame,
    visibleActors: spec.actors,
    visibleLoops,
    visibleMessages,
    activeActorIds:
      currentStep?.activeActorIds ?? (activeMessage ? [activeMessage.from, activeMessage.to] : []),
    activeMessageId: currentStep?.activeMessageId,
    activePayload,
    focusMessageId: currentStep?.focusMessageId,
  };
}

export function validateDemoSpec(spec: DemoSpec): DemoValidationIssue[] {
  const issues: DemoValidationIssue[] = [];

  if (spec.steps.length === 0 || spec.frames.length === 0 || spec.actors.length === 0) {
    issues.push({
      code: "empty-demo",
      detail: `${spec.id} 必须包含 steps、frames 和 actors。`,
    });
  }

  const frameIds = new Set(spec.frames.map((frame) => frame.id));
  const actorIds = new Set(spec.actors.map((actor) => actor.id));
  const messageIds = new Set(spec.messages.map((message) => message.id));
  const payloadIds = new Set(spec.payloads.map((payload) => payload.id));

  for (const payload of spec.payloads) {
    if (payload.variants.length === 0) {
      issues.push({
        code: "missing-payload",
        detail: `${spec.id}/${payload.id} 至少需要一个 payload variant。`,
      });
    }
  }

  for (const step of spec.steps) {
    if (!frameIds.has(step.leftFrameId)) {
      issues.push({
        code: "missing-frame",
        detail: `${spec.id}/${step.id} 引用了不存在的 leftFrameId: ${step.leftFrameId}`,
      });
    }

    const frame = spec.frames.find((candidate) => candidate.id === step.leftFrameId);
    if (frame && !frame.messages.some((message) => message.id === step.focusMessageId)) {
      issues.push({
        code: "missing-frame",
        detail: `${spec.id}/${step.id} 引用了当前 frame 中不存在的 focusMessageId: ${step.focusMessageId}`,
      });
    }

    for (const actorId of step.activeActorIds ?? []) {
      if (!actorIds.has(actorId)) {
        issues.push({
          code: "missing-actor",
          detail: `${spec.id}/${step.id} 引用了不存在的 actorId: ${actorId}`,
        });
      }
    }

    for (const messageId of step.revealMessageIds ?? []) {
      if (!messageIds.has(messageId)) {
        issues.push({
          code: "missing-message",
          detail: `${spec.id}/${step.id} 引用了不存在的 messageId: ${messageId}`,
        });
      }
    }

    if (step.activeMessageId && !messageIds.has(step.activeMessageId)) {
      issues.push({
        code: "missing-message",
        detail: `${spec.id}/${step.id} 引用了不存在的 activeMessageId: ${step.activeMessageId}`,
      });
    }

    if (step.payloadId && !payloadIds.has(step.payloadId)) {
      issues.push({
        code: "missing-payload",
        detail: `${spec.id}/${step.id} 引用了不存在的 payloadId: ${step.payloadId}`,
      });
    }
  }

  for (const actor of spec.actors) {
    if (actor.payloadId && !payloadIds.has(actor.payloadId)) {
      issues.push({
        code: "missing-payload",
        detail: `${spec.id}/${actor.id} 引用了不存在的 payloadId: ${actor.payloadId}`,
      });
    }
  }

  for (const message of spec.messages) {
    if (!actorIds.has(message.from)) {
      issues.push({
        code: "missing-actor",
        detail: `${spec.id}/${message.id} 引用了不存在的 from: ${message.from}`,
      });
    }
    if (!actorIds.has(message.to)) {
      issues.push({
        code: "missing-actor",
        detail: `${spec.id}/${message.id} 引用了不存在的 to: ${message.to}`,
      });
    }
    if (message.payloadId && !payloadIds.has(message.payloadId)) {
      issues.push({
        code: "missing-payload",
        detail: `${spec.id}/${message.id} 引用了不存在的 payloadId: ${message.payloadId}`,
      });
    }
  }

  for (const loop of spec.loops ?? []) {
    if (loop.messageIds.length === 0) {
      issues.push({
        code: "missing-message",
        detail: `${spec.id}/${loop.id} 必须至少引用一条时序消息。`,
      });
    }

    for (const messageId of loop.messageIds) {
      if (!messageIds.has(messageId)) {
        issues.push({
          code: "missing-message",
          detail: `${spec.id}/${loop.id} 引用了不存在的 loop messageId: ${messageId}`,
        });
      }
    }
  }

  return issues;
}
