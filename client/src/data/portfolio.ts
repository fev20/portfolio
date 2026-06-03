// =============================================================
// 포트폴리오 데이터 파일
// 이 파일에서 모든 내용을 수정하세요.
// =============================================================

// ─── 기본 정보 ───────────────────────────────────────────────
export const profile = {
  name: "유수민",
  nameEn: "Sumin Yoo",
  tagline: "하드웨어 보안과 웹 보안을 공부하는 컴퓨터공학 전공 학생입니다.",
  taglineEn: "Computer Engineering Student interested in Hardware Security, Web Security, and Secure Systems.",
  email: "isemy0317@kku.ac.kr",
  github: "https://github.com/fev20",
  blog: "https://infobox7013.tistory.com/",
  notion: "",                       // ← 노션 URL (나중에 추가)
  linkedin: "",
};

// ─── 파일 & 링크 목록 ─────────────────────────────────────────
// type: "download" → 클릭 시 파일 다운로드
// type: "link"     → 클릭 시 외부 페이지(노션 등)로 이동
export const files = [
  {
    id: "resume",
    label: "이력서 PDF",
    labelEn: "Resume",
    url: "",                        // ← 업로드 후 URL 입력
    type: "download" as const,
    icon: "file-text",
    description: "최신 이력서 다운로드",
  },
];

// ─── About ───────────────────────────────────────────────────
export const about = {
  quote: "어제보다 더 나은 내가 되자",
  paragraphs: [
    "교내 정보보안 소모임 seKUrity에서 활동하며 웹 보안, 암호학, CTF, 침해사고 대응 등 다양한 보안 분야를 공부하고 있습니다.",
    "웹 모의해킹 프로젝트와 CTF 운영 경험을 통해 문제 해결 능력과 협업 역량을 키워왔으며, 실제 환경에서의 보안 이슈를 이해하기 위해 꾸준히 실습하고 있습니다.",
    "특히 Fault Injection을 비롯한 하드웨어 보안에 관심이 많으며, Arduino와 Raspberry Pi를 활용한 실습을 통해 하드웨어와 소프트웨어를 함께 이해하는 보안 전문가를 목표로 하고 있습니다.",
  ],
};

// ─── Skills ──────────────────────────────────────────────────
export const skills = [
  {
    category: "Security",
    icon: "shield",
    color: "#64ffda",
    items: [
      "Web Security",
      "XSS",
      "CTF",
      "Fault Injection / Voltage Glitching",
      "Network Packet Analysis",
      "CORS",
    ],
  },
  {
    category: "Development",
    icon: "code",
    color: "#a78bfa",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML / CSS",
      "Node.js",
    ],
  },
  {
    category: "Tools",
    icon: "wrench",
    color: "#38bdf8",
    items: [
      "Burp Suite",
      "Wireshark",
      "Fiddler",
      "Linux",
      "Git / GitHub",
      "Arduino",
      "Raspberry Pi",
    ],
  },
];

