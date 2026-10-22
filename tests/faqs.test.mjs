import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { revisar } from '../scripts/pull-catalog.mjs';

// Reglas con importes conocidos: catálogo de prueba fijo; las preguntas, las del repositorio.
// Lo que sale del contexto de vm se compara copiado (clone), porque sus listas son de otro «mundo» de JavaScript.
const context = { console, Intl, URL };
context.window = context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('./fixtures/catalog-data.js', import.meta.url), 'utf8'), context);
for (const file of ['catalog-model', 'admin-model', 'faq-data', 'faqs']) vm.runInContext(fs.readFileSync(new URL(`../js/${file}.js`, import.meta.url), 'utf8'), context);
const { LaurenFaqs: F, AdminModel: M } = context;
const clone = value => JSON.parse(JSON.stringify(value));
const faq = () => clone(context.faqData);

test('Las preguntas del repositorio están completas: cada una con su texto, sus páginas y su tema', () => {
    assert.ok(F.valid(faq()));
    assert.deepEqual(clone(F.problems(faq())), []);
    assert.ok(faq().preguntas.every(q => q.paginas.length && q.paginas.every(key => F.PAGES.some(([id]) => id === key))));
    assert.equal(new Set(faq().preguntas.map(q => q.id)).size, faq().preguntas.length);
});

