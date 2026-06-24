import type { DemoSpec, JsonValue, PayloadSpec } from "./demo-player/types";

export type ChapterDemoId = "direct" | "streaming" | "tool-call";

export type ChapterOneContent = {
  title: string;
  eyebrow: string;
  intro: string;
  whatYouLearn: string[];
  homepageRoute: string;
  nextChapterRoute: string;
  demos: DemoSpec[];
};

const apiModel = "gpt-5.5";
const systemInstruction = "You are a helpful assistant.";
const directConversationId = "001";
const streamingConversationId = "003";
const toolConversationId = "002";

const directQuestion =
  "我这段话有点绕，帮我改得更清楚：我们明天可能需要稍微提前一点到会议室，因为投影设备可能要调试。";

const directAnswer =
  "可以改成：我们明天提前到会议室，先调试投影设备，避免会议开始后耽误时间。";

const streamingAnswerChunk1 = "可以改成：";
const streamingAnswerChunk2 = "我们明天提前到会议室，先调试投影设备，";
const streamingAnswerChunk3 = "避免会议开始后耽误时间。";
const streamingAnswerPartial1 = streamingAnswerChunk1;
const streamingAnswerPartial2 = `${streamingAnswerChunk1}${streamingAnswerChunk2}`;

const weatherQuestion = "明天下午我要去上海客户现场，出门要带伞吗？";

const weatherAnswer =
  "建议带伞。2026-06-24 下午上海小雨转中雨，22-25℃，降水概率 82%。如果你要去客户现场，最好带一把折叠伞，并把路上时间留宽一点。";

const weatherToolArguments = {
  city: "上海",
  date: "2026-06-24",
  time_range: "13:00-18:00",
};

const weatherToolResult = {
  city: "上海",
  date: "2026-06-24",
  time_range: "13:00-18:00",
  condition: "小雨转中雨",
  temperature: "22-25℃",
  precipitation_probability: "82%",
  wind: "东南风 3-4 级",
};

const weatherToolParameters = {
  type: "object",
  properties: {
    city: {
      type: "string",
      description: "城市名称，例如 上海",
    },
    date: {
      type: "string",
      description: "日期，格式 YYYY-MM-DD",
    },
    time_range: {
      type: "string",
      description: "时间段，例如 13:00-18:00",
    },
  },
  required: ["city", "date", "time_range"],
  additionalProperties: false,
};

const chatWeatherTool = {
  type: "function",
  function: {
    name: "get_weather",
    description: "读取指定城市某个时间段的天气预报",
    parameters: weatherToolParameters,
  },
};

const responsesWeatherTool = {
  type: "function",
  name: "get_weather",
  description: "读取指定城市某个时间段的天气预报",
  parameters: weatherToolParameters,
  strict: true,
};

const chatWeatherToolCall = {
  id: "call_weather_shanghai",
  type: "function",
  function: {
    name: "get_weather",
    arguments: JSON.stringify(weatherToolArguments),
  },
};

const responsesWeatherFunctionCall = {
  type: "function_call",
  id: "fc_ch01_weather",
  call_id: "call_weather_shanghai",
  name: "get_weather",
  arguments: JSON.stringify(weatherToolArguments),
  status: "completed",
};

function json(value: JsonValue): JsonValue {
  return value;
}

function payload(id: string, title: string, variants: PayloadSpec["variants"]): PayloadSpec {
  return { id, title, variants };
}

function chatTextResponse(id: string, answer: string) {
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
      prompt_tokens: 46,
      completion_tokens: 32,
      total_tokens: 78,
      prompt_tokens_details: {
        cached_tokens: 0,
        audio_tokens: 0,
      },
      completion_tokens_details: {
        reasoning_tokens: 0,
        audio_tokens: 0,
        accepted_prediction_tokens: 0,
        rejected_prediction_tokens: 0,
      },
    },
    service_tier: "default",
  };
}

function responsesTextResponse(id: string, messageId: string, answer: string) {
  return {
    id,
    object: "response",
    created_at: 1782259200,
    status: "completed",
    completed_at: 1782259201,
    error: null,
    incomplete_details: null,
    instructions: systemInstruction,
    max_output_tokens: null,
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
    parallel_tool_calls: true,
    reasoning: {
      effort: null,
      summary: null,
    },
    store: false,
    temperature: 1.0,
    text: {
      format: {
        type: "text",
      },
    },
    tool_choice: "auto",
    tools: [],
    top_p: 1.0,
    truncation: "disabled",
    usage: {
      input_tokens: 46,
      input_tokens_details: {
        cached_tokens: 0,
      },
      output_tokens: 32,
      output_tokens_details: {
        reasoning_tokens: 0,
      },
      total_tokens: 78,
    },
    user: null,
    metadata: {},
  };
}

function chatStreamChunk(id: string, delta: string, finishReason: "stop" | null = null): JsonValue {
  const deltaPayload: JsonValue = delta ? { content: delta } : {};

  return {
    id,
    object: "chat.completion.chunk",
    created: 1782259200,
    model: apiModel,
    choices: [
      {
        index: 0,
        delta: deltaPayload,
        logprobs: null,
        finish_reason: finishReason,
      },
    ],
  };
}

function responsesStreamEvent(type: string, data: JsonValue): string {
  return `event: ${type}\ndata: ${JSON.stringify(data)}`;
}