// ─── Projects ────────────────────────────────────────────────
export const projects = [
  // ── Security Research ──────────────────────────────────────────
  {
    id: "fault-injection",
    number: "01",
    category: "Security Research",
    title: "Fault Injection Study",
    description:
      "Voltage Glitching 원리를 학습하고 하드웨어 보안 공격 및 방어 메커니즘을 분석한 연구 프로젝트. 전압 조작을 통해 마이크로컨트롤러의 실행 흐름을 변조하는 공격 기법을 실험하고 문서화했습니다.",
    role: "연구 및 분석",
    learned:
      "하드웨어 레벨의 보안 취약점이 소프트웨어와 어떻게 연결되는지 이해했습니다. 물리적 공격 벡터가 실제 시스템에 미치는 영향을 직접 확인했습니다.",
    tags: ["Hardware Security", "Voltage Glitching", "Fault Injection", "Security Analysis"],
    links: { github: "", report: "" },
    color: "#f59e0b",
  },

  // ── CTF & Security Activities ──────────────────────────────────
  {
    id: "escape-room",
    number: "02",
    category: "CTF & Security Activities",
    title: "React Escape Room Game",
    description:
      "msg CTF 행사에서 참가자용 방탈출 게임 제작. CTF 문제 형식을 인터랙티브 웹 게임으로 구현하여 참가자들이 보안 개념을 직접 체험할 수 있도록 설계했습니다.",
    role: "프론트엔드 개발 및 퍼즐 설계",
    learned:
      "CTF 문제 설계 관점에서 공격자와 방어자 사고방식을 동시에 적용하는 경험을 했습니다. React 상태 관리 패턴과 사용자 경험 설계의 중요성도 체감했습니다.",
    tags: ["CTF", "React", "JavaScript", "Puzzle Design", "Security"],
    links: { github: "https://github.com/minsuk330/room-escape.git", report: "" },
    color: "#64ffda",
  },

  // ── Interactive Web Projects ───────────────────────────────────
  {
    id: "balloon-ride",
    number: "03",
    category: "Interactive Web Projects",
    title: "Balloon Ride",
    description:
      "풍선을 위아래로 움직여 장애물을 피하며 점수를 얻는 인터랙티브 웹 게임. 단체 프로젝트로 React 기반 점수 시스템과 게임 상태 관리 파트를 담당했습니다.",
    role: "React 점수 시스템 구현",
    learned:
      "팀 프로젝트에서 역할 분담과 컴포넌트 단위 개발의 효율성을 배웠습니다. 게임 루프와 React 렌더링 사이클을 조율하는 방법을 익혔습니다.",
    tags: ["React", "JavaScript", "Game", "Team Project"],
    links: { github: "https://github.com/soooonho/balloonride.git", report: "" },
    color: "#a78bfa",
  },

  // ── Service Operation & Improvement ───────────────────────────
  {
    id: "sekurity-renewal",
    number: "04",
    category: "Service Operation & Improvement",
    title: "seKUrity 홈페이지 리뉴얼",
    description:
      "교내 보안 소모임 seKUrity 공식 홈페이지 리뉴얼 프로젝트 참여. 기존 사이트의 구조를 분석하고 UI 개선, 페이지 구조 재편, 콘텐츠 정리를 통해 운영 효율을 높였습니다.",
    role: "UI 개선 및 페이지 구조 재편",
    learned:
      "실제 운영 중인 서비스를 팀으로 개선하며 기존 코드베이스 파악, 협업 워크플로우, 코드 리뷰 문화를 경험했습니다.",
    tags: ["Web Renewal", "UI Improvement", "Team Project", "Service Operation"],
    links: { github: "https://github.com/kku-seKUrity/seku_homePage.git", report: "" },
    color: "#38bdf8",
  },
];

// ─── Experience ──────────────────────────────────────────────
export const experiences = [
  {
    period: "2026.06 — 현재",
    title: "화이트햇스쿨 4기",
    role: "교육생",
    description: "KISA(한국인터넷진흥원)에서 운영하는 사이버보안 전문 인재 양성 프로그램 화이트햇스쿨 4기 교육생으로 선발되었습니다. 보안 실무 중심 교육을 통해 전문 역량을 키우고 있습니다.",
    tags: ["KISA", "Cyber Security", "WhiteHat School"],
  },
  {
    period: "2026.03 — 현재",
    title: "코딩 동아리 부회장",
    role: "제 5세대 부회장",
    description: "코딩 동아리 제 5세대 부회장으로 활동 중입니다.",
    tags: ["Leadership", "Programming"],
  },
  {
    period: "2026.01 — 현재",
    title: "보안 스터디",
    role: "스터디 참여",
    description: "보안 분야 심화 스터디에 참여하며 지속적으로 역량을 키우고 있습니다.",
    tags: ["Security", "Study"],
  },
  {
    period: "2025.09 — 현재",
    title: "seKUrity 멘토",
    role: "교내 보안 소모임 멘토",
    description: "건국대학교 글로컬캠퍼스 보안 소모임 seKUrity에서 멘토로 활동하며 신입 부원들을 지도하고 있습니다.",
    tags: ["Mentoring", "Web Security", "CTF"],
  },
  {
    period: "2025.09 — 현재",
    title: "코딩 동아리 임원진",
    role: "제 5세대 임원진",
    description: "코딩 동아리 제 5세대 임원진으로 활동하며 동아리 운영에 참여하고 있습니다.",
    tags: ["Leadership", "Programming"],
  },
  {
    period: "2025.03 — 2025.06",
    title: "seKUrity 신입 부원",
    role: "교내 보안 소모임 활동",
    description: "건국대학교 글로컬캠퍼스 보안 소모임 seKUrity에서 신입 부원으로 활동했습니다. 웹 보안, CTF, 하드웨어 보안 등 다양한 분야를 스터디했습니다.",
    tags: ["Web Security", "CTF", "Hardware Security"],
  },
  {
    period: "2025.03 — 현재",
    title: "코딩 동아리 부원",
    role: "제 5세대 부원",
    description: "코딩 동아리 제 5세대 부원으로 활동하며 다양한 프로젝트에 참여하고 있습니다.",
    tags: ["Programming", "Project"],
  },
];

