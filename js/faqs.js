/**
 * Preguntas frecuentes: una sola lista que edita el centro de control (js/faq-data.js en el repositorio, `preguntas`
 * en Firestore). Cada pregunta marca en qué páginas sale y, en la página de preguntas, su tema; en cada página van en
 * el orden de la lista. Lo usan el navegador (site.js), el HTML publicado (scripts/seo.mjs) y el panel.
 *
 * En las respuestas, `{precio:ref}` es un importe del catálogo vigente (Catalog.priceRef: «torta-vintage»,
 * «torta-vintage?porciones=25-30», «@tortas») y `{pagina:clave}` un enlace a otra página. El panel los muestra
 * en palabras: «[precio de Torta Vintage, 25 a 30 porciones]», «[precio más bajo de Tortas]», «[página Tortas]».
 */
(() => {
    'use strict';
    // [clave, nombre en el panel, dirección, texto del enlace]
    const PAGES = [
        ['inicio', 'Portada', '/', 'Inicio'],
        ['tortas', 'Tortas', '/tortas/', 'Tortas'],
        ['alfajores', 'Alfajores', '/alfajores/', 'Alfajores'],
        ['brownies-galletas', 'Brownies y galletas', '/brownies-galletas/', 'Brownies y galletas'],
        ['detalles', 'Detalles', '/detalles/', 'Detalles'],
        ['preguntas', 'Página de preguntas', '/preguntas/', 'Preguntas frecuentes']
    ];
    const TOKEN = /\{(precio|pagina):([^{}]+)\}/g;
    const data = () => window.faqData || { temas: [], preguntas: [] };
    const plain = text => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
    // Texto de la página: el espacio duro («50 %», «a. m.») se escribe como en el resto del HTML.
    const text = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');
    const attr = value => text(value).replace(/"/g, '&quot;');
    const page = key => PAGES.find(([id]) => id === key);
    const list = names => names.join(', ').replace(/, ([^,]*)$/, ' y $1');

    /** Respuesta en HTML: el texto escapado, los importes con `data-price` (site.js los mantiene al día) y los enlaces. */
    function answer(value) {
        return String(value || '').split(TOKEN).map((part, i, parts) => {
            if (i % 3 === 0) return text(part);
            if (i % 3 === 2) return '';
            const ref = parts[i + 1];
            if (part === 'precio') return `<span data-price="${attr(ref)}">${text(window.Catalog.priceRefText(ref))}</span>`;
            const target = page(ref);
            return target ? `<a class="inline-link" href="${target[2]}">${text(target[3])}</a>` : '';
        }).join('');
    }
    const item = q => `<details class="faq-item">\n<summary>${text(q.pregunta)}<span data-icon="plus" aria-hidden="true"></span>\n</summary>\n<p>${answer(q.respuesta)}</p>\n</details>`;
    /** Las preguntas de una página, en el orden de la lista. */
    const forPage = key => data().preguntas.filter(q => (q.paginas || []).includes(key));
    /** Temas de la página de preguntas que tienen alguna. */
    const topics = () => data().temas.map(t => ({ ...t, preguntas: forPage('preguntas').filter(q => q.tema === t.id) })).filter(t => t.preguntas.length);
    /** Lista de la sección de preguntas de una página; en la página de preguntas, agrupada por tema. */
    function html(key) {
        if (key !== 'preguntas') return forPage(key).map(item).join('\n');
        return topics().map(t => `<div class="faq-group" id="${attr(t.id)}">\n<h2 class="faq-group-title">${text(t.nombre)}</h2>\n${t.preguntas.map(item).join('\n')}\n</div>`).join('\n');
    }
    /** Índice de temas de la página de preguntas. */
    const topicsHtml = () => topics().map(t => `<a href="#${attr(t.id)}">${text(t.nombre)}</a>`).join('\n');

    /* ---------- Centro de control ---------- */
    const products = () => Object.values(window.catalogData || {});
    // `sections`: [[id, nombre]] de las secciones del catálogo (AdminModel.SECTIONS).
    function friendlyPrice(ref, sections) {
        if (ref.startsWith('@')) {
            const names = ref.slice(1).split(',').map(id => sections.find(([key]) => key === id.trim())?.[1]);
            return names.every(Boolean) ? `[precio más bajo de ${list(names)}]` : null;
        }
        const [id, query = ''] = ref.split('?');
        const product = window.catalogData?.[id];
        if (!product) return null;
        if (!query) return `[precio de ${product.name}]`;
        const labels = query.split('&').map(pair => {
            const [option, value] = pair.split('=');
            return product.options?.find(o => o.id === option)?.choices?.find(c => c.value === value)?.label;
        });
        return labels.every(Boolean) ? `[precio de ${product.name}, ${labels.join(', ')}]` : null;
    }
    /** Respuesta guardada → como se escribe en el panel. Lo que ya no existe queda tal cual, para no perderlo. */
    const toFriendly = (value, sections) => String(value || '').replace(TOKEN, (token, kind, ref) =>
        kind === 'precio' ? friendlyPrice(ref, sections) || token : page(ref) ? `[página ${page(ref)[3]}]` : token);
    /**
     * Respuesta escrita en el panel → como se guarda. Devuelve { value, errors } con lo que no se reconoció
     * («No encontramos «Torta Mariposa» en el catálogo.»).
     */
    function fromFriendly(value, sections) {
        const errors = [];
        const result = String(value || '').replace(/\[\s*(precio más bajo de|precio mas bajo de|precio de|página|pagina)\s+([^\]]+?)\s*\]/gi, (token, kind, rest) => {
            const how = plain(kind);
            if (how === 'pagina') {
                const target = PAGES.find(p => [p[1], p[3]].some(name => plain(name) === plain(rest)));
                if (target) return `{pagina:${target[0]}}`;
                errors.push(`No encontramos la página «${rest}». Usa una de estas: ${list(PAGES.map(p => p[3]))}.`);
                return token;
            }
            if (how.startsWith('precio mas bajo')) {
                const ids = rest.split(/\s*,\s*|\s+y\s+/).map(name => sections.find(([, label]) => plain(label) === plain(name))?.[0]);
                if (ids.every(Boolean)) return `{precio:@${ids.join(',')}}`;
                errors.push(`No encontramos la sección de «${rest}». Usa una de estas: ${list(sections.map(([, label]) => label))}.`);
                return token;
            }
            // «Nombre del producto» o «Nombre, tamaño»: primero el nombre completo (por si lleva comas).
            const byName = name => products().find(p => plain(p.name) === plain(name));
            const whole = byName(rest);
            if (whole) return `{precio:${whole.id}}`;
            const cut = rest.lastIndexOf(',');
            const product = cut > 0 && byName(rest.slice(0, cut));
            if (!product) { errors.push(`No encontramos «${rest.split(',')[0].trim()}» en el catálogo. Escribe su nombre como en la lista de productos.`); return token; }
            const label = plain(rest.slice(cut + 1));
            const option = product.options?.find(o => o.choices?.some(c => plain(c.label) === label));
            const choice = option?.choices.find(c => plain(c.label) === label);
            if (choice) return `{precio:${product.id}?${option.id}=${choice.value}}`;
            errors.push(`«${product.name}» no tiene la opción «${rest.slice(cut + 1).trim()}».`);
            return token;
        });
        return { value: result, errors };
    }

    /** Lo que impide publicar, con la pregunta a la que lleva. */
    function problems(faq = data()) {
        const out = [];
        const ids = new Set();
        faq.preguntas.forEach((q, i) => {
            const name = q.pregunta?.trim() ? `«${q.pregunta.trim()}»` : `La pregunta ${i + 1}`;
            if (!q.id || ids.has(q.id)) out.push({ id: q.id, text: `${name}: le falta su identificador.` });
            ids.add(q.id);
            if (!q.pregunta?.trim()) out.push({ id: q.id, text: `${name}: escribe la pregunta.` });
            if (!q.respuesta?.trim()) out.push({ id: q.id, text: `${name}: escribe la respuesta.` });
            if ((q.paginas || []).includes('preguntas') && !faq.temas.some(t => t.id === q.tema)) out.push({ id: q.id, text: `${name}: elige su tema en la página de preguntas.` });
        });
        return out;
    }
    /** Se puede publicar, pero conviene revisarlo. */
    function warnings(faq = data()) {
        return faq.preguntas.flatMap(q => {
            const name = `«${q.pregunta?.trim() || 'Sin pregunta'}»`;
            const out = [];
            if (!(q.paginas || []).length) out.push({ id: q.id, text: `${name} no sale en ninguna página: marca dónde se ve.` });
            const missing = [...String(q.respuesta || '').matchAll(TOKEN)].filter(([, kind, ref]) => kind === 'precio' ? window.Catalog.priceRef(ref) === null : !page(ref));
            if (missing.length) out.push({ id: q.id, text: `${name}: la respuesta cita ${missing.length === 1 ? 'un precio o una página que ya no está' : 'precios o páginas que ya no están'}; en la web se ve «precio a consultar».` });
            return out;
        });
    }
    /** Cambios entre lo publicado y el borrador: preguntas nuevas, eliminadas, con cambios y si cambió el orden. */
    function changes(before, after) {
        const old = new Map(before.preguntas.map(q => [q.id, JSON.stringify(q)]));
        const now = new Set(after.preguntas.map(q => q.id));
        const added = after.preguntas.filter(q => !old.has(q.id)).map(q => q.id);
        const removed = before.preguntas.filter(q => !now.has(q.id)).map(q => q.id);
        const changed = after.preguntas.filter(q => old.has(q.id) && old.get(q.id) !== JSON.stringify(q)).map(q => q.id);
        const kept = list => list.filter(id => old.has(id) && now.has(id)).join('\n');
        const moved = kept(after.preguntas.map(q => q.id)) !== kept(before.preguntas.map(q => q.id));
        const temas = JSON.stringify(before.temas) !== JSON.stringify(after.temas);
        return { added, removed, changed, moved, temas, total: added.length + removed.length + changed.length + (moved ? 1 : 0) + (temas ? 1 : 0) };
    }
    /** Forma de un dato publicado: temas y preguntas con sus campos de texto. */
    const valid = faq => Boolean(faq) && Array.isArray(faq.temas) && Array.isArray(faq.preguntas)
        && faq.temas.every(t => t && typeof t.id === 'string' && typeof t.nombre === 'string')
        && faq.preguntas.every(q => q && typeof q.id === 'string' && typeof q.pregunta === 'string' && typeof q.respuesta === 'string' && Array.isArray(q.paginas));

    window.LaurenFaqs = { PAGES, answer, item, forPage, topics, html, topicsHtml, toFriendly, fromFriendly, problems, warnings, changes, valid };
})();
