/**
 * Centro de control: acceso con clave + código (doble factor), edición del catálogo en borrador y
 * publicación en Firestore (catalogo/actual). La web lee esa versión al instante (catalog-live.js).
 * Reglas de datos en admin-model.js; reglas de acceso en firestore.rules.
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';
import {
    initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, onAuthStateChanged, signInWithEmailAndPassword,
    signOut, getMultiFactorResolver, multiFactor, TotpMultiFactorGenerator, sendEmailVerification
} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import { getFirestore, doc, collection, getDoc, runTransaction, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore-lite.js';

// El panel no funciona dentro de otra página: GitHub Pages no deja prohibirlo con cabeceras, y así ningún sitio
// ajeno puede mostrarlo escondido para que alguien toque «Publicar» o «Eliminar» sin darse cuenta.
if (window.top !== window.self) {
    document.documentElement.hidden = true;
    throw new Error('El centro de control no se abre dentro de otra página.');
}
await new Promise(resolve => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', resolve, { once: true }) : resolve());
const { escape: esc, icon, imagePath } = LaurenUI;
const M = window.AdminModel;
const $ = id => document.getElementById(id);
const app = initializeApp(window.firebaseConfig);
const auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
auth.languageCode = 'es';
const db = getFirestore(app);
// Copia de la web (catalog-data.js) por si aún no se ha publicado nada desde el panel.
const snapshot = M.clone(window.catalogData);
const catalogRef = doc(db, 'catalogo', 'actual');
// La lista de fotos subidas («Agregar fotos de la web») vive en Firestore, siempre al día: el panel la anota al subir
// y la quita al borrar. La lista de claves de Cloudflare tarda en ponerse al día y mostraba fotos ya borradas.
const uploadsRef = doc(db, 'fotos', 'subidas');
const fillIcons = root => root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
fillIcons(document);
// Vista previa para revisar el diseño en el computador de desarrollo: sin sesión y sin publicar.
const preview = ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).has('vista-previa');
// Worker de fotos (worker/fotos): guarda las subidas en Cloudflare y las sirve en /f/<nombre>. Su origen va en el CSP de cada página.
const PHOTOS_API = 'https://lauren-reposteria.crizczi22.workers.dev/fotos';
const photosReady = Boolean(PHOTOS_API);

/* ---------- Confirmaciones y avisos con las piezas de la marca (nunca los del navegador) ---------- */
const confirmDialog = $('confirmDialog');
/**
 * Abre el diálogo de la marca (#confirmDialog) y resuelve true si se toca la acción; sin `cancel` es un aviso de un
 * solo botón. El foco empieza en la opción segura, para que Enter nunca borre ni una nada por accidente.
 */
function askConfirm({ title, body, action, cancel = 'Cancelar' }) {
    if (confirmDialog.open) return Promise.resolve(false);
    confirmDialog.innerHTML = `<form method="dialog"><h2 id="confirmTitle">${title}</h2><div class="admin-confirm-body">${body}</div><div class="admin-confirm-actions">${cancel ? `<button type="submit" class="btn btn-secondary" value="cancel">${esc(cancel)}</button>` : ''}<button type="submit" class="btn" value="ok">${esc(action)} ${icon('check')}</button></div></form>`;
    confirmDialog.returnValue = '';
    confirmDialog.showModal();
    confirmDialog.querySelector(cancel ? '[value="cancel"]' : '[value="ok"]').focus();
    return new Promise(resolve => confirmDialog.addEventListener('close', () => resolve(confirmDialog.returnValue === 'ok'), { once: true }));
}
confirmDialog.addEventListener('click', event => { if (event.target === confirmDialog) confirmDialog.close('cancel'); });

/* ---------- Acceso ---------- */
let resolver = null;
let enrollment = null;
const views = { login: $('loginForm'), code: $('codeForm'), enroll: $('enrollForm') };
function showAuth(step, lead) {
    $('authView').hidden = false; $('appView').hidden = true; $('adminSession').hidden = true; $('saveBar').hidden = true;
    Object.entries(views).forEach(([name, form]) => { form.hidden = name !== step; });
    $('authLead').textContent = lead;
    views[step].querySelector('input')?.focus();
}
function showError(id, message) { const el = $(id); el.textContent = message; el.hidden = !message; }
const authMessage = error => ({
    'auth/invalid-credential': 'El correo o la clave no coinciden. Revísalos e inténtalo otra vez.',
    'auth/invalid-email': 'Revisa el correo: parece incompleto.',
    'auth/missing-password': 'Escribe tu clave.',
    'auth/too-many-requests': 'Hubo muchos intentos seguidos. Espera unos minutos y vuelve a intentarlo.',
    'auth/invalid-verification-code': 'Ese código no coincide. Escribe el que aparece ahora en tu app.',
    'auth/missing-code': 'Escribe el código de 6 dígitos.',
    'auth/network-request-failed': 'No hay conexión. Revisa tu internet e inténtalo de nuevo.',
    'auth/user-disabled': 'Esta cuenta está desactivada.',
    'auth/unverified-email': 'Primero confirma tu correo con el enlace que te enviamos.',
    'auth/requires-recent-login': 'Por seguridad, sal y vuelve a entrar para terminar este paso.'
}[error?.code] || 'Algo no salió bien. Inténtalo de nuevo en un momento.');

// La sesión se cierra sola tras 30 minutos sin usar el panel, también si se vuelve otro día.
// La última actividad se comparte entre pestañas; los cambios sin publicar se conservan para seguir al entrar de nuevo.
const IDLE_MS = 30 * 60 * 1000;
const ACTIVITY_KEY = 'lauren-admin-actividad';
let lastActivity = 0;
let signedIn = '';
let kept = null;
let signedOutNote = '';
const readActivity = () => { try { return Number(localStorage.getItem(ACTIVITY_KEY)) || 0; } catch { return 0; } };
function markActivity(force = false) {
    const now = Date.now();
    if (!force && now - lastActivity < 15000) return;
    lastActivity = now;
    try { localStorage.setItem(ACTIVITY_KEY, String(now)); } catch { /* sin almacenamiento cuenta solo esta pestaña */ }
}
const idle = () => Date.now() - Math.max(lastActivity, readActivity()) > IDLE_MS;
async function closeIfIdle() {
    if (preview || !auth.currentUser || !idle()) return;
    signedOutNote = 'Por tu seguridad, cerramos la sesión tras 30 minutos sin actividad. Entra de nuevo con tu clave y el código.';
    await signOut(auth);
}
['pointerdown', 'keydown', 'input', 'wheel', 'touchstart'].forEach(type => window.addEventListener(type, () => markActivity(), { capture: true, passive: true }));
document.addEventListener('visibilitychange', () => { if (!document.hidden) closeIfIdle(); });
setInterval(closeIfIdle, 30000);

views.login.addEventListener('submit', async event => {
    event.preventDefault();
    showError('loginError', '');
    const button = views.login.querySelector('button'); button.disabled = true;
    try {
        await signInWithEmailAndPassword(auth, $('loginEmail').value.trim(), $('loginPassword').value);
    } catch (error) {
        if (error.code === 'auth/multi-factor-auth-required') {
            resolver = getMultiFactorResolver(auth, error);
            showAuth('code', 'Ahora, el código de tu celular.');
        } else showError('loginError', authMessage(error));
    } finally { button.disabled = false; $('loginPassword').value = ''; }
});

views.code.addEventListener('submit', async event => {
    event.preventDefault();
    const code = $('codeInput').value.trim();
    if (!/^\d{6}$/.test(code)) { showError('codeError', authMessage({ code: 'auth/missing-code' })); return; }
    const hint = resolver?.hints.find(h => h.factorId === TotpMultiFactorGenerator.FACTOR_ID);
    if (!hint) { showAuth('login', 'Entra con tu correo y tu clave.'); return; }
    const button = views.code.querySelector('button'); button.disabled = true;
    try {
        await resolver.resolveSignIn(TotpMultiFactorGenerator.assertionForSignIn(hint.uid, code));
        resolver = null; $('codeInput').value = ''; showError('codeError', '');
    } catch (error) { showError('codeError', authMessage(error)); }
    finally { button.disabled = false; }
});

// El doble factor solo se activa con el correo confirmado: primero se envía el enlace de confirmación.
const enrollParts = () => views.enroll.querySelectorAll('ol, img, .field-note, .personal-field, button[type=submit]');
async function startEnrollment(user) {
    showAuth('enroll', 'Un paso más para proteger tu cuenta.');
    showError('enrollError', '');
    $('verifyBox')?.remove();
    enrollParts().forEach(el => { el.hidden = false; });
    if (!user.emailVerified) {
        enrollParts().forEach(el => { el.hidden = true; });
        views.enroll.insertAdjacentHTML('beforeend', `<div id="verifyBox"><p class="field-note">Antes, confirma tu correo: te enviamos un enlace a <strong>${esc(user.email)}</strong>. Ábrelo, toca el enlace y vuelve aquí. Si no lo ves, revisa la carpeta de spam.</p><button type="button" class="btn" id="verifyDone">Ya lo confirmé ${icon('arrow')}</button><p><button type="button" class="text-link" id="verifyResend">Enviar el correo otra vez</button></p></div>`);
        const send = async () => {
            try { await sendEmailVerification(user); LaurenUI.toast('Te enviamos el correo de confirmación.'); }
            catch (error) { showError('enrollError', authMessage(error)); }
        };
        $('verifyResend').addEventListener('click', send);
        $('verifyDone').addEventListener('click', async () => {
            await user.reload();
            if (auth.currentUser?.emailVerified) { await auth.currentUser.getIdToken(true); startEnrollment(auth.currentUser); }
            else showError('enrollError', 'Todavía no vemos el correo confirmado. Abre el enlace del correo y vuelve a tocar el botón.');
        });
        await send();
        return;
    }
    try {
        const session = await multiFactor(user).getSession();
        enrollment = await TotpMultiFactorGenerator.generateSecret(session);
        const url = enrollment.generateQrCodeUrl(user.email, 'Lauren Repostería');
        const qr = window.qrcode(0, 'M'); qr.addData(url); qr.make();
        $('enrollQr').src = qr.createDataURL(6, 2);
        $('enrollLink').href = url;
        $('enrollSecret').textContent = enrollment.secretKey;
    } catch (error) { showError('enrollError', authMessage(error)); }
}
views.enroll.addEventListener('submit', async event => {
    event.preventDefault();
    const code = $('enrollCode').value.trim();
    if (!/^\d{6}$/.test(code)) { showError('enrollError', authMessage({ code: 'auth/missing-code' })); return; }
    const button = views.enroll.querySelector('button'); button.disabled = true;
    try {
        await multiFactor(auth.currentUser).enroll(TotpMultiFactorGenerator.assertionForEnrollment(enrollment, code), 'App de códigos');
        enrollment = null;
        await signOut(auth);
        showAuth('login', 'Listo, tu cuenta quedó protegida. Entra de nuevo con tu clave y el código.');
    } catch (error) { showError('enrollError', authMessage(error)); }
    finally { button.disabled = false; }
});

$('signOut').addEventListener('click', async () => {
    if (hasChanges() && !(await askConfirm({
        title: '¿Salir con <em>cambios sin publicar</em>?',
        body: '<p>Si sales ahora, esos cambios se pierden y la web sigue como está. Para conservarlos, toca «Publicar cambios» antes de salir.</p>',
        action: 'Salir',
        cancel: 'Seguir aquí'
    }))) return;
    signedIn = '';
    await signOut(auth);
});

