import { $, el, json, date, shot, link } from "./common.js";
const key = "sih26:gallery:v1";
let projects = [],
  limit = 24,
  restoreY = 0;
try {
  const s = JSON.parse(sessionStorage.getItem(key));
  if (s) {
    $("search").value = s.q || "";
    $("sort").value = s.sort === "recent" ? "recent" : "id";
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
        sort: $("sort").value,
        limit,
        y: scrollY,
      }),
    );
  } catch {}
}
function card(p) {
  const n = el("article", undefined, "card");
  const a = link("", `work.html?id=${p.id}`, "");
  a.setAttribute("aria-label", `${p.title} 상세 보기`);
  a.append(shot(p));
  n.append(a);
  const b = el("div", undefined, "card-body");
  b.append(el("span", p.id, "eyebrow"));
  const h = el("h2");
  h.append(link(p.title, `work.html?id=${p.id}`, ""));
  b.append(h, el("p", p.description, "desc"));
  const tags = el("p", undefined, "tags");
  tags.append(el("span", p.class, "tag"));
  if (p.status) tags.append(el("span", p.status, "tag"));
  b.append(tags, el("p", date(p.updatedAt), "date"));
  const actions = el("div", undefined, "actions"),
    run = link("실행하기 ↗", p.path);
  run.target = "_blank";
  run.rel = "noopener noreferrer";
  const dl = link("HTML 다운로드", `${p.path}index.html`);
  dl.download = `${p.id}.html`;
  actions.append(run, dl);
  b.append(actions);
  n.append(b);
  return n;
}
function render() {
  const q = $("search").value.trim().toLocaleLowerCase(),
    group = $("class").value;
  const result = projects.filter(
    (p) =>
      (!group || p.class === group) &&
      `${p.id} ${p.title} ${p.description}`.toLocaleLowerCase().includes(q),
  );
  result.sort(
    $("sort").value === "recent"
      ? (a, b) =>
          (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0) ||
          a.id.localeCompare(b.id)
      : (a, b) => a.id.localeCompare(b.id),
  );
  $("cards").replaceChildren(...result.slice(0, limit).map(card));
  $("result").textContent =
    `전체 ${projects.length}개 중 ${result.length}개 · ${Math.min(limit, result.length)}개 표시`;
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
for (const id of ["search", "class", "sort"])
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
  $("sort").value = "id";
  limit = 24;
  render();
};
addEventListener("pagehide", save);
addEventListener("scroll", save, { passive: true });
load();
