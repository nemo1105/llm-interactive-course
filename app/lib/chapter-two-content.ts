import type { CourseChapter } from "./course-content";
import type { DemoSpec, JsonValue, PayloadSpec } from "./demo-player/types";

const apiModel = "gpt-5.5";
const systemInstruction = "You are a helpful assistant.";
const conversationId = "004";

const firstQuestion = "明天下午我要去上海客户现场，出门要带伞吗？";
const firstAnswer =
  "建议带伞。2026-06-24 下午上海小雨转中雨，22-25℃，降水概率 82%。如果你要去客户现场，最好带一把折叠伞，并把路上时间留宽一点。";
const followUpQuestion = "那我还需要提前多久出门？";
const followUpAnswer =
  "建议比平时多预留 20 分钟。前面这次行程是明天下午去上海客户现场，而且天气是小雨转中雨，路面和打车等待都可能变慢；如果原本 14:30 出发，建议改到 14:10 左右。";

function json(value: JsonValue): JsonValue {
  return value;
}

function payload(id: string, title: string, variants: PayloadSpec["variants"]): PayloadSpec {
  return { id, title, variants };
}

function chatTextResponse(id: string, answer: string): JsonValue {
  return {
    id,
    object: "chat.completion",
    created: 1782259200,
    model: apiModel,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: answer,
          refusal: null,
          annotations: [],
        },
        logprobs: null,
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 72,
      completion_tokens: 58,
      total_tokens: 130,
    },
  };
}

function responsesTextResponse(id: string, messageId: string, answer: string): JsonValue {
  return {
    id,
    object: "response",
    created_at: 1782259200,
    status: "completed",
    model: apiModel,
    output: [
      {
        type: "message",
        id: messageId,
        status: "completed",
        role: "assistant",
        content: [
          {
            type: "output_text",
            text: answer,
            annotations: [],
          },
        ],
      },
    ],
    store: false,
    usage: {
      input_tokens: 72,
      output_tokens: 58,
      total_tokens: 130,
    },
  };
}

const firstAppMessageVariants = [
  {
    id: "history-first-app-message",
    label: "应用内部 JSON",
    language: "json",
    content: json({
      conversation_id: conversationId,
      message: firstQuestion,
    }),
  },
] satisfies PayloadSpec["variants"];

const firstRequestVariants = [
  {
    id: "history-first-chat-request",
    label: "Chat Completions request",
    language: "json",
    content: json({
      model: apiModel,
      messages: [
        {
          role: "system",
          content: systemInstruction,
        },
        {
          role: "user",
          content: firstQuestion,
        },
      ],
    }),
  },
  {
    id: "history-first-responses-request",
    label: "Responses API request",
    language: "json",
    content: json({
      model: apiModel,
      instructions: systemInstruction,
      input: firstQuestion,
      store: false,
    }),
  },
] satisfies PayloadSpec["variants"];

const firstResponseVariants = [
  {
    id: "history-first-chat-response",
    label: "Chat Completions response",
    language: "json",
    content: json(chatTextResponse("chatcmpl-ch02-first", firstAnswer)),
  },
  {
    id: "history-first-responses-response",
    label: "Responses API response",
    language: "json",
    content: json(responsesTextResponse("resp_ch02_first", "msg_ch02_first", firstAnswer)),
  },
] satisfies PayloadSpec["variants"];

const firstUiUpdateVariants = [
  {
    id: "history-first-ui-update",
    label: "应用内部 JSON",
    language: "json",
    content: json({
      conversation_id: conversationId,
      append_message: {
        id: "002",
        role: "assistant",
        content: firstAnswer,
      },
      visible_to_user: true,
    }),
  },
] satisfies PayloadSpec["variants"];

const followUpAppMessageVariants = [
  {
    id: "history-followup-app-message",
    label: "应用内部 JSON",
    language: "json",
    content: json({
      conversation_id: conversationId,
      message: followUpQuestion,
    }),
  },
] satisfies PayloadSpec["variants"];

const followUpRequestVariants = [
  {
    id: "history-followup-chat-request",
    label: "Chat Completions request",
    language: "json",
    content: json({
      model: apiModel,
      messages: [
        {
          role: "system",
          content: systemInstruction,
        },
        {
          role: "user",
          content: firstQuestion,
        },
        {
          role: "assistant",
          content: firstAnswer,
        },
        {
          role: "user",
          content: followUpQuestion,
        },
      ],
    }),
    autoExpandDepth: 3,
  },
  {
    id: "history-followup-responses-request",
    label: "Responses API request",
    language: "json",
    content: json({
      model: apiModel,
      instructions: systemInstruction,
      input: [
        {
          role: "user",
          content: firstQuestion,
        },
        {
          role: "assistant",
          content: firstAnswer,
        },
        {
          role: "user",
          content: followUpQuestion,
        },
      ],
      store: false,
    }),
    autoExpandDepth: 3,
  },
] satisfies PayloadSpec["variants"];

