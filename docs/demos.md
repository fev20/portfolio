# Demos 영상 관리

영상 목록은 `client/src/data/demos.ts`의 `demos` 배열에서 관리합니다.
현재 저장소에는 DOOM 포팅 프로젝트나 실제 영상이 없어 배열을 비워 두었습니다.
아래는 작성 방법이며 실제 포트폴리오 데이터가 아닙니다.

## 항목 추가

`demos` 배열에 다음 형태의 객체를 추가합니다. 제목과 설명은 실제 기록으로 바꾸세요.

```ts
{
  id: "고유한-id",
  title: "실제 영상 제목",
  description: "영상에서 확인할 수 있는 동작을 짧게 설명",
  sourceType: "file",
  src: "",
}
```

`src`가 없거나 빈 문자열이면 **영상 준비 중** 카드가 됩니다. 재생 버튼이나
플레이어는 생성되지 않습니다. 영상이 준비되면 같은 항목의 `src`만 채우면 됩니다.

## 영상과 썸네일

- 일반 영상: `client/public/videos/`에 실제 파일을 넣고 `sourceType: "file"`,
  `src: "/videos/실제파일명.mp4"`로 설정합니다. 외부 HTTP(S) 영상 파일 URL도 가능합니다.
- YouTube: `sourceType: "youtube"`와 실제 영상 공유 링크를 `src`에 입력합니다.
  watch, youtu.be, embed, shorts 링크를 지원하며 사용자 요청 후에만 임베드가 로드됩니다.
- 썸네일: `client/public/images/demos/`에 실제 이미지를 넣고
  `thumbnail: "/images/demos/실제파일명.jpg"`를 추가합니다. 없으면 간단한 자리 표시자를 사용합니다.
- 썸네일 영역은 16:9입니다. 파일 영상은 모달에서 원래 비율로 표시하고 자르지 않습니다.
- 파일명에 공백을 피하면 경로 관리가 편합니다. 동영상 인코딩과 브라우저 재생 지원을 확인하세요.

## 선택 정보

| 필드         | 입력할 내용                                                  |
| ------------ | ------------------------------------------------------------ |
| `duration`   | 확인한 재생 시간만 입력                                      |
| `recordedAt` | 실제 촬영일 또는 기록 날짜                                   |
| `role`       | 실제 담당 역할                                               |
| `projectId`  | `client/src/data/portfolio.ts`에 있는 프로젝트의 정확한 `id` |

선택 정보가 없으면 해당 줄이 생략됩니다. `projectId`가 기존 프로젝트와 일치할 때만
실제 프로젝트 상세 페이지로 연결됩니다. 프로젝트 목적·구현 과정·기여 내용은 기존
프로젝트 데이터에서 관리하고, Demos 설명은 영상에서 볼 수 있는 동작 위주로 작성하세요.

## 확인 명령

```text
npm run check
npm run build:pages
npx vitest run --config vite.config.pages.ts
```

영상 추가 후 PC·모바일에서 썸네일과 버튼, 실제 재생, 닫기/Escape/바깥 클릭,
닫은 뒤 포커스 복귀를 확인하세요. YouTube는 업로더의 임베드 허용 설정도 필요합니다.
