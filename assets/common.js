export const $ = (id) => document.getElementById(id);
export function el(tag, text, className) {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  if (className) n.className = className;
  return n;
}
export async function json(path) {
  const r = await fetch(path, { cache: "no-cache" });
  if (!r.ok) throw Error(`HTTP ${r.status}`);
  return r.json();
}
export function date(value) {
  return value
    ? new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeZone: "Asia/Seoul",
      }).format(new Date(value))
    : "수정일 미확인";
}
// 디자인 개선을 반영한 작품: 진행 단계 옆 '디자인' 칩 (바탕·빛 = 학생이 고른 강조색)
export function designBadge(d) {
  const b = el("span", "디자인", "student-design");
  b.title = d.label;
  if (d.accent) {
    b.style.setProperty("--design-accent", d.accent);
    b.style.setProperty("--design-ink", inkOn(d.accent));
  }
  return b;
}
// 바탕색 위 글자색: 흰색·먹 중 대비가 큰 쪽
function inkOn(hex) {
  const lin = (i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin(1) + 0.7152 * lin(3) + 0.0722 * lin(5);
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.05 ? "#ffffff" : "#0b0b0f";
}
export function shot(p) {
  const box = el("div");
  const fallback = () =>
    box.replaceChildren(el("div", "미리보기 이미지 없음", "shot placeholder"));
  if (!p.thumbnail) {
    fallback();
    return box;
  }
  const img = new Image();
  img.className = "shot";
  img.width = 1280;
  img.height = 800;
  img.loading = "lazy";
  img.alt = `${p.title} 첫 화면`;
  img.src = p.thumbnail;
  img.onerror = fallback;
  box.append(img);
  return box;
}
export function link(text, href, cls = "button") {
  const a = el("a", text, cls);
  a.href = href;
  return a;
}
// 목록의 검색 조건은 탭 단위(sessionStorage)로 기억 — 상세 화면의 이전·다음도 같은 조건을 따른다
export const VIEW_KEY = "sih26:gallery:v1";
export function loadView() {
  try {
    return JSON.parse(sessionStorage.getItem(VIEW_KEY)) || {};
  } catch {
    return {};
  }
}
export function filterProjects(list, q, group) {
  const query = (q || "").trim().toLocaleLowerCase();
  return list
    .filter(
      (p) =>
        (!group || p.class === group) &&
        `${p.id} ${p.title} ${p.description}`
          .toLocaleLowerCase()
          .includes(query),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
}
// 본 작품 표시: 공용 PC에서 다음 반 학생에게 남지 않도록 탭이 닫히면 사라지는 sessionStorage 사용
const SEEN_KEY = "sih26:gallery:seen";
export function seenIds() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY)) || []);
  } catch {
    return new Set();
  }
}
export function markSeen(id) {
  try {
    const seen = seenIds();
    seen.add(id);
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
  } catch {}
}
json("build-info.json")
  .then((b) => {
    const when = new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "long",
      timeZone: "Asia/Seoul",
    }).format(new Date(b.generatedAt));
    $("build-info").textContent =
      `마지막 업데이트 ${when}` +
      (b.commit ? ` · 버전 ${b.commit.slice(0, 7)}` : "");
  })
  .catch(() => {
    $("build-info").textContent = "";
  });
