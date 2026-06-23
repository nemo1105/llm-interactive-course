export type ValueItem = {
  id: string;
  title: string;
  description: string;
  visualLabel: string;
  checkpoints: string[];
};

export const landingContent = {
  courseName: "LLM 技术全景课",
  heroPromise: "建立完整地图",
  audienceNote: "面向具备基础 AI 或编程概念、希望从整体上理解 LLM 系统的人。",
  primaryAction: {
    label: "开始体验",
    href: "/chapters/01",
  },
  valueItems: [
    {
      id: "connected-map",
      title: "把零散概念串成一条主线",
      description: "从一次普通 LLM 对话出发，把请求、上下文、工具和工作流放回同一条推理调用链路里理解。",
      visualLabel: "同一条调用链",
      checkpoints: ["用户输入", "模型请求", "应用处理"],
    },
    {
      id: "system-boundary",
      title: "看懂真实 LLM 应用的系统边界",
      description: "分清模型、应用层、工具、外部知识库和状态管理各自负责什么，避免把系统行为误认为模型天然能力。",
      visualLabel: "职责边界",
      checkpoints: ["模型输出", "应用执行", "外部系统"],
    },
    {
      id: "tradeoffs",
      title: "理解成本、延迟和质量的取舍",
      description: "把 token、上下文窗口、缓存、输出长度、推理预算和检索质量放到真实产品决策里比较。",
      visualLabel: "产品取舍",
      checkpoints: ["成本", "延迟", "质量"],
    },
    {
      id: "engineering-judgment",
      title: "建立工程判断力",
      description: "不只记住概念，而是能判断什么时候该用、为什么要用、用了会带来什么成本和约束。",
      visualLabel: "从概念到决策",
      checkpoints: ["使用时机", "工程代价", "边界条件"],
    },
    {
      id: "debugging",
      title: "提升调试和排障能力",
      description: "能判断问题来自 prompt、上下文、历史裁剪、工具 schema、RAG 召回，还是评估方式本身。",
      visualLabel: "定位故障点",
      checkpoints: ["输入上下文", "工具链路", "评估反馈"],
    },
    {
      id: "agent-foundation",
      title: "建立 agent 的前置基础",
      description: "先理解工具调用、状态、上下文、外部知识和评估，再进入 agent loop 与复杂工作流。",
      visualLabel: "进入 agent 之前",
      checkpoints: ["工具", "状态", "循环"],
    },
    {
      id: "shared-language",
      title: "降低团队沟通成本",
      description: "让产品、工程、算法和业务同学用同一套术语讨论消息、上下文、工具、memory、RAG、eval 和 agent workflow。",
      visualLabel: "共同语言",
      checkpoints: ["术语一致", "边界清晰", "决策更快"],
    },
  ] satisfies ValueItem[],
};
