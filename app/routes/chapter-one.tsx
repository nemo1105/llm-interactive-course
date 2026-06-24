import { ChapterOneHome } from "../components/chapter-one/ChapterOneExperience";
import { chapterOneContent } from "../lib/chapter-one-content";

export function meta() {
  return [
    { title: `${chapterOneContent.title} | LLM 技术全景课` },
    {
      name: "description",
      content: "第一章首页：说明普通对话、流式输出和工具调用三种演示会讲什么。",
    },
  ];
}

export default function ChapterOneRoute() {
  return <ChapterOneHome />;
}
