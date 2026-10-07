import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
export async function serve(root, { port = 0, base = "/sih26/" } = {}) {
  const real = await fs.realpath(root);
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const decoded = decodeURIComponent(url.pathname);
      if (!decoded.startsWith(base)) throw Error();
      let relative = decoded.slice(base.length);
      if (!relative || relative.endsWith("/")) relative += "index.html";
      if (relative.split("/").some((x) => x.startsWith(".") || x === ".."))
        throw Error();
      const target = await fs.realpath(path.join(real, relative));
      if (!target.startsWith(real + path.sep)) throw Error();
      const body = await fs.readFile(target);
      res.writeHead(200, {
        "Content-Type":
          {
            ".html": "text/html; charset=utf-8",
            ".json": "application/json",
            ".js": "text/javascript",
            ".css": "text/css",
            ".png": "image/png",
            ".md": "text/plain; charset=utf-8",
          }[path.extname(target)] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
  await new Promise((r) => server.listen(port, "127.0.0.1", r));
  return { server, url: `http://127.0.0.1:${server.address().port}${base}` };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await serve(path.resolve(process.argv[2] || "dist"), {
    port: Number(process.env.PORT || 4173),
  });
  console.log(`Local validation server: ${url}`);
}
