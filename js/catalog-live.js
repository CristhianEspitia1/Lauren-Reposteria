/**
 * Catálogo en vivo: la página se pinta al instante con js/catalog-data.js y, en paralelo, lee la
 * versión que guardó el centro de control (Firestore, lectura pública). Si es distinta, la reemplaza
 * y avisa con el evento `catalog:updated` para que tarjetas, precios y pedido se actualicen.
 * Sin conexión o con un dato dañado, la web sigue con la copia local.
 */
(() => {
    'use strict';
    const source = 'https://firestore.googleapis.com/v1/projects/lauren-reposteria/databases/(default)/documents/catalogo/actual';
    const valid = data => data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0
        && Object.entries(data).every(([id, p]) => p && typeof p === 'object' && p.id === id && typeof p.name === 'string' && typeof p.category === 'string');
    // Antes de cambiar, se prueba que cada tarjeta pueda calcular su precio: un catálogo dañado no rompe la página.
    function usable(data) {
        const local = window.catalogData;
        try {
            window.catalogData = data;
            Catalog.all().forEach(product => { Catalog.priceLabel(product); Catalog.defaults(product); });
            return true;
        } catch { return false; }
        finally { window.catalogData = local; }
    }
    async function load() {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(source, { signal: controller.signal, cache: 'no-store', credentials: 'omit' });
            if (!response.ok) return;
            const text = (await response.json()).fields?.json?.stringValue;
            if (!text || text === JSON.stringify(window.catalogData)) return;
            const data = JSON.parse(text);
            if (!valid(data) || !usable(data)) return;
            window.catalogData = data;
            document.dispatchEvent(new CustomEvent('catalog:updated'));
        } catch { /* Se conserva la copia local. */ }
        finally { clearTimeout(timer); }
    }
    load();
})();
