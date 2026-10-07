import { $, json, date, shot, copy } from "./common.js";
const id = new URLSearchParams(location.search).get("id");
let timer;
async function init() {
  try {
    if (!/^\d{5}$/.test(id || "")) throw Error("잘못된 학번입니다.");
    const list = await json("projects.json"),
      p = list.find((x) => x.id === id);
    if (!p) throw Error("등록되지 않은 작품입니다.");
    $("status").hidden = true;
    $("work").hidden = false;
    document.title = `${p.title} · 학생 프로그램 전시판`;
    $("identity").textContent = `${id} · ${p.class}`;
    $("title").textContent = p.title;
    $("description").textContent = p.description;
    $("meta").textContent = [p.status, date(p.updatedAt)]
      .filter(Boolean)
      .join(" · ");
    $("changes").textContent = p.changes || "";
    $("hero").append(shot(p));
    for (const name of ["run", "preview-run"]) $(name).href = p.path;
    $("download").href = `${p.path}index.html`;
    $("download").download = `${id}.html`;
    function start() {
      clearTimeout(timer);
      $("preview").hidden = false;
      const f = document.createElement("iframe");
      f.title = `${p.title} 미리 실행`;
      f.setAttribute("sandbox", "allow-scripts allow-forms");
      $("preview-status").textContent = "미리보기 문서를 불러오는 중…";
      timer = setTimeout(() => {
        $("preview-status").textContent =
          "10초 이상 로드 신호가 없습니다. 새 탭 실행이나 다시 시작을 이용하세요.";
      }, 10000);
      f.onload = () => {
        clearTimeout(timer);
        $("preview-status").textContent =
          "프레임 로드 신호를 받았습니다. 프로그램의 정상 작동을 확인한 것은 아닙니다. 흰 화면이나 내부 오류는 새 탭에서 직접 확인하세요.";
      };
      f.src = p.path;
      $("frame").replaceChildren(f);
    }
    $("preview-start").onclick = start;
    $("restart").onclick = start;
    $("stop").onclick = () => {
      clearTimeout(timer);
      $("frame").replaceChildren();
      $("preview").hidden = true;
      $("preview-start").focus();
    };
    $("grow").onclick = () => {
      const f = $("frame").querySelector("iframe");
      if (f) f.style.height = `${f.getBoundingClientRect().height + 200}px`;
    };
    $("prd-open").onclick = async () => {
      $("prd-panel").hidden = false;
      $("prd-status").textContent = "불러오는 중…";
      if (!p.prd) {
        $("prd-status").textContent = "기획서는 아직 등록되지 않았습니다.";
        return;
      }
      try {
        const r = await fetch(p.prd);
        if (!r.ok) throw Error();
        $("prd-text").textContent = await r.text();
        $("prd-status").textContent = "공개 기획서 원문";
        $("prd-download").href = p.prd;
        $("prd-download").download = `${id}.md`;
        $("prd-download").hidden = false;
      } catch {
        $("prd-status").textContent =
          "기획서를 불러오지 못했습니다. 기획서 보기를 눌러 다시 시도하세요.";
      }
    };
    $("code-load").onclick = async () => {
      try {
        const r = await fetch(`${p.path}index.html`);
        if (!r.ok) throw Error();
        $("code").value = await r.text();
        $("code-copy").hidden = false;
        $("code-status").textContent = "원본을 불러왔습니다.";
      } catch {
        $("code-status").textContent =
          "코드를 불러오지 못했습니다. 새 탭 실행 후 브라우저의 페이지 저장 기능을 이용하세요.";
      }
    };
    $("code-copy").onclick = () =>
      copy($("code").value, $("code"), $("code-status"));
    $("prompt").value =
      `작품 학번: ${id}\n작품 제목: ${p.title}\n작품 주소: ${new URL(p.path, location.href).href}\n\n너는 학생이 만든 프로그램의 개선점을 찾도록 돕는 코치야.

제공된 HTML·기획서·실행 결과를 바탕으로 질문해. 직접 실행하지 않았다면 실행했다고 말하지 마. URL 접근, 코드 분석, 실제 조작 결과를 구분해.

한 번에 관련 질문 2~3개씩 하고 내 답변을 기다려. ‘잘 돼요’, ‘불편해요’처럼 모호하게 답하면 입력·조작·기대 결과·실제 결과를 추가로 물어봐.

프로그램 목적, 정상 작동, 빈 데이터와 경계 상황, 잘못된 입력과 반복 조작, 처음 쓰는 사람의 이해, 결과의 정확성과 한계를 차례로 점검해. 내가 확인하지 않았다면 직접 해볼 조작을 안내하고 결과를 기다려.

개인정보·공정성·접근성·정보 정확성 중 프로그램과 관련 있는 윤리적 상황을 질문해. 어떤 규칙 때문에 누가 어떤 영향을 받는지 구체화해. AI 기능이 없는 프로그램의 일반 오류를 할루시네이션이라고 부르지 마.

확인한 문제와 추측을 구분하고, 내가 우선 개선할 1~2개를 선택하게 해.

마지막에 테스트 기록, 기능적 개선안, 윤리적 분석, 제작 AI용 수정 요청을 작성해. 수정 요청에는 현재 동작→원하는 동작→재시험 방법을 포함해. 없는 오류를 만들어내지 마.`;
    $("prompt-copy").onclick = () =>
      copy($("prompt").value, $("prompt"), $("copy-status"));
  } catch (e) {
    $("status").textContent =
      `작품을 표시할 수 없습니다. ${e.message} 목록으로 돌아가 다시 선택해 주세요.`;
  }
}
init();
