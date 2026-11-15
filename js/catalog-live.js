/**
 * Catálogo en vivo: la página se pinta al instante con js/catalog-data.js y js/faq-data.js y, en paralelo, lee la
 * versión que guardó el centro de control (Firestore, lectura pública): el catálogo (`json`), las preguntas
 * frecuentes (`preguntas`) y la temporada (`temporada`). Si algo es distinto, lo reemplaza y avisa con el evento
 * `catalog:updated` para que tarjetas, precios, preguntas, temporada y pedido se actualicen. Al terminar, con cambios o
 * sin ellos, avisa con `catalog:settled`. Sin conexión o con un dato dañado, la web sigue con la copia local.
 */
(() => {
    'use strict';
    const source = 'https://firestore.googleapis.com/v1/projects/lauren-reposteria/databases/(default)/documents/catalogo/actual';
    // Cada producto con su forma (Catalog.wellFormed): una lista que llega como texto rompería la tarjeta o la ficha.
    const valid = data => window.Catalog.wellFormed(data);
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
    function catalog(text) {
        if (!text || text === JSON.stringify(window.catalogData)) return false;
        const data = JSON.parse(text);
        if (!valid(data) || !usable(data)) return false;
        window.catalogData = data;
        return true;
    }
    function faqs(text) {
        if (!text || !window.LaurenFaqs || text === JSON.stringify(window.faqData)) return false;
        const data = JSON.parse(text);
        if (!LaurenFaqs.valid(data)) return false;
        window.faqData = data;
        return true;
    }
    // La temporada (js/season.js): cuál está encendida, sus textos y su aviso.
    function season(text) {
        if (!text || !window.LaurenSeason || text === JSON.stringify(window.seasonData)) return false;
        const data = JSON.parse(text);
        if (!LaurenSeason.valid(data)) return false;
        window.seasonData = data;
        return true;
    }
    async function load() {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(source, { signal: controller.signal, cache: 'no-store', credentials: 'omit' });
            if (!response.ok) return;
            const fields = (await response.json()).fields;
            // En la vista previa del centro de control manda el borrador que envía el panel (site.js), no lo publicado.
            if (window.catalogPreview) return;
            let changed = false;
            // Primero la temporada: de ella depende qué productos de temporada cuentan al revisar el catálogo.
            try { changed = season(fields?.temporada?.stringValue); } catch { /* Se conserva la temporada local. */ }
            try { changed = catalog(fields?.json?.stringValue) || changed; } catch { /* Se conserva el catálogo local. */ }
            try { changed = faqs(fields?.preguntas?.stringValue) || changed; } catch { /* Se conservan las preguntas locales. */ }
            if (changed) document.dispatchEvent(new CustomEvent('catalog:updated'));
        } catch { /* Se conserva la copia local. */ }
        finally {
            clearTimeout(timer);
            // Con lo publicado ya leído (o sin poder leerlo), la página decide si muestra el aviso de temporada.
            window.catalogSettled = true;
            document.dispatchEvent(new CustomEvent('catalog:settled'));
        }
    }
    load();
})();
