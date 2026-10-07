import { $, json, date } from "./common.js";
const id = new URLSearchParams(location.search).get("id");
let timer;
async function init() {
  try {
    if (!/^\d{5}$/.test(id || "")) throw Error("잘못된 학번입니다.");
    const list = await json("projects.json");
    const p = list.find((x) => x.id === id);
    if (!p) throw Error("등록되지 않은 작품입니다.");
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
    start();
  } catch (e) {
    $("status").hidden = false;
    $("work").hidden = true;
    $("status").textContent =
      `작품을 표시할 수 없습니다. ${e.message} 목록으로 돌아가 다시 선택해 주세요.`;
  }
}
addEventListener("pagehide", () => clearTimeout(timer));
init();
