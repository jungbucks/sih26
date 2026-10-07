import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { catalog, MAX_BYTES } from "../scripts/catalog.mjs";
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "sih26-unit-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
}
async function student(
  root,
  id,
  html = "<!doctype html><title>테스트</title>",
) {
  await fs.mkdir(path.join(root, id), { recursive: true });
  await fs.writeFile(path.join(root, id, "index.html"), html);
}
test("현재 파일 등록·수정·삭제, 앞자리 0, 직접 하위만 탐색, 누락·크기 초과 제외", async (t) => {
  const r = await fixture(t);
  await student(r, "00101");
  await fs.writeFile(path.join(r, "index.html"), "<title>전시판</title>");
  await fs.writeFile(path.join(r, "20100.html"), "이전 방식");
  await fs.mkdir(path.join(r, "20102"));
  await student(r, "20103", "x".repeat(MAX_BYTES + 1));
  await student(path.join(r, "nested"), "20104");
  let c = await catalog(r);
  assert.deepEqual(
    c.projects.map((p) => p.id),
    ["00101"],
  );
  assert.equal(c.excluded.length, 2);
  await student(r, "00101", "<title>변경</title>");
  assert.equal((await catalog(r)).projects[0].title, "변경");
  await fs.rename(path.join(r, "00101"), path.join(r, "00102"));
  assert.equal((await catalog(r)).projects[0].id, "00102");
  await fs.rm(path.join(r, "00102/index.html"));
  assert.equal((await catalog(r)).projects.length, 0);
});
test("기본값·텍스트 파싱·공백 정리·오버라이드·PRD·Git 수정일", async (t) => {
  const r = await fixture(t);
  await student(r, "20100", "<!doctype html><p>내용</p>");
  let p = (await catalog(r)).projects[0];
  assert.equal(p.title, "프로젝트 20100");
  assert.equal(p.class, "미분류");
  assert.equal(p.updatedAt, null);
  await student(
    r,
    "20100",
    '<title>&lt;script&gt; 제목</title><meta name="description" content=" a  b "><meta name="class" content=" 2반 ">',
  );
  await fs.mkdir(path.join(r, "prd"));
  await fs.writeFile(path.join(r, "prd/20100.md"), "<script>원문</script>");
  await fs.writeFile(
    path.join(r, "project-meta.json"),
    JSON.stringify({ 20100: { title: " 교사  제목 ", status: "개선 중" } }),
  );
  execFileSync("git", ["init", r], { stdio: "ignore" });
  execFileSync("git", ["-C", r, "add", "."]);
  execFileSync(
    "git",
    [
      "-C",
      r,
      "-c",
      "user.name=Test",
      "-c",
      "user.email=test@example.invalid",
      "commit",
      "-m",
      "fixture",
    ],
    {
      stdio: "ignore",
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: "2025-01-01T00:00:00Z",
        GIT_COMMITTER_DATE: "2025-01-01T00:00:00Z",
      },
    },
  );
  p = (await catalog(r)).projects[0];
  assert.equal(p.title, "교사 제목");
  assert.equal(p.description, "a b");
  assert.equal(p.class, "2반");
  assert.equal(p.status, "개선 중");
  assert.equal(p.prd, "prd/20100.md");
  assert.match(p.updatedAt, /2025-01-01/);
});
test("잘못된 메타 구조·자료형·길이·상태는 전체 실패", async (t) => {
  const r = await fixture(t);
  for (const value of [
    "{",
    "[]",
    "null",
    JSON.stringify({ 20100: { title: 3 } }),
    JSON.stringify({ 20100: { title: "x".repeat(101) } }),
    JSON.stringify({ 20100: { status: "자동 완료" } }),
    JSON.stringify({ 20100: { unknown: "x" } }),
  ]) {
    await fs.writeFile(path.join(r, "project-meta.json"), value);
    await assert.rejects(catalog(r));
  }
});
test("201작품은 누락 없이 전체 실패", async (t) => {
  const r = await fixture(t);
  for (let i = 0; i < 201; i++) await student(r, String(20000 + i));
  await assert.rejects(catalog(r), /지원 범위 초과/);
});
test("심볼릭 링크 작품·PRD를 공개하지 않음", async (t) => {
  const r = await fixture(t);
  await fs.symlink("/tmp", path.join(r, "20100"));
  await fs.mkdir(path.join(r, "20101"));
  await fs.symlink("/etc/passwd", path.join(r, "20101/index.html"));
  assert.equal((await catalog(r)).projects.length, 0);
});

test("정확히 2MiB는 지원하고 JSON의 상속 속성 이름은 거부", async (t) => {
  const r = await fixture(t);
  await student(r, "20100", " ".repeat(MAX_BYTES));
  assert.equal((await catalog(r)).projects.length, 1);
  await fs.writeFile(
    path.join(r, "project-meta.json"),
    '{"20100":{"__proto__":"bad"}}',
  );
  await assert.rejects(catalog(r), /잘못된 메타 필드/);
});

test("컨테이너 소유권 차이가 있어도 명시한 저장소의 Git 수정일을 읽음", async (t) => {
  const root = await fixture(t);
  await student(root, "10100");
  execFileSync("git", ["init", root], { stdio: "ignore" });
  execFileSync("git", ["-C", root, "add", "."]);
  execFileSync(
    "git",
    [
      "-C",
      root,
      "-c",
      "user.name=Test",
      "-c",
      "user.email=test@example.invalid",
      "commit",
      "-m",
      "fixture",
    ],
    { stdio: "ignore" },
  );
  const before = process.env.GIT_TEST_ASSUME_DIFFERENT_OWNER;
  process.env.GIT_TEST_ASSUME_DIFFERENT_OWNER = "1";
  try {
    assert.throws(() =>
      execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {
        stdio: "ignore",
      }),
    );
    assert.ok((await catalog(root)).projects[0].updatedAt);
  } finally {
    if (before === undefined)
      delete process.env.GIT_TEST_ASSUME_DIFFERENT_OWNER;
    else process.env.GIT_TEST_ASSUME_DIFFERENT_OWNER = before;
  }
});
