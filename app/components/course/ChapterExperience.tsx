import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { buildDemoPlayerState, type DemoPlayerState } from "../../lib/demo-player/player";
import type { DemoSpec } from "../../lib/demo-player/types";
import { isCourseChapterReviewed, type CourseChapter } from "../../lib/course-content";
import { DemoPlayer } from "../demo-player/DemoPlayer";
import { Button } from "../ui/button";

export function CourseChapterHome({ chapter }: { chapter: CourseChapter }) {
  const primaryDemo = chapter.demos[0];
  const isReviewed = isCourseChapterReviewed(chapter);

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-slate-950">
      <CourseHeader
        chapter={chapter}
        currentLabel={`${chapter.eyebrow} 首页`}
        primaryHref={primaryDemo?.route ?? "/"}
        primaryLabel={primaryDemo && isReviewed ? "进入演示" : "演示未审校"}
        primaryDisabled={Boolean(primaryDemo && !isReviewed)}
      />

      <section className="border-b border-slate-200 bg-white">
        <div className="w-full px-4 py-10 sm:px-6 lg:px-10">
          <p className="text-sm font-semibold text-emerald-700">{chapter.eyebrow}</p>
          <div className="mt-3 grid gap-8 xl:grid-cols-[minmax(0,1fr)_30rem] xl:items-start">
            <div>
              <h1 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
                <span>{chapter.title}</span>
                {!isReviewed ? <ReviewStatusBadge /> : null}
              </h1>
              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-700">
                {chapter.summary}
              </p>
            </div>
            <section
              aria-label="本章原理"
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-5"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <BookOpen aria-hidden="true" className="size-4" />
                本章如何讲原理
              </div>
              <p className="mt-4 text-sm leading-6 text-emerald-950">{chapter.principle}</p>
            </section>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.58fr)_minmax(22rem,0.42fr)]">
          <div className="grid gap-6">
            <InfoBand title="具体实例">{chapter.example}</InfoBand>
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ListChecks aria-hidden="true" className="size-4" />
                学完应该理解
              </div>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
                {chapter.principles.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <ChevronRight aria-hidden="true" className="mt-1 size-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <div className="grid content-start gap-6">
            {chapter.visual ? <ChapterVisual kind={chapter.visual} /> : null}
            <section aria-label="核心演示" className="grid gap-4">
              {chapter.demos.map((demo) => (
                <DemoHomeCard demo={demo} disabled={!isReviewed} key={demo.id} />
              ))}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function DemoHomeCard({ demo, disabled }: { demo: DemoSpec; disabled: boolean }) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-semibold text-slate-700">{demo.shortTitle}</div>
          {disabled ? <ReviewStatusBadge compact /> : null}
        </div>
        <ArrowRight
          aria-hidden="true"
          className={
            disabled
              ? "size-4 text-slate-300"
              : "size-4 text-slate-400 transition-transform group-hover:translate-x-1"
          }
        />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-slate-950">{demo.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{demo.summary}</p>
      <p className="mt-4 text-sm font-medium text-emerald-800">{demo.outcome}</p>
    </>
  );

  if (disabled) {
    return (
      <article
        aria-disabled="true"
        aria-label={`${demo.title}，未审校`}
        className="rounded-lg border border-slate-200 bg-white p-5 opacity-70 shadow-sm"
      >
        {content}
      </article>
    );
  }

  return (
    <Link
      className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50"
      to={demo.route}
    >
      {content}
    </Link>
  );
}

