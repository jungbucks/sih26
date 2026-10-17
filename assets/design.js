// 디자인 수정 프롬프트 만들기 — ① 컬러셋(색) → ② 2026 트렌드(모양·배치·움직임·질감·글꼴)를 고르면
// 샘플 앱이 그 조합으로 바뀌고 수정 프롬프트가 완성된다. 트렌드는 고른 컬러셋 값으로 그려진다.
// 컬러셋 색은 예전 시안 30개(awesome-design-md MIT 참고 브랜드풍·design.md 4세트·시대/효과)에서 골라 다듬었다.

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
  },
  F5: {
    name: "픽셀 글꼴",
    family: "Galmuri11",
    file: "Galmuri11.woff2",
    bold: "Galmuri11-Bold.woff2",
    weight: "400",
    feel: "옛 컴퓨터·게임 화면",
  },
};


// ① 컬러셋: 색만 정한다. 모양·그림자·무늬·글꼴은 ② 트렌드가 정한다.
// 예전 시안 30개(브랜드풍·design.md 4세트·시대·효과)에서 색이 서로 잘 구별되는 것만 골라 압축했다.
// accent = 버튼 바탕, accentText = 바탕 위 강조 글자, block = 결과 카드 색 블록.
// 버튼 글자색(onAccent)은 대비가 큰 쪽(흰/먹)을 자동으로 고른다.
// dark = 다크 테크처럼 어두운 바탕이 필요한 트렌드를 고를 때 쓰는 어두운 짝.
const DARK_BASE = { bg: "#0d0f14", surface: "#161a22", text: "#f3f4f6", mute: "#a3a9b6", border: "#2a2f3a" };
export const COLORS = [
  {
    id: "C1", name: "흰 종이와 파랑", feel: "공식 문서처럼 정확하고 중립적",
    bg: "#ffffff", surface: "#f5f5f4", text: "#1a1d24", mute: "#5b606b", border: "#e2e4e9",
    accent: "#2563eb", accentText: "#2563eb", block: "#eef3ff",
    dark: { accent: "#3b82f6", accentText: "#93b4ff", block: "#17223a" },
  },
  {
    id: "C2", name: "흑백", feel: "색 없이 글자와 여백만으로 또렷하게",
    bg: "#ffffff", surface: "#f5f5f5", text: "#111111", mute: "#555555", border: "#e2e2e2",
    accent: "#111111", accentText: "#111111", block: "#eeeeee",
    dark: { accent: "#f3f4f6", accentText: "#ffffff", block: "#1f232b" },
  },
  {
    id: "C3", name: "종이와 보라", feel: "메모장 같은 흰 바탕에 보라 포인트",
    bg: "#ffffff", surface: "#f7f6f3", text: "#1a1a1a", mute: "#615d59", border: "#e9e7e4",
    accent: "#5645d4", accentText: "#5645d4", block: "#ecebfb",
    dark: { accent: "#7c6cf0", accentText: "#b4aaff", block: "#221f3d" },
  },
  {
    id: "C4", name: "크림과 테라코타", feel: "책처럼 따뜻하고 차분함",
    bg: "#faf9f5", surface: "#f3eee5", text: "#141413", mute: "#67645e", border: "#e6dfd8",
    accent: "#ad5135", accentText: "#9c4f37", block: "#f1e2d6",
    dark: { accent: "#d98a6c", accentText: "#f0b49c", block: "#33231c" },
  },
  {
    id: "C5", name: "안개와 청록", feel: "산뜻하고 기술적인 느낌",
    bg: "#f7fafa", surface: "#ecf3f2", text: "#16201f", mute: "#5a6564", border: "#dae6e5",
    accent: "#0f766e", accentText: "#0f766e", block: "#dff0ee",
    dark: { accent: "#14b8a6", accentText: "#5eead4", block: "#12302d" },
  },
  {
    id: "C6", name: "버터와 초록", feel: "차분하게 설명해 주는 따뜻함",
    bg: "#fdf9ed", surface: "#f3ead2", text: "#262114", mute: "#67635a", border: "#e6dcc0",
    accent: "#2e7d4f", accentText: "#276b43", block: "#e3f0dc",
    dark: { accent: "#3fa96b", accentText: "#86d9a6", block: "#1b2e22" },
  },
  {
    id: "C7", name: "햇살과 호박", feel: "친근하고 활기찬 워크북",
    bg: "#fdfbf6", surface: "#f5efe1", text: "#23201a", mute: "#67615a", border: "#ebe3d3",
    accent: "#b45309", accentText: "#9a4708", block: "#fbe7c6",
    dark: { accent: "#f59e0b", accentText: "#fbbf24", block: "#332611" },
  },
  {
    id: "C8", name: "분홍과 민트", feel: "말랑한 파스텔, 귀엽고 다정함",
    bg: "#fff5fa", surface: "#ffffff", text: "#3b2a4d", mute: "#6a5679", border: "#f3d6ea",
    accent: "#ffb3d1", accentText: "#b4236a", block: "#d7f5ec",
    dark: { accent: "#ffb3d1", accentText: "#ffc6dd", block: "#3a2033" },
  },
  {
    id: "C9", name: "흙과 올리브", feel: "나무·흙 같은 차분한 자연색",
    bg: "#f3ece2", surface: "#faf6ef", text: "#2f2a22", mute: "#5e5444", border: "#ddd0bd",
    accent: "#5f6b3a", accentText: "#8a4b2a", block: "#eadcc6",
    dark: { accent: "#a3b26a", accentText: "#c9d39a", block: "#2b2a1c" },
  },
  {
    id: "C10", name: "쨍한 원색", feel: "분홍·노랑이 튀는 팝 포스터",
    bg: "#f4f4f0", surface: "#ffffff", text: "#000000", mute: "#3d3d3d", border: "#000000",
    accent: "#ff90e8", accentText: "#9e0f61", block: "#ffc900",
    dark: { accent: "#ff90e8", accentText: "#ff9fe9", block: "#3a2a00" },
  },
  {
    id: "C13", name: "회색과 빨강", feel: "무채색 위 빨강 하나, 포스터처럼 단호함",
    bg: "#f2f2f0", surface: "#ffffff", text: "#111111", mute: "#555555", border: "#dcdcd8",
    accent: "#d10511", accentText: "#c00410", block: "#fde8e8",
    dark: { accent: "#f04444", accentText: "#ff8a8a", block: "#3a1717" },
  },
  {
    id: "C14", name: "하늘과 코랄", feel: "시원한 하늘색 바탕에 따뜻한 산호색",
    bg: "#f0f7fc", surface: "#ffffff", text: "#0f2a3d", mute: "#4d6475", border: "#d4e6f2",
    accent: "#c4412c", accentText: "#b03a27", block: "#ffe3dc",
    dark: { accent: "#f0735d", accentText: "#ffa999", block: "#3a221d" },
  },
  {
    id: "C15", name: "신문지와 남색", feel: "누런 신문지에 진한 남색 잉크",
    bg: "#f4f1ea", surface: "#fbf9f4", text: "#1b1b1b", mute: "#5a564e", border: "#d9d3c7",
    accent: "#1e3a8a", accentText: "#1e3a8a", block: "#e4e9f5",
    dark: { accent: "#6b8bff", accentText: "#a9bcff", block: "#1b2440" },
  },
  {
    id: "C11", name: "밤하늘과 보라", feel: "어두운 남색 바탕에 은은한 보랏빛", isDark: true,
    bg: "#0b1026", surface: "#151b38", text: "#f1f5ff", mute: "#b5bdd8", border: "#2a3358",
    accent: "#8b9cff", accentText: "#a5b4fc", block: "#1e2850",
  },
  {
    id: "C12", name: "먹과 형광 초록", feel: "까만 무대 위 초록 재생 버튼", isDark: true,
    bg: "#121212", surface: "#1c1c1c", text: "#ffffff", mute: "#b3b3b3", border: "#2e2e2e",
    accent: "#1ed760", accentText: "#1ed760", block: "#16291d",
  },
  {
    id: "C16", name: "먹과 노랑", feel: "까만 바탕에 경고등처럼 쨍한 노랑", isDark: true,
    bg: "#111111", surface: "#1c1c1a", text: "#f5f5f0", mute: "#b8b6ad", border: "#33322d",
    accent: "#ffd600", accentText: "#ffd600", block: "#2a2610",
  },
];

