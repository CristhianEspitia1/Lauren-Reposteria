import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PUBLIC_FILES } from './files.mjs';

const root = new URL('../public/', import.meta.url);
const port = Number(process.argv[2] || 5180);
const mime = { html:'text/html; charset=utf-8', css:'text/css; charset=utf-8', js:'text/javascript; charset=utf-8', txt:'text/plain; charset=utf-8', webp:'image/webp', svg:'image/svg+xml', woff2:'font/woff2' };
const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (!['GET','HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow:'GET, HEAD' }); return res.end();
  }
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const file = pathname === '/' ? 'index.html' : decodeURIComponent(pathname.slice(1));
    if (!PUBLIC_FILES.includes(file) || file === '.nojekyll') {
      res.writeHead(404); return res.end('No encontrado');
    }
    const data = await readFile(new URL(file, root));
    res.writeHead(200, {'Content-Type':mime[file.split('.').pop()] || 'application/octet-stream', 'Content-Length':data.length});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404); res.end('No encontrado');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Demo independiente: http://127.0.0.1:${port}/\nRaíz pública: ${fileURLToPath(root)}`));
