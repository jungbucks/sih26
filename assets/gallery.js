import {
  $,
  el,
  json,
  shot,
  designBadge,
  link,
  VIEW_KEY,
  filterProjects,
  seenIds,
} from "./common.js";
const key = VIEW_KEY;
let projects = [],
  limit = 24,
  restoreY = 0;
const seen = seenIds();
try {
  const s = JSON.parse(sessionStorage.getItem(key));
  if (s) {
    $("search").value = s.q || "";
    limit = Math.max(24, Math.min(200, Number(s.limit) || 24));
    restoreY = Number(s.y) || 0;
    $("class").dataset.restore = s.group || "";
  }
} catch {}
function save() {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        q: $("search").value,
        group: $("class").value,
        limit,
        y: scrollY,
      }),
    );
  } catch {}
}
function card(p) {
  const card = link("", `work.html?id=${p.id}`, "card");
  card.append(shot(p));
  const body = el("div", undefined, "card-body");
  const identity = el("p", undefined, "card-label");
  identity.append(
    el("strong", p.id, "student-id"),
    el("span", p.class, "student-class"),
  );
  if (p.status) identity.append(el("span", p.status, "student-status"));
  if (p.design) identity.append(designBadge(p.design));
  if (seen.has(p.id)) identity.append(el("span", "봄", "seen-badge"));
  const title = el("h2", p.title);
  body.append(identity, title, el("p", p.description, "desc"));
  card.append(body);
  return card;
}
function render() {
  const q = $("search").value.trim(),
    group = $("class").value;
  const result = filterProjects(projects, q, group);
  // 반을 고르면 선택칸 테두리를 프리즘으로 켜서 '필터 적용 중'임을 보여 준다
  $("class").parentElement.classList.toggle("is-active", !!group);
  $("cards").replaceChildren(...result.slice(0, limit).map(card));
  $("result").textContent =
    q || group ? `검색 결과 ${result.length}개` : `작품 ${projects.length}개`;
  $("reset").hidden = !$("search").value && !group;
  $("message").textContent = !projects.length
    ? "등록된 작품이 없습니다. 곧 학생들의 프로그램을 만나 보세요."
    : !result.length
      ? "검색 결과가 없습니다. 검색어나 반을 바꿔 보세요."
      : "";
  $("more").hidden = result.length <= limit;
  save();
}
async function load() {
  $("result").textContent = "불러오는 중…";
  $("message").replaceChildren();
  try {
    projects = await json("projects.json");
    if (!Array.isArray(projects)) throw Error("목록 형식 오류");
    for (const c of [...new Set(projects.map((p) => p.class))].sort()) {
      const o = el("option", c);
      o.value = c;
      $("class").append(o);
    }
    $("class").value = $("class").dataset.restore || "";
    render();
    requestAnimationFrame(() => scrollTo(0, restoreY));
  } catch {
    $("result").textContent = "목록을 불러오지 못했습니다.";
    const retry = el("button", "다시 시도");
    retry.onclick = load;
    $("message").replaceChildren(retry);
  }
}
$("filters").onsubmit = (e) => e.preventDefault();
// '/' 키로 검색창 이동 (입력 중이 아닐 때만)
addEventListener("keydown", (e) => {
  if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement?.tagName)) return;
  e.preventDefault();
  $("search").focus();
});
for (const id of ["search", "class"])
  $(id).addEventListener(id === "search" ? "input" : "change", () => {
    limit = 24;
    render();
  });
$("more").onclick = () => {
  limit += 24;
  render();
};
$("reset").onclick = () => {
  $("search").value = "";
  $("class").value = "";
  limit = 24;
  render();
  $("search").focus();
};
addEventListener("pagehide", save);
addEventListener("scroll", save, { passive: true });
load();
