import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const context = { console, Intl, URL, setTimeout, clearTimeout, addEventListener() {} };
context.window = context;
const saved = new Map();
context.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
vm.createContext(context);
for (const file of ['catalog-data', 'catalog-model', 'brand-icons', 'ui', 'cart-manager']) vm.runInContext(fs.readFileSync(new URL(`../js/${file}.js`, import.meta.url), 'utf8'), context);
const { Catalog, cartManager: cart, LaurenUI } = context;
const selected = (id, overrides = {}) => ({ ...Catalog.defaults(Catalog.get(id)), ...overrides });
const price = (id, overrides) => Catalog.price(Catalog.get(id), selected(id, overrides));
const item = (id, overrides = {}, personal = {}, quantity = 1) => ({ id, selection: selected(id, overrides), personal, quantity });

test('Las 10 combinaciones de porciones de tortas usan el precio de catálogo', () => {
    for (const id of ['torta-vintage', 'torta-sencilla']) for (const choice of Catalog.get(id).options.find(o => o.id === 'porciones').choices) assert.equal(price(id, { porciones: choice.value }), choice.price);
});
test('Tortas de alfajor, individuales y cantidades mínimas', () => {
    for (const choice of Catalog.get('torta-alfajor').options[0].choices) assert.equal(price('torta-alfajor', { tamano: choice.value }), choice.price);
    assert.equal(price('alfajor-individual'), 3000);
    assert.equal(Catalog.minimum(Catalog.get('alfajor-individual')), 6);
    assert.equal(cart.addItem(item('alfajor-individual', {}, {}, 1)), false);
    cart.clearCart(); assert.equal(cart.addItem(item('alfajor-individual', {}, {}, 6)), true);
    assert.equal(cart.getTotalPrice(), 18000);
    assert.equal(cart.updateQuantity(0, 5), false);
});
test('Todas las presentaciones de brownies ignoran opciones ocultas', () => {
    assert.equal(price('brownies'), 39000);
    const values = { 'caja-x3': 24000, 'caja-x6': 43000, 'caja-x16': 93000, 'vaso-minis': 27000 };
    for (const [presentacion, expected] of Object.entries(values)) assert.equal(price('brownies', { presentacion, cantidad: '24' }), expected);
    for (const choice of Catalog.get('brownies').options.find(o => o.id === 'cantidad').choices) assert.equal(price('brownies', { cantidad: choice.value }), choice.price);
    const options = Catalog.summary(Catalog.get('brownies'), selected('brownies', { presentacion: 'vaso-minis' }));
    assert.equal(Object.hasOwn(options, 'Topping'), false);
    assert.equal(Catalog.validate(Catalog.get('brownies'), { presentacion: 'vaso-minis' }).length, 0);
});
test('Cada sabor de galleta cobra su precio por unidad y la caja surtida, $46.000', () => {
    const flavors = { chips: 8000, 'red-velvet': 8000, cocoa: 8000, pistachos: 10000, 'chocolate-blanco': 10000, panelita: 10000 };
    for (const [flavor, unit] of Object.entries(flavors)) for (const qty of ['3', '6', '12']) {
        assert.equal(price(`galleta-${flavor}`, { cantidad: qty }), unit * Number(qty));
    }
    assert.equal(price('galletas-caja-surtida'), 46000);
    assert.equal(Catalog.validate(Catalog.get('galletas-caja-surtida'), {}).length, 0);
});
test('Golden sencillo/especial y mensaje adicional de oso', () => {
    assert.equal(price('detalle-golden-1'), 88000);
    assert.equal(price('detalle-golden-1', { 'tipo-galleta': 'especial' }), 94000);
    assert.equal(price('oso-grande', { 'mensaje-brownie': true }), 53000);
    assert.equal(price('oso-grande', { 'mensaje-brownie': false }), 49000);
});
test('Campos múltiples, iniciales, colores y límites son obligatorios', () => {
    const p = Catalog.get('detalle-hbd');
    assert.equal(Catalog.validate(p, selected(p.id), {}).length, 3);
    const valid = selected(p.id, { 'color-letras': ['lila', 'blanco'] });
    assert.equal(Catalog.validate(p, valid, { iniciales: 'ABC', 'mensaje-torta': 'Feliz día' }).length, 0);
    assert.ok(Catalog.validate(p, valid, { iniciales: 'AB', 'mensaje-torta': 'Feliz día' }).length);
    assert.ok(Catalog.validate(p, selected(p.id, { 'color-letras': ['lila', 'blanco', 'rojo'] }), {}).length);
    assert.ok(Catalog.validate(Catalog.get('detalle-mix-1'), selected('detalle-mix-1', { 'color-letras': ['lila'] }), { iniciales: 'ABC' }).length);
});
test('Alfajores personalizados: $60.000 por caja de 6 y tema obligatorio; los extras siguen por cotización', () => {
    const p = Catalog.get('alfajor-personalizado');
    assert.equal(Catalog.quoteOnly(p), false);
    cart.clearCart();
    assert.equal(cart.addItem(item(p.id, {}, {})), false, 'Sin tema no se agrega');
    assert.equal(cart.addItem(item(p.id, {}, { tema: 'Cumpleaños' }, 2)), true);
    assert.equal(cart.getTotalPrice(), 120000);
    assert.equal(cart.addItem(item('extra-perlas')), false);
});
test('El carrito fusiona equivalentes, conserva personalizaciones y permite editar', () => {
    cart.clearCart();
    assert.equal(cart.addItem(item('caja-x6')), true);
    assert.equal(cart.addItem(item('caja-x6')), true);
    assert.equal(cart.getItems().length, 1); assert.equal(cart.getTotalItems(), 2);
    assert.equal(cart.addItem(item('torta-vintage', {}, { mensaje: 'Ana' })), true);
    assert.equal(cart.addItem(item('torta-vintage', {}, { mensaje: 'Luis' })), true);
    assert.equal(cart.getItems().length, 3);
    const edits = item('torta-vintage', { porciones: '8-10' }, { mensaje: 'Ana' });
    assert.equal(cart.addItem(edits, 1), true);
    assert.equal(cart.getItems()[1].price, 105000);
    assert.equal(cart.getTotalItems(), 4);
    const detached = cart.getItems(); detached[0].quantity = 99;
    assert.equal(cart.getItems()[0].quantity, 2);
});
test('El orden de colores no duplica el producto; cambiar mensaje sí', () => {
    cart.clearCart();
    cart.addItem(item('detalle-mix-1', { 'color-letras': ['lila', 'blanco'] }, { iniciales: 'AB' }));
    cart.addItem(item('detalle-mix-1', { 'color-letras': ['blanco', 'lila'] }, { iniciales: 'AB' }));
    assert.equal(cart.getItems().length, 1); assert.equal(cart.getTotalItems(), 2);
});
test('Rechaza cantidades inválidas e importes manipulados; vuelve a cotizar desde la fuente', () => {
    cart.clearCart();
    for (const quantity of [-1, 0, .5, 100, Infinity, NaN]) assert.equal(cart.addItem(item('caja-x6', {}, {}, quantity)), false);
    assert.equal(cart.addItem({ ...item('caja-x6'), price: 1, name: '<script>alert(1)</script>', image: 'javascript:alert(1)' }), true);
    assert.equal(cart.getItems()[0].price, 22000); assert.equal(cart.getItems()[0].name, 'Caja x6 Alfajores');
    assert.equal(cart.addItem({ id: '__proto__', quantity: 1, selection: {}, personal: {} }), false);
    assert.equal(cart.updateQuantity(0, 99), true);
    assert.equal(cart.addItem(item('caja-x6')), false);
});
test('No ejecuta texto de personalización ni rutas inyectadas', () => {
    const payload = '<img src=x onerror=alert(1)>';
    assert.equal(LaurenUI.escape(payload), '&lt;img src=x onerror=alert(1)&gt;');
    assert.equal(LaurenUI.imagePath('javascript:alert(1)'), '/assets/brand/lauren-isotipo.svg');
    assert.equal(LaurenUI.imagePath('/assets/optimized/../../secret.webp'), '/assets/brand/lauren-isotipo.svg');
    assert.equal(LaurenUI.imagePath('//evil.example/assets/optimized/x.webp'), '/assets/brand/lauren-isotipo.svg');
    cart.clearCart(); cart.addItem(item('torta-vintage', {}, { mensaje: payload }));
    assert.equal(cart.getItems()[0].personal.mensaje, payload);
    assert.ok(decodeURIComponent(cart.generateWhatsAppMessage()).includes(payload));
});
test('Mensaje incluye selección, cantidades, personalización y subtotal; no confirma una compra', () => {
    cart.clearCart(); cart.addItem(item('detalle-hbd', { 'color-letras': ['lila', 'blanco'] }, { iniciales: 'ABC', 'mensaje-torta': 'Feliz día' }, 2));
    const text = decodeURIComponent(cart.generateWhatsAppMessage());
    for (const value of ['pedido personalizado', '2 × $92.000 = $184.000', 'Iniciales para las letras: ABC', 'Feliz día', 'Lila, Blanco', 'Fecha de la celebración', 'el diseño']) assert.ok(text.includes(value), value);
    assert.ok(cart.whatsappURL().startsWith('https://wa.me/573104442796?text='));
});
test('Un pedido listo para entregar no habla de diseño ni personalización', () => {
    cart.clearCart(); cart.addItem(item('caja-x12')); cart.addItem(item('torta-alfajor'));
    const text = decodeURIComponent(cart.generateWhatsAppMessage());
    assert.equal(cart.isCustom(), false);
    for (const value of ['Quiero hacer este pedido:', 'Valor: $37.000', 'Para coordinar la entrega', '¿Me confirmas la disponibilidad']) assert.ok(text.includes(value), value);
    assert.ok(!/personaliz|diseño/i.test(text), text);
    assert.equal(Catalog.get('torta-alfajor').personalization, null, 'La torta de alfajor no lleva frase');
    cart.clearCart(); cart.addItem(item('detalle-brownie', {}, { 'mensaje-brownie': 'Te quiero' }));
    assert.equal(cart.isCustom(), true, 'Un mensaje escrito convierte el pedido en personalizado');
    assert.ok(decodeURIComponent(cart.generateWhatsAppMessage()).includes('Te quiero'));
    cart.clearCart(); cart.addItem(item('torta-sencilla'));
    assert.equal(cart.isCustom(), true, 'Las tortas siempre se revisan como diseño');
});
test('El interruptor del mensaje pagado no se repite en el resumen', () => {
    cart.clearCart(); cart.addItem(item('oso-grande', { 'mensaje-brownie': true }, { 'mensaje-brownie': 'Te amo' }));
    const text = decodeURIComponent(cart.generateWhatsAppMessage());
    assert.ok(!text.includes('¿Deseas agregar'), text);
    assert.ok(text.includes('Mensaje personalizado en el brownie: Te amo'));
});
test('Persistencia, datos corruptos, migración anterior y almacenamiento bloqueado', () => {
    saved.set(cart.cartKey, 'invalid json'); assert.equal(cart.loadCart().length, 0);
    saved.set(cart.cartKey, '{}'); assert.equal(cart.loadCart().length, 0);
    saved.set(cart.cartKey, JSON.stringify([{ id: 'caja-x6', quantity: 2, price: -100, name: 'corrupto', options: {} }]));
    const migrated = cart.loadCart(); assert.equal(migrated.length, 1); assert.equal(migrated[0].price, 22000);
    saved.set(cart.cartKey, JSON.stringify([item('caja-x6'), item('torta-vintage', {}, { mensaje: { toString: null } })]));
    assert.equal(cart.loadCart().length, 1, 'Un campo corrupto no descarta los demás productos válidos');
    const previous = cart.storage;
    cart.storage = { getItem: () => { throw Error(); }, setItem: () => { throw Error(); } };
    let notified = false; cart.addEventListener(() => { notified = true; });
    cart.clearCart(); assert.equal(cart.addItem(item('caja-x6')), true);
    assert.equal(cart.persistent, false); assert.equal(notified, true); assert.equal(cart.getTotalPrice(), 22000);
    cart.storage = previous;
});
test('Cada tarjeta muestra el precio mínimo real y dice «Desde» cuando hay varios precios', () => {
    const expected = { 'torta-vintage': 'Desde $65.000', 'torta-sencilla': 'Desde $58.000', 'caja-x6': '$22.000', 'alfajor-personalizado': '$60.000 la caja', 'alfajor-individual': 'Desde $2.000 c/u', brownies: 'Desde $24.000', 'galleta-chips': 'Desde $24.000', 'galleta-pistachos': 'Desde $30.000', 'galletas-caja-surtida': '$46.000', 'oso-grande': 'Desde $49.000', 'detalle-golden-1': 'Desde $88.000', 'detalle-torta': '$105.000', 'extra-perlas': '$5.000 - $10.000', 'extra-coronas': 'Precio en asesoría' };
    for (const [id, text] of Object.entries(expected)) assert.equal(Catalog.priceLabel(Catalog.get(id)).text, text, id);
    for (const p of Catalog.all().filter(p => !Catalog.quoteOnly(p))) {
        const { min, max } = Catalog.range(p);
        const label = Catalog.priceLabel(p);
        assert.ok(label.text.includes(Catalog.money(min)), `${p.id}: tarjeta ${label.text}`);
        assert.equal(label.from, min !== max, `${p.id}: «Desde»`);
    }
});
test('Un precio vacío se cotiza por WhatsApp y no entra al pedido', () => {
    const torta = Catalog.get('torta-vintage');
    const porciones = torta.options.find(o => o.id === 'porciones');
    const original = porciones.choices.at(-1).price;
    porciones.choices.at(-1).price = null;
    try {
        assert.equal(Catalog.price(torta, selected(torta.id, { porciones: '25-30' })), null);
        assert.equal(Catalog.quote(torta, selected(torta.id, { porciones: '25-30' })), true);
        assert.equal(Catalog.quote(torta, selected(torta.id)), false);
        assert.equal(Catalog.range(torta).max, 172000, 'El rango ignora la elección sin precio');
        cart.clearCart(); assert.equal(cart.addItem(item(torta.id, { porciones: '25-30' })), false);
    } finally { porciones.choices.at(-1).price = original; }
    const caja = Catalog.get('caja-x6');
    caja.price = null;
    try {
        assert.equal(Catalog.priceLabel(caja).text, 'Cotiza por WhatsApp');
        assert.equal(Catalog.range(caja), null);
        assert.equal(Catalog.priceRefText('caja-x6'), 'precio a consultar');
    } finally { caja.price = 22000; }
});
test('Un producto oculto no se muestra, no se pide y no se cotiza en los textos', () => {
    const data = context.catalogData['oso-pequeno'];
    data.visible = false;
    try {
        assert.equal(Catalog.get('oso-pequeno'), null);
        assert.ok(!Catalog.all().some(p => p.id === 'oso-pequeno'));
        assert.equal(Catalog.priceRef('@detalles'), 49000);
        cart.clearCart(); assert.equal(cart.addItem(item('caja-x6')), true);
        assert.equal(cart.addItem({ id: 'oso-pequeno', quantity: 1, selection: {}, personal: {} }), false);
    } finally { data.visible = true; }
});
test('Los importes de los textos salen del catálogo', () => {
    assert.equal(Catalog.priceRefText('@tortas'), '$58.000');
    assert.equal(Catalog.priceRefText('@alfajores'), '$12.000', 'Pedido mínimo: 6 alfajores de $2.000');
    assert.equal(Catalog.priceRefText('torta-vintage?porciones=25-30'), '$235.000');
    assert.equal(Catalog.priceRefText('galletas-caja-surtida'), '$46.000');
    assert.equal(Catalog.priceRefText('no-existe'), 'precio a consultar');
});
test('Lo que se cobra aparte exige completarse', () => {
    const oso = Catalog.get('oso-grande');
    assert.ok(Catalog.validate(oso, selected(oso.id, { 'mensaje-brownie': true }), {}).length, 'Mensaje pagado vacío');
    assert.equal(Catalog.validate(oso, selected(oso.id, { 'mensaje-brownie': true }), { 'mensaje-brownie': 'Te quiero' }).length, 0);
    const golden = Catalog.get('detalle-golden-1');
    assert.ok(Catalog.validate(golden, { ...selected(golden.id), 'sabor-galleta-sencilla': '' }).length, 'Sabor de galleta vacío');
});
test('Todas las tortas son iguales: ficha con precio y su foto en el mensaje de WhatsApp', () => {
    const tortas = Catalog.all().filter(p => p.category === 'tortas');
    assert.ok(tortas.length > 40);
    const vintagePrices = Catalog.get('torta-vintage').options.find(o => o.id === 'porciones').choices;
    for (const p of tortas) {
        assert.ok(!('design' in p) && !('reference' in p), `${p.id} no lleva marcas internas`);
        assert.equal(Catalog.quoteOnly(p), false, p.id);
        assert.ok(Catalog.photo(p).startsWith('https://laurenreposteria.com/assets/'), p.id);
        if (p.basedOn === 'torta-vintage' && !Array.isArray(context.catalogData[p.id].options)) for (const choice of vintagePrices) assert.equal(price(p.id, { porciones: choice.value }), choice.price, p.id);
    }
    // Los ejemplos salen del catálogo: el centro de control puede unir o eliminar cualquier torta.
    const own = id => context.catalogData[id];
    const sencilla = tortas.find(p => own(p.id).basedOn === 'torta-sencilla' && !Array.isArray(own(p.id).options));
    assert.ok(sencilla, 'Alguna torta toma los precios de Torta Sencilla');
    assert.equal(price(sencilla.id, { porciones: '25-30' }), 215000, 'Toma los precios de Torta Sencilla');
    const torta = tortas.find(p => own(p.id).basedOn === 'torta-vintage' && !Array.isArray(own(p.id).options) && own(p.id).description);
    assert.equal(Catalog.priceLabel(torta).text, 'Desde $65.000');
    assert.notEqual(torta.description, Catalog.get('torta-vintage').description, 'Una torta con descripción propia no muestra la de Torta Vintage');
    cart.clearCart(); assert.equal(cart.addItem(item(torta.id, { porciones: '12-15' })), true);
    assert.equal(cart.getTotalPrice(), 150000);
    assert.ok(decodeURIComponent(cart.generateWhatsAppMessage()).includes(`Foto de referencia: https://laurenreposteria.com${torta.mainImage}`));
    cart.clearCart(); assert.equal(cart.addItem(item('torta-vintage', { porciones: '4-5' })), true);
    assert.ok(decodeURIComponent(cart.generateWhatsAppMessage()).includes('Foto de referencia: https://laurenreposteria.com/assets/propuestas-fotograficas/torta-vintage.webp'), 'Torta Vintage también manda su foto');
    assert.equal(Catalog.photo(Catalog.get('alfajor-individual')), '', 'Solo las tortas mandan foto');
    cart.clearCart();
});