function responsesTextDeltaEvent(delta: string): string {
  return responsesStreamEvent(
    "response.output_text.delta",
    json({
      type: "response.output_text.delta",
      item_id: "msg_ch01_streaming",
      output_index: 0,
      content_index: 0,
      delta,
    }),
  );
}

function responsesCompletedEvent(): string {
  return responsesStreamEvent(
    "response.completed",
    json({
      type: "response.completed",
      response: responsesTextResponse("resp_ch01_streaming", "msg_ch01_streaming", directAnswer),
    }),
  );
}

const directRequestVariants = [
  {
    id: "direct-chat-completions-request",
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
          content: directQuestion,
        },
      ],
    }),
  },
  {
    id: "direct-responses-request",
    label: "Responses API request",
    language: "json",
    content: json({
      model: apiModel,
      instructions: systemInstruction,
      input: directQuestion,
      store: false,
    }),
  },
] satisfies PayloadSpec["variants"];

const directAppMessageVariants = [
  {
    id: "direct-app-message",
    label: "应用内部 JSON",
    language: "json",
    content: json({
      conversation_id: directConversationId,
      message: directQuestion,
    }),
  },
] satisfies PayloadSpec["variants"];

const directResponseVariants = [
  {
    id: "direct-chat-completions-response",
    label: "Chat Completions response",
    language: "json",
    content: json(chatTextResponse("chatcmpl-ch01-direct", directAnswer)),
  },
  {
    id: "direct-responses-response",
    label: "Responses API response",
    language: "json",
    content: json(responsesTextResponse("resp_ch01_direct", "msg_ch01_direct", directAnswer)),
  },
] satisfies PayloadSpec["variants"];

const streamingRequestVariants = [
  {
    id: "streaming-chat-completions-request",
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
          content: directQuestion,
        },
      ],
      stream: true,
    }),
  },
  {
    id: "streaming-responses-request",
    label: "Responses API request",
    language: "json",
    content: json({
      model: apiModel,
      instructions: systemInstruction,
      input: directQuestion,
      store: false,
      stream: true,
    }),
  },
] satisfies PayloadSpec["variants"];

const streamingAppMessageVariants = [
  {
    id: "streaming-app-message",
    label: "应用内部 JSON",
    language: "json",
    content: json({
      conversation_id: streamingConversationId,
      message: directQuestion,
    }),
  },
] satisfies PayloadSpec["variants"];

const streamingChunk1Variants = [
  {
    id: "streaming-chat-chunk-1",
    label: "Chat Completions stream chunk",
    language: "json",
    content: json(chatStreamChunk("chatcmpl-ch01-streaming", streamingAnswerChunk1)),
  },
  {
    id: "streaming-responses-delta-1",
    label: "Responses API stream event",
    language: "sse",
    content: responsesTextDeltaEvent(streamingAnswerChunk1),
  },
] satisfies PayloadSpec["variants"];

const streamingChunk2Variants = [
  {
    id: "streaming-chat-chunk-2",
    label: "Chat Completions stream chunk",
    language: "json",
    content: json(chatStreamChunk("chatcmpl-ch01-streaming", streamingAnswerChunk2)),
  },
  {
    id: "streaming-responses-delta-2",
    label: "Responses API stream event",
    language: "sse",
    content: responsesTextDeltaEvent(streamingAnswerChunk2),
  },
] satisfies PayloadSpec["variants"];

const streamingChunk3Variants = [
  {
    id: "streaming-chat-chunk-3",
    label: "Chat Completions stream chunk",
    language: "json",
    content: json(chatStreamChunk("chatcmpl-ch01-streaming", streamingAnswerChunk3)),
  },
  {
    id: "streaming-responses-delta-3",
    label: "Responses API stream event",
    language: "sse",
    content: responsesTextDeltaEvent(streamingAnswerChunk3),
  },
] satisfies PayloadSpec["variants"];

const streamingDoneVariants = [
  {
    id: "streaming-chat-done",
    label: "Chat Completions stream chunk",
    language: "json",
    content: json(chatStreamChunk("chatcmpl-ch01-streaming", "", "stop")),
  },
  {
    id: "streaming-responses-completed",
    label: "Responses API stream event",
    language: "sse",
    content: responsesCompletedEvent(),
  },
] satisfies PayloadSpec["variants"];

const weatherInitialRequestVariants = [
  {
    id: "weather-chat-completions-request",
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
          content: weatherQuestion,
        },
      ],
      tools: [chatWeatherTool],
      tool_choice: "auto",
    }),
  },
  {
    id: "weather-responses-request",
    label: "Responses API request",
    language: "json",
    content: json({
      model: apiModel,
      instructions: systemInstruction,
      tools: [responsesWeatherTool],
      input: weatherQuestion,
      tool_choice: "auto",
      store: false,
    }),
  },
] satisfies PayloadSpec["variants"];

const weatherAppMessageVariants = [
  {
    id: "weather-app-message",
    label: "应用内部 JSON",
    language: "json",
    content: json({
      conversation_id: toolConversationId,
      message: weatherQuestion,
    }),
  },
] satisfies PayloadSpec["variants"];

