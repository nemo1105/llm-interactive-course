import { expect, test, type Locator, type Page } from "@playwright/test";

async function hoverTransferPayload(page: Page, flow: Locator, messageName: string): Promise<Locator> {
  await flow.getByRole("button", { name: messageName }).hover();
  const payload = page.getByLabel("当前传输数据");
  await expect(payload).toBeVisible();
  return payload;
}

async function selectPayloadFormat(payload: Locator, formatName: "Chat Completions" | "Responses API") {
  await payload
    .getByLabel("传输数据格式切换")
    .getByRole("button", { name: formatName })
    .click();
}

async function dismissPayload(page: Page) {
  await page.mouse.move(10, 10);
  await expect(page.getByLabel("当前传输数据")).toHaveCount(0);
}

async function expectPopoverFitsViewport(page: Page, payload: Locator) {
  const box = await payload.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();

  if (!box || !viewport) {
    return;
  }

  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
}

async function expectPopoverClearOfTopToolbar(page: Page, payload: Locator) {
  const payloadBox = await payload.boundingBox();
  const toolbarBox = await page.getByLabel("演示顶部工具栏").boundingBox();

  expect(payloadBox).not.toBeNull();
  expect(toolbarBox).not.toBeNull();

  if (!payloadBox || !toolbarBox) {
    return;
  }

  expect(payloadBox.y).toBeGreaterThanOrEqual(toolbarBox.y + toolbarBox.height);
}

async function expectPayloadBesideMessage(
  payload: Locator,
  message: Locator,
  side: "left" | "right",
) {
  await expect
    .poll(async () => {
      const payloadBox = await payload.boundingBox();
      const messageBox = await message.boundingBox();

      if (!payloadBox || !messageBox) {
        return false;
      }

      if (side === "right") {
        return payloadBox.x >= messageBox.x + messageBox.width + 8;
      }

      return payloadBox.x + payloadBox.width <= messageBox.x - 8;
    })
    .toBe(true);
}

async function expectChatContentStartsNearTopAndFocusIsHighlighted(
  chat: Locator,
  firstMessageText: string,
  focusedMessageText: string,
) {
  const firstMessage = chat.getByText(firstMessageText).locator("..");
  const focusedMessage = chat.getByText(focusedMessageText).locator("..");

  await expect
    .poll(async () => {
      const listBox = await chat.getByLabel("聊天消息列表").boundingBox();
      const messageBox = await firstMessage.boundingBox();
      const metrics = await chat.getByLabel("聊天消息列表").evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        scrollTop: element.scrollTop,
      }));

      if (!listBox || !messageBox) {
        return false;
      }

      const topGap = messageBox.y - listBox.y;

      return (
        metrics.scrollHeight <= metrics.clientHeight + 1 &&
        metrics.scrollTop === 0 &&
        topGap >= 16 &&
        topGap <= 40
      );
    })
    .toBe(true);

  await expect(focusedMessage).toHaveClass(/ring-orange-400/);
}

async function expectFocusedChatMessageNearBottomWhenScrollable(
  chat: Locator,
  messageText: string,
) {
  const message = chat.getByText(messageText).locator("..");

  await expect
    .poll(async () => {
      const listBox = await chat.getByLabel("聊天消息列表").boundingBox();
      const messageBox = await message.boundingBox();
      const metrics = await chat.getByLabel("聊天消息列表").evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
      }));

      if (!listBox || !messageBox) {
        return false;
      }

      const listBottom = listBox.y + listBox.height - 24;
      const distanceFromBottom = listBottom - (messageBox.y + messageBox.height);
      const tolerance = Math.max(36, listBox.height * 0.18);

      return (
        metrics.scrollHeight > metrics.clientHeight + 1 &&
        distanceFromBottom >= -8 &&
        distanceFromBottom <= tolerance
      );
    })
    .toBe(true);

  await expect(message).toHaveClass(/ring-orange-400/);
}

async function expectChatPanePinned(chat: Locator) {
  const box = await chat.boundingBox();
  const viewportHeight = await chat.evaluate(() => window.innerHeight);

  expect(box).not.toBeNull();

  if (!box) {
    return;
  }

  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(viewportHeight);
}

