import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import DemosSection from "./DemosSection";
import { projects } from "../../data/portfolio";
import type { Demo } from "../../data/demos";

const pending: Demo = {
  id: "test-pending",
  title: "검증용 카드",
  description: "카드 표시 검증",
  sourceType: "file",
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

describe("DemosSection content states", () => {
  it("shows the requested empty state without an invented project or player", () => {
    const html = render([]);
    expect(html).toContain("촬영한 프로젝트 영상을 이곳에 기록할 예정입니다.");
    expect(html).not.toMatch(/<video|<iframe|<article|영상 보기/);
  });

  it("shows an unplayable pending card and omits absent metadata", () => {
    const html = render([
      { ...pending, role: "  ", projectId: "not-a-project" },
    ]);
    expect(html).toContain("영상 준비 중");
    expect(html).not.toMatch(/<button|<video|<iframe|<dl|프로젝트 보기/);
  });

  it("links pending cards only to a real existing project", () => {
    const html = render([{ ...pending, projectId: projects[0].id }]);
    expect(html).toContain(`#/project/${projects[0].id}`);
    expect(html).toContain("프로젝트 보기");
    expect(html).not.toContain("영상 보기");
  });

  it("offers playback for a source without loading media on initial render", () => {
    // Test fixture only; no sample media is added to the portfolio data.
    const html = render([{ ...pending, src: "/test-only.mp4" }]);
    expect(html).toContain("영상 보기");
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).not.toMatch(/<video|<iframe|영상 준비 중/);
    expect(html).not.toContain("/test-only.mp4");
  });

  it("renders only supplied optional metadata", () => {
    const html = render([{ ...pending, role: "표시 검증" }]);
    expect(html).toContain("담당 역할");
    expect(html).toContain("표시 검증");
    expect(html).not.toMatch(/재생 시간|기록일/);
  });
});
