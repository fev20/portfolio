import { ArrowRight } from "lucide-react";

export default function AiDevelopmentSection() {
  return (
    <section
      id="ai-development"
      className="relative py-12 sm:py-16 lg:py-20"
      aria-labelledby="ai-development-title"
    >
      <div className="container relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="section-number">07.</span>
          <h2
            id="ai-development-title"
            className="text-[clamp(2rem,3vw,2.6rem)] text-[var(--ink)]"
          >
            AI in Practice
          </h2>
          <div className="h-px max-w-[200px] flex-1 bg-[var(--line)]" />
        </div>

        <article className="paper-card p-5 sm:p-8">
          <h3 className="text-xl font-semibold sm:text-2xl">Miel Research Desk</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ink-secondary)] [word-break:keep-all] sm:text-base">
            옵시디언 링크 점검, 연구 활동 기록, 펌웨어 파일 비교를 브라우저에서 할 수 있는 도구입니다.
            제가 해결할 문제와 요구사항을 정하고, AI가 자료 조사부터 구현과 테스트까지 수행했습니다.
          </p>
          <dl className="mt-6 grid gap-4 border-y border-[var(--line)] py-5 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-semibold">노트 점검·관계 탐색</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--ink-secondary)]">
                깨진 링크를 찾고, 노트 사이의 연결 경로를 확인합니다.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">연구 원장</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--ink-secondary)]">
                가상 연구 기록으로 활동, 역할, 결과를 정리해 봅니다.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold">펌웨어 비교</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--ink-secondary)]">
                예제 바이너리의 헤더, 체크섬, 변경 바이트를 확인합니다.
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="/ai-demo/"
              className="group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--rose-bright)] bg-[var(--rose-soft)] px-4 text-sm font-semibold text-[var(--rose-deep)] transition-colors hover:border-[var(--rose)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--rose-deep)]"
            >
              공개 데모 체험하기
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
              로그인 없이 열립니다. 새로고침하면 예제로 돌아갑니다.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
