import { useState } from "react";
import DemoInlineVideo from "@/components/DemoInlineVideo";
import type { Project } from "@/data/projects";
import { projectAssetUrl } from "@/lib/projectMedia";

export default function ProjectMedia({
  project,
  accent,
  borderColor,
}: {
  project: Project;
  accent: string;
  borderColor: string;
}) {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const photos = project.photos?.flatMap(photo => {
    const src = projectAssetUrl(typeof photo === "string" ? photo : photo.src);
    if (!src) return [];
    const alt = typeof photo === "string" ? `${project.title} photo` : photo.alt;
    return [{ src, alt }];
  });
  const videos = project.videos?.flatMap(video => {
    const src =
      video.sourceType === "file" ? projectAssetUrl(video.src) : video.src;
    const thumbnail = video.thumbnail && projectAssetUrl(video.thumbnail);
    return src ? [{ ...video, src, thumbnail }] : [];
  });
  const labelStyle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.7rem",
    color: accent,
    marginBottom: "0.5rem",
  };

  return (
    <>
      {!!photos?.length && (
        <section aria-labelledby="project-photo-heading">
          <h2 id="project-photo-heading" style={labelStyle}>
            PHOTO
          </h2>
          <div className="space-y-4" style={{ marginBottom: "2rem" }}>
            {photos.map(({ src, alt }, index) => (
              <div
                key={`${src}-${index}`}
                className="overflow-hidden rounded-[var(--radius)]"
                style={{ border: `1px solid ${borderColor}` }}
              >
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  decoding="async"
                  className="block max-h-[520px] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {!!videos?.length && (
        <section aria-labelledby="project-video-heading">
          <h2 id="project-video-heading" style={labelStyle}>
            VIDEO
          </h2>
          <ul className="space-y-5">
            {videos.map((video, index) => (
              <li key={`${video.src}-${index}`}>
                <h3 className="mb-2 text-base font-semibold [overflow-wrap:anywhere]">
                  {video.title}
                </h3>
                <DemoInlineVideo
                  clip={{ ...video, id: String(index) }}
                  active={activeVideo === index}
                  onPlay={() => setActiveVideo(index)}
                  onStop={() => setActiveVideo(null)}
                />
                {video.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground [overflow-wrap:anywhere]">
                    {video.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
