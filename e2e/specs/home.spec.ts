import { expect, test } from "@playwright/test";

test("renders the share display page without development status or module lists", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LLM 技术全景课" })).toBeVisible();
  await expect(page.getByLabel("首页首屏").getByText("建立完整地图")).toBeVisible();
  await expect(page.getByRole("img", { name: "抽象系统剖面图" })).toBeVisible();
  await expect
    .poll(async () =>
      page.getByRole("img", { name: "抽象系统剖面图" }).evaluate((image) => {
        const element = image as HTMLImageElement;

        return element.complete && element.naturalWidth > 0;
      }),
    )
    .toBe(true);
  await expect(page.getByRole("link", { exact: true, name: "开始体验" })).toHaveAttribute(
    "href",
    "/chapters/01",
  );
  await expect(page.locator("#home-header")).toHaveCount(0);
  await expect(page.getByLabel("课程价值整屏滚动")).toBeVisible();
  await expect(page.getByRole("heading", { name: "把零散概念串成一条主线" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "看懂真实 LLM 应用的系统边界" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "降低团队沟通成本" })).toHaveCount(1);

  await expect(page.getByLabel("课程地图预览")).toHaveCount(0);
  await expect(page.getByRole("heading", { exact: true, level: 2, name: "课程大纲" })).toHaveCount(
    0,
  );
  await expect(page.getByText("第 01 章")).toHaveCount(0);
  await expect(page.getByText("最小的一次 LLM 对话")).toHaveCount(0);
  await expect(page.getByText(/模块 0[1-4]/)).toHaveCount(0);
  await expect(page.getByText("已确认")).toHaveCount(0);
  await expect(page.getByText("待确认")).toHaveCount(0);
  await expect(page.getByText("内部分享展示页")).toHaveCount(0);
  await expect(page.getByText("Made with fullPage.js")).toBeHidden();
  await expect(page.getByText("我这段话有点绕")).toHaveCount(0);
  await expect(page.getByText("明天下午我要去上海客户现场")).toHaveCount(0);
  await expect(page.getByText("预约课程")).toHaveCount(0);
  await expect(page.getByText("会议链接待补充")).toHaveCount(0);

  const fullpageBox = await page.getByLabel("课程价值整屏滚动").boundingBox();
  const viewport = page.viewportSize();

  expect(fullpageBox).not.toBeNull();
  expect(viewport).not.toBeNull();

  if (viewport) {
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
  }

  await page.mouse.wheel(0, 1400);
  await expect(page.getByRole("heading", { name: "把零散概念串成一条主线" })).toBeInViewport();
  await expect(page.getByLabel("把零散概念串成一条主线价值区块")).toBeInViewport();

  await page.goto("/#chapter-one");
  await expect(page.getByLabel("进入第一章")).toBeInViewport();
  await expect(page.getByRole("link", { exact: true, name: "进入第一章" })).toHaveAttribute(
    "href",
    "/chapters/01",
  );
});
