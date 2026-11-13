# Demos 프로젝트와 영상 관리

`client/src/data/demos.ts`의 `demos` 배열에 프로젝트를 한 건씩 추가합니다. 홈에는 프로젝트마다 가로 카드 한 장이 생기고, 카드를 누르면 `#/demos/프로젝트-ID`로 이동합니다.

아래는 입력 형식입니다. 실제 제목과 자료로 바꿔서 배열에 추가하세요.

```ts
{
  id: "프로젝트-ID",
  title: "실제 프로젝트 제목",
  description: "홈 카드에 표시할 짧은 설명",
  // thumbnail: "/images/demos/대표이미지.jpg",
  mainVideo: {
    id: "full",
    title: "프로젝트 전체 영상",
    sourceType: "file",
    // src: "/videos/전체영상.mp4",
  },
  steps: [
    {
      id: "step-1",
      title: "첫 번째 과정의 소제목",
      sourceType: "file",
      // src: "/videos/첫번째영상.mp4",
    },
  ],
}
```

- `mainVideo`는 상세 상단에 크게, `steps`는 그 아래에 배열 순서대로 표시됩니다. 프로젝트 ID는 목록에서, 영상 ID는 각 프로젝트의 `steps` 안에서 고유해야 합니다.
- 영상 파일은 `client/public/videos/`에 두고 `sourceType: "file"`, `src: "/videos/파일명.mp4"`를 입력합니다. HTTPS 영상 파일 URL도 사용할 수 있습니다.
- YouTube 영상은 `sourceType: "youtube"`와 공유 링크를 `src`에 입력합니다. YouTube에서 해당 영상의 임베드를 허용해야 합니다.
- 썸네일은 `client/public/images/demos/`에 두고 `thumbnail: "/images/demos/파일명.jpg"`로 연결합니다. 홈 카드에는 프로젝트 `thumbnail`을 우선 사용하고, 없으면 `mainVideo.thumbnail`을 사용합니다. 둘 다 없으면 자리 표시자가 나옵니다.
- 각 영상에 `description`, `duration`, `thumbnail`을 추가할 수 있습니다. 프로젝트에 `recordedAt`, `role`, 기존 프로젝트의 `projectId`를 넣으면 상세 화면에 해당 정보나 링크가 표시됩니다.
- `src`가 비어 있으면 **영상 준비 중**으로 표시합니다. 영상은 상세 화면에서 재생을 누른 뒤에 로드되고, 다른 영상을 선택하거나 페이지를 떠나면 이전 플레이어가 내려갑니다.

```text
npm run check
npm run build:pages
npx vitest run --config vite.config.pages.ts
```