async function expectDocumentNotScrolled(page: Page) {
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBe(0);
}

async function expectNextButtonStable(page: Page, initialBox: NonNullable<Awaited<ReturnType<Locator["boundingBox"]>>>) {
  const box = await page.getByRole("button", { name: /下一步/ }).boundingBox();

  expect(box).not.toBeNull();

  if (!box) {
    return;
  }

  expect(Math.abs(box.x - initialBox.x)).toBeLessThanOrEqual(2);
  expect(Math.abs(box.y - initialBox.y)).toBeLessThanOrEqual(2);
}

async function expectSequenceMessageVisibleInFlow(flow: Locator, messageName: string) {
  const message = flow.getByRole("button", { name: messageName });

  await expect
    .poll(async () => {
      const messageBox = await message.boundingBox();
      const scrollBox = await flow.getByLabel("时序图滚动区域").boundingBox();

      if (!messageBox || !scrollBox) {
        return false;
      }

      const topGuard = scrollBox.y + 8;
      const bottomGuard = scrollBox.y + scrollBox.height - 8;

      return messageBox.y >= topGuard && messageBox.y + messageBox.height <= bottomGuard;
    })
    .toBe(true);
}

async function expectNoPayloadFormatHeader(payload: Locator) {
  await expect(payload).not.toContainText("两种官方 API");
  await expect(payload).not.toContainText("Chat Completions request");
  await expect(payload).not.toContainText("Responses API request");
  await expect(payload).not.toContainText("Chat Completions response");
  await expect(payload).not.toContainText("Responses API response");
  await expect(payload).not.toContainText("json");
}

async function expectJsonTreePayload(payload: Locator) {
  await expect(payload.getByLabel("JSON 树传输数据")).toBeVisible();
}

async function expectJsonKeyCollapsedUntilOpened(
  payload: Locator,
  key: string,
  nestedKey: string,
) {
  await expect(payload).toContainText(`"${key}"`);
  await expect(payload).not.toContainText(`"${nestedKey}"`);
  await payload.getByText(new RegExp(`^"${key}":\\s*$`)).first().click();
  await expect(payload).toContainText(`"${nestedKey}"`);
}

test("renders the first chapter homepage with fixed navigation", async ({ page }) => {
  await page.goto("/chapters/01");

  await expect(page.getByRole("heading", { name: "第一章：最小的一次 LLM 对话" })).toBeVisible();
  await expect(page.getByText("本章要讲什么")).toBeVisible();
  await expect(page.getByRole("link", { name: "进入演示" })).toHaveAttribute(
    "href",
    "/chapters/01/demos/direct",
  );
  await expect(page.getByRole("link", { name: "下一章" })).toHaveAttribute("href", "/chapters/02");

  await page.getByRole("link", { name: "进入演示" }).click();
  await expect(page).toHaveURL(/\/chapters\/01\/demos\/direct$/);
});

test("switches chapter demos from the top navigation select", async ({ page }) => {
  await page.goto("/chapters/01/demos/direct");

  await expect(page.getByLabel("选择演示")).toHaveValue("direct");
  await expect(page.getByText("从真实聊天看见一次推理调用")).toHaveCount(0);

  await page.getByLabel("选择演示").selectOption("tool-call");
  await expect(page).toHaveURL(/\/chapters\/01\/demos\/tool-call$/);
  await expect(page.getByLabel("选择演示")).toHaveValue("tool-call");

  await page.getByLabel("选择演示").selectOption("streaming");
  await expect(page).toHaveURL(/\/chapters\/01\/demos\/streaming$/);
  await expect(page.getByLabel("选择演示")).toHaveValue("streaming");

  await page.getByLabel("选择演示").selectOption("direct");
  await expect(page).toHaveURL(/\/chapters\/01\/demos\/direct$/);
});

