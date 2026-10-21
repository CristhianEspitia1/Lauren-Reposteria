import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PAGES, ORIGIN, faqs, ASSET_PAGES, assetVersion } from '../scripts/seo.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const pages = PAGES.map(page => ({ page, html: read(page.file) }));
const meta = (html, attr, name) => html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];
const jsonld = html => JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
const exists = url => {
    const clean = decodeURI(url.split(/[?#]/)[0]);
    const file = path.join(root, clean.endsWith('/') ? clean + 'index.html' : clean);
    return fs.existsSync(file);
};

test('El bloque SEO generado está al día con el catálogo', () => {
    execFileSync(process.execPath, [path.join(root, 'scripts/seo.mjs'), '--check'], { cwd: root, stdio: 'pipe' });
});

test('Cada página pide sus CSS y JS con la huella de su contenido', () => {
    for (const file of ASSET_PAGES) {
        const refs = [...read(file).matchAll(/\s(?:href|src)="\/((?:css|js)\/[^"?]+)(?:\?v=([a-f0-9]+))?"/g)];
        assert.ok(refs.length >= 4, `${file}: no carga CSS ni JS propios`);
        for (const [, asset, version] of refs) {
            assert.ok(fs.existsSync(path.join(root, asset)), `${file}: ${asset} no existe`);
            assert.equal(version, assetVersion(asset), `${file}: ${asset} ${version ? 'con huella vieja' : 'sin huella'}`);
        }
    }
});

test('Cada página tiene título, descripción, canonical y Open Graph válidos', () => {
    const titles = new Set(), descriptions = new Set();
    for (const { page, html } of pages) {
        const title = html.match(/<title>(.*?)<\/title>/)[1];
        const description = meta(html, 'name', 'description');
        assert.ok(title.length >= 30 && title.length <= 60, `${page.file}: título de ${title.length} caracteres`);
        assert.ok(description.length >= 120 && description.length <= 160, `${page.file}: descripción de ${description.length} caracteres`);
        assert.ok(title.includes('Medellín') && description.includes('Medellín'), `${page.file}: falta la ubicación`);
        titles.add(title); descriptions.add(description);
        assert.equal(html.match(/<link rel="canonical" href="([^"]+)">/)[1], ORIGIN + page.path);
        assert.equal(meta(html, 'property', 'og:url'), ORIGIN + page.path);
        assert.ok(exists(meta(html, 'property', 'og:image').replace(ORIGIN, '')), `${page.file}: og:image inexistente`);
        assert.match(html, /<html lang="es-CO">/);
        assert.equal((html.match(/<h1\b/g) || []).length, 1, `${page.file}: debe tener un único h1`);
        assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/);
    }
    assert.equal(titles.size, pages.length, 'Títulos duplicados');
    assert.equal(descriptions.size, pages.length, 'Descripciones duplicadas');
});

test('Los datos estructurados describen el negocio, la carta y las preguntas visibles', () => {
    for (const { page, html } of pages) {
        const graph = jsonld(html)['@graph'];
        const byType = type => graph.filter(node => [].concat(node['@type']).includes(type));
        const [bakery] = byType('Bakery');
        assert.equal(bakery.telephone, '+573104442796');
        assert.equal(bakery.address.addressLocality, 'Medellín');
        assert.ok(exists(bakery.logo.url.replace(ORIGIN, '')));
        const [webpage] = byType(page.type);
        assert.equal(webpage.url, ORIGIN + page.path);
        assert.deepEqual(webpage.mainEntity.map(q => q.name), faqs(html).map(q => q.question));
        if (page.path === '/') { assert.equal(byType('Menu').length, 1); assert.equal(byType('VideoObject').length, 1); continue; }
        assert.deepEqual(byType('BreadcrumbList')[0].itemListElement.map(i => i.item), [`${ORIGIN}/`, ORIGIN + page.path]);
        if (!page.categories.length) continue; // Páginas informativas, sin carta de productos.
        const items = byType('MenuSection')[0].hasMenuItem;
        assert.ok(items.length > 0);
        for (const item of items) {
            for (const image of item.image || []) assert.ok(exists(image.replace(ORIGIN, '')), `${item.name}: ${image}`);
            if (item.offers) assert.ok(item.offers.price > 0 && item.offers.priceCurrency === 'COP');
        }
    }
});

test('Los precios de los textos salen del catálogo, no se escriben a mano', () => {
    for (const { page, html } of pages) {
        const body = html.slice(html.indexOf('<body'));
        const loose = body.replace(/<span data-price="[^"]+">[^<]*<\/span>/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
        assert.doesNotMatch(loose, /\$\d{1,3}(?:\.\d{3})+/, `${page.file}: precio escrito a mano; usar <span data-price="…">`);
        // Las preguntas frecuentes las escribe el negocio en el panel, que avisa si citan un producto oculto o sin precio
        // («precio a consultar»); aquí no frenan la sincronización del catálogo. Los demás textos de la página, sí.
        const fixed = body.replace(/<div data-faqs="[^"]+">[\s\S]*?<\/div><!-- \/preguntas -->/g, '');
        for (const [, ref, text] of fixed.matchAll(/<span data-price="([^"]+)">([^<]*)<\/span>/g)) assert.match(text, /^\$\d/, `${page.file}: ${ref} sin precio en el catálogo`);
    }
});

test('Enlaces y recursos internos apuntan a archivos existentes', () => {
    const files = ['404.html', ...pages.map(p => p.page.file), ...fs.readdirSync(path.join(root, 'html')).map(f => `html/${f}`)];
    for (const file of files) {
        const html = read(file);
        for (const [, url] of html.matchAll(/\b(?:href|src|data-src|poster)="(\/[^"/][^"]*|\/)"/g)) assert.ok(exists(url), `${file}: ${url}`);
        for (const [, list] of html.matchAll(/\bsrcset="([^"]+)"/g)) for (const candidate of list.split(',')) assert.ok(exists(candidate.trim().split(' ')[0]), `${file}: ${candidate}`);
        assert.doesNotMatch(html, /(?:href|src)="\.\.\//, `${file}: rutas relativas antiguas`);
        for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) assert.match(tag, /\balt="/, `${file}: imagen sin alt`);
    }
    for (const source of ['js/catalog-data.js', 'js/gallery-data.js']) {
        for (const [, src] of read(source).matchAll(/["'](\/assets\/[^"']+)["']/g)) assert.ok(exists(src), `${source}: ${src}`);
    }
});

test('Las direcciones anteriores redirigen a las nuevas', () => {
    const map = { inicio: '/', tortas: '/tortas/', alfajores: '/alfajores/', 'brownies-galletas': '/brownies-galletas/', detalles: '/detalles/' };
    for (const [name, target] of Object.entries(map)) {
        const html = read(`html/${name}.html`);
        assert.match(html, new RegExp(`http-equiv="refresh" content="0; url=${target}"`));
        assert.match(html, new RegExp(`rel="canonical" href="${ORIGIN}${target}"`));
    }
});

test('Sitemap, robots y manifest son coherentes', () => {
    const sitemap = read('sitemap.xml');
    const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
    assert.deepEqual(locs, PAGES.map(p => ORIGIN + p.path));
    for (const [, image] of sitemap.matchAll(/<image:loc>(.*?)<\/image:loc>/g)) assert.ok(exists(image.replace(ORIGIN, '')), image);
    assert.match(read('robots.txt'), new RegExp(`Sitemap: ${ORIGIN}/sitemap.xml`));
    const manifest = JSON.parse(read('site.webmanifest'));
    for (const icon of manifest.icons) assert.ok(exists(icon.src), icon.src);
    for (const icon of ['/favicon.ico', '/assets/icons/apple-touch-icon.png', '/llms.txt']) assert.ok(exists(icon), icon);
});
