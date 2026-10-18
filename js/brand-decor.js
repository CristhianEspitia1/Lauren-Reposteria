/**
 * Sistema gráfico del brandbook (páginas 18–20): gráficos decorativos compuestos por sección.
 * Cada gráfico tiene una posición diseñada respecto a un elemento de su sección (la fila del título, el final de una
 * línea, la esquina de una foto). El script solo la ajusta lo justo para que el gráfico quede completo dentro de la
 * sección y sin tocar textos, fotos ni controles; si ahí no cabe, prueba su alternativa y, si tampoco, no se muestra.
 * Los sellos (stamp) se apoyan a propósito sobre la esquina de una foto, como el sello del hero.
 * Se recalcula al cambiar el tamaño de la ventana. Ver docs/06-guia-de-estilos.md.
 */
(() => {
    'use strict';
    const ratios = {
        rama: 41.5 / 61.1, corazon: 6.3 / 7.2, 'isotipo-circulo': 1, 'mucho-encanto': 69.7 / 12.2,
        'porcion-torta': 47.6 / 42.8, 'mano-flor': 40 / 80.2, brownie: 40.6 / 31.2, 'para-ti': 65.8 / 16.4,
        'dosis-de-encanto': 73.7 / 27, grateful: 40.5 / 29.6, reposteria: 53.3 / 19, 'sello-ovalado': 52 / 59.5
    };
    const colors = { lilac: 'var(--color-lilac)', white: 'var(--color-white)', apricot: 'var(--color-apricot)' };
    const page = document.body.dataset.page;
    const inspiration = { alfajores: ['mucho-encanto', 196], 'brownies-galletas': ['brownie', 116], detalles: ['para-ti', 172] }[page] || ['porcion-torta', 100];
    // Fila del título: el gráfico se alinea abajo a la derecha de la fila; si choca, sigue al final del título.
    const row = (w, extra = {}) => ({ to: '.section-heading', box: 1, at: [1, 1], d: [-.5, -.5], w, alt: { to: '.section-heading h2', end: 1, d: [.9, -.35] }, ...extra });
    /*
     * [gráfico, opciones]. to: elemento al que acompaña. box: usa su caja completa (si no, la de su texto y fotos);
     * end: el final de su última línea; between: [a, b] centra el gráfico en el hueco entre dos elementos de una fila.
     * at: punto de esa caja en fracciones [x, y]. d: desplazamiento del centro del gráfico, en tamaños del gráfico.
     * w: ancho en escritorio; desk: esa posición solo se usa en escritorio; r: giro; flip: espejo; c: color; m: también en móvil; stamp: sello con disco de ese color
     * sobre una foto; free: puede salir del ancho del contenido hacia los márgenes de la sección; reach: cuánto puede correrse
     * buscando hueco (px); to: 'self' ancla a la propia sección; alt: posiciones alternativas.
     * Criterio: cada sección reparte sus gráficos (nunca dos juntos), ningún adorno junto a un botón o enlace, y los
     * corazones solo al final de títulos donde suman sentido.
     */
    const layout = {
        '.home-hero': [
            ['corazon', { to: 'h1', end: 1, d: [1.1, -.5], w: 18, c: 'apricot', m: 1 }]
        ],
        '#colecciones': [
            ['porcion-torta', row(136, { m: 1 })],
            // La mano con flores, centrada en el hueco bajo la tarjeta de Tortas (48 px bajo su texto), antes de «Pedir tu torta…».
            // Solo escritorio; el hueco lo reserva .collections-section en css/site.css.
            ['mano-flor', { to: '.collection-featured > p', box: 1, at: [.5, 1], d: [0, .75], w: 96 }]
        ],
        '.process-section': [
            ['mucho-encanto', row(204, { d: [-.5, -.9], m: 1 })]
        ],
        // Complementos de Tortas («Los detalles hacen la diferencia»): el isotipo en el hueco entre el título y la frase;
        // en móvil, donde la frase va debajo del título, al final de la frase.
        '#complementos': [
            ['isotipo-circulo', { between: ['.section-heading h2', '.section-heading > p'], desk: 1, d: [0, 0], w: 84, c: 'white', m: 1, alt: [{ to: '.section-heading > p', end: 1, d: [.9, -.3] }] }]
        ],
        '.story-section': [
            ['corazon', { to: 'h2', end: 1, d: [1.2, -.1], w: 18, c: 'apricot', m: 1 }],
            ['dosis-de-encanto', { to: '.story-media', box: 1, at: [1, 1], d: [-.5, .9], w: 150, m: 1 }]
        ],
        '.faq-section': [
            // El sello va abajo a la izquierda (css/site.css); la rama, en diagonal, apoyada sobre la primera línea de las preguntas.
            ['rama', { to: '.faq-grid > div:last-child', box: 1, at: [1, 0], d: [-.5, -.62], w: 84, r: -80 }]
        ],
        'section:has(.social-heading)': [
            ['porcion-torta', { to: '.social-heading h2', at: [0, .5], d: [-.78, 0], w: 120, r: -8 }],
            ['brownie', { to: '.social-heading h2', at: [1, .5], d: [.78, 0], w: 116, r: 8 }]
        ],
        // El pie es la sección decorada (diseño «Confeti suave»): todos los dibujos de línea en pequeño y muchos
        // corazones, dispersos por todo el pie sin seguir líneas. Cada uno tiene su punto en fracciones del pie y,
        // si ahí toca un texto, un enlace o una línea, se corre al hueco libre más cercano.
        '.site-footer': [
            ['corazon', { to: '.footer-top h2', end: 1, d: [1.2, -.1], w: 18, c: 'white', m: 1 }],
            ...[
                ['isotipo-circulo', .855, .16, 60, 0], ['mucho-encanto', .66, .09, 120, -5], ['porcion-torta', .045, .2, 74, -10, 1],
                ['brownie', .962, .13, 70, 8, 1], ['rama', .47, .06, 40, -28], ['mano-flor', .958, .56, 38, 12, 1],
                ['sello-ovalado', .035, .63, 56, -6, 1], ['para-ti', .4, .6, 108, -4, 1], ['reposteria', .53, .82, 92, 6, 1],
                ['grateful', .92, .8, 58, -8, 1], ['rama', .07, .9, 34, 40, 1],
                ['mano-flor', .185, .32, 42, -10], ['rama', .8, .49, 44, -18]
            ].map(([g, x, y, w, r, m]) => [g, { to: 'self', box: 1, at: [x, y], d: [0, 0], w, r, c: 'white', free: 1, reach: 140, m }]),
            ...[
                [.02, .05, 11, -12, 'apricot'], [.12, .07, 9, 10], [.3, .05, 13, -8], [.6, .27, 10, 14, 'apricot'], [.76, .05, 12, -6],
                [.99, .33, 10, 12], [.93, .43, 14, -14, 'apricot'], [.06, .41, 10, 8], [.46, .44, 12, -10, 'apricot'], [.61, .56, 10, 12],
                [.37, .88, 11, -6], [.5, .95, 13, 10, 'apricot'], [.97, .93, 10, -10], [.15, .56, 9, 18, 'apricot'], [.67, .4, 11, -16],
                [.84, .96, 12, 8, 'apricot'], [.25, .7, 10, -12], [.44, .27, 9, 14], [.88, .63, 11, 10], [.21, .03, 10, -4, 'apricot']
            ].map(([x, y, w, r, c = 'white']) => ['corazon', { to: 'self', box: 1, at: [x, y], d: [0, 0], w, r, c, free: 1, reach: 70, m: 1 }])
        ],
        '.category-hero': [
            ['corazon', { to: 'h1', end: 1, d: [1.1, -.5], w: 18, c: 'apricot', m: 1 }],
            ['rama', { to: '.category-art img', box: 1, at: [0, 1], d: [-.62, -.45], w: 96, r: 12 }]
        ],
        '.catalog-section': [
            ['isotipo-circulo', { between: ['.section-heading h2', '.section-heading > p'], d: [0, 0], w: 80, m: 1, alt: [{ to: '.section-heading', box: 1, at: [1, 1], d: [-.5, -.5] }] }]
        ],
        '.category-banner': [
            ['para-ti', { between: ['.container > div', '.btn'], d: [0, 0], w: 150 }]
        ],
        '.flavor-section': [
            // Tortas: a la derecha de «Y en el corazón…»; Brownies y galletas: en la fila del título.
            ['mucho-encanto', { to: '.filling-list h3', box: 1, at: [1, .5], d: [-.5, 0], w: 196, c: 'white', m: 1, alt: [{ to: '.section-heading', box: 1, at: [1, 1], d: [-.5, -.9] }] }],
            ['corazon', { to: 'h2', end: 1, d: [1.2, -.1], w: 18, c: 'white', m: 1 }]
        ],
        '#inspiracion': [
            [inspiration[0], row(inspiration[1], { m: 1, between: ['.section-heading h2', '.section-heading > p'], alt: [{ to: '.section-heading', box: 1, at: [1, 1], d: [-.5, -.5] }, { to: '.section-heading h2', end: 1, d: [.9, -.35] }] })]
        ]
    };
    // Bloques que cuentan enteros como ocupados: adornos sin texto y tarjetas que son un enlace completo.
    const solid = '.eyebrow, .category-art, .footer-signature, .hero-seal, .hero-art figure, .collection';
    // Gráficos CSS dentro del flujo (ver css/site.css): [elemento, pseudoelemento, posición].
    const pseudo = [['.social-heading', '::before', 'top-center'], ['.faq-copy', '::after', 'bottom-left'], ['.story-section .editorial-copy', '::after', 'bottom-left']];
    const pictures = new Set(['IMG', 'VIDEO', 'PICTURE', 'CANVAS', 'IFRAME']);
    const controls = new Set(['svg', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA']);
    const INSET = 8, GAP = 14, STEP = 4;
    const mobile = matchMedia('(max-width: 800px)');
    const sections = [];

    Object.entries(layout).forEach(([selector, items]) => {
        document.querySelectorAll(selector).forEach(section => {
            section.classList.add('has-decor');
            const decor = items.map(([graphic, options]) => {
                const element = document.createElement('span');
                element.className = options.stamp ? 'decor decor-stamp' : 'decor';
                element.setAttribute('aria-hidden', 'true');
                element.hidden = true;
                element.style.setProperty('--g', `url(/assets/brand/sistema/${graphic}.svg)`);
                element.style.setProperty('--c', colors[options.c || 'lilac']);
                element.style.setProperty('--r', `${options.r || 0}deg`);
                if (options.flip) element.style.setProperty('--flip', '-1');
                if (options.stamp) element.style.setProperty('--stamp', colors[options.stamp]);
                section.prepend(element);
                return { element, ratio: options.stamp ? 1 : ratios[graphic], small: graphic === 'corazon', ...options };
            });
            sections.push({ section, decor });
        });
    });

    const range = document.createRange();
    // Cajas ocupadas de la sección, con su tipo: los sellos pueden apoyarse sobre fotos y fondos, nunca sobre texto.
    function obstaclesOf(section, origin) {
        const boxes = [];
        const add = (rect, kind) => { if (rect.width && rect.height) boxes.push([rect.left - origin.left, rect.top - origin.top, rect.right - origin.left, rect.bottom - origin.top, kind]); };
        const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
            acceptNode: node => node.textContent.trim() && !node.parentElement.closest('.decor') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        });
        while (walker.nextNode()) { range.selectNodeContents(walker.currentNode); [...range.getClientRects()].forEach(rect => add(rect, 'text')); }
        section.querySelectorAll('*').forEach(element => {
            if (element.classList.contains('decor') || (element.tagName !== 'svg' && element.closest('svg'))) return;
            if (pictures.has(element.tagName)) { add(element.getBoundingClientRect(), 'picture'); return; }
            if (controls.has(element.tagName) || element.matches('.btn') || element.matches(solid)) { add(element.getBoundingClientRect(), 'hard'); return; }
            const style = getComputedStyle(element);
            const box = element.getBoundingClientRect();
            if (style.backgroundImage !== 'none' || !/rgba\(0, 0, 0, 0\)|transparent/.test(style.backgroundColor)) { add(box, 'picture'); return; }
            // Un borde ocupa solo su línea, no toda la caja.
            const border = side => style[`border${side}Style`] !== 'none' ? parseFloat(style[`border${side}Width`]) : 0;
            const [top, right, bottom, left] = ['Top', 'Right', 'Bottom', 'Left'].map(border);
            if (top) add({ left: box.left, right: box.right, top: box.top, bottom: box.top + top, width: box.width, height: top }, 'line');
            if (bottom) add({ left: box.left, right: box.right, top: box.bottom - bottom, bottom: box.bottom, width: box.width, height: bottom }, 'line');
            if (left) add({ left: box.left, right: box.left + left, top: box.top, bottom: box.bottom, width: left, height: box.height }, 'line');
            if (right) add({ left: box.right - right, right: box.right, top: box.top, bottom: box.bottom, width: right, height: box.height }, 'line');
        });
        pseudo.forEach(([selector, which, position]) => section.querySelectorAll(selector).forEach(element => {
            const style = getComputedStyle(element, which);
            const w = parseFloat(style.width), h = parseFloat(style.height);
            if (style.display === 'none' || !w || !h) return;
            const box = element.getBoundingClientRect();
            const left = position === 'top-center' ? box.left + (box.width - w) / 2 : box.left;
            const top = position === 'top-center' ? box.top + parseFloat(style.marginTop || 0) : box.bottom - h - parseFloat(style.marginBottom || 0);
            add({ left, top, right: left + w, bottom: top + h, width: w, height: h }, 'hard');
        }));
        return boxes;
    }

    // Caja del contenido real (texto y fotos), para no anclar a la caja de un bloque más ancho que su texto.
    function contentRect(target) {
        range.selectNodeContents(target);
        const rects = [...range.getClientRects(), ...[...target.querySelectorAll('img, video, svg, button, .btn')].map(e => e.getBoundingClientRect())]
            .filter(r => r.width && r.height);
        if (!rects.length) return target.getBoundingClientRect();
        const left = Math.min(...rects.map(r => r.left)), top = Math.min(...rects.map(r => r.top));
        const right = Math.max(...rects.map(r => r.right)), bottom = Math.max(...rects.map(r => r.bottom));
        return { left, top, width: right - left, height: bottom - top };
    }

    function anchorOf(target, spot, origin, section) {
        if (spot.between) {
            const [a, b] = spot.between.map(selector => section.querySelector(selector));
            const left = contentRect(a), right = b.getBoundingClientRect();
            return [(left.left + left.width + right.left) / 2 - origin.left, (left.top + left.height / 2 + right.top + right.height / 2) / 2 - origin.top];
        }
        let rect = spot.box ? target.getBoundingClientRect() : contentRect(target);
        if (spot.end) {
            range.selectNodeContents(target);
            const lines = [...range.getClientRects()].filter(r => r.width && r.height);
            if (lines.length) {
                const last = lines[lines.length - 1];
                rect = { left: last.right, top: last.top, width: 0, height: last.height };
            }
        }
        const [ax, ay] = spot.at || [0, .5];
        return [rect.left - origin.left + ax * rect.width, rect.top - origin.top + ay * rect.height];
    }

    const hits = (a, b, gap) => a[0] < b[2] + gap && a[2] + gap > b[0] && a[1] < b[3] + gap && a[3] + gap > b[1];

    // Busca, cerca de la posición diseñada, el primer sitio libre para un gráfico de bw × bh.
    function findSpot(section, origin, spot, size, obstacles, placed, item) {
        const target = spot.to === 'self' ? section : section.querySelector(spot.to || (spot.between && spot.between[1]));
        if (!target || !target.getClientRects().length || (spot.between && !spot.between.every(selector => section.querySelector(selector)?.getClientRects().length))) return null;
        const frame = (section.querySelector('.container') || section).getBoundingClientRect();
        const free = item.stamp || spot.free;
        const minX = free ? INSET : Math.max(INSET, frame.left - origin.left), maxX = free ? origin.width - INSET : Math.min(origin.width - INSET, frame.right - origin.left);
        const [px, py] = anchorOf(target, spot, origin, section);
        const { bw, bh } = size;
        const cx = px + spot.d[0] * bw, cy = py + spot.d[1] * bh;
        const reach = item.reach || (item.small ? 48 : item.stamp ? 24 : 96);
        const blocking = obstacles.filter(o => (!item.stamp || o[4] === 'text' || o[4] === 'hard')
            && hits(o, [cx - reach - bw, cy - reach - bh, cx + reach + bw, cy + reach + bh], 0));
        let best = null;
        for (let y = Math.max(INSET, Math.floor(cy - bh / 2 - reach)); y + bh <= Math.min(origin.height - INSET, cy + bh / 2 + reach); y += STEP) {
            for (let x = Math.max(minX, Math.floor(cx - bw / 2 - reach)); x + bw <= Math.min(maxX, cx + bw / 2 + reach); x += STEP) {
                const distance = Math.hypot(x + bw / 2 - cx, y + bh / 2 - cy);
                if (distance > reach || (best && distance >= best[0])) continue;
                const box = [x, y, x + bw, y + bh];
                if (blocking.some(o => hits(box, o, GAP)) || placed.some(p => hits(box, p, GAP))) continue;
                best = [distance, x, y];
            }
        }
        return best;
    }

    function place({ section, decor }) {
        const origin = section.getBoundingClientRect();
        const obstacles = obstaclesOf(section, origin);
        const placed = [];
        decor.forEach(item => {
            const { element } = item;
            element.hidden = true;
            if (mobile.matches && !item.m) return;
            const scales = item.small ? [1] : mobile.matches ? [.66, .56] : [1, .88, .76];
            const spots = [item, ...[].concat(item.alt || [])].map(spot => ({ ...spot, to: spot.to || item.to }));
            for (const spot of spots) {
                if (spot.desk && mobile.matches) continue;
                for (const scale of scales) {
                    const w = item.w * scale, h = w / item.ratio;
                    const angle = Math.abs((item.r || 0) * Math.PI / 180);
                    const size = { bw: w * Math.cos(angle) + h * Math.sin(angle), bh: w * Math.sin(angle) + h * Math.cos(angle) };
                    const best = findSpot(section, origin, spot, size, obstacles, placed, item);
                    if (!best) continue;
                    const [, x, y] = best;
                    placed.push([x, y, x + size.bw, y + size.bh]);
                    element.style.setProperty('--w', `${w}px`);
                    element.style.setProperty('--h', `${h}px`);
                    element.style.setProperty('--x', `${x + (size.bw - w) / 2}px`);
                    element.style.setProperty('--y', `${y + (size.bh - h) / 2}px`);
                    element.hidden = false;
                    return;
                }
            }
        });
    }

    let timer = 0;
    const layoutAll = () => { clearTimeout(timer); timer = setTimeout(() => sections.forEach(place), 60); };
    layoutAll();
    const observer = new ResizeObserver(layoutAll);
    sections.forEach(({ section }) => observer.observe(section));
    addEventListener('load', layoutAll);
    document.fonts?.ready.then(layoutAll);
    document.addEventListener('toggle', layoutAll, true);
})();
