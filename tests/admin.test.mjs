import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const context = { console, Intl, URL };
context.window = context;
vm.createContext(context);
// Reglas con datos conocidos: catálogo de prueba fijo (el real lo revisa tests/catalogo-real.test.mjs).
vm.runInContext(fs.readFileSync(new URL('./fixtures/catalog-data.js', import.meta.url), 'utf8'), context);
for (const file of ['catalog-model', 'admin-model']) vm.runInContext(fs.readFileSync(new URL(`../js/${file}.js`, import.meta.url), 'utf8'), context);
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

test('Un precio copiado con centavos no se multiplica por cien', () => {
    assert.equal(M.parseMoney('65.000,00'), 65000, 'antes se leía 6.500.000');
    assert.equal(M.parseMoney('$ 65.000,00'), 65000);
    assert.equal(M.parseMoney('65000.00'), 65000);
    assert.equal(M.parseMoney('1.250.000'), 1250000);
    assert.ok(Number.isNaN(M.parseMoney('65.000,50')), 'los pesos van sin centavos');
    assert.ok(Number.isNaN(M.parseMoney('65,5')));
});

test('No deja publicar precios de $0 ni un «Precio hasta» menor que el «Precio desde»', () => {
    const list = products();
    const caja = list.find(p => p.id === 'caja-x6');
    caja.price = 0;
    const extra = list.find(p => p.category === 'extras' && typeof p.priceMax === 'number');
    extra.priceMax = extra.price - 1000;
    const errors = M.validate(list);
    assert.ok(errors.some(e => e.startsWith(`${caja.name}: el precio no puede ser $0`)));
    assert.ok(errors.some(e => e === `${extra.name}: el «Precio hasta» debe ser mayor que el «Precio desde».`));
    extra.price = null;
    assert.ok(M.validate(list).some(e => e === `${extra.name}: escribe también el «Precio desde».`));
});
test('Un producto nuevo toma la estructura de su sección, sin precios, sin fotos y oculto', () => {
    const torta = M.template('tortas', products());
    assert.equal(torta.visible, false);
    assert.equal(torta.name, '');
    assert.equal(torta.images.length, 0);
    assert.equal(torta.options.map(o => o.id).join(), 'sabor,relleno,porciones');
    assert.ok(torta.options.find(o => o.id === 'porciones').choices.every(c => c.price === null));
    assert.ok(!('basedOn' in torta));
    assert.equal(torta.description, products().find(p => p.id === 'torta-vintage').description, 'los textos de la sección quedan escritos para editarlos');
    const extra = M.template('extras', products());
    assert.equal(extra.price, null); assert.equal(extra.priceMax, null);
    const oso = M.template('detalles', products());
    assert.equal(oso.price, null);
});
test('Al publicar se borran solo las fotos subidas que se sacaron con «Borrarla» y que ya nadie usa', () => {
    const list = products();
    const subida = name => `${M.UPLOADED}${name}.webp`;
    list[0].images = [...(list[0].images || []), subida('sigue-en-uso')];
    const pending = new Set([subida('sacada'), subida('sigue-en-uso'), '/assets/propuestas-fotograficas/torta-vintage.webp']);
    assert.deepEqual([...M.unusedUploads(pending, list)], [subida('sacada')], 'ni las que otro producto usa ni las fotos de la web');
    assert.equal(M.unusedUploads(new Set(), list).length, 0);
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
    // Más fotos: de la web o subidas desde el panel. El modelo las admite aunque estén en otra torta
    // (el panel las mueve al agregarlas); la otra torta sale del catálogo, que el panel puede cambiar.
    const sencilla = list.find(p => p.id === 'torta-sencilla');
    const otra = list.find(p => p.category === 'tortas' && p.id !== 'torta-sencilla' && p.mainImage);
    const subida = `${M.UPLOADED}torta-sencilla-lazo-k3x9a1.webp`;
    assert.equal(subida, 'https://lauren-reposteria.crizczi22.workers.dev/f/torta-sencilla-lazo-k3x9a1.webp');
    sencilla.images.push(otra.mainImage, subida);
    assert.equal(M.validate(list).length, 0);
    assert.equal(M.normalize(list).find(p => p.id === 'torta-sencilla').images.length, 3);
    // La principal no se repite entre tarjetas.
    sencilla.images.unshift(sencilla.images.splice(1, 1)[0]);
    sencilla.mainImage = sencilla.images[0];
    assert.ok(M.validate(list).some(e => e.includes(`ya es la principal de «${otra.name}»`)));
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
test('La portada muestra cuatro tortas: no se publica una quinta y la web nunca muestra más de cuatro', () => {
    const list = products();
    const tortas = list.filter(p => p.category === 'tortas' && p.visible !== false);
    tortas.slice(0, 4).forEach(p => { p.featured = true; });
    assert.equal(M.validate(list).length, 0);
    const quinta = tortas[4];
    quinta.featured = true;
    assert.ok(M.validate(list).some(e => e.includes('caben 4')));
    // Al editar, la ficha se compara con los demás productos.
    assert.ok(M.validate([quinta], list.filter(p => p.id !== quinta.id)).some(e => e.includes('caben 4')));
    // Un producto de otra sección con la marca antigua no ocupa lugar en la portada.
    delete quinta.featured;
    list.find(p => p.category === 'alfajores').featured = true;
    assert.equal(M.validate(list).length, 0);
    const previous = context.catalogData;
    context.catalogData = M.toCatalog(list);
    try {
        assert.equal(Catalog.featured().map(p => p.id).join(), tortas.slice(0, 4).map(p => p.id).join());
        assert.ok(Catalog.featured().every(p => p.category === 'tortas'));
    } finally { context.catalogData = previous; }
});
test('Con menos de cuatro tortas marcadas, la portada se completa con las siguientes tortas del catálogo', () => {
    const list = products();
    list.forEach(p => { delete p.featured; });
    const tortas = list.filter(p => p.category === 'tortas' && p.visible !== false);
    tortas[5].featured = true;
    const previous = context.catalogData;
    context.catalogData = M.toCatalog(list);
    try { assert.equal(Catalog.featured().map(p => p.id).join(), [tortas[5], ...tortas.slice(0, 3)].map(p => p.id).join()); } finally { context.catalogData = previous; }
});

test('Cada grupo es independiente: el panel copia lo que tomaba de su torta base y le da sus propios adicionales', () => {
    const list = products();
    const design = list.find(p => p.basedOn === 'torta-vintage' && !Array.isArray(p.options));
    const vintage = list.find(p => p.id === 'torta-vintage');
    const migrated = M.migrate(list);
    const own = migrated.find(p => p.id === design.id);
    assert.equal('basedOn' in own, false);
    assert.equal(own.description, design.description || vintage.description, 'conserva su descripción o toma la de su base');
    assert.deepEqual(own.options.filter(o => o.id !== 'adicionales').map(o => o.id), vintage.options.map(o => o.id));
    // Sus porciones ya no cambian si cambia la torta base.
    migrated.find(p => p.id === 'torta-vintage').options.find(o => o.id === 'porciones').choices[0].price = 1000;
    assert.notEqual(own.options.find(o => o.id === 'porciones').choices[0].price, 1000);
    // Adicionales propios, copiados de la vitrina; con rango o sin precio, se cotizan.
    const addons = own.options.find(o => o.id === 'adicionales');
    assert.ok(addons.addons && addons.multiple && !addons.required);
    assert.equal(addons.choices.length, list.filter(p => p.category === 'extras' && p.visible !== false).length);
    assert.ok(addons.choices.every(c => !('extra' in c)));
    assert.equal(migrated.filter(p => p.category !== 'tortas').every(p => list.includes(p)), true, 'lo demás no cambia');
    assert.deepEqual([...M.validate(migrated)], []);
    // Migrar dos veces no cambia nada.
    assert.equal(JSON.stringify(M.migrate(migrated)), JSON.stringify(migrated));
});
test('Costos por tamaño: vacío es sin costo (en adicionales, cotiza) y solo quedan los tamaños que existen', () => {
    const list = M.migrate(products());
    const torta = list.find(p => p.id === 'torta-vintage');
    const relleno = torta.options.find(o => o.id === 'relleno').choices.find(c => c.value === 'nutella');
    relleno.extra = { '4-5': 5000, '25-30': 20000, viejo: 1000, '8-10': null };
    const normal = M.normalize(list).find(p => p.id === 'torta-vintage').options.find(o => o.id === 'relleno').choices.find(c => c.value === 'nutella');
    assert.deepEqual({ ...normal.extra }, { '4-5': 5000, '25-30': 20000 });
    relleno.extra['12-15'] = 0;
    assert.match(M.validate(list).join(), /costo adicional.*\$0/);
    relleno.extra = { '4-5': 5000 };
    relleno.image = 'https://otro-sitio.com/f/a.webp';
    assert.match(M.validate(list).join(), /la foto no es de la web/);
    relleno.image = `${M.UPLOADED}nutella-k3x9a1.webp`;
    assert.deepEqual([...M.validate(list)], []);
    assert.deepEqual([...M.unusedUploads(new Set([relleno.image]), list)], [], 'la foto de un sabor no se borra como «sin usar»');
});

test('Avisos: lo que impide publicar va a su producto y lo que conviene revisar se dice en palabras sencillas', () => {
    const list = M.migrate(products());
    assert.deepEqual([...M.problems(list)], []);
    const torta = list.find(p => p.id === 'torta-vintage');
    torta.options.find(o => o.id === 'porciones').choices[0].price = 0;
    const [problem] = M.problems(list);
    assert.equal(problem.id, 'torta-vintage');
    assert.match(problem.text, /no puede ser \$0/);
    torta.options.find(o => o.id === 'porciones').choices[0].price = null;
    const sizes = torta.options.find(o => o.id === 'porciones').choices;
    const addon = torta.options.find(o => o.id === 'adicionales').choices[0];
    addon.extra = { [sizes[0].value]: 2000 };
    const warnings = M.warnings(list).filter(w => w.id === 'torta-vintage').map(w => w.text);
    assert.ok(warnings.some(t => t.includes(`«${sizes[0].label}» no tiene precio; se cotiza por WhatsApp.`)), warnings.join('\n'));
    assert.ok(warnings.some(t => t.includes(`adicionales sin precio para algún tamaño: «${addon.label}» en ${sizes[1].label}`)), warnings.join('\n'));
    assert.ok(warnings.filter(t => !t.includes('misma descripción')).length <= 3, 'un aviso por tema, no uno por opción');
    const vitrina = list.find(p => p.category === 'extras' && p.price === null);
    assert.ok(M.warnings(list).some(w => w.id === vitrina.id && w.text.includes('Cotiza por WhatsApp')));
});
test('Toppings de varias: hasta un máximo según la cajita, y al menos uno', () => {
    const p = M.clone(context.catalogData.brownies);
    const topping = p.options.find(o => o.id === 'topping');
    const sizes = p.options.find(o => o.id === 'presentacion').choices.map(c => c.value);
    topping.multiple = true;
    topping.maxSelection = { [sizes[1]]: 3, [sizes[2]]: 4 };
    const pick = (size, list) => ({ ...Catalog.defaults(p), presentacion: size, topping: list });
    const values = topping.choices.map(c => c.value);
    assert.equal(Catalog.maxOf(p, topping, pick(sizes[1], [])), 3);
    assert.equal(Catalog.maxText(p, topping, pick(sizes[2], [])), 'Elige hasta 4 sabores.');
    assert.equal(Catalog.maxText(p, topping, pick(sizes[0], [])), 'Elige un sabor.');
    assert.equal(Catalog.validate(p, pick(sizes[1], values.slice(0, 3))).length, 0);
    assert.match(Catalog.validate(p, pick(sizes[1], values.slice(0, 4)))[0].message, /Puedes elegir hasta 3 sabores/);
    assert.equal(Catalog.validate(p, pick(sizes[2], values.slice(0, 4))).length, 0);
    assert.match(Catalog.validate(p, pick(sizes[1], []))[0].message, /Selecciona una opción/);
    // El panel no publica un máximo que no sea un número de 1 al número de toppings.
    assert.equal(M.validate([p], products()).length, 0);
    topping.maxSelection[sizes[1]] = values.length + 1;
    assert.match(M.validate([p], products()).join('\n'), /cuántas puede elegir con un número de 1 a/);
    topping.maxSelection[sizes[1]] = NaN;
    assert.match(M.validate([p], products()).join('\n'), /cuántas puede elegir/);
});
test('Ofertas: cada cantidad con su propio precio en vez de multiplicar el de una', () => {
    const p = M.clone(Object.values(context.catalogData).find(x => x.options?.some(o => o.multiplier)));
    const option = p.options.find(o => o.multiplier);
    const unit = p.price;
    const before = option.choices.map(c => Catalog.price(p, { ...Catalog.defaults(p), [option.id]: c.value }));
    assert.deepEqual(before, option.choices.map(c => unit * Number(c.value)));
    option.choices = option.choices.map((c, i) => ({ ...c, price: i === option.choices.length - 1 ? unit * Number(c.value) - 5000 : unit * Number(c.value) }));
    delete option.multiplier; delete p.price;
    const after = option.choices.map(c => Catalog.price(p, { ...Catalog.defaults(p), [option.id]: c.value }));
    assert.equal(after.at(-1), before.at(-1) - 5000);
    assert.deepEqual(after.slice(0, -1), before.slice(0, -1));
    assert.equal(M.validate([p], products()).length, 0);
});
test('Avisos: nombre o descripción repetidos y páginas que quedarían vacías', () => {
    const list = products();
    const [a, b] = list.filter(p => p.category === 'alfajores' && p.visible !== false);
    assert.ok(!M.warnings(list).some(w => /se llama igual|misma descripción/.test(w.text) && w.id === b.id));
    b.name = ` ${a.name.toUpperCase()} `;
    b.description = a.description;
    const texts = M.warnings(list).filter(w => w.id === b.id).map(w => w.text);
    assert.ok(texts.some(t => t.includes('se llama igual que otro producto visible')), texts.join('\n'));
    assert.ok(texts.some(t => t.includes(`misma descripción que «${a.name}»`)), texts.join('\n'));
    // Al guardar una sola ficha se compara con las demás, pero no se avisa de páginas vacías.
    const alone = M.warnings([b], list.filter(p => p.id !== b.id)).map(w => w.text);
    assert.ok(alone.some(t => t.includes('se llama igual')));
    assert.ok(!alone.some(t => t.includes('vacía')));
    // Un producto oculto no cuenta como repetido.
    b.visible = false;
    assert.ok(!M.warnings(list).some(w => w.id === b.id));
    for (const p of list) if (p.category === 'alfajores') p.visible = false;
    assert.ok(M.warnings(list).some(w => w.id === null && w.text === 'La página de Alfajores no tiene productos visibles: se verá vacía en la web.'));
    assert.deepEqual({ ...M.LIMITS }, { catalog: 900000, faqs: 200000, document: 1000000 }, 'los mismos límites de firestore.rules y bajo 1 MiB');
    assert.match(fs.readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'), /data\.json\.size\(\) < 900000[\s\S]*data\.preguntas\.size\(\) < 200000/);
});

test('Un producto con demasiadas combinaciones de opciones no se publica (la web no podría calcular su precio)', () => {
    const list = products();
    const p = list.find(x => x.id === 'caja-x6');
    p.options = ['Sabor', 'Relleno', 'Cobertura', 'Decoración', 'Caja'].map((label, o) => ({ id: `g${o}`, label, type: 'radio', required: true, choices: Array.from({ length: 8 }, (_, c) => ({ value: `v${c}`, label: `${label} ${c + 1}` })) }));
    assert.match(M.validate(list).join('\n'), /Caja x6 Alfajores: tiene demasiadas combinaciones de opciones/);
    p.options = p.options.slice(0, 3);
    assert.deepEqual([...M.validate(list)], []);
});
test('Dos grupos u opciones iguales no se publican, y un grupo propio llamado «Adicionales» no choca con el de adicionales', () => {
    const list = products();
    const p = list.find(x => x.id === 'brownies');
    const extra = M.addonsGroup([{ value: 'monos', label: 'Moños', extra: 2000 }]);
    p.options = [...p.options, { id: '', label: 'Adicionales', type: 'radio', required: false, choices: [{ value: '', label: 'Vela' }] }, extra];
    const [published] = M.normalize([p]);
    const ids = published.options.map(o => o.id);
    assert.equal(new Set(ids).size, ids.length, ids.join(', '));
    assert.ok(ids.includes('adicionales') && ids.includes('adicionales-2'), ids.join(', '));
    p.options = [...published.options, { ...extra }];
    assert.match(M.validate([p], list).join('\n'), /hay dos grupos de opciones iguales/);
    p.options = published.options;
    p.options[0].choices.push({ ...p.options[0].choices[0] });
    assert.match(M.validate([p], list).join('\n'), /hay dos opciones iguales/);
});
test('Los caracteres invisibles y de dirección del texto no cuentan como nombre ni llegan a lo publicado', () => {
    const list = products();
    const p = list.find(x => x.id === 'caja-x6');
    p.name = '​‮ ﻿';
    assert.match(M.validate(list).join('\n'), /Hay un producto sin nombre/);
    p.name = 'Caja‮ x6';
    p.description = '⁦Texto⁩ bonito';
    p.options = [{ id: 'sabor', label: '‏Sabor', type: 'radio', required: true, choices: [{ value: 'a', label: 'Arequipe​' }] }];
    const [clean] = M.normalize([p]);
    assert.deepEqual([clean.name, clean.description, clean.options[0].label, clean.options[0].choices[0].label], ['Caja x6', 'Texto bonito', 'Sabor', 'Arequipe']);
    assert.equal(M.clean(' ​hola‮ '), 'hola');
});
test('Versiones: la fecha se lee como en Colombia, con el año solo si no es el de hoy, y la hora no se parte', () => {
    assert.equal(M.versionDate(new Date(2026, 9, 22, 8, 49), new Date(2026, 9, 23)), '22 de octubre, 8:49 a. m.');
    assert.equal(M.versionDate(new Date(2026, 5, 1, 12, 30), new Date(2026, 9, 1)), '1 de junio, 12:30 p. m.');
    assert.equal(M.versionDate(new Date(2025, 0, 3, 0, 5), new Date(2026, 0, 1)), '3 de enero de 2025, 12:05 a. m.');
});
test('Versiones: dicen qué cambió frente a la anterior, con pocos nombres y lo que se eliminó aparte', () => {
    const before = M.toCatalog(products());
    const after = M.clone(before);
    after['torta-sencilla'].description = 'Otra descripción';
    after['caja-x6'].name = 'Caja x6';
    after.brownies.visible = false;
    after['oso-grande'].price = 99000;
    delete after['oso-fresas'];
    assert.equal(M.versionChanges({ catalog: after }, { catalog: before }), 'Con cambios: Torta Sencilla, Caja x6 y 2 más · Se eliminó: Oso con Fresas');
    after['oso-grande'] = M.clone(before['oso-grande']);
    after.brownies = M.clone(before.brownies);
    delete after['oso-pequeno'];
    assert.equal(M.versionChanges({ catalog: after }, { catalog: before }), 'Con cambios: Torta Sencilla y Caja x6 · Se eliminaron: Oso Pequeño y Oso con Fresas');
    assert.equal(M.versionChanges({ catalog: before }, { catalog: M.clone(before) }), 'Igual a la anterior');
    assert.equal(M.versionChanges({ catalog: before }, null), 'La primera que se guardó');
    assert.equal(M.versionChanges({ catalog: null }, { catalog: before }), '', 'una copia dañada no se compara');
});
test('Versiones: una foto que ya no existe sale del producto y la principal pasa a la siguiente', () => {
    const up = name => `${M.UPLOADED}${name}.webp`;
    const list = products();
    const oso = list.find(x => x.id === 'oso-grande');
    const web = oso.mainImage;
    oso.mainImage = up('oso-1');
    oso.images = [up('oso-1'), up('oso-2'), web];
    const choice = list.find(x => x.id === 'torta-sencilla').options.find(o => o.choices?.length).choices[0];
    choice.image = up('sabor-1');
    assert.deepEqual([...M.uploadsIn(list)].sort(), [up('oso-1'), up('oso-2'), up('sabor-1')]);
    const after = M.withoutPhotos(list, new Set([up('oso-1'), up('sabor-1')]));
    const restored = after.find(x => x.id === 'oso-grande');
    assert.equal(restored.mainImage, up('oso-2'));
    assert.deepEqual([...restored.images], [up('oso-2'), web]);
    assert.ok(!M.choicePhotos(after.find(x => x.id === 'torta-sencilla')).includes(up('sabor-1')));
    assert.equal(oso.mainImage, up('oso-1'), 'el original no cambia');
    assert.equal(M.withoutPhotos(list, new Set()), list);
    const alone = M.withoutPhotos([{ ...oso, images: [up('oso-1')] }], new Set([up('oso-1')]))[0];
    assert.equal(alone.mainImage, '');
    assert.match(M.validate([alone], list).join('\n'), /elige al menos una foto/);
});
