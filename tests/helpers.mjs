import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
export async function fixture() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "sih26-integration-"));
  for (const name of ["index.html", "work.html", "assets"])
    await fs.cp(new URL("../" + name, import.meta.url), path.join(root, name), {
      recursive: true,
    });
  return root;
}
export async function student(root, id, body = `<h1>프로젝트 ${id}</h1>`) {
  await fs.mkdir(path.join(root, id), { recursive: true });
  await fs.writeFile(
    path.join(root, id, "index.html"),
    `<!doctype html><html lang="ko"><meta charset="utf-8"><title>작품 ${id}</title><meta name="description" content="학생 프로그램"><meta name="class" content="${Number(id) % 2 ? "2반" : "1반"}"><style>body{background:#e8f1eb;color:#173b32;font-family: sans-serif;padding:40px}</style>${body}</html>`,
  );
}
