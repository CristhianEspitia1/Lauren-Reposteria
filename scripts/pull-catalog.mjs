#!/usr/bin/env node
/**
 * Trae al repositorio el catálogo y las preguntas frecuentes publicados desde el centro de control (Firestore
 * `catalogo/actual`, de lectura pública) y vuelve a generar lo que sale de ellos: las preguntas de cada página, datos
 * estructurados, sitemap.xml y llms.txt (scripts/seo.mjs).
 * Así la primera pintura de la web, Google y los asistentes ven lo mismo que la web en vivo.
 *
 *   node scripts/pull-catalog.mjs           revisa lo publicado, escribe js/catalog-data.js y js/faq-data.js y ejecuta scripts/seo.mjs
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
const faqFile = fileURLToPath(new URL('../js/faq-data.js', import.meta.url));
const source = name => readFileSync(fileURLToPath(new URL(`../js/${name}.js`, import.meta.url)), 'utf8');

/** Problemas del catálogo (y de las preguntas, si llegan) publicados, en palabras del panel; vacío si se puede traer. */
export function revisar(published, faqs = null) {
    if (!published || typeof published !== 'object' || Array.isArray(published) || !Object.keys(published).length) return ['El catálogo publicado llegó vacío.'];
    // Identificadores como los que crea el panel (AdminModel.slug): así ninguno es «__proto__» ni rompe el archivo.
    const broken = Object.entries(published).filter(([id, p]) => !/^[a-z0-9-]{1,80}$/.test(id) || !p || typeof p !== 'object' || p.id !== id || typeof p.name !== 'string' || typeof p.category !== 'string');
    if (broken.length) return broken.map(([id]) => `«${id}»: le falta su identificador, su nombre o su sección.`);
    const context = { Intl, catalogData: published };
    context.window = context;
    vm.createContext(context);
    try {
        // Un «__proto__» escrito en js/catalog-data.js o js/faq-data.js cambiaría el prototipo del objeto al cargarlo.
        const unsafe = value => Boolean(value) && typeof value === 'object' && Object.keys(value).some(key => key === '__proto__' || unsafe(value[key]));
        if (unsafe(published) || unsafe(faqs)) return ['El catálogo publicado tiene un nombre de campo no permitido («__proto__»).'];
        for (const name of ['catalog-model', 'admin-model', 'faqs']) vm.runInContext(source(name), context);
        const errors = [...context.AdminModel.validate(Object.values(published))];
        // La web debe poder dibujar el precio de cada tarjeta sin fallar.
        for (const product of context.Catalog.all()) context.Catalog.priceLabel(product);
        if (faqs) {
            if (!context.LaurenFaqs.valid(faqs)) return [...errors, 'Las preguntas frecuentes publicadas no tienen la forma esperada.'];
            context.faqData = faqs;
            errors.push(...context.LaurenFaqs.problems(faqs).map(problem => problem.text));
            for (const key of context.LaurenFaqs.PAGES.map(([id]) => id)) context.LaurenFaqs.html(key);
        }
        return errors;
    } catch (error) { return [`No se pudo revisar el catálogo: ${error.message}`]; }
}

async function main() {
    const check = process.argv.includes('--check');
    const fail = message => { console.error(message); process.exit(2); };
    let document, published, faqs = null;
    try {
        const response = await fetch(PUBLISHED);
        if (!response.ok) fail(`No pudimos leer el catálogo publicado (HTTP ${response.status}).`);
        document = await response.json();
        published = JSON.parse(document.fields?.json?.stringValue ?? 'null');
        // Las preguntas llegan solo si ya se publicaron desde el panel; si no, se quedan las del repositorio.
        if (document.fields?.preguntas?.stringValue) faqs = JSON.parse(document.fields.preguntas.stringValue);
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
    const faqText = readFileSync(faqFile, 'utf8');
    const faqNext = faqs ? `${faqText.slice(0, faqText.indexOf('window.faqData = '))}window.faqData = ${JSON.stringify(faqs, null, 4)};\n` : faqText;

    // Sin el correo de quien publicó: este texto termina en el historial público del repositorio.
    console.log(`Publicado el ${document.fields.updatedAt?.timestampValue ?? '¿?'}: ${ids(published).length} productos${faqs ? ` y ${faqs.preguntas.length} preguntas` : ''}.`);
    if (next === text && faqNext === faqText) { console.log('El repositorio ya tiene el catálogo publicado.'); process.exit(0); }
    if (next !== text) console.log(`Nuevos: ${names(added)}\nEliminados: ${names(removed)}\nCon cambios: ${names(changed)}`);
    if (faqNext !== faqText) console.log('Preguntas frecuentes: con cambios');
    if (check) { console.error('El repositorio está atrasado: ejecuta node scripts/pull-catalog.mjs'); process.exit(1); }

    const problems = revisar(published, faqs);
    if (problems.length) fail(`El catálogo publicado tiene problemas; no se cambia nada:\n- ${problems.slice(0, 10).join('\n- ')}`);
    if (next !== text) writeFileSync(file, next);
    if (faqNext !== faqText) writeFileSync(faqFile, faqNext);
    console.log(`${[next !== text && 'js/catalog-data.js', faqNext !== faqText && 'js/faq-data.js'].filter(Boolean).join(' y ')} al día. Generando SEO…`);
    execFileSync(process.execPath, [fileURLToPath(new URL('./seo.mjs', import.meta.url))], { stdio: 'inherit' });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
