import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { serve } from "../scripts/serve.mjs";
const { server, url } = await serve("dist");
const browser = await chromium.launch({
  executablePath: process.env.CAPTURE_BROWSER || chromium.executablePath(),
});
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  await page.goto(url + "10100/");
  assert.match(await page.title(), /10100 테스트/);
  assert.deepEqual(await page.evaluate(() => scoreGuess("472", "427")), {
    strikes: 1,
    balls: 2,
  });
  assert.deepEqual(await page.evaluate(() => scoreGuess("135", "427")), {
    strikes: 0,
    balls: 0,
  });
  assert.deepEqual(await page.evaluate(() => scoreGuess("427", "427")), {
    strikes: 3,
    balls: 0,
  });
  assert.ok(
    await page.evaluate(() =>
      Array.from({ length: 1000 }, createAnswer).every(
        (a) => /^[1-9][0-9]{2}$/.test(a) && new Set(a).size === 3,
      ),
    ),
  );
  for (const invalid of ["", "12", "012", "112", "abc"]) {
    await page.locator("#guess").fill(invalid);
    await page.locator("#submit").click();
    assert.equal(await page.locator("#history tr").count(), 0);
  }
  await page.evaluate(() => (state.answer = "427"));
  await page.locator("#guess").fill("472");
  await page.locator("#guess").press("Enter");
  assert.equal(await page.locator("#history tr").count(), 1);
  assert.match(
    await page.locator("#message").textContent(),
    /1 스트라이크, 2 볼/,
  );
  await page.locator("#guess").fill("472");
  await page.locator("#submit").click();
  assert.equal(await page.locator("#history tr").count(), 1);
  assert.match(await page.locator("#message").textContent(), /이미 던진/);
  await page.locator("#guess").fill("427");
  await page.locator("#submit").click();
  assert.match(await page.locator("#message").textContent(), /홈런/);
  assert.ok(await page.locator("#submit").isDisabled());
  assert.equal(
    await page.locator("#answer").getAttribute("aria-label"),
    "정답 427",
  );
  await page.locator("#new-game").click();
  assert.equal(await page.locator("#history tr").count(), 0);
  assert.equal(await page.evaluate(() => document.activeElement.id), "guess");
  await page.evaluate(() => (state.answer = "987"));
  for (const guess of [
    "123",
    "124",
    "125",
    "126",
    "127",
    "128",
    "129",
    "130",
    "134",
    "135",
  ]) {
    await page.locator("#guess").fill(guess);
    await page.locator("#submit").click();
  }
  assert.equal(await page.locator("#history tr").count(), 10);
  assert.match(await page.locator("#message").textContent(), /정답은 987/);
  assert.ok(await page.locator("#guess").isDisabled());
  await page.reload();
  assert.equal(await page.locator("#history tr").count(), 0);
  await fs.mkdir("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/baseball-desktop.png" });
  await page.setViewportSize({ width: 360, height: 800 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "test-results/baseball-mobile.png",
    fullPage: true,
  });
  await page.goto(url);
  await page.locator('a[href="work.html?id=10100"]').first().click();
  await page.waitForSelector("#work:not([hidden])");
  assert.match(await page.locator("#title").textContent(), /숫자 야구/);
  await page.frameLocator("iframe").locator("#guess").fill("123");
  await page.frameLocator("iframe").locator("#submit").click();
  assert.equal(
    await page.frameLocator("iframe").locator("#history tr").count(),
    1,
  );
  // Verify the complete HTML with networking offline. Direct file:// navigation is blocked by this cloud browser policy.
  const html = await fs.readFile("10100/index.html");
  assert.ok(!/\b(?:src|href)=["']https?:/i.test(html.toString()));
  const standalone = await browser.newPage();
  await standalone.context().setOffline(true);
  await standalone.setContent(html.toString());
  await standalone.locator("#guess").fill("123");
  await standalone.locator("#submit").click();
  assert.equal(await standalone.locator("#history tr").count(), 1);
  console.log(
    "PASS 숫자 판정·정답 생성 1000회·잘못된/중복 입력·승리·10회 실패·새 게임·새로고침·360px·전시판 등록·sandbox·오프라인 HTML 본문 실행",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}
