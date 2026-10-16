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
    const IMAGE = /^\/assets\/(?:optimized|propuestas-fotograficas)\/[a-z0-9/_.-]+\.(?:webp|png|jpg)$/;
    const clone = value => JSON.parse(JSON.stringify(value));
    const slug = text => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
    function unique(base, taken) {
        const start = base || 'producto';
        let id = start;
        for (let n = 2; taken.has(id); n++) id = `${start}-${n}`;
        return id;
    }
    /** «65.000», «$ 65000» → 65000; vacío → null (Cotiza por WhatsApp); otra cosa → NaN. */
    function parseMoney(text) {
        const clean = String(text ?? '').replace(/[$\s.,]/g, '');
        if (!clean) return null;
        return /^\d{1,9}$/.test(clean) ? Number(clean) : NaN;
    }
    const formatMoney = value => typeof value === 'number' && Number.isFinite(value) ? new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value) : '';
    const priced = option => Boolean(option.choices?.some(choice => Object.hasOwn(choice, 'price')));
    /**
     * Producto nuevo con la estructura del primero de su sección (opciones, porciones, campos de
     * mensaje), sin nombre, sin fotos y con todos los precios vacíos. Empieza oculto.
     */
    function template(category, products) {
        const base = products.find(p => p.category === category && !p.basedOn && !p.design);
        const product = base ? clone(base) : { category, options: [], personalization: null };
        for (const key of ['design', 'reference', 'basedOn', 'featured', 'summary', 'priceMax']) delete product[key];
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
    /** Errores que impiden publicar, en palabras de la persona que edita. */
    function validate(products, all = products) {
        const errors = [];
        const ids = new Set();
        const sections = new Set(SECTIONS.map(([id]) => id));
        const money = (value, where) => {
            if (value !== null && value !== undefined && !(Number.isSafeInteger(value) && value >= 0)) errors.push(`${where}: escribe el precio solo con números (o déjalo vacío).`);
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
            if (p.minimum !== undefined && p.minimum !== null && !(Number.isInteger(p.minimum) && p.minimum >= 1 && p.minimum <= 99)) errors.push(`${name}: la cantidad mínima va de 1 a 99.`);
            for (const src of [p.mainImage, ...(p.images || [])].filter(Boolean)) if (!IMAGE.test(src) || src.includes('..')) errors.push(`${name}: hay una foto que no es de la web.`);
            for (const option of p.options || []) {
                if (!String(option.label || '').trim()) errors.push(`${name}: hay un grupo de opciones sin título.`);
                if (option.type === 'toggle') { money(option.priceModifier, `${name} · ${option.label}`); continue; }
                if (!option.choices?.length) errors.push(`${name} · ${option.label || 'opciones'}: agrega al menos una opción.`);
                for (const choice of option.choices || []) {
                    if (!String(choice.label || '').trim()) errors.push(`${name} · ${option.label}: hay una opción sin nombre.`);
                    money(choice.price, `${name} · ${choice.label || option.label}`);
                }
            }
        }
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
    window.AdminModel = { SECTIONS, GROUPS, IMAGE, clone, slug, unique, parseMoney, formatMoney, priced, template, normalize, toCatalog, validate, changes };
})();
