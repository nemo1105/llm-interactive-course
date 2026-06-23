import { ChapterOneDemoPage } from "../components/chapter-one/ChapterOneExperience";
import { getChapterDemo } from "../lib/chapter-one-content";

const demo = getChapterDemo("direct");

export function meta() {
  return [
    { title: `${demo.title} | 第一章 | LLM 技术全景课` },
    {
      name: "description",
      content: "普通对话演示：左侧聊天，右侧时序图展示完整模型请求和响应。",
    },
  ];
}

export default function ChapterOneDirectDemoRoute() {
  return <ChapterOneDemoPage demoId="direct" />;
}
