#!/usr/bin/env node
/**
 * Trae al repositorio el catálogo publicado desde el centro de control (Firestore `catalogo/actual`, de lectura
 * pública) y vuelve a generar lo que sale de él: datos estructurados, sitemap.xml y llms.txt (scripts/seo.mjs).
 * Así la primera pintura de la web, Google y los asistentes ven lo mismo que la web en vivo.
 *
 *   node scripts/pull-catalog.mjs           revisa lo publicado, escribe js/catalog-data.js y ejecuta scripts/seo.mjs
 *   node scripts/pull-catalog.mjs --check   no escribe nada; sale con 1 si el repositorio está atrasado
 *
 * Antes de escribir, revisa lo publicado con las mismas reglas que el panel aplica al publicar (admin-model.js):
 * si alguien publicara un catálogo dañado sin pasar por el panel, no llega al repositorio.
 * Si algo falla (sin conexión, catálogo vacío o con problemas), sale con 2 y no cambia nada. Lo ejecuta cada hora
 * el workflow .github/workflows/catalogo.yml, que hace commit y push si hay cambios; también se puede ejecutar a mano.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const PUBLISHED = 'https://firestore.googleapis.com/v1/projects/lauren-reposteria/databases/(default)/documents/catalogo/actual';
const file = fileURLToPath(new URL('../js/catalog-data.js', import.meta.url));
const source = name => readFileSync(fileURLToPath(new URL(`../js/${name}.js`, import.meta.url)), 'utf8');

/** Problemas del catálogo publicado, en palabras del panel; vacío si se puede traer. */
export function revisar(published) {
    if (!published || typeof published !== 'object' || Array.isArray(published) || !Object.keys(published).length) return ['El catálogo publicado llegó vacío.'];
    const broken = Object.entries(published).filter(([id, p]) => !p || typeof p !== 'object' || p.id !== id || typeof p.name !== 'string' || typeof p.category !== 'string');
    if (broken.length) return broken.map(([id]) => `«${id}»: le falta su identificador, su nombre o su sección.`);
    const context = { Intl, catalogData: published };
    context.window = context;
    vm.createContext(context);
    try {
        for (const name of ['catalog-model', 'admin-model']) vm.runInContext(source(name), context);
        const errors = context.AdminModel.validate(Object.values(published));
        // La web debe poder dibujar el precio de cada tarjeta sin fallar.
        for (const product of context.Catalog.all()) context.Catalog.priceLabel(product);
        return [...errors];
    } catch (error) { return [`No se pudo revisar el catálogo: ${error.message}`]; }
}

async function main() {
    const check = process.argv.includes('--check');
    const fail = message => { console.error(message); process.exit(2); };
    let document, published;
    try {
        const response = await fetch(PUBLISHED);
        if (!response.ok) fail(`No pudimos leer el catálogo publicado (HTTP ${response.status}).`);
        document = await response.json();
        published = JSON.parse(document.fields?.json?.stringValue ?? 'null');
    } catch (error) { fail(`No pudimos leer el catálogo publicado: ${error.message}`); }
    if (!published || typeof published !== 'object' || Array.isArray(published) || !Object.keys(published).length) fail('El catálogo publicado llegó vacío; no se cambia nada.');

    const text = readFileSync(file, 'utf8');
    const context = { window: {} };
    vm.createContext(context);
    vm.runInContext(text, context);
    const current = context.window.catalogData;

    const ids = data => Object.keys(data);
    const names = list => list.map(id => `${(published[id] || current[id]).name} (${id})`).join(', ') || '—';
    const removed = ids(current).filter(id => !published[id]);
    const added = ids(published).filter(id => !current[id]);
    const changed = ids(published).filter(id => current[id] && JSON.stringify(current[id]) !== JSON.stringify(published[id]));
    const next = `${text.slice(0, text.indexOf('window.catalogData = '))}window.catalogData = ${JSON.stringify(published, null, 4)};\n`;

    // Sin el correo de quien publicó: este texto termina en el historial público del repositorio.
    console.log(`Publicado el ${document.fields.updatedAt?.timestampValue ?? '¿?'}: ${ids(published).length} productos.`);
    if (next === text) { console.log('El repositorio ya tiene el catálogo publicado.'); process.exit(0); }
    console.log(`Nuevos: ${names(added)}\nEliminados: ${names(removed)}\nCon cambios: ${names(changed)}`);
    if (check) { console.error('El repositorio está atrasado: ejecuta node scripts/pull-catalog.mjs'); process.exit(1); }

    const problems = revisar(published);
    if (problems.length) fail(`El catálogo publicado tiene problemas; no se cambia nada:\n- ${problems.slice(0, 10).join('\n- ')}`);
    writeFileSync(file, next);
    console.log('js/catalog-data.js actualizado. Generando SEO…');
    execFileSync(process.execPath, [fileURLToPath(new URL('./seo.mjs', import.meta.url))], { stdio: 'inherit' });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
