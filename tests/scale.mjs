import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { fixture, student } from "./helpers.mjs";
import { build, environmentFingerprint } from "../scripts/build.mjs";
const root = await fixture();
try {
  for (let i = 0; i < 200; i++)
    await student(
      root,
      String(20000 + i),
      `<h1>학생 작품 ${i}</h1><button onclick="this.textContent='실행 완료'">실행</button><canvas id="c" width="100" height="100"></canvas><script>c.getContext('2d').fillRect(10,10,50,50)</script>`,
    );
  const signature = await environmentFingerprint();
  const r = await build({ root, environment: signature });
  assert.equal(r.captured, 200);
  assert.equal(r.failed.length, 0);
  assert.ok(r.captureSeconds < 1800);
  const cached = await build({ root, environment: signature });
  assert.equal(cached.cached, 200);
  await fs.mkdir("test-results", { recursive: true });
  await fs.writeFile(
    "test-results/scale.json",
    JSON.stringify({ cold: r, warm: cached }, null, 2),
  );
  console.log(
    JSON.stringify({
      coldSeconds: r.captureSeconds,
      warmSeconds: cached.captureSeconds,
      captured: r.captured,
      failed: r.failed.length,
    }),
  );
} finally {
  await fs.rm(root, { recursive: true, force: true });
}
