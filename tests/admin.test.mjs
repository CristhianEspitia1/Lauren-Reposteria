import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const context = { console, Intl, URL };
context.window = context;
vm.createContext(context);
for (const file of ['catalog-data', 'catalog-model', 'admin-model']) vm.runInContext(fs.readFileSync(new URL(`../js/${file}.js`, import.meta.url), 'utf8'), context);
const { AdminModel: M, Catalog } = context;
const products = () => Object.values(M.clone(context.catalogData));

test('Publicar sin cambios deja el catálogo idéntico', () => {
    const data = M.toCatalog(M.normalize(products()));
    assert.equal(JSON.stringify(data), JSON.stringify(context.catalogData));
    assert.equal(M.validate(products()).length, 0);
    assert.equal(M.changes(context.catalogData, products()).total, 0);
});
test('Los precios se escriben como en Colombia y vacío es «Cotiza por WhatsApp»', () => {
    assert.equal(M.parseMoney('65.000'), 65000);
    assert.equal(M.parseMoney('$ 105000'), 105000);
    assert.equal(M.parseMoney(''), null);
    assert.ok(Number.isNaN(M.parseMoney('sesenta')));
    assert.ok(Number.isNaN(M.parseMoney('-5000')));
    assert.equal(M.formatMoney(65000), '65.000');
});
test('Un producto nuevo toma la estructura de su sección, sin precios, sin fotos y oculto', () => {
    const torta = M.template('tortas', products());
    assert.equal(torta.visible, false);
    assert.equal(torta.name, '');
    assert.equal(torta.images.length, 0);
    assert.equal(torta.options.map(o => o.id).join(), 'sabor,relleno,porciones');
    assert.ok(torta.options.find(o => o.id === 'porciones').choices.every(c => c.price === null));
    assert.ok(!('basedOn' in torta));
    const extra = M.template('extras', products());
    assert.equal(extra.price, null); assert.equal(extra.priceMax, null);
    const oso = M.template('detalles', products());
    assert.equal(oso.price, null);
});
test('Un producto nuevo con precios vacíos se cotiza y aparece en su sección al publicar', () => {
    const list = products();
    const nuevo = M.template('tortas', list);
    Object.assign(nuevo, { name: 'Torta Mariposa', visible: true });
    nuevo.options.find(o => o.id === 'porciones').choices[0].price = 70000;
    list.push(nuevo);
    const data = M.toCatalog(M.normalize(list));
    assert.ok(data['torta-mariposa']);
    const previous = context.catalogData;
    context.catalogData = data;
    try {
        assert.equal(Catalog.priceLabel(Catalog.get('torta-mariposa')).text, '$70.000', 'Una sola porción con precio: sin «Desde»');
        assert.equal(Catalog.quote(Catalog.get('torta-mariposa'), { ...Catalog.defaults(Catalog.get('torta-mariposa')), porciones: '25-30' }), true);
    } finally { context.catalogData = previous; }
});
test('Identificadores y opciones nuevas se completan sin pisar los existentes', () => {
    const list = products();
    const copia = M.clone(list[0]); copia.id = ''; copia.name = 'Torta Vintage';
    copia.options[0].choices.push({ value: '', label: 'Limón' });
    list.push(copia);
    const normal = M.normalize(list);
    assert.equal(normal.at(-1).id, 'torta-vintage-2');
    assert.equal(normal.at(-1).options[0].choices.at(-1).value, 'limon');
    assert.equal(normal[0].id, 'torta-vintage');
});
test('No deja publicar precios, nombres ni fotos inválidos', () => {
    const list = products();
    list[0].name = ' ';
    list[1].options.find(o => o.id === 'porciones').choices[0].price = NaN;
    list[2].mainImage = 'https://otro-sitio.com/foto.jpg';
    const errors = M.validate(list);
    assert.ok(errors.some(e => e.includes('sin nombre')));
    assert.ok(errors.some(e => e.includes('solo con números')));
    assert.ok(errors.some(e => e.includes('no es de la web')));
});
test('Los diseños heredan de su torta base y un cambio de precio en la base les llega', () => {
    const list = products();
    const vintage = list.find(p => p.id === 'torta-vintage');
    vintage.options.find(o => o.id === 'porciones').choices[0].price = 70000;
    const previous = context.catalogData;
    context.catalogData = M.toCatalog(list);
    try {
        const design = Catalog.get('galeria-tortas-13');
        assert.equal(design.basedOn, 'torta-vintage');
        assert.equal(Catalog.priceLabel(design).text, 'Desde $70.000');
    } finally { context.catalogData = previous; }
    assert.ok(M.validate(list.filter(p => p.id !== 'torta-vintage')).some(e => e.includes('torta base')));
});
test('Cuenta productos cambiados, nuevos y eliminados', () => {
    const list = products();
    list[0] = { ...list[0], visible: false };
    list.pop();
    const { changed, removed, total } = M.changes(context.catalogData, list);
    assert.equal(changed.join(), 'torta-vintage');
    assert.equal(removed.length, 1);
    assert.equal(total, 2);
});
test('Cada tarjeta tiene su foto principal y la ficha admite más fotos de la misma referencia', () => {
    const list = products();
    const seen = new Map();
    for (const p of list) if (p.mainImage) {
        assert.ok(!seen.has(p.mainImage), `«${p.mainImage}» es la principal de ${seen.get(p.mainImage)} y de ${p.id}`);
        seen.set(p.mainImage, p.id);
    }
    // Más fotos: pueden ser de otras tortas o subidas desde el panel.
    const sencilla = list.find(p => p.id === 'torta-sencilla');
    const subida = `${M.UPLOADED}torta-sencilla-lazo-k3x9a1.webp`;
    assert.equal(subida, 'https://lauren-reposteria.crizczi22.workers.dev/f/torta-sencilla-lazo-k3x9a1.webp');
    sencilla.images.push(list.find(p => p.id === 'galeria-tortas-03').mainImage, subida);
    assert.equal(M.validate(list).length, 0);
    assert.equal(M.normalize(list).find(p => p.id === 'torta-sencilla').images.length, 3);
    // La principal no se repite entre tarjetas.
    sencilla.images.unshift(sencilla.images.splice(1, 1)[0]);
    sencilla.mainImage = sencilla.images[0];
    assert.ok(M.validate(list).some(e => e.includes('ya es la principal de «Torta Sencilla · 2»')));
    // Solo se aceptan fotos de la web o del worker de fotos del proyecto.
    for (const src of ['https://otro-sitio.com/f/a.webp', `${M.UPLOADED}a.svg`, `${M.UPLOADED}../a.webp`, `${M.UPLOADED}a.webp?x=1`, 'https://lauren-reposteria.otro.workers.dev/f/a.webp', 'http://lauren-reposteria.crizczi22.workers.dev/f/a.webp']) assert.ok(!M.IMAGE.test(src), src);
    // Al editar, el producto no choca con su propia versión guardada.
    const edit = M.clone(list.find(p => p.id === 'galleta-pistachos'));
    assert.equal(M.validate([edit], list.filter(p => p.id !== edit.id)).length, 0);
    assert.ok(!M.takenPhotos(list, edit).has(edit.mainImage));
});
test('Un producto visible necesita foto, salvo los adicionales de torta', () => {
    const list = products();
    const brownie = list.find(p => p.category === 'brownies');
    Object.assign(brownie, { mainImage: '', images: [] });
    assert.ok(M.validate(list).some(e => e.includes('elige al menos una foto')));
    brownie.visible = false;
    assert.equal(M.validate(list).length, 0);
});
test('La cantidad mínima y su nombre solo existen en las secciones que se piden por cantidad', () => {
    const list = products();
    const vintage = list.find(p => p.id === 'torta-vintage');
    Object.assign(vintage, { minimum: 3, quantityLabel: 'Tortas' });
    const normal = M.toCatalog(M.normalize(list));
    assert.ok(!('minimum' in normal['torta-vintage']) && !('quantityLabel' in normal['torta-vintage']));
    assert.equal(normal['alfajor-individual'].minimum, 6);
    assert.ok(!M.QUANTITY.includes('tortas') && !M.QUANTITY.includes('extras'));
});
test('La portada tiene cuatro lugares: no se publica un quinto y la web nunca muestra más de cuatro', () => {
    const list = products();
    assert.equal(list.filter(p => p.featured).length, 4);
    assert.equal(M.validate(list).length, 0);
    const quinto = list.find(p => p.id === 'torta-sencilla');
    quinto.featured = true;
    assert.ok(M.validate(list).some(e => e.includes('caben 4')));
    // Al editar, la ficha se compara con los demás productos.
    assert.ok(M.validate([quinto], list.filter(p => p.id !== quinto.id)).some(e => e.includes('caben 4')));
    const previous = context.catalogData;
    context.catalogData = M.toCatalog(list);
    try { assert.equal(Catalog.featured().length, 4); } finally { context.catalogData = previous; }
});
