import { HomeFullpage } from "../components/home/HomeFullpage";
import { landingContent } from "../lib/landing-content";

export function meta() {
  return [
    { title: landingContent.courseName },
    {
      name: "description",
      content: `${landingContent.courseName}，${landingContent.heroPromise}。`,
    },
  ];
}

export default function HomeRoute() {
  return (
    <main className="bg-sky-50 text-slate-950">
      <HomeFullpage content={landingContent} />
    </main>
  );
}
