// 3차(디자인) 개선용 시안 페이지 — 스타일 카드를 고르면 샘플 앱이 바뀌고 수정 프롬프트가 완성된다.
// 브랜드 '풍' 값은 VoltAgent/awesome-design-md(MIT)의 DESIGN.md에서 가져왔다. 공식 브랜드 사양이 아니다.
// 원본 강조색 위 흰 글자가 4.5:1에 못 미치면(btnLarge) 버튼 글자를 19px 굵게 키워 큰 글자 기준(3:1)을 맞추고,
// 바탕 위 강조 글자(accentText)만 같은 문서의 진한 변형을 쓴다. 원본 색은 그대로 둔다.

const FONT_DIR = "../assets/fonts/";

export const FONTS = {
  F1: {
    name: "깔끔한 고딕",
    family: "Wanted Sans",
    file: "WantedSansVariable.woff2",
    weight: "400 1000",
    feel: "또렷하고 현대적",
  },
  F2: {
    name: "부드러운 돋움",
    family: "Gowun Dodum",
    file: "GowunDodum-Regular.woff2",
    weight: "400",
    feel: "둥글고 다정함",
  },
  F3: {
    name: "단정한 바탕(명조)",
    family: "Gowun Batang",
    file: "GowunBatang-Regular.woff2",
    bold: "GowunBatang-Bold.woff2",
    weight: "400",
    feel: "책처럼 차분함",
  },
  F4: {
    name: "굵은 제목체",
    family: "Paperlogy",
    file: "Paperlogy-7Bold.woff2",
    weight: "700",
    feel: "힘 있는 제목 (본문은 고딕)",
    titleOnly: true,
  },
  F5: {
    name: "픽셀 글꼴",
    family: "Galmuri11",
    file: "Galmuri11.woff2",
    bold: "Galmuri11-Bold.woff2",
    weight: "400",
    feel: "옛 컴퓨터·게임 화면",
  },
  F6: {
    name: "코딩 글꼴(고정폭)",
    family: "GalmuriMono11",
    file: "GalmuriMono11.woff2",
    weight: "400",
    feel: "모든 글자 폭이 같은 터미널 화면",
  },
};