const weatherToolCallResponseVariants = [
  {
    id: "weather-chat-completions-tool-call-response",
    label: "Chat Completions response",
    language: "json",
    content: json({
      id: "chatcmpl-ch01-weather-call",
      object: "chat.completion",
      created: 1782259200,
      model: apiModel,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: null,
            tool_calls: [chatWeatherToolCall],
          },
          logprobs: null,
          finish_reason: "tool_calls",
        },
      ],
      usage: {
        prompt_tokens: 108,
        completion_tokens: 24,
        total_tokens: 132,
        completion_tokens_details: {
          reasoning_tokens: 0,
          accepted_prediction_tokens: 0,
          rejected_prediction_tokens: 0,
        },
      },
    }),
  },
  {
    id: "weather-responses-tool-call-response",
    label: "Responses API response",
    language: "json",
    content: json({
      id: "resp_ch01_weather_call",
      object: "response",
      created_at: 1782259200,
      status: "completed",
      completed_at: 1782259201,
      error: null,
      incomplete_details: null,
      instructions: systemInstruction,
      max_output_tokens: null,
      model: apiModel,
      output: [responsesWeatherFunctionCall],
      parallel_tool_calls: true,
      reasoning: {
        effort: null,
        summary: null,
      },
      store: false,
      temperature: 1.0,
      text: {
        format: {
          type: "text",
        },
      },
      tool_choice: "auto",
      tools: [responsesWeatherTool],
      top_p: 1.0,
      truncation: "disabled",
      usage: {
        input_tokens: 116,
        input_tokens_details: {
          cached_tokens: 0,
        },
        output_tokens: 24,
        output_tokens_details: {
          reasoning_tokens: 0,
        },
        total_tokens: 140,
      },
      user: null,
      metadata: {},
    }),
  },
] satisfies PayloadSpec["variants"];

const weatherFollowupRequestVariants = [
  {
    id: "weather-chat-completions-followup-request",
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
          content: weatherQuestion,
        },
        {
          role: "assistant",
          content: null,
          tool_calls: [chatWeatherToolCall],
        },
        {
          role: "tool",
          tool_call_id: "call_weather_shanghai",
          content: JSON.stringify(weatherToolResult),
        },
      ],
    }),
  },
  {
    id: "weather-responses-followup-request",
    label: "Responses API request",
    language: "json",
    content: json({
      model: apiModel,
      instructions: systemInstruction,
      tools: [responsesWeatherTool],
      input: [
        {
          role: "user",
          content: weatherQuestion,
        },
        responsesWeatherFunctionCall,
        {
          type: "function_call_output",
          call_id: "call_weather_shanghai",
          output: JSON.stringify(weatherToolResult),
        },
      ],
      tool_choice: "auto",
      store: false,
    }),
  },
] satisfies PayloadSpec["variants"];

const weatherFinalResponseVariants = [
  {
    id: "weather-chat-completions-final-response",
    label: "Chat Completions response",
    language: "json",
    content: json(chatTextResponse("chatcmpl-ch01-weather-final", weatherAnswer)),
  },
  {
    id: "weather-responses-final-response",
    label: "Responses API response",
    language: "json",
    content: json({
      ...responsesTextResponse("resp_ch01_weather_final", "msg_ch01_weather_final", weatherAnswer),
      tools: [responsesWeatherTool],
    }),
  },
] satisfies PayloadSpec["variants"];

