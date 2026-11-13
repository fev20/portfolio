import { ArrowRight, ChevronDown, Download } from "lucide-react";
import type { ReactNode } from "react";

const aiApproaches = {
  buildFirst: "바로 구현",
  planFirst: "구상 후 구현",
  tokenAware: "토큰 효율 고려",
} as const;

function ProjectCard({
  title,
  approach,
  description,
  preview,
  children,
}: {
  title: string;
  approach: keyof typeof aiApproaches;
  description: string;
  preview?: ReactNode;
  children: ReactNode;
}) {
  return (
    <details className="paper-card group/project">
      <summary className="block cursor-pointer list-none rounded-[var(--radius)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--rose-deep)] [&::-webkit-details-marker]:hidden">
        <h3 className="flex min-h-16 items-center justify-between gap-3 px-5 py-3.5 text-lg font-semibold sm:px-8 sm:text-xl">
          <span className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="[word-break:keep-all]">{title}</span>
            <span className="skill-tag font-medium tracking-normal">{aiApproaches[approach]}</span>
          </span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--rose-soft)] text-[var(--rose-deep)]" aria-hidden="true">
            <ChevronDown className="size-4 transition-transform group-open/project:rotate-180" />
          </span>
        </h3>
      </summary>
      <div className="border-t border-[var(--line)] px-5 py-5 sm:px-8 sm:py-6">
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--ink-secondary)] [word-break:keep-all] sm:text-base">
          {description}
        </p>
        {preview}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          {children}
        </div>
      </div>
    </details>
  );
}

function ProjectLink({
  path,
  download = false,
  children,
}: {
  path: string;
  download?: boolean;
  children: ReactNode;
}) {
  const Icon = download ? Download : ArrowRight;
  return (
    <a
      href={`${import.meta.env.BASE_URL}${path}`}
      download={download}
      className="group inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--rose-bright)] bg-[var(--rose-soft)] px-4 text-sm font-semibold text-[var(--rose-deep)] transition-colors hover:border-[var(--rose)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--rose-deep)]"
    >
      {children}
      <Icon className="size-4" aria-hidden="true" />
    </a>
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
              <li key={label} className="skill-tag font-medium">{label}</li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3">
          <ProjectCard
            title="Miel Research Desk"
            approach="buildFirst"
            description="깨진 옵시디언 링크와 노트 사이의 연결 경로를 살펴보고, 예제 연구 기록을 정리하거나 펌웨어의 헤더·체크섬·바이트를 비교할 수 있습니다. 제가 요구사항을 정하고 AI가 조사, 구현, 테스트를 맡았습니다."
          >
            <ProjectLink path="ai-demo/">Research Desk 열기</ProjectLink>
          </ProjectCard>

          <ProjectCard
            title="RISC-V 실행 실험실"
            approach="buildFirst"
            description="배열 합계, 함수 호출, 바이트 복사를 실제 RV32I 명령으로 실행하며 레지스터와 메모리의 변화를 확인합니다. AI가 실행기를 구현하고, 동일한 바이너리의 실행 결과를 QEMU와 대조했습니다."
          >
            <ProjectLink path="riscv-lab/">RISC-V 실행기 열기</ProjectLink>
          </ProjectCard>

          <ProjectCard
            title="오픈소스 코드 지도 생성기"
            approach="buildFirst"
            description="Python 함수가 서로 어떻게 이어지는지 호출 지도로 탐색합니다. 공개 예제로 시작하거나 내 프로젝트를 업로드 없이 분석하고, 연결선마다 실제 코드와 줄 번호를 확인할 수 있습니다."
          >
            <ProjectLink path="source-code-atlas/">코드 지도 열기</ProjectLink>
          </ProjectCard>

          <ProjectCard
            title="RRIP 캐시 교체 논문 재현"
            approach="buildFirst"
            description="ISCA 2010 논문의 캐시 접근을 한 단계씩 따라가며 LRU, NRU, SRRIP의 차이를 확인합니다. AI가 논문의 그림 3과 식 (1)을 재현하고, DOOM 화면 버퍼를 가정한 모의실험으로 확장했습니다."
          >
            <ProjectLink path="rrip-reproduction/">논문 재현 보고서 열기</ProjectLink>
            <ProjectLink path="rrip-reproduction/RRIP_Reproduction_Source.zip" download>
              재현 코드·데이터 다운로드
            </ProjectLink>
          </ProjectCard>

          <ProjectCard
            title="마감달력"
            approach="planFirst"
            description="여러 날에 걸친 일정의 기간과 마감까지 남은 시간을 한눈에 보고 싶었습니다. 날짜 칸을 가로지르는 막대와 별표로 고정하는 마감순 목록을 먼저 구상했습니다. 이후 AI와 함께 월간 달력에 구현하고, 마감 21일 전부터 막대가 보라색에서 빨간색으로 변하도록 만들었습니다. 데모에서는 가상 일정으로 색 변화, 별표 고정, 완료 처리, 라이트·다크 모드를 체험할 수 있습니다."
            preview={
              <figure className="mt-5 max-w-md" aria-label="가상 일정으로 재구성한 구상. 자료 조사 일정은 1일부터 4일까지, 발표 준비 일정은 3일부터 7일까지입니다.">
                <figcaption className="mb-2 text-xs font-medium text-[var(--ink-secondary)]">
                  기간 막대 구상 · 가상 일정
                </figcaption>
                <div className="grid grid-cols-7 gap-y-1.5 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line)] pb-2" aria-hidden="true">
                  {[1, 2, 3, 4, 5, 6, 7].map(day => (
                    <span key={day} className="border-b border-[var(--line)] py-1.5 text-center text-xs tabular-nums text-[var(--ink-secondary)]">{day}</span>
                  ))}
                  <span className="col-span-4 col-start-1 mx-1 truncate rounded-sm bg-[var(--rose-soft)] px-2 py-1 text-xs font-medium text-[var(--rose-deep)]">자료 조사</span>
                  <span className="col-span-5 col-start-3 mx-1 truncate rounded-sm bg-[var(--rose-soft)] px-2 py-1 text-xs font-medium text-[var(--rose-deep)]">발표 준비</span>
                </div>
              </figure>
            }
          >
            <ProjectLink path="deadline-calendar/">마감달력 데모 열기</ProjectLink>
          </ProjectCard>

          <ProjectCard
            title="모아 · 자료 검색 앱"
            approach="planFirst"
            description="파일 이름을 잊어도 기억나는 내용으로 자료를 찾는 흐름을 먼저 구상했습니다. 이후 한글 이미지의 글자 인식, PDF 페이지 검색, 윈도우의 오프라인 자료 저장을 구현했습니다. 공개 데모에서는 가상 자료를 검색하고 일치하는 페이지를 열어볼 수 있습니다."
          >
            <ProjectLink path="moa-demo/">구현 과정과 데모 보기</ProjectLink>
          </ProjectCard>
        </div>
      </div>
    </section>
  );
}