test("steps through the direct conversation with synchronized chat and sequence diagram", async ({
  page,
}) => {
  await page.goto("/chapters/01/demos/direct");

  const chat = page.getByLabel("正常对话区域");
  const flow = page.getByLabel("时序图区域");

  await expect(page.getByLabel("选择演示")).toHaveValue("direct");
  await expect(page.getByRole("heading", { name: "普通对话演示" })).toHaveCount(0);
  await expect(page.getByLabel("演示步进控制")).toContainText("第 1 步 / 共 4 步");
  await expect(chat).toContainText("我这段话有点绕");
  await expect(chat).not.toContainText("思考中");
  await expect(flow).toContainText("用户");
  await expect(flow).toContainText("应用服务器");
  await expect(flow).toContainText("大模型");
  await expect(flow).toContainText("发送消息");
  await expect(flow).not.toContainText("模型响应");
  await expect(page.getByLabel("当前传输数据")).toHaveCount(0);
  await expect(page.getByLabel("传输数据格式切换")).toHaveCount(0);

  let payload = await hoverTransferPayload(page, flow, "发送消息");
  await expect(payload).toContainText("发送消息：应用接收用户消息");
  await expectNoPayloadFormatHeader(payload);
  await expectJsonTreePayload(payload);
  await expect(payload).toContainText('"conversation_id": "001"');
  await expect(payload).toContainText('"message": "我这段话有点绕');
  await expect(payload).toContainText("我这段话有点绕");
  await expect(payload).not.toContainText('"model"');
  await expect(payload).not.toContainText('"messages"');
  await expect(payload).not.toContainText('"input"');
  await expect(payload.getByLabel("传输数据格式切换")).toHaveCount(0);
  await expectPopoverClearOfTopToolbar(page, payload);
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 2 步 / 共 4 步");
  await expect(chat).toContainText("思考中……");
  await expect(flow).toContainText("请求大模型");
  payload = await hoverTransferPayload(page, flow, "请求大模型");
  await expect(payload).toContainText("请求大模型");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"model": "gpt-5.5"');
  await expect(payload).toContainText('"messages"');
  await expect(payload.getByLabel("传输数据格式切换")).toBeVisible();
  await selectPayloadFormat(payload, "Responses API");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"instructions"');
  await expect(payload).toContainText('"input"');
  await expect(payload).toContainText('"store": false');
  await expect(payload).not.toContainText('"messages"');
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 3 步 / 共 4 步");
  await expect(chat).toContainText("思考中……");
  await expect(flow).toContainText("返回模型响应");
  payload = await hoverTransferPayload(page, flow, "返回模型响应");
  await expect(payload).toContainText("返回模型响应");
  await expectNoPayloadFormatHeader(payload);
  await expectJsonTreePayload(payload);
  await expect(payload).toContainText('"object": "response"');
  await expect(payload).toContainText('"output"');
  await expect(payload).not.toContainText('"choices"');
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 4 步 / 共 4 步");
  await expect(chat).toContainText("可以改成：我们明天提前到会议室");
  payload = await hoverTransferPayload(page, flow, "展示回答");
  await expect(payload).toContainText("展示回答：应用服务器写回界面");
  await expect(payload.getByLabel("传输数据格式切换")).toHaveCount(0);
  await expect(flow.getByLabel("时序图底部参与者")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /下一步/ })).toBeDisabled();
});

