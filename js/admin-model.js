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
     * Producto nuevo con la estructura del primero de su sección (opciones, porciones, campos de
     * mensaje), sin nombre, sin fotos y con todos los precios vacíos. Empieza oculto.
     */
    function template(category, products) {
        const base = products.find(p => p.category === category && !p.basedOn);
        const product = base ? clone(base) : { category, options: [], personalization: null };
        for (const key of ['basedOn', 'featured', 'summary', 'priceMax']) delete product[key];
        Object.assign(product, { id: '', name: '', category, visible: false, description: '', mainImage: '', images: [] });
        product.price = null;
        if (category === 'extras') product.priceMax = null;
        for (const option of product.options || []) {
            if (option.type === 'toggle' && 'priceModifier' in option) option.priceModifier = null;
            for (const choice of option.choices || []) if (Object.hasOwn(choice, 'price')) choice.price = null;
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
            for (const key of ['summary', 'description', 'priceSuffix', 'quantityLabel', 'group']) {
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
            if (product.minimum === 1 || product.minimum === null) delete product.minimum;
            const optionIds = new Set();
            for (const option of product.options || []) {
                if (!option.id) option.id = unique(slug(option.label) || 'opcion', optionIds);
                optionIds.add(option.id);
                const values = new Set(option.choices?.filter(c => c.value).map(c => c.value));
                for (const choice of option.choices || []) {
                    choice.label = String(choice.label || '').trim();
                    if (!choice.value) { choice.value = unique(slug(choice.label) || 'opcion', values); values.add(choice.value); }
                }
            }
            return product;
        });
    }
    const toCatalog = products => Object.fromEntries(products.map(p => [p.id, p]));
    /** Fotos subidas que se pidió borrar y que ya ningún producto usa: el panel las borra después de publicar. */
    function unusedUploads(pending, products) {
        const used = new Set(products.flatMap(photos));
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
                for (const choice of option.choices || []) {
                    if (!String(choice.label || '').trim()) errors.push(`${name} · ${option.label}: hay una opción sin nombre.`);
                    money(choice.price, `${name} · ${choice.label || option.label}`);
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
    /** Productos nuevos, cambiados y eliminados respecto de lo publicado. */
    function changes(original, products) {
        const before = new Map(Object.values(original).map(p => [p.id, JSON.stringify(p)]));
        const now = new Set(products.map(p => p.id).filter(Boolean));
        const changed = products.filter(p => !p.id || !before.has(p.id) || before.get(p.id) !== JSON.stringify(p)).map(p => p.id || p.name);
        const removed = [...before.keys()].filter(id => !now.has(id));
        return { changed, removed, total: changed.length + removed.length };
    }
    window.AdminModel = { SECTIONS, GROUPS, QUANTITY, IMAGE, UPLOADED, photos, takenPhotos, photoName, clone, slug, unique, parseMoney, formatMoney, priced, template, normalize, toCatalog, unusedUploads, validate, changes };
})();