onAuthStateChanged(auth, async user => {
    if (preview) return;
    if (!user) {
        // Si la sesión se cerró sola (inactividad o vencida), el borrador y la ficha abierta esperan al mismo usuario.
        if (signedIn && (hasChanges() || editor.open || picker.open)) kept = { email: signedIn, editor: editor.open || picker.open };
        signedIn = '';
        showAuth(resolver ? 'code' : 'login', resolver ? 'Ahora, el código de tu celular.' : signedOutNote || 'Entra con tu correo y tu clave.');
        document.querySelectorAll('dialog[open]').forEach(dialog => dialog.close());
        signedOutNote = '';
        return;
    }
    if (idle()) { await closeIfIdle(); return; }
    if (!multiFactor(user).enrolledFactors.some(f => f.factorId === TotpMultiFactorGenerator.FACTOR_ID)) { await startEnrollment(user); return; }
    const token = await user.getIdTokenResult();
    if (token.signInSecondFactor !== TotpMultiFactorGenerator.FACTOR_ID) { await signOut(auth); return; }
    markActivity(true);
    signedIn = user.email;
    $('adminUser').textContent = user.email;
    $('adminSession').hidden = false;
    $('authView').hidden = true;
    $('appView').hidden = false;
    const resume = kept?.email === user.email ? kept : null;
    kept = null;
    if (!resume) { await loadCatalog(); return; }
    render();
    if (resume.editor) { renderEditor(); LaurenUI.open(editor); }
    LaurenUI.toast('Seguimos donde ibas: tus cambios siguen aquí.');
});

/* ---------- Catálogo en borrador ---------- */
let original = {};
let loadedJson = null;
let products = [];
const fresh = new Set();
let filter = 'all';
const sectionName = id => M.SECTIONS.find(([key]) => key === id)?.[1] || 'Sin sección';
const hasChanges = () => M.changes(original, products).total > 0;
// El modelo del catálogo lee window.catalogData: se apunta al borrador para calcular precios y herencias.
const useDraft = () => { window.catalogData = M.toCatalog(M.clone(products)); };

async function loadCatalog() {
    $('list').innerHTML = '<li class="admin-count">Cargando tus productos…</li>';
    try {
        const published = await getDoc(catalogRef);
        loadedJson = published.exists() ? published.data().json : null;
        original = loadedJson ? JSON.parse(loadedJson) : M.clone(snapshot);
    } catch {
        warn('No pudimos leer lo que está publicado. Revisa tu conexión y recarga la página.');
        loadedJson = undefined;
        original = M.clone(snapshot);
    }
    products = M.migrate(Object.values(M.clone(original)));
    fresh.clear();
    render();
    // Formato anterior (tortas que tomaban precios de otra, adicionales compartidos): cada grupo queda independiente.
    if (hasChanges()) LaurenUI.toast('Cada grupo quedó con sus propios precios, sabores y adicionales. Revísalos y toca «Publicar cambios».');
}

// Un filtro por tipo de producto: todas las tortas y la vitrina de adicionales en Tortas; brownies y galletas, cada uno en el suyo.
const PAGES = { tortas: ['Tortas', ['tortas', 'extras']], alfajores: ['Alfajores', ['alfajores']], brownies: ['Brownies', ['brownies']], galletas: ['Galletas', ['galletas']], detalles: ['Detalles', ['detalles']] };
const FILTERS = [['all', 'Todos'], ...Object.entries(PAGES).map(([id, [label]]) => [id, label]), ['home', 'En portada'], ['hidden', 'Ocultos'], ['changed', 'Con cambios']];
// La portada muestra hasta cuatro tortas marcadas con «Portada» (Catalog.FEATURED).
const onHome = p => p.featured === true && window.Catalog.featurable(p);
// La lista se agrupa como la web: todas las tortas juntas (primero las que fijan los precios), los adicionales y cada sección.
const groupOf = p => p.category === 'extras' ? 'Vitrina de adicionales (Tortas)' : sectionName(p.category);
const order = p => M.SECTIONS.findIndex(([id]) => id === p.category) * 3 + (p.basedOn ? 1 : 0);
const inFilter = (p, id, changed) => id === 'all' || (id === 'hidden' ? p.visible === false : id === 'changed' ? changed.includes(p.id) : id === 'home' ? onHome(p) : PAGES[id][1].includes(p.category));
function renderFilters() {
    const { changed } = M.changes(original, products);
    $('filters').innerHTML = FILTERS.map(([id, label]) => {
        const count = products.filter(p => inFilter(p, id, changed)).length;
        return (id === 'hidden' || id === 'changed') && !count && filter !== id ? '' : `<button type="button" data-filter="${id}" aria-pressed="${filter === id}">${esc(label)} <span class="admin-filter-count">${count}</span></button>`;
    }).join('');
}
$('filters').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filter = button.dataset.filter; render();
});
$('search').addEventListener('input', render);
const normalizeText = value => String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function render() {
    useDraft();
    renderFilters();
    const { changed } = M.changes(original, products);
    const search = normalizeText($('search').value.trim());
    const shown = products.filter(p => inFilter(p, filter, changed) && (!search || normalizeText(`${p.name} ${groupOf(p)}`).includes(search)))
        .map((p, i) => [p, i]).sort(([a, i], [b, j]) => order(a) - order(b) || i - j).map(([p]) => p);
    $('count').textContent = search ? `${shown.length} ${shown.length === 1 ? 'producto encontrado' : 'productos encontrados'}` : '';
    let group = '';
    $('list').innerHTML = shown.map(p => {
        const label = window.Catalog.priceLabel(window.Catalog.resolve(window.catalogData[p.id])).text;
        const tags = [p.visible === false && '<span class="admin-tag">Oculto</span>', fresh.has(p.id) && '<span class="admin-tag admin-tag-change">Nuevo</span>', !fresh.has(p.id) && changed.includes(p.id) && '<span class="admin-tag admin-tag-change">Con cambios</span>'].filter(Boolean).join('');
        const visibleId = `visible-${esc(p.id)}`;
        const homeId = `home-${esc(p.id)}`;
        const home = window.Catalog.featurable(p) ? `<label class="toggle-option" for="${homeId}"><input id="${homeId}" type="checkbox" data-home="${esc(p.id)}" ${onHome(p) ? 'checked' : ''}><span class="toggle-mark" aria-hidden="true">${icon('check')}</span><span>Portada</span></label>` : '';
        const heading = groupOf(p) !== group ? `<li class="admin-group"><p class="eyebrow">${esc(group = groupOf(p))} · ${shown.filter(x => groupOf(x) === group).length}</p></li>` : '';
        return `${heading}<li class="admin-row${p.visible === false ? ' is-hidden' : ''}">${p.category === 'extras' ? `<span class="admin-row-icon" aria-hidden="true">${icon(p.icon || 'gift')}</span>` : `<img src="${esc(imagePath(p.mainImage))}" alt="" width="56" height="70" loading="lazy">`}<div><h2><button type="button" class="admin-row-name" data-edit="${esc(p.id)}">${esc(p.name || 'Sin nombre')}</button>${tags}</h2><p>${esc(label)}</p></div><div class="admin-row-actions"><label class="toggle-option" for="${visibleId}"><input id="${visibleId}" type="checkbox" data-visible="${esc(p.id)}" ${p.visible !== false ? 'checked' : ''}><span class="toggle-mark" aria-hidden="true">${icon('check')}</span><span>Visible</span></label>${home}<button type="button" class="text-link" data-edit="${esc(p.id)}" aria-label="Editar ${esc(p.name || 'producto')}">Editar ${icon('arrow')}</button></div></li>`;
    }).join('') || `<li class="admin-empty">${search ? 'No encontramos productos con ese nombre. Prueba con otra palabra.' : 'No hay productos aquí.'}</li>`;
    const total = M.changes(original, products).total;
    $('saveBar').hidden = total === 0;
    $('saveCount').textContent = total === 1 ? '1 cambio sin publicar.' : `${total} cambios sin publicar.`;
    $('saveHint').textContent = total === 1 ? 'Aún no se ve en la web.' : 'Aún no se ven en la web.';
    updateNotices();
}
$('list').addEventListener('change', event => {
    const homeInput = event.target.closest('[data-home]');
    if (homeInput) return toggleHome(homeInput);
    const input = event.target.closest('[data-visible]');
    if (input) setVisible(input);
});
// Ocultar un producto pregunta antes: deja de verse en la web, aunque no se borra.
async function setVisible(input) {
    const index = products.findIndex(p => p.id === input.dataset.visible);
    if (!input.checked && !(await askConfirm({
        title: `¿Ocultar <em>${esc(products[index].name || 'este producto')}</em>?`,
        body: '<p>Cuando publiques, deja de verse en la web, no se puede pedir y sale de Google. No se borra: lo vuelves a mostrar marcando «Visible».</p>',
        action: 'Ocultarlo',
        cancel: 'Dejarlo visible'
    }))) { input.checked = true; return; }
    products[index] = { ...products[index], visible: input.checked };
    render();
    LaurenUI.toast(input.checked ? 'Se verá en la web cuando publiques.' : 'Quedará oculto cuando publiques.');
}
// Botón «Portada» de cada torta: hasta cuatro; con la portada llena, avisa cuáles están y no marca una quinta.
function toggleHome(input) {
    const index = products.findIndex(p => p.id === input.dataset.home);
    const others = products.filter(p => p.id !== input.dataset.home && onHome(p));
    if (input.checked && others.length >= window.Catalog.FEATURED) {
        input.checked = false;
        warn(`La portada ya tiene sus ${window.Catalog.FEATURED} tortas. Desmarca una para poner esta.`);
        return;
    }
    // La marca vuelve a quedar como estaba publicada (mismo lugar o sin ella), para no contar un cambio que no lo es.
    const product = { ...products[index] };
    if (input.checked) product.featured = true;
    else if (original[product.id] && 'featured' in original[product.id]) product.featured = false;
    else delete product.featured;
    products[index] = product;
    render();
    LaurenUI.toast(!input.checked ? 'Saldrá de la portada cuando publiques.' : product.visible === false ? 'Irá a la portada cuando la hagas visible y publiques.' : 'Irá a la portada cuando publiques.');
}
$('list').addEventListener('click', event => {
    const button = event.target.closest('[data-edit]');
    if (button) openEditor(products.find(p => p.id === button.dataset.edit));
});
$('discard').addEventListener('click', async () => {
    const { total } = M.changes(original, products);
    if (!(await askConfirm({
        title: '¿Descartar <em>tus cambios</em>?',
        body: `<p>${total === 1 ? 'El cambio sin publicar se pierde' : `Los ${total} cambios sin publicar se pierden`} y el panel vuelve a lo que hoy se ve en la web.</p>`,
        action: 'Descartar',
        cancel: 'Conservarlos'
    }))) return;
    products = M.migrate(Object.values(M.clone(original))); fresh.clear(); pendingDeletes.clear(); render();
});
window.addEventListener('beforeunload', event => { if (hasChanges()) event.preventDefault(); });

