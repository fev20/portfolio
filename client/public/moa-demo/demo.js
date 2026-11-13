const examples = [
  {
    id: "exhibition-plan",
    kind: "pdf",
    title: "파도 전시 운영안",
    note: "공간 구성, 장비 점검, 관람 순서를 담은 운영 문서",
    pages: [
      { number: 1, title: "공간 구성", text: "입구에는 안내 테이블을 배치한다. 첫 전시실에는 파도 소리를 듣는 공간을 마련하고, 두 번째 전시실에는 바닷가의 색을 기록한 그림을 건다." },
      { number: 2, title: "조명 점검", text: "조명 밝기는 개장 전에 40%로 맞춘다. 작품 표면에 빛이 반사되면 스폿라이트를 벽 쪽으로 돌린다. 퇴장 후에는 조명 전원을 끈다." },
      { number: 3, title: "입장 시간", text: "입장 시간은 오전 11시부터 오후 5시까지다. 매 정각에 입장 안내를 하고, 마지막 입장은 오후 4시 30분에 마감한다." },
    ],
  },
  {
    id: "direction-sign",
    kind: "image",
    title: "입구 안내판 스크린샷",
    note: "안내판에 적힌 문구를 검색하는 예시",
    text: "파도 전시 안내. 관람 순서: 소리 공간 → 그림 공간 → 작은 엽서 코너. 유모차는 오른쪽 통로로 이동해 주세요.",
  },
  {
    id: "work-note",
    kind: "note",
    title: "엽서 코너 준비 메모",
    note: "파란색 종이와 색연필을 채워 둔다. 완성한 엽서는 창가의 투명한 상자에 모아 둔다.",
  },
  {
    id: "speaker-guide",
    kind: "pdf",
    title: "소리 공간 장비 점검표",
    note: "스피커와 재생 장치의 개장 전 점검 순서",
    pages: [
      { number: 1, title: "소리 확인", text: "좌우 스피커에서 소리가 나오는지 확인한다. 안내 멘트가 묻히지 않도록 재생 볼륨을 낮춘 뒤 파도 음원을 반복한다." },
      { number: 2, title: "마감 순서", text: "재생을 정지한 뒤 앰프 전원을 끈다. 케이블이 이동 통로에 걸치지 않도록 벽면 쪽에 정리한다." },
    ],
  },
];

const sampleNote = {
  id: "sample-note",
  kind: "note",
  title: "관람 후기 메모",
  note: "다음 전시에는 입구 안내판 글씨를 더 크게 쓰고, 엽서 코너 옆에 낮은 의자를 둔다.",
};

const labels = { pdf: "PDF", image: "이미지", note: "메모" };
const search = document.querySelector("#search");
const filters = document.querySelector("#filters");
const records = document.querySelector("#records");
const reader = document.querySelector("#reader");
const count = document.querySelector("#count");
const addButton = document.querySelector("#add-note");
const status = document.querySelector("#status");
let items = [...examples];
let kind = "all";
let selectedId = examples[0].id;
let selectedPage = 1;

function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content) node.textContent = content;
  return node;
}

function normalize(text) {
  return text.normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/gu, " ").trim();
}

function score(text, query) {
  if (!query) return 0;
  const target = normalize(text);
  const words = [...new Set(query.split(" "))];
  const matched = words.filter(word => target.includes(word)).length;
  return (target.includes(query) ? 4 : 0) + matched;
}

function matchItem(item, query) {
  const pages = (item.pages ?? []).map(page => ({
    ...page,
    score: score(page.title + " " + page.text, query),
  })).filter(page => page.score > 0)
    .sort((a, b) => b.score - a.score || a.number - b.number);
  return {
    item,
    pages,
    score: score(item.title, query) * 2 + score(item.note + " " + (item.text ?? ""), query) + (pages[0]?.score ?? 0),
  };
}

function resultMatches() {
  const query = normalize(search.value);
  return items.filter(item => kind === "all" || item.kind === kind)
    .map(item => matchItem(item, query))
    .filter(result => !query || result.score > 0)
    .sort((a, b) => b.score - a.score);
}

function selectResult(result, page) {
  selectedId = result.item.id;
  selectedPage = page ?? result.pages[0]?.number ?? 1;
  render();
}

