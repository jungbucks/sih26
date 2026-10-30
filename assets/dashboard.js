// 진행 대시보드: projects.json의 진행 단계(status)·디자인 표시로 학번별 완료 단계를 배지로 보여 준다.
// 학생 이름·작품 제목은 쓰지 않는다(학번만). 만점 = PRD·1~4회 개선·디자인 여섯 가지.
import { $, el, json, designBadge } from "./common.js";

const STAGES = ["PRD", "1회 개선", "2회 개선", "3회 개선", "4회 개선"];
const SHORT = { PRD: "PRD", "1회 개선": "1회", "2회 개선": "2회", "3회 개선": "3회", "4회 개선": "4회" };
const FULL = STAGES.length + 1;
const VIEW_KEY = "sih26:dashboard:v1";
let projects = [];

// 진행 단계는 누적: 3회 개선이면 PRD·1회·2회도 마친 것. 5회 개선은 4회까지 다 마친 것으로 본다
function level(status) {
  if (status === "5회 개선") return STAGES.length;
  return STAGES.indexOf(status) + 1;
}
function progress(p) {
  const lv = level(p.status || "");
  const steps = STAGES.map((s, i) => ({ name: s, done: lv > i }));
  steps.push({ name: "디자인", done: !!p.design });
  const done = steps.filter((s) => s.done).length;
  return { steps, done, next: steps.find((s) => !s.done) };
}
function badge(step, p) {
  if (step.name === "디자인" && step.done) {
    const b = designBadge(p.design);
    b.classList.add("dash-step");
    return b;
  }
  const gold = step.done && step.name === "4회 개선";
  const b = el("span", SHORT[step.name] || step.name, "dash-step" + (step.done ? " done" : "") + (gold ? " gold" : ""));
  b.title = step.name + (step.done ? " 완료" : " 아직");
  return b;
}
function row(p) {
  const { steps, done } = progress(p);
  const li = el("li", undefined, "dash-row");
  const id = el("a", p.id, "student-id");
  id.href = `work.html?id=${p.id}`;
  const list = el("span", undefined, "dash-steps");
  list.setAttribute("aria-label", `${done}/${FULL} 완료: ` + steps.filter((s) => s.done).map((s) => s.name).join(", "));
  list.append(...steps.map((s) => badge(s, p)));
  li.append(id, list, el("span", `${done}/${FULL}`, "dash-count"));
  return li;
}
// 반마다 '만점 → 1개 남음 → 2개 남음 → 3개 이상 남음' 묶음으로 나눈다
const BUCKETS = [
  { name: "만점", test: (left) => left === 0 },
  { name: "1개 남음", test: (left) => left === 1 },
  { name: "2개 남음", test: (left) => left === 2 },
  { name: "3개 이상 남음", test: (left) => left >= 3 },
];
function render() {
  const group = $("dash-class").value,
    todoOnly = $("dash-todo").checked;
  try {
    sessionStorage.setItem(VIEW_KEY, JSON.stringify({ group, todoOnly }));
  } catch {}
  const classes = [...new Set(projects.map((p) => p.class || "반 미지정"))].sort();
  const box = $("dash-groups");
  box.replaceChildren();
  let total = 0,
    full = 0;
  for (const c of classes) {
    if (group && c !== group) continue;
    const list = projects.filter((p) => (p.class || "반 미지정") === c).sort((a, b) => a.id.localeCompare(b.id));
    const fullHere = list.filter((p) => progress(p).done === FULL).length;
    total += list.length;
    full += fullHere;
    const sec = el("section", undefined, "dash-class");
    sec.append(el("h2", undefined));
    sec.firstChild.append(c, el("span", ` 만점 ${fullHere} / ${list.length}명`, "dash-class-count"));
    for (const b of BUCKETS) {
      if (todoOnly && b.name === "만점") continue;
      const items = list.filter((p) => b.test(FULL - progress(p).done));
      if (!items.length) continue;
      const h = el("h3", `${b.name} `, "dash-bucket" + (b.name === "만점" ? " full" : ""));
      h.append(el("span", `${items.length}명`, "dash-bucket-count"));
      const ul = el("ul", undefined, "dash-list");
      ul.append(...items.map(row));
      sec.append(h, ul);
    }
    box.append(sec);
  }
  $("dash-summary").textContent = `${group || "전체"} ${total}명 중 만점 ${full}명` + (todoOnly ? " · 만점 아닌 학생만 표시" : "");
}

json("projects.json")
  .then((data) => {
    projects = data.projects || data;
    const select = $("dash-class");
    for (const c of [...new Set(projects.map((p) => p.class).filter(Boolean))].sort())
      select.append(new Option(c, c));
    try {
      const s = JSON.parse(sessionStorage.getItem(VIEW_KEY)) || {};
      if ([...select.options].some((o) => o.value === s.group)) select.value = s.group;
      $("dash-todo").checked = !!s.todoOnly;
    } catch {}
    select.addEventListener("change", render);
    $("dash-todo").addEventListener("change", render);
    render();
  })
  .catch(() => {
    $("dash-summary").textContent = "";
    $("message").textContent = "작품 목록을 불러오지 못했습니다. 연결을 확인한 뒤 새로고침해 주세요.";
  });
