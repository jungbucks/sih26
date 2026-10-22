import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { parse } from "parse5";
export const MAX_BYTES = 2 * 1024 * 1024;
export const limits = {
  title: 100,
  description: 300,
  class: 40,
  status: 10,
  changes: 500,
};
// 진행 단계: PRD → 1~5회 개선 (이전 값도 호환)
export const STATUSES = [
  "",
  "PRD",
  "1회 개선",
  "2회 개선",
  "3회 개선",
  "4회 개선",
  "5회 개선",
  "첫 버전",
  "개선 중",
  "개선 완료",
];
export function normalize(v) {
  return v.replace(/\s+/gu, " ").trim();
}
export async function metadata(root) {
  let raw;
  try {
    raw = await fs.readFile(path.join(root, "project-meta.json"), "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return {};
    throw e;
  }
  const m = JSON.parse(raw);
  if (!m || Array.isArray(m) || typeof m !== "object")
    throw Error("project-meta.json: 객체여야 합니다.");
  for (const [id, entry] of Object.entries(m)) {
    if (
      !/^\d{5}$/.test(id) ||
      !entry ||
      Array.isArray(entry) ||
      typeof entry !== "object"
    )
      throw Error(`잘못된 메타 구조: ${id}`);
    for (const [k, v] of Object.entries(entry)) {
      if (!Object.hasOwn(limits, k) || typeof v !== "string")
        throw Error(`잘못된 메타 필드: ${id}.${k}`);
      entry[k] = normalize(v);
      if ([...entry[k]].length > limits[k])
        throw Error(`메타 길이 초과: ${id}.${k}`);
      if (
        k === "status" &&
        !STATUSES.includes(entry[k])
      )
        throw Error(`잘못된 진행 상태: ${id}`);
    }
  }
  return m;
}
// AI 검토 의견: feedback.json { 학번: { stage, items: [{ title, body }] } }
export const FEEDBACK_LIMITS = { items: 3, title: 60, body: 300 };
export async function feedback(root) {
  let raw;
  try {
    raw = await fs.readFile(path.join(root, "feedback.json"), "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return {};
    throw e;
  }
  const f = JSON.parse(raw);
  if (!f || Array.isArray(f) || typeof f !== "object")
    throw Error("feedback.json: 객체여야 합니다.");
  const out = {};
  for (const [id, entry] of Object.entries(f)) {
    const bad = (why) => Error(`잘못된 검토 의견: ${id} (${why})`);
    if (!/^\d{5}$/.test(id) || !entry || typeof entry !== "object")
      throw bad("구조");
    const stage = normalize(String(entry.stage ?? ""));
    if (typeof entry.stage !== "string" || !STATUSES.includes(stage))
      throw bad("stage");
    const items = entry.items;
    if (
      !Array.isArray(items) ||
      items.length < 1 ||
      items.length > FEEDBACK_LIMITS.items
    )
      throw bad("items 1~3개");
    if (entry.design !== undefined && typeof entry.design !== "boolean")
      throw bad("design");
    out[id] = {
      stage,
      // 디자인 라운드 의견이면 true → "2회 개선 [디자인] 기준"
      ...(entry.design && { design: true }),
      items: items.map((it) => {
        if (!it || typeof it.title !== "string" || typeof it.body !== "string")
          throw bad("title·body 문자열");
        const title = normalize(it.title),
          body = normalize(it.body);
        if (!title || [...title].length > FEEDBACK_LIMITS.title)
          throw bad("title 길이");
        if ([...body].length > FEEDBACK_LIMITS.body) throw bad("body 길이");
        return { title, body };
      }),
    };
  }
  return out;
}
// 제작 기록: 학생 index.html의 Git 커밋을 오래된 순으로 읽어, 같은 진행 단계(status)가
// 이어지는 커밋을 한 버전(V1, V2…)으로 묶는다. 단계가 없는 커밋은 다음 버전에 합친다.
// <meta name="design">이 처음 붙은 커밋은 단계가 같아도 새 버전으로 나눈다.
function git(root, args) {
  return execFileSync(
    "git",
    ["-c", `safe.directory=${path.resolve(root)}`, "-C", root, ...args],
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 8 * MAX_BYTES },
  );
}
export function history(root, id) {
  const file = `${id}/index.html`;
  let commits;
  try {
    commits = git(root, ["log", "--format=%H %cI", "--", file])
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => line.split(" "))
      .reverse();
  } catch {
    return [];
  }
  const versions = [];
  let pending = [];
  for (const [hash, at] of commits) {
    let stage = "",
      design = false;
    try {
      const raw = extract(git(root, ["show", `${hash}:${file}`]));
      const s = normalize(raw.status || "");
      if (STATUSES.includes(s)) stage = s;
      design = !!designOf(raw.design);
    } catch {}
    pending.push(at);
    if (!stage) continue;
    // 단계가 같아도 디자인 표시가 새로 붙으면 별도 버전 (예: 2회 개선 → 2회 개선 · 디자인)
    const last = versions.at(-1);
    if (last && last.stage === stage && !!last.design === design) last.updatedAt = at;
    else
      versions.push({ stage, ...(design && { design }), createdAt: pending[0], updatedAt: at });
    pending = [];
  }
  // 마지막 커밋들에 단계가 없으면 직전 버전의 수정으로 본다
  if (pending.length) {
    const last = versions.at(-1);
    if (last) last.updatedAt = pending.at(-1);
    else versions.push({ stage: "", createdAt: pending[0], updatedAt: pending.at(-1) });
  }
  return versions.map((v, i) => ({ version: `V${i + 1}`, ...v }));
}
export function designOf(v) {
  const text = normalize(v || "");
  if (!text) return null;
  const accent = (text.match(/#[0-9a-f]{6}\b/i) || [""])[0].toLowerCase();
  const label = [...normalize(text.replace(/·?\s*#[0-9a-f]{6}\b/gi, "").replace(/[·\s]+$/u, ""))]
    .slice(0, 60)
    .join("");
  return { label: label || "디자인 개선", accent: accent || null };
}
function extract(html) {
  const out = {};
  const text = (n) => (n.value || "") + (n.childNodes || []).map(text).join("");
  function walk(n) {
    if (n.tagName === "title" && !out.title) out.title = text(n);
    if (n.tagName === "meta") {
      const a = Object.fromEntries(n.attrs.map((x) => [x.name, x.value]));
      if (["description", "class", "status", "design"].includes(a.name?.toLowerCase()))
        out[a.name.toLowerCase()] = a.content || "";
    }
    for (const c of n.childNodes || []) walk(c);
  }
  walk(parse(html));
  return out;
}
export async function catalog(root) {
  const overrides = await metadata(root),
    reviews = await feedback(root),
    projects = [],
    excluded = [];
  for (const ent of (await fs.readdir(root, { withFileTypes: true })).sort(
    (a, b) => a.name.localeCompare(b.name),
  )) {
    if (!/^\d{5}$/.test(ent.name)) continue;
    const id = ent.name,
      file = path.join(root, id, "index.html");
    if (!ent.isDirectory()) {
      if (ent.isSymbolicLink())
        excluded.push({ id, reason: "심볼릭 링크 폴더 제외" });
      continue;
    }
    let stat;
    try {
      stat = await fs.lstat(file);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
      excluded.push({ id, reason: "index.html 없음" });
      continue;
    }
    if (!stat.isFile() || stat.isSymbolicLink()) {
      excluded.push({ id, reason: "일반 HTML 파일이 아님" });
      continue;
    }
    if (stat.size > MAX_BYTES) {
      excluded.push({ id, reason: "2MiB 초과" });
      continue;
    }
    const html = await fs.readFile(file, "utf8"),
      raw = extract(html),
      meta = {};
    for (const key of ["title", "description", "class"])
      meta[key] = [...normalize(raw[key] || "")].slice(0, limits[key]).join("");
    // 학생 HTML의 진행 단계는 허용값일 때만 사용 (잘못된 값은 무시)
    const status = normalize(raw.status || "");
    if (status && STATUSES.includes(status)) meta.status = status;
    // 디자인 개선을 반영했으면 <meta name="design" content="컬러셋 … · 트렌드 … · #강조색">
    // → 진행 단계 옆 '디자인' 배지 (단계는 그대로 두고 표시만 더함)
    const design = designOf(raw.design);
    if (design) meta.design = design;
    Object.assign(meta, overrides[id] || {});
    meta.title ||= `프로젝트 ${id}`;
    meta.description ||= "프로그램을 실행해 확인해 보세요.";
    meta.class ||= "미분류";
    let updatedAt = null;
    try {
      const d = execFileSync(
        "git",
        [
          "-c",
          `safe.directory=${path.resolve(root)}`,
          "-C",
          root,
          "log",
          "-1",
          "--format=%cI",
          "--",
          `${id}/index.html`,
        ],
        { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      ).trim();
      if (d) updatedAt = d;
    } catch {}
    let prd = null;
    try {
      const s = await fs.lstat(path.join(root, "prd", `${id}.md`));
      if (s.isFile() && !s.isSymbolicLink()) prd = `prd/${id}.md`;
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    projects.push({
      id,
      ...meta,
      path: `${id}/`,
      updatedAt,
      prd,
      feedback: reviews[id] || null,
      history: history(root, id),
    });
  }
  if (projects.length > 200)
    throw Error(
      `지원 범위 초과: ${projects.length}작품 (최대 200). 게시를 중단합니다.`,
    );
  return { projects, excluded };
}
