export type SequenceActorKind =
  | "user"
  | "server"
  | "model"
  | "tool"
  | "context"
  | "agent"
  | "gate"
  | "metric";

export type SequenceMessageKind =
  | "message"
  | "api-request"
  | "api-response"
  | "tool-call"
  | "tool-result"
  | "ui";

export type DemoMessageRole = "用户" | "助手" | "系统" | "工具" | "应用";

export type DemoMessage = {
  id: string;
  role: DemoMessageRole;
  text: string;
  state?: "已发送" | "思考中" | "已回复" | "已写入" | "已执行";
};

export type ConversationFrame = {
  id: string;
  title?: string;
  subtitle?: string;
  messages: DemoMessage[];
};

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type PayloadExpansionSpec = {
  autoExpandDepth?: number;
  defaultCollapsedKeys?: string[];
  defaultExpandedKeys?: string[];
};

export type JsonPayloadVariantSpec = PayloadExpansionSpec & {
  id: string;
  label: string;
  language: "json";
  content: JsonValue;
};

export type TextPayloadVariantSpec = {
  id: string;
  label: string;
  language: "text";
  content: string;
};

export type PayloadVariantSpec = JsonPayloadVariantSpec | TextPayloadVariantSpec;

export type PayloadSpec = PayloadExpansionSpec & {
  id: string;
  title: string;
  variants: PayloadVariantSpec[];
};

export type SequenceActorSpec = {
  id: string;
  label: string;
  kind: SequenceActorKind;
  description?: string;
  payloadId?: string;
};

export type SequenceMessageSpec = {
  id: string;
  from: string;
  to: string;
  label: string;
  kind: SequenceMessageKind;
  description?: string;
  payloadId?: string;
};

export type DemoStep = {
  id: string;
  title: string;
  description: string;
  leftFrameId: string;
  focusMessageId: string;
  revealMessageIds?: string[];
  activeActorIds?: string[];
  activeMessageId?: string;
  payloadId?: string;
};

export type DemoSpec = {
  id: string;
  title: string;
  shortTitle: string;
  route: string;
  nextRoute?: string;
  summary: string;
  outcome: string;
  conversationTitle: string;
  conversationSubtitle: string;
  flowTitle: string;
  flowSubtitle: string;
  actors: SequenceActorSpec[];
  messages: SequenceMessageSpec[];
  frames: ConversationFrame[];
  payloads: PayloadSpec[];
  steps: DemoStep[];
};

export type DemoValidationIssue = {
  code:
    | "missing-step"
    | "missing-frame"
    | "missing-actor"
    | "missing-message"
    | "missing-payload"
    | "empty-demo";
  detail: string;
};
