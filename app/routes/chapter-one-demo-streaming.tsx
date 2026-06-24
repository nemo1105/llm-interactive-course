import { ChapterOneDemoPage } from "../components/chapter-one/ChapterOneExperience";
import { getChapterDemo } from "../lib/chapter-one-content";

const demo = getChapterDemo("streaming");

export function meta() {
  return [
    { title: `${demo.title} | 第一章 | LLM 技术全景课` },
    {
      name: "description",
      content: "流式输出演示：展示同一个改写回答如何按片段返回并逐步更新助手气泡。",
    },
  ];
}

export default function ChapterOneStreamingDemoRoute() {
  return <ChapterOneDemoPage demoId="streaming" />;
}
