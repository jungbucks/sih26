import {
  $,
  el,
  json,
  date,
  designBadge,
  loadView,
  filterProjects,
  markSeen,
} from "./common.js";
const id = new URLSearchParams(location.search).get("id");
let timer;
// 학생에게 그대로 보여 줄 수 있는 오류 (네트워크 오류 코드 등은 감춘다)
class ShownError extends Error {}
// 이전·다음은 목록에서 고른 검색·반 조건을 따른다. 조건 밖 작품이면 전체 학번순
function setNav(a, p, label) {
  a.hidden = !p;
  if (!p) return;
  a.href = `work.html?id=${p.id}`;
  a.replaceChildren(el("span", label, "nav-dir"), el("span", p.title, "nav-title"));
}
// AI 검토 의견: 번호가 붙은 카드 1~3장 (없으면 영역을 숨긴다)
function renderFeedback(f) {
  $("feedback").hidden = !f;
  if (!f) return;
  $("feedback-stage").textContent = `${f.stage}${f.design ? " · 디자인" : ""} 기준 · 개선 제안 ${f.items.length}개`;
  $("feedback-list").replaceChildren(
    ...f.items.map((it, i) => {
      const li = el("li", undefined, "feedback-card");
      li.style.setProperty("--i", i); // 카드가 차례로 나타나는 순서
      li.append(
        el("span", String(i + 1), "feedback-num"),
        el("h3", it.title),
        el("p", it.body),
      );
      return li;
    }),
  );
}
// 제작 기록: V1·V2… 버전마다 단계와 날짜를 한 줄씩 (마지막 줄이 지금 보이는 버전)
function renderHistory(p) {
  const list = p.history || [];
  $("history").hidden = !list.length;
  $("meta").hidden = list.length > 0;
  $("history-list").replaceChildren(
    ...list.map((v, i) => {
      const li = el("li", undefined, "history-item");
      const when =
        date(v.createdAt) === date(v.updatedAt)
          ? date(v.updatedAt)
          : `${date(v.createdAt)} ~ ${date(v.updatedAt)}`;
      li.append(
        el("span", v.version, "history-version"),
        el("span", (v.stage || "기록") + (v.design ? " · 디자인" : ""), "history-stage"),
        el("span", when, "history-date"),
      );
      if (i === list.length - 1) li.append(el("span", "현재", "history-now"));
      return li;
    }),
  );
}
function renderNav(list) {
  const view = loadView();
  let order = filterProjects(list, view.q, view.group);
  if (!order.some((x) => x.id === id)) order = filterProjects(list);
  const i = order.findIndex((x) => x.id === id);
  setNav($("prev"), order[i - 1], "← 이전 작품");
  setNav($("next"), order[i + 1], "다음 작품 →");
  $("work-nav").hidden = order.length < 2;
}
async function init() {
  $("retry").hidden = true;
  $("status").textContent = "작품을 불러오는 중…";
  try {
    if (!/^\d{5}$/.test(id || "")) throw new ShownError("잘못된 학번입니다.");
    const list = await json("projects.json");
    const p = list.find((x) => x.id === id);
    if (!p) throw new ShownError("등록되지 않은 작품입니다.");
    document.title = `${p.title} · 레이트 바이브 코딩 프로젝트`;
    // 학번·반·진행 단계를 목록 카드와 같은 칩으로 제목 위에 보여 준다
    $("identity").replaceChildren(
      el("strong", id, "student-id"),
      el("span", p.class, "student-class"),
      ...(p.status ? [el("span", p.status, "student-status")] : []),
      ...(p.design ? [designBadge(p.design)] : []),
    );
    $("title").textContent = p.title;
    $("description").textContent = p.description;
    $("meta").textContent = [p.status, p.design && `디자인 (${p.design.label})`, date(p.updatedAt)]
      .filter(Boolean)
      .join(" · ");
    $("changes").textContent = p.changes || "";
    renderFeedback(p.feedback);
    renderHistory(p);
    $("run").href = p.path;
    $("download").href = `${p.path}index.html`;
    $("download").download = `${id}.html`;
    renderNav(list);
    function start() {
      clearTimeout(timer);
      const frame = document.createElement("iframe");
      frame.title = `${p.title} 실행 화면`;
      frame.setAttribute("sandbox", "allow-scripts allow-forms");
      $("preview-status").textContent = "실행 화면을 불러오는 중…";
      timer = setTimeout(() => {
        $("preview-status").textContent =
          "화면을 불러오는 데 시간이 걸립니다. 새 탭에서 실행하거나 다시 시작해 보세요.";
      }, 10000);
      frame.onload = () => {
        if ($("frame").firstElementChild !== frame) return;
        clearTimeout(timer);
        $("preview-status").textContent = "";
      };
      frame.src = p.path;
      $("frame").replaceChildren(frame);
    }
    $("restart").onclick = start;
    $("status").hidden = true;
    $("work").hidden = false;
    markSeen(id);
    start();
  } catch (e) {
    $("status").hidden = false;
    $("work").hidden = true;
    if (e instanceof ShownError) {
      $("status").textContent =
        `작품을 표시할 수 없습니다. ${e.message} 목록으로 돌아가 다시 선택해 주세요.`;
    } else {
      $("status").textContent =
        "작품 목록을 불러오지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.";
      $("retry").hidden = false;
    }
  }
}
// 스위치를 켜면 검토 의견이 아래로 펼쳐진다. 접힌 동안은 inert로 읽기·포커스에서 뺀다
$("feedback-toggle").addEventListener("change", (e) => {
  const open = e.target.checked;
  $("feedback").classList.toggle("open", open);
  $("feedback-panel").inert = !open;
});
$("retry").onclick = init;
addEventListener("pagehide", () => clearTimeout(timer));
init();