test("streams the direct rewrite answer with synchronized loop markers and partial chat updates", async ({
  page,
}) => {
  await page.goto("/chapters/01/demos/streaming");

  const chat = page.getByLabel("正常对话区域");
  const flow = page.getByLabel("时序图区域");

  await expect(page.getByLabel("选择演示")).toHaveValue("streaming");
  await expect(page.getByLabel("演示步进控制")).toContainText("第 1 步 / 共 9 步");
  await expect(chat).toContainText("我这段话有点绕");
  await expect(chat).not.toContainText("思考中");
  await expect(chat).not.toContainText("可以改成：");
  await expect(flow).toContainText("发送消息");
  await expect(flow).not.toContainText("请求流式输出");
  await expect(flow.getByLabel(/循环标记/)).toHaveCount(0);

  let payload = await hoverTransferPayload(page, flow, "发送消息");
  await expect(payload).toContainText('"conversation_id": "003"');
  await expect(payload).not.toContainText('"stream"');
  await expect(payload.getByLabel("传输数据格式切换")).toHaveCount(0);
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 2 步 / 共 9 步");
  await expect(chat).toContainText("思考中……");
  payload = await hoverTransferPayload(page, flow, "请求流式输出");
  await expect(payload).toContainText('"stream": true');
  await expect(payload).toContainText('"messages"');
  await selectPayloadFormat(payload, "Responses API");
  await expect(payload).toContainText('"stream": true');
  await expect(payload).toContainText('"input"');
  await expect(payload).not.toContainText('"messages"');
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 3 步 / 共 9 步");
  await expect(chat).toContainText("思考中……");
  await expect(chat).not.toContainText("可以改成：");
  await expect(flow.getByLabel("循环标记：读取片段并更新气泡")).toBeVisible();
  payload = await hoverTransferPayload(page, flow, "读取片段 1");
  await expect(payload).toContainText("SSE event");
  await expect(payload).toContainText("response.output_text.delta");
  await expect(payload.getByLabel("SSE data JSON")).toBeVisible();
  await expect(payload).toContainText('"delta": "可以改成："');
  await expect(payload).not.toContainText("data: {");
  await selectPayloadFormat(payload, "Chat Completions");
  await expect(payload).toContainText('"object": "chat.completion.chunk"');
  await expect(payload).toContainText('"delta"');
  await expect(payload).toContainText("可以改成：");
  await selectPayloadFormat(payload, "Responses API");
  await expect(payload).toContainText("SSE event");
  await expect(payload).toContainText("response.output_text.delta");
  await expect(payload.getByLabel("SSE data JSON")).toBeVisible();
  await expect(payload).toContainText('"delta": "可以改成："');
  await expect(payload).not.toContainText("data: {");
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 4 步 / 共 9 步");
  await expect(chat).toContainText("可以改成：");
  await expect(chat).toContainText("生成中");
  await expect(chat).not.toContainText("我们明天提前到会议室");
  payload = await hoverTransferPayload(page, flow, "更新气泡 1");
  await expect(payload).toContainText('"append_delta": "可以改成："');
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 5 步 / 共 9 步");
  await expect(flow).toContainText("读取片段 2");
  await expect(flow).not.toContainText("读取片段 3");

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 6 步 / 共 9 步");
  await expect(chat).toContainText("我们明天提前到会议室，先调试投影设备，");
  await expect(chat).toContainText("生成中");

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 7 步 / 共 9 步");
  await expect(flow).toContainText("读取片段 3");
  await expect(flow).not.toContainText("流式完成");

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 8 步 / 共 9 步");
  await expect(chat).toContainText("可以改成：我们明天提前到会议室，先调试投影设备，避免会议开始后耽误时间。");
  await expect(chat).toContainText("生成中");

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 9 步 / 共 9 步");
  await expect(chat).toContainText("已回复");
  await expect(chat).not.toContainText("生成中");
  payload = await hoverTransferPayload(page, flow, "流式完成");
  await expect(payload).toContainText("SSE event");
  await expect(payload).toContainText("response.completed");
  await expect(payload.getByLabel("SSE data JSON")).toBeVisible();
  await expect(payload).toContainText('"status": "completed"');
  await selectPayloadFormat(payload, "Chat Completions");
  await expect(payload).toContainText('"finish_reason": "stop"');
});