/* ---------- Publicar ---------- */
$('publish').addEventListener('click', async () => {
    if (preview) { LaurenUI.toast('Vista previa: aquí no se publica.'); return; }
    // Si algo impide publicar, se abren los avisos con «Ir a arreglarlo» en cada uno.
    if (M.validate(products).length) {
        LaurenUI.toast('Antes de publicar falta arreglar algo. Te lo mostramos en «Avisos».');
        $('noticesButton').click();
        return;
    }
    if (loadedJson === undefined) { warn('No pudimos leer lo que está publicado. Recarga la página antes de publicar.'); return; }
    const { changed, removed, total } = M.changes(original, products);
    const nameOf = id => products.find(p => p.id === id)?.name || original[id]?.name || id;
    const pending = M.warnings(products).length;
    if (!(await askConfirm({
        title: `¿Publicar <em>${total === 1 ? 'tu cambio' : `tus ${total} cambios`}</em>?`,
        body: `<p>Se verán en la web al instante.</p><ul class="admin-confirm-notes">${[...changed.map(id => `<li>${esc(nameOf(id))}: con cambios</li>`), ...removed.map(id => `<li>${esc(nameOf(id))}: se elimina</li>`)].slice(0, 10).join('')}</ul>${total > 10 ? `<p>Y ${total - 10} más.</p>` : ''}${pending ? `<p class="field-note">Hay ${pending === 1 ? 'algo' : `${pending} cosas`} para revisar en «Avisos» (por ejemplo, precios vacíos que se cotizan). Se puede publicar igual.</p>` : ''}`,
        action: 'Publicar',
        cancel: 'Todavía no'
    }))) return;
    const button = $('publish'); button.disabled = true;
    try {
        const data = M.toCatalog(M.normalize(products));
        const json = JSON.stringify(data);
        await runTransaction(db, async transaction => {
            const current = await transaction.get(catalogRef);
            if ((current.exists() ? current.data().json : null) !== loadedJson) throw Object.assign(new Error('conflict'), { code: 'conflict' });
            // Lo publicado es de lectura pública: no lleva el correo de quien publica. El historial, que solo leen
            // los administradores, sí lo guarda.
            transaction.set(catalogRef, { json, updatedAt: serverTimestamp() });
            transaction.set(doc(collection(db, 'historial')), { json, updatedAt: serverTimestamp(), updatedBy: auth.currentUser.email });
        });
        original = data; loadedJson = json; products = M.migrate(Object.values(M.clone(data))); fresh.clear();
        if (filter === 'changed') filter = 'all';
        render();
        const erased = await erasePending();
        LaurenUI.toast(erased ? `Listo. La web ya muestra tus cambios y borramos ${erased === 1 ? 'la foto que sacaste' : `las ${erased} fotos que sacaste`}.` : 'Listo. La web ya muestra tus cambios.', { label: 'Ver la web', run: () => window.open('/', '_blank', 'noopener') });
    } catch (error) {
        if (error.code === 'conflict') warn('Alguien publicó cambios mientras editabas. Recarga la página para verlos antes de publicar.');
        else if (error.code === 'permission-denied') { warn('Tu sesión venció. Entra de nuevo con tu clave y el código.'); await signOut(auth); }
        else warn('No pudimos publicar. Revisa tu conexión e inténtalo de nuevo.');
    } finally { button.disabled = false; }
});

/* ---------- Avisos: lo que falta, lo que conviene revisar y lo que no se pudo hacer ---------- */
// «Avisos» reúne en una lista sencilla lo que impide publicar, lo que conviene revisar y lo que pasó (algo que no se
// permite o una falla), cada uno con «Ir a arreglarlo» cuando lleva a un producto. El aviso rápido sale igual al momento.
const noticesDialog = $('notices');
LaurenUI.dialogEvents(noticesDialog);
const events = [];
let unseen = 0;
/** Algo que no se permite o que falló: aviso rápido y queda anotado en «Avisos». */
function warn(text, id = null) {
    LaurenUI.toast(text);
    events.unshift({ text, id, at: new Date() });
    events.length = Math.min(events.length, 20);
    unseen++;
    updateNotices();
}
// Bizcochos y rellenos sin foto en «Un sabor para recordar» (salen de la primera torta visible).
function flavorWarnings() {
    const source = products.find(p => p.category === 'tortas' && p.visible !== false && p.options?.some(o => M.FLAVOR_PHOTOS.includes(o.id)));
    if (!source || !window.LaurenFlavors) return [];
    const groups = window.LaurenFlavors.groups();
    const missing = M.FLAVOR_PHOTOS.flatMap(id => window.LaurenFlavors.withPhotos(id, groups[id]).filter(item => !item.photo).map(({ choice }) => `«${choice.label}»`));
    if (!missing.length) return [];
    const list = missing.join(', ').replace(/, ([^,]*)$/, ' y $1');
    return [{ id: source.id, text: `${list} ${missing.length === 1 ? 'no tiene foto' : 'no tienen foto'}: en «Un sabor para recordar» ${missing.length === 1 ? 'sale' : 'salen'} solo en texto. Súbelas en la ficha de ${source.name}.` }];
}
function noticeList() {
    useDraft();
    return { problems: M.problems(products), warnings: [...M.warnings(products), ...flavorWarnings()] };
}
function updateNotices() {
    const { problems, warnings } = noticeList();
    const count = problems.length + warnings.length + unseen;
    $('noticeCount').hidden = count === 0;
    $('noticeCount').textContent = count;
    $('noticesButton').setAttribute('aria-label', count ? `Avisos: ${count}` : 'Avisos: todo en orden');
    if (noticesDialog.open) renderNotices();
}
function renderNotices() {
    const { problems, warnings } = noticeList();
    const time = at => at.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
    const item = ({ id, text, at }) => `<li><span>${esc(text)}${at ? ` <small>${time(at)}</small>` : ''}</span>${id && products.some(p => p.id === id) ? `<button type="button" class="text-link" data-fix="${esc(id)}">Ir a arreglarlo ${icon('arrow')}</button>` : ''}</li>`;
    const group = (title, note, list) => list.length ? `<section><p class="eyebrow">${title} · ${list.length}</p><p class="field-note">${note}</p><ul class="admin-notice-list">${list.map(item).join('')}</ul></section>` : '';
    const empty = !problems.length && !warnings.length && !events.length;
    noticesDialog.innerHTML = `<form method="dialog"><h2 id="noticesTitle">${empty ? 'Todo <em>en orden.</em>' : 'Tus <em>avisos.</em>'}</h2><div class="admin-confirm-body">
        ${empty ? '<p>No hay nada que revisar. Cuando algo falte o no se pueda hacer, te lo contamos aquí.</p>' : ''}
        ${group('Para poder publicar', 'Arregla esto antes de tocar «Publicar cambios».', problems)}
        ${group('Para revisar', 'Se puede publicar así, pero quizá quieras completarlo.', warnings)}
        ${group('Lo que pasó', 'Lo que no se pudo hacer mientras usabas el panel.', events)}
        </div><div class="admin-confirm-actions"><button type="submit" class="btn" value="ok">Entendido ${icon('check')}</button></div></form>`;
}
$('noticesButton').addEventListener('click', () => {
    unseen = 0;
    renderNotices();
    updateNotices();
    noticesDialog.showModal();
    noticesDialog.querySelector('[data-fix], [value="ok"]').focus();
});
noticesDialog.addEventListener('click', event => {
    const fix = event.target.closest('[data-fix]');
    if (!fix) return;
    noticesDialog.close();
    const product = products.find(p => p.id === fix.dataset.fix);
    if (product) openEditor(product);
});
// Un error inesperado del panel también se cuenta, en palabras sencillas.
addEventListener('error', () => warn('Algo no funcionó en el panel. Recarga la página; si vuelve a pasar, avísanos y cuéntanos qué estabas haciendo.'));
addEventListener('unhandledrejection', () => warn('Algo no funcionó en el panel. Recarga la página; si vuelve a pasar, avísanos y cuéntanos qué estabas haciendo.'));

/* ---------- Editor ---------- */
const editor = $('editor');
LaurenUI.dialogEvents(editor);
let edit = null;
let editingId = null;
let pristine = '';
// Cerrar la ficha (X, «Cancelar», fondo o Esc): con cambios sin guardar, primero la confirmación de la marca.
async function leaveEditor() {
    if (JSON.stringify(edit) !== pristine && !(await askConfirm({
        title: `¿Salir sin guardar <em>${esc(edit.name?.trim() || 'este producto')}</em>?`,
        body: '<p>Lo que cambiaste en esta ficha se pierde. Para conservarlo, toca «Seguir editando» y luego «Guardar».</p>',
        action: 'Salir sin guardar',
        cancel: 'Seguir editando'
    }))) return;
    LaurenUI.close(editor);
}
editor.addEventListener('click', event => {
    const bounds = editor.getBoundingClientRect();
    const outside = event.target === editor && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
    if (!outside && !event.target.closest('[data-close-dialog]')) return;
    event.stopImmediatePropagation();
    leaveEditor();
}, true);
editor.addEventListener('cancel', event => { event.preventDefault(); leaveEditor(); });

$('newProduct').addEventListener('click', () => {
    const category = M.SECTIONS.some(([id]) => id === filter) ? filter : 'tortas';
    openEditor(M.template(category, products), true);
});

// Productos que se unen a la ficha abierta desde «Agregar fotos de la web»: se eliminan al guardar.
// Fotos adicionales de otros productos que se mueven aquí: salen de ellos al guardar (cada foto vive en un solo producto).
let merges = new Map();
let moves = new Map();
// Fotos subidas que se sacan de un producto con «Borrarla»: se borran después de publicar, si ningún producto las usa.
// En la ficha abierta, lo que se decide de cada foto (borrar o guardar) solo cuenta al tocar «Guardar».
const pendingDeletes = new Set();
let photoFates = new Map();
function openEditor(product, isNew = false) {
    merges = new Map();
    moves = new Map();
    photoFates = new Map();
    edit = M.clone(product);
    editingId = isNew ? null : product.id;
    pristine = JSON.stringify(edit);
    renderEditor();
    LaurenUI.open(editor);
}

const field = (label, path, value, { type = 'text', note = '', placeholder = '', area = false, attrs = '' } = {}) => {
    const id = `f-${path.replace(/\W/g, '-')}`;
    const control = area
        ? `<textarea id="${id}" data-path="${path}" data-kind="${type}" placeholder="${esc(placeholder)}" ${attrs}>${esc(value ?? '')}</textarea>`
        : `<input id="${id}" data-path="${path}" data-kind="${type}" value="${esc(value ?? '')}" placeholder="${esc(placeholder)}" ${type === 'money' ? 'inputmode="numeric"' : ''} ${type === 'number' ? 'inputmode="numeric"' : ''} ${attrs}>`;
    return `<div class="personal-field"><label for="${id}">${esc(label)}</label>${type === 'money' ? `<div class="admin-money">${control}</div>` : control}${note ? `<p class="field-note">${note}</p>` : ''}</div>`;
};
const check = (label, path, checked, disabled = false) => `<label class="toggle-option"><input type="checkbox" data-path="${path}" data-kind="bool" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span class="toggle-mark" aria-hidden="true">${icon('check')}</span><span>${esc(label)}</span></label>`;
// Listas cortas (torta base, sección, filtro) con las opciones de la ficha (.choice), nunca un desplegable del sistema.
const choices = (label, path, value, list) => `<fieldset class="personal-field admin-choice-field"><legend>${esc(label)}</legend><div class="choice-list">${list.map(([id, text]) => `<label class="choice"><input type="radio" name="f-${path}" value="${esc(id)}" data-path="${path}" data-kind="text" ${String(value ?? '') === id ? 'checked' : ''}><span>${esc(text)}</span></label>`).join('')}</div></fieldset>`;
const moneyValue = value => (typeof value === 'number' ? M.formatMoney(value) : value ?? '');

// Un precio a medio escribir con letras (NaN) no se muestra en la vista previa como si fuera otro precio.
const badPrices = product => JSON.stringify(product, (key, value) => typeof value === 'number' && Number.isNaN(value) ? 'NaN' : value).includes('"NaN"');
// Precio que verá el cliente en la tarjeta, con lo que hay escrito ahora mismo.
function pricePreview() {
    try {
        if (badPrices(edit)) return 'Revisa los precios: escríbelos solo con números.';
        return `En la tarjeta se verá: <strong>${esc(window.Catalog.priceLabel(window.Catalog.resolve(M.clone(edit))).text)}</strong>`;
    } catch { return ''; }
}