test('Cada página muestra sus preguntas en el orden de la lista y la de preguntas las agrupa por tema', () => {
    const tortas = clone(F.forPage('tortas').map(q => q.id));
    assert.deepEqual(tortas, faq().preguntas.filter(q => q.paginas.includes('tortas')).map(q => q.id));
    const html = F.html('preguntas');
    assert.equal((html.match(/<div class="faq-group" id="/g) || []).length, F.topics().length);
    assert.equal((html.match(/<details class="faq-item">/g) || []).length, F.forPage('preguntas').length);
    assert.equal((F.topicsHtml().match(/<a href="#/g) || []).length, F.topics().length);
});

test('Los precios de las respuestas salen del catálogo vigente y los enlaces van a la web', () => {
    assert.equal(F.answer('Desde {precio:torta-sencilla}.'), `Desde <span data-price="torta-sencilla">${context.Catalog.priceRefText('torta-sencilla')}</span>.`);
    assert.equal(F.answer('Mira {pagina:tortas}.'), 'Mira <a class="inline-link" href="/tortas/">Tortas</a>.');
    assert.equal(F.answer('Va a {pagina:otra}.'), 'Va a .');
    assert.equal(F.answer('50 % <b>'), '50&nbsp;% &lt;b&gt;');
});

test('Lo que se escribe en una pregunta nunca entra como HTML a la página', () => {
    context.faqData = { temas: [{ id: 'x"><img>', nombre: '<b>Tema</b>' }], preguntas: [{ id: 'a', pregunta: '<script>alert(1)</script>', respuesta: '<img src=x onerror=alert(1)> {precio:x"><img>}', paginas: ['tortas', 'preguntas'], tema: 'x"><img>' }] };
    const html = F.html('tortas') + F.html('preguntas') + F.topicsHtml();
    assert.doesNotMatch(html, /<script|<img|<b>/);
    context.faqData = faq();
    vm.runInContext(fs.readFileSync(new URL('../js/faq-data.js', import.meta.url), 'utf8'), context);
});

test('En el panel, los precios se escriben en palabras y se guardan igual que antes', () => {
    for (const q of faq().preguntas) {
        const friendly = F.toFriendly(q.respuesta, M.SECTIONS);
        assert.doesNotMatch(friendly, /\{precio:/, `«${q.pregunta}» quedó con un precio sin traducir`);
        const back = F.fromFriendly(friendly, M.SECTIONS);
        assert.deepEqual(clone(back.errors), []);
        assert.equal(back.value, q.respuesta);
    }
    assert.equal(F.toFriendly('{precio:torta-sencilla?porciones=25-30}', M.SECTIONS), '[precio de Torta Sencilla, 25 a 30 porciones]');
    assert.equal(F.toFriendly('{precio:@brownies,galletas}', M.SECTIONS), '[precio más bajo de Brownies y Galletas]');
    assert.equal(F.fromFriendly('[Precio de torta sencilla, 25 A 30 porciones]', M.SECTIONS).value, '{precio:torta-sencilla?porciones=25-30}');
    assert.equal(F.fromFriendly('[pagina preguntas frecuentes]', M.SECTIONS).value, '{pagina:preguntas}');
});

test('Un precio o una página que no existe no se guarda: el panel dice qué falta', () => {
    assert.match(F.fromFriendly('[precio de Torta Unicornio]', M.SECTIONS).errors[0], /No encontramos «Torta Unicornio»/);
    assert.match(F.fromFriendly('[precio de Torta Sencilla, 100 porciones]', M.SECTIONS).errors[0], /no tiene la opción «100 porciones»/);
    assert.match(F.fromFriendly('[precio más bajo de Pasteles]', M.SECTIONS).errors[0], /sección de «Pasteles»/);
    assert.match(F.fromFriendly('[página Blog]', M.SECTIONS).errors[0], /página «Blog»/);
    assert.equal(F.fromFriendly('Corchetes [como estos] quedan igual.', M.SECTIONS).value, 'Corchetes [como estos] quedan igual.');
});

test('Lo que impide publicar y lo que conviene revisar en las preguntas', () => {
    const data = faq();
    data.preguntas[0].respuesta = ' ';
    data.preguntas[1].tema = 'otro';
    data.preguntas[2].paginas = [];
    data.preguntas[3].respuesta = 'Desde {precio:no-existe}.';
    const problems = F.problems(data).map(p => p.text).join('\n');
    assert.match(problems, /escribe la respuesta/);
    assert.match(problems, /elige su tema/);
    const warnings = F.warnings(data).map(w => w.text).join('\n');
    assert.match(warnings, /no sale en ninguna página/);
    assert.doesNotMatch(warnings, /precio a consultar/, 'citar un precio que no está impide publicar: va en broken()');
    const [broken] = F.broken(data);
    assert.equal(broken.id, data.preguntas[3].id);
    assert.match(broken.text, /precio a consultar/);
});

test('Una respuesta que cita el precio de un producto oculto no se puede publicar, y se sabe antes de ocultarlo', () => {
    const data = { ...faq(), preguntas: faq().preguntas.slice(0, 1) };
    const id = 'torta-vintage';
    const name = context.catalogData[id].name;
    data.preguntas[0].respuesta = `Cuesta {precio:${id}} y {precio:${id}?porciones=ya-no-existe}.`;
    assert.deepEqual(F.citing(id, data).map(q => q.id), [data.preguntas[0].id]);
    assert.deepEqual(F.citing(`${id}-otro`, data), []);
    assert.equal(F.broken(data).length, 1, 'un tamaño que ya no existe no tiene precio');
    data.preguntas[0].respuesta = `Cuesta {precio:${id}}.`;
    assert.deepEqual(F.broken(data), []);
    const before = context.catalogData[id].visible;
    context.catalogData[id].visible = false;
    try {
        const [item] = F.broken(data);
        assert.equal(item.id, data.preguntas[0].id);
        assert.ok(item.text.includes(`[precio de ${name}]`), item.text);
    } finally { context.catalogData[id].visible = before; }
});

test('Cambios para publicar: nuevas, eliminadas, cambiadas y el orden', () => {
    const before = faq();
    assert.equal(F.changes(before, faq()).total, 0);
    const after = faq();
    after.preguntas.push({ id: 'nueva', pregunta: '¿Nueva?', respuesta: 'Sí.', paginas: ['tortas'] });
    after.preguntas.splice(1, 1);
    after.preguntas[0].respuesta += ' Gracias.';
    [after.preguntas[2], after.preguntas[3]] = [after.preguntas[3], after.preguntas[2]];
    const c = F.changes(before, after);
    assert.deepEqual(clone([c.added, c.removed, c.changed, c.moved]), [['nueva'], [before.preguntas[1].id], [before.preguntas[0].id], true]);
    assert.equal(c.total, 4);
    // Mover solo una pregunta nueva no cambia el orden de las publicadas.
    const moved = faq();
    moved.preguntas.unshift({ id: 'nueva', pregunta: '¿Nueva?', respuesta: 'Sí.', paginas: ['tortas'] });
    assert.equal(F.changes(before, moved).moved, false);
});

test('Unas preguntas dañadas o publicadas sin pasar por el panel no llegan al repositorio', () => {
    const catalog = clone(context.catalogData);
    assert.deepEqual(revisar(catalog, faq()).filter(e => !/no es de la web/.test(e)), revisar(catalog).filter(e => !/no es de la web/.test(e)));
    assert.ok(revisar(catalog, { temas: [], preguntas: 'nada' }).includes('Las preguntas frecuentes publicadas no tienen la forma esperada.'));
    const vacia = faq();
    vacia.preguntas[0].pregunta = '';
    assert.ok(revisar(catalog, vacia).some(e => e.includes('escribe la pregunta')));
});

test('Versiones: cuentan las preguntas que cambiaron entre dos publicaciones', () => {
    const catalog = clone(context.catalogData);
    const before = faq();
    const after = faq();
    after.preguntas[0].respuesta += ' Con cariño.';
    after.preguntas.pop();
    assert.equal(M.versionChanges({ catalog, faqs: after }, { catalog, faqs: before }), 'Con cambios: 2 preguntas');
    const moved = faq();
    moved.preguntas.reverse();
    assert.equal(M.versionChanges({ catalog, faqs: moved }, { catalog, faqs: before }), 'Con cambios: el orden de las preguntas');
    // Las de antes de octubre de 2026 no tienen preguntas: solo se compara el catálogo.
    assert.equal(M.versionChanges({ catalog, faqs: after }, { catalog, faqs: null }), 'Igual a la anterior');
});