// accent = 버튼 바탕, onAccent = 버튼 글자, accentText = 바탕 위 강조 글자
export const STYLES = [
  {
    id: "S1", name: "애플풍",
    feel: "여백이 넓고 조용한, 파란 버튼 하나",
    bg: "#f5f5f7", surface: "#ffffff", text: "#1d1d1f", mute: "#6e6e73", border: "#e0e0e0",
    accent: "#0066cc", onAccent: "#ffffff", accentText: "#0066cc",
    radius: 18, btnRadius: 999, shadow: "none", font: "F1",
  },
  {
    id: "S2", name: "노션풍",
    feel: "종이 같은 흰 바탕에 보라 포인트",
    bg: "#ffffff", surface: "#f7f6f3", text: "#1a1a1a", mute: "#615d59", border: "#e9e7e4",
    accent: "#5645d4", onAccent: "#ffffff", accentText: "#5645d4",
    radius: 12, btnRadius: 8, shadow: "0 1px 3px rgba(0,0,0,.06)", font: "F1",
  },
  {
    id: "S3", name: "리니어풍", dark: true,
    feel: "까만 바탕, 보랏빛 파랑, 날렵함",
    bg: "#010102", surface: "#0f1011", text: "#f7f8f8", mute: "#8a8f98", border: "#23252a",
    accent: "#5e6ad2", onAccent: "#ffffff", accentText: "#828fff",
    radius: 12, btnRadius: 6, shadow: "0 0 0 1px #23252a", font: "F1",
  },
  {
    id: "S4", name: "버셀풍",
    feel: "흑백만으로 또렷하게",
    bg: "#ffffff", surface: "#fafafa", text: "#171717", mute: "#4d4d4d", border: "#ebebeb",
    accent: "#171717", onAccent: "#ffffff", accentText: "#0761d1",
    radius: 8, btnRadius: 6, shadow: "0 0 0 1px #ebebeb", font: "F1",
  },
  {
    id: "S5", name: "클로드풍",
    feel: "크림색 바탕, 테라코타, 책 같은 제목",
    bg: "#faf9f5", surface: "#f5f0e8", text: "#141413", mute: "#6c6a64", border: "#e6dfd8",
    accent: "#cc785c", onAccent: "#ffffff", accentText: "#9c4f37", btnLarge: true,
    radius: 12, btnRadius: 8, shadow: "none", font: "F1", titleFont: "F3",
  },
  {
    id: "S6", name: "에어비앤비풍",
    feel: "둥근 카드, 선명한 코랄 핑크",
    bg: "#ffffff", surface: "#f7f7f7", text: "#222222", mute: "#6a6a6a", border: "#dddddd",
    accent: "#ff385c", onAccent: "#ffffff", accentText: "#e00b41", btnLarge: true,
    radius: 20, btnRadius: 8, shadow: "0 6px 16px rgba(0,0,0,.12)", font: "F2",
  },
  {
    id: "S7", name: "피그마풍",
    feel: "검정 바탕글에 파스텔 색 블록",
    bg: "#ffffff", surface: "#f7f7f5", text: "#000000", mute: "#4a4a4a", border: "#e6e6e6",
    accent: "#000000", onAccent: "#ffffff", accentText: "#000000", block: "#dceeb1",
    radius: 24, btnRadius: 999, shadow: "none", font: "F1",
  },
  {
    id: "S8", name: "스포티파이풍", dark: true,
    feel: "어두운 무대 위 초록 재생 버튼",
    bg: "#121212", surface: "#181818", text: "#ffffff", mute: "#b3b3b3", border: "#2a2a2a",
    accent: "#1ed760", onAccent: "#000000", accentText: "#1ed760",
    radius: 8, btnRadius: 999, shadow: "0 8px 24px rgba(0,0,0,.5)", font: "F1",
  },
  {
    id: "S9", name: "나이키풍",
    feel: "흑백 대비, 굵은 제목, 각진 카드",
    bg: "#ffffff", surface: "#f5f5f5", text: "#111111", mute: "#707072", border: "#e5e5e5",
    accent: "#111111", onAccent: "#ffffff", accentText: "#111111",
    radius: 0, btnRadius: 999, shadow: "none", font: "F1", titleFont: "F4",
  },
  {
    id: "S10", name: "스트라이프풍",
    feel: "남색 글자에 쨍한 보라, 은은한 그림자",
    bg: "#ffffff", surface: "#f6f9fc", text: "#0d253d", mute: "#61718a", border: "#e3e8ee",
    accent: "#533afd", onAccent: "#ffffff", accentText: "#533afd",
    radius: 8, btnRadius: 999, shadow: "0 13px 27px -5px rgba(50,50,93,.25)", font: "F1",
  },
  {
    id: "S11", name: "종이와 파랑",
    feel: "공식 문서처럼 정확하고 중립적",
    bg: "#ffffff", surface: "#f5f5f4", text: "#1a1d24", mute: "#5b606b", border: "#e5e7eb",
    accent: "#2563eb", onAccent: "#ffffff", accentText: "#2563eb",
    radius: 12, btnRadius: 10, shadow: "none", font: "F1",
  },
  {
    id: "S12", name: "안개와 청록",
    feel: "산뜻하고 기술적인 느낌",
    bg: "#f7fafa", surface: "#ecf3f2", text: "#16201f", mute: "#5f6a69", border: "#dee9e8",
    accent: "#0f766e", onAccent: "#ffffff", accentText: "#0f766e",
    radius: 12, btnRadius: 10, shadow: "none", font: "F1",
  },
  {
    id: "S13", name: "버터와 초록",
    feel: "차분하게 설명해 주는 따뜻함",
    bg: "#fdf9ed", surface: "#f3ead2", text: "#262114", mute: "#6e6a5c", border: "#eae0c6",
    accent: "#2e7d4f", onAccent: "#ffffff", accentText: "#276b43",
    radius: 12, btnRadius: 10, shadow: "none", font: "F2",
  },
  {
    id: "S14", name: "햇살과 호박",
    feel: "친근하고 활기찬 워크북",
    bg: "#fdfbf6", surface: "#f5efe1", text: "#23201a", mute: "#6d675c", border: "#ede7da",
    accent: "#b45309", onAccent: "#ffffff", accentText: "#9a4708",
    radius: 14, btnRadius: 10, shadow: "none", font: "F2",
  },
  // 시대·장르: 색만으로는 안 나오는 스타일이라 테두리 굵기(bw), 버튼 테두리·그림자, 배경 무늬(pattern)를 더 쓴다.
  // 무늬는 제목 글자 뒤에 깔리므로 바탕과 거의 같은 밝기의 옅은 점만 쓴다.
  {
    id: "S15", name: "레트로 맥",
    feel: "1980년대 흑백 컴퓨터 창, 픽셀 글자",
    bg: "#ffffff", surface: "#ffffff", text: "#000000", mute: "#444444", border: "#000000",
    accent: "#000000", onAccent: "#ffffff", accentText: "#000000",
    bw: 2, radius: 0, btnRadius: 8, btnBorder: true, shadow: "3px 3px 0 #000000", font: "F5",
    pattern: "radial-gradient(#bdbdbd 0.8px, transparent 1px)", patternSize: "4px 4px",
    patternNote: "회색 점이 촘촘한 옛 컴퓨터 바탕화면",
  },
  {
    id: "S16", name: "윈도우 95풍",
    feel: "회색 창, 볼록한 버튼, 남색 제목 막대",
    bg: "#c0c0c0", surface: "#ffffff", text: "#000000", mute: "#333333", border: "#808080",
    accent: "#000080", onAccent: "#ffffff", accentText: "#000080",
    radius: 0, btnRadius: 0, font: "F5",
    shadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff",
    btnShadow: "inset -1px -1px 0 #0a0a0a, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf",
  },
  {
    id: "S17", name: "8비트 게임", dark: true,
    feel: "고전 게임기 팔레트, 각진 픽셀 상자",
    bg: "#1d2b53", surface: "#000000", text: "#fff1e8", mute: "#c2c3c7", border: "#29adff",
    accent: "#ffec27", onAccent: "#000000", accentText: "#ffec27", block: "#7e2553",
    bw: 2, radius: 0, btnRadius: 0, shadow: "4px 4px 0 #000000", btnShadow: "4px 4px 0 #000000", font: "F5",
  },
  {
    id: "S18", name: "멤피스",
    feel: "1980년대 땡땡이 무늬, 원색과 굵은 선",
    bg: "#fff8e7", surface: "#ffffff", text: "#1b1b1b", mute: "#4a4a4a", border: "#1b1b1b",
    accent: "#ffd23f", onAccent: "#1b1b1b", accentText: "#b0126c", block: "#7fe0c8",
    bw: 2, radius: 16, btnRadius: 999, btnBorder: true,
    shadow: "4px 4px 0 #1b1b1b", btnShadow: "3px 3px 0 #1b1b1b", font: "F2", titleFont: "F4",
    pattern: "radial-gradient(#ffc6ec 2px, transparent 2.5px), radial-gradient(#bdeee1 2px, transparent 2.5px)",
    patternSize: "28px 28px", patternPos: "0 0, 14px 14px",
    patternNote: "분홍·민트 물방울 점이 엇갈려 찍힌 바탕",
  },
  {
    id: "S19", name: "스위스 스타일",
    feel: "흰 바탕, 검은 격자, 빨강 하나",
    bg: "#ffffff", surface: "#f2f2f2", text: "#000000", mute: "#555555", border: "#000000",
    accent: "#e30613", onAccent: "#ffffff", accentText: "#d10511",
    radius: 0, btnRadius: 0, shadow: "none", font: "F1",
  },
  {
    id: "S20", name: "바우하우스",
    feel: "빨강·파랑·노랑 원색, 동그라미와 네모",
    bg: "#f1e9da", surface: "#ffffff", text: "#111111", mute: "#4d4a44", border: "#111111",
    accent: "#2251a3", onAccent: "#ffffff", accentText: "#c62828", block: "#f4c430",
    bw: 2, radius: 0, btnRadius: 999, shadow: "none", font: "F1", titleFont: "F4",
  },
  {
    id: "S21", name: "네오 브루탈리즘",
    feel: "두꺼운 검은 테두리, 딱딱한 그림자, 쨍한 색",
    bg: "#f4f4f0", surface: "#ffffff", text: "#000000", mute: "#3d3d3d", border: "#000000",
    accent: "#ff90e8", onAccent: "#000000", accentText: "#000000", block: "#ffc900",
    bw: 3, radius: 6, btnRadius: 6, btnBorder: true,
    shadow: "4px 4px 0 #000000", btnShadow: "4px 4px 0 #000000", font: "F1",
  },
  {
    id: "S22", name: "Y2K",
    feel: "2000년 무렵의 반짝이는 보라, 말랑한 버튼",
    bg: "#e9ecff", surface: "#ffffff", text: "#1a1446", mute: "#4b4a6b", border: "#c9d6ff",
    accent: "#7b2ff7", onAccent: "#ffffff", accentText: "#6a1fe0", block: "#d9f6ff",
    radius: 24, btnRadius: 999, font: "F2",
    shadow: "0 0 0 2px #ffffff, 0 8px 24px rgba(123,47,247,.25)",
    btnShadow: "inset 0 2px 0 rgba(255,255,255,.45), 0 4px 12px rgba(123,47,247,.35)",
  },
  // 스타일 이름 목록은 styles.gallery를 참고했고, 값은 이 페이지에서 새로 정했다.
  // 반투명 바탕(rgba)이나 그라데이션 무늬가 있으면 대비 검사는 가장 어두운/밝은 곳의 근사색(bgEff·surfaceEff)으로 한다.
  {
    id: "S23", name: "글래스모피즘",
    feel: "색 번진 바탕 위 반투명 유리 카드",
    bg: "#e4e8ff", bgEff: "#a5b4fc", surface: "rgba(255,255,255,0.55)", surfaceEff: "#d8defd",
    text: "#1e1b4b", mute: "#3f3c70", border: "rgba(255,255,255,0.75)",
    accent: "#4f46e5", onAccent: "#ffffff", accentText: "#3730a3",
    radius: 20, btnRadius: 14, blur: 14, font: "F1",
    shadow: "0 8px 32px rgba(31,38,135,.18), inset 0 1px 0 rgba(255,255,255,.6)",
    pattern: "radial-gradient(circle at 15% 15%, #a5b4fc 0, transparent 45%), radial-gradient(circle at 90% 35%, #f9a8d4 0, transparent 40%), radial-gradient(circle at 40% 95%, #67e8f9 0, transparent 45%)",
    patternSize: "100% 100%", patternNote: "보라·분홍·하늘색이 크게 번진 바탕",
  },
  {
    id: "S24", name: "클레이모피즘",
    feel: "찰흙처럼 말랑하고 통통한 장난감 버튼",
    bg: "#f3eefe", surface: "#ffffff", text: "#2d2350", mute: "#5b5280", border: "#ebe4fb",
    accent: "#7c3aed", onAccent: "#ffffff", accentText: "#6d28d9", block: "#ffe1ec",
    radius: 28, btnRadius: 999, font: "F2",
    shadow: "8px 8px 16px rgba(93,63,167,.18), inset -4px -4px 8px rgba(93,63,167,.08), inset 4px 4px 8px rgba(255,255,255,.9)",
    btnShadow: "inset -3px -3px 6px rgba(0,0,0,.2), inset 3px 3px 6px rgba(255,255,255,.35), 4px 6px 12px rgba(124,58,237,.3)",
  },
  {
    id: "S25", name: "오로라 UI", dark: true,
    feel: "밤하늘에 번지는 초록·보라 빛",
    bg: "#0b1026", bgEff: "#1d4a6f", surface: "rgba(255,255,255,0.07)", surfaceEff: "#26365a",
    text: "#f1f5ff", mute: "#c3cbe4", border: "rgba(255,255,255,0.16)",
    accent: "#a78bfa", onAccent: "#0b1026", accentText: "#7dd3fc",
    radius: 18, btnRadius: 999, blur: 10, shadow: "none", font: "F1",
    pattern: "radial-gradient(ellipse at 20% 0%, rgba(56,189,248,.35), transparent 55%), radial-gradient(ellipse at 90% 25%, rgba(168,85,247,.35), transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(52,211,153,.25), transparent 55%)",
    patternSize: "100% 100%", patternNote: "하늘색·보라·초록 빛이 겹쳐 번진 어두운 바탕",
  },
  {
    id: "S26", name: "베이퍼웨이브", dark: true,
    feel: "분홍·하늘 네온과 노을 격자",
    bg: "#1a0b3d", bgEff: "#3d1a5c", surface: "#2a1458", text: "#fdf2ff", mute: "#d7c4f0", border: "#ff71ce",
    accent: "#01cdfe", onAccent: "#1a0b3d", accentText: "#ff8fd8", block: "#3b1670",
    bw: 2, radius: 6, btnRadius: 4, font: "F1", titleFont: "F4",
    shadow: "0 0 0 1px #ff71ce, 0 0 18px rgba(255,113,206,.35)",
    titleGlow: "0 0 12px rgba(255,113,206,.8)",
    pattern: "linear-gradient(180deg, transparent 55%, rgba(255,113,206,.28) 100%), repeating-linear-gradient(90deg, rgba(1,205,254,.13) 0 1px, transparent 1px 28px), repeating-linear-gradient(0deg, rgba(1,205,254,.13) 0 1px, transparent 1px 28px)",
    patternSize: "auto", patternNote: "하늘색 격자 위로 아래쪽이 분홍 노을처럼 물드는 바탕",
  },
  {
    id: "S27", name: "사이버펑크", dark: true,
    feel: "어두운 도시, 형광 노랑과 청록 네온",
    bg: "#0a0a12", surface: "#13131f", text: "#e6f7ff", mute: "#9aa7bd", border: "#00f0ff",
    accent: "#fcee0a", onAccent: "#000000", accentText: "#ff4d8a",
    radius: 0, btnRadius: 0, font: "F1",
    shadow: "0 0 0 1px #00f0ff, 0 0 14px rgba(0,240,255,.3)",
    btnShadow: "0 0 16px rgba(252,238,10,.55)",
    titleGlow: "0 0 10px rgba(0,240,255,.7)",
    pattern: "repeating-linear-gradient(0deg, rgba(0,240,255,.05) 0 1px, transparent 1px 4px)",
    patternSize: "auto", patternNote: "옛 모니터처럼 가로줄이 아주 옅게 깔린 바탕",
  },
  {
    id: "S28", name: "터미널 해커", dark: true,
    feel: "검은 화면에 초록 코딩 글자",
    bg: "#0c0f0c", surface: "#0f1a10", text: "#33ff66", mute: "#7bc98a", border: "#1f7a33",
    accent: "#33ff66", onAccent: "#001a07", accentText: "#b6ffc7",
    radius: 0, btnRadius: 0, shadow: "none", font: "F6",
    titleGlow: "0 0 6px rgba(51,255,102,.6)",
    pattern: "repeating-linear-gradient(0deg, rgba(51,255,102,.05) 0 1px, transparent 1px 3px)",
    patternSize: "auto", patternNote: "초록 주사선(가로줄)이 옅게 깔린 바탕",
  },
  {
    id: "S29", name: "파스텔 팝",
    feel: "분홍·민트 파스텔, 통통 튀는 버튼",
    bg: "#fff5fa", surface: "#ffffff", text: "#3b2a4d", mute: "#6e5a80", border: "#f3d6ea",
    accent: "#ffb3d1", onAccent: "#3b2a4d", accentText: "#b4236a", block: "#d7f5ec",
    radius: 20, btnRadius: 999, font: "F2",
    shadow: "0 4px 0 #f3d6ea", btnShadow: "0 4px 0 #e895bd",
  },
  {
    id: "S30", name: "어스 톤",
    feel: "흙·나무·올리브의 차분한 자연색",
    bg: "#f3ece2", surface: "#faf6ef", text: "#2f2a22", mute: "#625848", border: "#ddd0bd",
    accent: "#5f6b3a", onAccent: "#ffffff", accentText: "#8a4b2a", block: "#eadcc6",
    radius: 10, btnRadius: 10, shadow: "none", font: "F1", titleFont: "F3",
  },
];

