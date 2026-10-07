import { chromium } from "playwright";
import fs from "node:fs/promises";
const [url, output] = process.argv.slice(2),
  events = [];
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CAPTURE_BROWSER || chromium.executablePath(),
    args: ["--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
    colorScheme: "light",
    reducedMotion: "reduce",
    serviceWorkers: "block",
    acceptDownloads: false,
  });
  const allowed = new URL(url);
  await context.route("**/*", (route) => {
    let u;
    try {
      u = new URL(route.request().url());
    } catch {
      return route.abort();
    }
    if (
      u.protocol === "data:" ||
      u.protocol === "blob:" ||
      (u.origin === allowed.origin && u.pathname === allowed.pathname) ||
      (u.origin === allowed.origin &&
        u.pathname === allowed.pathname + "index.html")
    )
      return route.continue();
    events.push("blocked request");
    return route.abort();
  });
  await context.routeWebSocket(/.*/, (ws) => {
    events.push("blocked websocket");
    ws.close();
  });
  const page = await context.newPage();
  context.on("page", (p) => {
    if (p !== page) {
      events.push("popup closed");
      p.close().catch(() => {});
    }
  });
  page.on("dialog", (d) => {
    events.push(`dialog: ${d.type()}`);
    d.dismiss().catch(() => {});
  });
  page.on("download", (d) => {
    events.push("download canceled");
    d.cancel().catch(() => {});
  });
  page.on("pageerror", () => events.push("page error"));
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 6500 });
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}",
  });
  await page.evaluate(() =>
    Promise.race([
      Promise.all([
        document.fonts.ready,
        ...[...document.images].map((i) =>
          i.complete
            ? Promise.resolve()
            : new Promise((r) => {
                i.onload = r;
                i.onerror = r;
              }),
        ),
      ]),
      new Promise((r) => setTimeout(r, 1500)),
    ]),
  );
  await page.screenshot({
    path: output,
    fullPage: false,
    timeout: 3000,
    animations: "disabled",
  });
  await browser.close();
  browser = null;
  await fs.writeFile(output + ".json", JSON.stringify({ events }));
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
}