function pricesHTML(p) {
    const preview = `<p class="field-note admin-preview" id="pricePreview" aria-live="polite">${pricePreview()}</p>`;
    // Vitrina de adicionales (Tortas): el precio se escribe libre, como el negocio lo quiera contar.
    if (p.category === 'extras') return `<fieldset class="admin-fieldset"><legend>Precio</legend>
        ${field('Precio en la vitrina (texto libre)', 'priceText', p.priceText ?? Catalog.priceLabel(p).text, { area: true, attrs: `maxlength="160" ${rows(String(p.priceText ?? '').split('\n'), 2)}`, note: 'Escríbelo como quieras, por ejemplo con rangos según el tamaño: «De $2.000 a $5.000 según el tamaño de la torta». Se ve bajo el nombre en «Adicionales para tu torta» (/tortas/) y se acomoda a su espacio. Para cobrarlo en una torta, agrégalo en «Adicionales» de esa torta.' })}</fieldset>`;
    const pricedGroups = (p.options || []).some(M.priced);
    const basePrice = pricedGroups ? '' : `<div class="admin-grid">${field('Precio', 'price', moneyValue(p.price), { type: 'money', placeholder: 'Cotiza por WhatsApp', note: 'Déjalo vacío para mostrar «Cotiza por WhatsApp».' })}${field('Texto después del precio', 'priceSuffix', p.priceSuffix, { placeholder: 'Ej.: c/u, la caja', note: 'Opcional.' })}</div>`;
    return `<fieldset class="admin-fieldset"><legend>Precios</legend>${preview}${basePrice}${groupsHTML(p, true)}
        <p><button type="button" class="admin-add" data-action="add-option" data-priced="true">${icon('plus')} ${pricedGroups ? 'Agregar otro grupo de precios' : 'Poner un precio por tamaño o porciones'}</button></p></fieldset>`;
}
// Los cuadros de texto muestran todo su contenido sin desplazarse por dentro.
const rows = (lines, min = 3) => `rows="${Math.max(min, lines.length + 1)}"`;

// Lo que elige el cliente: sabores, rellenos, colores y adicionales, cada uno con su costo si suma al total
// (por tamaño cuando el producto tiene porciones o presentaciones). Todo es de este producto y nada se comparte.
function choicesHTML(p) {
    if (p.category === 'extras') return '';
    const addons = (p.options || []).some(o => o.addons);
    return `<fieldset class="admin-fieldset"><legend>Lo que elige el cliente</legend>
        <p class="field-note">Lo que el cliente puede escoger en este producto. Si algo cuesta más, escribe cuánto suma${M.sizeOf(p) ? ' en cada tamaño' : ''}.</p>
        ${p.category === 'tortas' ? '<p class="field-note">El mensaje o las letras de la torta no se escriben en la web: se acuerdan con el cliente en la asesoría.</p>' : ''}
        ${groupsHTML(p, false)}
        <p class="admin-add-row"><button type="button" class="admin-add" data-action="add-option">${icon('plus')} Agregar un grupo (por ejemplo, sabores)</button>${addons ? '' : `<button type="button" class="admin-add" data-action="add-addons">${icon('plus')} Agregar adicionales</button>`}</p></fieldset>`;
}

// Costo de una elección: una casilla por tamaño (con «Mismo valor en todos») o una sola si el producto no tiene tamaños.
function extraHTML(p, option, o, choice, c) {
    const size = M.sizeOf(p);
    const blank = option.addons ? 'Cotiza' : 'Sin costo';
    const name = choice.label || `la opción ${c + 1}`;
    if (!size) return `<div class="admin-extra-sizes"><label class="admin-extra"><span>${option.addons ? 'Precio' : 'Costo adicional'}</span><span class="admin-money"><input data-extra="${o}.${c}" data-kind="money" inputmode="numeric" aria-label="${option.addons ? 'Precio' : 'Costo adicional'} de ${esc(name)}" value="${esc(moneyValue(typeof choice.extra === 'number' ? choice.extra : null))}" placeholder="${blank}"></span></label></div>`;
    const value = key => typeof choice.extra === 'number' ? choice.extra : choice.extra?.[key];
    return `<div class="admin-extra-sizes">${size.choices.map(sz => `<label class="admin-extra"><span>${esc(sz.label || 'Tamaño')}</span><span class="admin-money"><input data-extra="${o}.${c}" data-size="${esc(sz.value)}" data-kind="money" inputmode="numeric" aria-label="${option.addons ? 'Precio' : 'Costo adicional'} de ${esc(name)} en ${esc(sz.label)}" value="${esc(moneyValue(value(sz.value)))}" placeholder="${blank}"></span></label>`).join('')}</div>
        <button type="button" class="admin-add admin-add-small" data-action="same-extra" data-option="${o}" data-choice="${c}">${icon('check')} Mismo valor en todos</button>`;
}
// Foto de un bizcocho o relleno («Un sabor para recordar»): la subida, o la de la web que ya le corresponde.
function choicePhotoHTML(p, option, o, choice, c) {
    if (!M.FLAVOR_PHOTOS.includes(option.id) || p.category !== 'tortas') return '';
    const fallback = window.LaurenFlavors?.withPhotos(option.id, option.choices).find(item => item.choice === choice)?.photo?.src;
    const src = choice.image || fallback;
    return `<div class="admin-choice-photo">${src ? `<img src="${esc(imagePath(src))}" alt="" width="64" height="64" loading="lazy">` : `<span class="admin-choice-nophoto">${icon('cake')}</span>`}
        <div><p class="field-note">${choice.image ? 'Foto subida.' : src ? 'Foto de la web.' : 'Sin foto: en «Un sabor para recordar» sale en «También».'}</p>
        <button type="button" class="admin-add admin-add-small" data-action="choice-photo" data-option="${o}" data-choice="${c}">${icon('plus')} ${src ? 'Cambiar foto' : 'Subir foto'}</button>${choice.image ? `<button type="button" class="admin-danger" data-action="choice-photo-remove" data-option="${o}" data-choice="${c}">Quitar foto</button>` : ''}</div></div>`;
}

function groupsHTML(p, pricedOnes) {
    return (p.options || []).map((option, o) => [option, o]).filter(([option]) => (option.type !== 'toggle' && M.priced(option)) === pricedOnes).map(([option, o]) => {
        const path = `options.${o}`;
        if (option.type === 'toggle') return `<div class="admin-option">${field('Casilla que puede marcar', `${path}.label`, option.label)}${field('Costo adicional', `${path}.priceModifier`, moneyValue(option.priceModifier), { type: 'money', placeholder: 'Sin costo' })}</div>`;
        const depends = option.dependsOn ? (() => {
            const parent = p.options.find(x => x.id === option.dependsOn);
            const values = [].concat(option.showWhen).map(v => parent?.choices?.find(c => c.value === v)?.label || v).join(' o ');
            return `<p class="field-note">Solo aparece cuando se elige «${esc(values)}» en «${esc(parent?.label || '')}».</p>`;
        })() : '';
        const multiplier = option.multiplier ? '<p class="field-note">Multiplica el precio por la cantidad elegida.</p>' : '';
        const remove = (c, choice) => option.multiplier ? '<span></span>' : `<button type="button" class="icon-button" data-action="remove-choice" data-option="${o}" data-choice="${c}" aria-label="Quitar ${esc(choice.label || 'esta opción')}">${icon('close')}</button>`;
        const label = (c, choice) => `<input aria-label="Opción ${c + 1} de ${esc(option.label)}" data-path="${path}.choices.${c}.label" data-kind="text" value="${esc(choice.label)}" placeholder="Escribe la opción" ${option.multiplier ? 'readonly' : ''}>`;
        let body;
        if (pricedOnes) {
            body = `<div class="admin-choice admin-choice-head" aria-hidden="true"><span>Opción</span><span>Precio</span><span></span></div>` + (option.choices || []).map((choice, c) => `<div class="admin-choice">${label(c, choice)}<div class="admin-money"><input aria-label="Precio de ${esc(choice.label || `la opción ${c + 1}`)}" data-path="${path}.choices.${c}.price" data-kind="money" inputmode="numeric" value="${esc(moneyValue(choice.price))}" placeholder="Cotiza"></div>${remove(c, choice)}</div>`).join('');
        } else {
            body = (option.choices || []).map((choice, c) => `<div class="admin-choice-card"><div class="admin-choice no-price">${label(c, choice)}${remove(c, choice)}</div>${option.multiple && !option.addons ? '' : extraHTML(p, option, o, choice, c)}${choicePhotoHTML(p, option, o, choice, c)}</div>`).join('');
        }
        const note = pricedOnes ? '<p class="field-note">Si dejas un precio vacío, esa opción dice «Cotiza por WhatsApp».</p>'
            : option.addons ? '<p class="field-note">Detalles que el cliente puede sumar a su torta. Escribe su precio; si lo dejas vacío, se puede marcar, pero esa torta se consulta por WhatsApp.</p>'
            : option.multiple ? '' : '<p class="field-note">¿Alguna cuesta más, como un relleno premium? Escribe cuánto suma. Si lo dejas vacío, no suma nada.</p>';
        return `<div class="admin-option">${field('Título del grupo (lo ve el cliente)', `${path}.label`, option.label)}${depends}${multiplier}${note}${body}
            <div class="admin-option-actions">${option.multiplier ? '<span></span>' : `<button type="button" class="admin-add" data-action="add-choice" data-option="${o}">${icon('plus')} ${option.addons ? 'Agregar adicional' : 'Agregar opción'}</button>`}<button type="button" class="admin-danger" data-action="remove-option" data-option="${o}">Quitar este grupo</button></div></div>`;
    }).join('');
}

// La principal va en la tarjeta; las demás (misma referencia, otros ángulos) se ven en pequeño bajo la foto de la ficha.
// Bajo cada foto, los tres puntos abren sus opciones: hacerla principal y sacarla de este producto.
const takeOut = () => edit?.category === 'tortas' ? 'Sacar de esta torta' : 'Sacar de este producto';
const photoMenu = (src, i) => `<div class="admin-photo-actions"><button type="button" class="icon-button" popovertarget="photoMenu${i}" aria-label="Opciones de la ${i ? `foto ${i + 1}` : 'foto principal'}">${icon('more')}</button><div class="admin-photo-menu" id="photoMenu${i}" popover>${i ? `<button type="button" data-action="main-photo" data-src="${esc(src)}">${icon('check')} Hacer principal</button>` : `<button type="button" disabled>${icon('check')} Es la principal</button>`}<button type="button" data-action="remove-photo" data-src="${esc(src)}">${icon('minus')} ${takeOut()}</button></div></div>`;
function photosHTML(p) {
    const images = M.photos(p);
    const more = images.length - 1;
    return `<fieldset class="admin-fieldset"><legend>Fotos</legend>
        <p class="field-note">${images.length ? `La principal se ve en la tarjeta. ${more > 0 ? `Las otras ${more === 1 ? 'una se ve' : `${more} se ven`}` : 'Las que agregues se ven'} debajo, en pequeño, cuando el cliente abre el producto. Suma aquí las fotos de la misma referencia y no tienes que crear un producto por cada una.` : 'Este producto aún no tiene foto. Agrega una para mostrarlo en la web.'}</p>
        ${images.length ? `<div class="admin-gallery"><div class="admin-photo admin-photo-lead"><img src="${esc(imagePath(images[0]))}" alt="Foto principal" width="160" height="200" loading="lazy">${photoMenu(images[0], 0)}</div>
            ${more > 0 ? `<div class="photo-strip admin-photo-strip">${LaurenUI.stripArrow(-1, 'Ver fotos anteriores')}<div class="photo-strip-track" role="group" aria-label="Más fotos (${more})">${images.slice(1).map((src, i) => `<div class="admin-photo"><img src="${esc(imagePath(src))}" alt="Foto ${i + 2}" width="96" height="120" loading="lazy">${photoMenu(src, i + 1)}</div>`).join('')}</div>${LaurenUI.stripArrow(1, 'Ver más fotos')}</div>` : ''}</div>` : ''}
        <div class="admin-photo-add"><button type="button" class="admin-add" data-action="upload-photo">${icon('plus')} Subir fotos nuevas</button><button type="button" class="admin-add" data-action="pick-photo">${icon('plus')} Agregar fotos de la web</button></div>
        <input type="file" id="photoUpload" accept="image/*" multiple hidden>
        <p class="field-note" id="uploadStatus" aria-live="polite">${uploading ? esc(uploading) : 'Puedes elegir varias a la vez. Mejor verticales, como las de la web: se ajustan solas para que carguen rápido.'}</p></fieldset>`;
}

