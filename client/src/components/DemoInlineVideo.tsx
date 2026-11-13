import { useCallback, useRef } from "react";
import { Film, Play, X } from "lucide-react";
import type { DemoClip } from "@/data/demos";
import { resolveDemoSource } from "@/lib/demoMedia";

interface DemoInlineVideoProps {
  clip?: DemoClip;
  thumbnail?: string;
  active: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export default function DemoInlineVideo({
  clip,
  thumbnail,
  active,
  onPlay,
  onStop,
}: DemoInlineVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const source = clip ? resolveDemoSource(clip.sourceType, clip.src) : null;
  const playing = active && source !== null;
  const fileSrc = playing && source?.type === "file" ? source.src : null;
  const poster = clip?.thumbnail?.trim() || thumbnail?.trim();

  const attachVideo = useCallback(
    (video: HTMLVideoElement | null) => {
      const previous = videoRef.current;
      if (previous && previous !== video) {
        previous.pause();
        previous.removeAttribute("src");
        previous.load();
      }
      videoRef.current = video;
      if (video && fileSrc && !video.hasAttribute("src")) {
        video.src = fileSrc;
      }
    },
    [fileSrc]
  );

  return (
    <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-card">
      {playing ? (
        <div className="bg-[var(--ink)]">
          {source.type === "file" ? (
            <video
              key={source.src}
              ref={attachVideo}
              src={source.src}
              aria-label={clip?.title}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="block h-auto max-h-[70dvh] w-full object-contain"
            />
          ) : (
            <div className="aspect-video min-h-[200px] w-full">
              <iframe
                key={source.src}
                src={`${source.src}?autoplay=1`}
                title={clip?.title}
                className="block h-full w-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-2 bg-[var(--rose-soft)] text-[var(--rose-deep)]">
          {poster && (
            <img
              src={poster}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
          )}
          {!source && (
            <div className="relative flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-card px-4 py-2 text-sm">
              <Film size={17} aria-hidden="true" />
              <span>영상 준비 중</span>
            </div>
          )}
        </div>
      )}

      {source && (
        <div
          className={
            playing
              ? "flex justify-end border-t border-border px-3 py-2"
              : "absolute inset-0 flex items-center justify-center"
          }
        >
          <button
            type="button"
            className="btn-outline min-h-11 bg-card"
            aria-label={`${clip?.title} ${playing ? "재생 종료" : "영상 재생"}`}
            onClick={playing ? onStop : onPlay}
          >
            {playing ? (
              <>
                <X size={16} aria-hidden="true" />
                재생 종료
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" aria-hidden="true" />
                영상 재생
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
