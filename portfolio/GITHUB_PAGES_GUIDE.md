# GitHub Pages 배포 가이드

이 가이드를 따라하면 **무료로** `https://username.github.io/portfolio` 주소로 포트폴리오를 공개할 수 있습니다.

---

## 1단계: GitHub 저장소 생성

1. [github.com](https://github.com) 에 로그인
2. 우측 상단 `+` → **New repository** 클릭
3. Repository name: `portfolio` (또는 원하는 이름)
4. **Public** 선택 (GitHub Pages 무료 사용 조건)
5. **Create repository** 클릭

---

## 2단계: 코드 업로드

터미널에서 아래 명령어 실행:

```bash
cd /home/ubuntu/portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

> `YOUR_USERNAME`을 본인 GitHub 아이디로 변경하세요.

---

## 3단계: GitHub Pages 활성화

1. 저장소 페이지에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Source** → `GitHub Actions` 선택
4. 저장

---

## 4단계: 배포 확인

- `main` 브랜치에 push하면 자동으로 배포됩니다
- Actions 탭에서 배포 진행 상황 확인 가능
- 배포 완료 후 접속 주소: `https://YOUR_USERNAME.github.io/portfolio`

---

## 5단계: base URL 설정 (중요!)

`vite.config.pages.ts` 파일에서 `base` 값을 확인하세요:

```ts
base: "/",           // 커스텀 도메인 사용 시
base: "/portfolio/", // username.github.io/portfolio 형태 사용 시
```

저장소 이름이 `portfolio`라면 `base: "/portfolio/"` 로 변경 후 다시 push하세요.

---

## 커스텀 도메인 연결 (선택)

1. Settings → Pages → Custom domain에 도메인 입력
2. DNS 설정에서 CNAME 레코드를 `YOUR_USERNAME.github.io`로 지정
3. `vite.config.pages.ts`에서 `base: "/"` 로 설정

---

## 포트폴리오 내용 수정

모든 내용은 `client/src/data/portfolio.ts` 파일에서 수정합니다:

| 항목 | 수정 위치 |
|------|-----------|
| 이름, 이메일, GitHub | `profile` 객체 |
| 블로그/노션 링크 | `profile.blog`, `profile.notion` |
| 이력서 PDF | `files` 배열의 `resume` 항목 |
| About 소개글 | `about.paragraphs` |
| 기술 스택 | `skills` 배열 |
| 프로젝트 | `projects` 배열 |
| 활동 경험 | `experiences` 배열 |
| 학력/자격증 | `education`, `certifications` 배열 |

### 이력서 PDF 추가 방법

1. Manus 터미널에서: `manus-upload-file --webdev resume.pdf`
2. 반환된 URL을 `files` 배열의 `resume.url`에 붙여넣기

### 파일/링크 추가 방법

`client/src/data/portfolio.ts`의 `files` 배열에 항목 추가:

```ts
{
  id: "my-report",
  label: "보고서 제목",
  url: "https://notion.so/your-page",  // 노션 링크 또는 파일 URL
  type: "link",    // "link" = 새 탭으로 열기, "download" = 다운로드
  icon: "external-link",
  description: "설명",
}
```
