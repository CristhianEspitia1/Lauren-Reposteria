/** Copias responsive de las fotos aprobadas, sin modificar sus originales. */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, 'assets/propuestas-fotograficas/manifest.json'), 'utf8'));
const sources = [...new Set(manifest.items.map(item => item.proposal))].sort();
const output = path.join(root, 'assets/propuestas-fotograficas/responsive');
const widths = [320, 640, 960];
await mkdir(output, { recursive: true });
const dimensions = {};
let originalBytes = 0;
const totals = Object.fromEntries(widths.map(width => [width, 0]));
const queue = [...sources];

async function optimize(src) {
    const file = path.resolve(root, src.replace(/^\//, ''));
    const sourceStat = await stat(file);
    const { stdout } = await run('webpinfo', [file]);
    const width = Number(stdout.match(/Width:\s*(\d+)/)?.[1]);
    if (!width) throw new Error(`No se pudo leer el ancho de ${src}`);
    dimensions[src] = width;
    originalBytes += sourceStat.size;
    for (const size of widths.filter(size => size < width)) {
        const target = path.join(output, `${path.basename(src, '.webp')}-${size}.webp`);
        const previous = await stat(target).catch(() => null);
        if (!previous || previous.mtimeMs < sourceStat.mtimeMs) {
            await run('cwebp', ['-quiet', '-q', '84', '-m', '6', '-metadata', 'none', '-resize', String(size), '0', file, '-o', target]);
        }
        const bytes = (await stat(target)).size;
        totals[size] += bytes;
    }
}

await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) await optimize(queue.shift());
}));
const sorted = Object.fromEntries(sources.map(src => [src, dimensions[src]]));
await writeFile(path.join(root, 'js/image-variants.js'),
    `/** Generado por scripts/optimize-photography.mjs desde el inventario aprobado. */\nwindow.LaurenImageWidths = Object.freeze(${JSON.stringify(sorted, null, 2)});\n`);
// Mantener los srcset estáticos en la misma versión que el catálogo dinámico.
for (const page of ['index.html', 'tortas/index.html', 'alfajores/index.html', 'brownies-galletas/index.html', 'detalles/index.html']) {
    const file = path.join(root, page);
    const html = await readFile(file, 'utf8');
    const updated = html.replace(/<img\b[^>]*>/g, tag => {
        const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
        if (!dimensions[src] || !/\bsizes="/.test(tag)) return tag;
        const variants = widths.filter(width => width < dimensions[src]).map(width =>
            `/assets/propuestas-fotograficas/responsive/${path.basename(src, '.webp')}-${width}.webp ${width}w`);
        const srcset = `srcset="${[...variants, `${src} ${dimensions[src]}w`].join(', ')}"`;
        return /\bsrcset="/.test(tag) ? tag.replace(/\bsrcset="[^"]*"/, srcset) : tag.replace('<img ', `<img ${srcset} `);
    });
    if (updated !== html) await writeFile(file, updated);
}
console.log(JSON.stringify({ images: sources.length, originalBytes, variantBytes: totals }, null, 2));