const directDemo = {
  id: "direct",
  title: "普通对话演示",
  shortTitle: "普通对话",
  route: "/chapters/01/demos/direct",
  nextRoute: "/chapters/01/demos/streaming",
  summary: "用户让助手改写一句话，应用服务器把消息组装成模型请求，模型直接返回文本。",
  outcome: "没有工具调用，完整路径是：用户、应用服务器、大模型，再回到用户。",
  conversationTitle: "聊天窗口",
  conversationSubtitle: "左侧状态跟随当前步骤变化。",
  flowTitle: "普通对话时序图",
  flowSubtitle: "角色、生命线、消息线和传输数据按步骤同步出现。",
  actors: [
    {
      id: "direct-user",
      label: "用户",
      kind: "user",
    },
    {
      id: "direct-server",
      label: "应用服务器",
      kind: "server",
    },
    {
      id: "direct-model",
      label: "大模型",
      kind: "model",
    },
  ],
  messages: [
    {
      id: "direct-user-server",
      from: "direct-user",
      to: "direct-server",
      label: "发送消息",
      kind: "api-request",
      description: "用户消息进入应用服务器后，会被组装成模型 API 请求。",
      payloadId: "direct-send-message",
    },
    {
      id: "direct-server-model",
      from: "direct-server",
      to: "direct-model",
      label: "请求大模型",
      kind: "api-request",
      description: "应用服务器把本轮对话发送给大模型。",
      payloadId: "direct-model-request",
    },
    {
      id: "direct-model-server",
      from: "direct-model",
      to: "direct-server",
      label: "返回模型响应",
      kind: "api-response",
      description: "大模型返回可展示的助手消息。",
      payloadId: "direct-model-response",
    },
    {
      id: "direct-server-user",
      from: "direct-server",
      to: "direct-user",
      label: "展示回答",
      kind: "ui",
      description: "应用服务器把助手消息写回聊天界面。",
      payloadId: "direct-ui-update",
    },
  ],
  frames: [
    {
      id: "direct-frame-user",
      subtitle: "用户刚把一句真实改写请求发进聊天框。",
      messages: [{ id: "direct-user-message", role: "用户", text: directQuestion, state: "已发送" }],
    },
    {
      id: "direct-frame-waiting",
      subtitle: "用户看到助手正在生成，背后应用服务器已经向大模型发起请求。",
      messages: [
        { id: "direct-user-message", role: "用户", text: directQuestion, state: "已发送" },
        { id: "direct-assistant-waiting", role: "助手", text: "思考中……", state: "思考中" },
      ],
    },
    {
      id: "direct-frame-answer",
      subtitle: "模型文本已经回到应用服务器，助手气泡展示给用户。",
      messages: [
        { id: "direct-user-message", role: "用户", text: directQuestion, state: "已发送" },
        { id: "direct-assistant-answer", role: "助手", text: directAnswer, state: "已回复" },
      ],
    },
  ],
  payloads: [
    payload("direct-send-message", "发送消息：应用接收用户消息", directAppMessageVariants),
    payload("direct-model-request", "请求大模型", directRequestVariants),
    payload("direct-model-response", "返回模型响应", directResponseVariants),
    payload("direct-ui-update", "展示回答：应用服务器写回界面", [
      {
        id: "direct-ui-update-json",
        label: "应用内部 JSON",
        language: "json",
        content: json({
          conversation_id: directConversationId,
          append_message: {
            id: "002",
            role: "assistant",
            content: directAnswer,
          },
          visible_to_user: true,
        }),
      },
    ]),
  ],
  steps: [
    {
      id: "direct-step-user",
      title: "用户发送消息",
      description: "左侧出现用户消息；右侧激活用户和应用服务器，并出现第一条发送消息线。",
      leftFrameId: "direct-frame-user",
      focusMessageId: "direct-user-message",
      revealMessageIds: ["direct-user-server"],
      activeActorIds: ["direct-user", "direct-server"],
      activeMessageId: "direct-user-server",
      payloadId: "direct-send-message",
    },
    {
      id: "direct-step-request",
      title: "应用服务器请求大模型",
      description: "左侧进入思考中状态；右侧新增应用服务器到大模型的请求线。",
      leftFrameId: "direct-frame-waiting",
      focusMessageId: "direct-assistant-waiting",
      revealMessageIds: ["direct-server-model"],
      activeActorIds: ["direct-server", "direct-model"],
      activeMessageId: "direct-server-model",
      payloadId: "direct-model-request",
    },
    {
      id: "direct-step-response",
      title: "大模型返回响应",
      description: "左侧仍然保持思考中状态；右侧新增大模型返回应用服务器的响应线。",
      leftFrameId: "direct-frame-waiting",
      focusMessageId: "direct-assistant-waiting",
      revealMessageIds: ["direct-model-server"],
      activeActorIds: ["direct-model", "direct-server"],
      activeMessageId: "direct-model-server",
      payloadId: "direct-model-response",
    },
    {
      id: "direct-step-display",
      title: "应用服务器展示回答",
      description: "左侧显示最终助手气泡；右侧新增应用服务器返回用户的展示线。",
      leftFrameId: "direct-frame-answer",
      focusMessageId: "direct-assistant-answer",
      revealMessageIds: ["direct-server-user"],
      activeActorIds: ["direct-server", "direct-user"],
      activeMessageId: "direct-server-user",
      payloadId: "direct-ui-update",
    },
  ],
} satisfies DemoSpec;

