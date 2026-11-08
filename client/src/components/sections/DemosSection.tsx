import { lazy, Suspense, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Clapperboard, Film, Play } from "lucide-react";
import { demos, type Demo } from "@/data/demos";
import { projects } from "@/data/portfolio";
import { resolveDemoSource } from "@/lib/demoMedia";

const DemoVideoModal = lazy(() => import("@/components/DemoVideoModal"));

function DemoPoster({ demo, ready }: { demo: Demo; ready: boolean }) {
  return (
    <>
      {demo.thumbnail?.trim() ? (
        <img
          src={demo.thumbnail}
          alt={`${demo.title} 영상 썸네일`}
          className="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-2xl border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--rose-bright)",
              color: "var(--rose-deep)",
            }}
          >
            <Clapperboard size={28} strokeWidth={1.4} aria-hidden="true" />
          </span>
          <span className="text-sm font-medium">
            {ready ? "동작 영상" : "영상 준비 중"}
          </span>
        </div>
      )}
      {ready && (
        <span
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition-transform group-hover:scale-105"
          style={{
            color: "var(--rose-deep)",
            background: "var(--surface)",
            borderColor: "var(--rose)",
          }}
        >
          <Play size={18} fill="currentColor" aria-hidden="true" />
        </span>
      )}
      {!ready && demo.thumbnail?.trim() && (
        <span
          className="absolute bottom-3 left-3 rounded-md px-3 py-1 text-sm font-medium"
          style={{ background: "var(--surface)", color: "var(--rose-deep)" }}
        >
          영상 준비 중
        </span>
      )}
    </>
  );
}

export default function DemosSection({ items = demos }: { items?: Demo[] }) {
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [playerRequested, setPlayerRequested] = useState(false);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const source = selectedDemo
    ? resolveDemoSource(selectedDemo.sourceType, selectedDemo.src)
    : null;

  function openDemo(demo: Demo, trigger: HTMLButtonElement) {
    if (!resolveDemoSource(demo.sourceType, demo.src)) return;
    returnFocusRef.current = trigger;
    setPlayerRequested(true);
    setSelectedDemo(demo);
  }

  return (
    <section
      id="demos"
      className="relative py-28"
      aria-labelledby="demos-title"
    >
      <div className="container relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="section-number">06.</span>
          <h2
            id="demos-title"
            style={{
              fontSize: "clamp(2rem, 3vw, 2.6rem)",
              color: "var(--ink)",
            }}
          >
            Demos
          </h2>
          <div
            className="h-px max-w-[200px] flex-1"
            style={{ background: "var(--line)" }}
          />
        </div>
        <p
          className="mb-10 text-base leading-relaxed"
          style={{ color: "var(--ink-secondary)", wordBreak: "keep-all" }}
        >
          직접 다룬 기기와 프로젝트의 동작을 영상으로 기록합니다.
        </p>

        {items.length === 0 ? (
          <div
            className="flex min-h-64 flex-col items-center justify-center gap-5 rounded-[var(--radius)] border px-6 py-12 text-center"
            style={{
              background: "var(--surface)",
              borderColor:
                "color-mix(in srgb, var(--rose) 35%, var(--rose-bright))",
            }}
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "var(--rose-soft)",
                color: "var(--rose-deep)",
              }}
            >
              <Film size={28} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <p
              className="text-base font-medium leading-relaxed"
              style={{ color: "var(--ink-secondary)", wordBreak: "keep-all" }}
            >
              촬영한 프로젝트 영상을 이곳에 기록할 예정입니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {items.map(demo => {
              const ready = Boolean(
                resolveDemoSource(demo.sourceType, demo.src)
              );
              const linkedProject = projects.find(p => p.id === demo.projectId);
              const metadata = [
                { label: "재생 시간", value: demo.duration },
                { label: "기록일", value: demo.recordedAt },
                { label: "담당 역할", value: demo.role },
              ].filter(item => item.value?.trim());
              const posterClass =
                "relative block aspect-video w-full overflow-hidden border-b text-[var(--rose-deep)]";
              const posterStyle = {
                background: "var(--rose-soft)",
                borderColor: "var(--rose-bright)",
              };

              return (
                <article
                  key={demo.id}
                  className={`overflow-hidden rounded-[var(--radius)] border${
                    items.length === 1
                      ? " lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-xl"
                      : ""
                  }`}
                  style={{
                    background: "var(--surface)",
                    borderColor:
                      "color-mix(in srgb, var(--rose-deep) 50%, var(--rose-bright))",
                  }}
                  aria-label={demo.title}
                >
                  {ready ? (
                    <button
                      type="button"
                      className={`${posterClass} group`}
                      style={posterStyle}
                      aria-label={`${demo.title} 영상 보기`}
                      aria-haspopup="dialog"
                      onClick={event => openDemo(demo, event.currentTarget)}
                    >
                      <DemoPoster demo={demo} ready />
                    </button>
                  ) : (
                    <div className={posterClass} style={posterStyle}>
                      <DemoPoster demo={demo} ready={false} />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="mb-3 break-words text-lg font-semibold">
                      {demo.title}
                    </h3>
                    {demo.description?.trim() && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--ink-secondary)" }}
                      >
                        {demo.description}
                      </p>
                    )}
                    {metadata.length > 0 && (
                      <dl className="mt-5 space-y-2 text-sm">
                        {metadata.map(item => (
                          <div key={item.label} className="flex gap-3">
                            <dt className="shrink-0 text-[var(--ink-secondary)]">
                              {item.label}
                            </dt>
                            <dd className="min-w-0 break-words">
                              {item.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {(ready || linkedProject) && (
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        {ready && (
                          <button
                            type="button"
                            className="btn-outline"
                            aria-haspopup="dialog"
                            onClick={event =>
                              openDemo(demo, event.currentTarget)
                            }
                          >
                            <Play size={15} aria-hidden="true" />
                            영상 보기
                          </button>
                        )}
                        {linkedProject && (
                          <Link
                            href={`/project/${encodeURIComponent(linkedProject.id)}`}
                            className="inline-flex items-center gap-1.5 py-2 text-sm font-semibold underline-offset-4 hover:underline"
                            style={{ color: "var(--rose-deep)" }}
                          >
                            프로젝트 보기
                            <ArrowUpRight size={15} aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      {playerRequested && (
        <Suspense
          fallback={
            <p role="status" className="sr-only">
              영상 플레이어를 불러오는 중입니다.
            </p>
          }
        >
          <DemoVideoModal
            title={selectedDemo?.title ?? ""}
            description={selectedDemo?.description ?? ""}
            source={source}
            onClose={() => setSelectedDemo(null)}
            returnFocusRef={returnFocusRef}
          />
        </Suspense>
      )}
    </section>
  );
}
