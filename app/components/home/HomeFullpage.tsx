import ReactFullpageModule from "@fullpage/react-fullpage";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Bug,
  GitBranch,
  Handshake,
  Network,
  Scale,
} from "lucide-react";

import { Button } from "../ui/button";
import type { landingContent, ValueItem } from "../../lib/landing-content";
import systemCrossSectionImage from "../../assets/home-system-cross-section.png";

type HomeFullpageProps = {
  content: typeof landingContent;
};

const ReactFullpage = (
  (ReactFullpageModule as unknown as { default?: typeof ReactFullpageModule }).default ??
  ReactFullpageModule
) as typeof ReactFullpageModule;

const valueIcons = [GitBranch, Network, Scale, Blocks, Bug, BadgeCheck, Handshake];

const valueTones = [
  {
    band: "bg-sky-700",
    eyebrow: "text-sky-700",
    panel: "border-sky-200 bg-sky-50",
    line: "bg-sky-500",
    node: "border-sky-200 bg-white text-sky-900",
    icon: "text-sky-700",
  },
  {
    band: "bg-stone-800",
    eyebrow: "text-stone-700",
    panel: "border-stone-200 bg-stone-50",
    line: "bg-stone-500",
    node: "border-stone-200 bg-white text-stone-900",
    icon: "text-stone-700",
  },
  {
    band: "bg-amber-600",
    eyebrow: "text-amber-700",
    panel: "border-amber-200 bg-amber-50",
    line: "bg-amber-500",
    node: "border-amber-200 bg-white text-amber-900",
    icon: "text-amber-700",
  },
  {
    band: "bg-emerald-700",
    eyebrow: "text-emerald-700",
    panel: "border-emerald-200 bg-emerald-50",
    line: "bg-emerald-500",
    node: "border-emerald-200 bg-white text-emerald-900",
    icon: "text-emerald-700",
  },
  {
    band: "bg-rose-700",
    eyebrow: "text-rose-700",
    panel: "border-rose-200 bg-rose-50",
    line: "bg-rose-500",
    node: "border-rose-200 bg-white text-rose-900",
    icon: "text-rose-700",
  },
  {
    band: "bg-indigo-700",
    eyebrow: "text-indigo-700",
    panel: "border-indigo-200 bg-indigo-50",
    line: "bg-indigo-500",
    node: "border-indigo-200 bg-white text-indigo-900",
    icon: "text-indigo-700",
  },
  {
    band: "bg-teal-700",
    eyebrow: "text-teal-700",
    panel: "border-teal-200 bg-teal-50",
    line: "bg-teal-500",
    node: "border-teal-200 bg-white text-teal-900",
    icon: "text-teal-700",
  },
];

export function HomeFullpage({ content }: HomeFullpageProps) {
  const anchors = ["top", ...content.valueItems.map((item) => item.id), "chapter-one"];

  return (
    <div aria-label="课程价值整屏滚动">
      <ReactFullpage
        anchors={anchors}
        credits={{ enabled: false }}
        keyboardScrolling
        licenseKey="gplv3-license"
        navigation
        navigationPosition="right"
        navigationTooltips={[
          "首页",
          ...content.valueItems.map((item) => item.title),
          "进入第一章",
        ]}
        scrollingSpeed={700}
        scrollOverflow
        sectionSelector=".home-fullpage-section"
        verticalCentered={false}
        render={() => (
          <ReactFullpage.Wrapper>
            <section
              aria-label="首页首屏"
              className="section home-fullpage-section home-hero-section"
              data-anchor="top"
            >
              <HeroSection
                content={content}
                firstValueAnchor={content.valueItems[0]?.id ?? "value"}
              />
            </section>
            {content.valueItems.map((item, index) => (
              <section
                aria-label={`${item.title}价值区块`}
                className="section home-fullpage-section"
                data-anchor={item.id}
                key={item.id}
              >
                <ValueSlide item={item} index={index} total={content.valueItems.length} />
              </section>
            ))}
            <section
              aria-label="进入第一章"
              className="section home-fullpage-section home-chapter-entry-section"
              data-anchor="chapter-one"
            >
              <ChapterEntry content={content} />
            </section>
          </ReactFullpage.Wrapper>
        )}
      />
    </div>
  );
}