// 학생 눈높이의 묶음과 어울리는 작품. 카드 순서도 이 순서를 따른다(번호는 처음 만든 순서라 섞여 있다).
export const GROUPS = [
  { name: "깔끔·차분", hint: "계산기, 계획표, 정보를 정확히 보여 주는 도구", ids: ["S1", "S2", "S4", "S10", "S19"] },
  { name: "따뜻·친근", hint: "다이어리, 체크리스트, 추천 앱", ids: ["S5", "S6", "S24", "S29", "S30"] },
  { name: "강렬·개성", hint: "눈에 확 띄어야 하는 앱, 퀴즈·게임", ids: ["S7", "S9", "S21", "S18", "S20"] },
  { name: "어둡게", hint: "시뮬레이터, 음악·게임, 밤에 쓰는 앱", ids: ["S3", "S8", "S27", "S28"] },
  { name: "반짝·몽환", hint: "꾸미기, 감성 기록, 운세·뽑기", ids: ["S23", "S25", "S26", "S22"] },
  { name: "옛날 감성", hint: "레트로 게임, 추억 앱", ids: ["S15", "S16", "S17"] },
  { name: "선생님 세트", hint: "설명·학습 페이지", ids: ["S11", "S12", "S13", "S14"] },
];

const byId = (list, id) => list.find((x) => x.id === id);

