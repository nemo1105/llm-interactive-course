import { expect, test } from "@playwright/test";

test("renders the share display page with value and outline placeholders", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LLM 技术全景课" })).toBeVisible();
  await expect(page.locator("#top").getByText("建立完整地图")).toBeVisible();
  await expect(page.getByLabel("课程地图预览")).toBeVisible();

  await expect(page.getByRole("heading", { exact: true, level: 2, name: "课程价值" })).toBeVisible();
  await expect(page.getByRole("heading", { exact: true, level: 2, name: "课程大纲" })).toBeVisible();
  await expect(page.locator("#outline").getByText("模块 01")).toBeVisible();
  await expect(page.locator("#outline").getByText("模块 04")).toBeVisible();

  await expect(page.getByText("预约课程")).toHaveCount(0);
  await expect(page.getByText("会议链接待补充")).toHaveCount(0);
});
