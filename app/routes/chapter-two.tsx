import { Home } from "lucide-react";

import { Button } from "../components/ui/button";

export function meta() {
  return [
    { title: "第二章 | LLM 技术全景课" },
    {
      name: "description",
      content: "第二章预留路由，内容待确认。",
    },
  ];
}

export default function ChapterTwoRoute() {
  return (
    <main className="min-h-screen bg-[#f6f7f2] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <nav className="flex min-h-16 w-full flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <a
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
            href="/"
          >
            <Home aria-hidden="true" className="size-4" />
            LLM 技术全景课
          </a>
          <Button asChild variant="secondary">
            <a href="/chapters/01">返回第一章</a>
          </Button>
        </nav>
      </header>

      <section className="w-full px-4 py-10 sm:px-6 lg:px-10">
        <p className="text-sm font-semibold text-slate-500">章节预留</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
          第二章
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          这个路由已经按固定章节模式预留，具体课程内容确认后再写入页面。
        </p>
      </section>
    </main>
  );
}