function HeroSection({
  content,
  firstValueAnchor,
}: {
  content: typeof landingContent;
  firstValueAnchor: string;
}) {
  return (
    <div className="relative isolate min-h-dvh w-full overflow-hidden bg-[#eef8f6] px-4 py-16 text-slate-950 sm:px-6 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(15,118,110,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.12)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-x-0 top-24 -z-10 h-px bg-sky-400/35" />
      <div className="absolute left-[12%] top-40 -z-10 hidden h-px w-[76%] rotate-6 bg-teal-600/20 md:block" />
      <div className="absolute left-[18%] top-72 -z-10 hidden h-px w-[66%] -rotate-3 bg-orange-500/25 md:block" />

      <figure className="home-hero-art pointer-events-none absolute inset-y-[-18%] left-0 right-[-16vw] z-0 hidden lg:block">
        <img
          alt="抽象系统剖面图"
          className="home-hero-art-image h-full w-full object-cover object-right-bottom drop-shadow-[0_32px_60px_rgba(15,23,42,0.20)]"
          src={systemCrossSectionImage}
        />
        <div className="home-hero-art-wash absolute inset-0" />
      </figure>

      <div className="relative z-10 grid min-h-[calc(100dvh-8rem)] content-center lg:max-w-[46rem]">
        <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl">
          {content.courseName}
        </h1>
        <p className="mt-6 max-w-2xl text-2xl font-medium text-teal-900">
          {content.heroPromise}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">
          {content.audienceNote}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <a href={content.primaryAction.href}>
              {content.primaryAction.label}
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href={`#${firstValueAnchor}`}>查看课程价值</a>
          </Button>
        </div>

        <figure className="home-hero-mobile-art relative z-0 mt-10 min-h-[18rem] overflow-hidden sm:min-h-[24rem] lg:hidden">
          <img
            alt="抽象系统剖面图"
            className="home-hero-mobile-art-image absolute bottom-[-16%] right-[-36%] h-[132%] w-auto max-w-none object-contain drop-shadow-[0_32px_60px_rgba(15,23,42,0.20)] sm:right-[-20%]"
            src={systemCrossSectionImage}
          />
          <div className="home-hero-mobile-art-wash absolute inset-0" />
        </figure>
      </div>
    </div>
  );
}

function ValueSlide({
  item,
  index,
  total,
}: {
  item: ValueItem;
  index: number;
  total: number;
}) {
  const Icon = valueIcons[index % valueIcons.length];
  const tone = valueTones[index % valueTones.length];

  return (
    <article className="home-value-slide grid h-full w-full items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(24rem,0.8fr)] lg:px-10">
      <div className="max-w-4xl">
        <p className={`text-sm font-semibold ${tone.eyebrow}`}>
          课程价值 {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h2 className="mt-4 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-6xl">
          {item.title}
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
          {item.description}
        </p>
      </div>

      <div className={`relative overflow-hidden rounded-lg border p-6 shadow-sm ${tone.panel}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-sm font-semibold ${tone.eyebrow}`}>{item.visualLabel}</p>
            <p className="mt-1 text-sm text-slate-600">把价值点落到可观察的系统行为上</p>
          </div>
          <Icon aria-hidden="true" className={`size-8 ${tone.icon}`} />
        </div>

        <div aria-hidden="true" className="mt-8 grid gap-4">
          {item.checkpoints.map((checkpoint, checkpointIndex) => (
            <div
              className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3"
              key={checkpoint}
            >
              <div className="relative grid h-12 place-items-center">
                <span className={`h-3 w-3 rounded-full ${tone.band}`} />
                {checkpointIndex < item.checkpoints.length - 1 ? (
                  <span className={`absolute top-8 h-10 w-px ${tone.line}`} />
                ) : null}
              </div>
              <div className={`rounded-md border px-4 py-3 text-sm font-semibold ${tone.node}`}>
                {checkpoint}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2" aria-hidden="true">
          <div className={`h-2 rounded-full ${tone.band}`} />
          <div className="h-2 rounded-full bg-white" />
          <div className="h-2 rounded-full bg-slate-200" />
        </div>
      </div>
    </article>
  );
}

function ChapterEntry({ content }: { content: typeof landingContent }) {
  return (
    <section className="grid min-h-dvh place-items-center bg-[#eef8f6] px-4 py-16 text-center sm:px-6 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-teal-700">继续课程</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-normal text-slate-950 sm:text-6xl">
          进入第一章
        </h2>
        <div className="mt-8 flex justify-center">
          <Button asChild>
            <a href={content.primaryAction.href}>
              进入第一章
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