// 스타일 기본 글꼴 위에 학생이 고른 글꼴을 덮는다. F4는 제목 전용이라 본문은 F1.
export function resolveFonts(style, fontId) {
  if (!fontId) return { body: style.font, title: style.titleFont || style.font };
  if (fontId === "F4") return { body: "F1", title: "F4" };
  return { body: fontId, title: fontId };
}

function fontFace(id) {
  const f = FONTS[id];
  const lines = [
    `@font-face { font-family: "${f.family}"; src: url("${FONT_DIR}${f.file}") format("woff2"); font-weight: ${f.weight}; font-display: swap; }`,
  ];
  if (f.bold)
    lines.push(
      `@font-face { font-family: "${f.family}"; src: url("${FONT_DIR}${f.bold}") format("woff2"); font-weight: 700; font-display: swap; }`,
    );
  return lines;
}

const stack = (id) =>
  `"${FONTS[id].family}", ${id === "F3" ? "serif" : id === "F6" ? "monospace" : "sans-serif"}`;

export function buildPrompt(style, fontId, extra) {
  const fonts = resolveFonts(style, fontId);
  const ids = [...new Set([fonts.body, fonts.title])];
  const fontLabel = fontId ? `${fontId} ${FONTS[fontId].name}` : "스타일 기본 글꼴";
  const shape = (r) => (r >= 999 ? "알약 모양(완전히 둥글게)" : r === 0 ? "각지게(0px)" : `${r}px`);
  const out = [
    "[디자인 수정 요청]",
    `선택한 시안: ${style.id} ${style.name} · ${fontLabel}`,
    `분위기: ${style.feel}`,
    "",
    "1. 색 (이 값만 쓰고 다른 색은 더하지 마)",
    `- 페이지 바탕 ${style.bg}, 카드·입력칸 바탕 ${style.surface}, 테두리 ${style.border}`,
    `- 글자 ${style.text}, 보조 글자 ${style.mute}`,
    `- 강조색 ${style.accent} (버튼 글자 ${style.onAccent}) — 가장 중요한 버튼과 핵심 결과 한두 곳에만`,
  ];
  if (style.btnLarge)
    out.push("- 강조색 버튼의 글자는 19px 이상 굵게 (이 색 위의 흰 글자는 큰 글자여야 읽기 쉬워요)");
  if (style.accentText !== style.accent)
    out.push(`- 바탕 위에 강조 글자를 쓸 때는 ${style.accentText}`);
  if (style.block) out.push(`- 결과·요약 카드 하나에 색 블록 ${style.block}를 써도 좋아`);
  out.push(
    "",
    "2. 모양",
    `- 카드 모서리 ${shape(style.radius)}, 버튼 모서리 ${shape(style.btnRadius)}`,
    `- 카드·입력칸 테두리 ${style.bw || 1}px ${style.border}`,
    `- 카드 그림자: ${style.shadow === "none" ? "쓰지 않기" : style.shadow}`,
  );
  if (style.blur)
    out.push(
      `- 카드·입력칸은 반투명 바탕 ${style.surface}에 backdrop-filter: blur(${style.blur}px); 로 뒤가 흐리게 비치게`,
    );
  if (style.titleGlow) out.push(`- 제목 빛 번짐: text-shadow: ${style.titleGlow};`);
  if (style.btnBorder) out.push(`- 버튼에도 ${style.bw || 1}px ${style.border} 테두리`);
  if (style.btnShadow) out.push(`- 버튼 그림자: ${style.btnShadow}`);
  if (style.pattern)
    out.push(
      `- 페이지 바탕 무늬(${style.patternNote}): background-image: ${style.pattern}; background-size: ${style.patternSize};` +
        (style.patternPos ? ` background-position: ${style.patternPos};` : ""),
      "- 무늬는 페이지 바탕에만 깔고, 글자가 많은 카드 안에는 깔지 마",
    );
  out.push(
    "",
    "3. 글꼴 (전시판 공용 글꼴 — 아래 CSS를 그대로 넣어 줘)",
    ...ids.flatMap(fontFace),
    `- 본문: font-family: ${stack(fonts.body)};`,
  );
  if (fonts.title !== fonts.body) out.push(`- 제목(h1·h2): font-family: ${stack(fonts.title)};`);
  out.push(
    "- 글꼴을 못 불러와도 기본 글꼴로 정상 작동해야 해",
    "",
    "4. 지킬 것",
    "- 브랜드 이름·로고는 넣지 말고 색과 형태만 적용해 줘",
    "- 기능·문구·동작·저장 방식은 바꾸지 마",
    "- 글자와 바탕의 대비를 충분히 유지하고, 휴대폰 화면(360px)에서도 가로로 넘치지 않게",
  );
  const more = (extra || "").trim();
  if (more) out.push("", "5. 그 밖에 바꾸고 싶은 디자인", `- ${more.replace(/\s*\n\s*/g, " / ")}`);
  return out.join("\n");
}

