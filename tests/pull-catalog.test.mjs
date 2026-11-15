import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { revisar } from '../scripts/pull-catalog.mjs';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../js/catalog-data.js', import.meta.url), 'utf8'), context);
const catalog = () => JSON.parse(JSON.stringify(context.window.catalogData));

test('El catálogo del repositorio pasa la revisión que hace el workflow antes de traer lo publicado', () => {
    assert.deepEqual(revisar(catalog()), []);
});

test('Un catálogo dañado o publicado sin pasar por el panel no llega al repositorio', () => {
    assert.deepEqual(revisar({}), ['El catálogo publicado llegó vacío.']);
    assert.deepEqual(revisar([]), ['El catálogo publicado llegó vacío.']);
    assert.match(revisar({ x: { id: 'otro', name: 'X', category: 'tortas' } })[0], /le falta su identificador/);
    const fotos = catalog();
    fotos['torta-vintage'].mainImage = '/assets/x"><script>alert(1)</script>.webp';
    assert.ok(revisar(fotos).some(e => e.includes('no es de la web')));
    const precio = catalog();
    precio['caja-x6'].price = 0;
    assert.ok(revisar(precio).some(e => e.includes('no puede ser $0')));
    const roto = catalog();
    roto['torta-sencilla'].options = 'nada';
    assert.match(revisar(roto)[0], /No se pudo revisar/);
});

test('Un «__proto__» o un identificador raro no llega a js/catalog-data.js ni a js/faq-data.js', () => {
    const arriba = JSON.parse(`{"__proto__":{"id":"__proto__","name":"X","category":"tortas"},${JSON.stringify(catalog()).slice(1)}`);
    assert.match(revisar(arriba)[0], /le falta su identificador/);
    for (const id of ['Torta Nueva', 'torta/../x', 'x'.repeat(81), 'constructor ']) {
        const raro = catalog();
        raro[id] = { ...raro['caja-x6'], id };
        assert.match(revisar(raro)[0], /le falta su identificador/, id);
    }
    const adentro = catalog();
    adentro['caja-x6'].options = JSON.parse('[{"__proto__":{"x":1},"id":"a","label":"A","choices":[]}]');
    assert.deepEqual(revisar(adentro), ['El catálogo publicado tiene un nombre de campo no permitido («__proto__»).']);
    assert.deepEqual(revisar(catalog(), JSON.parse('{"temas":[],"preguntas":[],"__proto__":{"x":1}}')), ['El catálogo publicado tiene un nombre de campo no permitido («__proto__»).']);
});

test('La temporada publicada se revisa antes de llegar a js/season-data.js', () => {
    const navidad = catalog();
    navidad['galletas-navidad'] = { ...navidad['caja-x6'], id: 'galletas-navidad', name: 'Galletas navideñas', category: 'temporada', group: 'navidad', mainImage: '/assets/propuestas-fotograficas/galletas-de-navidad.webp', images: [] };
    const season = { activa: 'navidad', temporadas: [{ id: 'navidad', titulo: 'Esta Navidad,', destacado: 'regala algo dulce.' }] };
    assert.deepEqual(revisar(navidad, null, season), []);
    assert.deepEqual(revisar(navidad, null, { activa: '', temporadas: [] }), []);
    // Un producto de temporada sin su temporada, una temporada con otra forma o un «__proto__» no llegan.
    const suelto = catalog();
    suelto['galletas-navidad'] = { ...navidad['galletas-navidad'], group: 'verano' };
    assert.ok(revisar(suelto, null, season).some(e => e.includes('elige su temporada')));
    assert.deepEqual(revisar(navidad, null, { activa: 'verano', temporadas: [] }), ['La temporada publicada no tiene la forma esperada.']);
    assert.deepEqual(revisar(navidad, null, JSON.parse('{"activa":"","temporadas":[],"__proto__":{"x":1}}')), ['El catálogo publicado tiene un nombre de campo no permitido («__proto__»).']);
    // Encendida, con el aviso hacia la sección y sin productos visibles: el panel no lo publica y el workflow no lo trae.
    assert.ok(revisar(catalog(), null, season).some(e => e.includes('no tiene productos visibles')));
});
