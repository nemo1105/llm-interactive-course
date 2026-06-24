import { expect, test } from "@playwright/test";

import { courseChapters } from "../../app/lib/course-content";

test("renders every confirmed chapter homepage with navigation and a core demo", async ({ page }) => {
  for (const chapter of courseChapters.slice(1)) {
    await page.goto(chapter.route);

    await expect(page.getByRole("heading", { name: chapter.title })).toBeVisible();
    await expect(page.getByLabel("本章原理")).toContainText(chapter.principle.slice(0, 18));
    await expect(page.getByLabel("核心演示")).toContainText(chapter.demos[0].shortTitle);

    if (Number(chapter.number) >= 3) {
      await expect(page.getByRole("heading", { name: new RegExp(`${chapter.title}.*未审校`) })).toBeVisible();
      await expect(page.getByLabel("核心演示")).toContainText("未审校");
      await expect(page.getByRole("button", { name: "演示未审校" })).toBeDisabled();
      await expect(page.getByRole("link", { name: "进入演示" })).toHaveCount(0);
      await expect(page.locator(`a[href="${chapter.demos[0].route}"]`)).toHaveCount(0);
    } else {
      await expect(page.getByRole("link", { name: "进入演示" })).toHaveAttribute(
        "href",
        chapter.demos[0].route,
      );
    }
  }
});

test("renders chapter two as a second round of the chapter one conversation model", async ({
  page,
}) => {
  await page.goto("/chapters/02/demos/history-replay");

  const chat = page.getByLabel("正常对话区域");
  const flow = page.getByLabel("时序图区域");

  await expect(flow).toContainText("用户");
  await expect(flow).toContainText("应用服务器");
  await expect(flow).toContainText("大模型");
  await expect(flow).not.toContainText("聊天应用");
  await expect(flow).not.toContainText("历史上下文");
  await expect(flow).not.toContainText("对照");
  await expect(flow).not.toContainText("只发当前轮");

  await expect(chat).toContainText("明天下午我要去上海客户现场");
  await expect(chat).not.toContainText("应用先记录当前轮消息");
  await expect(chat).not.toContainText("历史上下文进入本次调用");

  for (const label of ["展示第一轮回答", "发送第二轮追问", "带历史请求大模型"]) {
    for (let attempts = 0; attempts < 10; attempts += 1) {
      if ((await flow.getByRole("button", { name: label }).count()) > 0) {
        break;
      }
      await page.getByRole("button", { name: /下一步/ }).click();
    }
    await expect(flow.getByRole("button", { name: label })).toBeVisible();
  }

  await flow.getByRole("button", { name: "带历史请求大模型" }).hover();
  const payload = page.getByLabel("当前传输数据");
  await expect(payload).toContainText("明天下午我要去上海客户现场");
  await expect(payload).toContainText("建议带伞");
  await expect(payload).toContainText("那我还需要提前多久出门");
});

test("renders rewritten later chapter demos without internal chat narration", async ({ page }) => {
  const cases = [
    {
      route: "/chapters/03/demos/message-stack",
      flowMustHave: "get_weather 工具",
      flowMustNotHave: "tool 消息",
      oldChatText: "用户请求进入 user role",
    },
    {
      route: "/chapters/17/demos/skill-progressive-loading",
      flowMustHave: "技能文件系统",
      flowMustNotHave: "技能文件目录",
      oldChatText: "一个用户任务可以使用多个技能",
    },
    {
      route: "/chapters/25/demos/approval-gate",
      flowMustHave: "审批 gate",
      flowMustNotHave: "权限审批说明",
      oldChatText: "这是高风险动作请求",
    },
  ];

  for (const item of cases) {
    await page.goto(item.route);
    const chat = page.getByLabel("正常对话区域");
    const flow = page.getByLabel("时序图区域");

    await expect(chat).toContainText("用户");
    await page.getByRole("button", { name: /下一步/ }).click();
    await expect(chat).toContainText("思考中");
    await expect(chat).not.toContainText(item.oldChatText);
    await expect(flow).toContainText(item.flowMustHave);
    await expect(flow).not.toContainText(item.flowMustNotHave);
  }
});

test("steps through the minimal agent loop demo and shows context-driven decisions", async ({
  page,
}) => {
  await page.goto("/chapters/12/demos/context-driven-loop");

  const chat = page.getByLabel("正常对话区域");
  const flow = page.getByLabel("时序图区域");

  await expect(page.getByLabel("演示步进控制")).toContainText("第 1 步");
  await expect(chat).toContainText("帮我规划明天下午去上海张江客户现场");
  await expect(flow).toContainText("接收目标");

  for (const label of ["发送决策上下文", "模型选择查天气", "模型选择查日历", "拦截越权动作"]) {
    for (let attempts = 0; attempts < 8; attempts += 1) {
      if ((await flow.getByRole("button", { name: label }).count()) > 0) {
        break;
      }
      await page.getByRole("button", { name: /下一步/ }).click();
    }
    await expect(flow.getByRole("button", { name: label })).toBeVisible();
  }

  await flow.getByRole("button", { name: "拦截越权动作" }).hover();
  await expect(page.getByLabel("当前传输数据")).toContainText("send_external_email");
});

test("covers RAG, memory, skills, channel, connector, and approval demos", async ({ page }) => {
  const cases = [
    {
      route: "/chapters/14/demos/two-rag-paths",
      labels: ["路径一：工程检索", "路径二：提供检索工具", "模型生成检索句"],
      payloadLabel: "路径二：提供检索工具",
      payloadText: "search_contract_chunks",
    },
    {
      route: "/chapters/16/demos/memory-implementations",
      labels: ["实现一：外部检索", "实现二：提示词声明", "模型检索记忆"],
      payloadLabel: "模型检索记忆",
      payloadText: "search_memory",
    },
    {
      route: "/chapters/17/demos/skill-progressive-loading",
      labels: ["提示词列出技能", "读取入口文件", "渐进式暴露"],
      payloadLabel: "提示词列出技能",
      payloadText: "/skills/meeting-notes/SKILL.md",
    },
    {
      route: "/chapters/23/demos/channel-prompts",
      labels: ["通道收到消息", "注入通道提示词", "生成飞书表单"],
      payloadLabel: "注入通道提示词",
      payloadText: "interactive_card",
    },
    {
      route: "/chapters/24/demos/connector-auth-flow",
      labels: ["检查授权状态", "请求用户授权", "调用平台 CLI"],
      payloadLabel: "请求用户授权",
      payloadText: "auth.example.local/oauth/mail",
    },
    {
      route: "/chapters/25/demos/approval-gate",
      labels: ["请求发送工具", "工程层识别风险", "展示确认弹窗"],
      payloadLabel: "工程层识别风险",
      payloadText: "execute_now",
    },
  ];

  for (const item of cases) {
    await page.goto(item.route);
    const flow = page.getByLabel("时序图区域");

    for (const label of item.labels) {
      for (let attempts = 0; attempts < 8; attempts += 1) {
        if ((await flow.getByRole("button", { name: label }).count()) > 0) {
          break;
        }
        await page.getByRole("button", { name: /下一步/ }).click();
      }
      await expect(flow.getByRole("button", { name: label })).toBeVisible();
    }

    await flow.getByRole("button", { name: item.payloadLabel }).hover();
    await expect(page.getByLabel("当前传输数据")).toContainText(item.payloadText);
    await page.mouse.move(10, 10);
  }
});
