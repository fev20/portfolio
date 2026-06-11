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
      "Cryptography",
      "CTF",
      "Hardware Security",
      "Packet Analysis",
    ],
  },
  {
    category: "Development",
    icon: "code",
    color: "#a78bfa",
    items: [
      "C",
      "Java",
      "Python",
      "R",
      "JavaScript",
      "TypeScript",
      "HTML5 / CSS3",
      "React",
      "Node.js",
      "MySQL",
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
      "Postman",
      "Git/GitHub",
      "Linux",
      "Arduino",
      "Raspberry Pi",
    ],
  },
];

export const projects = [
  // ── Security Research ──────────────────────────────────────────
  {
    id: "cors-misconfiguration",
    number: "01",
    category: "Security Research",
    title: "CORS Misconfiguration 분석",
    description: "",
    tags: ["CORS", "Web Security", "Security Research"],
    links: { github: "", report: "" },
    color: "#64ffda",
    files: [
      {name: "보안 스터디 CORS 분석 보고서", url: "/files/CORS_Misconfiguration.pdf", protection: false}
    ],
  },
  {
    id: "atm-skimming",
    number: "02",
    category: "Security Research",
    title: "ATM Skimming 분석",
    description: "",
    tags: ["ATM Skimming", "Hardware Security", "Security Research"],
    links: { github: "", report: "" },
    color: "#64ffda",
    files: [{name: "보안 스터디 ATM Skimming 분석 보고서", url: "/files/ATM_Skimming.pdf", protection: false}],
  },
  {
    id: "crypto-contest",
    number: "03",
    category: "Security Research",
    title: "암호 분석 경진대회 참가",
    description: "",
    tags: ["Cryptography", "Contest", "Security Research"],
    links: { github: "", report: "" },
    color: "#64ffda",
    files: [],
  },

  // ── CTF & Security Activities ──────────────────────────────────
  {
    id: "msg-ctf",
    number: "01",
    category: "CTF & Security Activities",
    title: "msg CTF 참가",
    description: "",
    tags: ["CTF", "msg CTF", "Web Security"],
    links: { github: "", report: "" },
    color: "#38BDF8",
    files: [],
  },
  {
    id: "sejong-hacktheon",
    number: "02",
    category: "CTF & Security Activities",
    title: "세종 핵테온",
    description: "",
    tags: ["CTF", "Hackathon", "Security"],
    links: { github: "", report: "" },
    color: "#38BDF8",
    files: [],
  },
  {
    id: "chungcheong-contest",
    number: "03",
    category: "CTF & Security Activities",
    title: "충청권 사이버보안 경진대회",
    description: "",
    tags: ["CTF", "사이버보안", "경진대회"],
    links: { github: "", report: "" },
    color: "#38BDF8",
    files: [],
  },
  {
    id: "kuctf",
    number: "04",
    category: "CTF & Security Activities",
    title: "KUCTF",
    description: "",
    tags: ["CTF", "KUCTF", "Security"],
    links: { github: "", report: "" },
    color: "#38BDF8",
    files: [],
  },

  // ── Security Education ─────────────────────────────────────────
  {
    id: "sekurity-activity",
    number: "01",
    category: "Security Education",
    title: "seKUrity 활동",
    description: "seKUrity 소속 멘토들만 확인할 수 있는 파일입니다.",
    tags: ["seKUrity", "Security Club", "Education"],
    links: { github: "", report: "" },
    color: "#A855F7",
    files: [
      {name: "seKUrity 1주차 과제(네트워크, HTTP, 웹, 개발자도구, 피들러", url: "/files/seKUrity1.pdf", protection: "sekurity"},
      {name: "seKUrity 2주차 과제(XSS)", url: "/files/seKUrity2.pdf", protection: "sekurity"},
      {name: "seKUrity 3주차 과제(불충분한 인증과 인가)", url: "/files/seKUrity3.pdf", protection: "sekurity"},
      {name: "seKUrity 4주차 과제(SQLi)", url: "/files/seKUrity4.pdf", protection: "sekurity"},
      {name: "seKUrity 5주차 과제(파일 다운로드 취약점)", url: "/files/seKUrity5.pdf", protection: "sekurity"},
      {name: "seKUrity 6주차 과제(파일 업로드 취약점)", url: "/files/seKUrity6.pdf", protection: "sekurity"},
      {name: "seKUrity 7주차 과제(OSi)", url: "/files/seKUrity7.pdf", protection: "sekurity"},
      {name: "seKUrity 8주차 과제(SSTi)", url: "/files/seKUrity8.pdf", protection: "sekurity"},
      {name: "seKUrity 9주차 과제(실습)", url: "/files/seKUrity9.pdf", protection: "sekurity"}
    ],
  },
  {
    id: "web-vuln-education",
    number: "02",
    category: "Security Education",
    title: "신입부원 웹 취약점 교육",
    description: "seKUrity에서 신입부원에게 XSS를 교육했던 자료입니다.",
    tags: ["Web Security", "Education", "Teaching"],
    links: { github: "", report: "" },
    color: "#A855F7",
    files: [],
  },
  {
    id: "crypto-study",
    number: "03",
    category: "Security Education",
    title: "암호학 스터디 발표",
    description: "",
    tags: ["Cryptography", "Study", "Presentation"],
    links: { github: "", report: "" },
    color: "#A855F7",
    files: [],
  },
  {
    id: "sekurity-seminar",
    number: "04",
    category: "Security Education",
    title: "제6회 seKUrity 보안 세미나 발표",
    description: "",
    tags: ["Seminar", "Presentation", "Security"],
    links: { github: "", report: "" },
    color: "#A855F7",
    files: [],
  },

  // ── Interactive Web Projects ───────────────────────────────────
  {
    id: "sekurity-homepage",
    number: "01",
    category: "Interactive Web Projects",
    title: "seKUrity 홈페이지 개발",
    description: "",
    tags: ["Web Development", "React", "seKUrity"],
    links: { github: "https://github.com/kku-seKUrity/seku_homePage.git", report: "" },
    color: "#EC4899",
    files: [],
  },
  {
    id: "portfolio-site",
    number: "02",
    category: "Interactive Web Projects",
    title: "React 포트폴리오 사이트 제작",
    description: "",
    tags: ["React", "TypeScript", "Portfolio"],
    links: { github: "https://github.com/fev20", report: "" },
    color: "#EC4899",
    files: [],
  },
  {
    id: "escape-room",
    number: "03",
    category: "Interactive Web Projects",
    title: "React 방탈출 게임 제작",
    description: "",
    tags: ["CTF", "React", "JavaScript", "Game"],
    links: { github: "https://github.com/minsuk330/room-escape.git", report: "" },
    color: "#EC4899",
    files: [],
  },
  {
    id: "balloon-ride",
    number: "04",
    category: "Interactive Web Projects",
    title: "Balloon Ride",
    description: "",
    tags: ["React", "JavaScript", "Game", "Team Project"],
    links: { github: "https://github.com/soooonho/balloonride.git", report: "" },
    color: "#EC4899",
    files: [],
  },

  // ── Embedded & Hardware Security ───────────────────────────────
  {
    id: "fault-injection",
    number: "01",
    category: "Embedded & Hardware Security",
    title: "Fault Injection 연구",
    description: "",
    tags: ["Fault Injection", "Voltage Glitching", "Hardware Security"],
    links: { github: "", report: "" },
    color: "#FB923C",
    files: [],
  },

  // ── Leadership & Community ─────────────────────────────────────
  {
    id: "vice-president",
    number: "01",
    category: "Leadership & Community",
    title: "제5세대 부회장",
    description: "",
    tags: ["Leadership", "Club", "Management"],
    links: { github: "", report: "" },
    color: "#FACC15",
    files: [],
  },
  {
    id: "pentest-collaboration",
    number: "02",
    category: "Leadership & Community",
    title: "웹 모의해킹 프로젝트 협업",
    description: "",
    tags: ["Collaboration", "Web Hacking", "Team Project"],
    links: { github: "", report: "" },
    color: "#FACC15",
    files: [],
  },
  {
    id: "pentest-collaboration",
    number: "03",
    category: "Leadership & Community",
    title: "화이트햇 스쿨 반장",
    description: "",
    tags: ["Leadership", "Communication", "Community"],
    links: { github: "", report: "" },
    color: "#FACC15",
    files: [],
  },
];

