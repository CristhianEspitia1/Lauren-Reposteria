/**
 * Temporada: mientras el centro de control tenga una encendida (Navidad, Amor y Amistad, Día de la Madre, Halloween u
 * otra celebración), la portada abre con su sección y cada persona ve su aviso al entrar, una vez al día. Solo hay una
 * encendida a la vez. Los datos viven en js/season-data.js (`temporada` en Firestore); aquí, las reglas. Lo usan el
 * navegador (catalog-model.js y site.js), el panel, scripts/pull-catalog.mjs y las pruebas.
 *
 * Sus productos son los del catálogo con `category: 'temporada'` y `group` igual al identificador de su temporada: solo
 * se ven y se piden mientras esa temporada está encendida (Catalog.get y Catalog.all).
 */
(() => {
    'use strict';
    const CATEGORY = 'temporada';
    // Cada temporada con su icono (js/brand-icons.js) y los textos con que empieza; el negocio los cambia en el panel.
    const SEASONS = [
        {
            id: 'navidad', nombre: 'Navidad', icono: 'pine',
            textos: {
                etiqueta: 'Navidad en Lauren', titulo: 'Esta Navidad,', destacado: 'regala algo dulce.',
                texto: 'Detalles hechos a mano para compartir en diciembre. Pide con tiempo y lo preparamos para ti.',
                aviso: { titulo: 'La Navidad ya llegó', destacado: 'a Lauren.', texto: 'Preparamos una colección especial para regalar y compartir en diciembre. Pide con tiempo y la hacemos para ti.' }
            }
        },
        {
            id: 'amor-y-amistad', nombre: 'Amor y Amistad', icono: 'hearts',
            textos: {
                etiqueta: 'Amor y Amistad', titulo: 'Para quien más quieres,', destacado: 'un detalle dulce.',
                texto: 'Detalles hechos a mano para sorprender a esa persona especial.',
                aviso: { titulo: 'Celebra el Amor', destacado: 'y la Amistad.', texto: 'Tenemos una colección pensada para sorprender a quien más quieres. Pide con tiempo y la preparamos para ti.' }
            }
        },
        {
            id: 'dia-de-la-madre', nombre: 'Día de la Madre', icono: 'flower',
            textos: {
                etiqueta: 'Día de la Madre', titulo: 'Para mamá,', destacado: 'con todo el cariño.',
                texto: 'Tortas y detalles hechos a mano para consentirla en su día.',
                aviso: { titulo: 'Consiente a mamá', destacado: 'en su día.', texto: 'Preparamos una colección especial para el Día de la Madre. Pide con tiempo y la hacemos para ella.' }
            }
        },
        {
            id: 'halloween', nombre: 'Halloween', icono: 'pumpkin',
            textos: {
                etiqueta: 'Halloween en Lauren', titulo: 'Un Halloween', destacado: 'muy dulce.',
                texto: 'Galletas y detalles hechos a mano para celebrar y compartir.',
                aviso: { titulo: 'Llegó Halloween', destacado: 'a Lauren.', texto: 'Preparamos dulces especiales para celebrar. Pide con tiempo y los hacemos para ti.' }
            }
        },
        {
            id: 'celebracion', nombre: 'Otra celebración', icono: 'gift',
            textos: {
                etiqueta: 'Edición especial', titulo: 'Hecho para', destacado: 'celebrar contigo.',
                texto: 'Una colección especial, hecha a mano para esta fecha.',
                aviso: { titulo: 'Tenemos algo', destacado: 'especial para ti.', texto: 'Preparamos una colección para esta fecha. Mírala y pide con tiempo.' }
            }
        }
    ];
    // A dónde lleva el botón del aviso: [clave, nombre en el panel, dirección]. WhatsApp la arma la página (LaurenUI.wa).
    const DESTINOS = [
        ['temporada', 'La sección de temporada', '/#temporada'], ['tortas', 'Tortas', '/tortas/'], ['alfajores', 'Alfajores', '/alfajores/'],
        ['brownies-galletas', 'Brownies y galletas', '/brownies-galletas/'], ['detalles', 'Detalles', '/detalles/'], ['whatsapp', 'WhatsApp', '']
    ];
    // Largo máximo de cada texto: el panel no deja escribir más y la web no acepta una temporada publicada que lo pase.
    const LIMITS = { etiqueta: 40, titulo: 60, destacado: 60, texto: 180, aviso: { titulo: 60, destacado: 60, texto: 240, boton: 32 } };
    const TEXTS = ['etiqueta', 'titulo', 'destacado', 'texto'];
    const AVISO_TEXTS = ['titulo', 'destacado', 'texto', 'boton'];
    const AVISO = { activo: true, boton: 'Ver la colección', destino: 'temporada', foto: '' };
    const EMPTY = Object.freeze({ activa: '', temporadas: Object.freeze([]) });
    const ids = new Set(SEASONS.map(s => s.id));
    const data = () => window.seasonData || EMPTY;
    const name = id => SEASONS.find(s => s.id === id)?.nombre || '';
    const clean = text => String(text ?? '').replace(/[​‎‏‪-‮⁠⁦-⁩﻿]/g, '').replace(/\s+/g, ' ').trim();

    /* ---------- Fechas: el día cuenta en Colombia (UTC−5, sin horario de verano) ---------- */
    const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const today = (now = new Date()) => new Date(now.getTime() - 5 * 3600000).toISOString().slice(0, 10);
    const iso = (year, month, day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isDate = value => typeof value === 'string' && /^2\d{3}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T12:00:00Z`).toISOString?.().slice(0, 10) === value;
    const realDate = value => { try { return isDate(value); } catch { return false; } };
    /**
     * «24/12/2026», «24/12» o «24 de diciembre» → «2026-12-24»; vacío → «»; otra cosa → null. Sin año, es el próximo
     * 24 de diciembre (este año o, si ya pasó, el siguiente).
     */
    function parseDate(text, now = new Date()) {
        const value = String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
        if (!value) return '';
        let day, month, year;
        let match = /^(\d{1,2})\s*[/.-]\s*(\d{1,2})(?:\s*[/.-]\s*(\d{4}|\d{2}))?$/.exec(value);
        if (match) [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3] || 0)];
        else {
            match = /^(\d{1,2})\s+(?:de\s+)?([a-z]{3,10})(?:\s+(?:del?\s+)?(\d{4}))?$/.exec(value);
            if (!match) return null;
            [day, month, year] = [Number(match[1]), MONTHS.findIndex(m => m === match[2] || m.slice(0, 3) === match[2]) + 1, Number(match[3] || 0)];
        }
        if (year && year < 100) year += 2000;
        if (!year) {
            year = Number(today(now).slice(0, 4));
            if (iso(year, month, day) < today(now)) year++;
        }
        const date = iso(year, month, day);
        return realDate(date) ? date : null;
    }
    /** «2026-12-24» → «24 de diciembre de 2026». */
    const formatDate = value => realDate(value) ? `${Number(value.slice(8))} de ${MONTHS[Number(value.slice(5, 7)) - 1]} de ${value.slice(0, 4)}` : '';
    /** «2026-12-24» → «24/12/2026», como se escribe en el panel. */
    const shortDate = value => realDate(value) ? `${value.slice(8)}/${value.slice(5, 7)}/${value.slice(0, 4)}` : '';

    /* ---------- Datos ---------- */
    /** Una temporada completa: lo que el negocio guardó sobre los textos con que empieza. */
    function get(id, d = data()) {
        const base = SEASONS.find(s => s.id === id);
        if (!base) return null;
        const saved = (Array.isArray(d?.temporadas) ? d.temporadas : []).find(s => s?.id === id) || {};
        return { ...base.textos, hasta: '', ...saved, id, nombre: base.nombre, icono: base.icono, aviso: { ...AVISO, ...base.textos.aviso, ...(saved.aviso || {}) } };
    }
    /** Forma de una temporada publicada: la web no cambia su copia por un dato dañado o escrito sin pasar por el panel. */
    const isText = (value, max) => value === undefined || (typeof value === 'string' && value.length <= max);
    const valid = d => Boolean(d) && typeof d === 'object' && !Array.isArray(d)
        && (d.activa === '' || ids.has(d.activa)) && Array.isArray(d.temporadas)
        && new Set(d.temporadas.map(s => s?.id)).size === d.temporadas.length
        && d.temporadas.every(s => s && typeof s === 'object' && !Array.isArray(s) && ids.has(s.id)
            && TEXTS.every(key => isText(s[key], LIMITS[key]))
            && (s.hasta === undefined || s.hasta === '' || realDate(s.hasta))
            && (s.aviso === undefined || (s.aviso && typeof s.aviso === 'object' && !Array.isArray(s.aviso)
                && (s.aviso.activo === undefined || typeof s.aviso.activo === 'boolean')
                && AVISO_TEXTS.every(key => isText(s.aviso[key], LIMITS.aviso[key]))
                && (s.aviso.destino === undefined || DESTINOS.some(([key]) => key === s.aviso.destino))
                && isText(s.aviso.foto, 200))));
    /** Lo que se publica: solo temporadas conocidas, en su orden, con sus textos limpios y cortados a su largo. */
    function tidy(d = data()) {
        const cut = (text, max) => clean(text).slice(0, max);
        const temporadas = SEASONS.filter(base => (d?.temporadas || []).some(s => s?.id === base.id)).map(base => {
            const s = get(base.id, d);
            return {
                id: s.id, ...Object.fromEntries(TEXTS.map(key => [key, cut(s[key], LIMITS[key])])), hasta: realDate(s.hasta) ? s.hasta : '',
                aviso: {
                    activo: s.aviso.activo !== false, ...Object.fromEntries(AVISO_TEXTS.map(key => [key, cut(s.aviso[key], LIMITS.aviso[key])])),
                    destino: DESTINOS.some(([key]) => key === s.aviso.destino) ? s.aviso.destino : 'temporada', foto: typeof s.aviso.foto === 'string' ? s.aviso.foto : ''
                }
            };
        });
        return { activa: ids.has(d?.activa) ? d.activa : '', temporadas };
    }
    const expired = (season, now = new Date()) => Boolean(season?.hasta) && today(now) > season.hasta;
    // La temporada encendida se consulta por cada producto del catálogo: se recuerda mientras no cambien los datos ni el día.
    let memo = { d: null, day: '', value: null };
    /** La temporada que se ve hoy en la web: la encendida, si su último día no ha pasado. Si no, null. */
    function active(d = data(), now = new Date()) {
        const day = today(now);
        if (memo.d === d && memo.day === day) return memo.value;
        const season = valid(d) && d.activa ? get(d.activa, d) : null;
        const value = season && !expired(season, now) ? season : null;
        memo = { d, day, value };
        return value;
    }
    /** Productos de una temporada en el catálogo (también los ocultos), en su orden. */
    const products = (id, catalog = window.catalogData) => Object.values(catalog || {}).filter(p => p?.category === CATEGORY && p.group === id);
    const visibleProducts = (id, catalog) => products(id, catalog).filter(p => p.visible !== false);
    const photosOf = p => [...new Set([p.mainImage, ...(p.images || [])].filter(Boolean))];
    /** La foto del aviso, si sigue siendo de uno de los productos visibles de la temporada; si no, el aviso va sin foto. */
    const avisoPhoto = (season, catalog) => season?.aviso?.foto && visibleProducts(season.id, catalog).some(p => photosOf(p).includes(season.aviso.foto)) ? season.aviso.foto : '';

    /* ---------- Centro de control ---------- */
    const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;
    /** Cómo está una temporada, para su fila en el panel. */
    function summary(id, d = data(), catalog = window.catalogData, now = new Date()) {
        const season = get(id, d);
        const all = products(id, catalog).length, shown = visibleProducts(id, catalog).length;
        if (d?.activa !== id) return `Apagada · ${all ? `${count(all, 'producto guardado', 'productos guardados')}` : 'sin productos'}`;
        if (expired(season, now)) return `Su último día ya pasó (${formatDate(season.hasta)}): no se ve en la web`;
        return [shown ? `En la portada con ${count(shown, 'producto', 'productos')}` : 'Sin productos visibles: la sección no se ve', season.aviso.activo ? 'Aviso al entrar' : 'Sin aviso', season.hasta ? `Hasta el ${formatDate(season.hasta)}` : ''].filter(Boolean).join(' · ');
    }
    /** Lo que impide publicar la temporada encendida, con la temporada a la que lleva («Ir a arreglarlo»). */
    function problems(d = data(), catalog = window.catalogData) {
        if (!ids.has(d?.activa)) return [];
        const season = get(d.activa, d), out = [];
        const add = text => out.push({ id: `season:${season.id}`, text: `${season.nombre}: ${text}` });
        if (!clean(season.titulo) && !clean(season.destacado)) add('escribe el titular de la sección.');
        if (season.aviso.activo) {
            if (!clean(season.aviso.titulo) && !clean(season.aviso.destacado)) add('escribe el titular del aviso.');
            if (!clean(season.aviso.boton)) add('escribe el texto del botón del aviso.');
            if (season.aviso.destino === 'temporada' && !visibleProducts(season.id, catalog).length) add('el botón del aviso lleva a la sección, pero no tiene productos visibles. Agrega uno o cambia a dónde lleva el botón.');
        }
        return out;
    }
    /** Se puede publicar, pero conviene revisarlo. */
    function warnings(d = data(), catalog = window.catalogData, now = new Date()) {
        if (!ids.has(d?.activa)) return [];
        const season = get(d.activa, d), out = [];
        const add = text => out.push({ id: `season:${season.id}`, text: `${season.nombre}: ${text}` });
        const shown = visibleProducts(season.id, catalog).length;
        if (expired(season, now)) add(`su último día (${formatDate(season.hasta)}) ya pasó, así que no se ve en la web. Cámbialo o apágala.`);
        if (!shown && !season.aviso.activo) add('está encendida, pero no tiene productos visibles ni aviso: no se verá nada en la web.');
        else if (!shown && season.aviso.destino !== 'temporada') add('no tiene productos visibles: la sección no se ve y solo sale el aviso.');
        if (season.aviso.activo && season.aviso.foto && !avisoPhoto(season, catalog)) add('la foto del aviso ya no está en sus productos visibles: el aviso sale sin foto.');
        return out;
    }
    /** Cambios entre lo publicado y el borrador: temporadas con cambios y cuál se enciende o se apaga. */
    function changes(before, after) {
        const changed = SEASONS.map(s => s.id).filter(id => JSON.stringify(get(id, before)) !== JSON.stringify(get(id, after)));
        const was = ids.has(before?.activa) ? before.activa : '', now = ids.has(after?.activa) ? after.activa : '';
        return { changed, on: now !== was ? now : '', off: now !== was ? was : '', total: changed.length + (now !== was ? 1 : 0) };
    }

    window.LaurenSeason = { CATEGORY, SEASONS, DESTINOS, LIMITS, data, name, get, valid, tidy, active, expired, today, parseDate, formatDate, shortDate, products, visibleProducts, avisoPhoto, summary, problems, warnings, changes };
})();
