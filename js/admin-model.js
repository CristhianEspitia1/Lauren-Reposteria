/** Reglas del centro de control: plantillas, identificadores, lectura de precios y validación. Sin interfaz. */
(() => {
    'use strict';
    const SECTIONS = [
        ['tortas', 'Tortas'], ['extras', 'Adicionales de torta'], ['alfajores', 'Alfajores'],
        ['brownies', 'Brownies'], ['galletas', 'Galletas'], ['detalles', 'Detalles']
    ];
    const GROUPS = {
        alfajores: [['cajas', 'Cajas y minis'], ['especiales', 'Especiales']],
        detalles: [['osos', 'Con ositos'], ['mix', 'Mix y mensajes'], ['golden', 'Golden y tortas']]
    };
    // Secciones que se piden por cantidad: solo en ellas el panel muestra cantidad mínima y su nombre.
    const QUANTITY = ['alfajores', 'brownies', 'galletas', 'detalles'];
    // Fotos de la web: las del inventario y las subidas desde el panel, que guarda y sirve el worker de fotos (worker/fotos). Igual que LaurenUI.imagePath.
    const UPLOADED = 'https://lauren-reposteria.crizczi22.workers.dev/f/';
    const IMAGE = /^(?:\/assets\/(?:optimized|propuestas-fotograficas)\/[a-z0-9/_.-]+\.(?:webp|png|jpg)|https:\/\/lauren-reposteria\.crizczi22\.workers\.dev\/f\/[a-z0-9-]{1,80}\.(?:webp|jpg))$/;
    const clone = value => JSON.parse(JSON.stringify(value));
    const slug = text => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
    function unique(base, taken) {
        const start = base || 'producto';
        let id = start;
        for (let n = 2; taken.has(id); n++) id = `${start}-${n}`;
        return id;
    }
    /**
     * «65.000», «$ 65000» → 65000; vacío → null (Cotiza por WhatsApp); otra cosa → NaN. Los pesos van sin
     * centavos: «65.000,00» se lee 65000 y «65.000,50» no se acepta (antes se leía 6.500.050).
     */
    function parseMoney(text) {
        let clean = String(text ?? '').replace(/[$\s]/g, '');
        if (!clean) return null;
        const cents = /[.,](\d{1,2})$/.exec(clean);
        if (cents) {
            if (!/^0+$/.test(cents[1])) return NaN;
            clean = clean.slice(0, cents.index);
        }
        clean = clean.replace(/[.,]/g, '');
        return /^\d{1,9}$/.test(clean) ? Number(clean) : NaN;
    }
    const formatMoney = value => typeof value === 'number' && Number.isFinite(value) ? new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value) : '';
    const priced = option => Boolean(option.choices?.some(choice => Object.hasOwn(choice, 'price')));
    // Tamaño del producto: igual que Catalog.sizeOption (porciones, presentación).
    const sizeOf = product => (product.options || []).find(o => o.type !== 'toggle' && !o.dependsOn && !o.multiplier && priced(o)) || null;
    const photos = product => [...new Set([product.mainImage, ...(product.images || [])].filter(Boolean))];
    /**
     * Fotos principales de los demás productos. La principal (la de la tarjeta) es única: así no hay
     * dos tarjetas iguales. El panel además mueve las demás fotos al agregarlas en otro producto (cada foto vive en uno solo).
     */
    const takenPhotos = (products, except) => new Map(products.filter(p => p !== except && !(except?.id && p.id === except.id) && p.mainImage)
        .map(p => [p.mainImage, p.name?.trim() || 'otro producto']));
    /** Nombre corto de una foto para los mensajes: «torta-vintage», «foto subida». */
    const photoName = src => src.split('/').pop().replace(/\.\w+$/, '');
    /**
     * Producto nuevo con la estructura y los textos del primero de su sección (opciones, porciones, campos de
     * mensaje, descripción), sin nombre, sin fotos y con todos los precios vacíos. Empieza oculto.
     */
    function template(category, products) {
        const base = products.find(p => p.category === category && !p.basedOn);
        const product = base ? clone(base) : { category, options: [], personalization: null };
        // Los textos del primero de la sección quedan escritos (no de ejemplo): se editan, se completan o se borran.
        for (const key of ['basedOn', 'featured', 'priceMax']) delete product[key];
        Object.assign(product, { id: '', name: '', category, visible: false, description: product.description || '', mainImage: '', images: [] });
        product.price = null;
        if (category === 'extras') product.priceMax = null;
        for (const option of product.options || []) {
            if (option.type === 'toggle' && 'priceModifier' in option) option.priceModifier = null;
            for (const choice of option.choices || []) {
                if (Object.hasOwn(choice, 'price')) choice.price = null;
                delete choice.extra; delete choice.image;
            }
        }
        return product;
    }
    /** Completa identificadores (producto, opciones, elecciones) y quita valores vacíos antes de publicar. */
    function normalize(products) {
        const taken = new Set(products.filter(p => p.id).map(p => p.id));
        return products.map(source => {
            const product = clone(source);
            if (!product.id) { product.id = unique(slug(product.name), taken); taken.add(product.id); }
            product.name = product.name.trim();
            for (const key of ['summary', 'description', 'priceSuffix', 'priceText', 'quantityLabel', 'group']) {
                if (typeof product[key] === 'string') product[key] = product[key].trim();
                if (product[key] === '') delete product[key];
            }
            for (const key of ['includes', 'notes']) {
                if (Array.isArray(product[key])) product[key] = product[key].map(line => line.trim()).filter(Boolean);
                if (Array.isArray(product[key]) && !product[key].length) delete product[key];
            }
            if (product.category === 'extras') { delete product.mainImage; delete product.images; }
            if (product.images) product.images = [...new Set(product.images.filter(Boolean))];
            if (!product.mainImage && product.images?.length) product.mainImage = product.images[0];
            if (!QUANTITY.includes(product.category) || product.basedOn) { delete product.minimum; delete product.quantityLabel; }
            for (const option of product.options || []) if (option.addons && option.multiple) option.maxSelection = option.choices?.length || 1;
            if (product.minimum === 1 || product.minimum === null) delete product.minimum;
            const optionIds = new Set();
            for (const option of product.options || []) {
                if (!option.id) option.id = unique(slug(option.label) || 'opcion', optionIds);
                optionIds.add(option.id);
                const values = new Set(option.choices?.filter(c => c.value).map(c => c.value));
                for (const choice of option.choices || []) {
                    choice.label = String(choice.label || '').trim();
                    // Costo adicional: vacío = sin costo (en adicionales, se cotiza). Por tamaño, solo quedan los tamaños que existen.
                    if (choice.extra && typeof choice.extra === 'object') {
                        const size = sizeOf(product);
                        const sizes = new Set(size?.choices.map(c => c.value));
                        choice.extra = Object.fromEntries(Object.entries(choice.extra).filter(([key, value]) => sizes.has(key) && value !== null && value !== undefined && value !== ''));
                        if (!Object.keys(choice.extra).length) delete choice.extra;
                    } else if (Object.hasOwn(choice, 'extra') && (choice.extra === null || choice.extra === undefined)) delete choice.extra;
                    if (!choice.image) delete choice.image;
                    if (!choice.value) { choice.value = unique(slug(choice.label) || 'opcion', values); values.add(choice.value); }
                }
            }
            return product;
        });
    }
    /** Fotos de las elecciones (bizcochos y rellenos con foto propia, para «Un sabor para recordar»). */
    const choicePhotos = product => (product.options || []).flatMap(o => (o.choices || []).map(c => c.image)).filter(Boolean);
    const FLAVOR_PHOTOS = ['sabor', 'relleno'];
    /** Grupo de adicionales nuevo: se marcan varios y cada uno suma su precio (por tamaño, si el producto lo tiene). */
    const addonsGroup = (choices = []) => ({ id: 'adicionales', label: 'Adicionales', type: 'radio', required: false, multiple: true, addons: true, note: 'Detalles que le ponemos a tu torta. Marca los que quieras: cada uno suma su valor al total.', choices });
    /**
     * Cada producto es independiente: lo que antes tomaba de su torta base (`basedOn`: porciones, precios, textos,
     * sabores) se copia en él, y los adicionales de la vitrina (productos «extras») se copian como grupo propio de cada
     * torta que aún no lo tiene. El panel lo hace al abrir; la web lo ve al publicar.
     */
    function migrate(products) {
        const keys = ['description', 'includes', 'notes', 'price', 'priceSuffix', 'minimum', 'quantityLabel', 'options', 'personalization'];
        const vitrina = products.filter(p => p.category === 'extras' && p.visible !== false);
        return products.map(source => {
            let product = source;
            const base = source.basedOn ? products.find(b => b.id === source.basedOn && !b.basedOn) : null;
            if (source.basedOn) {
                product = clone(source);
                if (base) for (const key of keys) if (!(key in product) && key in base) product[key] = clone(base[key]);
                delete product.basedOn;
            }
            if (product.category === 'tortas' && vitrina.length && !(product.options || []).some(o => o.id === 'adicionales')) {
                if (product === source) product = clone(source);
                const fixed = p => typeof p.price === 'number' && p.price > 0 && !(typeof p.priceMax === 'number' && p.priceMax > p.price);
                product.options = [...(product.options || []), addonsGroup(vitrina.map(p => ({ value: slug(p.name) || p.id, label: p.name, ...(fixed(p) ? { extra: p.price } : {}) })))];
            }
            for (const option of product.options || []) if (option.multiple && option.addons) option.maxSelection = option.choices.length;
            return product;
        });
    }
    const toCatalog = products => Object.fromEntries(products.map(p => [p.id, p]));
    /** Fotos subidas que se pidió borrar y que ya ningún producto usa: el panel las borra después de publicar. */
    function unusedUploads(pending, products) {
        const used = new Set(products.flatMap(p => [...photos(p), ...choicePhotos(p)]));
        return [...pending].filter(src => typeof src === 'string' && src.startsWith(UPLOADED) && !used.has(src));
    }
    /** Errores que impiden publicar, en palabras de la persona que edita. */
    function validate(products, all = products) {
        const errors = [];
        const ids = new Set();
        const sections = new Set(SECTIONS.map(([id]) => id));
        // Un precio de $0 se vería «Cotiza por WhatsApp» en la tarjeta y $0 en la ficha: se pide dejarlo vacío.
        const money = (value, where, empty = '«Cotiza por WhatsApp»') => {
            if (value === null || value === undefined) return;
            if (value === 0) errors.push(`${where}: el precio no puede ser $0. Déjalo vacío para ${empty}.`);
            else if (!(Number.isSafeInteger(value) && value > 0)) errors.push(`${where}: escribe el precio solo con números (o déjalo vacío).`);
        };
        for (const p of products) {
            const name = p.name?.trim() || 'Producto sin nombre';
            if (!p.name?.trim()) errors.push('Hay un producto sin nombre.');
            if (p.id && ids.has(p.id)) errors.push(`${name}: el identificador «${p.id}» está repetido.`);
            if (p.id) ids.add(p.id);
            if (!sections.has(p.category)) errors.push(`${name}: elige una sección.`);
            if (p.basedOn && !all.some(base => base.id === p.basedOn && !base.basedOn)) errors.push(`${name}: la torta base ya no existe.`);
            money(p.price, name);
            money(p.priceMax, `${name} (precio máximo)`);
            if (typeof p.priceMax === 'number' && p.priceMax > 0 && !(typeof p.price === 'number' && p.price > 0)) errors.push(`${name}: escribe también el «Precio desde».`);
            else if (typeof p.priceMax === 'number' && p.priceMax > 0 && p.priceMax <= p.price) errors.push(`${name}: el «Precio hasta» debe ser mayor que el «Precio desde».`);
            if (p.minimum !== undefined && p.minimum !== null && !(Number.isInteger(p.minimum) && p.minimum >= 1 && p.minimum <= 99)) errors.push(`${name}: la cantidad mínima va de 1 a 99.`);
            for (const src of [p.mainImage, ...(p.images || [])].filter(Boolean)) if (!IMAGE.test(src) || src.includes('..')) errors.push(`${name}: hay una foto que no es de la web.`);
            if (p.category !== 'extras' && p.visible !== false && !photos(p).length) errors.push(`${name}: elige al menos una foto para mostrarlo en la web.`);
            const main = photos(p)[0];
            const taken = takenPhotos(all, p);
            if (main && taken.has(main)) errors.push(`${name}: la foto principal «${photoName(main)}» ya es la principal de «${taken.get(main)}». Pon primero otra foto: cada tarjeta lleva su propia foto.`);
            for (const option of p.options || []) {
                if (!String(option.label || '').trim()) errors.push(`${name}: hay un grupo de opciones sin título.`);
                if (option.type === 'toggle') { money(option.priceModifier, `${name} · ${option.label}`, '«Sin costo»'); continue; }
                if (!option.choices?.length) errors.push(`${name} · ${option.label || 'opciones'}: agrega al menos una opción.`);
                // Cuántas puede marcar el cliente en un grupo de varias: de 1 al número de opciones.
                if (option.multiple && !option.addons) {
                    const caps = option.maxSelection && typeof option.maxSelection === 'object' ? Object.values(option.maxSelection) : [option.maxSelection ?? 1];
                    if (caps.some(n => n !== null && !(Number.isInteger(n) && n >= 1 && n <= (option.choices?.length || 1)))) errors.push(`${name} · ${option.label}: escribe cuántas puede elegir con un número de 1 a ${option.choices?.length || 1}.`);
                }
                for (const choice of option.choices || []) {
                    if (!String(choice.label || '').trim()) errors.push(`${name} · ${option.label}: hay una opción sin nombre.`);
                    money(choice.price, `${name} · ${choice.label || option.label}`);
                    const extras = choice.extra && typeof choice.extra === 'object' ? Object.values(choice.extra) : [choice.extra];
                    for (const value of extras) money(value, `${name} · ${choice.label || option.label} (${option.addons ? 'precio' : 'costo adicional'})`, option.addons ? '«Cotiza»' : '«Sin costo»');
                    if (choice.image && (!IMAGE.test(choice.image) || choice.image.includes('..'))) errors.push(`${name} · ${choice.label}: la foto no es de la web.`);
                }
            }
        }
        // La portada tiene cuatro lugares, solo para tortas (Catalog.FEATURED).
        const max = window.Catalog?.FEATURED || 4;
        const pool = all === products ? products : [...all.filter(o => !products.some(p => p === o || (p.id && p.id === o.id))), ...products];
        const onHome = p => p.featured === true && p.category === 'tortas';
        const marked = pool.filter(onHome);
        if (marked.length > max && products.some(onHome)) errors.push(`En la portada caben ${max} tortas y hay ${marked.length} marcadas. Desmarca «Portada» en alguna.`);
        return [...new Set(errors)];
    }
    /**
     * Avisos del centro de control, en palabras sencillas y con el producto al que llevan («Ir a arreglarlo»).
     * `problems`: lo que impide publicar (las mismas reglas de `validate`). `warnings`: lo que se puede publicar,
     * pero conviene revisar (precios vacíos que se cotizan, adicionales sin precio para algún tamaño).
     */
    function problems(products) {
        const named = products.map(p => [p.name?.trim() || 'Producto sin nombre', p.id]).sort((a, b) => b[0].length - a[0].length);
        return validate(products).map(text => ({ id: named.find(([name]) => text.startsWith(`${name}:`) || text.startsWith(`${name} ·`))?.[1] || null, text }));
    }
    function warnings(products) {
        const list = [];
        const amount = value => typeof value === 'number' && value > 0;
        const names = labels => labels.map(label => `«${label}»`).join(', ').replace(/, ([^,]*)$/, ' y $1');
        for (const p of products) {
            if (p.visible === false) continue;
            const name = p.name?.trim() || 'Producto sin nombre';
            const add = text => list.push({ id: p.id || null, text: `${name}: ${text}` });
            if (p.category === 'extras') {
                if (!String(p.priceText || '').trim() && !amount(p.price)) add('no tiene precio; en la vitrina dice «Cotiza por WhatsApp».');
                continue;
            }
            // Un aviso por producto y por tema, no uno por cada opción.
            const pricedOptions = (p.options || []).filter(o => o.type !== 'toggle' && priced(o));
            if (!pricedOptions.length && !amount(p.price)) add('no tiene precio; en la web dice «Cotiza por WhatsApp».');
            const empty = pricedOptions.flatMap(o => o.choices.filter(c => !amount(c.price)).map(c => c.label || 'una opción'));
            if (empty.length) add(`${names(empty)} ${empty.length === 1 ? 'no tiene precio; se cotiza' : 'no tienen precio; se cotizan'} por WhatsApp.`);
            const size = sizeOf(p);
            const none = [], partial = [];
            for (const option of (p.options || []).filter(o => o.addons)) for (const choice of option.choices || []) {
                const value = key => typeof choice.extra === 'number' ? choice.extra : choice.extra?.[key];
                const missing = size ? size.choices.filter(sz => !amount(value(sz.value))) : amount(choice.extra) ? [] : [null];
                if (!missing.length) continue;
                if (!size || missing.length === size.choices.length) none.push(choice.label || 'un adicional');
                else partial.push(`«${choice.label}» en ${missing.map(sz => sz.label).join(', ').replace(/, ([^,]*)$/, ' y $1')}`);
            }
            if (none.length) add(`${none.length === 1 ? `el adicional ${names(none)} no tiene precio` : `${none.length} adicionales sin precio (${names(none)})`}; si los marcan, la torta se consulta por WhatsApp.`);
            if (partial.length) add(`adicionales sin precio para algún tamaño: ${partial.join('; ')}. En ese tamaño se consulta por WhatsApp.`);
        }
        return list;
    }
    /** Productos nuevos, cambiados y eliminados respecto de lo publicado. */
    function changes(original, products) {
        const before = new Map(Object.values(original).map(p => [p.id, JSON.stringify(p)]));
        const now = new Set(products.map(p => p.id).filter(Boolean));
        const changed = products.filter(p => !p.id || !before.has(p.id) || before.get(p.id) !== JSON.stringify(p)).map(p => p.id || p.name);
        const removed = [...before.keys()].filter(id => !now.has(id));
        return { changed, removed, total: changed.length + removed.length };
    }
    window.AdminModel = { problems, warnings, migrate, addonsGroup, choicePhotos, FLAVOR_PHOTOS, sizeOf, SECTIONS, GROUPS, QUANTITY, IMAGE, UPLOADED, photos, takenPhotos, photoName, clone, slug, unique, parseMoney, formatMoney, priced, template, normalize, toCatalog, unusedUploads, validate, changes };
})();