function applyPreview(el, style, fontId) {
  const fonts = resolveFonts(style, fontId);
  const set = (k, v) => el.style.setProperty(k, v);
  set("--p-bg", style.bg);
  set("--p-surface", style.surface);
  set("--p-text", style.text);
  set("--p-mute", style.mute);
  set("--p-border", style.border);
  set("--p-accent", style.accent);
  set("--p-on-accent", style.onAccent);
  set("--p-accent-text", style.accentText);
  set("--p-block", style.block || style.surface);
  set("--p-radius", style.radius + "px");
  set("--p-btn-radius", style.btnRadius + "px");
  set("--p-btn-size", style.btnLarge ? "19px" : "15px");
  set("--p-shadow", style.shadow);
  set("--p-bw", (style.bw || 1) + "px");
  set("--p-btn-border", style.btnBorder ? `${style.bw || 1}px solid ${style.border}` : "0");
  set("--p-btn-shadow", style.btnShadow || "none");
  set("--p-pattern", style.pattern || "none");
  set("--p-pattern-size", style.patternSize || "auto");
  set("--p-pattern-pos", style.patternPos || "0 0");
  set("--p-blur", (style.blur || 0) + "px");
  set("--p-title-shadow", style.titleGlow || "none");
  set("--p-font", stack(fonts.body));
  set("--p-title-font", stack(fonts.title));
  el.dataset.style = style.id;
}

