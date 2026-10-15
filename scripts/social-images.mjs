#!/usr/bin/env node
/**
 * Imágenes para compartir (Open Graph, 1200 × 630 JPEG) e iconos PNG/ICO.
 * Requiere Google Chrome y `sips` (macOS). Uso: node scripts/social-images.mjs
 * Los archivos generados se versionan; ejecutar solo al cambiar fotos o marca.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const run = promisify(execFile);
const root = fileURLToPath(new URL('../', import.meta.url));
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const template = pathToFileURL(path.join(root, 'scripts/social-card.html')).href;
const social = path.join(root, 'assets/social');

export const cards = {
    inicio: { eyebrow: 'Repostería artesanal en Medellín', title: 'Un bocado', em: 'de alegría.', photo: '/assets/propuestas-fotograficas/torta-vintage.webp', focus: '50% 40%' },
    tortas: { eyebrow: 'Tortas personalizadas · Medellín', title: 'Tu momento.', em: 'Tu torta.', photo: '/assets/propuestas-fotograficas/galeria-tortas-26.webp', focus: '50% 45%' },
    alfajores: { eyebrow: 'Alfajores artesanales · Medellín', title: 'Pequeños bocados', em: 'de felicidad.', photo: '/assets/propuestas-fotograficas/torta-alfajor.webp', focus: '50% 50%' },
    'brownies-galletas': { eyebrow: 'Brownies y galletas · Medellín', title: 'Chocolate que', em: 'se hace querer.', photo: '/assets/propuestas-fotograficas/galeria-brownies-01.webp', focus: '50% 50%' },
    detalles: { eyebrow: 'Detalles y regalos · Medellín', title: 'Una forma dulce', em: 'de decirlo.', photo: '/assets/propuestas-fotograficas/detalle-golden-1.webp', focus: '50% 50%' }
};

async function shoot(query, width, height, output) {
    const png = output.replace(/\.\w+$/, '.png');
    await run(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
        '--allow-file-access-from-files', '--virtual-time-budget=6000', `--window-size=${width},${height}`,
        `--screenshot=${png}`, `${template}?${new URLSearchParams(query)}`]);
    if (output.endsWith('.png')) return;
    const format = output.endsWith('.ico') ? 'ico' : 'jpeg';
    await run('sips', ['-s', 'format', format, ...(format === 'jpeg' ? ['-s', 'formatOptions', '84'] : []), png, '--out', output]);
    await rm(png);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    await mkdir(social, { recursive: true });
    for (const [page, card] of Object.entries(cards)) await shoot(card, 1200, 630, path.join(social, `${page}.jpg`));
    // Iconos: el SVG sigue siendo el favicon principal; PNG/ICO cubren Apple, Android y lectores antiguos.
    await shoot({ icon: 180, pad: 0, bg: '#d0b4d7' }, 180, 180, path.join(root, 'assets/icons/apple-touch-icon.png'));
    for (const size of [192, 512]) await shoot({ icon: size }, size, size, path.join(root, `assets/icons/icon-${size}.png`));
    await shoot({ icon: 512, pad: 0.1, bg: '#d0b4d7' }, 512, 512, path.join(root, 'assets/icons/icon-maskable-512.png'));
    await shoot({ icon: 48 }, 48, 48, path.join(root, 'favicon.ico'));
    // Logotipo rasterizado para datos estructurados (Google no admite SVG como logo).
    await shoot({ logo: 1 }, 600, 360, path.join(root, 'assets/icons/logo.png'));
    console.log('Imágenes sociales e iconos actualizados.');
}
