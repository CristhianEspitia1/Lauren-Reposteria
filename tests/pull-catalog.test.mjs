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