// ─── Education & Certifications ──────────────────────────────
export const education = [
  {
    type: "education",
    period: "2025.03 — 재학 중",
    title: "건국대학교 글로컬캠퍼스",
    subtitle: "컴퓨터공학과",
    description: "",
    icon: "graduation-cap",
  },
  {
    type: "education",
    period: "2025.07.02 — 2025.07.08",
    title: "정보보호 제품군 실습훈련 - 기초1 (5차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/basic1_5.pdf",
  },
  {
    type: "education",
    period: "2025.07.23 — 2025.07.29",
    title: "정보보호 제품군 실습훈련 - 기초1 (6차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/basic1_6.pdf",
  },
  {
    type: "education",
    period: "2025.07.09 — 2025.07.15",
    title: "정보보호 제품군 실습훈련 - 기초2 (6차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/basic2_6.pdf",
  },
  {
    type: "education",
    period: "2025.07.30 — 2025.08.05",
    title: "정보보호 제품군 실습훈련 - 기초2 (7차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/basic2_7.pdf",
  },
  {
    type: "education",
    period: "2025.08.20 — 2025.08.26",
    title: "정보보호 제품군 실습훈련 - 기본1 (7차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/standard1_7.pdf",
  },
  {
    type: "education",
    period: "2025.08.20 — 2025.08.26",
    title: "정보보호 제품군 실습훈련 - 기본2 (7차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/standard2_7.pdf",
  },
  {
    type: "education",
    period: "2025.08.06 — 2025.08.12",
    title: "침해사고 대응훈련 - MITRE ATT&CK 활용 훈련 (7차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/mitre.pdf",
  },
  {
    type: "education",
    period: "2025.08.19 — 2025.09.01",
    title: "K-shield 주니어 기초과정 (15차)",
    subtitle: "KISA",
    description: "",
    icon: "shield",
    pdfFile: "/k-shield.pdf",
  },
  {
    type: "education",
    period: "2026.03.08 — 2025.06.09",
    title: "반도체 설계 입문",
    subtitle: "디지털 세상의 기본 회로 배우기",
    description: "",
    icon: "cpu",
  },
];

export const certifications = [
  {
    type: "cert",
    year: "2024.10.31",
    title: "IEQ 인터넷 윤리 자격 지도사",
    issuer: "국가공인",
    icon: "award",
    pdfFile: "/IEQ.pdf",
  },
  {
    type: "cert",
    year: "2025.12.08",
    title: "MOS PowerPoint 2016",
    issuer: "Microsoft 국제공인",
    icon: "award",
    pdfFile: "/MOS_Powerpoint_2016.pdf",
  },
  {
    type: "cert",
    year: "2025.12.12",
    title: "MOS Excel 2016 Expert",
    issuer: "Microsoft 국제공인",
    icon: "award",
    pdfFile: "/MOS_Excel_Expert_2016.pdf",
  },
];

export type ActivityContent = {
  texts?: string[];
  images?: string[];   // 이미지 URL 또는 경로
  files?: { name: string; url: string }[];
};

export type ActivityItem = {
  id: string;
  label: string;
  path: string;
  content?: ActivityContent;
};

export type ActivityCategory = {
  id: string;
  label: string;
  items: ActivityItem[];
};

export const nowActivities: ActivityCategory[] = [
  {
    id: "sekurity",
    label: "seKUrity",
    items: [
      { id: "project", label: "프로젝트", path: null, content: { texts: ["- 암호학 분석 경진대회"], images: [], files: [] } },
    ],
  },
  {
    id: "gen5",
    label: "제5세대",
    items: [
      { id: "executive", label: "임원진", path: null, content: { texts: [], images: [], files: [] } },
      { id: "web-project", label: "웹 프로젝트", path: null, content: { texts: ["- 웹 프로젝트 요소 페이지 생성"], images: [], files: [] } },
    ],
  },
  {
    id: "school",
    label: "학교",
    items: [
      { id: "data-science", label: "데이터과학(R)", path: null, content: { texts: [], images: [], files: [] } },
      { id: "computer-systems", label: "컴퓨터시스템(C언어, 어셈블리어)", path: null, content: { texts: [], images: [], files: [] } },
      { id: "web-programming", label: "웹 프로그래밍(HTML5, CSS3, JavaScript)", path: null, content: { texts: [], images: [], files: [] } },
      { id: "programming-practice", label: "프로그래밍실습(C언어)", path: null, content: { texts: [], images: [], files: [] } },
      { id: "java", label: "Java 프로그래밍1(Java)", path: null, content: { texts: [], images: [], files: [] } },
    ],
  },
  {
    id: "hw-hacking",
    label: "하드웨어 해킹",
    items: [
      { id: "hobby", label: "Hobby", path: null, content: { texts: ["- Fault Injection"], images: [], files: [] } },
      { id: "research paper", label: "Research Paper", path: null, content: { texts: ["- Detecting Compiler-Introduced Security Bugs via IR Mutation and Coverage-Guided Fuzzing_Postech"], images: [], files: [] } },
    ],
  },
  {
    id: "whs",
    label: "WHS",
    items: [],
  },
];