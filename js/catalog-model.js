/** Reglas compartidas del catálogo. Los datos proceden de catalog-data.js; aquí no hay importes ni productos. */
(() => {
    'use strict';
    const money = value => '$' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);
    // Un producto oculto desde el centro de control no se muestra, no se pide y no se indexa.
    const shown = product => product.visible !== false;
    const get = id => Object.hasOwn(catalogData, id) && shown(catalogData[id]) ? catalogData[id] : null;
    const all = () => Object.values(catalogData).filter(shown);
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
    function options(product) { return (product.options || []).filter(option => !quoteOnly(product) || !priced(option)); }
    function choices(product, selection) { return options(product).filter(option => visible(option, selection)); }
    /**
     * Precio unitario de una selección. Recorre las opciones visibles en orden: la última elección con
     * precio fija el valor; una elección sin precio (vacía en el panel) lo deja en «Cotiza por WhatsApp»
     * hasta que otra posterior lo fije; `multiplier` multiplica por la cantidad elegida; los
     * interruptores suman `priceModifier`. Devuelve null si no hay precio y NaN si la selección es inválida.
     */
    function price(product, selection) {
        let result = typeof product.price === 'number' ? product.price : null;
        for (const option of choices(product, selection)) {
            if (option.type === 'toggle') continue;
            if (option.multiplier) {
                if (result !== null) result *= Number(selection[option.id]);
                continue;
            }
            const selected = option.choices?.find(choice => choice.value === selection[option.id]);
            if (selected && Object.hasOwn(selected, 'price')) result = typeof selected.price === 'number' ? selected.price : null;
        }
        if (result === null) return null;
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
            if (typeof product.price !== 'number' || product.price <= 0) return { from: false, amount: 'Precio en asesoría', text: 'Precio en asesoría' };
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
    function fields(product, selection) {
        const config = product.personalization;
        if (!config?.enabled || (config.dependsOn && !selection[config.dependsOn])) return [];
        return config.fields || [{ ...config, id: config.field || 'mensaje' }];
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
            if (option.multiple && selected.length > (option.maxSelection || 1)) errors.push({ id: option.id, message: `Puedes elegir hasta ${option.maxSelection || 1} opciones.` });
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
            return Array.isArray(value) ? value.length : value !== false && value !== '';
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
    const custom = (product, personalization) => product?.category === 'tortas' || Boolean(personalization);
    window.Catalog = { get, all, money, quoteOnly, quote, defaults, visible, priced, options, choices, price, range, priceLabel, priceRef, priceRefText, minimum, maximum, fields, validate, summary, personalText, custom };
})();
