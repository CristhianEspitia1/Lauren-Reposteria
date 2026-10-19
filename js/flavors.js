/**
 * «Un sabor para recordar» (Tortas): los bizcochos y rellenos del catálogo, los mismos que se eligen en la ficha
 * (los edita «Sabores y adicionales» del centro de control). Cada uno sale con su foto si la tiene; los que aún no
 * tienen foto van en una línea de texto debajo («También: …»). Lo usan el navegador (site.js) y el HTML publicado
 * (scripts/seo.mjs), para que la página nunca muestre una lista vieja.
 */
(() => {
    'use strict';
    // Fotos de sabores: cada una va con la elección que tiene su valor o, si no, la que lleva su nombre
    // («Mermelada de frutos rojos» usa la foto de frutos rojos).
    const PHOTOS = {
        sabor: [
            { key: 'chocolate', name: 'chocolate', src: '/assets/propuestas-fotograficas/sabor-chocolate.webp', alt: 'Bizcocho de chocolate', text: 'Intenso y perfecto para los amantes del cacao.' },
            { key: 'red-velvet', name: 'red velvet', src: '/assets/propuestas-fotograficas/sabor-red-velvet.webp', alt: 'Bizcocho red velvet', text: 'Un clásico suave con personalidad propia.' },
            { key: 'vainilla', name: 'vainilla', src: '/assets/propuestas-fotograficas/sabor-vainilla.webp', alt: 'Bizcocho de vainilla', text: 'Delicada y lista para combinar como quieras.' },
            { key: 'zanahoria', name: 'zanahoria', src: '/assets/propuestas-fotograficas/sabor-zanahoria-con-nueces.webp', alt: 'Bizcocho de zanahoria con nueces', text: 'Una textura especial en cada bocado.' }
        ],
        relleno: [
            { key: 'arequipe', name: 'arequipe', src: '/assets/propuestas-fotograficas/relleno-arequipe.webp', alt: 'Capas de bizcocho con arequipe' },
            { key: 'crema-queso', name: 'crema de queso', src: '/assets/propuestas-fotograficas/relleno-crema-queso.webp', alt: 'Capas de bizcocho con crema de queso' },
            { key: 'frutos-rojos', name: 'frutos rojos', src: '/assets/propuestas-fotograficas/relleno-frutos-rojos.webp', alt: 'Capas de bizcocho con frutos rojos' },
            { key: 'chocolate', name: 'chocolate', src: '/assets/propuestas-fotograficas/relleno-chocolate.webp', alt: 'Capas de bizcocho con chocolate' },
            { key: 'nutella', name: 'nutella', src: '/assets/propuestas-fotograficas/relleno-nutella.webp', alt: 'Capas de bizcocho con Nutella' }
        ]
    };
    const plain = text => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    // La primera torta visible que fija precios (Torta Vintage) tiene la lista de todas las tortas.
    // Una foto subida desde el centro de control para un sabor sirve aunque se haya subido en otra torta.
    function groups() {
        const tortas = Catalog.all().filter(p => p.category === 'tortas');
        const source = tortas.find(p => !p.basedOn && p.options?.some(o => o.id === 'sabor' || o.id === 'relleno'));
        const uploaded = id => new Map(tortas.flatMap(p => p.options?.find(o => o.id === id)?.choices || []).filter(c => c.image).map(c => [plain(c.label), c.image]));
        return Object.fromEntries(['sabor', 'relleno'].map(id => {
            const images = uploaded(id);
            return [id, (source?.options.find(o => o.id === id)?.choices || []).map(c => c.image || !images.has(plain(c.label)) ? c : { ...c, image: images.get(plain(c.label)) })];
        }));
    }
    // Primero las que coinciden por valor; después, por nombre. Cada foto se usa una sola vez.
    function withPhotos(id, choices) {
        const free = [...PHOTOS[id]];
        // Primero la foto subida para ese sabor; después, las de la web.
        const found = choices.map(choice => choice.image ? { key: 'subida', src: choice.image, alt: choice.label, text: '' } : null);
        const take = test => choices.forEach((choice, i) => {
            const index = found[i] ? -1 : free.findIndex(photo => test(photo, choice));
            if (index >= 0) found[i] = free.splice(index, 1)[0];
        });
        take((photo, choice) => photo.key === choice.value);
        take((photo, choice) => plain(choice.label).includes(photo.name));
        return choices.map((choice, i) => ({ choice, photo: found[i] }));
    }
    const NUMBERS = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
    const count = (n, one, many) => `${NUMBERS[n] || n} ${n === 1 ? one : many}`;
    /** Frase de la sección: «Cuatro bizcochos, siete rellenos y tu combinación favorita.» */
    function intro() {
        const { sabor, relleno } = groups();
        if (!sabor.length && !relleno.length) return 'Tu combinación favorita.';
        const text = [sabor.length && count(sabor.length, 'bizcocho', 'bizcochos'), relleno.length && count(relleno.length, 'relleno', 'rellenos')].filter(Boolean).join(', ');
        // Si alguno sube el precio de alguna torta, se dice aquí para que nadie se lleve una sorpresa.
        const extra = Catalog.all().filter(p => p.category === 'tortas').some(p => (p.options || []).some(o => ['sabor', 'relleno'].includes(o.id) && o.choices?.some(c => c.extra && (typeof c.extra === 'number' ? c.extra > 0 : Object.values(c.extra).some(v => v > 0)))));
        return `${text.charAt(0).toUpperCase()}${text.slice(1)} y tu combinación favorita.${extra ? ' Algunos tienen un valor adicional según el tamaño de la torta: lo ves al elegirla.' : ''}`;
    }
    /** Bizcochos y rellenos: fotos en su fila y, sin foto, «También: …». `image(src, sizes)` da los atributos de la foto. */
    function html(image, escape) {
        const all = groups();
        // Un costo fijo se dice como en la ficha («Nutella · +$10.000»); si cambia con el tamaño, se ve al abrir cada torta.
        const label = choice => escape(choice.label) + (typeof choice.extra === 'number' && choice.extra > 0 ? ` · +${Catalog.money(choice.extra)}` : '');
        const more = list => list.length ? `<p class="flavor-more"><span>También:</span> ${list.map(({ choice }) => label(choice)).join(' · ')}</p>` : '';
        const sabor = withPhotos('sabor', all.sabor), relleno = withPhotos('relleno', all.relleno);
        const flavors = sabor.filter(item => item.photo).map(({ choice, photo }) => `<article class="flavor"><img ${image(photo.src, '(max-width: 600px) 45vw, (max-width: 1280px) 22vw, 282px')} alt="${escape(photo.alt)}" width="1536" height="1024" loading="lazy" fetchpriority="low" decoding="async"><h3>${label(choice)}</h3>${photo.text ? `<p>${escape(photo.text)}</p>` : ''}</article>`).join('');
        const fillings = relleno.filter(item => item.photo).map(({ choice, photo }) => `<figure><img ${image(photo.src, '(max-width: 600px) 45vw, (max-width: 1280px) 18vw, 224px')} alt="${escape(photo.alt)}" width="1254" height="1254" loading="lazy" fetchpriority="low" decoding="async"><figcaption>${label(choice)}</figcaption></figure>`).join('');
        return [
            sabor.length ? `<h3 class="flavor-label">El bizcocho</h3>${flavors ? `<div class="flavor-grid" style="--n: ${sabor.filter(item => item.photo).length}">${flavors}</div>` : ''}${more(sabor.filter(item => !item.photo))}` : '',
            relleno.length ? `<div class="filling-list"><h3>El relleno</h3>${fillings ? `<div class="filling-grid" style="--n: ${relleno.filter(item => item.photo).length}">${fillings}</div>` : ''}${more(relleno.filter(item => !item.photo))}</div>` : ''
        ].join('');
    }
    window.LaurenFlavors = { PHOTOS, groups, withPhotos, intro, html };
})();
