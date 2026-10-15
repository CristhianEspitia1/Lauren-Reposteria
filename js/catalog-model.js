/** Reglas compartidas del catálogo. Los importes proceden de catalog-data.js. */
(() => {
    'use strict';
    const money = value => '$' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);
    const get = id => Object.hasOwn(catalogData, id) ? catalogData[id] : null;
    const quoteOnly = product => product.category === 'extras' || product.quoteOnly === true;
    function visible(option, selection, product) {
        if (product.id === 'galletas' && ['sabor', 'cantidad'].includes(option.id)) return selection.presentacion === 'individual';
        if (!option.dependsOn) return true;
        const values = Array.isArray(option.showWhen) ? option.showWhen : [option.showWhen];
        return values.includes(selection[option.dependsOn]);
    }
    function defaults(product) {
        return Object.fromEntries((product.options || []).map(option => [option.id,
            option.type === 'toggle' ? false : option.multiple ? [] : option.choices?.[0]?.value || ''
        ]));
    }
    function options(product) { return (product.options || []).filter(option => !quoteOnly(product) || !option.choices?.some(choice => typeof choice.price === 'number')); }
    function choices(product, selection) { return options(product).filter(option => visible(option, selection, product)); }
    function price(product, selection) {
        const active = choices(product, selection);
        const choice = id => active.find(option => option.id === id)?.choices?.find(c => c.value === selection[id]);
        let result = product.price;
        if (product.id === 'galletas') {
            result = selection.presentacion === 'caja-surtida' ? choice('presentacion')?.price : choice('sabor')?.price * Number(selection.cantidad);
        } else if (product.id === 'brownies') {
            result = selection.presentacion === 'individual' ? choice('cantidad')?.price : choice('presentacion')?.price;
        } else {
            active.forEach(option => {
                const selected = choice(option.id);
                if (selected && typeof selected.price === 'number') result = selected.price;
            });
        }
        active.forEach(option => {
            if (option.type === 'toggle' && selection[option.id] === true && typeof option.priceModifier === 'number') result += option.priceModifier;
        });
        return Number.isSafeInteger(result) && result >= 0 ? result : NaN;
    }
    const minimum = product => product.id === 'alfajor-individual' ? 6 : 1;
    const maximum = 99;
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
    // Los diseños de Tortas viajan a WhatsApp con su foto, para que Laura sepa cuál es.
    const photo = product => product?.design ? `https://laurenreposteria.com${product.mainImage}` : '';
    window.Catalog = { get, all: () => Object.values(catalogData), money, quoteOnly, defaults, visible, options, choices, price, minimum, maximum, fields, validate, summary, personalText, custom, photo };
})();
