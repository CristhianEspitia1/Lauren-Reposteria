import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

// Catálogo en vivo (js/catalog-live.js): la copia local solo se reemplaza con un catálogo publicado que tenga la forma
// correcta; uno dañado o escrito sin pasar por el panel deja la web como estaba.
const read = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const fixture = () => { const context = {}; context.window = context; vm.createContext(context); vm.runInContext(read('./fixtures/catalog-data.js'), context); return JSON.parse(JSON.stringify(context.catalogData)); };

async function publish(published, season) {
    const events = [];
    const context = { console, Intl, URL, AbortController, setTimeout, clearTimeout };
    context.window = context;
    context.document = { dispatchEvent: event => events.push(event.type) };
    context.CustomEvent = class { constructor(type) { this.type = type; } };
    const text = typeof published === 'string' ? published : JSON.stringify(published);
    context.fetch = async () => ({ ok: true, json: async () => ({ fields: { json: { stringValue: text }, ...(season === undefined ? {} : { temporada: { stringValue: typeof season === 'string' ? season : JSON.stringify(season) } }) } }) });
    vm.createContext(context);
    vm.runInContext(read('./fixtures/catalog-data.js'), context);
    for (const file of ['season-data', 'season', 'catalog-model']) vm.runInContext(read(`../js/${file}.js`), context);
    const local = context.catalogData, localSeason = context.seasonData, before = context.LaurenSeason.active()?.id || '';
    vm.runInContext(read('../js/catalog-live.js'), context);
    await new Promise(resolve => setTimeout(resolve, 20));
    // Al terminar de leer lo publicado, con cambios o sin ellos, la página recibe `catalog:settled` (de ahí sale el aviso de temporada).
    assert.equal(events.pop(), 'catalog:settled');
    assert.equal(context.catalogSettled, true);
    return { replaced: context.catalogData !== local, season: context.seasonData !== localSeason, before, active: context.LaurenSeason.active()?.id || '', shown: context.Catalog.all().map(p => p.id), events };
}

test('Un catálogo publicado con cambios válidos reemplaza la copia local y avisa a la página', async () => {
    const data = fixture();
    data['caja-x6'].name = 'Caja x6 Alfajores clásicos';
    const result = await publish(data);
    assert.equal(result.replaced, true);
    assert.deepEqual(result.events, ['catalog:updated']);
});

test('Un catálogo con listas o textos de otro tipo no llega a la página', async () => {
    const broken = [
        p => { p.includes = '<b>x</b>'; },
        p => { p.images = 5; },
        p => { p.notes = { a: 1 }; },
        p => { p.options = 'porciones'; },
        p => { p.description = ['texto']; },
        p => { p.mainImage = { src: '/assets/x.webp' }; },
        p => { p.options = [{ id: 'tamano', label: 'Tamaño', choices: [{ value: 1, label: 'Uno' }] }]; },
        p => { p.options = [{ id: 'tamano', label: 'Tamaño', choices: 'uno' }]; },
        p => { p.options = [null]; },
        p => { p.personalization = { enabled: true, fields: 'tema' }; },
        p => { p.personalization = ['tema']; }
    ];
    for (const change of broken) {
        const data = fixture();
        change(data['caja-x6']);
        const result = await publish(data);
        assert.equal(result.replaced, false, change.toString());
        assert.deepEqual(result.events, [], change.toString());
    }
});

test('Un producto con un identificador que no crea el panel no llega a la página', async () => {
    for (const id of ['Torta Nueva', 'constructor ', 'x'.repeat(81)]) {
        const data = fixture();
        data[id] = { ...data['caja-x6'], id };
        assert.equal((await publish(data)).replaced, false, id);
    }
});

test('JSON dañado o con __proto__ no cambia nada ni contamina los objetos', async () => {
    for (const text of ['{', '[]', '{}', 'null', '{"__proto__":{"polluted":true},"x":{"id":"x","name":"X","category":"tortas"}}']) {
        const result = await publish(text);
        assert.equal(result.replaced, false, text);
    }
    assert.equal({}.polluted, undefined);
});

test('La temporada publicada llega a la página y sus productos solo existen mientras está encendida', async () => {
    const data = fixture();
    data['galletas-navidad'] = { ...data['caja-x6'], id: 'galletas-navidad', name: 'Galletas navideñas', category: 'temporada', group: 'navidad' };
    const off = await publish(data, { activa: '', temporadas: [] });
    assert.equal(off.replaced, true);
    assert.equal(off.shown.includes('galletas-navidad'), false);
    const on = await publish(data, { activa: 'navidad', temporadas: [{ id: 'navidad', titulo: 'Esta Navidad,' }] });
    assert.deepEqual([on.season, on.active, on.shown.includes('galletas-navidad')], [true, 'navidad', true]);
    assert.deepEqual(on.events, ['catalog:updated']);
    // Otra temporada encendida no muestra los productos de Navidad; una que ya pasó su último día, tampoco.
    assert.equal((await publish(data, { activa: 'halloween', temporadas: [] })).shown.includes('galletas-navidad'), false);
    assert.equal((await publish(data, { activa: 'navidad', temporadas: [{ id: 'navidad', hasta: '2020-12-24' }] })).shown.includes('galletas-navidad'), false);
});

test('Una temporada dañada o escrita sin pasar por el panel deja la web como estaba', async () => {
    const broken = ['{', '[]', 'null', { activa: 'verano', temporadas: [] }, { activa: 'navidad' }, { activa: 'navidad', temporadas: [{ id: 'navidad', titulo: ['x'] }] },
        { activa: '', temporadas: [{ id: 'navidad', hasta: '24/12/2026' }] }, { activa: '', temporadas: [{ id: 'navidad', aviso: { destino: 'https://otro-sitio.com' } }] },
        { activa: '', temporadas: [{ id: 'navidad', texto: 'x'.repeat(5000) }] }, { activa: '', temporadas: [{ id: 'navidad' }, { id: 'navidad' }] }];
    for (const season of broken) {
        const result = await publish(fixture(), season);
        // La temporada que ya tenía la web (la de js/season-data.js, encendida o no) sigue igual.
        assert.deepEqual([result.season, result.active], [false, result.before], JSON.stringify(season));
    }
});
