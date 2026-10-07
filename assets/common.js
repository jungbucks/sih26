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
export async function copy(text, field, status) {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "복사했습니다.";
  } catch {
    const d = field.closest("details");
    if (d) d.open = true;
    field.focus();
    field.select();
    status.textContent =
      "자동 복사에 실패했습니다. 선택한 내용을 직접 복사하세요 (Ctrl+C / ⌘C).";
  }
}
json("build-info.json")
  .then((b) => {
    $("build-info").textContent =
      `적용 커밋 ${b.commit || "미커밋 작업본"} · 산출물 생성 ${new Date(b.generatedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })} (한국 시간)`;
  })
  .catch(() => {
    $("build-info").textContent = "빌드 정보를 확인할 수 없습니다.";
  });
