import fs from "node:fs/promises";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright";
import { catalog } from "./catalog.mjs";
import { serve } from "./serve.mjs";
const here = path.dirname(fileURLToPath(import.meta.url));
const hash = (data) => createHash("sha256").update(data).digest("hex");
async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}
export async function environmentFingerprint() {
  const browser = process.env.CAPTURE_BROWSER || chromium.executablePath();
  const fontPaths = [
    ...new Set(
      execFileSync("fc-list", ["-f", "%{file}\n"], {
        encoding: "utf8",
        env: {
          PATH: process.env.PATH,
          HOME: "/tmp",
          XDG_CACHE_HOME: "/tmp/fontconfig-cache",
        },
      })
        .trim()
        .split("\n"),
    ),
  ].sort();
  const fonts = [];
  for (const f of fontPaths) fonts.push([f, hash(await fs.readFile(f))]);
  return hash(
    JSON.stringify({
      platform: os.platform(),
      arch: os.arch(),
      node: process.version,
      release: await fs.readFile("/etc/os-release", "utf8"),
      browser: hash(await fs.readFile(browser)),
      fonts,
      lock: await fs.readFile(path.join(here, "../package-lock.json"), "utf8"),
      worker: await fs.readFile(path.join(here, "capture-worker.mjs"), "utf8"),
      pipeline: await fs.readFile(fileURLToPath(import.meta.url), "utf8"),
      workflow: await fs.readFile(
        path.join(here, "../.github/workflows/pages.yml"),
        "utf8",
      ),
      settings: "1280x800;dpr1;ko-KR;Asia/Seoul;PNG256;v1",
    }),
  );
}
export async function capture(url, output) {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "sih26-browser-"));
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [path.join(here, "capture-worker.mjs"), url, output],
      {
        detached: true,
        stdio: ["ignore", "ignore", "pipe"],
        env: {
          PATH: process.env.PATH,
          HOME: temp,
          TMPDIR: temp,
          XDG_CACHE_HOME: temp,
          LANG: "ko_KR.UTF-8",
          ...(process.env.PLAYWRIGHT_BROWSERS_PATH
            ? { PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH }
            : {}),
          ...(process.env.CAPTURE_BROWSER
            ? { CAPTURE_BROWSER: process.env.CAPTURE_BROWSER }
            : {}),
        },
      },
    );
    let error = "",
      timedOut = false,
      done = false;
    child.stderr.on("data", (b) => {
      error = (error + b).slice(-2000);
    });
    const kill = () => {
      // Playwright launches Chromium in a separate process group. Match only this
      // worker's unique temporary profile/HOME, then stop and kill those groups too.
      const groups = new Set([child.pid]);
      for (const pid of readdirSync("/proc").filter((x) => /^\d+$/.test(x))) {
        try {
          const comm = readFileSync(`/proc/${pid}/comm`, "utf8");
          if (!/chrom(e|ium)/.test(comm)) continue;
          const cmd = readFileSync(`/proc/${pid}/cmdline`, "utf8");
          if (!cmd.includes(temp)) continue;
          const fields = readFileSync(`/proc/${pid}/stat`, "utf8")
            .split(") ")[1]
            .split(" ");
          groups.add(Number(fields[2]));
        } catch {}
      }
      for (const signal of ["SIGSTOP", "SIGKILL"])
        for (const group of groups) {
          try {
            process.kill(-group, signal);
          } catch {}
        }
    };
    const timer = setTimeout(() => {
      timedOut = true;
      kill();
    }, 15000);
    async function finish(code) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      kill();
      await fs.rm(temp, { recursive: true, force: true });
      resolve({
        ok: code === 0 && !timedOut,
        reason: timedOut
          ? "15초 watchdog 시간 초과"
          : error.trim() || `촬영 프로세스 종료 ${code}`,
      });
    }
    child.on("error", (e) => {
      error = e.message;
      finish(-1);
    });
    child.on("close", finish);
  });
}
export async function build({
  root = process.cwd(),
  out = path.join(root, "dist"),
  cache = path.join(root, ".cache/thumbnails"),
  force = "",
  environment,
} = {}) {
  if (force && force !== "all" && !/^\d{5}$/.test(force))
    throw Error("강제 촬영 대상은 all 또는 학번 5자리입니다.");
  const began = Date.now();
  const { projects, excluded } = await catalog(root);
  const staging = await fs.mkdtemp(path.join(os.tmpdir(), "sih26-site-"));
  await fs.mkdir(cache, { recursive: true });
  const report = {
    commit: null,
    generatedAt: new Date().toISOString(),
    registered: projects.length,
    excluded,
    captured: 0,
    cached: 0,
    failed: [],
    warnings: [],
    events: [],
    published: false,
  };
  try {
    report.commit = execFileSync(
      "git",
      [
        "-c",
        `safe.directory=${path.resolve(root)}`,
        "-C",
        root,
        "rev-parse",
        "HEAD",
      ],
      {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();
  } catch {}
  let server;
  try {
    for (const file of ["index.html", "work.html"])
      await fs.copyFile(path.join(root, file), path.join(staging, file));
    await fs.mkdir(path.join(staging, "assets"));
    for (const file of ["style.css", "common.js", "gallery.js", "work.js"])
      await fs.copyFile(
        path.join(root, "assets", file),
        path.join(staging, "assets", file),
      );
    await fs.mkdir(path.join(staging, "thumbnails"));
    await fs.mkdir(path.join(staging, "prd"));
    await fs.writeFile(path.join(staging, ".nojekyll"), "");
    for (const p of projects) {
      await fs.mkdir(path.join(staging, p.id));
      await fs.copyFile(
        path.join(root, p.id, "index.html"),
        path.join(staging, p.id, "index.html"),
      );
      if (p.prd)
        await fs.copyFile(path.join(root, p.prd), path.join(staging, p.prd));
    }
    const signature = environment || (await environmentFingerprint());
    report.captureEnvironment = signature;
    const started = await serve(staging);
    server = started.server;
    const probe = path.join(staging, "capture-probe.png");
    const health = await capture(started.url, probe);
    await fs.rm(probe, { force: true });
    await fs.rm(probe + ".json", { force: true });
    if (!health.ok)
      throw Error(`브라우저 환경 사전 점검 실패: ${health.reason}`);
    let cursor = 0;
    const captureStart = Date.now();
    await Promise.all(
      Array.from({ length: 2 }, async () => {
        while (cursor < projects.length) {
          const p = projects[cursor++];
          const fingerprint = hash(
            Buffer.concat([
              await fs.readFile(path.join(root, p.id, "index.html")),
              Buffer.from(`${p.id};/sih26/${p.id}/;${signature}`),
            ]),
          );
          const cached = path.join(cache, `${fingerprint}.png`);
          let bytes = null;
          if (force !== "all" && force !== p.id && (await exists(cached))) {
            try {
              const image = await fs.readFile(cached);
              const info = await sharp(image).metadata();
              if (
                info.format !== "png" ||
                info.width !== 1280 ||
                info.height !== 800
              )
                throw Error();
              await sharp(image).raw().toBuffer();
              bytes = image;
              report.cached++;
            } catch {
              report.warnings.push(`${p.id}: 손상된 캐시 재촬영`);
            }
          }
          if (!bytes) {
            const raw = path.join(staging, "thumbnails", `${p.id}-raw.png`);
            const result = await capture(`${started.url}${p.id}/`, raw);
            if (result.ok) {
              try {
                bytes = await sharp(await fs.readFile(raw))
                  .png({
                    palette: true,
                    colours: 256,
                    compressionLevel: 9,
                    effort: 7,
                  })
                  .toBuffer();
                if (bytes.length > 200 * 1024)
                  bytes = await sharp(bytes)
                    .png({
                      palette: true,
                      colours: 64,
                      compressionLevel: 9,
                      effort: 8,
                    })
                    .toBuffer();
                if (bytes.length > 200 * 1024)
                  report.warnings.push(
                    `${p.id}: 썸네일 200KB 목표 초과 (${bytes.length} bytes)`,
                  );
                await fs.writeFile(cached + ".tmp", bytes);
                await fs.rename(cached + ".tmp", cached);
                report.captured++;
                const log = JSON.parse(
                  await fs.readFile(raw + ".json", "utf8"),
                );
                if (log.events.length)
                  report.events.push({ id: p.id, events: log.events });
              } catch (e) {
                report.failed.push({
                  id: p.id,
                  reason: `이미지 처리 실패: ${e.message}`,
                });
              }
            } else report.failed.push({ id: p.id, reason: result.reason });
            await fs.rm(raw, { force: true });
            await fs.rm(raw + ".json", { force: true });
          }
          p.thumbnail = null;
          if (bytes) {
            const filename = `${p.id}-${fingerprint.slice(0, 16)}-${hash(bytes).slice(0, 16)}.png`;
            await fs.writeFile(
              path.join(staging, "thumbnails", filename),
              bytes,
            );
            p.thumbnail = `thumbnails/${filename}`;
          }
        }
      }),
    );
    report.captureSeconds = (Date.now() - captureStart) / 1000;
    report.buildSeconds = (Date.now() - began) / 1000;
    await fs.writeFile(
      path.join(staging, "projects.json"),
      JSON.stringify(projects, null, 2),
    );
    await fs.writeFile(
      path.join(staging, "build-info.json"),
      JSON.stringify(
        { commit: report.commit, generatedAt: report.generatedAt },
        null,
        2,
      ),
    );
    await fs.mkdir(path.dirname(out), { recursive: true });
    const next = out + ".next";
    await fs.rm(next, { recursive: true, force: true });
    await fs.cp(staging, next, { recursive: true });
    await fs.rm(out, { recursive: true, force: true });
    await fs.rename(next, out);
    await fs.mkdir(path.join(root, ".cache"), { recursive: true });
    await fs.writeFile(
      path.join(root, ".cache/build-report.json"),
      JSON.stringify(report, null, 2),
    );
    return report;
  } finally {
    if (server) await new Promise((r) => server.close(r));
    await fs.rm(staging, { recursive: true, force: true });
  }
}
export function summary(r) {
  const next =
    r.excluded.length || r.failed.length || r.warnings.length
      ? "제외·실패·경고 내역을 확인하고 해당 작품을 수정한 뒤 다시 실행하세요. 배포 결과는 deploy 작업에서 확인하세요."
      : "빌드가 완료되었습니다. deploy 작업에서 게시 완료 여부를 확인하세요.";
  return `## 빌드 결과 (게시 완료 아님)\n- 실행 커밋: ${r.commit || "미커밋"}\n- 등록 ${r.registered}, 제외 ${r.excluded.length}\n- 새 촬영 ${r.captured}, 캐시 ${r.cached}, 실패 ${r.failed.length}\n- 촬영 ${r.captureSeconds}초, 빌드 ${r.buildSeconds}초\n${[...r.excluded, ...r.failed].map((x) => `- ${x.id}: ${x.reason}`).join("\n")}\n${r.warnings.map((x) => `- ${x}`).join("\n")}\n- 다음 조치: ${next}\n`;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const r = await build({ force: process.env.FORCE_CAPTURE || "" });
    console.log(summary(r));
    if (process.env.GITHUB_STEP_SUMMARY)
      await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, summary(r));
  } catch (e) {
    const failure = {
      commit: process.env.GITHUB_SHA || null,
      generatedAt: new Date().toISOString(),
      buildFailed: true,
      published: false,
      reason: e.message,
    };
    await fs.mkdir(".cache", { recursive: true });
    await fs.writeFile(
      ".cache/build-report.json",
      JSON.stringify(failure, null, 2),
    );
    console.error(
      `전체 빌드 실패: ${e.message}\n미완성 결과는 게시하지 않습니다. 입력 구조와 설치 환경을 확인하세요.`,
    );
    if (process.env.GITHUB_STEP_SUMMARY)
      await fs.appendFile(
        process.env.GITHUB_STEP_SUMMARY,
        `## 전체 빌드 실패\n실행 커밋: ${failure.commit || "미커밋/로컬 실행"}\n${e.message}\n기존 게시본을 유지합니다. 입력 구조와 설치 환경을 확인하세요.\n`,
      );
    process.exitCode = 1;
  }
}