const streamingDemo = {
  id: "streaming",
  title: "流式输出演示",
  shortTitle: "流式输出",
  route: "/chapters/01/demos/streaming",
  nextRoute: "/chapters/01/demos/tool-call",
  summary: "同一个改写请求开启流式返回后，应用服务器边读取模型片段边更新助手气泡。",
  outcome: "模型仍然生成同一段回答；变化在于应用用循环读取片段，并把部分文本持续写回界面。",
  conversationTitle: "聊天窗口",
  conversationSubtitle: "左侧助手气泡会按步骤累积文本。",
  flowTitle: "流式输出时序图",
  flowSubtitle: "循环标记表示应用反复读取流式片段并更新界面。",
  actors: [
    {
      id: "stream-user",
      label: "用户",
      kind: "user",
    },
    {
      id: "stream-server",
      label: "应用服务器",
      kind: "server",
    },
    {
      id: "stream-model",
      label: "大模型",
      kind: "model",
    },
  ],
  messages: [
    {
      id: "stream-user-server",
      from: "stream-user",
      to: "stream-server",
      label: "发送消息",
      kind: "api-request",
      description: "用户消息先进入应用服务器，仍然先形成应用内部消息。",
      payloadId: "stream-send-message",
    },
    {
      id: "stream-server-model",
      from: "stream-server",
      to: "stream-model",
      label: "请求流式输出",
      kind: "api-request",
      description: "应用服务器请求大模型，并打开 stream。",
      payloadId: "stream-model-request",
    },
    {
      id: "stream-model-server-chunk-1",
      from: "stream-model",
      to: "stream-server",
      label: "读取片段 1",
      kind: "stream",
      description: "模型先返回第一个文本增量片段。",
      payloadId: "stream-chunk-1",
    },
    {
      id: "stream-server-user-partial-1",
      from: "stream-server",
      to: "stream-user",
      label: "更新气泡 1",
      kind: "ui",
      description: "应用把第一个片段写入同一个助手气泡。",
      payloadId: "stream-ui-partial-1",
    },
    {
      id: "stream-model-server-chunk-2",
      from: "stream-model",
      to: "stream-server",
      label: "读取片段 2",
      kind: "stream",
      description: "模型继续返回下一段文本增量。",
      payloadId: "stream-chunk-2",
    },
    {
      id: "stream-server-user-partial-2",
      from: "stream-server",
      to: "stream-user",
      label: "更新气泡 2",
      kind: "ui",
      description: "应用把第二个片段追加到助手气泡。",
      payloadId: "stream-ui-partial-2",
    },
    {
      id: "stream-model-server-chunk-3",
      from: "stream-model",
      to: "stream-server",
      label: "读取片段 3",
      kind: "stream",
      description: "模型返回最后一段可见文本。",
      payloadId: "stream-chunk-3",
    },
    {
      id: "stream-server-user-partial-3",
      from: "stream-server",
      to: "stream-user",
      label: "更新气泡 3",
      kind: "ui",
      description: "应用把最后一段追加到同一个助手气泡。",
      payloadId: "stream-ui-partial-3",
    },
    {
      id: "stream-model-server-done",
      from: "stream-model",
      to: "stream-server",
      label: "流式完成",
      kind: "stream",
      description: "模型发送完成事件，应用把助手消息标记为已回复。",
      payloadId: "stream-done",
    },
  ],
  loops: [
    {
      id: "stream-read-update-loop",
      label: "读取片段并更新气泡",
      messageIds: [
        "stream-model-server-chunk-1",
        "stream-server-user-partial-1",
        "stream-model-server-chunk-2",
        "stream-server-user-partial-2",
        "stream-model-server-chunk-3",
        "stream-server-user-partial-3",
      ],
    },
  ],
  frames: [
    {
      id: "stream-frame-user",
      subtitle: "用户发送同一个真实改写请求。",
      messages: [{ id: "stream-user-message", role: "用户", text: directQuestion, state: "已发送" }],
    },
    {
      id: "stream-frame-waiting",
      subtitle: "应用服务器已经打开流式返回，助手气泡还在等待第一个片段。",
      messages: [
        { id: "stream-user-message", role: "用户", text: directQuestion, state: "已发送" },
        { id: "stream-assistant-answer", role: "助手", text: "思考中……", state: "思考中" },
      ],
    },
    {
      id: "stream-frame-partial-1",
      subtitle: "第一个片段到达后，助手气泡立即出现部分文本。",
      messages: [
        { id: "stream-user-message", role: "用户", text: directQuestion, state: "已发送" },
        {
          id: "stream-assistant-answer",
          role: "助手",
          text: streamingAnswerPartial1,
          state: "生成中",
          streaming: true,
        },
      ],
    },
    {
      id: "stream-frame-partial-2",
      subtitle: "第二个片段追加到同一个助手气泡。",
      messages: [
        { id: "stream-user-message", role: "用户", text: directQuestion, state: "已发送" },
        {
          id: "stream-assistant-answer",
          role: "助手",
          text: streamingAnswerPartial2,
          state: "生成中",
          streaming: true,
        },
      ],
    },
    {
      id: "stream-frame-partial-3",
      subtitle: "可见文本已经完整，但流式连接还需要完成事件收尾。",
      messages: [
        { id: "stream-user-message", role: "用户", text: directQuestion, state: "已发送" },
        {
          id: "stream-assistant-answer",
          role: "助手",
          text: directAnswer,
          state: "生成中",
          streaming: true,
        },
      ],
    },
    {
      id: "stream-frame-answer",
      subtitle: "完成事件到达后，应用把助手消息标记为已回复。",
      messages: [
        { id: "stream-user-message", role: "用户", text: directQuestion, state: "已发送" },
        { id: "stream-assistant-answer", role: "助手", text: directAnswer, state: "已回复" },
      ],
    },
  ],
  payloads: [
    payload("stream-send-message", "发送消息：应用接收用户消息", streamingAppMessageVariants),
    payload("stream-model-request", "请求流式输出", streamingRequestVariants),
    payload("stream-chunk-1", "读取片段 1：模型流式返回", streamingChunk1Variants),
    payload("stream-ui-partial-1", "更新气泡 1：应用写入部分文本", [
      {
        id: "stream-ui-partial-1-json",
        label: "应用内部 JSON",
        language: "json",
        content: json({
          conversation_id: streamingConversationId,
          update_message: {
            id: "002",
            role: "assistant",
            append_delta: streamingAnswerChunk1,
            content_so_far: streamingAnswerPartial1,
            state: "streaming",
          },
          visible_to_user: true,
        }),
      },
    ]),
    payload("stream-chunk-2", "读取片段 2：模型流式返回", streamingChunk2Variants),
    payload("stream-ui-partial-2", "更新气泡 2：应用追加部分文本", [
      {
        id: "stream-ui-partial-2-json",
        label: "应用内部 JSON",
        language: "json",
        content: json({
          conversation_id: streamingConversationId,
          update_message: {
            id: "002",
            role: "assistant",
            append_delta: streamingAnswerChunk2,
            content_so_far: streamingAnswerPartial2,
            state: "streaming",
          },
          visible_to_user: true,
        }),
      },
    ]),
    payload("stream-chunk-3", "读取片段 3：模型流式返回", streamingChunk3Variants),
    payload("stream-ui-partial-3", "更新气泡 3：应用追加部分文本", [
      {
        id: "stream-ui-partial-3-json",
        label: "应用内部 JSON",
        language: "json",
        content: json({
          conversation_id: streamingConversationId,
          update_message: {
            id: "002",
            role: "assistant",
            append_delta: streamingAnswerChunk3,
            content_so_far: directAnswer,
            state: "streaming",
          },
          visible_to_user: true,
        }),
      },
    ]),
    payload("stream-done", "流式完成：应用结束生成状态", streamingDoneVariants),
  ],
  steps: [
    {
      id: "stream-step-user",
      title: "用户发送消息",
      description: "左侧出现用户消息；右侧显示用户消息进入应用服务器。",
      leftFrameId: "stream-frame-user",
      focusMessageId: "stream-user-message",
      revealMessageIds: ["stream-user-server"],
      activeActorIds: ["stream-user", "stream-server"],
      activeMessageId: "stream-user-server",
      payloadId: "stream-send-message",
    },
    {
      id: "stream-step-request",
      title: "应用服务器请求流式输出",
      description: "左侧进入思考中；右侧新增带 stream 的模型请求。",
      leftFrameId: "stream-frame-waiting",
      focusMessageId: "stream-assistant-answer",
      revealMessageIds: ["stream-server-model"],
      activeActorIds: ["stream-server", "stream-model"],
      activeMessageId: "stream-server-model",
      payloadId: "stream-model-request",
    },
    {
      id: "stream-step-read-1",
      title: "读取第一个片段",
      description: "右侧进入循环：应用服务器从模型流里读到第一个文本片段。",
      leftFrameId: "stream-frame-waiting",
      focusMessageId: "stream-assistant-answer",
      revealMessageIds: ["stream-model-server-chunk-1"],
      activeActorIds: ["stream-model", "stream-server"],
      activeMessageId: "stream-model-server-chunk-1",
      payloadId: "stream-chunk-1",
    },
    {
      id: "stream-step-update-1",
      title: "更新助手气泡",
      description: "左侧助手气泡出现第一段文本；右侧显示应用把片段写回界面。",
      leftFrameId: "stream-frame-partial-1",
      focusMessageId: "stream-assistant-answer",
      revealMessageIds: ["stream-server-user-partial-1"],
      activeActorIds: ["stream-server", "stream-user"],
      activeMessageId: "stream-server-user-partial-1",
      payloadId: "stream-ui-partial-1",
    },
    {
      id: "stream-step-read-2",
      title: "读取第二个片段",
      description: "应用服务器继续从同一个流里读取第二个文本片段。",
      leftFrameId: "stream-frame-partial-1",
      focusMessageId: "stream-assistant-answer",
      revealMessageIds: ["stream-model-server-chunk-2"],
      activeActorIds: ["stream-model", "stream-server"],
      activeMessageId: "stream-model-server-chunk-2",
      payloadId: "stream-chunk-2",
    },
    {
      id: "stream-step-update-2",
      title: "继续追加到气泡",
      description: "左侧同一个助手气泡变长；右侧显示第二次界面更新。",
      leftFrameId: "stream-frame-partial-2",
      focusMessageId: "stream-assistant-answer",
      revealMessageIds: ["stream-server-user-partial-2"],
      activeActorIds: ["stream-server", "stream-user"],
      activeMessageId: "stream-server-user-partial-2",
      payloadId: "stream-ui-partial-2",
    },
    {
      id: "stream-step-read-3",
      title: "读取最后一个文本片段",
      description: "模型继续返回最后一段可见文本。",
      leftFrameId: "stream-frame-partial-2",
      focusMessageId: "stream-assistant-answer",
      revealMessageIds: ["stream-model-server-chunk-3"],
      activeActorIds: ["stream-model", "stream-server"],
      activeMessageId: "stream-model-server-chunk-3",
      payloadId: "stream-chunk-3",
    },
    {
      id: "stream-step-update-3",
      title: "写入完整可见文本",
      description: "左侧已经看到完整回答，但状态仍然是生成中。",
      leftFrameId: "stream-frame-partial-3",
      focusMessageId: "stream-assistant-answer",
      revealMessageIds: ["stream-server-user-partial-3"],
      activeActorIds: ["stream-server", "stream-user"],
      activeMessageId: "stream-server-user-partial-3",
      payloadId: "stream-ui-partial-3",
    },
    {
      id: "stream-step-done",
      title: "流式输出完成",
      description: "完成事件到达，应用把助手气泡从生成中切换为已回复。",
      leftFrameId: "stream-frame-answer",
      focusMessageId: "stream-assistant-answer",
      revealMessageIds: ["stream-model-server-done"],
      activeActorIds: ["stream-model", "stream-server"],
      activeMessageId: "stream-model-server-done",
      payloadId: "stream-done",
    },
  ],
} satisfies DemoSpec;

