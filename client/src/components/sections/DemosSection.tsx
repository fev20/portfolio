import { Link } from "wouter";
import { ArrowRight, Clapperboard, Film } from "lucide-react";
import { demos, type Demo } from "@/data/demos";

function DemoThumbnail({ demo }: { demo: Demo }) {
  const thumbnail = demo.thumbnail?.trim() || demo.mainVideo?.thumbnail?.trim();

  return (
    <div
      className="relative flex aspect-video w-[clamp(5.5rem,24vw,11.5rem)] shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border"
      style={{
        background: "var(--rose-soft)",
        borderColor: "var(--rose-bright)",
      }}
      aria-hidden="true"
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span
          className="flex size-8 items-center justify-center rounded-lg border sm:size-12"
          style={{
            background: "var(--surface)",
            borderColor: "var(--rose-bright)",
            color: "var(--rose-deep)",
          }}
        >
          <Clapperboard className="size-4 sm:size-6" strokeWidth={1.4} />
        </span>
      )}
    </div>
  );
}

export default function DemosSection({ items = demos }: { items?: Demo[] }) {
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
          <ul className="space-y-4" role="list">
            {items.map(demo => (
              <li key={demo.id}>
                <Link
                  href={`/demos/${encodeURIComponent(demo.id)}`}
                  className="paper-card group flex items-center gap-3 p-3 sm:gap-5 sm:p-4"
                >
                  <DemoThumbnail demo={demo} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm leading-snug font-semibold [overflow-wrap:anywhere] sm:text-lg">
                      {demo.title}
                    </h3>
                    {demo.description.trim() && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--ink-secondary)] [overflow-wrap:anywhere] sm:text-sm">
                        {demo.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    className="size-4 shrink-0 text-[var(--ink-muted)] transition-transform group-hover:translate-x-0.5 sm:size-5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
