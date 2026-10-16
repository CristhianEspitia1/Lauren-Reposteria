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
    await signOut(auth);
});

onAuthStateChanged(auth, async user => {
    if (preview) return;
    if (!user) { showAuth(resolver ? 'code' : 'login', resolver ? 'Ahora, el código de tu celular.' : 'Entra con tu correo y tu clave.'); return; }
    if (!multiFactor(user).enrolledFactors.some(f => f.factorId === TotpMultiFactorGenerator.FACTOR_ID)) { await startEnrollment(user); return; }
    const token = await user.getIdTokenResult();
    if (token.signInSecondFactor !== TotpMultiFactorGenerator.FACTOR_ID) { await signOut(auth); return; }
    $('adminUser').textContent = user.email;
    $('adminSession').hidden = false;
    $('authView').hidden = true;
    $('appView').hidden = false;
    await loadCatalog();
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
    renderFilters(); render();
}

const FILTERS = [['all', 'Todos'], ...M.SECTIONS, ['designs', 'Diseños de la galería'], ['hidden', 'Ocultos'], ['changed', 'Con cambios']];
function renderFilters() {
    $('filters').innerHTML = FILTERS.map(([id, label]) => `<button type="button" data-filter="${id}" aria-pressed="${filter === id}">${esc(label)}</button>`).join('');
}
$('filters').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    filter = button.dataset.filter; renderFilters(); render();
});
$('search').addEventListener('input', render);
const normalizeText = value => String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function render() {
    useDraft();
    const { changed } = M.changes(original, products);
    const search = normalizeText($('search').value.trim());
    const shown = products.filter(p => {
        if (filter === 'designs' && !p.design) return false;
        if (filter === 'hidden' && p.visible !== false) return false;
        if (filter === 'changed' && !changed.includes(p.id)) return false;
        if (M.SECTIONS.some(([id]) => id === filter) && (p.category !== filter || p.design)) return false;
        return !search || normalizeText(`${p.name} ${sectionName(p.category)}`).includes(search);
    });
    $('count').textContent = `${shown.length} ${shown.length === 1 ? 'producto' : 'productos'}`;
    $('list').innerHTML = shown.map(p => {
        const label = window.Catalog.priceLabel(window.Catalog.resolve(window.catalogData[p.id])).text;
        const tags = [p.visible === false && '<span class="admin-tag">Oculto</span>', fresh.has(p.id) && '<span class="admin-tag admin-tag-change">Nuevo</span>', !fresh.has(p.id) && changed.includes(p.id) && '<span class="admin-tag admin-tag-change">Con cambios</span>'].filter(Boolean).join('');
        const visibleId = `visible-${esc(p.id)}`;
        return `<li class="admin-row${p.visible === false ? ' is-hidden' : ''}"><img src="${esc(imagePath(p.mainImage))}" alt="" width="56" height="70" loading="lazy"><div><h2>${esc(p.name || 'Sin nombre')}${tags}</h2><p>${esc(sectionName(p.category))}${p.design ? ' · diseño de la galería' : ''} · ${esc(label)}</p></div><div class="admin-row-actions"><label class="toggle-option" for="${visibleId}"><input id="${visibleId}" type="checkbox" data-visible="${esc(p.id)}" ${p.visible !== false ? 'checked' : ''}><span class="toggle-mark" aria-hidden="true">${icon('check')}</span><span>Visible</span></label><button type="button" class="text-link" data-edit="${esc(p.id)}">Editar ${icon('arrow')}</button></div></li>`;
    }).join('') || '<li class="admin-count">No encontramos productos con esa búsqueda.</li>';
    const total = M.changes(original, products).total;
    $('saveBar').hidden = total === 0;
    $('saveCount').textContent = total === 1 ? '1 cambio.' : `${total} cambios.`;
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

$('newProduct').addEventListener('click', () => {
    const category = M.SECTIONS.some(([id]) => id === filter) ? filter : 'tortas';
    openEditor(M.template(category, products), true);
});

function openEditor(product, isNew = false) {
    edit = M.clone(product);
    editingId = isNew ? null : product.id;
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
const check = (label, path, checked) => `<label class="toggle-option"><input type="checkbox" data-path="${path}" data-kind="bool" ${checked ? 'checked' : ''}><span class="toggle-mark" aria-hidden="true">${icon('check')}</span><span>${esc(label)}</span></label>`;
const moneyValue = value => (typeof value === 'number' ? M.formatMoney(value) : value ?? '');

function optionsHTML(p) {
    if (p.basedOn) {
        const base = products.find(b => b.id === p.basedOn);
        const own = Array.isArray(p.options);
        return `<fieldset class="admin-fieldset"><legend>Porciones, sabores y precios</legend>
            <div class="personal-field"><label for="f-basedOn">Torta base</label><select id="f-basedOn" data-path="basedOn" data-kind="text">${products.filter(b => b.category === 'tortas' && !b.basedOn).map(b => `<option value="${esc(b.id)}" ${b.id === p.basedOn ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></div>
            ${own ? `<p class="field-note">Este diseño tiene precios propios.</p>${optionList(p)}<button type="button" class="admin-add" data-action="inherit">Volver a usar los precios de ${esc(base?.name || 'la torta base')}</button>`
        : `<p class="field-note">Usa las porciones, sabores y precios de ${esc(base?.name || 'su torta base')}. Si cambias los precios de esa torta, cambian aquí también.</p><button type="button" class="admin-add" data-action="own-prices">${icon('plus')} Ponerle precios propios</button>`}
        </fieldset>`;
    }
    const pricedOptions = (p.options || []).some(M.priced);
    const basePrice = pricedOptions ? '' : `<div class="admin-grid">${field(p.category === 'extras' ? 'Precio desde' : 'Precio', 'price', moneyValue(p.price), { type: 'money', placeholder: 'Cotiza por WhatsApp', note: 'Déjalo vacío para mostrar «Cotiza por WhatsApp».' })}${p.category === 'extras' ? field('Precio hasta', 'priceMax', moneyValue(p.priceMax), { type: 'money', placeholder: 'Opcional' }) : field('Complemento del precio', 'priceSuffix', p.priceSuffix, { placeholder: 'Ej.: c/u, la caja' })}</div>`;
    return `<fieldset class="admin-fieldset"><legend>Precio y opciones</legend>${basePrice}${optionList(p)}
        ${p.category === 'extras' ? '' : `<p><button type="button" class="admin-add" data-action="add-option" data-priced="true">${icon('plus')} Agregar opciones con precio (porciones, tamaños)</button></p><p><button type="button" class="admin-add" data-action="add-option">${icon('plus')} Agregar opciones sin precio (sabores, colores)</button></p>`}</fieldset>`;
}

function optionList(p) {
    // Primero los grupos con precio (porciones, tamaños): es lo que más se edita.
    const order = (p.options || []).map((option, o) => [option, o]).sort(([a], [b]) => M.priced(b) - M.priced(a));
    return order.map(([option, o]) => {
        const path = `options.${o}`;
        if (option.type === 'toggle') return `<div class="admin-option"><div class="admin-option-head">${field('Casilla adicional', `${path}.label`, option.label)}</div>${field('Costo adicional', `${path}.priceModifier`, moneyValue(option.priceModifier), { type: 'money', placeholder: 'Sin costo' })}</div>`;
        const isPriced = M.priced(option);
        const depends = option.dependsOn ? (() => {
            const parent = p.options.find(x => x.id === option.dependsOn);
            const values = [].concat(option.showWhen).map(v => parent?.choices?.find(c => c.value === v)?.label || v).join(' o ');
            return `<p class="field-note">Solo aparece cuando se elige «${esc(values)}» en «${esc(parent?.label || '')}».</p>`;
        })() : '';
        const multiplier = option.multiplier ? '<p class="field-note">Multiplica el precio por la cantidad elegida.</p>' : '';
        const rows = (option.choices || []).map((choice, c) => `<div class="admin-choice${isPriced ? '' : ' no-price'}"><input aria-label="Opción" data-path="${path}.choices.${c}.label" data-kind="text" value="${esc(choice.label)}" ${option.multiplier ? 'readonly' : ''}>${isPriced ? `<div class="admin-money"><input aria-label="Precio de ${esc(choice.label)}" data-path="${path}.choices.${c}.price" data-kind="money" inputmode="numeric" value="${esc(moneyValue(choice.price))}" placeholder="Cotiza"></div>` : ''}${option.multiplier ? '<span></span>' : `<button type="button" class="icon-button" data-action="remove-choice" data-option="${o}" data-choice="${c}" aria-label="Quitar ${esc(choice.label)}">${icon('close')}</button>`}</div>`).join('');
        return `<div class="admin-option"><div class="admin-option-head">${field(isPriced ? 'Opciones con precio' : 'Opciones', `${path}.label`, option.label)}<button type="button" class="admin-danger" data-action="remove-option" data-option="${o}">Quitar grupo</button></div>${depends}${multiplier}${rows}${option.multiplier ? '' : `<button type="button" class="admin-add" data-action="add-choice" data-option="${o}">${icon('plus')} Agregar opción</button>`}${isPriced ? '<p class="field-note">Un precio vacío muestra «Cotiza por WhatsApp» para esa opción.</p>' : ''}</div>`;
    }).join('');
}

function photosHTML(p) {
    const images = [...new Set([p.mainImage, ...(p.images || [])].filter(Boolean))];
    return `<fieldset class="admin-fieldset"><legend>Fotos</legend>
        <div class="admin-photos">${images.map((src, i) => `<div class="admin-photo"><img src="${esc(imagePath(src))}" alt="" width="112" height="140" loading="lazy"><div class="admin-photo-actions">${i === 0 ? '<span class="admin-photo-main">Principal</span>' : `<button type="button" data-action="main-photo" data-src="${esc(src)}">Hacer principal</button>`}<button type="button" data-action="remove-photo" data-src="${esc(src)}">Quitar</button></div></div>`).join('')}</div>
        <button type="button" class="admin-add" data-action="pick-photo">${icon('plus')} Agregar una foto de la web</button>
        <p class="field-note">Muy pronto podrás subir fotos nuevas desde aquí.</p></fieldset>`;
}

function renderEditor() {
    const p = edit;
    const base = p.basedOn ? products.find(b => b.id === p.basedOn) : null;
    const inherited = key => base && !(key in p) ? `Si lo dejas vacío, usa el de ${base.name}.` : '';
    const groups = M.GROUPS[p.category];
    const personal = p.personalization?.enabled ? (p.personalization.fields || [p.personalization]).map(f => `«${f.label}» (hasta ${f.maxLength || 100} caracteres)`).join(', ') : '';
    editor.innerHTML = `<form novalidate>
        <div class="dialog-scroll">
            <button class="icon-button dialog-close" type="button" data-close-dialog aria-label="Cerrar sin guardar">${icon('close')}</button>
            <p class="eyebrow">${editingId ? 'Editar producto' : 'Nuevo producto'}</p>
            <h2 id="editorTitle">${esc(p.name || 'Sin nombre')}</h2>
            <fieldset class="admin-fieldset"><legend>Lo básico</legend>
                ${field('Nombre', 'name', p.name, { attrs: 'required maxlength="80"' })}
                <div class="admin-grid">
                    <div class="personal-field"><label for="f-category">Sección</label><select id="f-category" data-path="category" data-kind="text">${M.SECTIONS.map(([id, label]) => `<option value="${id}" ${p.category === id ? 'selected' : ''}>${esc(label)}</option>`).join('')}</select></div>
                    ${groups ? `<div class="personal-field"><label for="f-group">Filtro en la página</label><select id="f-group" data-path="group" data-kind="text"><option value="">Ninguno</option>${groups.map(([id, label]) => `<option value="${id}" ${p.group === id ? 'selected' : ''}>${esc(label)}</option>`).join('')}</select></div>` : ''}
                </div>
                <div class="admin-toggles">${check('Visible en la web', 'visible', p.visible !== false)}${p.design ? '' : check('Mostrar en la portada', 'featured', p.featured === true)}</div>
            </fieldset>
            ${optionsHTML(p)}
            <fieldset class="admin-fieldset"><legend>Textos</legend>
                ${p.design ? '' : field('Frase corta de la tarjeta', 'summary', p.summary, { note: 'Una línea que invite. Si la dejas vacía, se usa la descripción.', attrs: 'maxlength="90"' })}
                ${field('Descripción', 'description', p.description, { area: true, placeholder: base?.description || '', note: inherited('description') })}
                ${field('Qué incluye (una cosa por línea)', 'includes', (p.includes || []).join('\n'), { type: 'lines', area: true, placeholder: (base?.includes || []).join('\n'), note: inherited('includes') })}
                ${field('Notas en la ficha (una por línea)', 'notes', (p.notes || []).join('\n'), { type: 'lines', area: true, placeholder: (base?.notes || []).join('\n'), note: inherited('notes') || 'Aclaraciones que se ven bajo las opciones.' })}
            </fieldset>
            ${p.category === 'extras' || p.basedOn ? '' : `<fieldset class="admin-fieldset"><legend>Pedido</legend><div class="admin-grid">
                ${field('Cantidad mínima', 'minimum', p.minimum ?? 1, { type: 'number' })}
                ${field('Nombre de la cantidad', 'quantityLabel', p.quantityLabel, { placeholder: 'Cantidad de esta presentación' })}
            </div>${personal ? `<p class="field-note">Texto que escribe el cliente: ${esc(personal)}.</p>` : ''}</fieldset>`}
            ${photosHTML(p)}
            <p class="field-error" id="editorError" role="alert" hidden></p>
        </div>
        <div class="admin-editor-actions">
            ${editingId ? '<button type="button" class="admin-danger" data-action="delete">Eliminar producto</button>' : '<span></span>'}
            <div><button type="button" class="btn btn-secondary" data-close-dialog>Cancelar</button><button type="submit" class="btn">Guardar ${icon('check')}</button></div>
        </div>
    </form>`;
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
    if (path === 'category' || path === 'basedOn') { if (path === 'category') delete edit.group; renderEditor(); }
});

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
    const errors = M.validate([edit], products).filter(message => !message.includes('identificador'));
    if (errors.length) { showError('editorError', errors[0]); return; }
    const saved = M.clone(edit);
    if (editingId) products[products.findIndex(p => p.id === editingId)] = saved;
    else {
        const last = products.findLastIndex(p => p.category === saved.category && !p.design);
        products.splice(last + 1, 0, saved);
    }
    LaurenUI.close(editor);
    render();
    LaurenUI.toast('Guardado en tus cambios. Publica cuando termines.');
});

/* ---------- Fotos de la web ---------- */
const picker = $('picker');
LaurenUI.dialogEvents(picker);
let manifest = null;
async function openPicker() {
    if (!manifest) {
        try { manifest = (await (await fetch('/assets/propuestas-fotograficas/manifest.json')).json()).items.filter(item => M.IMAGE.test(item.proposal)); }
        catch { LaurenUI.toast('No pudimos cargar las fotos. Inténtalo de nuevo.'); return; }
    }
    const used = new Set([edit.mainImage, ...(edit.images || [])]);
    const sorted = [...manifest].sort((a, b) => (b.category === edit.category) - (a.category === edit.category));
    picker.innerHTML = `<div class="dialog-scroll"><button class="icon-button dialog-close" type="button" data-close-dialog aria-label="Cerrar">${icon('close')}</button><p class="eyebrow">Fotos de la web</p><h2 id="pickerTitle">Elige una <em>foto.</em></h2><p class="admin-lead">Primero las de ${esc(sectionName(edit.category))}.</p><div class="admin-photos" style="margin-top:24px">${sorted.filter(item => !used.has(item.proposal)).map(item => `<div class="admin-photo"><button type="button" data-photo="${esc(item.proposal)}"><img src="${esc(imagePath(item.proposal))}" alt="" width="120" height="150" loading="lazy">${esc(item.name)}</button></div>`).join('')}</div></div>`;
    picker.addEventListener('close', () => editor.open || LaurenUI.open(editor), { once: true });
    LaurenUI.open(picker);
}
picker.addEventListener('click', event => {
    const button = event.target.closest('[data-photo]');
    if (!button) return;
    edit.images = [...(edit.images || []), button.dataset.photo];
    if (!edit.mainImage) edit.mainImage = button.dataset.photo;
    renderEditor();
    LaurenUI.close(picker);
});

if (preview) {
    $('authView').hidden = true; $('appView').hidden = false;
    $('adminSession').hidden = false; $('adminUser').textContent = 'Vista previa';
    await loadCatalog();
}
