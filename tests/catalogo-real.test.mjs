/**
 * El catálogo real (js/catalog-data.js, el que llega desde el centro de control): reglas que deben cumplirse con
 * cualquier precio, producto o torta que el negocio publique. Nada de importes ni identificadores fijos: esos viven
 * en el catálogo de prueba (tests/fixtures/catalog-data.js). Si una de estas falla, el workflow «Catálogo publicado»
 * no trae lo publicado, así que cada fallo debe ser un problema real del catálogo.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const context = { console, Intl, URL };
context.window = context;
vm.createContext(context);
for (const file of ['catalog-data', 'catalog-model', 'admin-model', 'image-variants', 'brand-icons', 'ui', 'flavors']) vm.runInContext(fs.readFileSync(new URL(`../js/${file}.js`, import.meta.url), 'utf8'), context);
const { Catalog, AdminModel: M, LaurenFlavors: F, LaurenUI } = context;
const real = () => Object.values(M.clone(context.catalogData));

test('Catálogo real: el panel lo independiza sin errores (cada grupo con lo suyo)', () => {
    const migrated = M.migrate(real());
    assert.deepEqual([...M.validate(migrated)], []);
    assert.ok(migrated.every(p => !p.basedOn));
    assert.equal(JSON.stringify(M.migrate(migrated)), JSON.stringify(migrated));
});
test('Catálogo real: publicarlo sin cambios desde el panel lo deja idéntico', () => {
    assert.deepEqual([...M.validate(real())], []);
    assert.equal(JSON.stringify(M.toCatalog(M.normalize(real()))), JSON.stringify(context.catalogData));
});
test('Catálogo real: cada producto visible muestra su precio y se puede abrir', () => {
    for (const p of Catalog.all()) {
        const label = Catalog.priceLabel(p);
        assert.ok(label.text, p.id);
        const selection = Catalog.defaults(p);
        const value = Catalog.price(p, selection);
        assert.ok(value === null || Number.isSafeInteger(value), `${p.id}: precio de la ficha ${value}`);
        // Lo único que puede faltar al abrir la ficha es lo que escribe o marca el cliente (colores). (Los avisos se copian a un arreglo
        // de este contexto para compararlos con [].)
        const fields = new Set([...Catalog.fields(p, selection).map(f => f.id), ...p.options.filter(o => o.multiple).map(o => o.id)]);
        assert.deepEqual([...Catalog.validate(p, selection, {}).filter(e => !fields.has(e.id)).map(e => e.message)], [], p.id);
        if (Catalog.quoteOnly(p)) continue;
        const range = Catalog.range(p);
        if (range) {
            assert.ok(label.text.includes(Catalog.money(range.min)), `${p.id}: tarjeta ${label.text}`);
            assert.equal(label.from, range.min !== range.max, `${p.id}: «Desde»`);
        } else assert.equal(label.text, 'Cotiza por WhatsApp', p.id);
    }
});
test('Catálogo real: las tortas se pueden pedir y mandan su foto a WhatsApp', () => {
    const tortas = Catalog.all().filter(p => p.category === 'tortas');
    assert.ok(tortas.length, 'hay tortas visibles');
    for (const p of tortas) {
        const own = context.catalogData[p.id];
        if (own.basedOn) assert.ok(context.catalogData[own.basedOn] && !context.catalogData[own.basedOn].basedOn, `${p.id}: su torta base existe`);
        assert.equal(Catalog.quoteOnly(p), false, p.id);
        assert.match(Catalog.photo(p), /^https:\/\//, `${p.id}: foto para WhatsApp`);
    }
    const featured = Catalog.featured();
    assert.ok(featured.length <= Catalog.FEATURED && featured.every(p => p.category === 'tortas'));
});
test('Catálogo real: «Un sabor para recordar» se arma con sus bizcochos y rellenos', () => {
    const groups = F.groups();
    const html = F.html(LaurenUI.imageAttributes, LaurenUI.escape);
    for (const id of ['sabor', 'relleno']) {
        const items = F.withPhotos(id, groups[id]);
        const photos = items.filter(i => i.photo).map(i => i.photo.key);
        assert.equal(new Set(photos).size, photos.length, `${id}: cada foto una sola vez`);
        for (const { choice } of items) assert.ok(html.includes(LaurenUI.escape(choice.label)), `${id}: ${choice.label}`);
    }
    assert.match(F.intro(), /tu combinación favorita\.$/);
});