export function CourseDemoPage({
  chapter,
  demo,
}: {
  chapter: CourseChapter;
  demo: DemoSpec;
}) {
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
      <CourseHeader
        activeDemoId={demo.id}
        chapter={chapter}
        currentLabel={demo.shortTitle}
        primaryHref={chapter.route}
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

export function CourseNotFound({ chapterNumber }: { chapterNumber?: string }) {
  return (
    <main className="min-h-screen bg-[#f6f7f2] px-4 py-10 text-slate-950 sm:px-6 lg:px-10">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
        to="/"
      >
        <Home aria-hidden="true" className="size-4" />
        LLM 技术全景课
      </Link>
      <section className="mt-10 max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-slate-500">章节不存在</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">
          没有找到第 {chapterNumber ?? "--"} 章
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          请从课程首页或上一章导航进入已确认的章节。
        </p>
      </section>
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

function InfoBand({ children, title }: { children: string; title: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-base leading-7 text-slate-800">{children}</p>
    </section>
  );
}

function CourseHeader({
  activeDemoId,
  chapter,
  currentLabel,
  primaryHref,
  primaryLabel,
  primaryDisabled = false,
  stepControls,
}: {
  activeDemoId?: string;
  chapter: CourseChapter;
  currentLabel: string;
  primaryHref: string;
  primaryLabel: string;
  primaryDisabled?: boolean;
  stepControls?: DemoStepControls;
}) {
  const hasDemoSelect = activeDemoId && chapter.demos.length > 1;
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
            <DemoSelect activeDemoId={activeDemoId} chapter={chapter} />
          ) : (
            <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
              {currentLabel}
            </span>
          )}
          {chapter.previousRoute ? (
            <Button asChild variant="secondary">
              <Link to={chapter.previousRoute}>上一章</Link>
            </Button>
          ) : null}
          {chapter.nextRoute ? (
            <Button asChild variant="secondary">
              <Link to={chapter.nextRoute}>下一章</Link>
            </Button>
          ) : null}
          {primaryDisabled ? (
            <Button aria-disabled="true" disabled type="button">
              {primaryLabel}
            </Button>
          ) : (
            <Button asChild>
              <Link to={primaryHref}>{primaryLabel}</Link>
            </Button>
          )}
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

function DemoSelect({ activeDemoId, chapter }: { activeDemoId: string; chapter: CourseChapter }) {
  const navigate = useNavigate();

  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-sm font-medium text-slate-500">演示</span>
      <select
        aria-label="选择演示"
        className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-colors hover:border-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        onChange={(event) => {
          const nextDemo = chapter.demos.find((demo) => demo.id === event.target.value);

          if (nextDemo) {
            navigate(nextDemo.route);
          }
        }}
        value={activeDemoId}
      >
        {chapter.demos.map((demo) => (
          <option key={demo.id} value={demo.id}>
            {demo.shortTitle}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReviewStatusBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={
        compact
          ? "rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800"
          : "rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-800"
      }
    >
      未审校
    </span>
  );
}

function ChapterVisual({ kind }: { kind: "ring" | "flow" }) {
  if (kind === "flow") {
    const flowNodes: Array<[number, number, string]> = [
      [70, 70, "运营环"],
      [260, 70, "产品环"],
      [450, 70, "开发环"],
      [260, 165, "人类决策点"],
    ];

    return (
      <section
        aria-label="Agent 协作流示意图"
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p className="text-sm font-semibold text-slate-500">协作流</p>
        <svg className="mt-4 h-52 w-full" role="img" viewBox="0 0 520 220">
          <title>多个协作环形成组织中的 Agent 流</title>
          <defs>
            <marker id="flow-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M0,0 L8,4 L0,8 Z" fill="#0f766e" />
            </marker>
          </defs>
          {flowNodes.map(([cx, cy, label]) => (
            <g key={label}>
              <circle cx={cx} cy={cy} fill="#ecfdf5" r="46" stroke="#0f766e" strokeWidth="3" />
              <text
                fill="#0f172a"
                fontSize="16"
                fontWeight="700"
                textAnchor="middle"
                x={cx}
                y={cy + 5}
              >
                {label}
              </text>
            </g>
          ))}
          <path d="M116 70 H214" markerEnd="url(#flow-arrow)" stroke="#0f766e" strokeWidth="4" />
          <path d="M306 70 H404" markerEnd="url(#flow-arrow)" stroke="#0f766e" strokeWidth="4" />
          <path d="M260 116 V125" markerEnd="url(#flow-arrow)" stroke="#0f766e" strokeWidth="4" />
        </svg>
      </section>
    );
  }

  return (
    <section aria-label="人机协作环示意图" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">协作环</p>
      <svg className="mt-4 h-52 w-full" role="img" viewBox="0 0 360 220">
        <title>AI 执行弧线与人类决策点组成协作环</title>
        <circle cx="180" cy="110" fill="#f8fafc" r="76" stroke="#cbd5e1" strokeWidth="16" />
        <path
          d="M180 34 A76 76 0 1 1 106 128"
          fill="none"
          stroke="#10b981"
          strokeLinecap="round"
          strokeWidth="16"
        />
        {[180, 254, 106].map((cx, index) => (
          <g key={cx}>
            <circle cx={cx} cy={index === 0 ? 34 : 128} fill="#fff1f2" r="14" stroke="#e11d48" strokeWidth="3" />
          </g>
        ))}
        <text fill="#064e3b" fontSize="18" fontWeight="700" textAnchor="middle" x="180" y="104">
          AI 工作弧线
        </text>
        <text fill="#881337" fontSize="14" fontWeight="700" textAnchor="middle" x="180" y="128">
          人做关键决策
        </text>
      </svg>
    </section>
  );
}