const followUpResponseVariants = [
  {
    id: "history-followup-chat-response",
    label: "Chat Completions response",
    language: "json",
    content: json(chatTextResponse("chatcmpl-ch02-followup", followUpAnswer)),
  },
  {
    id: "history-followup-responses-response",
    label: "Responses API response",
    language: "json",
    content: json(
      responsesTextResponse("resp_ch02_followup", "msg_ch02_followup", followUpAnswer),
    ),
  },
] satisfies PayloadSpec["variants"];

const followUpUiUpdateVariants = [
  {
    id: "history-followup-ui-update",
    label: "应用内部 JSON",
    language: "json",
    content: json({
      conversation_id: conversationId,
      append_message: {
        id: "004",
        role: "assistant",
        content: followUpAnswer,
      },
      visible_to_user: true,
    }),
  },
] satisfies PayloadSpec["variants"];

const historyReplayDemo = {
  id: "history-replay",
  title: "多轮对话演示",
  shortTitle: "多轮对话",
  route: "/chapters/02/demos/history-replay",
  nextRoute: "/chapters/02",
  summary: "在第一章普通对话路径上再增加一轮追问，展示应用服务器如何把历史消息放进第二次模型请求。",
  outcome: "模型不是记住了网页聊天，而是第二次模型调用看到了应用服务器提供的历史 messages。",
  conversationTitle: "聊天窗口",
  conversationSubtitle: "左侧只展示用户真实看到的两轮聊天；右侧展示应用服务器如何构造两次模型请求。",
  flowTitle: "多轮对话时序图",
  flowSubtitle: "参与者仍然是用户、应用服务器、大模型；历史只是第二次请求 payload 里的 messages。",
  actors: [
    {
      id: "history-user",
      label: "用户",
      kind: "user",
    },
    {
      id: "history-server",
      label: "应用服务器",
      kind: "server",
    },
    {
      id: "history-model",
      label: "大模型",
      kind: "model",
    },
  ],
  messages: [
    {
      id: "history-first-user-server",
      from: "history-user",
      to: "history-server",
      label: "发送第一轮消息",
      kind: "api-request",
      description: "第一轮用户消息先进入应用服务器。",
      payloadId: "history-first-send-message",
    },
    {
      id: "history-first-server-model",
      from: "history-server",
      to: "history-model",
      label: "请求大模型",
      kind: "api-request",
      description: "应用服务器把第一轮用户消息组装成模型请求。",
      payloadId: "history-first-model-request",
    },
    {
      id: "history-first-model-server",
      from: "history-model",
      to: "history-server",
      label: "返回第一轮响应",
      kind: "api-response",
      description: "大模型返回关于上海客户现场天气的回答。",
      payloadId: "history-first-model-response",
    },
    {
      id: "history-first-server-user",
      from: "history-server",
      to: "history-user",
      label: "展示第一轮回答",
      kind: "ui",
      description: "应用服务器把第一轮助手消息写回聊天界面。",
      payloadId: "history-first-ui-update",
    },
    {
      id: "history-followup-user-server",
      from: "history-user",
      to: "history-server",
      label: "发送第二轮追问",
      kind: "api-request",
      description: "用户用“那”追问上一轮上海客户现场出行问题。",
      payloadId: "history-followup-send-message",
    },
    {
      id: "history-followup-server-model",
      from: "history-server",
      to: "history-model",
      label: "带历史请求大模型",
      kind: "api-request",
      description: "应用服务器把第一轮 user、第一轮 assistant 和当前 user 一起放进第二次请求。",
      payloadId: "history-followup-model-request",
    },
    {
      id: "history-followup-model-server",
      from: "history-model",
      to: "history-server",
      label: "返回第二轮响应",
      kind: "api-response",
      description: "大模型基于第二次请求里的历史 messages 理解“那”的指代。",
      payloadId: "history-followup-model-response",
    },
    {
      id: "history-followup-server-user",
      from: "history-server",
      to: "history-user",
      label: "展示第二轮回答",
      kind: "ui",
      description: "应用服务器把第二轮回答展示给用户。",
      payloadId: "history-followup-ui-update",
    },
  ],
  frames: [
    {
      id: "history-frame-first-user",
      subtitle: "第一轮用户提出上海客户现场出行问题。",
      messages: [
        {
          id: "history-first-user-message",
          role: "用户",
          text: firstQuestion,
          state: "已发送",
        },
      ],
    },
    {
      id: "history-frame-first-waiting",
      subtitle: "应用服务器正在请求大模型。",
      messages: [
        {
          id: "history-first-user-message",
          role: "用户",
          text: firstQuestion,
          state: "已发送",
        },
        {
          id: "history-first-assistant-waiting",
          role: "助手",
          text: "思考中……",
          state: "思考中",
        },
      ],
    },
    {
      id: "history-frame-first-answer",
      subtitle: "第一轮助手回答已经展示给用户。",
      messages: [
        {
          id: "history-first-user-message",
          role: "用户",
          text: firstQuestion,
          state: "已发送",
        },
        {
          id: "history-first-assistant-answer",
          role: "助手",
          text: firstAnswer,
          state: "已回复",
        },
      ],
    },
    {
      id: "history-frame-followup-user",
      subtitle: "第二轮用户用“那”追问，指向上一轮行程。",
      messages: [
        {
          id: "history-first-user-message",
          role: "用户",
          text: firstQuestion,
          state: "已发送",
        },
        {
          id: "history-first-assistant-answer",
          role: "助手",
          text: firstAnswer,
          state: "已回复",
        },
        {
          id: "history-followup-user-message",
          role: "用户",
          text: followUpQuestion,
          state: "已发送",
        },
      ],
    },
    {
      id: "history-frame-followup-waiting",
      subtitle: "左侧仍是正常聊天；右侧重点看第二次模型请求里带了哪些历史消息。",
      messages: [
        {
          id: "history-first-user-message",
          role: "用户",
          text: firstQuestion,
          state: "已发送",
        },
        {
          id: "history-first-assistant-answer",
          role: "助手",
          text: firstAnswer,
          state: "已回复",
        },
        {
          id: "history-followup-user-message",
          role: "用户",
          text: followUpQuestion,
          state: "已发送",
        },
        {
          id: "history-followup-assistant-waiting",
          role: "助手",
          text: "思考中……",
          state: "思考中",
        },
      ],
    },
    {
      id: "history-frame-followup-answer",
      subtitle: "模型看到了历史 messages，因此能回答“那”指的是上海客户现场行程。",
      messages: [
        {
          id: "history-first-user-message",
          role: "用户",
          text: firstQuestion,
          state: "已发送",
        },
        {
          id: "history-first-assistant-answer",
          role: "助手",
          text: firstAnswer,
          state: "已回复",
        },
        {
          id: "history-followup-user-message",
          role: "用户",
          text: followUpQuestion,
          state: "已发送",
        },
        {
          id: "history-followup-assistant-answer",
          role: "助手",
          text: followUpAnswer,
          state: "已回复",
        },
      ],
    },
  ],
  payloads: [
    payload("history-first-send-message", "发送第一轮消息：应用接收用户消息", firstAppMessageVariants),
    payload("history-first-model-request", "第一轮请求大模型", firstRequestVariants),
    payload("history-first-model-response", "返回第一轮响应", firstResponseVariants),
    payload("history-first-ui-update", "展示第一轮回答：应用服务器写回界面", firstUiUpdateVariants),
    payload(
      "history-followup-send-message",
      "发送第二轮追问：应用接收用户消息",
      followUpAppMessageVariants,
    ),
    payload("history-followup-model-request", "第二轮请求大模型：显式带回历史 messages", followUpRequestVariants),
    payload("history-followup-model-response", "返回第二轮响应", followUpResponseVariants),
    payload("history-followup-ui-update", "展示第二轮回答：应用服务器写回界面", followUpUiUpdateVariants),
  ],
  steps: [
    {
      id: "history-step-first-user",
      title: "用户发送第一轮消息",
      description: "左侧出现第一轮用户消息；右侧显示用户消息进入应用服务器。",
      leftFrameId: "history-frame-first-user",
      focusMessageId: "history-first-user-message",
      revealMessageIds: ["history-first-user-server"],
      activeActorIds: ["history-user", "history-server"],
      activeMessageId: "history-first-user-server",
      payloadId: "history-first-send-message",
    },
    {
      id: "history-step-first-request",
      title: "应用服务器请求大模型",
      description: "第一轮请求只需要 system 和当前 user 消息。",
      leftFrameId: "history-frame-first-waiting",
      focusMessageId: "history-first-assistant-waiting",
      revealMessageIds: ["history-first-server-model"],
      activeActorIds: ["history-server", "history-model"],
      activeMessageId: "history-first-server-model",
      payloadId: "history-first-model-request",
    },
    {
      id: "history-step-first-response",
      title: "大模型返回第一轮响应",
      description: "模型返回上海客户现场出行建议。",
      leftFrameId: "history-frame-first-waiting",
      focusMessageId: "history-first-assistant-waiting",
      revealMessageIds: ["history-first-model-server"],
      activeActorIds: ["history-model", "history-server"],
      activeMessageId: "history-first-model-server",
      payloadId: "history-first-model-response",
    },
    {
      id: "history-step-first-display",
      title: "应用服务器展示第一轮回答",
      description: "左侧显示第一轮助手气泡；应用服务器保存这轮消息供后续请求使用。",
      leftFrameId: "history-frame-first-answer",
      focusMessageId: "history-first-assistant-answer",
      revealMessageIds: ["history-first-server-user"],
      activeActorIds: ["history-server", "history-user"],
      activeMessageId: "history-first-server-user",
      payloadId: "history-first-ui-update",
    },
    {
      id: "history-step-followup-user",
      title: "用户发送第二轮追问",
      description: "用户用“那”指向上一轮上海客户现场出行问题。",
      leftFrameId: "history-frame-followup-user",
      focusMessageId: "history-followup-user-message",
      revealMessageIds: ["history-followup-user-server"],
      activeActorIds: ["history-user", "history-server"],
      activeMessageId: "history-followup-user-server",
      payloadId: "history-followup-send-message",
    },
    {
      id: "history-step-followup-request",
      title: "应用服务器带历史请求大模型",
      description: "第二次请求显式带回第一轮 user、第一轮 assistant 和当前 user。",
      leftFrameId: "history-frame-followup-waiting",
      focusMessageId: "history-followup-assistant-waiting",
      revealMessageIds: ["history-followup-server-model"],
      activeActorIds: ["history-server", "history-model"],
      activeMessageId: "history-followup-server-model",
      payloadId: "history-followup-model-request",
    },
    {
      id: "history-step-followup-response",
      title: "大模型返回第二轮响应",
      description: "模型基于本次请求里的历史 messages 理解“那”的指代。",
      leftFrameId: "history-frame-followup-waiting",
      focusMessageId: "history-followup-assistant-waiting",
      revealMessageIds: ["history-followup-model-server"],
      activeActorIds: ["history-model", "history-server"],
      activeMessageId: "history-followup-model-server",
      payloadId: "history-followup-model-response",
    },
    {
      id: "history-step-followup-display",
      title: "应用服务器展示第二轮回答",
      description: "左侧显示第二轮助手气泡；多轮对话的“记忆感”来自第二次请求携带历史。",
      leftFrameId: "history-frame-followup-answer",
      focusMessageId: "history-followup-assistant-answer",
      revealMessageIds: ["history-followup-server-user"],
      activeActorIds: ["history-server", "history-user"],
      activeMessageId: "history-followup-server-user",
      payloadId: "history-followup-ui-update",
    },
  ],
} satisfies DemoSpec;

