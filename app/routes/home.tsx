import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Layers3,
  Map,
} from "lucide-react";

import { Button } from "../components/ui/button";
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
    <main className="min-h-screen scroll-smooth bg-sky-50 text-slate-950">
      <header className="sticky top-0 z-20 border-b border-sky-100 bg-sky-50/95 backdrop-blur">
        <nav className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
          <a className="text-sm font-semibold text-sky-950" href="#top">
            {landingContent.courseName}
          </a>
          <div className="hidden items-center gap-5 text-sm font-medium text-slate-600 sm:flex">
            <a className="transition-colors duration-200 hover:text-sky-800" href="#value">
              课程价值
            </a>
            <a className="transition-colors duration-200 hover:text-sky-800" href="#outline">
              课程大纲
            </a>
          </div>
        </nav>
      </header>

      <section
        className="relative isolate overflow-hidden border-b border-teal-100 bg-[#eef8f6] text-slate-950"
        id="top"
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(15,118,110,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.12)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-x-0 top-24 -z-10 h-px bg-sky-400/35" />
        <div className="absolute left-[12%] top-40 -z-10 hidden h-px w-[76%] rotate-6 bg-teal-600/20 md:block" />
        <div className="absolute left-[18%] top-72 -z-10 hidden h-px w-[66%] -rotate-3 bg-orange-500/25 md:block" />

        <div className="grid min-h-[calc(100vh-4rem)] w-full content-center gap-10 px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-teal-200 bg-white/75 px-3 py-2 text-sm font-medium text-teal-900 shadow-sm">
              <BookOpenCheck aria-hidden="true" className="size-4" />
              {landingContent.format}
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl">
              {landingContent.courseName}
            </h1>
            <p className="mt-6 max-w-2xl text-2xl font-medium text-teal-900">
              {landingContent.heroPromise}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">
              {landingContent.audienceNote}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href="#value">
                  查看课程价值
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </Button>
              <Button asChild variant="secondary">
                <a href="#outline">查看占位大纲</a>
              </Button>
            </div>
          </div>

          <div aria-label="课程地图预览" className="grid gap-3 sm:grid-cols-4">
            {landingContent.outlinePlaceholders.map((item, index) => (
              <div
                className="rounded-lg border border-teal-100 bg-white/85 p-4 shadow-sm backdrop-blur"
                key={item.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-950">{item.label}</span>
                  <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                    {item.status}
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-orange-400"
                    style={{ width: `${24 + index * 12}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-sky-100 bg-white py-16" id="value">
        <div className="grid w-full gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-10">
          <div>
            <p className="text-sm font-semibold text-sky-700">Course value</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">课程价值</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              分享时先帮助听众建立全局感；未确认的细节继续以占位呈现。
            </p>
          </div>
          <div className="grid gap-4 lg:col-span-2 md:grid-cols-3">
            {landingContent.valueItems.map((item, index) => (
              <InfoCard
                description={item.description}
                icon={index === 0 ? Map : CheckCircle2}
                key={item.id}
                title={item.title}
                value={item.status}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-sky-100 bg-white py-16" id="outline">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-700">Outline</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">课程大纲</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              大纲模块名暂不写入页面；确认后再替换这些占位。
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {landingContent.outlinePlaceholders.map((item) => (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={item.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-orange-600">{item.label}</span>
                  <Layers3 aria-hidden="true" className="size-5 text-slate-400" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{item.status}</h3>
                <div className="mt-5 grid h-24 place-items-center rounded-md border border-dashed border-slate-300 bg-white text-sm text-slate-400">
                  占位
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

type InfoCardProps = {
  description: string;
  icon: typeof Map;
  title: string;
  value: string;
};

function InfoCard({ description, icon: Icon, title, value }: InfoCardProps) {
  return (
    <div className="rounded-lg border border-sky-100 bg-sky-50 p-5">
      <Icon aria-hidden="true" className="size-5 text-sky-700" />
      <h3 className="mt-4 font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm font-medium text-orange-600">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
