import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { fixture, student } from "./helpers.mjs";
import { build, environmentFingerprint } from "../scripts/build.mjs";
import { serve } from "../scripts/serve.mjs";
const root = await fixture();
let browser, server;
const checks = [];
const pass = (s) => {
  checks.push(s);
  console.log("PASS", s);
};
try {
  await student(
    root,
    "20100",
    '<h1>정상 작품</h1><button onclick="this.textContent=\'실행 완료\'">테스트</button><script>try{localStorage.setItem("sih26:20100:value","A")}catch{}</script>',
  );
  await student(
    root,
    "20101",
    '<h1>무한 루프</h1><script>addEventListener("DOMContentLoaded",()=>setTimeout(()=>{while(true){}},0))</script>',
  );
  await fs.mkdir(path.join(root, "prd"));
  await fs.writeFile(
    path.join(root, "prd/20100.md"),
    "<script>window.PRD_EXECUTED=true</script>\n공개 기획서",
  );
  const environment = await environmentFingerprint();
  let r = await build({ root, environment });
  assert.equal(r.captured, 1);
  assert.equal(r.failed.length, 1);
  assert.match(r.failed[0].reason, /watchdog/);
  assert.ok(r.captureSeconds < 25);
  pass("무한 루프 15초 종료와 정상 작품 동시 처리·부분 실패");
  await student(
    root,
    "20101",
    '<h1>고친 작품</h1><script>try{localStorage.setItem("sih26:20101:value","B")}catch{}</script>',
  );
  r = await build({ root, environment });
  assert.equal(r.cached, 1);
  assert.equal(r.captured, 1);
  pass("성공 캐시 적중·실패 다음 빌드 재촬영");
  r = await build({ root, environment, force: "20100" });
  assert.equal(r.captured, 1);
  assert.equal(r.cached, 1);
  pass("특정 학번 강제 재촬영");
  r = await build({ root, environment: environment + "changed" });
  assert.equal(r.captured, 2);
  pass("촬영 환경 변경 시 캐시 무효화");
  const before = await fs.readFile(
    path.join(root, "dist/projects.json"),
    "utf8",
  );
  await fs.writeFile(path.join(root, "project-meta.json"), "{broken");
  await assert.rejects(build({ root, environment }));
  assert.equal(
    await fs.readFile(path.join(root, "dist/projects.json"), "utf8"),
    before,
  );
  await fs.rm(path.join(root, "project-meta.json"));
  pass("전체 실패 시 이전 완성 산출물 보존");
  let projects = JSON.parse(before);
  for (let i = 2; i < 50; i++)
    projects.push({
      ...projects[0],
      id: String(20100 + i),
      title: `작품 ${20100 + i}`,
      class: i % 2 ? "2반" : "1반",
      updatedAt: i === 49 ? "2026-01-01T00:00:00Z" : null,
    });
  await fs.writeFile(
    path.join(root, "dist/projects.json"),
    JSON.stringify(projects),
  );
  const host = await serve(path.join(root, "dist"));
  server = host.server;
  const base = host.url;
  assert.equal((await fetch(base + ".git/config")).status, 404);
  assert.equal((await fetch(base + "scripts/build.mjs")).status, 404);
  pass("배포 허용목록·내부 파일 차단");
  browser = await chromium.launch({
    executablePath: process.env.CAPTURE_BROWSER || undefined,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  await page.goto(base);
  await page.waitForSelector(".card");
  assert.equal(await page.locator(".card").count(), 24);
  assert.equal(await page.locator("iframe").count(), 0);
  const ratio = await page
    .locator(".shot")
    .first()
    .evaluate(
      (e) => e.getBoundingClientRect().width / e.getBoundingClientRect().height,
    );
  assert.ok(Math.abs(ratio - 1.6) < 0.02, "카드 스크린샷 16:10");
  await page.locator("#more").click();
  assert.equal(await page.locator(".card").count(), 48);
  await page.locator("#search").fill("20100");
  assert.equal(await page.locator(".card").count(), 1);
  await page.locator("#class").selectOption("2반");
  assert.equal(await page.locator(".card").count(), 0);
  await page.locator("#reset").click();
  await page.locator("#sort").selectOption("recent");
  assert.match(await page.locator(".card").first().innerText(), /20149/);
  pass("24개 더 보기·검색·반 필터 동시 적용·최근 수정 정렬");
  await page.locator("#reset").click();
  await page.locator("#class").selectOption("1반");
  await page.locator("#more").click();
  await page.evaluate(() => scrollTo(0, 500));
  await page.waitForTimeout(100);
  const y = await page.evaluate(() => scrollY);
  await page.locator(".card h2 a").first().click();
  await page.waitForSelector("#work:not([hidden])");
  assert.equal(await page.locator("iframe").count(), 0);
  await page.locator("a.back").click();
  await page.waitForSelector(".card");
  assert.equal(await page.locator("#class").inputValue(), "1반");
  assert.equal(await page.locator(".card").count(), 25);
  await page.waitForTimeout(150);
  assert.ok(Math.abs((await page.evaluate(() => scrollY)) - y) < 5);
  pass("상세→목록 검색 조건·표시 개수·스크롤 복원");
  await page.goto(base + "work.html?id=20100");
  await page.waitForSelector("#work:not([hidden])");
  const popupEvent = page.waitForEvent("popup");
  await page.locator("#run").click();
  const popup = await popupEvent;
  await popup.waitForLoadState();
  assert.equal(popup.url(), base + "20100/");
  await popup.locator("button").click();
  assert.equal(await popup.locator("button").textContent(), "실행 완료");
  await popup.reload();
  assert.equal(await popup.locator("h1").textContent(), "정상 작품");
  await popup.goto(base + "20101/");
  assert.equal(
    await popup.evaluate(() => localStorage.getItem("sih26:20100:value")),
    "A",
  );
  assert.equal(
    await popup.evaluate(() => localStorage.getItem("sih26:20101:value")),
    "B",
  );
  await popup.close();
  const downloadEvent = page.waitForEvent("download");
  await page.locator("#download").click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), "20100.html");
  assert.equal(
    await fs.readFile(await download.path(), "utf8"),
    await fs.readFile(path.join(root, "20100/index.html"), "utf8"),
  );
  pass("학생 폴더 직접 접속·새로고침·새 탭 동작·다운로드 원본·저장 키 독립");
  await page.locator("#preview-start").click();
  await page.waitForSelector("iframe");
  assert.equal(
    await page.locator("iframe").getAttribute("sandbox"),
    "allow-scripts allow-forms",
  );
  await page.waitForFunction(() =>
    document
      .querySelector("#preview-status")
      .textContent.includes("정상 작동을 확인한 것은 아닙니다"),
  );
  await page.locator("#restart").click();
  assert.equal(await page.locator("iframe").count(), 1);
  await page.locator("#grow").click();
  assert.ok(
    (await page.locator("iframe").evaluate((e) => e.offsetHeight)) > 600,
  );
  await page.locator("#stop").click();
  assert.equal(await page.locator("iframe").count(), 0);
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "preview-start",
  );
  await page.route("**/20100/", async (route) => {
    await new Promise((r) => setTimeout(r, 11000));
    await route.continue().catch(() => {});
  });
  await page.locator("#preview-start").click();
  await page.waitForFunction(
    () =>
      document.querySelector("#preview-status").textContent.includes("10초"),
    {},
    { timeout: 14000 },
  );
  await page.locator("#stop").click();
  await page.unroute("**/20100/");
  pass("iframe 지연 안내·로드 안내·sandbox·재시작·크기·종료 포커스");
  await page.locator("#prd-open").click();
  await page.waitForFunction(() =>
    document.querySelector("#prd-text").textContent.includes("공개 기획서"),
  );
  assert.equal(await page.evaluate(() => window.PRD_EXECUTED), undefined);
  assert.match(
    await page.locator("#prd-download").getAttribute("href"),
    /prd\/20100.md/,
  );
  await page.locator("#code-panel summary").click();
  await page.locator("#code-load").click();
  await page.waitForFunction(() =>
    document.querySelector("#code").value.includes("정상 작품"),
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw Error("denied");
        },
      },
    }),
  );
  await page.locator("#prompt-copy").click();
  assert.match(await page.locator("#copy-status").textContent(), /직접 복사/);
  assert.equal(await page.locator("#prompt-panel").getAttribute("open"), "");
  assert.match(await page.locator("#prompt").inputValue(), /20100/);
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (t) => {
          window.copied = t;
        },
      },
    }),
  );
  await page.locator("#prompt-copy").click();
  assert.match(
    await page.locator("#copy-status").textContent(),
    /복사했습니다/,
  );
  assert.match(
    await page.evaluate(() => window.copied),
    /없는 오류를 만들어내지 마/,
  );
  pass("PRD 원문 안전 표시·HTML 대안·복사 실패 수동 복사·성공 안내");
  await page.goto(base + "work.html?id=20101");
  await page.locator("#prd-open").click();
  assert.match(await page.locator("#prd-status").textContent(), /아직 등록/);
  await page.goto(base + "work.html?id=99999");
  await page.waitForFunction(() =>
    document.querySelector("#status").textContent.includes("등록되지"),
  );
  await page.goto(base + "work.html?id=../");
  await page.waitForFunction(() =>
    document.querySelector("#status").textContent.includes("잘못된"),
  );
  pass("기획서 없음·없는 작품·잘못된 id");
  await context.clearCookies();
  await page.goto(base);
  await page.locator("#reset").click();
  await page.setViewportSize({ width: 360, height: 800 });
  await page.waitForSelector(".card");
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await fs.mkdir("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/gallery-mobile.png",
    fullPage: false,
  });
  await page.keyboard.press("Tab");
  assert.ok(
    await page.evaluate(() => document.activeElement !== document.body),
  );
  await page.setViewportSize({ width: 720, height: 900 });
  await page.evaluate(() => (document.documentElement.style.zoom = "2"));
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.locator("#search").fill("20100");
  assert.equal(await page.locator(".card").count(), 1);
  await page.evaluate(() => (document.documentElement.style.zoom = "1"));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("#reset").click();
  await page.screenshot({ path: "test-results/gallery-desktop.png" });
  pass("360px 가로 넘침·키보드 접근·200% CSS 확대 주요 검색");
  await page.route("**/projects.json", (route) =>
    route.fulfill({ status: 500, body: "failure" }),
  );
  await page.reload();
  await page.getByText("다시 시도", { exact: true }).waitFor();
  await page.unroute("**/projects.json");
  await page.getByText("다시 시도", { exact: true }).click();
  await page.waitForSelector(".card");
  pass("목록 로드 실패·다시 시도");
  await page.route("**/thumbnails/*.png", (route) =>
    route.fulfill({ status: 404, body: "missing" }),
  );
  await page.reload();
  await page.waitForSelector(".placeholder");
  assert.ok((await page.locator(".card .actions a").count()) > 0);
  await page.unroute("**/thumbnails/*.png");
  pass("개별 썸네일 실패에도 정보·실행·다운로드 유지");
  await fs.writeFile(path.join(root, "dist/projects.json"), "[]");
  await page.reload();
  await page.getByText(/등록된 작품이 없습니다/).waitFor();
  pass("등록 작품 없음");
  await fs.writeFile(
    "test-results/browser.json",
    JSON.stringify(checks, null, 2),
  );
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((r) => server.close(r));
  await fs.rm(root, { recursive: true, force: true });
}
