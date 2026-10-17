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
const fillIcons = root => root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
fillIcons(document);
// Vista previa para revisar el diseño en el computador de desarrollo: sin sesión y sin publicar.
const preview = ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).has('vista-previa');
// Worker de fotos (worker/fotos): guarda las subidas en Cloudflare y las sirve en /f/<nombre>. Su origen va en el CSP de cada página.
const PHOTOS_API = 'https://lauren-reposteria.crizczi22.workers.dev/fotos';
const photosReady = Boolean(PHOTOS_API);

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
    if (hasChanges() && !confirm('Tienes cambios sin publicar. ¿Quieres salir de todos modos?')) return;
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
        LaurenUI.toast('No pudimos leer lo publicado. Revisa tu conexión y recarga la página.');
        loadedJson = undefined;
        original = M.clone(snapshot);
    }
    products = Object.values(M.clone(original));
    fresh.clear();
    render();
}

// Un filtro por tipo de producto: todas las tortas y sus adicionales en Tortas; brownies y galletas, cada uno en el suyo.
const PAGES = { tortas: ['Tortas', ['tortas', 'extras']], alfajores: ['Alfajores', ['alfajores']], brownies: ['Brownies', ['brownies']], galletas: ['Galletas', ['galletas']], detalles: ['Detalles', ['detalles']] };
const FILTERS = [['all', 'Todos'], ...Object.entries(PAGES).map(([id, [label]]) => [id, label]), ['hidden', 'Ocultos'], ['changed', 'Con cambios']];
// La lista se agrupa como la web: todas las tortas juntas (primero las que fijan los precios), los adicionales y cada sección.
const groupOf = p => p.category === 'extras' ? 'Adicionales de torta' : sectionName(p.category);
const order = p => M.SECTIONS.findIndex(([id]) => id === p.category) * 3 + (p.basedOn ? 1 : 0);
const inFilter = (p, id, changed) => id === 'all' || (id === 'hidden' ? p.visible === false : id === 'changed' ? changed.includes(p.id) : PAGES[id][1].includes(p.category));
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
        const base = p.basedOn && products.find(b => b.id === p.basedOn);
        const tags = [p.visible === false && '<span class="admin-tag">Oculto</span>', fresh.has(p.id) && '<span class="admin-tag admin-tag-change">Nuevo</span>', !fresh.has(p.id) && changed.includes(p.id) && '<span class="admin-tag admin-tag-change">Con cambios</span>'].filter(Boolean).join('');
        const visibleId = `visible-${esc(p.id)}`;
        const heading = groupOf(p) !== group ? `<li class="admin-group"><p class="eyebrow">${esc(group = groupOf(p))} · ${shown.filter(x => groupOf(x) === group).length}</p></li>` : '';
        return `${heading}<li class="admin-row${p.visible === false ? ' is-hidden' : ''}">${p.category === 'extras' ? `<span class="admin-row-icon" aria-hidden="true">${icon(p.icon || 'gift')}</span>` : `<img src="${esc(imagePath(p.mainImage))}" alt="" width="56" height="70" loading="lazy">`}<div><h2><button type="button" class="admin-row-name" data-edit="${esc(p.id)}">${esc(p.name || 'Sin nombre')}</button>${tags}</h2><p>${esc(label)}${base ? ` · precios de ${esc(base.name)}` : ''}</p></div><div class="admin-row-actions"><label class="toggle-option" for="${visibleId}"><input id="${visibleId}" type="checkbox" data-visible="${esc(p.id)}" ${p.visible !== false ? 'checked' : ''}><span class="toggle-mark" aria-hidden="true">${icon('check')}</span><span>Visible</span></label><button type="button" class="text-link" data-edit="${esc(p.id)}" aria-label="Editar ${esc(p.name || 'producto')}">Editar ${icon('arrow')}</button></div></li>`;
    }).join('') || `<li class="admin-empty">${search ? 'No encontramos productos con ese nombre. Prueba con otra palabra.' : 'No hay productos aquí.'}</li>`;
    const total = M.changes(original, products).total;
    $('saveBar').hidden = total === 0;
    $('saveCount').textContent = total === 1 ? '1 cambio sin publicar.' : `${total} cambios sin publicar.`;
    $('saveHint').textContent = total === 1 ? 'Aún no se ve en la web.' : 'Aún no se ven en la web.';
}
$('list').addEventListener('change', event => {
    const input = event.target.closest('[data-visible]');
    if (!input) return;
    const index = products.findIndex(p => p.id === input.dataset.visible);
    products[index] = { ...products[index], visible: input.checked };
    render();
    LaurenUI.toast(input.checked ? 'Se verá en la web cuando publiques.' : 'Quedará oculto cuando publiques.');
});
$('list').addEventListener('click', event => {
    const button = event.target.closest('[data-edit]');
    if (button) openEditor(products.find(p => p.id === button.dataset.edit));
});
$('discard').addEventListener('click', () => {
    if (!confirm('¿Descartar todos los cambios sin publicar?')) return;
    products = Object.values(M.clone(original)); fresh.clear(); render();
});
window.addEventListener('beforeunload', event => { if (hasChanges()) event.preventDefault(); });