export const chapterTwoContent = {
  number: "02",
  title: "多轮对话的真实机制",
  shortTitle: "多轮对话的真实机制",
  slug: "conversation-history-context",
  route: "/chapters/02",
  docPath: "chapters/02-conversation-history-context.md",
  eyebrow: "第 02 章",
  summary: "在第一章普通对话链路上增加一轮追问，展示多轮对话的关键不是模型记住网页聊天，而是应用服务器把历史消息放进下一次模型请求。",
  principle:
    "模型每次只能基于本次调用可见上下文回答；多轮对话的“记忆感”来自应用服务器在第二次请求中显式带回上一轮 user 和 assistant 消息。",
  example:
    "第一轮用户问“明天下午我要去上海客户现场，出门要带伞吗？”，助手回答上海天气和带伞建议；第二轮用户追问“那我还需要提前多久出门？”，应用服务器把第一轮问答和第二轮追问一起发给模型。",
  principles: [
    "时序图参与者仍然是用户、应用服务器和大模型。",
    "历史上下文不是参与者，而是第二次模型请求 payload 里的 messages。",
    "如果第二次请求只发送当前追问，模型看不到“那”指向上一轮行程。",
    "显式历史重传会增加输入 token，并受上下文窗口限制。",
  ],
  previousRoute: "/chapters/01",
  nextRoute: "/chapters/03",
  demos: [historyReplayDemo],
} satisfies CourseChapter;
