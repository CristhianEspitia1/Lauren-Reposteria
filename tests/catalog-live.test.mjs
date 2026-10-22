import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

// Catálogo en vivo (js/catalog-live.js): la copia local solo se reemplaza con un catálogo publicado que tenga la forma
// correcta; uno dañado o escrito sin pasar por el panel deja la web como estaba.
const read = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
const fixture = () => { const context = {}; context.window = context; vm.createContext(context); vm.runInContext(read('./fixtures/catalog-data.js'), context); return JSON.parse(JSON.stringify(context.catalogData)); };

async function publish(published) {
    const events = [];
    const context = { console, Intl, URL, AbortController, setTimeout, clearTimeout };
    context.window = context;
    context.document = { dispatchEvent: event => events.push(event.type) };
    context.CustomEvent = class { constructor(type) { this.type = type; } };
    const text = typeof published === 'string' ? published : JSON.stringify(published);
    context.fetch = async () => ({ ok: true, json: async () => ({ fields: { json: { stringValue: text } } }) });
    vm.createContext(context);
    vm.runInContext(read('./fixtures/catalog-data.js'), context);
    vm.runInContext(read('../js/catalog-model.js'), context);
    const local = context.catalogData;
    vm.runInContext(read('../js/catalog-live.js'), context);
    await new Promise(resolve => setTimeout(resolve, 20));
    return { replaced: context.catalogData !== local, events };
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
