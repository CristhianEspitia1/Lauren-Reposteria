#!/usr/bin/env node
/** Servidor local: MIME, HEAD, rangos de video y rutas limitadas al proyecto. */
import http from 'node:http';
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = await fs.realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const PORT = Number(process.argv[2]) || 5173;
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
async function resolveFile(requestPath) {
    try {
        const decoded = decodeURIComponent(requestPath.split('?')[0].split('#')[0]);
        if (decoded.includes('\0') || decoded.split(/[\\/]/).some(part => part.startsWith('.'))) return null;
        let target = path.resolve(ROOT, '.' + decoded);
        if (target !== ROOT && !target.startsWith(ROOT + path.sep)) return null;
        if ((await fs.stat(target)).isDirectory()) target = path.join(target, 'index.html');
        target = await fs.realpath(target);
        if (!target.startsWith(ROOT + path.sep)) return null;
        const stat = await fs.stat(target);
        return stat.isFile() ? { path: target, size: stat.size } : null;
    } catch { return null; }
}
function stream(file, response, options) {
    const input = createReadStream(file.path, options);
    input.on('error', () => response.destroy());
    input.pipe(response);
    response.on('close', () => input.destroy());
}
http.createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-cache');
    if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
    }
    const file = await resolveFile(request.url || '/');
    if (!file) {
        const error = await resolveFile('/404.html');
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        if (error && request.method !== 'HEAD') stream(error, response); else response.end();
        return;
    }
    const headers = { 'Content-Type': MIME[path.extname(file.path)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Content-Length': file.size };
    if (request.headers.range && request.method !== 'HEAD') {
        const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
        let start = 0, end = file.size - 1;
        if (range?.[1]) { start = Number(range[1]); if (range[2]) end = Math.min(Number(range[2]), end); }
        else if (range?.[2]) start = Math.max(0, file.size - Number(range[2]));
        if (!range || (!range[1] && !range[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= file.size || end < 0) {
            response.writeHead(416, { 'Content-Range': `bytes */${file.size}` }); response.end(); return;
        }
        response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${file.size}`, 'Content-Length': end - start + 1 });
        stream(file, response, { start, end }); return;
    }
    response.writeHead(200, headers);
    if (request.method === 'HEAD') response.end(); else stream(file, response);
}).listen(PORT, '127.0.0.1', () => console.log(`Lauren Repostería — http://127.0.0.1:${PORT}/`));
