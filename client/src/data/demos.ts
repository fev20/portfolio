/** One video on a demo project's detail page. */
export interface DemoClip {
  id: string;
  title: string;
  sourceType: "file" | "youtube";
  src?: string;
  thumbnail?: string;
  description?: string;
  duration?: string;
}

/** One list card and its detail page. See docs/demos.md for data entry. */
export interface Demo {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  mainVideo?: DemoClip;
  steps?: DemoClip[];
  recordedAt?: string;
  role?: string;
  projectId?: string;
}

export const demos: Demo[] = [
  {
    id: "embedded-doom-port",
    title: "임베디드 기기 대상 DOOM 포팅",
    description:
      "IP 카메라의 펌웨어를 분석·수정해 DOOM을 포팅하고, 기기에서 실행되는 게임 화면을 웹 브라우저로 출력한 프로젝트입니다.",
    thumbnail: "/images/demos/doom-port.png",
    mainVideo: { id: "full", title: "전체 영상", sourceType: "file" },
    steps: [
      { id: "hardware-disassembly", title: "하드웨어 분해", sourceType: "file" },
      { id: "doom-port", title: "둠 포팅", sourceType: "file" },
      { id: "gameplay", title: "실행 화면", sourceType: "file" },
    ],
  },
];
