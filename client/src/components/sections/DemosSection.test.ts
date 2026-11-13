import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import DemosSection from "./DemosSection";
import type { Demo } from "../../data/demos";

const demo: Demo = {
  id: "sample demo/1",
  title: "검증용 카드",
  description: "카드 표시 검증",
};

function render(items: Demo[]) {
  return renderToStaticMarkup(
    createElement(
      Router,
      { hook: useHashLocation, ssrPath: "/" },
      createElement(DemosSection, { items })
    )
  );
}

describe("DemosSection", () => {
  it("shows the original empty state without a demo link or player", () => {
    const html = render([]);

    expect(html).toContain("촬영한 프로젝트 영상을 이곳에 기록할 예정입니다.");
    expect(html).not.toMatch(/<a\b|<video\b|<iframe\b/);
  });

  it("uses a single detail link for the entire card", () => {
    const html = render([demo]);

    expect(html.match(/<a\b/g)).toHaveLength(1);
    expect(html).toContain(`href="#/demos/${encodeURIComponent(demo.id)}"`);
    expect(html).toMatch(/<a\b[^>]*>.*검증용 카드.*카드 표시 검증.*<\/a>/);
    expect(html).not.toMatch(/<button\b|aria-haspopup/);
  });

  it("keeps video sources off the list even when clips are configured", () => {
    const html = render([
      {
        ...demo,
        mainVideo: {
          id: "main",
          title: "대표 영상",
          sourceType: "youtube",
          src: "https://youtu.be/dQw4w9WgXcQ",
        },
        steps: [
          {
            id: "step",
            title: "단계 영상",
            sourceType: "file",
            src: "/test-only.mp4",
          },
        ],
      },
    ]);

    expect(html).not.toMatch(/<video\b|<iframe\b|<source\b|영상 보기/);
    expect(html).not.toContain("youtu.be");
    expect(html).not.toContain("/test-only.mp4");
  });

  it("prefers the demo thumbnail and falls back to the main clip thumbnail", () => {
    const mainVideo: Demo["mainVideo"] = {
      id: "main",
      title: "대표 영상",
      sourceType: "file",
      thumbnail: "/images/demo-main.png",
    };
    const explicit = render([
      { ...demo, thumbnail: "/images/demo-cover.png", mainVideo },
    ]);
    const fallback = render([{ ...demo, thumbnail: "  ", mainVideo }]);

    expect(explicit).toContain('src="/images/demo-cover.png"');
    expect(explicit).not.toContain("/images/demo-main.png");
    expect(fallback).toContain('src="/images/demo-main.png"');
    expect(fallback).toContain('loading="lazy"');
  });

  it("shows the pastel placeholder when no thumbnail is configured", () => {
    const html = render([{ ...demo, thumbnail: "  " }]);

    expect(html).toContain("lucide-clapperboard");
    expect(html).not.toMatch(/<img\b/);
  });
});
