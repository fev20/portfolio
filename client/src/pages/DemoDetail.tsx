import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "wouter";
import DemoInlineVideo from "@/components/DemoInlineVideo";
import { demos, type Demo, type DemoClip } from "@/data/demos";
import { projects } from "@/data/portfolio";
import NotFound from "@/pages/NotFound";

function DemoClipDetails({ clip }: { clip?: DemoClip }) {
  if (!clip?.description?.trim() && !clip?.duration?.trim()) return null;

  return (
    <div className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
      {clip.description?.trim() && <p>{clip.description}</p>}
      {clip.duration?.trim() && <p>재생 시간 {clip.duration}</p>}
    </div>
  );
}

export function DemoProjectContent({ demo }: { demo: Demo }) {
  const [activeClip, setActiveClip] = useState<string | null>(null);
  const linkedProject = projects.find(project => project.id === demo.projectId);
  const metadata = [
    { label: "기록일", value: demo.recordedAt },
    { label: "담당 역할", value: demo.role },
  ].filter(item => item.value?.trim());

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 pt-8 pb-28 sm:px-8 sm:pt-12 lg:px-12 lg:pb-16">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--rose-deep)] underline-offset-4 hover:underline"
          onClick={() => sessionStorage.setItem("pendingScroll", "demos")}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Demos 목록으로
        </Link>

        <header className="mt-4 mb-8 space-y-4 sm:mb-10">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] leading-[1.12] [overflow-wrap:anywhere]">
            {demo.title}
          </h1>
          {demo.description.trim() && (
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {demo.description}
            </p>
          )}
          {metadata.length > 0 && (
            <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {metadata.map(item => (
                <div key={item.label} className="flex min-w-0 gap-2">
                  <dt className="shrink-0 text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="[overflow-wrap:anywhere]">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {linkedProject && (
            <Link
              href={`/project/${encodeURIComponent(linkedProject.id)}`}
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[var(--rose-deep)] underline-offset-4 hover:underline"
            >
              프로젝트 보기
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          )}
          {demo.relatedLink && (
            <a
              href={demo.relatedLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              {demo.relatedLink.label}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
        </header>

        <section aria-labelledby="demo-main-video-title">
          <h2
            id="demo-main-video-title"
            className="mb-3 text-lg font-bold tracking-normal"
            style={{ fontFamily: "var(--font-body)" }}
          >
            전체 영상
          </h2>
          <DemoInlineVideo
            clip={demo.mainVideo}
            thumbnail={demo.thumbnail}
            active={activeClip === "main"}
            onPlay={() => setActiveClip("main")}
            onStop={() => setActiveClip(null)}
          />
          <DemoClipDetails clip={demo.mainVideo} />
        </section>

        {demo.steps && demo.steps.length > 0 && (
          <section className="mt-10 border-t border-border pt-8 sm:mt-14 sm:pt-10">
            <h2 className="mb-6 text-3xl leading-tight sm:mb-8 sm:text-4xl">
              단계별 영상
            </h2>
            <ol className="max-w-3xl space-y-8 sm:space-y-10" role="list">
              {demo.steps.map((step, index) => {
                const clipKey = `step:${index}:${step.id}`;
                return (
                  <li key={clipKey}>
                    <h3 className="mb-3 flex gap-3 text-lg font-bold tracking-normal sm:text-xl">
                      <span
                        className="text-[var(--rose-deep)]"
                        aria-hidden="true"
                      >
                        {index + 1}.
                      </span>
                      <span className="min-w-0 [overflow-wrap:anywhere]">
                        {step.title}
                      </span>
                    </h3>
                    <DemoInlineVideo
                      clip={step}
                      active={activeClip === clipKey}
                      onPlay={() => setActiveClip(clipKey)}
                      onStop={() => setActiveClip(null)}
                    />
                    <DemoClipDetails clip={step} />
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}

function findDemo(id: string | undefined) {
  const exactMatch = demos.find(demo => demo.id === id);
  if (exactMatch || !id) return exactMatch;

  try {
    const decodedId = decodeURIComponent(id);
    return demos.find(demo => demo.id === decodedId);
  } catch {
    return undefined;
  }
}

export default function DemoDetail() {
  const { id } = useParams<{ id: string }>();
  const demo = findDemo(id);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  return demo ? <DemoProjectContent key={demo.id} demo={demo} /> : <NotFound />;
}
