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
        !["", "첫 버전", "개선 중", "개선 완료"].includes(entry[k])
      )
        throw Error(`잘못된 진행 상태: ${id}`);
    }
  }
  return m;
}
function extract(html) {
  const out = {};
  const text = (n) => (n.value || "") + (n.childNodes || []).map(text).join("");
  function walk(n) {
    if (n.tagName === "title" && !out.title) out.title = text(n);
    if (n.tagName === "meta") {
      const a = Object.fromEntries(n.attrs.map((x) => [x.name, x.value]));
      if (["description", "class"].includes(a.name?.toLowerCase()))
        out[a.name.toLowerCase()] = a.content || "";
    }
    for (const c of n.childNodes || []) walk(c);
  }
  walk(parse(html));
  return out;
}
export async function catalog(root) {
  const overrides = await metadata(root),
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
    Object.assign(meta, overrides[id] || {});
    meta.title ||= `프로젝트 ${id}`;
    meta.description ||= "프로그램을 실행해 확인해 보세요.";
    meta.class ||= "미분류";
    let updatedAt = null;
    try {
      const d = execFileSync(
        "git",
        ["-C", root, "log", "-1", "--format=%cI", "--", `${id}/index.html`],
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
    projects.push({ id, ...meta, path: `${id}/`, updatedAt, prd });
  }
  if (projects.length > 200)
    throw Error(
      `지원 범위 초과: ${projects.length}작품 (최대 200). 게시를 중단합니다.`,
    );
  return { projects, excluded };
}