test("steps through the tool-call demo without revealing future flow events", async ({ page }) => {
  await page.goto("/chapters/01/demos/tool-call");

  const chat = page.getByLabel("正常对话区域");
  const flow = page.getByLabel("时序图区域");

  await expect(page.getByLabel("选择演示")).toHaveValue("tool-call");
  await expect(page.getByRole("heading", { name: "工具调用演示" })).toHaveCount(0);
  await expect(page.getByLabel("演示步进控制")).toContainText("第 1 步 / 共 8 步");
  await expect(chat).toContainText("明天下午我要去上海客户现场");
  await expect(chat).not.toContainText("思考中");
  await expect(chat).not.toContainText("正在确认上海");
  await expect(flow).toContainText("发送消息");
  await expect(flow).not.toContainText("执行 get_weather");
  await expect(flow.getByLabel("时序图底部参与者")).toHaveCount(0);
  let payload = await hoverTransferPayload(page, flow, "发送消息");
  await expect(payload).toContainText("发送消息：应用接收用户消息");
  await expectNoPayloadFormatHeader(payload);
  await expectJsonTreePayload(payload);
  await expect(payload).toContainText('"conversation_id": "002"');
  await expect(payload).toContainText('"message": "明天下午我要去上海客户现场');
  await expect(payload).toContainText("明天下午我要去上海客户现场");
  await expect(payload).not.toContainText('"model"');
  await expect(payload).not.toContainText('"messages"');
  await expect(payload).not.toContainText('"tools"');
  await expect(payload.getByLabel("传输数据格式切换")).toHaveCount(0);
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(chat).toContainText("思考中……");
  await expect(chat).not.toContainText("正在确认上海");
  await expect(flow).toContainText("请求大模型");
  payload = await hoverTransferPayload(page, flow, "请求大模型");
  await expect(payload).toContainText("请求大模型");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"model": "gpt-5.5"');
  await expect(payload).toContainText('"tools"');
  await selectPayloadFormat(payload, "Responses API");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"store": false');
  await expect(payload).toContainText('"input"');
  await expect(payload).not.toContainText('"messages"');
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(chat).toContainText("思考中……");
  await expect(flow).toContainText("返回工具调用");
  payload = await hoverTransferPayload(page, flow, "返回工具调用");
  await expect(payload).toContainText("返回工具调用");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"type": "function_call"');
  await expect(payload).toContainText('"call_id": "call_weather_shanghai"');
  await selectPayloadFormat(payload, "Chat Completions");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"tool_calls"');
  await expect(payload).toContainText('"arguments"');
  await expect(payload).toContainText("上海");
  await selectPayloadFormat(payload, "Responses API");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"type": "function_call"');
  await expect(payload).toContainText('"call_id": "call_weather_shanghai"');
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(chat).toContainText("思考中……");
  await expect(flow).toContainText("get_weather");
  await expect(flow).toContainText("执行 get_weather");
  payload = await hoverTransferPayload(page, flow, "执行 get_weather");
  await expect(payload).toContainText("执行 get_weather：应用服务器调用工具");
  await expect(flow.getByLabel("时序图底部参与者")).toHaveCount(0);
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(chat).toContainText("思考中……");
  const bottomActors = flow.getByLabel("时序图底部参与者");
  await expect(bottomActors).toBeVisible();
  await expect(bottomActors).toContainText("用户");
  await expect(bottomActors).toContainText("应用服务器");
  await expect(bottomActors).toContainText("大模型");
  await expect(bottomActors).toContainText("get_weather");
  payload = await hoverTransferPayload(page, flow, "返回天气数据");
  await expect(payload).toContainText("返回天气数据：工具执行结果");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"temperature": "22-25℃"');
  await expect(payload).toContainText('"precipitation_probability": "82%"');
  await expect(payload.getByLabel("传输数据格式切换")).toHaveCount(0);
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  payload = await hoverTransferPayload(page, flow, "回写工具结果");
  await expect(payload).toContainText("回写工具结果");
  await expectNoPayloadFormatHeader(payload);
  await selectPayloadFormat(payload, "Responses API");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"function_call_output"');
  await expect(payload).toContainText('"type": "function_call"');
  await expect(payload).toContainText('"name": "get_weather"');
  await expect(payload).toContainText('"store": false');
  await expect(payload).not.toContainText('"previous_response_id"');
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  payload = await hoverTransferPayload(page, flow, "返回最终响应");
  await expect(payload).toContainText("返回最终响应");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"object": "response"');
  await expect(payload).toContainText('"output"');
  await expect(chat).not.toContainText("建议带伞。2026-06-24");
  await dismissPayload(page);

  await page.getByRole("button", { name: /下一步/ }).click();
  await expect(chat).toContainText("建议带伞。2026-06-24");
  payload = await hoverTransferPayload(page, flow, "展示建议");
  await expect(payload).toContainText("展示建议：应用服务器写回界面");
  await expectNoPayloadFormatHeader(payload);
});

test("keeps the payload popover inside a short viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1180, height: 520 });
  await page.goto("/chapters/01/demos/tool-call");

  const flow = page.getByLabel("时序图区域");

  for (let index = 0; index < 6; index += 1) {
    await page.getByRole("button", { name: /下一步/ }).click();
  }

  const payload = await hoverTransferPayload(page, flow, "返回最终响应");

  await expect(payload).toContainText("返回最终响应");
  await expectNoPayloadFormatHeader(payload);
  await expectPopoverFitsViewport(page, payload);
  await selectPayloadFormat(payload, "Responses API");
  await expectNoPayloadFormatHeader(payload);
  await expect(payload).toContainText('"object": "response"');
  await expect(payload).not.toContainText('"previous_response_id"');
  await expectPopoverFitsViewport(page, payload);
});

