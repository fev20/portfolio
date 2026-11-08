import { useCallback, useRef, type RefObject } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveDemoSource, type DemoVideoSource } from "@/lib/demoMedia";

interface DemoVideoModalProps {
  title: string;
  description: string;
  source: DemoVideoSource | null;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

function releaseVideo(video: HTMLVideoElement | null) {
  if (!video) return;
  video.pause();
  if (video.hasAttribute("src")) {
    video.removeAttribute("src");
    video.load();
  }
}

export default function DemoVideoModal({
  title,
  description,
  source,
  onClose,
  returnFocusRef,
}: DemoVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const open = Boolean(source);
  const playableSource = source
    ? resolveDemoSource(source.type, source.src)
    : null;
  const nativeSource =
    playableSource?.type === "file" ? playableSource.src : null;

  const attachVideo = useCallback(
    (video: HTMLVideoElement | null) => {
      if (videoRef.current !== video) releaseVideo(videoRef.current);
      videoRef.current = video;
      // React may reattach a ref to the same element in development StrictMode.
      if (video && nativeSource && !video.hasAttribute("src")) {
        video.src = nativeSource;
      }
    },
    [nativeSource]
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      releaseVideo(videoRef.current);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto rounded-[var(--radius)] border-border bg-card p-4 sm:max-w-5xl sm:p-6"
        showCloseButton={false}
        onOpenAutoFocus={event => {
          event.preventDefault();
          closeButtonRef.current?.focus();
        }}
        onCloseAutoFocus={event => {
          event.preventDefault();
          returnFocusRef.current?.focus({ preventScroll: true });
        }}
      >
        <DialogHeader className="sticky top-0 z-10 bg-card pr-14 text-left">
          <DialogTitle
            className="text-xl leading-relaxed font-bold text-foreground"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {title}
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            {description}
          </DialogDescription>
          <DialogClose asChild>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="영상 닫기"
              className="absolute top-0 right-0 flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-background text-foreground transition-colors hover:bg-secondary"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </DialogClose>
        </DialogHeader>

        {open && playableSource && (
          <div
            className="overflow-hidden rounded-[var(--radius-sm)]"
            style={{ background: "var(--ink)" }}
          >
            {playableSource.type === "file" ? (
              <video
                key={playableSource.src}
                ref={attachVideo}
                src={playableSource.src}
                aria-label={title}
                controls
                playsInline
                preload="metadata"
                className="mx-auto block h-auto max-h-[65dvh] w-full object-contain"
              />
            ) : (
              <div className="aspect-video min-h-[200px] w-full">
                <iframe
                  key={playableSource.src}
                  src={playableSource.src}
                  title={title}
                  className="h-full w-full border-0"
                  allow="encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            )}
          </div>
        )}

        {open && !playableSource && (
          <p className="py-8 text-center text-muted-foreground">
            영상을 불러올 수 없습니다.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