// WCAG 대비
function lum(hex) {
  const v = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// 트렌드가 어두운 바탕을 원하면(needDark) 밝은 컬러셋을 어두운 짝으로 바꾼다.
export function resolveColors(color, trend) {
  const useDark = !!(trend && trend.needDark && !color.isDark);
  const c = useDark ? { ...color, ...DARK_BASE, ...color.dark, isDark: true } : { ...color };
  c.onAccent = contrast("#ffffff", c.accent) >= contrast("#111111", c.accent) ? "#ffffff" : "#111111";
  c.btnLarge = contrast(c.onAccent, c.accent) < 4.5;
  c.flipped = useDark;
  return c;
}

// ② 2026 홈페이지 트렌드 13종(교사 제공 trend-webdesign 지침) + 기본.
// 트렌드가 모양 토큰(모서리·테두리·그림자·무늬·글꼴)과 배치·움직임 기법을 정하고, 색은 ① 컬러셋 값을 받는다.
// 홈페이지용 '업종' 추천은 학생 작품 종류로 옮겨 적었다. 원칙: 가독성(4.5:1) 우선, 움직임은 prefers-reduced-motion에서 멈춤, 360px 확인.
// shape(c)·lines(c)의 c = 고른 컬러셋(어두운 짝으로 바뀐 뒤의 값).
export const TRENDS = [
  {
    id: "T00", name: "기본", pos: "", def: "둥근 카드, 그림자 없는 깔끔한 화면",
    scope: "화면 전체", fits: "어떤 작품이든", avoid: "",
    font: "F1",
    shape: () => ({ radius: 12, btnRadius: 10, shadow: "none" }),
    lines: () => [],
  },
  {
    id: "T01", name: "리퀴드 글래스", pos: "가장 새로움", scope: "버튼·떠 있는 요소만",
    def: "두께감과 가장자리 빛 반사가 있는 반투명 유리",
    fits: "뽑기·타이머처럼 버튼이 주인공인 앱", avoid: "글을 오래 읽는 화면(유리 뒤 글자가 흐려져요)",
    font: "F1", motion: true,
    shape: () => ({ radius: 20, btnRadius: 999, shadow: "0 4px 16px rgba(0,0,0,.06)" }),
    lines: (c) => [
      "- 버튼과 화면 아래쪽에 떠 있는 도구 막대에만 적용하고, 글이 많은 카드와 입력칸은 불투명하게 둬",
      `- 유리: background: color-mix(in srgb, ${c.surface} 45%, transparent); backdrop-filter: blur(12px) saturate(160%); border: 1px solid rgba(255,255,255,.6);`,
      "- 두께감: box-shadow: inset 0 1px 0 rgba(255,255,255,.75), inset 0 -1px 0 rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.12);",
      `- 유리 뒤가 비쳐 보이도록 페이지 바탕에 강조색 ${c.accent}을 번진 둥근 빛 1~2개(radial-gradient)로 깔아 줘. 글자 아래로 오는 빛은 투명도 12% 이하, 글자 없는 구석만 30%까지`,
      "- 버튼을 누르는 동안(:active) 살짝 눌리게(scale .97). 유리 위 글자는 바탕과 대비 4.5:1 이상",
    ],
    dont: "모든 카드를 유리로 만들기, 글자 뒤에 강한 무늬 깔기",
  },
  {
    id: "T02", name: "벤토 그리드", pos: "이미 흔함", scope: "결과·요약 영역",
    def: "크기가 다른 둥근 칸이 도시락처럼 맞물린 격자",
    fits: "계획표·기록장·대시보드처럼 보여 줄 숫자가 여러 개인 앱", avoid: "결과가 하나뿐인 앱(칸이 비어 보여요)",
    font: "F1",
    shape: () => ({ radius: 18, btnRadius: 12, shadow: "0 1px 3px rgba(0,0,0,.06)" }),
    lines: () => [
      "- 결과·요약 영역을 CSS grid로 바꿔 크기가 다른 칸 3~5개로 나눠 줘 (가장 중요한 숫자 = 2칸 크기, 나머지 = 1칸)",
      "- 칸 모서리는 모두 18px, 칸 사이 간격도 모두 12px. 바깥 테두리가 직사각형으로 딱 맞아야 해",
      "- 칸 하나에는 내용 하나만: 작은 이름표 + 큰 숫자 또는 짧은 목록",
      "- 휴대폰(360px)에서는 2열 → 1열로 자연스럽게 내려오게",
    ],
    dont: "빈 칸 만들기, 칸마다 다른 모서리·간격 쓰기",
  },
  {
    id: "T03", name: "다크 테크", pos: "이미 흔함", scope: "화면 전체",
    def: "거의 검은 바탕에 은은한 빛, 결과 화면이 주인공",
    fits: "시뮬레이터·게임·계산 결과를 보여 주는 앱", avoid: "식단·건강·생활 앱(차갑게 느껴져요)",
    font: "F1", needDark: true,
    shape: (c) => ({ radius: 12, btnRadius: 8, shadow: `0 0 0 1px ${c.border}` }),
    lines: (c) => [
      "- 카드 위쪽 가장자리에만 1px 밝은 선(inset 0 1px 0 rgba(255,255,255,.08))",
      `- 가장 중요한 결과 카드 뒤에만 강조색의 은은한 빛: box-shadow: 0 0 48px color-mix(in srgb, ${c.accent} 30%, transparent);`,
      "- 화면 맨 위 제목 뒤에 아주 옅은 빛 번짐(radial-gradient, 투명도 18% 이하) 하나. 빛은 2곳을 넘기지 마",
      "- 숫자는 font-variant-numeric: tabular-nums; 로 폭을 맞춰 계기판처럼",
    ],
    dont: "네온을 여기저기 쓰기, 회색 글자를 너무 어둡게(대비 4.5:1 아래로) 두기",
  },
  {
    id: "T04", name: "에디토리얼", pos: "떠오름", scope: "화면 전체",
    def: "잡지 지면처럼 큰 명조 제목, 넉넉한 여백, 가는 줄",
    fits: "다이어리·추천·소개·읽을거리 앱", avoid: "빨리 눌러야 하는 게임·계산기(정보가 느리게 읽혀요)",
    font: "F1", titleFont: "F3",
    shape: () => ({ radius: 0, btnRadius: 2, shadow: "none", boxless: "1px 가는 줄" }),
    lines: (c) => [
      "- 제목(h1)은 명조로 크게(36~44px), 줄 간격 1.2. 제목 위에 작은 머리말(13px, 자간 넓게)을 한 줄",
      "- 여백은 지금의 1.5배로 넉넉하게",
      "- 핵심 결과 숫자는 명조로 크게, 설명은 본문 글꼴로 작게 — 잡지의 큰 인용구처럼",
      "- 왼쪽 정렬, 한 줄 길이는 40자 안팎으로 제한(max-width)",
    ],
    dont: "명조를 본문 작은 글씨까지 쓰기, 가운데 정렬 남발",
  },
  {
    id: "T05", name: "키네틱 타이포", pos: "떠오름", scope: "첫 화면 제목 한 곳",
    def: "아주 큰 글자가 움직이며 주인공이 되는 화면",
    fits: "퀴즈·게임 시작 화면, 결과 발표 화면", avoid: "정보를 차분히 읽어야 하는 도구(산만해요)",
    font: "F1", titleFont: "F4", motion: true,
    shape: () => ({ radius: 8, btnRadius: 999, shadow: "none" }),
    lines: (c) => [
      `- 제목 아래에 작품 이름을 아주 크게(40px 이상, 굵게, ${c.accentText}) 반복한 띠 하나를 두고 왼쪽으로 천천히 흐르게(15초 한 바퀴, CSS animation)`,
      "- 핵심 결과 숫자가 바뀔 때 아래에서 위로 한 번 올라오며 나타나게(0.4초)",
      "- 움직이는 곳은 이 두 곳뿐. 버튼·목록·입력칸은 가만히",
      "- 흐르는 띠는 장식이니 aria-hidden=\"true\"",
    ],
    dont: "여러 줄이 동시에 움직이기, 글자가 읽기 전에 사라지기",
  },
  {
    id: "T06", name: "스크롤 3D", pos: "떠오름", scope: "목록 한 곳 (축소판)",
    def: "스크롤하면 장면이 입체로 움직이는 화면",
    fits: "단계별 설명·카드 넘기기 앱", avoid: "한 파일 작품 대부분(진짜 3D는 무겁고 손이 많이 가요)",
    font: "F1", motion: true,
    shape: () => ({ radius: 16, btnRadius: 12, shadow: "0 10px 30px rgba(0,0,0,.12)" }),
    lines: () => [
      "- 진짜 3D 장면 대신 축소판으로: 목록 카드가 화면에 들어올 때 뒤로 눕혀 있다가(rotateX(25deg)) 똑바로 서며 다가오게",
      "- 부모에 perspective: 900px; 카드는 IntersectionObserver로 화면에 들어오면 클래스를 붙여 transform 0.5초 전환",
      "- 외부 라이브러리(three.js 등) 쓰지 마. CSS transform만",
      "- 휴대폰에서는 기울기 각도를 절반으로",
    ],
    dont: "버튼·입력칸까지 기울이기, 스크롤해야만 내용이 보이게 만들기",
  },
  {
    id: "T07", name: "그레이니 그라데이션", pos: "범용 기법", scope: "페이지 바탕만",
    def: "번진 색 위에 필름 같은 자글자글한 입자",
    fits: "명상·감성 기록·운세·날씨 앱", avoid: "글자 바로 뒤(입자가 글자를 지저분하게 해요)",
    font: "F2",
    shape: () => ({ radius: 16, btnRadius: 999, shadow: "none" }),
    lines: (c) => [
      `- 페이지 바탕에 강조색 ${c.accent}와 ${c.block}를 크게 번진 radial-gradient 2~3개로 깔아 줘. 글자 아래로 오는 번짐은 투명도 12% 이하, 글자 없는 구석은 40%까지`,
      "- 그 위에 입자: SVG feTurbulence(baseFrequency .8) 노이즈를 data URI로 만들어 background-image에 겹치고 투명도 .10~.15",
      "- 카드·입력칸 안에는 입자를 넣지 말고 깨끗한 바탕 유지",
    ],
    dont: "입자를 진하게, 무지개처럼 색 여러 개 섞기",
  },
  {
    id: "T08", name: "네오 브루탈리즘", pos: "한풀 꺾임", scope: "카드·버튼",
    def: "굵은 테두리, 번지지 않는 딱딱한 그림자, 쨍한 색",
    fits: "퀴즈·코딩 연습·이벤트 앱", avoid: "건강·돈 관련 앱(믿음이 덜 가 보여요)",
    font: "F1",
    shape: (c) => ({ radius: 6, btnRadius: 6, bw: 3, borderColor: c.text, btnBorder: true, shadow: `4px 4px 0 ${c.text}`, btnShadow: `4px 4px 0 ${c.text}` }),
    lines: () => [
      "- 그림자는 번지지 않게(blur 0). 버튼을 누르면(:active) 그림자만큼 이동: transform: translate(4px,4px); box-shadow: none;",
      "- 결과 카드 하나는 색 블록 바탕으로 크게",
    ],
    dont: "그림자를 흐리게(blur) 만들기, 테두리 굵기를 곳곳마다 다르게",
  },
  {
    id: "T09", name: "맥시멀리즘", pos: "취향 따라", scope: "화면 전체 (놀이용 앱만)",
    def: "강한 색·스티커·무늬를 빼곡히 겹친 풍성함",
    fits: "뽑기·꾸미기·파티 게임 앱", avoid: "계획표·계산기·정보 안내(정신없어 보여요)",
    font: "F2", titleFont: "F4",
    shape: (c) => ({ radius: 16, btnRadius: 999, bw: 2, borderColor: c.text, btnBorder: true, shadow: `3px 3px 0 ${c.text}`, btnShadow: `3px 3px 0 ${c.text}` }),
    lines: (c) => [
      `- 페이지 바탕에 굵은 사선 줄무늬(repeating-linear-gradient, ${c.block}와 바탕색, 줄 폭 14px)`,
      "- 제목 옆에 기울어진 스티커 2개(예: 'NEW!', '★ 오늘'): 둥근 배지, -8deg/6deg 회전, 장식이라 aria-hidden=\"true\"",
      "- 결과 카드는 -1.5deg 기울이고, 목록 항목은 번갈아 ±0.6deg",
      "- 그래도 제목·본문 글자 뒤는 단색으로 두고 대비 4.5:1 유지. 버튼 크기·위치는 그대로",
    ],
    dont: "글자 뒤에 무늬 깔기, 스티커로 버튼 가리기",
  },
  {
    id: "T10", name: "레트로 픽셀", pos: "떠오름", scope: "제목·숫자·버튼 포인트",
    def: "8비트 게임 같은 도트 글자와 각진 그림",
    fits: "게임·기록 앱의 제목, 점수판", avoid: "본문 전체(작은 도트 글자는 읽기 힘들어요)",
    font: "F1", titleFont: "F5",
    shape: (c) => ({ radius: 0, btnRadius: 0, bw: 2, borderColor: c.text, shadow: `3px 3px 0 ${c.text}` }),
    lines: (c) => [
      "- 픽셀 글꼴(갈무리)은 제목(h1·h2)과 점수·결과 숫자에만, 본문은 고딕 유지",
      `- 제목은 보통 굵기(400)로, 계단 그림자: text-shadow: 2px 2px 0 color-mix(in srgb, ${c.accent} 45%, transparent);`,
      "- 아이콘은 이모지 대신 작은 도트 그림(SVG rect 격자, shape-rendering: crispEdges)으로 1~3개",
      `- 버튼 테두리를 계단 모양으로: box-shadow: 0 -2px 0 ${c.text}, 0 2px 0 ${c.text}, -2px 0 0 ${c.text}, 2px 0 0 ${c.text};`,
    ],
    dont: "16px보다 작은 글자에 픽셀 글꼴 쓰기",
  },
  {
    id: "T11", name: "스위스 스타일", pos: "유행 무관 기본기", scope: "화면 전체",
    def: "엄격한 격자, 굵은 고딕, 장식 없음",
    fits: "계산기·시간표·정보 정리 도구", avoid: "다정해야 하는 앱(차갑고 딱딱해요)",
    font: "F1",
    shape: () => ({ radius: 0, btnRadius: 0, shadow: "none", boxless: "2px 가로줄" }),
    lines: (c) => [
      "- 12칸 격자를 정하고 모든 요소의 왼쪽 끝을 격자선에 맞춰 줘. 가운데 정렬 금지",
      "- 제목은 아주 굵고 크게(40px 이상), 자간 -0.02em. 나머지 글자 크기는 3단계만",
      "- 목록 앞에 01·02·03 번호를 굵게",
      "- 강조색은 한 곳(가장 중요한 버튼)에만",
    ],
    dont: "그림자·그라데이션·아이콘 장식 넣기",
  },
  {
    id: "T12", name: "클레이모피즘", pos: "한풀 꺾임", scope: "버튼·체크·결과 카드",
    def: "찰흙처럼 말랑하고 통통한 덩어리",
    fits: "어린이·반려동물·습관 만들기 앱", avoid: "진지한 정보 도구(유치해 보일 수 있어요)",
    font: "F2",
    shape: (c) => ({
      radius: 24, btnRadius: 999, shadow: "none",
      btnShadow: `6px 8px 18px color-mix(in srgb, ${c.accent} 30%, transparent), inset -3px -3px 6px rgba(0,0,0,.18), inset 3px 3px 6px rgba(255,255,255,.35)`,
    }),
    lines: (c) => [
      `- 버튼·체크박스·결과 카드만 통통하게: border-radius 24px 이상, box-shadow: 8px 10px 20px color-mix(in srgb, ${c.accent} 25%, transparent), inset -4px -4px 8px rgba(0,0,0,.08), inset 4px 4px 8px rgba(255,255,255,.7);`,
      "- 체크박스는 동그란 말랑 버튼으로, 체크하면 살짝 눌린 모양(inset 그림자 반대로)",
      "- 목록·입력칸은 평평하게 두어 덩어리가 돋보이게",
    ],
    dont: "모든 요소를 부풀리기, 글자에 그림자 넣기",
  },
  {
    id: "T13", name: "Y2K 크롬", pos: "한풀 꺾임", scope: "배너 한 줄 전용",
    def: "크롬 금속 글자, 홀로그램, 반짝이",
    fits: "이벤트·챌린지·음악 앱의 알림 띠", avoid: "화면 전체(배너로만 써야 촌스럽지 않아요)",
    font: "F2",
    shape: (c) => ({ radius: 24, btnRadius: 999, shadow: "none", btnShadow: `inset 0 2px 0 rgba(255,255,255,.45), 0 4px 12px color-mix(in srgb, ${c.accent} 35%, transparent)` }),
    lines: (c) =>
      c.isDark
        ? [
            "- 화면 맨 위에 배너 한 줄만 추가: 페이지가 어두우니 배너 바탕을 크롬 금속으로 — background: linear-gradient(180deg,#f5f7fa 0%,#b8c0cc 48%,#8d96a3 52%,#e9edf2 100%);",
            "- 배너 글자는 작품의 핵심 문구를 #111111 굵게(대비 충분)",
            "- 양 끝에 반짝이 ✦ 두 개(장식, aria-hidden). 배너 밖 화면은 위 2번 모양 그대로",
          ]
        : [
            "- 화면 맨 위에 배너 한 줄만 추가: 어두운 바탕(#111111) 위에 작품의 핵심 문구를 크롬 글자로",
            "- 크롬 글자: background: linear-gradient(180deg,#fff 0%,#b8c0cc 45%,#5b6472 50%,#e9edf2 100%); -webkit-background-clip: text; color: transparent;",
            "- 양 끝에 반짝이 ✦ 두 개(장식, aria-hidden). 배너 밖 화면은 위 2번 모양 그대로",
          ],
    dont: "버튼·본문까지 크롬으로, 밝은 바탕 위에 크롬 글자 쓰기(안 읽혀요)",
  },
];

const byId = (list, id) => list.find((x) => x.id === id);

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
  `"${FONTS[id].family}", ${id === "F3" ? "serif" : "sans-serif"}`;

export function buildPrompt(color, trend, extra) {
  const c = resolveColors(color, trend);
  const sh = trend.shape(c);
  const fonts = { body: trend.font, title: trend.titleFont || trend.font };
  const ids = [...new Set([fonts.body, fonts.title])];
  const shape = (r) => (r >= 999 ? "알약 모양(완전히 둥글게)" : r === 0 ? "각지게(0px)" : `${r}px`);
  let n = 0;
  const sec = (t) => `${++n}. ${t}`;
  const isBase = trend.id === "T00";
  const out = [
    "[디자인 수정 요청]",
    `선택: 컬러셋 ${color.id} ${color.name}` + (c.flipped ? "(어두운 바탕)" : "") + ` · 트렌드 ${isBase ? "없음(기본)" : `${trend.id} ${trend.name}`}`,
    `분위기: ${c.flipped ? `'${color.name}' 색을 어두운 바탕으로 바꾼 화면` : color.feel}` + (isBase ? "" : ` + ${trend.def}`),
    "",
    sec(
      isBase
        ? "색 (이 값만 쓰고 다른 색은 더하지 마)"
        : "색 (이 값만 써. 3번 트렌드 기법에 적힌 효과용 색 — 그림자·빛·유리·무늬·배너 — 만 예외)",
    ),
    `- 페이지 바탕 ${c.bg}, 카드·입력칸 바탕 ${c.surface}, 테두리 ${c.border}`,
    `- 글자 ${c.text}, 보조 글자 ${c.mute}`,
    `- 강조색 ${c.accent} (버튼 글자 ${c.onAccent}) — 가장 중요한 버튼과 핵심 결과 한두 곳에만`,
  ];
  if (c.btnLarge) out.push("- 강조색 버튼의 글자는 19px 이상 굵게 (이 색 위 글자는 큰 글자여야 읽기 쉬워요)");
  if (c.accentText !== c.accent) out.push(`- 바탕 위에 강조 글자를 쓸 때는 ${c.accentText}`);
  out.push(`- 결과·요약 카드 하나에 색 블록 ${c.block}를 써도 좋아`);
  const bw = sh.bw || 1;
  out.push("", sec("모양"), `- 카드 모서리 ${shape(sh.radius)}, 버튼 모서리 ${shape(sh.btnRadius)}`);
  if (sh.boxless)
    out.push(
      `- 목록·결과는 상자(테두리·바탕) 없이 항목 사이 ${sh.boxless}(${sh.boxless.startsWith("2") ? c.text : c.border})로만 나눠. 입력칸만 1px ${c.border} 테두리`,
    );
  else out.push(`- 카드·입력칸 테두리 ${bw}px ${sh.borderColor || c.border}`);
  out.push(`- 카드 그림자: ${sh.shadow === "none" ? "쓰지 않기" : sh.shadow}`);
  if (sh.btnBorder) out.push(`- 버튼에도 ${bw}px ${sh.borderColor || c.border} 테두리`);
  if (sh.btnShadow) out.push(`- 버튼 그림자: ${sh.btnShadow}`);
  if (!isBase) {
    out.push(
      "",
      sec(`2026 트렌드 기법: ${trend.name} — ${trend.def}`),
      `- 적용 범위: ${trend.scope}. 위의 색·모양 값을 그대로 쓰면서 이 기법을 더해 줘. 2번 모양과 겹치는 곳은 이 3번이 우선이야`,
      ...trend.lines(c),
      `- 하지 말 것: ${trend.dont}`,
    );
    if (trend.motion)
      out.push("- 움직임은 @media (prefers-reduced-motion: reduce)에서 멈추고, 멈춘 상태로도 화면이 완성돼 보이게");
    out.push("- 빛·무늬·유리 위에 올라간 글자(보조 글자 포함)도 대비 4.5:1 이상. 모자라면 효과를 더 옅게");
  }
  out.push(
    "",
    sec("글꼴 (전시판 공용 글꼴 — 아래 CSS를 그대로 넣어 줘)"),
    ...ids.flatMap(fontFace),
    `- 본문: font-family: ${stack(fonts.body)};`,
  );
  if (fonts.title !== fonts.body) out.push(`- 제목(h1·h2): font-family: ${stack(fonts.title)};`);
  out.push(
    "- 글꼴을 못 불러와도 기본 글꼴로 정상 작동해야 해",
    "",
    sec("지킬 것"),
    "- 기능·문구·동작·저장 방식은 바꾸지 마",
    "- 글자와 바탕의 대비를 충분히 유지하고, 휴대폰 화면(360px)에서도 가로로 넘치지 않게",
  );
  const more = (extra || "").trim();
  if (more) out.push("", sec("그 밖에 바꾸고 싶은 디자인"), `- ${more.replace(/\s*\n\s*/g, " / ")}`);
  return out.join("\n");
}

function applyPreview(el, color, trend) {
  const c = resolveColors(color, trend);
  const sh = trend.shape(c);
  const set = (k, v) => el.style.setProperty(k, v);
  set("--p-bg", c.bg);
  set("--p-surface", c.surface);
  set("--p-text", c.text);
  set("--p-mute", c.mute);
  set("--p-border", sh.borderColor || c.border);
  set("--p-accent", c.accent);
  set("--p-on-accent", c.onAccent);
  set("--p-accent-text", c.accentText);
  set("--p-block", c.block);
  set("--p-radius", sh.radius + "px");
  set("--p-btn-radius", sh.btnRadius + "px");
  set("--p-btn-size", c.btnLarge ? "19px" : "15px");
  set("--p-shadow", sh.shadow);
  set("--p-bw", (sh.bw || 1) + "px");
  set("--p-btn-border", sh.btnBorder ? `${sh.bw || 1}px solid ${sh.borderColor || c.border}` : "0");
  set("--p-btn-shadow", sh.btnShadow || "none");
  set("--p-font", stack(trend.font));
  set("--p-title-font", stack(trend.titleFont || trend.font));
  el.dataset.trend = trend.id;
  el.classList.toggle("is-dark", !!c.isDark);
}

const store = {
  get() {
    try {
      localStorage.removeItem("sih26-design");
      return JSON.parse(localStorage.getItem("sih26-design-v2") || "{}");
    } catch {
      return {};
    }
  },
  set(v) {
    try {
      localStorage.setItem("sih26-design-v2", JSON.stringify(v));
    } catch {}
  },
};

// 견본: 컬러셋 카드는 그 색의 미니 화면, 트렌드 카드는 '지금 고른 색'으로 그 트렌드 모양을 그린다.
const MINI_EXTRA = {
  T02: '<span class="mini-bento"><b></b><b></b><b></b></span>',
  T05: '<span class="mini-kin">오늘 할 일 오늘</span>',
  T09: '<span class="mini-sticker"></span>',
  T11: '<span class="mini-swiss"><b>01</b><b>02</b><b>03</b></span>',
  T13: '<span class="mini-banner"><b></b></span>',
};
function miniHtml(c, sh, tid = "T00") {
  const bw = sh.bw || 1;
  const vars =
    `--m-surface:${c.surface};--m-text:${c.text};--m-mute:${c.mute};--m-border:${sh.borderColor || c.border};` +
    `--m-accent:${c.accent};--m-accent-text:${c.accentText};--m-block:${c.block}`;
  return (
    `<span class="mini m-${tid}${c.isDark ? " m-dark" : ""}" aria-hidden="true" style="background-color:${c.bg};${vars}">` +
    (MINI_EXTRA[tid] || "") +
    `<span class="mini-card" style="background:${c.surface};border:${bw}px solid ${sh.borderColor || c.border};border-radius:${Math.min(sh.radius, 10)}px;box-shadow:${sh.shadow}">` +
    `<i class="mini-title" style="background:${c.text}"></i><i class="mini-line" style="background:${c.mute}"></i></span>` +
    `<i class="mini-btn" style="background:${c.accent};border-radius:${sh.btnRadius >= 999 ? 999 : Math.min(sh.btnRadius, 6)}px;` +
    `border:${sh.btnBorder ? `${bw}px solid ${sh.borderColor || c.border}` : "0"};box-shadow:${sh.btnShadow || "none"}"></i></span>`
  );
}

function init() {
  const colorBox = document.getElementById("colors");
  const trendBox = document.getElementById("trends");
  const trendInfo = document.getElementById("trend-info");
  const preview = document.getElementById("preview");
  const extra = document.getElementById("extra");
  const promptEl = document.getElementById("prompt");
  const chosen = document.getElementById("chosen");
  const copyBtn = document.getElementById("copy");
  const status = document.getElementById("copy-status");
  const dock = document.getElementById("pv-dock");
  const mini = document.getElementById("preview-mini");
  if (!colorBox) return;

  const syncDock = () => {
    mini.innerHTML = preview.innerHTML;
    mini.style.cssText = preview.style.cssText;
    mini.className = preview.className + " pv-mini";
    mini.dataset.trend = preview.dataset.trend;
  };
  let previewOnScreen = false;
  let touched = false; // 처음 열었을 때는 숨기고, 학생이 한 번 고른 뒤부터 보여 준다
  const showDock = () => (dock.hidden = previewOnScreen || !touched);
  if ("IntersectionObserver" in window)
    new IntersectionObserver((es) => {
      previewOnScreen = es[0].isIntersecting;
      showDock();
    }).observe(preview);
  document.getElementById("pv-dock-frame").addEventListener("click", () => preview.scrollIntoView({ block: "center" }));
  const fold = document.getElementById("pv-dock-fold");
  fold.addEventListener("click", () => {
    const folded = dock.classList.toggle("is-folded");
    fold.textContent = folded ? "펼치기" : "접기";
    fold.setAttribute("aria-expanded", String(!folded));
  });

  const saved = store.get();
  let colorId = byId(COLORS, saved.color) ? saved.color : "C1";
  let trendId = byId(TRENDS, saved.trend) ? saved.trend : "T00";
  if (typeof saved.extra === "string") extra.value = saved.extra.slice(0, 500);

  for (const [label, dark] of [["밝은 바탕", false], ["어두운 바탕", true]]) {
    const h = document.createElement("h3");
    h.className = "style-group";
    h.textContent = label;
    colorBox.append(h);
    for (const col of COLORS.filter((x) => !!x.isDark === dark)) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "style-card";
      b.dataset.id = col.id;
      b.innerHTML =
        miniHtml(resolveColors(col), TRENDS[0].shape()) +
        `<span class="style-name">${col.name}</span><span class="style-feel">${col.feel}</span>`;
      b.addEventListener("click", () => {
        colorId = col.id;
        render();
      });
      colorBox.append(b);
    }
  }

  for (const t of TRENDS) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "trend-card";
    b.dataset.id = t.id;
    b.innerHTML =
      `<span class="trend-mini" aria-hidden="true"></span>` +
      `<span class="trend-name">${t.name}</span>` +
      (t.pos ? `<span class="trend-pos">${t.pos}</span>` : "") +
      `<span class="trend-def">${t.def}</span>`;
    b.addEventListener("click", () => {
      trendId = t.id;
      render();
    });
    trendBox.append(b);
  }

  function renderTrendInfo(col, t) {
    trendInfo.hidden = t.id === "T00";
    if (trendInfo.hidden) return;
    const note =
      t.needDark && !col.isDark
        ? `<p class="trend-note">이 트렌드는 어두운 바탕이 필요해서 '${col.name}'의 어두운 짝으로 바꿔 보여 줘요.</p>`
        : "";
    trendInfo.innerHTML =
      `<p class="trend-title"><b>${t.name}</b> · 2026년 위치: ${t.pos}</p>` +
      `<dl><dt>쓰는 곳</dt><dd>${t.scope}</dd><dt>어울리는 작품</dt><dd>${t.fits}</dd>` +
      `<dt>피할 곳</dt><dd>${t.avoid}</dd></dl>` +
      note;
  }

  function render() {
    const col = byId(COLORS, colorId);
    const t = byId(TRENDS, trendId);
    applyPreview(preview, col, t);
    renderTrendInfo(col, t);
    for (const b of colorBox.querySelectorAll(".style-card"))
      b.setAttribute("aria-pressed", String(b.dataset.id === colorId));
    for (const b of trendBox.querySelectorAll(".trend-card")) {
      const tt = byId(TRENDS, b.dataset.id);
      const c = resolveColors(col, tt);
      b.querySelector(".trend-mini").innerHTML = miniHtml(c, tt.shape(c), tt.id);
      b.setAttribute("aria-pressed", String(b.dataset.id === trendId));
    }
    chosen.textContent = `${col.name} · ${t.id === "T00" ? "트렌드 없음(기본)" : t.name}`;
    promptEl.value = buildPrompt(col, t, extra.value);
    status.textContent = "";
    store.set({ color: colorId, trend: trendId, extra: extra.value });
    syncDock();
  }
  const pick = () => {
    touched = true;
    showDock();
  };
  colorBox.addEventListener("click", pick);
  trendBox.addEventListener("click", pick);

  extra.addEventListener("input", () => {
    promptEl.value = buildPrompt(byId(COLORS, colorId), byId(TRENDS, trendId), extra.value);
    store.set({ color: colorId, trend: trendId, extra: extra.value });
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

if (typeof document !== "undefined") init();