function renderRecord(result, active) {
  const { item, pages } = result;
  const button = el("button", "record");
  button.type = "button";
  button.setAttribute("aria-pressed", String(item.id === active?.item.id));
  const icon = el("span", "file-type file-type-" + item.kind, labels[item.kind]);
  icon.setAttribute("aria-hidden", "true");
  const body = el("span", "record-body");
  body.append(el("strong", "", item.title), el("span", "record-note", pages[0]
    ? pages[0].number + "쪽 · " + pages[0].title
    : item.note));
  const arrow = el("span", "record-arrow", "›");
  arrow.setAttribute("aria-hidden", "true");
  button.append(icon, body, arrow);
  button.addEventListener("click", () => {
    selectResult(result);
    reader.querySelector(".reader-heading")?.focus();
  });
  return button;
}

function renderReader(active) {
  if (!active) {
    reader.replaceChildren(el("p", "reader-empty", "검색 결과에서 자료를 선택하면 여기에 표시됩니다."));
    return;
  }
  const { item, pages } = active;
  const header = el("div", "reader-header");
  const heading = el("h3", "reader-heading", item.title);
  heading.tabIndex = -1;
  const label = item.kind === "pdf" ? "예시 문서" : item.kind === "image" ? "예시 이미지 속 글자" : "예시 메모";
  header.append(el("span", "reader-label", label), heading);

  const paper = el("article", "paper");
  if (item.pages) {
    const page = item.pages.find(entry => entry.number === selectedPage) ?? item.pages[0];
    const pageNav = el("div", "pages");
    pageNav.setAttribute("role", "group");
    pageNav.setAttribute("aria-label", "예시 문서 페이지");
    for (const entry of item.pages) {
      const button = el("button", "", entry.number + "쪽");
      button.type = "button";
      button.setAttribute("aria-pressed", String(entry.number === page.number));
      if (pages.some(match => match.number === entry.number)) button.classList.add("page-hit");
      button.addEventListener("click", () => {
        selectResult(active, entry.number);
        reader.querySelector(".pages [aria-pressed=true]")?.focus();
      });
      pageNav.append(button);
    }
    header.append(pageNav);
    paper.append(
      el("p", "paper-index", "PDF 예시 · " + page.number + " / " + item.pages.length + "쪽"),
      el("h4", "", page.title),
      el("p", "", page.text),
    );
    if (pages.length) {
      const matches = el("div", "page-matches");
      matches.append(el("span", "", "검색된 페이지"));
      for (const match of pages) {
        const button = el("button", "", match.number + "쪽 · " + match.title);
        button.type = "button";
        button.addEventListener("click", () => {
          selectResult(active, match.number);
          reader.querySelector(".pages [aria-pressed=true]")?.focus();
        });
        matches.append(button);
      }
      header.append(matches);
    }
  } else {
    paper.append(el("p", "", item.text ?? item.note));
  }
  reader.replaceChildren(header, paper);
}

function render({ pickFirst = false } = {}) {
  const results = resultMatches();
  const active = (!pickFirst && results.find(result => result.item.id === selectedId)) || results[0];
  if (pickFirst || active?.item.id !== selectedId) {
    selectedId = active?.item.id ?? null;
    selectedPage = active?.pages[0]?.number ?? 1;
  }
  count.textContent = "자료 " + results.length + "개";
  records.replaceChildren(...results.map(result => renderRecord(result, active)));
  if (!results.length) records.append(el("p", "empty", "검색 결과가 없습니다. 다른 단어로 찾아보세요."));
  for (const button of filters.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.kind === kind));
  }
  addButton.disabled = items.some(item => item.id === sampleNote.id);
  renderReader(active);
}

search.addEventListener("input", () => render({ pickFirst: true }));
filters.addEventListener("click", event => {
  const button = event.target.closest("button[data-kind]");
  if (!button) return;
  kind = button.dataset.kind;
  render({ pickFirst: true });
});
for (const button of document.querySelectorAll("[data-query]")) {
  button.addEventListener("click", () => {
    search.value = button.dataset.query;
    kind = "all";
    render({ pickFirst: true });
    search.focus();
  });
}
addButton.addEventListener("click", () => {
  if (addButton.disabled) return;
  items = [sampleNote, ...items];
  kind = "all";
  search.value = "";
  status.textContent = "예시 메모를 추가했습니다.";
  render({ pickFirst: true });
  reader.querySelector(".reader-heading")?.focus();
});
document.querySelector("#reset").addEventListener("click", () => {
  items = [...examples];
  kind = "all";
  search.value = "";
  status.textContent = "예시 자료함을 초기화했습니다.";
  render({ pickFirst: true });
});
render();
