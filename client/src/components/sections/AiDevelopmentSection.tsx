import { ArrowRight } from "lucide-react";

const aiApproaches = {
  buildFirst: "일단 만들기",
  planFirst: "뭘 만들지 구상 후 만들기",
  tokenAware: "토큰 사용량 생각하며 만들기",
} as const;

function ProjectHeading({ title, approach }: { title: string; approach: keyof typeof aiApproaches }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <h3 className="text-xl font-semibold sm:text-2xl">{title}</h3>
      <span className="skill-tag">{aiApproaches[approach]}</span>
    </div>
  );
}

export default function AiDevelopmentSection() {
  return (
    <section
      id="ai-development"
      className="relative py-28"
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

        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h3 id="ai-approaches" className="text-sm font-semibold text-[var(--ink-secondary)]">AI 활용 방식</h3>
          <ul aria-labelledby="ai-approaches" className="flex flex-wrap gap-2">
            {Object.values(aiApproaches).map(label => (
              <li key={label} className="skill-tag">{label}</li>
            ))}
          </ul>
        </div>

        <article className="paper-card p-5 sm:p-8">
          <ProjectHeading title="Miel Research Desk" approach="buildFirst" />
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

        <article className="paper-card mt-5 p-5 sm:p-8">
          <ProjectHeading title="RISC-V 실행 실험실" approach="buildFirst" />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ink-secondary)] [word-break:keep-all] sm:text-base">
            배열 합계, 함수 호출, 바이트 복사를 실제 RV32I 명령으로 실행하며 레지스터와 메모리의 변화를 확인합니다.
            AI가 실행기 구현과 검증을 맡았고, 동일한 바이너리의 실행 결과를 QEMU와 대조했습니다.
          </p>
          <a
            href="/riscv-lab/"
            className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--rose-bright)] bg-[var(--rose-soft)] px-4 text-sm font-semibold text-[var(--rose-deep)] transition-colors hover:border-[var(--rose)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--rose-deep)]"
          >
            RISC-V 실행기 열기
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </article>

        <article className="paper-card mt-5 p-5 sm:p-8">
          <ProjectHeading title="오픈소스 코드 지도 생성기" approach="buildFirst" />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ink-secondary)] [word-break:keep-all] sm:text-base">
            Python 함수가 서로 어떻게 이어지는지 호출 지도로 탐색합니다.
            공개 예제로 시작하거나, 내 프로젝트를 업로드 없이 분석하고
            연결선마다 실제 코드와 줄 번호를 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={`${import.meta.env.BASE_URL}source-code-atlas/`}
              className="group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--rose-bright)] bg-[var(--rose-soft)] px-4 text-sm font-semibold text-[var(--rose-deep)] transition-colors hover:border-[var(--rose)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--rose-deep)]"
            >
              코드 지도 열기
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
              로그인 없이 열립니다. 선택한 폴더는 현재 탭에서만 분석합니다.
            </p>
          </div>
        </article>

        <article className="paper-card mt-5 p-5 sm:p-8">
          <ProjectHeading title="RRIP 캐시 교체 논문 재현" approach="buildFirst" />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ink-secondary)] [word-break:keep-all] sm:text-base">
            ISCA 2010 논문의 캐시 접근을 한 단계씩 따라가며 LRU, NRU, SRRIP의 차이를 확인합니다.
            AI가 논문의 그림 3과 식 (1)을 재현하고, DOOM 화면 버퍼를 가정한 모의실험으로 확장했습니다.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={`${import.meta.env.BASE_URL}rrip-reproduction/`}
              className="group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--rose-bright)] bg-[var(--rose-soft)] px-4 text-sm font-semibold text-[var(--rose-deep)] transition-colors hover:border-[var(--rose)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--rose-deep)]"
            >
              논문 재현 보고서 열기
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a
              href={`${import.meta.env.BASE_URL}rrip-reproduction/RRIP_Reproduction_Source.zip`}
              download
              className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--rose-deep)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--rose-deep)]"
            >
              재현 코드·데이터 다운로드
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
