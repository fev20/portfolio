# 포트폴리오 디자인 아이디어

## Approach 1: Cosmic Terminal
<response>
<text>
**Design Movement**: Cyberpunk + Deep Space Observatory

**Core Principles**:
- 터미널 타이핑 애니메이션으로 해커 정체성 강조
- 별자리 패턴의 배경으로 우주적 신비감 표현
- 네온 민트/사이언 포인트 컬러로 보안 테마 강조
- 모든 카드에 스캔라인 효과와 글리치 모션 적용

**Color Philosophy**:
- Background: #020817 (거의 검정, 심우주)
- Card: #0f172a (진한 네이비)
- Accent: #00ffd5 (네온 민트/사이언)
- Secondary Accent: #7c3aed (딥 퍼플)
- Text: #e2e8f0 (차가운 흰색)

**Layout Paradigm**:
- 비대칭 레이아웃: 왼쪽에 고정 사이드바 네비게이션
- Hero는 전체 화면, 타이핑 커서 애니메이션
- 섹션 구분선에 별 파티클 효과

**Signature Elements**:
- 별 파티클 배경 (Canvas API)
- 터미널 타이핑 효과 텍스트
- 글리치 텍스트 애니메이션

**Interaction Philosophy**:
- 호버 시 카드가 네온 글로우 효과
- 스크롤 시 별 시차 효과
- 클릭 시 파급 효과 (ripple)

**Animation**:
- 페이지 로드: 별 파티클 서서히 나타남
- 텍스트: 타이핑 커서 효과
- 카드: 위에서 아래로 fade-in

**Typography System**:
- 헤더: JetBrains Mono (터미널 느낌)
- 본문: Space Grotesk
</text>
<probability>0.08</probability>
</response>

## Approach 2: Nebula Hacker (선택됨)
<response>
<text>
**Design Movement**: Neobrutalism + Space Noir

**Core Principles**:
- 우주 성운(nebula) 느낌의 그라디언트 배경
- 보안 연구자의 정밀함을 표현하는 날카로운 레이아웃
- 은하계 색감 (딥 블루, 퍼플, 민트)
- 로딩 화면부터 우주 탐험 서사 구조

**Color Philosophy**:
- Background: #050b18 (심우주 블랙)
- Card: rgba(15, 23, 42, 0.8) (반투명 네이비)
- Primary Accent: #64ffda (민트 사이언)
- Secondary: #a78bfa (라벤더 퍼플)
- Tertiary: #38bdf8 (스카이 블루)
- Text: #ccd6f6 (차가운 연보라빛 흰색)

**Layout Paradigm**:
- 상단 고정 네비게이션 (반투명 블러)
- Hero: 전체 화면, 별 파티클 + 타이핑 효과
- 섹션: 좌우 교차 배치 (비대칭)
- 프로젝트: 3열 카드 그리드

**Signature Elements**:
- 별 파티클 배경 (CSS animation)
- 네온 글로우 테두리 카드
- 섹션 번호 (01, 02, 03...) 대형 표시

**Interaction Philosophy**:
- 카드 호버: 네온 민트 글로우 + 살짝 위로 이동
- 버튼: 사이언 테두리 + 글로우 효과
- 네비게이션: 스크롤 위치 표시 인디케이터

**Animation**:
- 로딩: 우주 탐색 터미널 시퀀스
- 별 배경: CSS keyframe 트윙클
- 섹션 진입: framer-motion fadeInUp
- 스킬 바: 진입 시 채워지는 애니메이션

**Typography System**:
- 헤더/이름: Space Grotesk Bold (현대적 기하학)
- 코드/강조: JetBrains Mono (터미널 정체성)
- 본문: Inter (가독성)
</text>
<probability>0.09</probability>
</response>

## Approach 3: Void Protocol
<response>
<text>
**Design Movement**: Swiss Minimalism + Sci-Fi HUD

**Core Principles**:
- 극도의 여백과 정밀한 그리드
- HUD(헤드업 디스플레이) 스타일 UI 요소
- 단일 포인트 컬러 (전기 블루)
- 데이터 시각화 중심 레이아웃

**Color Philosophy**:
- Background: #000000 (순수 블랙)
- Card: #0a0a0a (거의 블랙)
- Accent: #0ea5e9 (전기 블루)
- Text: #ffffff (순수 흰색)
- Muted: #404040

**Layout Paradigm**:
- 전체 화면 세로 스크롤
- 각 섹션이 뷰포트 100% 높이
- 좌측 고정 섹션 인디케이터

**Signature Elements**:
- HUD 코너 장식 (SVG)
- 스캔라인 오버레이
- 데이터 스트림 애니메이션

**Interaction Philosophy**:
- 미니멀한 호버 효과
- 정밀한 클릭 피드백

**Animation**:
- 섹션 전환: 수직 슬라이드
- 텍스트: 글리치 효과

**Typography System**:
- 전체: IBM Plex Mono
</text>
<probability>0.07</probability>
</response>

---

## 선택: Approach 2 - Nebula Hacker

우주 성운 + 보안 해커 느낌의 디자인을 선택합니다.
- 심우주 블랙 배경 (#050b18)
- 민트 사이언 포인트 (#64ffda)
- Space Grotesk + JetBrains Mono 폰트 조합
- 별 파티클 배경 + 네온 글로우 카드
- 로딩 화면: 터미널 부팅 시퀀스