const toolCallDemo = {
  id: "tool-call",
  title: "工具调用演示",
  shortTitle: "工具调用",
  route: "/chapters/01/demos/tool-call",
  nextRoute: "/chapters/01/demos/direct",
  summary: "用户问上海客户现场出行是否带伞，模型先让应用服务器执行 get_weather。",
  outcome: "模型不直接查天气；应用服务器执行课堂 mock 工具，再把工具结果交回模型。",
  conversationTitle: "聊天窗口",
  conversationSubtitle: "左侧会停留在思考中状态，右侧继续步进展示工具调用细节。",
  flowTitle: "工具调用时序图",
  flowSubtitle: "角色、生命线、消息线和传输数据按步骤同步出现。",
  actors: [
    {
      id: "tool-user",
      label: "用户",
      kind: "user",
    },
    {
      id: "tool-server",
      label: "应用服务器",
      kind: "server",
    },
    {
      id: "tool-model",
      label: "大模型",
      kind: "model",
    },
    {
      id: "tool-weather",
      label: "get_weather",
      kind: "tool",
    },
  ],
  messages: [
    {
      id: "tool-user-server",
      from: "tool-user",
      to: "tool-server",
      label: "发送消息",
      kind: "api-request",
      description: "用户问题进入应用服务器，随后会带工具声明请求大模型。",
      payloadId: "tool-send-message",
    },
    {
      id: "tool-server-model",
      from: "tool-server",
      to: "tool-model",
      label: "请求大模型",
      kind: "api-request",
      description: "应用服务器把用户问题和 get_weather 工具声明一起发送给大模型。",
      payloadId: "tool-initial-request",
    },
    {
      id: "tool-model-server",
      from: "tool-model",
      to: "tool-server",
      label: "返回工具调用",
      kind: "tool-call",
      description: "大模型没有直接回答，而是返回工具名和参数。",
      payloadId: "tool-call-response",
    },
    {
      id: "tool-server-weather",
      from: "tool-server",
      to: "tool-weather",
      label: "执行 get_weather",
      kind: "tool-call",
      description: "应用服务器按模型给出的参数执行课堂 mock 天气工具。",
      payloadId: "tool-execute-input",
    },
    {
      id: "tool-weather-server",
      from: "tool-weather",
      to: "tool-server",
      label: "返回天气数据",
      kind: "tool-result",
      description: "天气工具返回上海 2026-06-24 下午的具体数据。",
      payloadId: "tool-result",
    },
    {
      id: "tool-server-model-second",
      from: "tool-server",
      to: "tool-model",
      label: "回写工具结果",
      kind: "api-request",
      description: "应用服务器把工具结果写回模型上下文。",
      payloadId: "tool-followup-request",
    },
    {
      id: "tool-model-server-final",
      from: "tool-model",
      to: "tool-server",
      label: "返回最终响应",
      kind: "api-response",
      description: "大模型基于工具结果生成最终建议。",
      payloadId: "tool-final-response",
    },
    {
      id: "tool-server-user-final",
      from: "tool-server",
      to: "tool-user",
      label: "展示建议",
      kind: "ui",
      description: "应用服务器把带伞建议展示给用户。",
      payloadId: "tool-ui-update",
    },
  ],
  frames: [
    {
      id: "tool-frame-user",
      subtitle: "用户提出一个具体上海出行问题。",
      messages: [{ id: "tool-user-message", role: "用户", text: weatherQuestion, state: "已发送" }],
    },
    {
      id: "tool-frame-processing",
      subtitle: "左侧还在思考中；右侧会连续展示工具调用链路。",
      messages: [
        { id: "tool-user-message", role: "用户", text: weatherQuestion, state: "已发送" },
        {
          id: "tool-assistant-processing",
          role: "助手",
          text: "思考中……",
          state: "思考中",
        },
      ],
    },
    {
      id: "tool-frame-answer",
      subtitle: "工具结果已经回写给模型，最终建议展示给用户。",
      messages: [
        { id: "tool-user-message", role: "用户", text: weatherQuestion, state: "已发送" },
        { id: "tool-assistant-answer", role: "助手", text: weatherAnswer, state: "已回复" },
      ],
    },
  ],
  payloads: [
    payload("tool-send-message", "发送消息：应用接收用户消息", weatherAppMessageVariants),
    payload("tool-initial-request", "请求大模型", weatherInitialRequestVariants),
    payload("tool-call-response", "返回工具调用", weatherToolCallResponseVariants),
    payload("tool-execute-input", "执行 get_weather：应用服务器调用工具", [
      {
        id: "tool-execute-input-json",
        label: "应用内部 JSON",
        language: "json",
        content: json({
          name: "get_weather",
          arguments: weatherToolArguments,
        }),
      },
    ]),
    payload("tool-result", "返回天气数据：工具执行结果", [
      {
        id: "tool-result-json",
        label: "工具返回 JSON",
        language: "json",
        content: json(weatherToolResult),
      },
    ]),
    payload("tool-followup-request", "回写工具结果", weatherFollowupRequestVariants),
    payload("tool-final-response", "返回最终响应", weatherFinalResponseVariants),
    payload("tool-ui-update", "展示建议：应用服务器写回界面", [
      {
        id: "tool-ui-update-json",
        label: "应用内部 JSON",
        language: "json",
        content: json({
          conversation_id: toolConversationId,
          append_message: {
            id: "002",
            role: "assistant",
            content: weatherAnswer,
          },
          visible_to_user: true,
        }),
      },
    ]),
  ],
  steps: [
    {
      id: "tool-step-user",
      title: "用户发送出行问题",
      description: "左侧出现用户问题；右侧激活用户和应用服务器，并出现发送消息线。",
      leftFrameId: "tool-frame-user",
      focusMessageId: "tool-user-message",
      revealMessageIds: ["tool-user-server"],
      activeActorIds: ["tool-user", "tool-server"],
      activeMessageId: "tool-user-server",
      payloadId: "tool-send-message",
    },
    {
      id: "tool-step-initial-request",
      title: "应用服务器请求大模型",
      description: "左侧进入思考中状态；右侧新增带 get_weather 工具声明的请求线。",
      leftFrameId: "tool-frame-processing",
      focusMessageId: "tool-assistant-processing",
      revealMessageIds: ["tool-server-model"],
      activeActorIds: ["tool-server", "tool-model"],
      activeMessageId: "tool-server-model",
      payloadId: "tool-initial-request",
    },
    {
      id: "tool-step-tool-call",
      title: "大模型返回工具调用",
      description: "左侧仍在思考中；右侧显示大模型返回工具名和参数。",
      leftFrameId: "tool-frame-processing",
      focusMessageId: "tool-assistant-processing",
      revealMessageIds: ["tool-model-server"],
      activeActorIds: ["tool-model", "tool-server"],
      activeMessageId: "tool-model-server",
      payloadId: "tool-call-response",
    },
    {
      id: "tool-step-execute",
      title: "应用服务器执行 get_weather",
      description: "左侧仍在思考中；右侧新增应用服务器执行天气工具的消息线。",
      leftFrameId: "tool-frame-processing",
      focusMessageId: "tool-assistant-processing",
      revealMessageIds: ["tool-server-weather"],
      activeActorIds: ["tool-server", "tool-weather"],
      activeMessageId: "tool-server-weather",
      payloadId: "tool-execute-input",
    },
    {
      id: "tool-step-result",
      title: "工具返回上海天气",
      description: "左侧仍在思考中；右侧显示上海天气 mock 结果返回应用服务器。",
      leftFrameId: "tool-frame-processing",
      focusMessageId: "tool-assistant-processing",
      revealMessageIds: ["tool-weather-server"],
      activeActorIds: ["tool-weather", "tool-server"],
      activeMessageId: "tool-weather-server",
      payloadId: "tool-result",
    },
    {
      id: "tool-step-writeback",
      title: "应用服务器回写工具结果",
      description: "左侧仍在思考中；右侧显示工具结果被写回模型上下文。",
      leftFrameId: "tool-frame-processing",
      focusMessageId: "tool-assistant-processing",
      revealMessageIds: ["tool-server-model-second"],
      activeActorIds: ["tool-server", "tool-model"],
      activeMessageId: "tool-server-model-second",
      payloadId: "tool-followup-request",
    },
    {
      id: "tool-step-final-response",
      title: "大模型生成最终建议",
      description: "左侧仍在思考中；右侧显示模型基于工具结果生成最终回答。",
      leftFrameId: "tool-frame-processing",
      focusMessageId: "tool-assistant-processing",
      revealMessageIds: ["tool-model-server-final"],
      activeActorIds: ["tool-model", "tool-server"],
      activeMessageId: "tool-model-server-final",
      payloadId: "tool-final-response",
    },
    {
      id: "tool-step-display",
      title: "应用服务器展示带伞建议",
      description: "左侧切换为最终回复；右侧显示应用服务器把建议展示给用户。",
      leftFrameId: "tool-frame-answer",
      focusMessageId: "tool-assistant-answer",
      revealMessageIds: ["tool-server-user-final"],
      activeActorIds: ["tool-server", "tool-user"],
      activeMessageId: "tool-server-user-final",
      payloadId: "tool-ui-update",
    },
  ],
} satisfies DemoSpec;

