import { fixture, student } from "./helpers.mjs";
import { build } from "../scripts/build.mjs";
import { serve } from "../scripts/serve.mjs";
import { chromium } from "playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
await fs.mkdir("test-results", { recursive: true });
const root = await fixture();
let browser, server;
try {
  await student(
    root,
    "20100",
    "<h1>오늘의 시간표</h1><p>다음 수업을 확인하고 준비물을 챙겨보세요.</p>",
  );
  await build({ root });
  const host = await serve(root + "/dist");
  server = host.server;
  browser = await chromium.launch({
    executablePath: process.env.CAPTURE_BROWSER,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto(host.url + "work.html?id=20100");
  await page.waitForSelector("#work:not([hidden])");
  await page.screenshot({ path: "test-results/detail-desktop.png" });
  await page.setViewportSize({ width: 360, height: 800 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.waitForSelector("iframe");
  assert.equal(await page.locator("iframe").count(), 1);
  await page.locator("#restart").focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("iframe").count(), 1);
  assert.equal(await page.evaluate(() => document.activeElement.id), "restart");
  await page
    .frameLocator("iframe")
    .getByRole("heading", { name: "오늘의 시간표" })
    .waitFor();
  await page.screenshot({ path: "test-results/detail-mobile.png" });
  console.log("PASS 상세 360px 넘침 없음·자동 실행·키보드 재시작");
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((r) => server.close(r));
  await fs.rm(root, { recursive: true, force: true });
}
