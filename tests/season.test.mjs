/**
 * Temporada (js/season.js): cuál se ve hoy, sus textos, sus productos y lo que el panel revisa antes de publicar.
 * Catálogo de prueba fijo, con productos de temporada añadidos aquí.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const context = { console, Intl, URL, setTimeout, clearTimeout, addEventListener() {} };
context.window = context;
const saved = new Map();
context.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('./fixtures/catalog-data.js', import.meta.url), 'utf8'), context);
for (const file of ['season-data', 'season', 'catalog-model', 'admin-model', 'brand-icons', 'ui', 'cart-manager']) vm.runInContext(fs.readFileSync(new URL(`../js/${file}.js`, import.meta.url), 'utf8'), context);
const { LaurenSeason: S, Catalog, AdminModel: M, cartManager: cart, LaurenIcons } = context;
const base = JSON.parse(JSON.stringify(context.catalogData));
const seasonal = (id, group, extra = {}) => ({ ...JSON.parse(JSON.stringify(base['caja-x6'])), id, name: id, category: 'temporada', group, ...extra });
const use = (season, products = []) => {
    context.catalogData = { ...JSON.parse(JSON.stringify(base)), ...Object.fromEntries(products.map(p => [p.id, p])) };
    context.seasonData = season;
};
const on = (id, extra = {}) => ({ activa: id, temporadas: [{ id, ...extra }] });
const at = day => new Date(`${day}T15:00:00Z`);
// Lo que devuelve el código de la página viene de otro contexto: se compara como datos.
const plain = value => JSON.parse(JSON.stringify(value));

test('Sin temporada encendida no hay sección ni aviso, y la web del repositorio empieza así', () => {
    assert.equal(S.valid(JSON.parse(JSON.stringify(context.seasonData))), true);
    use({ activa: '', temporadas: [] });
    assert.equal(S.active(), null);
});

test('Cada temporada empieza con sus textos, su icono y el aviso activo, y lo guardado manda sobre eso', () => {
    assert.deepEqual(plain(S.SEASONS.map(s => s.id)), ['navidad', 'amor-y-amistad', 'dia-de-la-madre', 'halloween', 'celebracion']);
    for (const { id, icono } of S.SEASONS) {
        const season = S.get(id, { activa: '', temporadas: [] });
        assert.ok(LaurenIcons(icono), `${id}: su icono existe`);
        for (const text of [season.etiqueta, season.titulo, season.destacado, season.texto, season.aviso.titulo, season.aviso.destacado, season.aviso.texto, season.aviso.boton]) assert.ok(text.trim());
        assert.deepEqual([season.aviso.activo, season.aviso.destino, season.aviso.foto, season.hasta], [true, 'temporada', '', '']);
        // Los textos con que empieza caben en lo que deja escribir el panel, y publicarlos tal cual no los cambia.
        assert.equal(S.valid(S.tidy({ activa: id, temporadas: [{ id }] })), true);
        assert.equal(S.changes({ activa: '', temporadas: [] }, S.tidy({ activa: '', temporadas: [{ id }] })).total, 0);
    }
    const edited = S.get('navidad', on('navidad', { titulo: 'Diciembre', aviso: { activo: false } }));
    assert.deepEqual([edited.titulo, edited.destacado, edited.aviso.activo, edited.aviso.boton], ['Diciembre', 'regala algo dulce.', false, 'Ver la colección']);
    assert.equal(S.get('verano'), null);
});

test('El último día cuenta en Colombia: la temporada se ve ese día completo y se apaga sola al siguiente', () => {
    const season = on('navidad', { hasta: '2026-12-24' });
    // 24 de diciembre, 11:30 p. m. en Colombia (ya es 25 en UTC): todavía se ve.
    assert.equal(S.active(season, new Date('2026-12-25T04:30:00Z'))?.id, 'navidad');
    assert.equal(S.active(season, new Date('2026-12-25T05:30:00Z')), null);
    assert.equal(S.today(new Date('2026-12-25T04:59:00Z')), '2026-12-24');
    assert.equal(S.active(on('navidad'), at('2031-01-01'))?.id, 'navidad');
});

test('El último día se escribe como en Colombia y se lee completo', () => {
    const now = at('2026-11-15');
    assert.equal(S.parseDate('24/12/2026', now), '2026-12-24');
    assert.equal(S.parseDate(' 24-12-26 ', now), '2026-12-24');
    assert.equal(S.parseDate('24 de diciembre', now), '2026-12-24');
    assert.equal(S.parseDate('14 de febrero', now), '2027-02-14');
    assert.equal(S.parseDate('31 de Octubre de 2027', now), '2027-10-31');
    assert.equal(S.parseDate('', now), '');
    for (const bad of ['31/02/2026', '24/13/2026', 'mañana', '24', '0/12/2026']) assert.equal(S.parseDate(bad, now), null, bad);
    assert.equal(S.formatDate('2026-12-24'), '24 de diciembre de 2026');
    assert.equal(S.shortDate('2026-12-24'), '24/12/2026');
});

test('Los productos de temporada solo se ven y se piden mientras su temporada está encendida', () => {
    const products = [seasonal('galletas-navidad', 'navidad'), seasonal('ancheta', 'navidad', { visible: false }), seasonal('detalle-madre', 'dia-de-la-madre')];
    use({ activa: '', temporadas: [] }, products);
    assert.equal(Catalog.get('galletas-navidad'), null);
    assert.equal(Catalog.all().some(p => p.category === 'temporada'), false);
    use(on('navidad'), products);
    assert.deepEqual(plain(Catalog.all().filter(p => p.category === 'temporada').map(p => p.id)), ['galletas-navidad']);
    assert.equal(Catalog.get('detalle-madre'), null);
    // En el pedido: se agrega con la temporada encendida y deja de contarse al apagarla.
    cart.clearCart();
    assert.equal(cart.addItem({ id: 'galletas-navidad', selection: Catalog.defaults(Catalog.get('galletas-navidad')), personal: {}, quantity: 1 }), true);
    use({ activa: '', temporadas: [] }, products);
    assert.equal(cart.loadCart().length, 0);
    // El resto del catálogo no cambia con la temporada.
    assert.equal(Catalog.get('caja-x6').id, 'caja-x6');
    use({ activa: '', temporadas: [] });
});

test('El panel pide su temporada a cada producto de temporada y los deja pedir por cantidad', () => {
    assert.deepEqual([...M.validate([seasonal('x', 'navidad')])], []);
    assert.ok(M.validate([seasonal('x', 'verano')]).some(e => e.includes('elige su temporada')));
    assert.ok(M.validate([seasonal('x', undefined)]).some(e => e.includes('elige su temporada')));
    assert.equal(M.normalize([seasonal('x', 'navidad', { minimum: 3, quantityLabel: 'Cajas' })])[0].minimum, 3);
    assert.equal(M.SECTIONS[0][0], 'temporada');
});

test('Antes de publicar: titular, aviso y productos de la temporada encendida', () => {
    const products = { x: seasonal('x', 'navidad') };
    assert.deepEqual(plain(S.problems({ activa: '', temporadas: [{ id: 'navidad', titulo: '', destacado: '' }] }, products)), []);
    assert.deepEqual(plain(S.problems(on('navidad'), products)), []);
    assert.match(S.problems(on('navidad', { titulo: ' ', destacado: '' }), products)[0].text, /titular de la sección/);
    assert.match(S.problems(on('navidad', { aviso: { titulo: '', destacado: '' } }), products)[0].text, /titular del aviso/);
    assert.match(S.problems(on('navidad', { aviso: { boton: '' } }), products)[0].text, /botón del aviso/);
    const empty = S.problems(on('navidad'), {});
    assert.deepEqual([empty[0].id, /no tiene productos visibles/.test(empty[0].text)], ['season:navidad', true]);
    // Sin productos se puede publicar si el botón lleva a otra parte (o no hay aviso): se avisa, pero no se impide.
    assert.deepEqual(plain(S.problems(on('navidad', { aviso: { destino: 'whatsapp' } }), {})), []);
    assert.match(S.warnings(on('navidad', { aviso: { destino: 'whatsapp' } }), {})[0].text, /solo sale el aviso/);
    assert.match(S.warnings(on('navidad', { aviso: { activo: false } }), {})[0].text, /no se verá nada/);
    assert.match(S.warnings(on('navidad', { hasta: '2026-11-01' }), products, at('2026-11-15'))[0].text, /ya pasó/);
    assert.match(S.warnings(on('navidad', { aviso: { foto: '/assets/propuestas-fotograficas/otra.webp' } }), products)[0].text, /foto del aviso/);
});

test('La foto del aviso es de uno de sus productos visibles; si ya no está, el aviso va sin foto', () => {
    const photo = '/assets/propuestas-fotograficas/galletas.webp';
    const season = S.get('navidad', on('navidad', { aviso: { foto: photo } }));
    assert.equal(S.avisoPhoto(season, { x: seasonal('x', 'navidad', { mainImage: photo }) }), photo);
    assert.equal(S.avisoPhoto(season, { x: seasonal('x', 'navidad', { mainImage: '/assets/propuestas-fotograficas/otra.webp', images: [photo] }) }), photo);
    assert.equal(S.avisoPhoto(season, { x: seasonal('x', 'navidad', { mainImage: photo, visible: false }) }), '');
    assert.equal(S.avisoPhoto(season, { x: seasonal('x', 'halloween', { mainImage: photo }) }), '');
});

test('Cambios y resumen: qué se enciende, qué se apaga y cómo está cada temporada', () => {
    const off = { activa: '', temporadas: [] };
    assert.deepEqual(plain(S.changes(off, on('navidad'))), { changed: [], on: 'navidad', off: '', total: 1 });
    assert.deepEqual(plain(S.changes(on('navidad'), on('halloween'))), { changed: [], on: 'halloween', off: 'navidad', total: 1 });
    assert.equal(S.changes(off, { activa: '', temporadas: [{ id: 'navidad', titulo: 'Diciembre' }] }).total, 1);
    assert.equal(S.changes(on('navidad'), S.tidy(on('navidad'))).total, 0);
    const products = { a: seasonal('a', 'navidad'), b: seasonal('b', 'navidad', { visible: false }) };
    assert.equal(S.summary('navidad', off, products), 'Apagada · 2 productos guardados');
    assert.equal(S.summary('halloween', off, products), 'Apagada · sin productos');
    assert.equal(S.summary('navidad', on('navidad', { hasta: '2026-12-24' }), products, at('2026-11-15')), 'En la portada con 1 producto · Aviso al entrar · Hasta el 24 de diciembre de 2026');
    assert.match(S.summary('navidad', on('navidad', { hasta: '2026-11-01' }), products, at('2026-11-15')), /ya pasó/);
});

test('Lo que se publica queda limpio: temporadas conocidas, textos cortados a su largo y sin campos de más', () => {
    const tidy = S.tidy({ activa: 'verano', temporadas: [{ id: 'verano' }, { id: 'navidad', titulo: `  ${'x'.repeat(200)}  `, hasta: 'pronto', nombre: 'Otro', extra: 1, aviso: { destino: 'https://otro-sitio.com', foto: 5, activo: 'sí' } }] });
    assert.equal(tidy.activa, '');
    assert.deepEqual(plain(tidy.temporadas.map(s => s.id)), ['navidad']);
    const [navidad] = tidy.temporadas;
    assert.deepEqual(Object.keys(navidad), ['id', 'etiqueta', 'titulo', 'destacado', 'texto', 'hasta', 'aviso']);
    assert.deepEqual([navidad.titulo.length, navidad.hasta, navidad.aviso.destino, navidad.aviso.foto, navidad.aviso.activo], [S.LIMITS.titulo, '', 'temporada', '', true]);
    assert.equal(S.valid(tidy), true);
});
