/** Reglas compartidas del catálogo. Los datos proceden de catalog-data.js; aquí no hay importes ni productos. */
(() => {
    'use strict';
    const money = value => '$' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);
    // Un producto oculto desde el centro de control no se muestra, no se pide y no se indexa.
    const shown = product => product.visible !== false;
    // `basedOn` (formato anterior): una torta tomaba de otra lo que no definía. El centro de control ya independiza
    // cada grupo al abrirse; esto solo sirve para leer un catálogo publicado antes de ese cambio.
    const inherited = ['description', 'includes', 'notes', 'price', 'priceSuffix', 'minimum', 'quantityLabel', 'options', 'personalization'];
    // Grupo de adicionales de un producto (moños, mariposas…): se marcan varios y cada uno suma su precio.
    const ADDONS = 'adicionales';
    // Cada versión del catálogo (la local, la publicada o el borrador del panel) guarda sus propias fichas completas.
    const cache = new WeakMap();
    function expand(product) {
        if (!cache.has(catalogData)) cache.set(catalogData, new WeakMap());
        const expanded = cache.get(catalogData);
        if (expanded.has(product)) return expanded.get(product);
        const base = product.basedOn && Object.hasOwn(catalogData, product.basedOn) ? catalogData[product.basedOn] : null;
        const result = base && !base.basedOn ? { ...Object.fromEntries(inherited.filter(key => key in base).map(key => [key, base[key]])), ...product } : product;
        expanded.set(product, result);
        return result;
    }
    const get = id => Object.hasOwn(catalogData, id) && shown(catalogData[id]) ? expand(catalogData[id]) : null;
    const all = () => Object.values(catalogData).filter(shown).map(expand);
    // La portada muestra cuatro tortas: primero las marcadas en el centro de control («Portada») y, si faltan,
    // las siguientes tortas del catálogo. Nunca más de cuatro, aunque lleguen más marcadas.
    const FEATURED = 4;
    const FEATURED_CATEGORY = 'tortas';
    const featurable = product => product.category === FEATURED_CATEGORY;
    function featured() {
        const tortas = all().filter(featurable);
        return [...tortas.filter(p => p.featured), ...tortas.filter(p => !p.featured)].slice(0, FEATURED);
    }
    const quoteOnly = product => product.category === 'extras' || product.quoteOnly === true;
    function visible(option, selection) {
        if (!option.dependsOn) return true;
        const values = Array.isArray(option.showWhen) ? option.showWhen : [option.showWhen];
        return values.includes(selection[option.dependsOn]);
    }
    function defaults(product) {
        return Object.fromEntries((product.options || []).map(option => [option.id,
            option.type === 'toggle' ? false : option.multiple ? [] : option.choices?.[0]?.value || ''
        ]));
    }
    // Una opción con precio por elección (porciones, presentación, tamaño) fija el valor del producto.
    const priced = option => Boolean(option.choices?.some(choice => Object.hasOwn(choice, 'price')));
    /**
     * Tamaño del producto: la primera opción con precio por elección (porciones, presentación). Los costos adicionales
     * de bizcochos, rellenos y adicionales pueden cambiar según ese tamaño (`extra: { "4-5": 5000, "12-15": 12000 }`).
     */
    const sizeOption = product => (product.options || []).find(option => option.type !== 'toggle' && !option.dependsOn && !option.multiplier && priced(option)) || null;
    /**
     * Cuántas puede marcar el cliente en un grupo de varias (toppings, colores): un número o uno por tamaño, como los
     * costos (`maxSelection: { "caja-x3": 3, "caja-x16": 4 }`). Un tamaño sin número deja elegir una.
     */
    function maxOf(product, option, selection) {
        const max = option.maxSelection;
        if (typeof max === 'number') return Number.isInteger(max) && max > 0 ? max : 1;
        const size = sizeOption(product);
        const value = max && typeof max === 'object' && size ? max[selection[size.id]] : undefined;
        return Number.isInteger(value) && value > 0 ? value : 1;
    }
    // Cómo se llaman las opciones de un grupo de varias, para decir cuántas se eligen.
    const nounOf = option => /color/i.test(option.label || '') ? ['un color', 'colores'] : /sabor|topping/i.test(option.label || '') ? ['un sabor', 'sabores'] : ['una opción', 'opciones'];
    /** «Elige hasta 3 sabores.» o «Elige un sabor.», según el tamaño elegido. */
    function maxText(product, option, selection) {
        const n = maxOf(product, option, selection), [one, many] = nounOf(option);
        return n === 1 ? `Elige ${one}.` : `Elige hasta ${n} ${many}.`;
    }
    /** Costo adicional de una elección con la selección actual: un número fijo o el del tamaño elegido. */
    function extraOf(product, choice, selection) {
        if (typeof choice?.extra === 'number') return choice.extra;
        if (!choice?.extra || typeof choice.extra !== 'object') return undefined;
        const size = sizeOption(product);
        return size ? choice.extra[selection[size.id]] : undefined;
    }
    function options(product) { return (product.options || []).filter(option => !quoteOnly(product) || !priced(option)); }
    function choices(product, selection) { return options(product).filter(option => visible(option, selection)); }
    /**
     * Precio unitario de una selección. Recorre las opciones visibles en orden: la última elección con
     * precio fija el valor; una elección sin precio (vacía en el panel) lo deja en «Cotiza por WhatsApp»
     * hasta que otra posterior lo fije; `multiplier` multiplica por la cantidad elegida; los
     * interruptores suman `priceModifier` y cada elección elegida suma su `extra`. Devuelve null si no hay precio y NaN si la selección es inválida.
     */
    // Un importe de $0 cuenta como sin precio, igual que en la tarjeta: se cotiza por WhatsApp.
    const amount = value => typeof value === 'number' && value > 0 ? value : null;
    function price(product, selection) {
        let result = amount(product.price);
        // La cantidad elegida (galletas × 6) multiplica al final, para que los costos adicionales también sean por unidad.
        let units = 1;
        for (const option of choices(product, selection)) {
            if (option.type === 'toggle') continue;
            if (option.multiplier) {
                units *= Number(selection[option.id]);
                continue;
            }
            const selected = option.choices?.find(choice => choice.value === selection[option.id]);
            if (selected && Object.hasOwn(selected, 'price')) result = amount(selected.price);
        }
        if (result === null) return null;
        // Costo adicional de cada elección (relleno premium, adicional), el del tamaño elegido. En los adicionales, uno
        // sin precio para ese tamaño se cotiza por WhatsApp; en lo demás, vacío es sin costo.
        for (const option of choices(product, selection)) {
            if (option.type === 'toggle') continue;
            for (const value of [].concat(selection[option.id] ?? [])) {
                const choice = option.choices?.find(c => c.value === value);
                const extra = amount(extraOf(product, choice, selection));
                if (extra !== null) result += extra;
                else if (option.addons && choice) return null;
            }
        }
        result *= units;
        for (const option of choices(product, selection)) {
            if (option.type === 'toggle' && selection[option.id] === true && typeof option.priceModifier === 'number') result += option.priceModifier;
        }
        return Number.isSafeInteger(result) && result >= 0 ? result : NaN;
    }
    /** La selección se cotiza por WhatsApp: producto a cotizar o elección sin precio. */
    const quote = (product, selection) => quoteOnly(product) || price(product, selection) === null;
    const minimum = product => Number.isInteger(product.minimum) && product.minimum > 0 ? product.minimum : 1;
    const maximum = 99;
    /** Precio mínimo y máximo entre todas las combinaciones con precio; null si ninguna lo tiene. */
    function range(product) {
        if (quoteOnly(product)) return null;
        const single = (product.options || []).filter(o => !o.multiple && (o.type === 'toggle' || o.choices?.length));
        let combos = [{}];
        for (const option of single) {
            const values = option.type === 'toggle' ? [false, true] : option.choices.map(c => c.value);
            combos = combos.flatMap(combo => values.map(value => ({ ...combo, [option.id]: value })));
            if (combos.length > 20000) throw new Error(`Demasiadas combinaciones en ${product.id}`);
        }
        const prices = combos.map(selection => price(product, { ...defaults(product), ...selection })).filter(p => Number.isSafeInteger(p) && p > 0);
        return prices.length ? { min: Math.min(...prices), max: Math.max(...prices), minimum: minimum(product) } : null;
    }
    /** Precio de la tarjeta: «$22.000», «Desde $65.000», rango de un extra o «Cotiza por WhatsApp». */
    function priceLabel(product) {
        const suffix = product.priceSuffix ? ` ${product.priceSuffix}` : '';
        if (quoteOnly(product)) {
            // Vitrina de adicionales: el texto que escribe el negocio («De $2.000 a $5.000 según el tamaño»).
            const free = typeof product.priceText === 'string' ? product.priceText.trim() : '';
            if (free) return { from: false, amount: free, text: free };
            if (typeof product.price !== 'number' || product.price <= 0) return { from: false, amount: 'Cotiza por WhatsApp', text: 'Cotiza por WhatsApp' };
            const amount = typeof product.priceMax === 'number' && product.priceMax > product.price ? `${money(product.price)} - ${money(product.priceMax)}` : money(product.price);
            return { from: false, amount, text: amount };
        }
        const values = range(product);
        if (!values) return { from: false, amount: 'Cotiza por WhatsApp', text: 'Cotiza por WhatsApp' };
        const from = values.max > values.min;
        const amount = money(values.min) + suffix;
        return { from, amount, text: from ? `Desde ${amount}` : amount };
    }
    /**
     * Importe para un texto de la página (`data-price`): «id» es el precio mínimo del producto,
     * «id?opcion=valor» el de esa elección y «@categoria,otra» el pedido mínimo de esas categorías.
     */
    function priceRef(ref) {
        const text = String(ref || '').trim();
        if (text.startsWith('@')) {
            const categories = text.slice(1).split(',').map(c => c.trim());
            const totals = all().filter(p => categories.includes(p.category)).map(range).filter(Boolean).map(r => r.min * r.minimum);
            return totals.length ? Math.min(...totals) : null;
        }
        const [id, query = ''] = text.split('?');
        const product = get(id);
        if (!product) return null;
        if (!query) return range(product)?.min ?? null;
        const selection = { ...defaults(product), ...Object.fromEntries(query.split('&').map(pair => pair.split('='))) };
        const value = price(product, selection);
        return Number.isSafeInteger(value) && value > 0 ? value : null;
    }
    const priceRefText = ref => { const value = priceRef(ref); return value === null ? 'precio a consultar' : money(value); };
    // Lo que va escrito en una torta (mensaje, frase, número, letras) no se escribe en la web: se acuerda con Lauren
    // en la asesoría. Vale para las tortas y para todo campo que hable de la torta (la frase de «Detalle torta»).
    const TORTA_MESSAGE = 'La frase, el número o las letras de tu torta los acordamos contigo en la asesoría por WhatsApp.';
    const plainText = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const onCake = field => /\btorta\b/.test(plainText(field.label));
    const allFields = product => product.personalization?.enabled ? (product.personalization.fields || [{ ...product.personalization, id: product.personalization.field || 'mensaje' }]) : [];
    /** El aviso de la asesoría si el producto lleva algo escrito en una torta; si no, vacío. */
    const advice = product => product?.category === 'tortas' || allFields(product || {}).some(onCake) ? TORTA_MESSAGE : '';
    function fields(product, selection) {
        if (product.category === 'tortas') return [];
        const config = product.personalization;
        if (!config?.enabled || (config.dependsOn && !selection[config.dependsOn])) return [];
        return allFields(product).filter(field => !onCake(field));
    }
    function validate(product, selection, personal = {}) {
        const errors = [];
        for (const option of choices(product, selection)) {
            const value = selection[option.id];
            if (option.type === 'toggle') {
                if (typeof value !== 'boolean') errors.push({ id: option.id, message: 'Revisa esta opción.' });
                continue;
            }
            const selected = Array.isArray(value) ? value : value ? [value] : [];
            if (option.required && !selected.length) errors.push({ id: option.id, message: 'Selecciona una opción para continuar.' });
            if (selected.some(v => !option.choices.some(c => c.value === v)) || (!option.multiple && selected.length > 1)) errors.push({ id: option.id, message: 'Selecciona una opción del catálogo.' });
            if (option.multiple && !option.addons && selected.length > maxOf(product, option, selection)) errors.push({ id: option.id, message: maxText(product, option, selection).replace('Elige', 'Puedes elegir') });
            if (option.addons && selected.length > (option.maxSelection || 1)) errors.push({ id: option.id, message: `Puedes elegir hasta ${option.maxSelection || 1} opciones.` });
        }
        for (const field of fields(product, selection)) {
            const value = String(personal[field.id] || '').trim();
            if (field.required && !value) errors.push({ id: field.id, message: 'Completa este campo para personalizar tu pedido.' });
            if (value.length > (field.maxLength || 100)) errors.push({ id: field.id, message: `Usa máximo ${field.maxLength || 100} caracteres.` });
            if (field.id === 'iniciales' && value && [...value].length !== field.maxLength) errors.push({ id: field.id, message: `Escribe las ${field.maxLength} iniciales que llevará el detalle.` });
        }
        return errors;
    }
    function summary(product, selection) {
        // El interruptor que activa la personalización se omite: el texto escrito ya lo expresa.
        return Object.fromEntries(choices(product, selection).filter(option => {
            if (option.id === product.personalization?.dependsOn) return false;
            const value = selection[option.id];
            return Array.isArray(value) ? value.length : value !== false && value !== '' && value !== undefined && value !== null;
        }).map(option => {
            const value = selection[option.id];
            const selected = Array.isArray(value) ? value : [value];
            return [option.label, option.type === 'toggle' ? 'Sí' : selected.map(v => option.choices.find(c => c.value === v)?.label || '').join(', ')];
        }));
    }
    // Etiqueta sin aclaraciones de formulario: «Mensaje personalizado (opcional)» → «Mensaje personalizado».
    const shortLabel = label => label.replace(/\s*\([^)]*\)$/, '');
    function personalText(product, selection, personal) {
        return fields(product, selection).filter(field => String(personal[field.id] || '').trim()).map(field => `${shortLabel(field.label)}: ${String(personal[field.id]).trim()}`).join('\n');
    }
    // Pedido personalizado: las tortas (diseño a mano) y todo producto con texto o tema propio.
    const custom = (product, personalization) => product?.category === 'tortas' || Boolean(personalization) || Boolean(advice(product));
    // Toda torta viaja a WhatsApp con su foto, para que Laura sepa cuál es (las subidas desde el panel ya traen su dirección completa).
    const photo = product => product?.category === 'tortas' && product.mainImage ? (product.mainImage.startsWith('https://') ? product.mainImage : `https://laurenreposteria.com${product.mainImage}`) : '';
    window.Catalog = { TORTA_MESSAGE, advice, ADDONS, sizeOption, extraOf, maxOf, maxText, get, all, FEATURED, featurable, featured, resolve: expand, photo, money, quoteOnly, quote, defaults, visible, priced, options, choices, price, range, priceLabel, priceRef, priceRefText, minimum, maximum, fields, validate, summary, personalText, custom };
})();
