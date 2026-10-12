import {
  $,
  el,
  json,
  date,
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
    document.title = `${p.title} · 학생 프로그램 전시판`;
    $("identity").textContent = `${id} · ${p.class}`;
    $("title").textContent = p.title;
    $("description").textContent = p.description;
    $("meta").textContent = [p.status, date(p.updatedAt)]
      .filter(Boolean)
      .join(" · ");
    $("changes").textContent = p.changes || "";
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
$("retry").onclick = init;
addEventListener("pagehide", () => clearTimeout(timer));
init();