/* ---------- Publicar ---------- */
$('publish').addEventListener('click', async () => {
    if (preview) { LaurenUI.toast('Vista previa: aquí no se publica.'); return; }
    const errors = M.validate(products);
    if (errors.length) { alert(`Antes de publicar, revisa:\n\n• ${errors.slice(0, 8).join('\n• ')}`); return; }
    if (loadedJson === undefined) { LaurenUI.toast('No pudimos leer lo publicado. Recarga la página antes de publicar.'); return; }
    const button = $('publish'); button.disabled = true;
    try {
        const data = M.toCatalog(M.normalize(products));
        const json = JSON.stringify(data);
        await runTransaction(db, async transaction => {
            const current = await transaction.get(catalogRef);
            if ((current.exists() ? current.data().json : null) !== loadedJson) throw Object.assign(new Error('conflict'), { code: 'conflict' });
            const version = { json, updatedAt: serverTimestamp(), updatedBy: auth.currentUser.email };
            transaction.set(catalogRef, version);
            transaction.set(doc(collection(db, 'historial')), version);
        });
        original = data; loadedJson = json; products = Object.values(M.clone(data)); fresh.clear();
        if (filter === 'changed') filter = 'all';
        render();
        LaurenUI.toast('Listo. La web ya muestra tus cambios.', { label: 'Ver la web', run: () => window.open('/', '_blank', 'noopener') });
    } catch (error) {
        if (error.code === 'conflict') LaurenUI.toast('Alguien publicó cambios mientras editabas. Recarga la página para verlos antes de publicar.');
        else if (error.code === 'permission-denied') { LaurenUI.toast('Tu sesión venció. Entra de nuevo con tu clave y el código.'); await signOut(auth); }
        else LaurenUI.toast('No pudimos publicar. Revisa tu conexión e inténtalo de nuevo.');
    } finally { button.disabled = false; }
});

/* ---------- Editor ---------- */
const editor = $('editor');
LaurenUI.dialogEvents(editor);
let edit = null;
let editingId = null;
let pristine = '';
// Cerrar la ficha con cambios sin guardar pide confirmación (botón cerrar, Cancelar, fondo o Esc).
const leaveEditor = () => JSON.stringify(edit) === pristine || confirm('Tienes cambios sin guardar en este producto. ¿Salir sin guardarlos?');
editor.addEventListener('click', event => {
    const bounds = editor.getBoundingClientRect();
    const outside = event.target === editor && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
    if ((outside || event.target.closest('[data-close-dialog]')) && !leaveEditor()) event.stopImmediatePropagation();
}, true);
editor.addEventListener('cancel', event => { if (!leaveEditor()) event.preventDefault(); });

$('newProduct').addEventListener('click', () => {
    const category = M.SECTIONS.some(([id]) => id === filter) ? filter : 'tortas';
    openEditor(M.template(category, products), true);
});

