import { chapterOneContent } from "./chapter-one-content";
import { courseChapters } from "./course-content";

export function getStaticRoutePaths(): string[] {
  const paths = new Set<string>(["/"]);

  paths.add(chapterOneContent.homepageRoute);
  for (const demo of chapterOneContent.demos) {
    paths.add(demo.route);
  }

  for (const chapter of courseChapters) {
    paths.add(chapter.route);
    for (const demo of chapter.demos) {
      paths.add(demo.route);
    }
  }

  return Array.from(paths).sort();
}