// «Así se verá en la web»: la misma tarjeta de la web (o el bloque de adicional), con lo que hay escrito ahora.
function cardPreview(p) {
    let r = p;
    try { r = window.Catalog.resolve(M.clone(p)); } catch { /* precios a medio escribir: se usa el borrador tal cual */ }
    let price = 'Revisa los precios';
    try { const label = window.Catalog.priceLabel(r); if (!badPrices(p)) price = label.from ? `<span class="price-from">Desde</span> ${esc(label.amount)}` : esc(label.text); } catch { /* precios a medio escribir */ }
    if (p.category === 'extras') return `<article class="extra"><span class="extra-symbol">${icon(p.icon || 'gift')}</span><h3>${esc(p.name || 'Sin nombre')}</h3><p>${price}</p><span class="text-link">Consultar ${icon('diagonal')}</span></article>`;
    const quoted = window.Catalog.quoteOnly(r);
    const photos = M.photos(p), src = photos[0];
    return `<article class="product-card"><div class="product-image">${src ? `<img src="${esc(imagePath(src))}" alt="" width="600" height="680">${LaurenUI.moreDesigns(photos)}` : '<span class="admin-card-empty">Sin foto</span>'}<span class="product-open">${icon('diagonal')}</span></div><div class="product-meta"><h3 class="product-name">${esc(p.name || 'Sin nombre')}</h3><p class="product-price">${quoted ? 'A tu medida' : price}</p></div>${cardText(r) ? `<p class="product-description">${esc(cardText(r))}</p>` : ''}<span class="text-link">${quoted ? 'Consultar diseño' : 'Elegir detalles'} ${icon('arrow')}</span></article>`;
}
// Igual que la web: las tarjetas de torta (compactas) solo llevan la frase corta; las demás, la frase o la descripción.
const cardText = r => r.category === 'tortas' ? r.summary || '' : r.summary || r.description || '';
const previewTitle = p => `Así se verá en la web <span class="admin-tag"${p.visible === false ? '' : ' data-off'}>Oculto</span>`;

function renderEditor() {
    const p = edit;
    const groups = M.GROUPS[p.category];
    // La portada tiene cuatro lugares, solo para tortas: si ya están ocupados por otras, la casilla no se puede marcar.
    const max = window.Catalog.FEATURED;
    const homeable = window.Catalog.featurable(p);
    const others = products.filter(x => x.id !== editingId && onHome(x));
    const full = others.length >= max && p.featured !== true;
    const names = list => list.map(x => x.name).join(', ').replace(/, ([^,]*)$/, ' y $1');
    const personal = p.personalization?.enabled ? (p.personalization.fields || [p.personalization]).map(f => `«${f.label}» (hasta ${f.maxLength || 100} caracteres)`).join(', ') : '';
    const section = choices('Sección de la web', 'category', p.category, M.SECTIONS);
    const where = `<fieldset class="admin-fieldset admin-side-where"><legend>Dónde aparece</legend><div class="admin-grid">${section}${groups ? choices('Filtro en la página', 'group', p.group, [['', 'Ninguno'], ...groups]) : ''}</div>${editingId ? '<p class="field-note">Cambia la sección solo si el producto pasa a otra página de la web.</p>' : ''}</fieldset>`;
    editor.innerHTML = `<form novalidate>
        <div class="dialog-scroll">
            <button class="icon-button dialog-close" type="button" data-close-dialog aria-label="Cerrar">${icon('close')}</button>
            <p class="eyebrow">${editingId ? sectionName(p.category) : 'Nuevo producto'}</p>
            <h2 id="editorTitle">${esc(p.name || 'Sin nombre')}</h2>
            <div class="admin-editor-layout"><div class="admin-editor-main">
            <fieldset class="admin-fieldset"><legend>Lo básico</legend>
                ${field('Nombre', 'name', p.name, { attrs: 'required maxlength="80"', placeholder: 'Ej.: Torta Mariposa' })}
            </fieldset>
            ${pricesHTML(p)}
            ${p.category === 'extras' ? '' : photosHTML(p)}
            <fieldset class="admin-fieldset"><legend>Textos</legend>
                ${field('Frase corta de la tarjeta', 'summary', p.summary, { note: p.category === 'tortas' ? 'Una línea que invite, bajo el nombre de la torta. Si la dejas vacía, la tarjeta muestra solo el nombre y el precio.' : 'Una línea que invite. Si la dejas vacía, se usa la descripción.', attrs: 'maxlength="90"' })}
                ${field('Descripción', 'description', p.description, { area: true, attrs: rows(Array(Math.ceil(String(p.description || '').length / 70)).fill(0)) })}
                ${field('Qué incluye (una cosa por línea)', 'includes', (p.includes || []).join('\n'), { type: 'lines', area: true, attrs: rows(p.includes || []) })}
                ${field('Notas en la ficha (una por línea)', 'notes', (p.notes || []).join('\n'), { type: 'lines', area: true, note: 'Aclaraciones que se ven bajo las opciones.', attrs: rows(Array(Math.ceil((p.notes || []).join(' ').length / 70)).fill(0), 2) })}
            </fieldset>
            ${choicesHTML(p)}
            ${!M.QUANTITY.includes(p.category) ? '' : `<fieldset class="admin-fieldset"><legend>Cantidad</legend><div class="admin-grid">
                ${field('Cantidad mínima por pedido', 'minimum', p.minimum ?? 1, { type: 'number', attrs: 'min="1" max="99"' })}
                ${field('Cómo se llama la cantidad', 'quantityLabel', p.quantityLabel ?? 'Cantidad de esta presentación', { note: 'Ej.: Número de cajas.' })}
            </div>${personal ? `<p class="field-note">El cliente también escribe: ${esc(personal)}.</p>` : ''}</fieldset>`}
            ${editingId ? '<div class="admin-delete"><button type="button" class="admin-danger" data-action="delete">Eliminar producto</button><p class="field-note">Si solo quieres quitarlo por un tiempo, mejor desmarca «Visible en la web».</p></div>' : ''}
            <input type="file" id="choicePhotoUpload" accept="image/*" hidden>
            <p class="field-error" id="editorError" role="alert" hidden></p>
            </div>
            <aside class="admin-editor-side" aria-label="Vista previa y estado">
                <div class="admin-side-track"><div class="admin-side-sticky">
                <fieldset class="admin-fieldset admin-side-preview"><legend id="cardPreviewTitle">${previewTitle(p)}</legend><div class="admin-card-preview" id="cardPreview" aria-hidden="true">${cardPreview(p)}</div></fieldset>
                <fieldset class="admin-fieldset admin-side-state"><legend>En la web</legend>
                    <div class="admin-toggles">${check('Visible en la web', 'visible', p.visible !== false)}${homeable ? check('Mostrar en la portada', 'featured', p.featured === true, full) : ''}</div>
                    ${homeable ? `<p class="field-note admin-featured-note">${full ? `La portada ya tiene sus ${max} tortas: ${esc(names(others))}. Desmarca una de ellas para poner esta.` : `En la portada caben ${max} tortas. Ahora hay ${others.length + (p.featured === true ? 1 : 0)}; si faltan, la web la completa con las siguientes del catálogo.`}</p>` : ''}
                </fieldset>
                </div></div>
                ${where}
            </aside></div>
        </div>
        <div class="admin-editor-actions">
            <div><button type="button" class="btn btn-secondary" data-close-dialog>Cancelar</button><button type="submit" class="btn">Guardar ${icon('check')}</button></div>
        </div>
    </form>`;
    requestAnimationFrame(() => editor.querySelectorAll('.photo-strip-track').forEach(stripEnds));
}

function setPath(target, path, value) {
    const keys = path.split('.');
    let node = target;
    keys.slice(0, -1).forEach(key => { node = node[key]; });
    node[keys.at(-1)] = value;
}
function readInput(input) {
    const kind = input.dataset.kind;
    if (kind === 'bool') return input.checked;
    if (kind === 'money') return M.parseMoney(input.value);
    if (kind === 'number') { const n = Number(input.value); return input.value.trim() === '' ? null : Number.isInteger(n) ? n : NaN; }
    if (kind === 'lines') return input.value.split('\n');
    return input.value;
}
// Costo de una elección (por tamaño o uno solo). Vacío = sin costo (en adicionales, se cotiza).
function setExtra(choice, size, value) {
    if (!size) { if (value === null) delete choice.extra; else choice.extra = value; return; }
    const sizes = M.sizeOf(edit)?.choices.map(c => c.value) || [];
    // Un costo único de antes pasa a ser el de cada tamaño.
    if (typeof choice.extra === 'number') choice.extra = Object.fromEntries(sizes.map(key => [key, choice.extra]));
    choice.extra = { ...(choice.extra && typeof choice.extra === 'object' ? choice.extra : {}), [size]: value };
}
editor.addEventListener('input', event => {
    const cost = event.target.closest('[data-extra]');
    if (cost) {
        const [o, c] = cost.dataset.extra.split('.').map(Number);
        setExtra(edit.options[o].choices[c], cost.dataset.size, readInput(cost));
        const preview = editor.querySelector('#pricePreview');
        if (preview) preview.innerHTML = pricePreview();
        editor.querySelector('#cardPreview').innerHTML = cardPreview(edit);
        return;
    }
    const input = event.target.closest('[data-path]');
    if (!input) return;
    const value = readInput(input);
    const path = input.dataset.path;
    // Pasar un producto a otra página de la web: se pregunta antes.
    if (path === 'category' && editingId && value !== edit.category) {
        const before = edit.category;
        askConfirm({
            title: `¿Pasar <em>${esc(edit.name?.trim() || 'este producto')}</em> a ${esc(sectionName(value))}?`,
            body: `<p>Deja de verse en ${esc(sectionName(before))} y aparece en la página de ${esc(sectionName(value))} cuando guardes y publiques.</p>`,
            action: 'Pasarlo',
            cancel: 'Dejarlo donde está'
        }).then(ok => {
            if (ok) return applyInput(path, value, input);
            const radio = editor.querySelector(`[data-path="category"][value="${CSS.escape(before)}"]`);
            if (radio) radio.checked = true;
        });
        return;
    }
    applyInput(path, value, input);
});
function applyInput(path, value, input) {
    setPath(edit, path, value);
    if (path === 'name') editor.querySelector('#editorTitle').textContent = value || 'Sin nombre';
    const preview = editor.querySelector('#pricePreview');
    if (preview) preview.innerHTML = pricePreview();
    editor.querySelector('#cardPreview').innerHTML = cardPreview(edit);
    editor.querySelector('#cardPreviewTitle').innerHTML = previewTitle(edit);
    if (path === 'category' || path === 'featured') {
        if (path === 'category') delete edit.group;
        const scroll = editor.querySelector('.dialog-scroll').scrollTop;
        const top = input.closest('label').getBoundingClientRect().top;
        renderEditor();
        editor.querySelector('.dialog-scroll').scrollTop = scroll;
        // La ficha se vuelve a dibujar con otras partes (precios, «Portada»…): la opción tocada se queda bajo el dedo.
        const chosen = editor.querySelector(`[data-path="${path}"]${input.type === 'radio' ? ':checked' : ''}`);
        // Si la ficha quedó más corta, se deja aire al final para poder mantenerla en su sitio (se va al volver a dibujarla).
        if (chosen) {
            const scroller = editor.querySelector('.dialog-scroll');
            const target = scroller.scrollTop + chosen.closest('label').getBoundingClientRect().top - top;
            const lack = target - (scroller.scrollHeight - scroller.clientHeight);
            if (lack > 0) scroller.style.paddingBottom = `${parseFloat(getComputedStyle(scroller).paddingBottom) + lack}px`;
            scroller.scrollTop = target;
        }
        // El foco vuelve a la opción elegida: con el teclado, las flechas siguen cambiando de opción.
        chosen?.focus({ preventScroll: true });
    }
}