const store = {
  get() {
    try {
      return JSON.parse(localStorage.getItem("sih26-design") || "{}");
    } catch {
      return {};
    }
  },
  set(v) {
    try {
      localStorage.setItem("sih26-design", JSON.stringify(v));
    } catch {}
  },
};

function init() {
  const grid = document.getElementById("styles");
  const preview = document.getElementById("preview");
  const fontBox = document.getElementById("fonts");
  const extra = document.getElementById("extra");
  const promptEl = document.getElementById("prompt");
  const chosen = document.getElementById("chosen");
  const copyBtn = document.getElementById("copy");
  const status = document.getElementById("copy-status");
  if (!grid) return;

  const saved = store.get();
  let styleId = byId(STYLES, saved.style) ? saved.style : "S1";
  let fontId = FONTS[saved.font] ? saved.font : "";

  for (const g of GROUPS) {
    const h = document.createElement("h3");
    h.className = "style-group";
    h.innerHTML = `${g.name} <span>${g.hint}</span>`;
    grid.append(h);
    for (const id of g.ids) {
      const s = byId(STYLES, id);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "style-card";
      b.dataset.id = s.id;
      b.setAttribute("aria-pressed", "false");
      b.innerHTML =
        `<span class="mini" aria-hidden="true" style="background:${s.bg}` +
        (s.pattern ? `;background-image:${s.pattern};background-size:${s.patternSize};background-position:${s.patternPos || "0 0"}` : "") +
        `">` +
        `<span class="mini-card" style="background:${s.block || s.surface};border:${s.bw || 1}px solid ${s.border};border-radius:${Math.min(s.radius, 10)}px;box-shadow:${s.shadow}">` +
        `<i class="mini-title" style="background:${s.text}"></i><i class="mini-line" style="background:${s.mute}"></i></span>` +
        `<i class="mini-btn" style="background:${s.accent};border-radius:${s.btnRadius >= 999 ? 999 : Math.min(s.btnRadius, 6)}px;border:${s.btnBorder ? `${s.bw || 1}px solid ${s.border}` : "0"};box-shadow:${s.btnShadow || "none"}"></i>` +
        `</span><span class="style-name"><b>${s.id}</b> ${s.name}</span><span class="style-feel">${s.feel}</span>`;
      b.addEventListener("click", () => {
        styleId = s.id;
        render();
      });
      grid.append(b);
    }
  }

  const fontChoices = [["", "스타일 기본"], ...Object.entries(FONTS).map(([id, f]) => [id, `${id} ${f.name}`])];
  for (const [id, label] of fontChoices) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "font-chip";
    b.dataset.id = id;
    b.textContent = label;
    if (id) {
      b.style.fontFamily = stack(id);
      b.title = FONTS[id].feel;
    }
    b.addEventListener("click", () => {
      fontId = id;
      render();
    });
    fontBox.append(b);
  }

  function render() {
    const s = byId(STYLES, styleId);
    applyPreview(preview, s, fontId);
    preview.classList.toggle("is-dark", !!s.dark);
    for (const b of grid.querySelectorAll(".style-card"))
      b.setAttribute("aria-pressed", String(b.dataset.id === styleId));
    for (const b of fontBox.querySelectorAll(".font-chip"))
      b.setAttribute("aria-pressed", String(b.dataset.id === fontId));
    chosen.textContent = `${s.id} ${s.name} · ${fontId ? fontId + " " + FONTS[fontId].name : "스타일 기본 글꼴"}`;
    promptEl.value = buildPrompt(s, fontId, extra.value);
    status.textContent = "";
    store.set({ style: styleId, font: fontId });
  }

  extra.addEventListener("input", () => {
    promptEl.value = buildPrompt(byId(STYLES, styleId), fontId, extra.value);
  });

  copyBtn.addEventListener("click", async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(promptEl.value);
      ok = true;
    } catch {
      promptEl.focus();
      promptEl.select();
      try {
        ok = document.execCommand("copy");
      } catch {}
    }
    status.textContent = ok
      ? "복사했어요. 수정 요청서에 붙여 넣으세요."
      : "자동 복사가 막혔어요. 글상자를 길게 눌러 전체 선택 후 복사하세요.";
  });

  render();
}

init();
