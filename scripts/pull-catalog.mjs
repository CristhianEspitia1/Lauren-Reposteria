#!/usr/bin/env node
/**
 * Trae al repositorio el catálogo publicado desde el centro de control (Firestore `catalogo/actual`, de lectura
 * pública) y vuelve a generar lo que sale de él: datos estructurados, sitemap.xml y llms.txt (scripts/seo.mjs).
 * Así la primera pintura de la web, Google y los asistentes ven lo mismo que la web en vivo.
 *
 *   node scripts/pull-catalog.mjs           escribe js/catalog-data.js y ejecuta scripts/seo.mjs
 *   node scripts/pull-catalog.mjs --check   no escribe nada; sale con 1 si el repositorio está atrasado
 *
 * Si algo falla (sin conexión, catálogo vacío), sale con 2 y no cambia nada. Lo ejecuta cada hora el workflow
 * .github/workflows/catalogo.yml, que hace commit y push si hay cambios; también se puede ejecutar a mano.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const PUBLISHED = 'https://firestore.googleapis.com/v1/projects/lauren-reposteria/databases/(default)/documents/catalogo/actual';
const file = fileURLToPath(new URL('../js/catalog-data.js', import.meta.url));
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

console.log(`Publicado el ${document.fields.updatedAt?.timestampValue ?? '¿?'} por ${document.fields.updatedBy?.stringValue ?? '¿?'}: ${ids(published).length} productos.`);
if (next === text) { console.log('El repositorio ya tiene el catálogo publicado.'); process.exit(0); }
console.log(`Nuevos: ${names(added)}\nEliminados: ${names(removed)}\nCon cambios: ${names(changed)}`);
if (check) { console.error('El repositorio está atrasado: ejecuta node scripts/pull-catalog.mjs'); process.exit(1); }

writeFileSync(file, next);
console.log('js/catalog-data.js actualizado. Generando SEO…');
execFileSync(process.execPath, [fileURLToPath(new URL('./seo.mjs', import.meta.url))], { stdio: 'inherit' });
