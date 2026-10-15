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
test('18 combinaciones de galletas y caja surtida tienen precio correcto', () => {
    const flavors = Catalog.get('galletas').options.find(o => o.id === 'sabor').choices;
    for (const flavor of flavors) for (const qty of ['3', '6', '12']) {
        assert.equal(price('galletas', { sabor: flavor.value, cantidad: qty }), flavor.price * Number(qty));
        assert.equal(price('galletas', { presentacion: 'caja-surtida', sabor: flavor.value, cantidad: qty }), 46000);
    }
    assert.equal(Catalog.validate(Catalog.get('galletas'), { presentacion: 'caja-surtida' }).length, 0);
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
    cart.clearCart(); cart.addItem(item('torta-alfajor', {}, { mensaje: 'Te quiero' }));
    assert.equal(cart.isCustom(), true, 'Un mensaje escrito convierte el pedido en personalizado');
    assert.ok(decodeURIComponent(cart.generateWhatsAppMessage()).includes('Mensaje personalizado: Te quiero'));
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
    for (const p of Catalog.all().filter(p => !Catalog.quoteOnly(p))) {
        const opts = Catalog.options(p);
        const prices = [];
        const walk = (i, sel) => {
            if (i === opts.length) { const value = Catalog.price(p, sel); if (Number.isSafeInteger(value)) prices.push(value); return; }
            const o = opts[i];
            for (const v of o.type === 'toggle' ? [false, true] : o.multiple ? [[o.choices[0].value]] : o.choices.map(c => c.value)) walk(i + 1, { ...sel, [o.id]: v });
        };
        walk(0, {});
        const [min, max] = [Math.min(...prices), Math.max(...prices)];
        assert.equal(p.price, min, `${p.id}: precio base`);
        assert.ok(p.priceFormatted.includes(Catalog.money(min)), `${p.id}: tarjeta ${p.priceFormatted}`);
        assert.equal(p.priceFormatted.startsWith('Desde'), min !== max, `${p.id}: «Desde»`);
    }
});
test('Lo que se cobra aparte exige completarse', () => {
    const oso = Catalog.get('oso-grande');
    assert.ok(Catalog.validate(oso, selected(oso.id, { 'mensaje-brownie': true }), {}).length, 'Mensaje pagado vacío');
    assert.equal(Catalog.validate(oso, selected(oso.id, { 'mensaje-brownie': true }), { 'mensaje-brownie': 'Te quiero' }).length, 0);
    const golden = Catalog.get('detalle-golden-1');
    assert.ok(Catalog.validate(golden, { ...selected(golden.id), 'sabor-galleta-sencilla': '' }).length, 'Sabor de galleta vacío');
});
