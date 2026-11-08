/**
 * Demos 영상 목록. 파일은 client/public/videos, 썸네일은
 * client/public/images/demos에 두고 /videos/...처럼 경로를 작성합니다.
 * sourceType: "file" | "youtube". src가 비어 있으면 영상 준비 중입니다.
 * projectId는 portfolio.ts의 실제 프로젝트 id를 사용합니다.
 * 선택 항목은 확인된 값이 있을 때만 추가합니다.
 */
export interface Demo {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  sourceType: "file" | "youtube";
  src?: string;
  duration?: string;
  recordedAt?: string;
  role?: string;
  projectId?: string;
}

// 현재 프로젝트 데이터에 DOOM 포팅 항목이 없고, 제공된 영상도 없습니다.
export const demos: Demo[] = [];
