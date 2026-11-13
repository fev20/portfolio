import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const prefix = '/source-code-atlas/';
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.txt':'text/plain; charset=utf-8', '.svg':'image/svg+xml' };

export async function serve(port = 0) {
  const server = createServer(async (request,response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
      if (!['GET','HEAD'].includes(request.method) || !pathname.startsWith(prefix)) {
        response.writeHead(404).end();
        return;
      }
      const path = resolve(join(dist, pathname.slice(prefix.length) || 'index.html'));
      if (!path.startsWith(resolve(dist) + sep)) {
        response.writeHead(404).end();
        return;
      }
      const content = await readFile(path);
      response.writeHead(200, { 'Content-Type':types[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((ok,fail) => { server.once('error',fail); server.listen(port,'127.0.0.1',ok); });
  return { server, url:`http://127.0.0.1:${server.address().port}${prefix}` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { url } = await serve(Number(process.argv[2] || 4173));
  console.log(`Local: ${url}`);
}
