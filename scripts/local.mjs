// 로컬 미리보기: 빌드(Actions) 없이 저장소 폴더를 그대로 띄운다.
// projects.json·build-info.json은 요청할 때마다 지금 작업 폴더로 새로 만든다
// (push하지 않은 커밋·저장만 한 학생 HTML도 바로 반영). 미리보기 이미지는 없음.
// 사용: npm run local  (또는 node scripts/local.mjs [--no-open])
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { catalog } from "./catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const real = await fs.realpath(root);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};
// 작품은 sandbox iframe(origin null)에서 공용 글꼴을 불러오므로 CORS 허용 (Pages와 같게)
const HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Access-Control-Allow-Origin": "*",
};

function commit() {
  try {
    return execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

// catalog()는 학생마다 git 이력을 읽어 수 초 걸림 → 결과를 기억해 두고,
// 커밋·학생 HTML·feedback.json·project-meta.json이 바뀌었을 때만 다시 만든다.
async function signature() {
  const parts = [commit()];
  for (const name of (await fs.readdir(root)).sort()) {
    const files = /^\d{5}$/.test(name)
      ? [path.join(name, "index.html")]
      : name === "feedback.json" || name === "project-meta.json"
        ? [name]
        : [];
    for (const f of files) {
      try {
        const s = await fs.stat(path.join(root, f));
        parts.push(`${f}:${s.mtimeMs}:${s.size}`);
      } catch {}
    }
  }
  return parts.join("|");
}
let cached = { sig: null, body: null, pending: null };
async function projectsJson() {
  const sig = await signature();
  if (cached.sig === sig && cached.body) return cached.body;
  if (cached.pending?.sig === sig) return cached.pending.promise;
  const promise = (async () => {
    const began = Date.now();
    const { projects } = await catalog(root);
    for (const p of projects) p.thumbnail = null;
    const body = JSON.stringify(projects, null, 2);
    cached = { sig, body, pending: null };
    console.log(`목록 갱신: ${projects.length}작품 (${((Date.now() - began) / 1000).toFixed(1)}초)`);
    return body;
  })();
  cached.pending = { sig, promise };
  return promise;
}

const VIRTUAL = {
  "projects.json": projectsJson,
  "build-info.json": async () =>
    JSON.stringify({ commit: commit(), generatedAt: new Date().toISOString() }),
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let rel = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if (!rel || rel.endsWith("/")) rel += "index.html";
    if (rel === "favicon.ico") {
      res.writeHead(204, HEADERS);
      return res.end();
    }
    if (VIRTUAL[rel]) {
      const body = await VIRTUAL[rel]();
      res.writeHead(200, { ...HEADERS, "Content-Type": TYPES[".json"] });
      return res.end(body);
    }
    // 숨김 파일·node_modules·상위 경로·로컬 전용 문서는 내보내지 않음
    const parts = rel.split("/");
    if (
      parts.some((x) => x.startsWith(".") || x === "..") ||
      parts[0] === "node_modules" ||
      rel === "latevibecoding.md"
    )
      throw Error("blocked");
    const target = await fs.realpath(path.join(real, rel));
    if (!target.startsWith(real + path.sep)) throw Error("outside");
    const body = await fs.readFile(target);
    res.writeHead(200, {
      ...HEADERS,
      "Content-Type": TYPES[path.extname(target)] || "application/octet-stream",
    });
    res.end(body);
  } catch (e) {
    if (e && e.message && !/blocked|outside|ENOENT|EISDIR/.test(e.message))
      console.error(e);
    res.writeHead(404, { ...HEADERS, "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

const port = Number(process.env.PORT || 4173);
await new Promise((resolve, reject) => {
  server.once("error", (e) => {
    if (e.code !== "EADDRINUSE") return reject(e);
    server.listen(0, "127.0.0.1", resolve); // 4173이 쓰이고 있으면 빈 포트
  });
  server.listen(port, "127.0.0.1", resolve);
});
const base = `http://127.0.0.1:${server.address().port}/`;
console.log("작품 목록 만드는 중…");
await projectsJson();
console.log(`로컬 미리보기: ${base}`);
console.log(`대시보드:      ${base}dashboard.html`);
console.log("끄려면 Ctrl+C");
if (!process.argv.includes("--no-open") && process.platform === "win32")
  execFile("cmd", ["/c", "start", "", `${base}dashboard.html`]);
