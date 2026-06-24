import { useParams } from "react-router";

import {
  CourseChapterHome,
  CourseNotFound,
} from "../components/course/ChapterExperience";
import { getCourseChapter } from "../lib/course-content";

export function meta({ params }: { params: { chapterId?: string } }) {
  const chapter = getCourseChapter(params.chapterId);

  return [
    { title: `${chapter?.title ?? "章节"} | LLM 技术全景课` },
    {
      name: "description",
      content: chapter?.summary ?? "LLM 技术全景课章节页面。",
    },
  ];
}

export default function ChapterRoute() {
  const params = useParams();
  const chapter = getCourseChapter(params.chapterId);

  if (!chapter) {
    return <CourseNotFound chapterNumber={params.chapterId} />;
  }

  return <CourseChapterHome chapter={chapter} />;
}
