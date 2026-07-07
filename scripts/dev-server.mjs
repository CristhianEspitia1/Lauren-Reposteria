#!/usr/bin/env node
/**
 * Servidor estático de desarrollo para Lauren Repostería.
 * Uso: node scripts/dev-server.mjs [puerto]
 * Sirve la raíz del proyecto con MIME correctos, soporte de Range para video
 * y 404.html personalizado, imitando el comportamiento de GitHub Pages.
 */
import http from 'node:http';
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2]) || 5173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

async function resolveFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch {
    return null;
  }
  const abs = path.normalize(path.join(ROOT, decoded));
  if (!abs.startsWith(ROOT)) return null;
  try {
    const st = await fs.stat(abs);
    if (st.isDirectory()) {
      const idx = path.join(abs, 'index.html');
      await fs.access(idx);
      return { abs: idx, size: (await fs.stat(idx)).size };
    }
    return { abs, size: st.size };
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? '/');
  if (!file) {
    const notFound = await resolveFile('/404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    if (notFound) createReadStream(notFound.abs).pipe(res);
    else res.end('<h1>404</h1>');
    return;
  }
  const type = MIME[path.extname(file.abs).toLowerCase()] ?? 'application/octet-stream';
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), file.size - 1) : file.size - 1;
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Range': `bytes ${start}-${end}/${file.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
    });
    createReadStream(file.abs, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': file.size, 'Accept-Ranges': 'bytes' });
  createReadStream(file.abs).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Lauren Repostería — servidor local en http://127.0.0.1:${PORT}/`);
});
