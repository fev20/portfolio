import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import DemoInlineVideo from "@/components/DemoInlineVideo";
import type { Demo, DemoClip } from "@/data/demos";
import { DemoProjectContent } from "./DemoDetail";

const mainVideo: DemoClip = {
  id: "main",
  title: "전체 재생 검증",
  sourceType: "file",
  src: "/test-only.mp4",
};

const youtubeClip: DemoClip = {
  id: "recorded",
  title: "단계 영상 검증",
  sourceType: "youtube",
  src: "https://youtu.be/AbCdEf12_-3",
};

function renderProject(demo: Demo) {
  return renderToStaticMarkup(
    createElement(
      Router,
      { hook: useHashLocation, ssrPath: "/demos/test" },
      createElement(DemoProjectContent, { demo })
    )
  );
}

function renderPlayer(clip: DemoClip) {
  return renderToStaticMarkup(
    createElement(DemoInlineVideo, {
      clip,
      active: true,
      onPlay: () => {},
      onStop: () => {},
    })
  );
}

describe("Demo detail playback", () => {
  it("offers valid clips in order without loading video at entry", () => {
    const html = renderProject({
      id: "test",
      title: "데모 상세 검증",
      description: "테스트 프로젝트",
      mainVideo,
      steps: [
        { id: "pending", title: "첫 단계", sourceType: "file" },
        { ...youtubeClip, title: "둘째 단계" },
      ],
    });

    expect(html).toContain("전체 재생 검증 영상 재생");
    expect(html).toContain("둘째 단계 영상 재생");
    expect(html).not.toContain("첫 단계 영상 재생");
    expect(html).toContain("영상 준비 중");
    expect(html.indexOf("첫 단계")).toBeLessThan(html.indexOf("둘째 단계"));
    expect(html).not.toMatch(/<video|<iframe|test-only\.mp4|youtu\.be/);
  });

  it("mounts the requested native player with inline controls", () => {
    const html = renderPlayer(mainVideo);
    expect(html).toMatch(/<video\b[^>]*\bcontrols=""/);
    expect(html).toMatch(/<video\b[^>]*\bplaysInline=""/i);
    expect(html).toContain('src="/test-only.mp4"');
    expect(html).toContain("전체 재생 검증 재생 종료");
    expect(html).not.toContain("<iframe");
  });

  it("mounts only the normalized YouTube player for a requested YouTube clip", () => {
    const html = renderPlayer(youtubeClip);
    expect(html).toContain("<iframe");
    expect(html).toContain(
      'src="https://www.youtube-nocookie.com/embed/AbCdEf12_-3?autoplay=1"'
    );
    expect(html).toContain('title="단계 영상 검증"');
    expect(html).not.toContain("<video");
  });
});
