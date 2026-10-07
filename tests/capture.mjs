import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { fixture, student } from "./helpers.mjs";
import { build, environmentFingerprint } from "../scripts/build.mjs";
const root = await fixture();
const checks = [];
const pass = (s) => {
  checks.push(s);
  console.log("PASS", s);
};
try {
  await student(
    root,
    "20100",
    '<h1>임의 값</h1><script>document.querySelector("h1").textContent=Math.random();fetch("https://example.invalid/private").catch(()=>{});new WebSocket("wss://example.invalid/ws");alert("test");</script>',
  );
  const environment = await environmentFingerprint();
  let r = await build({ root, environment });
  assert.equal(r.captured, 1);
  assert.equal(r.failed.length, 0);
  assert.ok(r.events[0].events.includes("blocked request"));
  assert.ok(r.events[0].events.includes("blocked websocket"));
  assert.ok(r.events[0].events.includes("dialog: alert"));
  pass("외부 HTTP·WebSocket 차단, 대화상자 종료 기록");
  const first = JSON.parse(
    await fs.readFile(path.join(root, "dist/projects.json"), "utf8"),
  )[0].thumbnail;
  r = await build({ root, environment, force: "all" });
  assert.equal(r.captured, 1);
  const second = JSON.parse(
    await fs.readFile(path.join(root, "dist/projects.json"), "utf8"),
  )[0].thumbnail;
  assert.notEqual(first, second);
  assert.equal(first.split("-")[1], second.split("-")[1]);
  pass("전체 강제 촬영·동일 fingerprint에서 변경 이미지 내용 해시 주소 갱신");
  const cache = path.join(root, ".cache/thumbnails");
  await fs.rm(cache, { recursive: true });
  r = await build({ root, environment });
  assert.equal(r.captured, 1);
  pass("캐시 누락 시 전체 재생성");
  for (const f of await fs.readdir(cache))
    await fs.writeFile(path.join(cache, f), "broken PNG");
  r = await build({ root, environment });
  assert.equal(r.captured, 1);
  assert.equal(r.warnings.length, 1);
  pass("손상 캐시 재촬영");
  await fs.rm(path.join(root, "20100"), { recursive: true });
  r = await build({ root, environment });
  assert.equal(r.registered, 0);
  await assert.rejects(fs.access(path.join(root, "dist/20100")));
  assert.equal(
    (await fs.readdir(path.join(root, "dist/thumbnails"))).length,
    0,
  );
  pass("삭제 작품·이전 썸네일 배포 제외, 캐시 부활 없음");
  const installedBrowser = process.env.CAPTURE_BROWSER;
  process.env.CAPTURE_BROWSER = "/missing/sih26-browser";
  await assert.rejects(
    build({ root, environment }),
    /브라우저 환경 사전 점검 실패/,
  );
  if (installedBrowser) process.env.CAPTURE_BROWSER = installedBrowser;
  else delete process.env.CAPTURE_BROWSER;
  pass("브라우저 인프라 장애는 전체 빌드 실패");
  await fs.mkdir("test-results", { recursive: true });
  await fs.writeFile(
    "test-results/capture.json",
    JSON.stringify(checks, null, 2),
  );
} finally {
  await fs.rm(root, { recursive: true, force: true });
}
