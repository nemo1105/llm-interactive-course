import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  Home,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { DemoPlayer } from "../demo-player/DemoPlayer";
import { buildDemoPlayerState, type DemoPlayerState } from "../../lib/demo-player/player";
import {
  chapterOneContent,
  getChapterDemo,
  type ChapterDemoId,
} from "../../lib/chapter-one-content";
import { Button } from "../ui/button";

export function ChapterOneHome() {
  const firstDemo = chapterOneContent.demos[0];

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-slate-950">
      <ChapterHeader currentLabel="第一章首页" primaryHref={firstDemo.route} primaryLabel="进入演示" />

      <section className="border-b border-slate-200 bg-white">
        <div className="w-full px-4 py-10 sm:px-6 lg:px-10">
          <p className="text-sm font-semibold text-emerald-700">{chapterOneContent.eyebrow}</p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
                {chapterOneContent.title}
              </h1>
              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-700">
                {chapterOneContent.intro}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <BookOpen aria-hidden="true" className="size-4" />
                本章要讲什么
              </div>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-emerald-950">
                {chapterOneContent.whatYouLearn.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <ChevronRight aria-hidden="true" className="mt-1 size-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-2">
          {chapterOneContent.demos.map((demo) => (
            <Link
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50"
              key={demo.id}
              to={demo.route}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  {demo.id === "tool-call" ? (
                    <CloudRain aria-hidden="true" className="size-4 text-amber-600" />
                  ) : (
                    <MessageCircle aria-hidden="true" className="size-4 text-sky-600" />
                  )}
                  {demo.shortTitle}
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-slate-400 transition-transform group-hover:translate-x-1"
                />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{demo.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{demo.summary}</p>
              <p className="mt-4 text-sm font-medium text-emerald-800">{demo.outcome}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ChapterOneDemoPage({ demoId }: { demoId: ChapterDemoId }) {
  const demo = getChapterDemo(demoId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const state = buildDemoPlayerState(demo, currentStepIndex);
  const isFirst = state.currentStepIndex === 0;
  const isLast = state.currentStepIndex === demo.steps.length - 1;

  function moveStep(direction: -1 | 1) {
    setCurrentStepIndex((current) =>
      Math.min(Math.max(current + direction, 0), demo.steps.length - 1),
    );
  }

  function reset() {
    setCurrentStepIndex(0);
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[#f6f7f2] text-slate-950">
      <ChapterHeader
        activeDemoId={demo.id as ChapterDemoId}
        currentLabel={demo.shortTitle}
        primaryHref={chapterOneContent.homepageRoute}
        primaryLabel="返回章节首页"
        stepControls={{
          isFirst,
          isLast,
          onMoveStep: moveStep,
          onReset: reset,
          state,
          stepCount: demo.steps.length,
        }}
      />

      <DemoPlayer spec={demo} state={state} />
    </main>
  );
}

type DemoStepControls = {
  isFirst: boolean;
  isLast: boolean;
  onMoveStep: (direction: -1 | 1) => void;
  onReset: () => void;
  state: DemoPlayerState;
  stepCount: number;
};

function ChapterHeader({
  activeDemoId,
  currentLabel,
  primaryHref,
  primaryLabel,
  stepControls,
}: {
  activeDemoId?: ChapterDemoId;
  currentLabel: string;
  primaryHref: string;
  primaryLabel: string;
  stepControls?: DemoStepControls;
}) {
  const hasDemoSelect = activeDemoId && chapterOneContent.demos.length > 1;
  const navClass = stepControls
    ? "grid w-full gap-3 px-4 py-2 sm:px-6 lg:grid-cols-[minmax(10rem,0.18fr)_minmax(22rem,1fr)_max-content] lg:items-center lg:px-10"
    : "flex min-h-16 w-full flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10";

  return (
    <header
      aria-label={stepControls ? "演示顶部工具栏" : undefined}
      className="shrink-0 border-b border-slate-200 bg-white"
    >
      <nav className={navClass}>
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
          to="/"
        >
          <Home aria-hidden="true" className="size-4" />
          LLM 技术全景课
        </Link>
        {stepControls ? <TopStepControls controls={stepControls} /> : null}
        <div className="flex flex-wrap items-center justify-start gap-2 lg:flex-nowrap lg:justify-end">
          {hasDemoSelect ? (
            <DemoSelect activeDemoId={activeDemoId} />
          ) : (
            <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
              {currentLabel}
            </span>
          )}
          <Button asChild variant="secondary">
            <Link to={chapterOneContent.nextChapterRoute}>下一章</Link>
          </Button>
          <Button asChild>
            <Link to={primaryHref}>{primaryLabel}</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}

function TopStepControls({ controls }: { controls: DemoStepControls }) {
  return (
    <section
      aria-label="演示步进控制"
      className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5"
    >
      <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-950">
            {controls.state.currentStep.title}
          </div>
          <div className="mt-0.5 truncate text-xs text-slate-600">
            {controls.state.currentStep.description}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold text-slate-500">
            第 {controls.state.currentStepIndex + 1} 步 / 共 {controls.stepCount} 步
          </span>
          <Button
            disabled={controls.isFirst}
            onClick={() => controls.onMoveStep(-1)}
            type="button"
            variant="secondary"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
            上一步
          </Button>
          <Button
            disabled={controls.isLast}
            onClick={() => controls.onMoveStep(1)}
            type="button"
          >
            下一步
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
          <Button onClick={controls.onReset} type="button" variant="secondary">
            <RotateCcw aria-hidden="true" className="size-4" />
            重播
          </Button>
        </div>
      </div>
    </section>
  );
}

function DemoSelect({ activeDemoId }: { activeDemoId: ChapterDemoId }) {
  const navigate = useNavigate();

  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-sm font-medium text-slate-500">演示</span>
      <select
        aria-label="选择演示"
        className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-colors hover:border-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        onChange={(event) => {
          const nextDemo = chapterOneContent.demos.find((demo) => demo.id === event.target.value);

          if (nextDemo) {
            navigate(nextDemo.route);
          }
        }}
        value={activeDemoId}
      >
        {chapterOneContent.demos.map((demo) => (
          <option key={demo.id} value={demo.id}>
            {demo.shortTitle}
          </option>
        ))}
      </select>
    </label>
  );
}