function openEditor(product, isNew = false) {
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
const moneyValue = value => (typeof value === 'number' ? M.formatMoney(value) : value ?? '');

// Precio que verá el cliente en la tarjeta, con lo que hay escrito ahora mismo.
function pricePreview() {
    try {
        const values = JSON.stringify(edit, (key, value) => typeof value === 'number' && Number.isNaN(value) ? 'NaN' : value);
        if (values.includes('"NaN"')) return 'Revisa los precios: escríbelos solo con números.';
        return `En la tarjeta se verá: <strong>${esc(window.Catalog.priceLabel(window.Catalog.resolve(M.clone(edit))).text)}</strong>`;
    } catch { return ''; }
}

function pricesHTML(p) {
    const preview = `<p class="field-note admin-preview" id="pricePreview" aria-live="polite">${pricePreview()}</p>`;
    if (p.basedOn) {
        const base = products.find(b => b.id === p.basedOn);
        const own = Array.isArray(p.options);
        return `<fieldset class="admin-fieldset"><legend>Precios</legend>${preview}
            <div class="personal-field"><label for="f-basedOn">Toma los precios de</label><select id="f-basedOn" data-path="basedOn" data-kind="text">${products.filter(b => b.category === 'tortas' && !b.basedOn).map(b => `<option value="${esc(b.id)}" ${b.id === p.basedOn ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div>
            ${own ? `<p class="field-note">Esta torta tiene precios propios.</p>${groupsHTML(p, true)}<p><button type="button" class="admin-add" data-action="inherit">${icon('arrow')} Volver a los precios de ${esc(base?.name || 'la otra torta')}</button></p>`
        : `<p class="field-note">Usa las porciones, sabores y precios de ${esc(base?.name || 'su torta base')}: si cambias los de esa torta, cambian aquí también.</p><p><button type="button" class="admin-add" data-action="own-prices">${icon('plus')} Ponerle precios propios</button></p>`}
        </fieldset>`;
    }
    const extras = p.category === 'extras';
    const pricedGroups = (p.options || []).some(M.priced);
    const basePrice = pricedGroups ? '' : `<div class="admin-grid">${field(extras ? 'Precio desde' : 'Precio', 'price', moneyValue(p.price), { type: 'money', placeholder: 'Cotiza por WhatsApp', note: 'Déjalo vacío para mostrar «Cotiza por WhatsApp».' })}${extras ? field('Precio hasta', 'priceMax', moneyValue(p.priceMax), { type: 'money', placeholder: 'Opcional' }) : field('Texto después del precio', 'priceSuffix', p.priceSuffix, { placeholder: 'Ej.: c/u, la caja', note: 'Opcional.' })}</div>`;
    return `<fieldset class="admin-fieldset"><legend>Precios</legend>${preview}${basePrice}${groupsHTML(p, true)}
        ${extras ? '' : `<p><button type="button" class="admin-add" data-action="add-option" data-priced="true">${icon('plus')} ${pricedGroups ? 'Agregar otro grupo de precios' : 'Poner un precio por tamaño o porciones'}</button></p>`}</fieldset>`;
}

// Sabores, colores y casillas: lo que el cliente elige sin cambiar el precio (o con un costo fijo).
function choicesHTML(p) {
    if (p.category === 'extras' || (p.basedOn && !Array.isArray(p.options))) return '';
    return `<fieldset class="admin-fieldset"><legend>Lo que elige el cliente</legend>
        <p class="field-note">Sabores, rellenos, colores… El cliente elige una opción de cada grupo.</p>
        ${groupsHTML(p, false)}
        <p><button type="button" class="admin-add" data-action="add-option">${icon('plus')} Agregar un grupo (por ejemplo, sabores)</button></p></fieldset>`;
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
        const head = pricedOnes ? '<div class="admin-choice admin-choice-head" aria-hidden="true"><span>Opción</span><span>Precio</span><span></span></div>' : '';
        const rows = (option.choices || []).map((choice, c) => `<div class="admin-choice${pricedOnes ? '' : ' no-price'}"><input aria-label="Opción ${c + 1} de ${esc(option.label)}" data-path="${path}.choices.${c}.label" data-kind="text" value="${esc(choice.label)}" placeholder="Escribe la opción" ${option.multiplier ? 'readonly' : ''}>${pricedOnes ? `<div class="admin-money"><input aria-label="Precio de ${esc(choice.label || `la opción ${c + 1}`)}" data-path="${path}.choices.${c}.price" data-kind="money" inputmode="numeric" value="${esc(moneyValue(choice.price))}" placeholder="Cotiza"></div>` : ''}${option.multiplier ? '<span></span>' : `<button type="button" class="icon-button" data-action="remove-choice" data-option="${o}" data-choice="${c}" aria-label="Quitar ${esc(choice.label || 'esta opción')}">${icon('close')}</button>`}</div>`).join('');
        return `<div class="admin-option">${field(pricedOnes ? 'Título del grupo (lo ve el cliente)' : 'Título del grupo (lo ve el cliente)', `${path}.label`, option.label, { placeholder: pricedOnes ? 'Ej.: Número de porciones' : 'Ej.: Sabor del bizcocho' })}${depends}${multiplier}${head}${rows}
            <div class="admin-option-actions">${option.multiplier ? '<span></span>' : `<button type="button" class="admin-add" data-action="add-choice" data-option="${o}">${icon('plus')} Agregar opción</button>`}<button type="button" class="admin-danger" data-action="remove-option" data-option="${o}">Quitar este grupo</button></div>
            ${pricedOnes ? '<p class="field-note">Un precio vacío muestra «Cotiza por WhatsApp» para esa opción.</p>' : ''}</div>`;
    }).join('');
}

// La principal va en la tarjeta; las demás (misma referencia, otros ángulos) se ven en pequeño bajo la foto de la ficha.
// Bajo cada foto, los tres puntos abren sus opciones: hacerla principal y quitarla.
const photoMenu = (src, i) => `<div class="admin-photo-actions"><button type="button" class="icon-button" popovertarget="photoMenu${i}" aria-label="Opciones de la ${i ? `foto ${i + 1}` : 'foto principal'}">${icon('more')}</button><div class="admin-photo-menu" id="photoMenu${i}" popover>${i ? `<button type="button" data-action="main-photo" data-src="${esc(src)}">${icon('check')} Hacer principal</button>` : `<button type="button" disabled>${icon('check')} Es la principal</button>`}<button type="button" data-action="remove-photo" data-src="${esc(src)}">${icon('trash')} Quitar</button></div></div>`;
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
    let price = '';
    try { const label = window.Catalog.priceLabel(r); price = label.from ? `<span class="price-from">Desde</span> ${esc(label.amount)}` : esc(label.text); } catch { price = 'Revisa los precios'; }
    if (p.category === 'extras') return `<article class="extra"><span class="extra-symbol">${icon(p.icon || 'gift')}</span><h3>${esc(p.name || 'Sin nombre')}</h3><p>${price}</p><span class="text-link">Consultar ${icon('diagonal')}</span></article>`;
    const quoted = window.Catalog.quoteOnly(r);
    const src = M.photos(p)[0];
    return `<article class="product-card"><div class="product-image">${src ? `<img src="${esc(imagePath(src))}" alt="" width="600" height="680">` : '<span class="admin-card-empty">Sin foto</span>'}<span class="product-open">${icon('diagonal')}</span></div><div class="product-meta"><h3 class="product-name">${esc(p.name || 'Sin nombre')}</h3><p class="product-price">${quoted ? 'A tu medida' : price}</p></div><p class="product-description">${esc(r.summary || r.description || '')}</p><span class="text-link">${quoted ? 'Consultar diseño' : 'Elegir detalles'} ${icon('arrow')}</span></article>`;
}
const previewTitle = p => `Así se verá en la web${p.visible === false ? ' <span class="admin-tag">Oculto</span>' : ''}`;

function renderEditor() {
    const p = edit;
    const base = p.basedOn ? products.find(b => b.id === p.basedOn) : null;
    const inherited = key => base && !(key in p) ? `Si lo dejas vacío, usa el de ${base.name}.` : '';
    const groups = M.GROUPS[p.category];
    // La portada tiene cuatro lugares: si ya están ocupados por otros, la casilla no se puede marcar.
    const max = window.Catalog.FEATURED;
    const others = products.filter(x => x.id !== editingId && x.featured === true);
    const full = others.length >= max && p.featured !== true;
    const names = list => list.map(x => x.name).join(', ').replace(/, ([^,]*)$/, ' y $1');
    // Los cuadros de texto muestran todo su contenido sin desplazarse por dentro.
    const rows = (lines, min = 3) => `rows="${Math.max(min, lines.length + 1)}"`;
    const personal = p.personalization?.enabled ? (p.personalization.fields || [p.personalization]).map(f => `«${f.label}» (hasta ${f.maxLength || 100} caracteres)`).join(', ') : '';
    const section = `<div class="personal-field"><label for="f-category">Sección de la web</label><select id="f-category" data-path="category" data-kind="text">${M.SECTIONS.map(([id, label]) => `<option value="${id}" ${p.category === id ? 'selected' : ''}>${esc(label)}</option>`).join('')}</select></div>`;
    const where = `<fieldset class="admin-fieldset admin-side-where"><legend>Dónde aparece</legend><div class="admin-grid">${section}${groups ? `<div class="personal-field"><label for="f-group">Filtro en la página</label><select id="f-group" data-path="group" data-kind="text"><option value="">Ninguno</option>${groups.map(([id, label]) => `<option value="${id}" ${p.group === id ? 'selected' : ''}>${esc(label)}</option>`).join('')}</select></div>` : ''}</div>${editingId ? '<p class="field-note">Cambia la sección solo si el producto pasa a otra página de la web.</p>' : ''}</fieldset>`;
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
                ${field('Frase corta de la tarjeta', 'summary', p.summary, { note: 'Una línea que invite. Si la dejas vacía, se usa la descripción.', attrs: 'maxlength="90"' })}
                ${field('Descripción', 'description', p.description, { area: true, placeholder: base?.description || '', note: inherited('description'), attrs: rows(Array(Math.ceil(String(p.description || base?.description || '').length / 70)).fill(0)) })}
                ${field('Qué incluye (una cosa por línea)', 'includes', (p.includes || []).join('\n'), { type: 'lines', area: true, placeholder: (base?.includes || []).join('\n'), note: inherited('includes'), attrs: rows(p.includes || base?.includes || []) })}
                ${field('Notas en la ficha (una por línea)', 'notes', (p.notes || []).join('\n'), { type: 'lines', area: true, placeholder: (base?.notes || []).join('\n'), note: inherited('notes') || 'Aclaraciones que se ven bajo las opciones.', attrs: rows(Array(Math.ceil((p.notes || base?.notes || []).join(' ').length / 70)).fill(0), 2) })}
            </fieldset>
            ${choicesHTML(p)}
            ${!M.QUANTITY.includes(p.category) || p.basedOn ? '' : `<fieldset class="admin-fieldset"><legend>Cantidad</legend><div class="admin-grid">
                ${field('Cantidad mínima por pedido', 'minimum', p.minimum ?? 1, { type: 'number', attrs: 'min="1" max="99"' })}
                ${field('Cómo se llama la cantidad', 'quantityLabel', p.quantityLabel, { placeholder: 'Cantidad de esta presentación', note: 'Ej.: Número de cajas.' })}
            </div>${personal ? `<p class="field-note">El cliente también escribe: ${esc(personal)}.</p>` : ''}</fieldset>`}
            ${editingId ? '<div class="admin-delete"><button type="button" class="admin-danger" data-action="delete">Eliminar producto</button><p class="field-note">Si solo quieres quitarlo por un tiempo, mejor desmarca «Visible en la web».</p></div>' : ''}
            <p class="field-error" id="editorError" role="alert" hidden></p>
            </div>
            <aside class="admin-editor-side" aria-label="Vista previa y estado">
                <div class="admin-side-track"><div class="admin-side-sticky">
                <fieldset class="admin-fieldset admin-side-preview"><legend id="cardPreviewTitle">${previewTitle(p)}</legend><div class="admin-card-preview" id="cardPreview" aria-hidden="true">${cardPreview(p)}</div></fieldset>
                <fieldset class="admin-fieldset admin-side-state"><legend>En la web</legend>
                    <div class="admin-toggles">${check('Visible en la web', 'visible', p.visible !== false)}${check('Mostrar en la portada', 'featured', p.featured === true, full)}</div>
                    <p class="field-note admin-featured-note">${full ? `La portada ya tiene sus ${max} productos: ${esc(names(others))}. Desmarca uno de ellos para poner este.` : `En la portada caben ${max} productos. Ahora hay ${others.length + (p.featured === true ? 1 : 0)}.`}</p>
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
editor.addEventListener('input', event => {
    const input = event.target.closest('[data-path]');
    if (!input) return;
    const value = readInput(input);
    const path = input.dataset.path;
    // Un texto heredado que se deja vacío vuelve a tomar el de la torta base.
    if (edit.basedOn && ['description', 'includes', 'notes'].includes(path) && (value === '' || (Array.isArray(value) && !value.join('').trim()))) delete edit[path];
    else setPath(edit, path, value);
    if (path === 'name') editor.querySelector('#editorTitle').textContent = value || 'Sin nombre';
    const preview = editor.querySelector('#pricePreview');
    if (preview) preview.innerHTML = pricePreview();
    editor.querySelector('#cardPreview').innerHTML = cardPreview(edit);
    editor.querySelector('#cardPreviewTitle').innerHTML = previewTitle(edit);
    if (path === 'category' || path === 'basedOn' || path === 'featured') {
        if (path === 'category') delete edit.group;
        const scroll = editor.querySelector('.dialog-scroll').scrollTop;
        renderEditor();
        editor.querySelector('.dialog-scroll').scrollTop = scroll;
    }
});

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
// alineado a la derecha, o encima si no cabe debajo.
editor.addEventListener('beforetoggle', event => {
    const menu = event.target;
    if (event.newState !== 'open' || !menu.classList?.contains('admin-photo-menu')) return;
    const anchor = editor.querySelector(`[popovertarget="${menu.id}"]`).getBoundingClientRect();
    menu.style.top = `${anchor.bottom + 4}px`;
    menu.style.left = 'auto';
    menu.style.right = `${Math.max(8, document.documentElement.clientWidth - anchor.right)}px`;
}, true);
editor.addEventListener('toggle', event => {
    const menu = event.target;
    if (event.newState !== 'open' || !menu.classList?.contains('admin-photo-menu')) return;
    const anchor = editor.querySelector(`[popovertarget="${menu.id}"]`).getBoundingClientRect();
    const box = menu.getBoundingClientRect();
    if (box.left < 8) { menu.style.right = 'auto'; menu.style.left = '8px'; }
    if (box.bottom > innerHeight - 8) menu.style.top = `${Math.max(8, anchor.top - 4 - box.height)}px`;
}, true);
addEventListener('resize', () => editor.querySelector('.admin-photo-menu:popover-open')?.hidePopover());
function stripEnds(track) {
    const strip = track.closest('.photo-strip');
    strip.querySelector('[data-strip-step="-1"]').disabled = track.scrollLeft <= 2;
    strip.querySelector('[data-strip-step="1"]').disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
}

editor.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const option = edit.options?.[Number(button.dataset.option)];
    if (action === 'add-choice') option.choices.push(M.priced(option) ? { value: '', label: '', price: null } : { value: '', label: '' });
    if (action === 'remove-choice') option.choices.splice(Number(button.dataset.choice), 1);
    if (action === 'remove-option' && confirm(`¿Quitar el grupo «${option.label}»?`)) edit.options.splice(Number(button.dataset.option), 1);
    if (action === 'add-option') {
        edit.options = edit.options || [];
        edit.options.push({ id: '', label: button.dataset.priced ? 'Tamaño' : 'Sabor', type: 'radio', required: true, choices: [button.dataset.priced ? { value: '', label: '', price: null } : { value: '', label: '' }] });
    }
    if (action === 'own-prices') edit.options = M.clone(products.find(b => b.id === edit.basedOn)?.options || []);
    if (action === 'inherit') delete edit.options;
    if (action === 'main-photo') { const src = button.dataset.src; edit.images = [src, ...(edit.images || []).filter(s => s !== src)]; edit.mainImage = src; }
    if (action === 'remove-photo') { const src = button.dataset.src; edit.images = (edit.images || []).filter(s => s !== src); if (edit.mainImage === src) edit.mainImage = edit.images[0] || ''; }
    if (action === 'pick-photo') { openPicker(); return; }
    if (action === 'upload-photo') { if (uploading) LaurenUI.toast('Espera a que terminen de subir las fotos.'); else editor.querySelector('#photoUpload').click(); return; }
    if (action === 'delete') {
        if (!confirm(`¿Eliminar «${edit.name}» del catálogo? Si solo quieres quitarlo por un tiempo, mejor desmarca «Visible».`)) return;
        products = products.filter(p => p.id !== editingId);
        LaurenUI.close(editor); render(); return;
    }
    const scroll = editor.querySelector('.dialog-scroll').scrollTop;
    renderEditor();
    editor.querySelector('.dialog-scroll').scrollTop = scroll;
});

editor.addEventListener('submit', event => {
    event.preventDefault();
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
    const errors = M.validate([edit], products.filter(p => p.id !== editingId)).filter(message => !message.includes('identificador'));
    if (errors.length) { showError('editorError', errors[0]); $('editorError').scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    const saved = M.clone(edit);
    if (editingId) products[products.findIndex(p => p.id === editingId)] = saved;
    else {
        const last = products.findLastIndex(p => p.category === saved.category);
        products.splice(last + 1, 0, saved);
    }
    LaurenUI.close(editor);
    render();
    LaurenUI.toast('Guardado. Toca «Publicar cambios» para que se vea en la web.');
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
async function uploadPhotos(files) {
    if (!files.length) return;
    if (preview) { LaurenUI.toast('Vista previa: aquí no se suben fotos.'); return; }
    if (!photosReady) { LaurenUI.toast(UPLOAD_ERRORS.configuracion); return; }
    const target = edit;
    const list = files.slice(0, 20);
    let done = 0, problem = '';
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
            if (uploadedList) uploadedList.push(foto);
            done++;
        } catch (error) {
            problem ||= uploadError(error);
            if (['sesion', 'doble-factor', 'permiso', 'configuracion'].includes(error.code)) break;
        }
    }
    showUpload('');
    if (edit === target && editor.open) {
        const scroll = editor.querySelector('.dialog-scroll').scrollTop;
        renderEditor();
        editor.querySelector('.dialog-scroll').scrollTop = scroll;
    }
    if (problem) LaurenUI.toast(done ? `Subimos ${done} de ${list.length}. ${problem}` : problem);
    else LaurenUI.toast(`${done === 1 ? 'Foto lista' : `${done} fotos listas`}. Toca «Guardar» y luego «Publicar cambios».`);
    if (files.length > list.length) LaurenUI.toast(`Subimos las primeras ${list.length}. Elige las demás en otra tanda.`);
}
/** Fotos ya subidas (aunque ningún producto las use todavía), para ofrecerlas en «Agregar fotos de la web». */
async function uploadedPhotos() {
    if (preview || !photosReady) return [];
    try { uploadedList ||= (await photosApi('')).fotos.filter(src => M.IMAGE.test(src)); }
    catch { return []; }
    return uploadedList;
}
editor.addEventListener('change', event => {
    if (event.target.id !== 'photoUpload') return;
    uploadPhotos([...event.target.files]);
    event.target.value = '';
});

/* ---------- Fotos de la web ---------- */
const picker = $('picker');
LaurenUI.dialogEvents(picker);
let manifest = null;
let takenMains = new Map();
async function openPicker() {
    if (!manifest) {
        try { manifest = (await (await fetch('/assets/propuestas-fotograficas/manifest.json')).json()).items.filter(item => M.IMAGE.test(item.proposal)); }
        catch { LaurenUI.toast('No pudimos cargar las fotos. Inténtalo de nuevo.'); return; }
    }
    // Todas las fotos de la web y las ya subidas, menos las de este producto. Primero las de su sección.
    const own = new Set(M.photos(edit));
    const others = products.filter(p => p.id !== editingId);
    const uploaded = [...new Set([...await uploadedPhotos(), ...others.flatMap(M.photos).filter(src => src.startsWith(M.UPLOADED))])]
        .map(src => ({ proposal: src, name: 'Foto subida', category: others.find(p => M.photos(p).includes(src))?.category }));
    takenMains = M.takenPhotos(others);
    const items = [...uploaded, ...manifest].filter(item => !own.has(item.proposal)).sort((a, b) => (b.category === edit.category) - (a.category === edit.category));
    picker.innerHTML = `<div class="admin-picker-body"><div class="dialog-scroll"><button class="icon-button dialog-close" type="button" data-close-dialog aria-label="Cerrar">${icon('close')}</button><p class="eyebrow">Fotos de la web</p><h2 id="pickerTitle">${edit.mainImage ? 'Agrega más <em>fotos.</em>' : 'Elige la <em>foto principal.</em>'}</h2><p class="admin-lead">${edit.mainImage ? `Toca todas las que quieras: se ven en pequeño bajo la foto de «${esc(edit.name || 'este producto')}». Primero las de ${esc(sectionName(edit.category))}.` : 'La primera que toques será la de la tarjeta. Luego puedes tocar más.'}</p><div class="admin-photos">${items.map(item => {
        const main = takenMains.get(item.proposal);
        return `<div class="admin-photo"><button type="button" data-photo="${esc(item.proposal)}" aria-pressed="false"><img src="${esc(imagePath(item.proposal))}" alt="" width="120" height="150" loading="lazy"><span>${main ? `En la tarjeta de «${esc(main)}»` : esc(item.name)}</span><span class="admin-photo-added">${icon('check')} Agregada</span></button></div>`;
    }).join('')}</div></div><div class="admin-editor-actions"><div><button type="button" class="btn" data-close-dialog>Listo ${icon('check')}</button></div></div></div>`;
    picker.addEventListener('close', () => {
        renderEditor();
        if (!editor.open && !$('appView').hidden) LaurenUI.open(editor);
        editor.querySelector('.admin-photos')?.scrollIntoView({ block: 'center' });
    }, { once: true });
    LaurenUI.open(picker);
}
picker.addEventListener('click', event => {
    const button = event.target.closest('[data-photo]');
    if (!button) return;
    const src = button.dataset.photo;
    if (button.getAttribute('aria-pressed') === 'true') {
        edit.images = (edit.images || []).filter(s => s !== src);
        if (edit.mainImage === src) edit.mainImage = edit.images[0] || '';
        button.setAttribute('aria-pressed', 'false');
        return;
    }
    // La principal es única por tarjeta: la de otro producto solo entra como foto adicional.
    if (!edit.mainImage && takenMains.has(src)) { LaurenUI.toast(`Esa ya es la foto principal de «${takenMains.get(src)}». Para la principal elige otra o sube una nueva; después puedes sumar esta.`); return; }
    edit.images = [...(edit.images || []), src];
    if (!edit.mainImage) edit.mainImage = src;
    button.setAttribute('aria-pressed', 'true');
});

if (preview) {
    $('authView').hidden = true; $('appView').hidden = false;
    $('adminSession').hidden = false; $('adminUser').textContent = 'Vista previa';
    await loadCatalog();
}
