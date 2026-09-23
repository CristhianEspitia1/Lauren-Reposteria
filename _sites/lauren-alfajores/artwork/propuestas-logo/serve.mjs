import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname} from 'node:path';

const root = new URL('./', import.meta.url);
const variants = ['01-cremoso', '02-dos-tapas', '03-mordisco', '04-redondo', '05-alfi', '06-club', '07-monograma', '08-firma', '09-maicena', '10-nube', '11-relleno', '12-bombon', '13-duo'];
const allowed = new Set([
  'index.html', 'gallery.css', 'gallery.js', 'fonts/Outfit.ttf', 'alfajor.webp',
  'tres-propuestas.png', 'tres-propuestas.svg', 'ocho-propuestas.png', 'ocho-propuestas.svg', 'lauren-ocho-logos.zip',
  'cinco-favoritos.png', 'cinco-favoritos.svg', 'lauren-cinco-favoritos.zip',
  ...variants.flatMap(name => [`${name}.svg`, `${name}.png`, `${name}-claro.svg`, `${name}-simbolo.svg`])
]);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.zip':'application/zip'};
createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {res.writeHead(405).end(); return;}
  const name = new URL(req.url, 'http://localhost').pathname.slice(1) || 'index.html';
  if (!allowed.has(name)) {res.writeHead(404).end('No encontrado'); return;}
  try {
    const data = await readFile(new URL(name, root));
    res.writeHead(200, {'Content-Type':mime[extname(name)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {res.writeHead(404).end('No encontrado');}
}).listen(5181, '127.0.0.1', () => console.log('Propuestas Lauren: http://127.0.0.1:5181/'));