// Flechas de la fila de fotos del editor: desplazan la fila casi un ancho completo.
editor.addEventListener('click', event => {
    const arrow = event.target.closest('[data-strip-step]');
    if (!arrow) return;
    const track = arrow.parentElement.querySelector('.photo-strip-track');
    track.scrollBy({ left: Number(arrow.dataset.stripStep) * track.clientWidth * 0.8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});
editor.addEventListener('scroll', event => {
    editor.querySelector('.admin-photo-menu:popover-open')?.hidePopover();
    if (event.target.classList?.contains('photo-strip-track')) stripEnds(event.target);
}, true);
// El menú de una foto flota en la capa superior (la fila de fotos no lo recorta): se ubica bajo sus tres puntos,
// alineado a la derecha, o encima si no cabe debajo. Lo usan la ficha y el selector de fotos.
function placeMenus(root) {
    root.addEventListener('beforetoggle', event => {
        const menu = event.target;
        if (event.newState !== 'open' || !menu.classList?.contains('admin-photo-menu')) return;
        const anchor = root.querySelector(`[popovertarget="${menu.id}"]`).getBoundingClientRect();
        menu.style.top = `${anchor.bottom + 4}px`;
        menu.style.left = 'auto';
        menu.style.right = `${Math.max(8, document.documentElement.clientWidth - anchor.right)}px`;
    }, true);
    root.addEventListener('toggle', event => {
        const menu = event.target;
        if (event.newState !== 'open' || !menu.classList?.contains('admin-photo-menu')) return;
        const anchor = root.querySelector(`[popovertarget="${menu.id}"]`).getBoundingClientRect();
        const box = menu.getBoundingClientRect();
        if (box.left < 8) { menu.style.right = 'auto'; menu.style.left = '8px'; }
        if (box.bottom > innerHeight - 8) menu.style.top = `${Math.max(8, anchor.top - 4 - box.height)}px`;
    }, true);
}
placeMenus(editor);
addEventListener('resize', () => document.querySelector('.admin-photo-menu:popover-open')?.hidePopover());
function stripEnds(track) {
    const strip = track.closest('.photo-strip');
    strip.querySelector('[data-strip-step="-1"]').disabled = track.scrollLeft <= 2;
    strip.querySelector('[data-strip-step="1"]').disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
}

editor.addEventListener('click', async event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const option = edit.options?.[Number(button.dataset.option)];
    // Un tamaño nuevo lleva su identificador desde ya: los costos por tamaño de los sabores se guardan con él.
    if (action === 'add-choice') option.choices.push(M.priced(option) ? { value: M.unique('tamano', new Set(option.choices.map(c => c.value))), label: '', price: null } : { value: '', label: '' });
    if (action === 'add-addons') { edit.options = [...(edit.options || []), M.addonsGroup([{ value: '', label: '' }])]; }
    if (action === 'same-extra') {
        // «Mismo valor en todos»: el primer tamaño con valor se copia en los demás.
        const choice = option.choices[Number(button.dataset.choice)];
        const sizes = M.sizeOf(edit)?.choices.map(c => c.value) || [];
        const first = typeof choice.extra === 'number' ? choice.extra : sizes.map(key => choice.extra?.[key]).find(v => typeof v === 'number');
        if (first === undefined) { warn('Para copiar el mismo valor, escribe primero el de un tamaño.', editingId); return; }
        const others = sizes.map(key => typeof choice.extra === 'object' ? choice.extra?.[key] : choice.extra).filter(v => typeof v === 'number' && v !== first);
        if (others.length && !(await askConfirm({
            title: `¿Poner ${esc(window.Catalog.money(first))} en todos los tamaños de <em>${esc(choice.label || 'esta opción')}</em>?`,
            body: '<p>Se reemplazan los valores que ya tenía en los otros tamaños.</p>',
            action: 'Poner en todos',
            cancel: 'Dejarlos como están'
        }))) return;
        choice.extra = Object.fromEntries(sizes.map(key => [key, first]));
    }
    if (action === 'choice-photo') { choicePhotoTarget = { o: Number(button.dataset.option), c: Number(button.dataset.choice) }; if (uploading) warn('Espera a que terminen de subir las fotos.'); else editor.querySelector('#choicePhotoUpload').click(); return; }
    if (action === 'choice-photo-remove') {
        const choice = option.choices[Number(button.dataset.choice)];
        if (!(await askConfirm({
            title: `¿Quitar la foto de <em>${esc(choice.label || 'esta opción')}</em>?`,
            body: '<p>En «Un sabor para recordar» se verá la foto de la web que le corresponda o, si no hay, solo su nombre. La foto queda en tus fotos subidas.</p>',
            action: 'Quitar foto',
            cancel: 'Dejarla'
        }))) return;
        delete choice.image;
    }
    if (action === 'remove-choice') {
        const choice = option.choices[Number(button.dataset.choice)];
        if (choice.label?.trim() && !(await askConfirm({
            title: `¿Quitar <em>${esc(choice.label)}</em> de ${esc(option.label || 'este grupo')}?`,
            body: '<p>Sale de este producto con su precio y su foto. Hasta que toques «Guardar», puedes volver atrás con «Cancelar».</p>',
            action: 'Quitar',
            cancel: 'Conservarla'
        }))) return;
        option.choices.splice(Number(button.dataset.choice), 1);
    }
    if (action === 'remove-option') {
        if (!(await askConfirm({
            title: `¿Quitar el grupo <em>${esc(option.label || 'sin título')}</em>?`,
            body: '<p>Se quitan todas sus opciones de este producto. Hasta que toques «Guardar», puedes volver atrás con «Cancelar».</p>',
            action: 'Quitar grupo',
            cancel: 'Conservarlo'
        }))) return;
        edit.options.splice(Number(button.dataset.option), 1);
    }
    if (action === 'add-option') {
        edit.options = edit.options || [];
        edit.options.push({ id: '', label: button.dataset.priced ? 'Tamaño' : 'Sabor', type: 'radio', required: true, choices: [button.dataset.priced ? { value: '', label: '', price: null } : { value: '', label: '' }] });
    }
    if (action === 'main-photo') { const src = button.dataset.src; edit.images = [src, ...(edit.images || []).filter(s => s !== src)]; edit.mainImage = src; }
    if (action === 'remove-photo') {
        // Sacar una foto nunca la pierde: una de la web vuelve al selector; con una subida se elige guardarla o borrarla.
        const src = button.dataset.src;
        button.closest('[popover]')?.hidePopover();
        const where = `«${edit.name?.trim() || 'este producto'}»`;
        const other = edit.category === 'tortas' ? 'otra torta' : 'otro producto';
        const uploaded = src.startsWith(M.UPLOADED);
        const erase = uploaded && await askConfirm({
            title: '¿Qué hacemos con <em>esta foto</em>?',
            body: `<ul class="admin-confirm-list"><li><img src="${esc(imagePath(src))}" alt="" width="40" height="50"><span>Foto subida</span><small>sale de ${esc(where)}</small></li></ul>
                <p>Puedes guardarla en tus fotos subidas para ponerla en ${other}, o borrarla. Si la borras, se borra cuando publiques los cambios.</p>`,
            action: 'Borrarla',
            cancel: 'Guardarla en mis fotos'
        });
        edit.images = (edit.images || []).filter(s => s !== src);
        if (edit.mainImage === src) edit.mainImage = edit.images[0] || '';
        if (uploaded) photoFates.set(src, erase ? 'borrar' : 'guardar');
        // Guardada en tus fotos: queda anotada en la lista de fotos subidas para usarla en otro producto.
        if (uploaded && !erase && !preview) changeUploads({ add: [src] }).catch(() => {});
        LaurenUI.toast(!uploaded ? `Salió de ${where}. La encuentras en «Agregar fotos de la web» para ponerla en ${other}.`
            : erase ? `Salió de ${where}. Se borra cuando publiques los cambios.` : `Salió de ${where}. Queda en tus fotos subidas, en «Agregar fotos de la web».`);
    }
    if (action === 'pick-photo') { openPicker(); return; }
    if (action === 'upload-photo') { if (uploading) warn('Espera a que terminen de subir las fotos.'); else editor.querySelector('#photoUpload').click(); return; }
    if (action === 'delete') {
        if (!(await askConfirm({
            title: `¿Eliminar <em>${esc(edit.name || 'este producto')}</em>?`,
            body: '<p>Sale del catálogo y deja de verse en la web cuando publiques los cambios. Si solo quieres quitarlo por un tiempo, mejor desmarca «Visible en la web».</p>',
            action: 'Eliminar',
            cancel: 'Conservarlo'
        }))) return;
        products = products.filter(p => p.id !== editingId);
        fresh.delete(editingId);
        LaurenUI.close(editor); render(); return;
    }
    const scroll = editor.querySelector('.dialog-scroll').scrollTop;
    renderEditor();
    editor.querySelector('.dialog-scroll').scrollTop = scroll;
});

editor.addEventListener('submit', async event => {
    event.preventDefault();
    // Si a la ficha le falta algo que no impide guardar (un precio vacío), se dice antes de guardar.
    const pending = M.warnings([edit]).map(w => w.text.replace(/^[^:]*: /, ''));
    if (edit.name?.trim() && pending.length && !(await askConfirm({
        title: `¿Guardar <em>${esc(edit.name.trim())}</em> así?`,
        body: `<ul class="admin-confirm-notes">${pending.slice(0, 6).map(text => `<li>${esc(text)}</li>`).join('')}</ul>${pending.length > 6 ? `<p>Y ${pending.length - 6} más.</p>` : ''}<p class="field-note">Se puede guardar y publicar así; lo verás también en «Avisos».</p>`,
        action: 'Guardar así',
        cancel: 'Seguir editando'
    }))) return;
    if (!edit.name?.trim()) { showError('editorError', 'Ponle un nombre al producto.'); editor.querySelector('#f-name')?.focus(); return; }
    showError('editorError', '');
    if (!editingId) {
        edit.id = M.unique(M.slug(edit.name), new Set(products.map(p => p.id)));
        fresh.add(edit.id);
    } else if (fresh.has(editingId)) {
        // Un producto aún sin publicar toma su identificador del nombre definitivo.
        fresh.delete(editingId);
        edit.id = M.unique(M.slug(edit.name), new Set(products.filter(p => p.id !== editingId).map(p => p.id)));
        fresh.add(edit.id);
    }
    edit.images = [...new Set([edit.mainImage, ...(edit.images || [])].filter(Boolean))];
    edit.mainImage = edit.images[0] || '';
    // Solo se une o se mueve lo que sigue en la ficha: si se quitó esa foto, el otro producto queda como estaba.
    const staying = new Set(M.photos(edit));
    merges.forEach((merge, id) => { if (!staying.has(merge.main)) merges.delete(id); });
    moves.forEach((_, src) => { if (!staying.has(src)) moves.delete(src); });
    const errors = M.validate([edit], products.filter(p => p.id !== editingId && !merges.has(p.id))).filter(message => !message.includes('identificador'));
    if (errors.length) { showError('editorError', errors[0]); $('editorError').scrollIntoView({ block: 'center', behavior: 'smooth' }); warn(`No se guardó: ${errors[0]}`, editingId); return; }
    const saved = M.clone(edit);
    if (editingId) products[products.findIndex(p => p.id === editingId)] = saved;
    else {
        const last = products.findLastIndex(p => p.category === saved.category);
        products.splice(last + 1, 0, saved);
    }
    photoFates.forEach((fate, src) => { if (fate === 'borrar') pendingDeletes.add(src); else pendingDeletes.delete(src); });
    const joined = products.filter(p => merges.has(p.id)).map(p => p.name);
    const moved = [...new Set([...moves.values()].flat())].filter(id => !merges.has(id));
    products = products.map(p => moved.includes(p.id) ? { ...p, images: (p.images || []).filter(src => !moves.has(src) || !moves.get(src).includes(p.id)) } : p);
    if (joined.length) {
        products = products.filter(p => !merges.has(p.id));
        merges.forEach((_, id) => fresh.delete(id));
    }
    LaurenUI.close(editor);
    render();
    // Un producto oculto (como todo producto nuevo) no sale en la web al publicar: el aviso lo recuerda.
    const next = saved.visible === false ? 'Está oculto: marca «Visible» y publica para que se vea en la web.' : 'Toca «Publicar cambios» para que se vea en la web.';
    LaurenUI.toast(joined.length ? `Listo: ${joined.map(n => `«${n}»`).join(', ').replace(/, ([^,]*)$/, ' y $1')} ${joined.length === 1 ? 'quedó' : 'quedaron'} dentro de «${saved.name}». ${next}` : `Guardado. ${next}`);
});

/* ---------- Subir fotos nuevas (worker/fotos: Cloudflare las guarda y las sirve al instante) ---------- */
let uploading = '';
let uploadedList = null;
const showUpload = text => { uploading = text; const status = editor.querySelector('#uploadStatus'); if (status && text) status.textContent = text; };
/**
 * Abre la foto del celular o del computador (con su orientación) y prepara dos copias del mismo formato:
 * la foto de 1440 px como máximo y su miniatura de 320 px para las filas de fotos. WebP, o JPG si el navegador no hace WebP.
 */
async function compress(file) {
    let source;
    try { source = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch {
        const url = URL.createObjectURL(file);
        try { source = new Image(); source.src = url; await source.decode(); } finally { setTimeout(() => URL.revokeObjectURL(url), 0); }
    }
    const width = source.width, height = source.height;
    if (!width || !height) throw new Error('foto');
    const draw = async (max, type) => {
        const scale = Math.min(1, max / Math.max(width, height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
        canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
        const encode = (as, quality) => new Promise(resolve => canvas.toBlob(resolve, as, quality));
        if (type) return encode(type, type === 'image/webp' ? 0.8 : 0.82);
        const webp = await encode('image/webp', 0.82);
        return webp?.type === 'image/webp' ? webp : encode('image/jpeg', 0.85);
    };
    const photo = await draw(1440);
    const thumb = photo && await draw(320, photo.type);
    source.close?.();
    if (!photo || photo.size > 3 * 1024 * 1024 || !thumb || thumb.type !== photo.type || thumb.size > 400 * 1024) throw new Error('foto');
    return { photo, thumb };
}
/** Petición al worker de fotos con el token de la sesión (lleva el doble factor). */
async function photosApi(path, options = {}) {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${PHOTOS_API}${path}`, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(data.error || 'error'), { code: data.error || 'error', status: response.status });
    return data;
}
const UPLOAD_ERRORS = {
    sesion: 'Tu sesión venció. Sal y entra de nuevo con tu clave y el código.',
    'doble-factor': 'Para subir fotos hay que entrar con el código de la app. Sal y entra de nuevo.',
    permiso: 'Tu usuario no tiene permiso para subir fotos.',
    'muy-grande': 'Una de las fotos es muy pesada. Prueba con otra.',
    formato: 'Uno de los archivos no es una foto JPG o WebP.',
    foto: 'No pudimos abrir una de las fotos. Prueba con una foto JPG o PNG.',
    configuracion: 'La subida de fotos aún no está lista. Inténtalo de nuevo en unos minutos.'
};
const uploadError = error => UPLOAD_ERRORS[error.code || error.message] || 'No pudimos subir las fotos. Revisa tu conexión e inténtalo de nuevo.';
const deleteError = error => ({
    sesion: UPLOAD_ERRORS.sesion,
    'doble-factor': 'Para borrar fotos hay que entrar con el código de la app. Sal y entra de nuevo.',
    permiso: 'Tu usuario no tiene permiso para borrar fotos.',
    configuracion: 'El borrado de fotos aún no está listo. Inténtalo de nuevo en unos minutos.'
}[error.code] || 'No pudimos borrar la foto. Revisa tu conexión e inténtalo de nuevo.');
/** Borra una foto subida del worker de fotos. Si ya no estaba, también cuenta como borrada. */
async function erasePhoto(src) {
    try { await photosApi(`/${src.split('/').pop()}`, { method: 'DELETE' }); }
    catch (error) { if (error.code !== 'no-existe') throw error; }
    await changeUploads({ remove: [src] });
    pendingDeletes.delete(src);
}
/** Después de publicar: borra las fotos que se sacaron con «Borrarla» y que ningún producto publicado usa. */
async function erasePending() {
    let erased = 0;
    for (const src of M.unusedUploads(pendingDeletes, products)) {
        try { await erasePhoto(src); erased++; } catch { /* queda pendiente para la próxima publicación */ }
    }
    return erased;
}
async function uploadPhotos(files) {
    if (!files.length) return;
    if (preview) { LaurenUI.toast('Vista previa: aquí no se suben fotos.'); return; }
    if (!photosReady) { warn(UPLOAD_ERRORS.configuracion); return; }
    const target = edit;
    const list = files.slice(0, 20);
    let done = 0, problem = '';
    const added = [];
    for (const [i, file] of list.entries()) {
        showUpload(list.length === 1 ? 'Subiendo la foto…' : `Subiendo la foto ${i + 1} de ${list.length}…`);
        try {
            const { photo, thumb } = await compress(file);
            const ext = photo.type === 'image/webp' ? 'webp' : 'jpg';
            const form = new FormData();
            form.append('foto', photo, `foto.${ext}`);
            form.append('miniatura', thumb, `miniatura.${ext}`);
            form.append('nombre', target.name || 'foto');
            const { foto } = await photosApi('/subir', { method: 'POST', body: form });
            if (!M.IMAGE.test(foto)) throw new Error('error');
            target.images = [...(target.images || []), foto];
            if (!target.mainImage) target.mainImage = foto;
            added.push(foto);
            done++;
        } catch (error) {
            problem ||= uploadError(error);
            if (['sesion', 'doble-factor', 'permiso', 'configuracion'].includes(error.code)) break;
        }
    }
    showUpload('');
    // Si no se pudo anotar, la foto igual queda en el producto; al sacarla y guardarla se anota.
    if (added.length) await changeUploads({ add: added }).catch(() => {});
    if (edit === target && editor.open) {
        const scroll = editor.querySelector('.dialog-scroll').scrollTop;
        renderEditor();
        editor.querySelector('.dialog-scroll').scrollTop = scroll;
    }
    if (problem) warn(done ? `Subimos ${done} de ${list.length} fotos. ${problem}` : problem, target.id);
    else LaurenUI.toast(`${done === 1 ? 'Foto lista' : `${done} fotos listas`}. Toca «Guardar» y luego «Publicar cambios».`);
    if (files.length > list.length) LaurenUI.toast(`Subimos las primeras ${list.length}. Elige las demás en otra tanda.`);
}
/** Fotos ya subidas (aunque ningún producto las use todavía), para ofrecerlas en «Agregar fotos de la web». */
async function uploadedPhotos() {
    if (preview || !photosReady) return [];
    try {
        const saved = await getDoc(uploadsRef);
        uploadedList ||= (saved.exists() ? saved.data().nombres || [] : []).map(name => `${M.UPLOADED}${name}`).filter(src => M.IMAGE.test(src));
    } catch { return []; }
    return uploadedList;
}
/** Anota o quita fotos de la lista de fotos subidas (una transacción: dos personas a la vez no se pisan). */
async function changeUploads({ add = [], remove = [] }) {
    const name = src => src.split('/').pop();
    await runTransaction(db, async transaction => {
        const saved = await transaction.get(uploadsRef);
        const names = new Set(saved.exists() ? saved.data().nombres || [] : []);
        add.forEach(src => names.add(name(src)));
        remove.forEach(src => names.delete(name(src)));
        transaction.set(uploadsRef, { nombres: [...names], updatedAt: serverTimestamp() });
    });
    if (uploadedList) uploadedList = [...new Set([...uploadedList.filter(src => !remove.includes(src)), ...add])];
}
// Foto de un bizcocho o relleno: una sola, al mismo worker de fotos.
let choicePhotoTarget = null;
async function uploadChoicePhoto(file) {
    const target = choicePhotoTarget && edit.options?.[choicePhotoTarget.o]?.choices[choicePhotoTarget.c];
    if (!file || !target) return;
    if (preview) { LaurenUI.toast('Vista previa: aquí no se suben fotos.'); return; }
    try {
        showUpload('Subiendo la foto…');
        LaurenUI.toast('Subiendo la foto…');
        const { photo, thumb } = await compress(file);
        const ext = photo.type === 'image/webp' ? 'webp' : 'jpg';
        const form = new FormData();
        form.append('foto', photo, `foto.${ext}`);
        form.append('miniatura', thumb, `miniatura.${ext}`);
        form.append('nombre', target.label || 'sabor');
        const { foto } = await photosApi('/subir', { method: 'POST', body: form });
        if (!M.IMAGE.test(foto)) throw new Error('error');
        target.image = foto;
        await changeUploads({ add: [foto] }).catch(() => {});
        LaurenUI.toast('Foto lista. Toca «Guardar» y luego «Publicar cambios».');
    } catch (error) { warn(uploadError(error), editingId); }
    finally { showUpload(''); }
    if (editor.open) { const scroll = editor.querySelector('.dialog-scroll').scrollTop; renderEditor(); editor.querySelector('.dialog-scroll').scrollTop = scroll; }
}
editor.addEventListener('change', event => {
    if (event.target.id === 'choicePhotoUpload') { uploadChoicePhoto(event.target.files[0]); event.target.value = ''; return; }
    if (event.target.id !== 'photoUpload') return;
    uploadPhotos([...event.target.files]);
    event.target.value = '';
});

/* ---------- Fotos de la web ---------- */
const picker = $('picker');
LaurenUI.dialogEvents(picker);
let manifest = null;
let takenMains = new Map();
// Un segundo toque mientras el selector carga no abre otro.
let pickerOpening = false;
async function openPicker() {
    if (pickerOpening || picker.open) return;
    pickerOpening = true;
    try { await showPicker(); } finally { pickerOpening = false; }
}
// Cómo estaba la ficha al abrir el selector: si se cierra sin confirmar lo que se une o se mueve, vuelve así.
let pickerStart = null;
async function showPicker() {
    if (!manifest) {
        try { manifest = (await (await fetch('/assets/propuestas-fotograficas/manifest.json')).json()).items.filter(item => M.IMAGE.test(item.proposal)); }
        catch { warn('No pudimos cargar las fotos de la web. Inténtalo de nuevo.'); return; }
    }
    // Todas las fotos de la web y las ya subidas, menos las de este producto. Primero las de su sección.
    const own = new Set(M.photos(edit));
    const others = products.filter(p => p.id !== editingId);
    const uploaded = [...new Set([...await uploadedPhotos(), ...others.flatMap(M.photos).filter(src => src.startsWith(M.UPLOADED))])]
        .map(src => ({ proposal: src, name: 'Foto subida', category: others.find(p => M.photos(p).includes(src))?.category }));
    takenMains = M.takenPhotos(others);
    pending = { merges: new Set(), moves: new Set() };
    // Una foto subida que no usa ningún producto (ni en el borrador ni en lo publicado) se puede borrar para siempre.
    const used = new Set([...products, ...Object.values(original), edit].flatMap(p => [...M.photos(p), ...M.choicePhotos(p)]));
    const flavorPhotos = new Set([...products, edit].flatMap(M.choicePhotos));
    const spare = src => src.startsWith(M.UPLOADED) && !used.has(src);
    // Una foto subida que se sacó con «Borrarla» espera a la publicación.
    const doomed = src => pendingDeletes.has(src) || photoFates.get(src) === 'borrar';
    // Las que ya están en otro producto van tapadas y al final de su sección: así se ven primero las libres.
    const taken = src => takenMains.has(src) || others.some(p => M.photos(p).includes(src));
    const items = [...uploaded, ...manifest].filter(item => !own.has(item.proposal) && !flavorPhotos.has(item.proposal)).map(item => ({ ...item, taken: taken(item.proposal) }))
        .sort((a, b) => (b.category === edit.category) - (a.category === edit.category) || a.taken - b.taken);
    picker.innerHTML = `<div class="admin-picker-body"><div class="dialog-scroll"><button class="icon-button dialog-close" type="button" data-close-dialog aria-label="Cerrar">${icon('close')}</button><p class="eyebrow">Fotos de la web</p><h2 id="pickerTitle">${edit.mainImage ? 'Agrega más <em>fotos.</em>' : 'Elige la <em>foto principal.</em>'}</h2><p class="admin-lead">${edit.mainImage ? `Toca todas las que quieras: se ven en pequeño bajo la foto de «${esc(edit.name || 'este producto')}». Primero las de ${esc(sectionName(edit.category))}.` : 'La primera que toques será la de la tarjeta. Luego puedes tocar más.'} Las libres se ven primero; las que ya están en otro producto se ven borrosas. Cada foto vive en un solo producto: si ya está en otro, se mueve aquí, y si es la de su tarjeta, ese producto se une a este. Al tocar «Listo» te mostramos el resumen antes de hacerlo.</p><div class="admin-photos">${items.map((item, i) => {
        const main = takenMains.get(item.proposal);
        const holder = main ? null : others.find(p => M.photos(p).includes(item.proposal));
        return `<div class="admin-photo"><button type="button" data-photo="${esc(item.proposal)}" aria-pressed="false"${item.taken ? ' data-taken' : ''}><img src="${esc(imagePath(item.proposal))}" alt="" width="120" height="150" loading="lazy"><span>${main ? `En la tarjeta de «${esc(main)}»` : holder ? `En «${esc(holder.name)}»` : doomed(item.proposal) ? 'Se borra al publicar' : spare(item.proposal) ? 'Foto subida, sin usar' : esc(item.name)}</span><span class="admin-photo-added">${icon('check')} ${main ? 'Se une a este' : holder ? 'Se mueve aquí' : 'Agregada'}</span></button>${spare(item.proposal) ? `<div class="admin-photo-actions"><button type="button" class="icon-button" popovertarget="spareMenu${i}" aria-label="Opciones de esta foto subida">${icon('more')}</button><div class="admin-photo-menu" id="spareMenu${i}" popover><button type="button" data-delete-upload="${esc(item.proposal)}">${icon('trash')} Borrar para siempre</button></div></div>` : ''}</div>`;
    }).join('')}</div></div><div class="admin-editor-actions"><div><button type="button" class="btn" data-close-dialog>Listo ${icon('check')}</button></div></div></div>`;
    pickerStart = { images: edit.images ? [...edit.images] : undefined, mainImage: edit.mainImage, merges: new Map(merges), moves: new Map(moves) };
    picker.addEventListener('close', () => {
        // Cerrado sin confirmar lo que se une o se mueve (cierre forzado del navegador o sesión vencida): esa tanda se deshace.
        if (pending.merges.size || pending.moves.size) {
            ({ merges, moves } = pickerStart);
            if (pickerStart.images) edit.images = pickerStart.images; else delete edit.images;
            edit.mainImage = pickerStart.mainImage;
            pending = { merges: new Set(), moves: new Set() };
        }
        renderEditor();
        if (!editor.open && !$('appView').hidden) LaurenUI.open(editor);
        editor.querySelector('.admin-gallery, .admin-photo-add')?.scrollIntoView({ block: 'center' });
    }, { once: true });
    LaurenUI.open(picker);
}
const pressPhotos = (list, pressed) => list.forEach(src => picker.querySelector(`[data-photo="${CSS.escape(src)}"]`)?.setAttribute('aria-pressed', String(pressed)));
// Elegir otra vez una foto que se iba a borrar la conserva.
const keep = src => { photoFates.delete(src); pendingDeletes.delete(src); };
// Lo que se une o se mueve mientras el selector está abierto: se confirma todo junto al tocar «Listo».
let pending = { merges: new Set(), moves: new Set() };
picker.addEventListener('click', event => {
    const button = event.target.closest('[data-photo]');
    if (!button) return;
    const src = button.dataset.photo;
    if (button.getAttribute('aria-pressed') === 'true') {
        // Soltar cualquier foto de un producto unido deshace toda la unión: sus fotos vuelven a él.
        const undo = [...merges].find(([, merge]) => merge.photos.includes(src));
        const drop = undo ? undo[1].photos : [src];
        if (undo) { merges.delete(undo[0]); pending.merges.delete(undo[0]); }
        drop.forEach(s => { moves.delete(s); pending.moves.delete(s); });
        edit.images = (edit.images || []).filter(s => !drop.includes(s));
        if (drop.includes(edit.mainImage)) edit.mainImage = edit.images[0] || '';
        pressPhotos(drop, false);
        return;
    }
    // La foto de la tarjeta de otro producto: ese producto se une a este (sus fotos pasan aquí y él se elimina al guardar).
    const owner = takenMains.has(src) ? products.find(p => p.id !== editingId && !merges.has(p.id) && p.mainImage === src) : null;
    if (owner) {
        if (products.some(p => p.basedOn === owner.id)) { warn(`«${owner.name}» no se puede unir: otras tortas toman sus precios.`); return; }
        const photos = M.photos(owner);
        merges.set(owner.id, { main: src, photos });
        pending.merges.add(owner.id);
        edit.images = [...new Set([...(edit.images || []), ...photos])];
        if (!edit.mainImage) edit.mainImage = src;
        photos.forEach(keep);
        pressPhotos(photos, true);
        return;
    }
    // Si es una foto adicional de otros productos, se mueve: al guardar sale de ellos.
    const holders = products.filter(p => p.id !== editingId && !merges.has(p.id) && M.photos(p).includes(src)).map(p => p.id);
    if (holders.length) { moves.set(src, holders); pending.moves.add(src); }
    keep(src);
    edit.images = [...(edit.images || []), src];
    if (!edit.mainImage) edit.mainImage = src;
    button.setAttribute('aria-pressed', 'true');
});

placeMenus(picker);
picker.addEventListener('scroll', () => picker.querySelector('.admin-photo-menu:popover-open')?.hidePopover(), true);
// «Borrar para siempre»: solo fotos subidas que ningún producto usa; se borran del worker de fotos con su miniatura.
picker.addEventListener('click', async event => {
    const remove = event.target.closest('[data-delete-upload]');
    if (!remove) return;
    const src = remove.dataset.deleteUpload;
    remove.closest('[popover]')?.hidePopover();
    if (M.photos(edit).includes(src)) {
        await askConfirm({ title: 'Esta foto <em>está elegida</em>', body: '<p>Primero tócala para soltarla de este producto; después podrás borrarla.</p>', action: 'Entendido', cancel: null });
        return;
    }
    const ok = await askConfirm({
        title: '¿Borrar <em>esta foto</em> para siempre?',
        body: `<ul class="admin-confirm-list"><li><img src="${esc(imagePath(src))}" alt="" width="40" height="50"><span>Foto subida</span><small>sin usar</small></li></ul>
            <p>Ningún producto la usa. Se borra de tus fotos subidas y no se puede recuperar.</p>`,
        action: 'Borrar',
        cancel: 'Conservarla'
    });
    if (!ok) return;
    try {
        await erasePhoto(src);
        photoFates.delete(src);
        remove.closest('.admin-photo').remove();
        LaurenUI.toast('Listo, borramos la foto. Ya no aparece en tus fotos.');
    } catch (error) { warn(deleteError(error)); }
});

// «Listo», cerrar, Esc o tocar fuera: si algo se une o se mueve, primero el resumen; «Volver» deja seguir eligiendo.
const listNames = names => names.map(n => `«${esc(n)}»`).join(', ').replace(/, ([^,]*)$/, ' y $1');
async function finishPicker() {
    const joined = [...pending.merges].map(id => products.find(p => p.id === id)).filter(Boolean);
    const moved = [...pending.moves].filter(src => moves.has(src));
    if (!joined.length && !moved.length) { picker.close(); return; }
    const from = [...new Set(moved.flatMap(src => moves.get(src)))].map(id => products.find(p => p.id === id)?.name).filter(Boolean);
    const [one, many, thisOne, these] = joined.every(p => p.category === 'tortas') ? ['torta', 'tortas', 'Esta', 'Estas'] : ['producto', 'productos', 'Este', 'Estos'];
    const here = `«${esc(edit.name || 'este producto')}»`;
    const count = n => `${n} ${n === 1 ? 'foto' : 'fotos'}`;
    const ok = await askConfirm({
        title: joined.length ? `¿Unir ${joined.length === 1 ? `<em>${esc(joined[0].name)}</em>` : `<em>${joined.length} ${many}</em>`} a ${here}?` : `¿Mover <em>${moved.length === 1 ? 'una foto' : `${moved.length} fotos`}</em> aquí?`,
        body: `${joined.length ? `<p>${joined.length === 1 ? `${thisOne} ${one} pasa` : `${these} ${many} pasan`} a ${here} con todas sus fotos y ${joined.length === 1 ? 'se elimina' : 'se eliminan'} del panel:</p>
            <ul class="admin-confirm-list">${joined.map(p => `<li><img src="${esc(imagePath(p.mainImage))}" alt="" width="40" height="50"><span>${esc(p.name)}</span><small>${count(M.photos(p).length)}</small></li>`).join('')}</ul>` : ''}
            ${moved.length ? `<p>${joined.length ? 'Además, ' : ''}${moved.length === 1 ? `${joined.length ? 'u' : 'U'}na foto sale` : `${moved.length} fotos salen`} de ${listNames(from)} y ${moved.length === 1 ? 'queda' : 'quedan'} solo aquí.</p>` : ''}
            <p class="field-note">En la web se verá cuando guardes la ficha y publiques los cambios.</p>`,
        action: joined.length ? 'Unir y seguir' : 'Mover y seguir',
        cancel: 'Volver'
    });
    if (!ok) return;
    pending = { merges: new Set(), moves: new Set() };
    picker.close();
}
picker.addEventListener('click', event => {
    const bounds = picker.getBoundingClientRect();
    const outside = event.target === picker && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
    if (!outside && !event.target.closest('[data-close-dialog]')) return;
    event.stopImmediatePropagation();
    finishPicker();
}, true);
picker.addEventListener('cancel', event => { event.preventDefault(); finishPicker(); });
// Esc lo decide la página, porque el navegador fuerza el cierre si se repite: un menú abierto y la confirmación se cierran
// solos; el selector pasa por su resumen y la ficha, por su confirmación.
document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || confirmDialog.open || document.querySelector('.admin-photo-menu:popover-open')) return;
    if (picker.open) { event.preventDefault(); finishPicker(); }
    else if (editor.open) { event.preventDefault(); leaveEditor(); }
}, true);



if (preview) {
    $('authView').hidden = true; $('appView').hidden = false;
    $('adminSession').hidden = false; $('adminUser').textContent = 'Vista previa';
    await loadCatalog();
}