// ─── Experience ──────────────────────────────────────────────
export const experiences = [
  {
    period: "2026.06 — 현재",
    title: "화이트햇스쿨 4기",
    role: "교육생, 반장",
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
    image: "/basic1_5-1.png",
  },
  {
    type: "education",
    period: "2025.07.23 — 2025.07.29",
    title: "정보보호 제품군 실습훈련 - 기초1 (6차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/basic1_6.pdf",
    image: "/basic1_6-1.png",
  },
  {
    type: "education",
    period: "2025.07.09 — 2025.07.15",
    title: "정보보호 제품군 실습훈련 - 기초2 (6차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/basic2_6.pdf",
    image: "/basic2_6-1.png",
  },
  {
    type: "education",
    period: "2025.07.30 — 2025.08.05",
    title: "정보보호 제품군 실습훈련 - 기초2 (7차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/basic2_7.pdf",
    image: "/basic2_7-1.png",
  },
  {
    type: "education",
    period: "2025.08.20 — 2025.08.26",
    title: "정보보호 제품군 실습훈련 - 기본1 (7차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/standard1_7.pdf",
    image: "/standard1_7-1.png",
  },
  {
    type: "education",
    period: "2025.08.20 — 2025.08.26",
    title: "정보보호 제품군 실습훈련 - 기본2 (7차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/standard2_7.pdf",
    image: "/standard2_7-1.png",
  },
  {
    type: "education",
    period: "2025.08.06 — 2025.08.12",
    title: "침해사고 대응훈련 - MITRE ATT&CK 활용 훈련 (7차)",
    subtitle: "KISA Academy",
    description: "",
    icon: "shield",
    pdfFile: "/mitre.pdf",
    image: "/mitre-1.png",
  },
  {
    type: "education",
    period: "2025.08.19 — 2025.09.01",
    title: "K-shield 주니어 기초과정 (15차)",
    subtitle: "KISA",
    description: "",
    icon: "shield",
    pdfFile: "/k-shield.pdf",
    image: "/k-shield-1.png",
  },
  {
    type: "education",
    period: "2026.03.08 — 2025.06.09",
    title: "반도체 설계 입문",
    subtitle: "디지털 세상의 기본 회로 배우기",
    description: "",
    icon: "cpu",
    pdfFile: "/semiconductor.pdf",
    image: "/semiconductor-1.png",
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
    image: "/IEQ-1.png",
  },
  {
    type: "cert",
    year: "2025.12.08",
    title: "MOS PowerPoint 2016",
    issuer: "Microsoft 국제공인",
    icon: "award",
    pdfFile: "/MOS_Powerpoint_2016.pdf",
    image: "/MOS_Powerpoint_2016-1.png",
  },
  {
    type: "cert",
    year: "2025.12.12",
    title: "MOS Excel 2016 Expert",
    issuer: "Microsoft 국제공인",
    icon: "award",
    pdfFile: "/MOS_Excel_Expert_2016.pdf",
    image: "/MOS_Excel_Expert_2016-1.png",
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
  path: string | null;
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
      { id: "mentor", label: "멘토", path: null, content: { texts: [], images: [], files: [] } },
      { id: "project", label: "프로젝트", path: null, content: { texts: ["-  암호학 분석 경진대회"], images: [], files: [] } },
    ],
  },
  {
    id: "gen5",
    label: "제5세대",
    items: [
      { id: "executive", label: "임원진", path: null, content: { texts: [], images: [], files: [] } },
      { id: "web-project", label: "웹 프로젝트", path: null, content: { texts: ["-  웹 프로젝트 요소 페이지 생성"], images: [], files: [] } },
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
      { id: "hobby", label: "Hobby", path: null, content: { texts: ["-  Fault Injection"], images: [], files: [] } },
      { id: "research paper", label: "Research Paper", path: null, content: { texts: ["-  Detecting Compiler-Introduced Security Bugs via IR Mutation and Coverage-Guided Fuzzing_Postech"], images: [], files: [] } },
    ],
  },
  {
    id: "whs",
    label: "WHS",
    items: [
      { id: "online", label: "Online", path: null, content: { texts: ["// 공유할 수 없는 내용입니다"], images: [], files: [] } },
      { id: "offline", label: "Offline", path: null, content: { texts: ["// 공유할 수 없는 내용입니다"], images: [], files: [] } },
    ],
  },
];