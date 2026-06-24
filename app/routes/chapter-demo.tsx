import { useParams } from "react-router";

import {
  CourseDemoPage,
  CourseNotFound,
} from "../components/course/ChapterExperience";
import { getCourseChapter, getCourseDemo } from "../lib/course-content";

export function meta({ params }: { params: { chapterId?: string; demoId?: string } }) {
  const chapter = getCourseChapter(params.chapterId);
  const demo = getCourseDemo(params.chapterId, params.demoId);

  return [
    { title: `${demo?.title ?? "章节演示"} | ${chapter?.title ?? "LLM 技术全景课"}` },
    {
      name: "description",
      content: demo?.summary ?? "LLM 技术全景课章节演示。",
    },
  ];
}

export default function ChapterDemoRoute() {
  const params = useParams();
  const chapter = getCourseChapter(params.chapterId);
  const demo = getCourseDemo(params.chapterId, params.demoId);

  if (!chapter || !demo) {
    return <CourseNotFound chapterNumber={params.chapterId} />;
  }

  return <CourseDemoPage chapter={chapter} demo={demo} />;
}
