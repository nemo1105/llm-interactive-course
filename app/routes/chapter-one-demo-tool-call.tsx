import { ChapterOneDemoPage } from "../components/chapter-one/ChapterOneExperience";
import { getChapterDemo } from "../lib/chapter-one-content";

const demo = getChapterDemo("tool-call");

export function meta() {
  return [
    { title: `${demo.title} | 第一章 | LLM 技术全景课` },
    {
      name: "description",
      content: "工具调用演示：展示 get_weather 请求、mock 工具返回和最终回答。",
    },
  ];
}

export default function ChapterOneToolCallDemoRoute() {
  return <ChapterOneDemoPage demoId="tool-call" />;
}