export const chapterOneContent = {
  title: "第一章：最小的一次 LLM 对话",
  eyebrow: "从真实聊天看见一次推理调用",
  intro:
    "这一章只讲一件事：用户发出一句话后，聊天界面、应用服务器、大模型和工具之间到底传了什么。先看普通文本回答，再看同一个回答如何流式出现，最后看一次需要 get_weather 的上海出行问题。",
  whatYouLearn: [
    "用户看到的是聊天气泡，开发者要处理的是结构化请求和响应。",
    "普通对话路径很短：用户消息进入应用服务器，应用服务器请求大模型，大模型返回文本。",
    "流式输出不会改变问题和最终回答，它改变的是应用读取模型输出并更新界面的节奏。",
    "工具调用路径更长：大模型先请求 get_weather，应用服务器执行课堂 mock 工具，再把结果写回模型。",
    "所有演示都必须一步一步展开，左侧聊天状态和右侧时序图由同一个步骤控制。",
  ],
  homepageRoute: "/chapters/01",
  nextChapterRoute: "/chapters/02",
  demos: [directDemo, streamingDemo, toolCallDemo],
} satisfies ChapterOneContent;

export function getChapterDemo(demoId: ChapterDemoId): DemoSpec {
  return chapterOneContent.demos.find((demo) => demo.id === demoId) ?? chapterOneContent.demos[0];
}