test("places payload popovers beside sequence messages when side space is available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 760 });
  await page.goto("/chapters/01/demos/tool-call");

  const flow = page.getByLabel("时序图区域");
  const firstMessage = flow.getByRole("button", { name: "发送消息" });
  let payload = await hoverTransferPayload(page, flow, "发送消息");
  await expectPayloadBesideMessage(payload, firstMessage, "right");
  await expectPopoverFitsViewport(page, payload);
  await dismissPayload(page);

  for (let index = 0; index < 3; index += 1) {
    await page.getByRole("button", { name: /下一步/ }).click();
  }

  const toolMessage = flow.getByRole("button", { name: "执行 get_weather" });
  payload = await hoverTransferPayload(page, flow, "执行 get_weather");
  await expectPayloadBesideMessage(payload, toolMessage, "left");
  await expectPopoverFitsViewport(page, payload);
});

test("keeps the chat pane pinned and positions the focused chat message naturally", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 760 });
  await page.goto("/chapters/01/demos/tool-call");

  const chat = page.getByLabel("正常对话区域");

  await expectChatContentStartsNearTopAndFocusIsHighlighted(
    chat,
    "明天下午我要去上海客户现场，出门要带伞吗？",
    "明天下午我要去上海客户现场，出门要带伞吗？",
  );

  for (let index = 0; index < 6; index += 1) {
    await page.getByRole("button", { name: /下一步/ }).click();
  }

  await expectDocumentNotScrolled(page);
  await expectChatPanePinned(chat);
  await expectChatContentStartsNearTopAndFocusIsHighlighted(
    chat,
    "明天下午我要去上海客户现场，出门要带伞吗？",
    "思考中……",
  );

  await page.setViewportSize({ width: 1440, height: 360 });
  await page.getByRole("button", { name: /下一步/ }).click();
  await expectFocusedChatMessageNearBottomWhenScrollable(chat, "建议带伞。2026-06-24");
});

test("keeps top step controls stable while stepping a tall tool-call sequence", async ({ page }) => {
  await page.setViewportSize({ width: 1180, height: 520 });
  await page.goto("/chapters/01/demos/tool-call");

  const initialNextButtonBox = await page.getByRole("button", { name: /下一步/ }).boundingBox();
  expect(initialNextButtonBox).not.toBeNull();

  if (!initialNextButtonBox) {
    return;
  }

  for (let index = 0; index < 6; index += 1) {
    await page.getByRole("button", { name: /下一步/ }).click();
    await expectNextButtonStable(page, initialNextButtonBox);
    await expectDocumentNotScrolled(page);
  }

  await expect(page.getByRole("button", { name: /下一步/ })).toBeVisible();
  await expect(page.getByLabel("演示步进控制")).toContainText("第 7 步 / 共 8 步");
});

test("scrolls newly revealed sequence messages into view while stepping", async ({ page }) => {
  await page.setViewportSize({ width: 1180, height: 520 });
  await page.goto("/chapters/01/demos/tool-call");

  const flow = page.getByLabel("时序图区域");
  const expectedMessages = [
    "请求大模型",
    "返回工具调用",
    "执行 get_weather",
    "返回天气数据",
    "回写工具结果",
    "返回最终响应",
    "展示建议",
  ];

  for (const messageName of expectedMessages) {
    await page.getByRole("button", { name: /下一步/ }).click();
    await expectSequenceMessageVisibleInFlow(flow, messageName);
    await expectDocumentNotScrolled(page);
  }
});

test("reserves the next chapter route without unconfirmed content", async ({ page }) => {
  await page.goto("/chapters/02");

  await expect(page.getByRole("heading", { name: "第二章" })).toBeVisible();
  await expect(page.getByText("这一页会在课程推进时承接后续互动体验")).toBeVisible();
  await expect(page.getByText("token")).toHaveCount(0);
  await expect(page.getByText("RAG")).toHaveCount(0);
});
