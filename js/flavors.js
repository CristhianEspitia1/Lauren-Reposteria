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
    function groups() {
        const source = Catalog.all().find(p => p.category === 'tortas' && !p.basedOn && p.options?.some(o => o.id === 'sabor' || o.id === 'relleno'));
        return Object.fromEntries(['sabor', 'relleno'].map(id => [id, source?.options.find(o => o.id === id)?.choices || []]));
    }
    // Primero las que coinciden por valor; después, por nombre. Cada foto se usa una sola vez.
    function withPhotos(id, choices) {
        const free = [...PHOTOS[id]];
        const found = choices.map(() => null);
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
        return `${text.charAt(0).toUpperCase()}${text.slice(1)} y tu combinación favorita.`;
    }
    /** Bizcochos y rellenos: fotos en su fila y, sin foto, «También: …». `image(src, sizes)` da los atributos de la foto. */
    function html(image, escape) {
        const all = groups();
        // Lo que cuesta más lo dice igual que la ficha: «Nutella · +$10.000».
        const label = choice => escape(choice.label) + (typeof choice.extra === 'number' && choice.extra > 0 ? ` · +${Catalog.money(choice.extra)}` : '');
        const more = list => list.length ? `<p class="flavor-more"><span>También:</span> ${list.map(({ choice }) => label(choice)).join(' · ')}</p>` : '';
        const sabor = withPhotos('sabor', all.sabor), relleno = withPhotos('relleno', all.relleno);
        const flavors = sabor.filter(item => item.photo).map(({ choice, photo }) => `<article class="flavor"><img ${image(photo.src, '(max-width: 600px) 45vw, (max-width: 1280px) 22vw, 282px')} alt="${escape(photo.alt)}" width="1536" height="1024" loading="lazy" fetchpriority="low" decoding="async"><h3>${label(choice)}</h3><p>${escape(photo.text)}</p></article>`).join('');
        const fillings = relleno.filter(item => item.photo).map(({ choice, photo }) => `<figure><img ${image(photo.src, '(max-width: 600px) 45vw, (max-width: 1280px) 18vw, 224px')} alt="${escape(photo.alt)}" width="1254" height="1254" loading="lazy" fetchpriority="low" decoding="async"><figcaption>${label(choice)}</figcaption></figure>`).join('');
        return [
            sabor.length ? `<h3 class="flavor-label">El bizcocho</h3>${flavors ? `<div class="flavor-grid">${flavors}</div>` : ''}${more(sabor.filter(item => !item.photo))}` : '',
            relleno.length ? `<div class="filling-list"><h3>El relleno</h3>${fillings ? `<div class="filling-grid">${fillings}</div>` : ''}${more(relleno.filter(item => !item.photo))}</div>` : ''
        ].join('');
    }
    window.LaurenFlavors = { PHOTOS, groups, withPhotos, intro, html };
})();
