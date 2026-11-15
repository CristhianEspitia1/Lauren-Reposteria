/** Navegación, catálogos y galerías con contenido visible desde el inicio. */
(() => {
    'use strict';
    const { escape: esc, icon, imagePath, imageAttributes, wa } = LaurenUI;
    document.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = icon(element.dataset.icon); });
    document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
    const menuButton = document.getElementById('menuButton');
    const menu = document.getElementById('mobileNav');
    function toggleMenu(open) {
        menu.hidden = !open;
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        menuButton.innerHTML = icon(open ? 'close' : 'menu');
    }
    menuButton?.addEventListener('click', () => toggleMenu(menu.hidden));
    menu?.addEventListener('click', event => { if (event.target.closest('a')) toggleMenu(false); });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu && !menu.hidden) { toggleMenu(false); menuButton.focus(); }
    });
    document.addEventListener('click', event => {
        if (menu && !menu.hidden && !event.composedPath().includes(document.querySelector('.site-header'))) toggleMenu(false);
    });
    matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches && menu) toggleMenu(false); });

    function priceLabel(product) {
        const label = Catalog.priceLabel(product);
        return label.from ? `<span class="price-from">Desde</span> ${esc(label.amount)}` : esc(label.text);
    }
    // Las tarjetas compactas (tortas) solo llevan la frase corta si la tiene; nunca la descripción larga.
    function productCard(product, sizes, compact) {
        const quoted = Catalog.quoteOnly(product);
        const images = [...new Set([product.mainImage, ...(product.images || [])].filter(Boolean))];
        const label = images.length > 1 ? `Ver ${product.name}, ${images.length} diseños` : `Ver ${product.name}`;
        return `<article class="product-card"><button type="button" class="product-image" data-product="${esc(product.id)}" aria-label="${esc(label)}"><img ${imageAttributes(product.mainImage, sizes)} alt="${esc(product.name)}" width="600" height="680" loading="lazy" fetchpriority="low" decoding="async">${LaurenUI.moreDesigns(images)}<span class="product-open">${icon('diagonal')}</span></button><div class="product-meta"><h3><button type="button" class="product-name" data-product="${esc(product.id)}">${esc(product.name)}</button></h3><p class="product-price">${quoted ? 'A tu medida' : priceLabel(product)}</p></div>${compact ? (product.summary ? `<p class="product-description">${esc(product.summary)}</p>` : '') : `<p class="product-description">${esc(product.summary || product.description)}</p>`}<button type="button" class="text-link" data-product="${esc(product.id)}">${quoted ? 'Consultar diseño' : 'Elegir detalles'} ${icon('arrow')}</button></article>`;
    }
    // Cada sección lista sus categorías (`data-category`); la portada, los destacados (`data-featured`).
    const productsFor = grid => 'featured' in grid.dataset ? Catalog.featured() : Catalog.all().filter(p => grid.dataset.category.split(',').map(c => c.trim()).includes(p.category));
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    // Todo lo que sale del catálogo se vuelve a pintar si llega una versión nueva (catalog-live.js).
    const catalogRenders = [];
    // Cada parte se pinta por separado: si una falla con un dato raro, las demás se actualizan igual.
    document.addEventListener('catalog:updated', () => catalogRenders.forEach(render => { try { render(); } catch (error) { console.error(error); } }));
    document.querySelectorAll('[data-category], [data-featured]').forEach(grid => {
        let products = productsFor(grid);
        const scope = grid.closest('[data-catalog-section]') || grid.parentElement;
        const search = scope.querySelector('[data-product-search]');
        const filters = Array.from(scope.querySelectorAll('[data-filter]'));
        let filter = 'all';
        function render() {
            const searchText = normalize(search?.value.trim() || '');
            const visible = products.filter(p => (filter === 'all' || p.group === filter) && normalize([p.name, p.description, p.category].join(' ')).includes(searchText));
            const sizes = grid.classList.contains('two-columns') ? '(max-width: 600px) 90vw, (max-width: 1280px) 45vw, 584px' : grid.classList.contains('four-columns') ? '(max-width: 800px) 45vw, (max-width: 1280px) 22vw, 280px' : '(max-width: 800px) 45vw, (max-width: 1280px) 30vw, 384px';
            grid.innerHTML = visible.map(product => productCard(product, sizes, 'compact' in grid.dataset)).join('');
            const count = scope.querySelector('[data-result-count]');
            if (count) count.textContent = `${visible.length} ${visible.length === 1 ? 'creación para elegir' : 'creaciones para elegir'}`;
            const empty = scope.querySelector('[data-empty-results]');
            if (empty) empty.hidden = visible.length > 0;
        }
        filters.forEach(button => button.addEventListener('click', () => {
            filter = button.dataset.filter;
            filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
            render();
        }));
        search?.addEventListener('input', render);
        scope.querySelector('[data-reset-filters]')?.addEventListener('click', () => {
            filter = 'all'; if (search) search.value = '';
            filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'all')));
            render(); search?.focus();
        });
        render();
        catalogRenders.push(() => { products = productsFor(grid); render(); });
    });
    // «Un sabor para recordar» (Tortas): el HTML trae la lista del catálogo del repositorio; si llega otra versión
    // publicada, se vuelve a pintar con sus bizcochos y rellenos (js/flavors.js).
    const flavors = document.querySelector('[data-flavors]');
    if (flavors && window.LaurenFlavors) catalogRenders.push(() => {
        flavors.innerHTML = LaurenFlavors.html(imageAttributes, esc);
        document.querySelectorAll('[data-flavor-intro]').forEach(element => { element.textContent = LaurenFlavors.intro(); });
    });
    // Preguntas frecuentes: el HTML trae las del repositorio (js/faq-data.js); si llega otra versión publicada, se vuelven
    // a pintar (js/faqs.js). Una página sin preguntas no muestra la sección.
    const faqLists = document.querySelectorAll('[data-faqs]');
    const hideEmptyFaqs = () => faqLists.forEach(list => { list.closest('.faq-section').hidden = !list.querySelector('.faq-item'); });
    hideEmptyFaqs();
    if (faqLists.length && window.LaurenFaqs) catalogRenders.push(() => {
        faqLists.forEach(list => {
            list.innerHTML = LaurenFaqs.html(list.dataset.faqs);
            list.querySelectorAll('[data-icon]').forEach(element => { element.innerHTML = icon(element.dataset.icon); });
        });
        document.querySelectorAll('[data-faq-topics]').forEach(nav => { nav.innerHTML = LaurenFaqs.topicsHtml(); });
        hideEmptyFaqs();
    });
    // Filas parejas (bizcochos, rellenos, adicionales): cada cuadrícula sabe cuántos tiene (--n) para repartir sus filas.
    // Va por el CSSOM: la política de seguridad de la web no deja estilos escritos en el HTML.
    const balance = () => document.querySelectorAll('.flavor-grid, .filling-grid, .extras-grid').forEach(grid => grid.style.setProperty('--n', grid.children.length));
    // Importes dentro de textos («desde $58.000»): salen del catálogo vigente, no del HTML.
    const renderPrices = () => document.querySelectorAll('[data-price]').forEach(element => { element.textContent = Catalog.priceRefText(element.dataset.price); });
    renderPrices();
    catalogRenders.push(renderPrices);
    document.addEventListener('click', event => {
        const button = event.target.closest('[data-product]');
        if (button) window.quickView.open(button.dataset.product);
    });
    document.querySelectorAll('[data-extras]').forEach(grid => {
            const render = () => { const extras = Catalog.all().filter(p => p.category === 'extras'); grid.innerHTML = extras.map(p => `<article class="extra"><span class="extra-symbol" aria-hidden="true">${icon(p.icon || 'gift')}</span><h3>${esc(p.name)}</h3><p>${esc(Catalog.priceLabel(p).text)}</p><a class="text-link" href="${esc(wa(`Hola, Laura. Quisiera agregar ${Catalog.oneLine(p.name)} a mi torta. ¿Me ayudas a cotizarlo?`))}" target="_blank" rel="noopener noreferrer">Consultar ${icon('diagonal')}</a></article>`).join(''); };
        render();
        catalogRenders.push(render);
    });

    /*
     * Temporada (js/season.js): mientras el centro de control tenga una encendida, la portada abre con su sección
     * (`[data-season]`: etiqueta, titular, frase y sus productos, una fila a la vista) y cada persona ve su aviso
     * al entrar, una vez al día, en cualquier página. El aviso espera a leer lo publicado (catalog-live.js) para no
     * mostrar una temporada que ya se apagó. Dentro del marco de vista previa del centro de control, la página pinta
     * el borrador que le envía el panel y no abre el aviso por su cuenta.
     */
    const Season = window.LaurenSeason;
    if (Season) {
        const section = document.querySelector('[data-season]');
        const framed = window.parent !== window;
        const seasonal = () => Season.active() ? Catalog.all().filter(p => p.category === Season.CATEGORY) : [];
        // Adornos de cada temporada (manual de marca, sección 8): uno grande entre el titular y la frase, uno al final
        // del titular y diez pequeños en los márgenes de arriba y de abajo. Los coloca js/brand-decor.js.
        const DECOR = {
            navidad: ['icon:pine', 'icon:sparkle', ['icon:sparkle', 'icon:snowflake', 'icon:sparkle', 'icon:ornament', 'icon:snowflake']],
            'amor-y-amistad': ['icon:hearts', 'corazon', ['corazon']],
            'dia-de-la-madre': ['icon:flower', 'corazon', ['corazon', 'icon:flower', 'corazon']],
            halloween: ['icon:pumpkin', 'icon:sparkle', ['icon:moon', 'icon:sparkle', 'icon:candy', 'icon:sparkle', 'icon:ghost']],
            celebracion: ['icon:gift', 'corazon', ['corazon', 'icon:sparkle']]
        };
        // [x, y] en fracciones de la sección, tamaño, giro, color y si queda en el teléfono.
        const SPOTS = [[.03, .07, 16, -12, 'apricot', 1], [.2, .05, 13, 10, 'lilac'], [.44, .06, 15, -8, 'lilac', 1], [.68, .05, 20, 14, 'apricot'], [.9, .07, 14, -10, 'lilac', 1],
            [.975, .5, 13, 8, 'apricot'], [.08, .955, 14, 12, 'lilac'], [.33, .96, 17, -14, 'apricot', 1], [.6, .955, 13, 6, 'lilac'], [.86, .96, 22, -6, 'apricot', 1]];
        // Navidad («Luces»): las guirnaldas y las bolas van en CSS; abajo, sobre el verde menta, copos, pinos y chispas.
        const NAVIDAD = [[.04, 'icon:snowflake', 26, 'season-moss', 0, 1], [.22, 'icon:sparkle', 18, 'season-gold', 1], [.4, 'icon:pine', 30, 'season-green', 1], [.6, 'icon:snowflake', 22, 'season-moss', 0], [.78, 'icon:sparkle', 20, 'season-red', 1, 1], [.96, 'icon:pine', 36, 'season-green', 1, 1]];
        function decorate(id) {
            const [big, end, small] = DECOR[id] || DECOR.celebracion;
            section.decorItems = id === 'navidad' ? NAVIDAD.map(([x, graphic, w, c, fill, m]) => [graphic, { to: 'self', box: 1, at: [x, 1], d: [0, -1.2], w, c, m, fill, free: 1, reach: 60 }]) : [
                [big, { between: ['[data-season-title]', '[data-season-text]'], desk: 1, d: [0, 0], w: 76, thin: 1, m: 1, alt: [{ to: '.section-heading', box: 1, at: [1, 0], d: [-.5, .5] }] }],
                [end, { to: '[data-season-title]', end: 1, d: [1.2, -.1], w: 18, c: 'apricot', fill: 1, m: 1 }],
                ...SPOTS.map(([x, y, w, r, c, m], i) => [small[i % small.length], { to: 'self', box: 1, at: [x, y], d: [0, 0], w, r, c, m, fill: 1, free: 1, reach: 70 }])
            ];
            section.setAttribute('data-decor', '');
            section.dispatchEvent(new CustomEvent('decor:update', { bubbles: true }));
        }
        // Bolas de Navidad: cuelgan de la guirnalda en el centro del hueco entre el titular y la frase. Con un titular
        // largo (hueco angosto) cuelgan más corto, por encima del titular.
        const balls = section?.querySelector('[data-season-balls]');
        const textRange = document.createRange();
        function hang() {
            if (!balls || section.hidden) return;
            const box = section.getBoundingClientRect(), frame = section.querySelector('.container').getBoundingClientRect();
            const text = section.querySelector('[data-season-text]');
            textRange.selectNodeContents(section.querySelector('[data-season-title]'));
            const right = Math.max(frame.left, ...[...textRange.getClientRects()].map(rect => rect.right));
            const gap = (text.hidden ? frame.right : text.getBoundingClientRect().left) - right;
            balls.classList.toggle('is-short', gap < 170);
            balls.style.setProperty('--x', `${(gap < 170 ? frame.left + frame.width * .54 : right + gap / 2) - box.left}px`);
            // El vino llega hasta un poco más abajo del borde de arriba de las fotos; el resto es verde menta. Por ese borde
            // corre la segunda guirnalda, detrás de las tarjetas.
            const grid = section.querySelector('[data-season-grid]').getBoundingClientRect();
            section.style.setProperty('--split', `${grid.top - box.top + (narrow.matches ? 84 : 96)}px`);
        }
        if (section) new ResizeObserver(hang).observe(section);
        document.fonts?.ready.then(hang);
        // A la vista, una fila: cuatro productos, o dos en el teléfono (donde van de a dos por fila).
        const narrow = matchMedia('(max-width: 800px)');
        const limit = () => narrow.matches ? 2 : 4;
        let expanded = false, jumped = false;
        const title = (first, second) => [first && esc(first), second && `<em>${esc(second)}</em>`].filter(Boolean).join('<br>');
        function renderSeason() {
            if (!section) return;
            const season = Season.active();
            const products = seasonal();
            section.hidden = !products.length;
            if (!products.length) return;
            if (section.dataset.season !== season.id) expanded = false;
            const label = section.querySelector('[data-season-label]'), text = section.querySelector('[data-season-text]'), more = section.querySelector('.season-more');
            label.textContent = season.etiqueta; label.hidden = !season.etiqueta;
            section.querySelector('[data-season-title]').innerHTML = title(season.titulo, season.destacado);
            text.textContent = season.texto; text.hidden = !season.texto;
            section.querySelector('[data-season-grid]').innerHTML = (expanded ? products : products.slice(0, limit())).map(product => productCard(product, '(max-width: 800px) 45vw, (max-width: 1280px) 22vw, 280px', true)).join('');
            more.hidden = expanded || products.length <= limit();
            // En la vista previa del panel las fotos se piden de una vez: el marco no siempre avisa que ya se ven.
            if (window.catalogPreview) section.querySelectorAll('[data-season-grid] img').forEach(image => { image.loading = 'eager'; });
            if (section.dataset.season !== season.id) { section.dataset.season = season.id; decorate(season.id); }
            // Quien llega desde el aviso de otra página (/#temporada) queda en la sección, que se arma después de cargar.
            hang();
            if (!jumped && location.hash === '#temporada') { jumped = true; requestAnimationFrame(() => section.scrollIntoView()); }
        }
        section?.querySelector('[data-season-more]').addEventListener('click', () => {
            expanded = true; renderSeason();
            section.querySelectorAll('.product-card')[limit()]?.querySelector('.product-name').focus({ preventScroll: true });
        });
        narrow.addEventListener('change', () => renderSeason());
        renderSeason();
        catalogRenders.push(renderSeason);

        // Aviso de temporada: diálogo de la marca con el icono de la temporada, su titular en dos tiempos y un solo botón.
        const ACCENTS = { navidad: ['sparkle', 'ornament'], 'amor-y-amistad': ['heart', 'heart'], 'dia-de-la-madre': ['heart', 'sparkle'], halloween: ['moon', 'sparkle'], celebracion: ['heart', 'sparkle'] };
        let aviso = null;
        function openAviso(season) {
            if (!aviso) {
                aviso = Object.assign(document.createElement('dialog'), { id: 'seasonDialog', className: 'season-dialog' });
                aviso.setAttribute('aria-labelledby', 'seasonDialogTitle');
                document.body.append(aviso);
                LaurenUI.dialogEvents(aviso);
                aviso.addEventListener('click', event => {
                    const go = event.target.closest('[data-season-go]');
                    if (!go) return;
                    LaurenUI.close(aviso);
                    // En la portada, el botón baja a la sección sin recargar la página.
                    if (go.dataset.seasonGo === 'temporada' && section && !section.hidden) { event.preventDefault(); requestAnimationFrame(() => section.scrollIntoView()); }
                });
            }
            const photo = Season.avisoPhoto(season);
            const [key, , path] = Season.DESTINOS.find(([id]) => id === season.aviso.destino) || Season.DESTINOS[0];
            const outside = key === 'whatsapp';
            const href = outside ? wa('Hola, Laura. Vi el aviso en la web y quiero saber más.') : path;
            aviso.classList.toggle('has-photo', Boolean(photo));
            aviso.dataset.season = season.id;
            aviso.innerHTML = `<button class="icon-button dialog-close" type="button" data-close-dialog aria-label="Cerrar aviso">${icon('close')}</button><div class="season-dialog-layout">${photo ? `<img class="season-dialog-photo" ${imageAttributes(photo, '(max-width: 600px) 92vw, 340px')} alt="" width="720" height="900" decoding="async">` : ''}<div class="season-dialog-body"><span class="season-dialog-art" aria-hidden="true">${icon(season.icono)}${(ACCENTS[season.id] || ACCENTS.celebracion).map(name => `<span>${icon(name)}</span>`).join('')}</span>${season.etiqueta ? `<p class="eyebrow">${esc(season.etiqueta)}</p>` : ''}<h2 id="seasonDialogTitle">${title(season.aviso.titulo, season.aviso.destacado)}</h2>${season.aviso.texto ? `<p>${esc(season.aviso.texto)}</p>` : ''}<a class="btn" href="${esc(href)}" data-season-go="${esc(key)}"${outside ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(season.aviso.boton || 'Ver la colección')} ${icon(key === 'temporada' ? 'arrow' : 'diagonal')}</a></div></div>`;
            if (!aviso.open) LaurenUI.open(aviso);
        }
        // Una vez al día por persona: se anota al mostrarlo. Si el navegador no deja anotar, no se muestra (saldría en cada página).
        const SEEN = 'lauren-aviso-temporada';
        const seen = season => { try { const last = JSON.parse(localStorage.getItem(SEEN) || 'null'); return last?.id === season.id && last.dia === Season.today(); } catch { return true; } };
        const remember = season => { try { localStorage.setItem(SEEN, JSON.stringify({ id: season.id, dia: Season.today() })); return true; } catch { return false; } };
        function autoAviso() {
            const season = Season.active();
            if (framed || window.catalogPreview || document.body.dataset.page === 'error' || !season?.aviso.activo) return;
            if (!season.aviso.titulo && !season.aviso.destacado) return;
            // Si el botón lleva a la sección, tiene que haber sección; y nunca se abre encima de otro diálogo.
            if ((season.aviso.destino === 'temporada' && !seasonal().length) || document.querySelector('dialog[open]')) return;
            if (seen(season) || !remember(season)) return;
            openAviso(season);
        }
        const settled = new Promise(resolve => {
            if (window.catalogSettled) return resolve();
            document.addEventListener('catalog:settled', resolve, { once: true });
            setTimeout(resolve, 2500);
        });
        Promise.all([settled, new Promise(resolve => setTimeout(resolve, 1200))]).then(() => {
            if (!document.hidden) return autoAviso();
            document.addEventListener('visibilitychange', function show() {
                if (document.hidden) return;
                document.removeEventListener('visibilitychange', show);
                autoAviso();
            });
        });
        // Vista previa del centro de control: solo desde el propio sitio y desde la página que enmarca a esta.
        if (framed) window.addEventListener('message', event => {
            const message = event.data;
            if (event.origin !== location.origin || event.source !== window.parent || message?.lauren !== 'vista-temporada') return;
            if (!Catalog.wellFormed(message.catalogo) || !Season.valid(message.temporada)) return;
            // La vista previa se mira, no se usa: ningún toque abre un producto, cambia el pedido ni sale a otra página.
            if (!window.catalogPreview) document.addEventListener('click', click => { click.preventDefault(); click.stopImmediatePropagation(); }, true);
            window.catalogPreview = true;
            window.catalogData = message.catalogo;
            window.seasonData = message.temporada;
            document.dispatchEvent(new CustomEvent('catalog:updated'));
            const season = Season.active();
            if (message.ver === 'aviso' && season) return openAviso(season);
            if (aviso?.open) aviso.close();
            if (section && !section.hidden) section.scrollIntoView({ behavior: 'instant', block: 'start' });
            else scrollTo({ top: 0, behavior: 'instant' });
        });
    }

    balance();
    catalogRenders.push(balance);
    const lightbox = document.getElementById('lightboxDialog');
    LaurenUI.dialogEvents(lightbox);
    let lightboxItems = [];
    let lightboxIndex = 0;
    function renderLightbox() {
        const item = lightboxItems[lightboxIndex];
        lightbox.innerHTML = `<button class="icon-button dialog-close" type="button" data-close-dialog aria-label="Cerrar imagen">${icon('close')}</button><img class="lightbox-image" src="${esc(imagePath(item.src))}" alt="${esc(item.alt)}" width="720" height="900"><div class="lightbox-footer"><div><p id="lightboxTitle">${esc(item.alt)}</p><small>${lightboxIndex + 1} de ${lightboxItems.length} · Cada creación se hace a mano</small></div><div class="lightbox-controls"><button type="button" class="icon-button lightbox-prev" data-gallery-nav="-1" aria-label="Imagen anterior">${icon('arrow')}</button><button type="button" class="icon-button" data-gallery-nav="1" aria-label="Imagen siguiente">${icon('arrow')}</button></div><a class="text-link" target="_blank" rel="noopener noreferrer" href="${esc(wa('Hola, Laura. Quisiera cotizar un diseño inspirado en esta referencia: https://laurenreposteria.com' + item.src))}">Quiero algo así ${icon('diagonal')}</a></div>`;
    }
    lightbox.addEventListener('click', event => {
        const button = event.target.closest('[data-gallery-nav]');
        if (!button) return;
        const direction = Number(button.dataset.galleryNav);
        lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
        renderLightbox();
        lightbox.querySelector(`[data-gallery-nav="${direction}"]`).focus();
    });
    lightbox.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        lightboxIndex = (lightboxIndex + (event.key === 'ArrowLeft' ? -1 : 1) + lightboxItems.length) % lightboxItems.length;
        renderLightbox();
        lightbox.querySelector('[data-gallery-nav="1"]').focus();
    });
    document.querySelectorAll('[data-gallery]').forEach(grid => {
        const items = window.galleryData?.[grid.dataset.gallery] || [];
        // data-gallery-all muestra toda la galería; si no, de 8 en 8 con «Ver más creaciones».
        let shown = grid.hasAttribute('data-gallery-all') ? items.length : Math.min(8, items.length);
        const more = grid.parentElement.querySelector('[data-gallery-more]');
        function render() {
            const firstNew = grid.childElementCount;
            grid.insertAdjacentHTML('beforeend', items.slice(firstNew, shown).map((item, offset) => `<button class="gallery-button" type="button" data-gallery-index="${firstNew + offset}" aria-label="Ampliar: ${esc(item.alt)}"><img ${imageAttributes(item.src, '(max-width: 560px) 31vw, (max-width: 800px) 30vw, (max-width: 1280px) 22vw, 288px')} alt="${esc(item.alt)}" width="480" height="600" loading="${firstNew + offset < 8 ? 'eager' : 'lazy'}" fetchpriority="low" decoding="async"><span>${icon('zoom')}</span></button>`).join(''));
            if (more) more.hidden = shown >= items.length;
        }
        grid.addEventListener('click', event => {
            const button = event.target.closest('[data-gallery-index]');
            if (!button) return;
            lightboxItems = items; lightboxIndex = Number(button.dataset.galleryIndex);
            renderLightbox(); LaurenUI.open(lightbox);
        });
        more?.addEventListener('click', () => {
            const firstNew = shown;
            shown = Math.min(items.length, shown + 8); render();
            grid.querySelector(`[data-gallery-index="${firstNew}"]`)?.focus({ preventScroll: true });
        });
        render();
    });

    document.querySelectorAll('[data-video-control]').forEach(button => {
        const video = document.getElementById(button.dataset.videoControl);
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => { button.innerHTML = icon(video.paused ? 'play' : 'pause') + (video.paused ? 'Escuchar nuestra historia' : 'Pausar video'); button.setAttribute('aria-label', video.paused ? 'Reproducir historia de Lauren' : 'Pausar historia de Lauren'); };
        button.addEventListener('click', async () => {
            if (video.paused) {
                if (!video.src) video.src = video.dataset.src;
                try { await video.play(); } catch { LaurenUI.toast('No se pudo reproducir el video. Inténtalo de nuevo.'); }
            } else video.pause();
            update();
        });
        video.addEventListener('pause', update);
        video.addEventListener('ended', update);
        video.addEventListener('loadeddata', () => video.removeAttribute('aria-hidden'));
        const progress = document.getElementById('videoProgress');
        const timer = document.getElementById('videoTime');
        const sound = document.getElementById('videoSound');
        const fullscreen = document.getElementById('videoFullscreen');
        const time = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
        video.addEventListener('timeupdate', () => {
            if (progress && Number.isFinite(video.duration)) {
                progress.value = video.currentTime / video.duration * 100;
                progress.setAttribute('aria-valuetext', `${time(video.currentTime)} de ${time(video.duration)}`);
                timer.textContent = time(video.currentTime);
            }
        });
        progress?.addEventListener('input', () => {
            if (Number.isFinite(video.duration)) video.currentTime = video.duration * Number(progress.value) / 100;
        });
        sound?.addEventListener('click', () => {
            video.muted = !video.muted;
            sound.innerHTML = icon(video.muted ? 'muted' : 'sound');
            sound.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar video');
        });
        // El mismo reproductor se amplía sin depender de permisos de pantalla completa.
        const player = video.closest('.story-media');
        const slot = document.createElement('div');
        player.replaceWith(slot);
        slot.className = 'video-slot';
        slot.append(player);
        const expanded = document.createElement('dialog');
        expanded.className = 'video-dialog';
        expanded.setAttribute('aria-labelledby', 'videoDialogTitle');
        expanded.innerHTML = `<div class="video-dialog-heading"><h2 id="videoDialogTitle">El corazón de Lauren</h2><button type="button" class="icon-button" data-close-dialog aria-label="Cerrar video ampliado">${icon('close')}</button></div>`;
        document.body.append(expanded);
        expanded.addEventListener('close', () => {
            slot.append(player);
            slot.classList.remove('video-slot-empty');
            fullscreen.setAttribute('aria-label', 'Ampliar video');
        });
        LaurenUI.dialogEvents(expanded);
        fullscreen?.addEventListener('click', () => {
            if (expanded.open) { LaurenUI.close(expanded); return; }
            slot.classList.add('video-slot-empty');
            LaurenUI.open(expanded);
            expanded.append(player);
            fullscreen.setAttribute('aria-label', 'Reducir video');
        });
        document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
        reduced.addEventListener('change', () => { if (reduced.matches) video.pause(); });
        update();
    });

    /*
     * Foto que cambia (`data-photo-cycle`): la de Tortas en «Tú pones el motivo…» recorre, en orden aleatorio, las fotos
     * de las tortas visibles del catálogo (también las que se suben desde el centro de control), una cada 4 s con un
     * fundido. Se detiene con el cursor o el foco encima, fuera de pantalla, con la pestaña oculta y con movimiento
     * reducido (queda la foto fija). La siguiente foto se carga antes de mostrarse.
     */
    document.querySelectorAll('[data-photo-cycle]').forEach(frame => {
        const shown = frame.querySelector('img');
        if (!shown) return;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const card = frame.closest('a') || frame;
        const spare = shown.cloneNode();
        Object.assign(spare, { alt: '', loading: 'eager' });
        spare.classList.remove('is-shown');
        spare.removeAttribute('src');
        spare.removeAttribute('srcset');
        spare.setAttribute('aria-hidden', 'true');
        frame.append(spare);
        shown.dataset.photo = shown.getAttribute('src');
        let layers = [shown, spare], items = [], next = 0, timer = 0, onScreen = false, paused = false, busy = false;
        function collect() {
            const seen = new Set();
            items = Catalog.all().filter(p => p.category === frame.dataset.photoCycle)
                .flatMap(p => [p.mainImage, ...(p.images || [])].filter(Boolean).map(src => ({ src, alt: p.name })))
                .filter(item => !seen.has(item.src) && seen.add(item.src));
            for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
            next = 0;
        }
        // Con «ahorro de datos» activado en el teléfono, la foto queda fija.
        const running = () => items.length > 1 && onScreen && !paused && !document.hidden && !reduced.matches && !navigator.connection?.saveData;
        function schedule() { clearTimeout(timer); timer = running() && !busy ? setTimeout(advance, 4000) : 0; }
        async function advance() {
            const [current, incoming] = layers;
            let item = items[next++ % items.length];
            if (item.src === current.dataset.photo) item = items[next++ % items.length];
            busy = true;
            LaurenUI.setImageSource(incoming, item.src);
            try { await incoming.decode(); } catch { busy = false; schedule(); return; }
            busy = false;
            // Si se pausó mientras cargaba, esta foto se muestra al seguir.
            if (!running()) { next = Math.max(0, next - 1); schedule(); return; }
            Object.assign(incoming.dataset, { photo: item.src });
            incoming.alt = item.alt; incoming.removeAttribute('aria-hidden'); incoming.classList.add('is-shown');
            current.alt = ''; current.setAttribute('aria-hidden', 'true'); current.classList.remove('is-shown');
            layers = [incoming, current];
            schedule();
        }
        collect();
        catalogRenders.push(() => { collect(); schedule(); });
        ['mouseenter', 'focusin'].forEach(type => card.addEventListener(type, () => { paused = true; schedule(); }));
        ['mouseleave', 'focusout'].forEach(type => card.addEventListener(type, () => { paused = card.matches(':hover, :focus-within'); schedule(); }));
        document.addEventListener('visibilitychange', schedule);
        reduced.addEventListener('change', schedule);
        new IntersectionObserver(entries => { onScreen = entries[entries.length - 1].isIntersecting; schedule(); }).observe(frame);
    });

    /*
     * Lo último de Instagram (`data-instagram`): «Un poquito más de Lauren» muestra las cuatro publicaciones más nuevas
     * que trae el worker de fotos (worker/fotos/src/instagram.js). Los videos se reproducen solos y sin sonido; al
     * terminar, esa casilla pasa a otro video que no esté en otra casilla (si no queda otro, repite el suyo). Se pausan
     * fuera de pantalla, con la pestaña oculta y con «Pausar videos»; con movimiento reducido o «ahorro de datos» queda
     * su portada. Si el worker no responde o hay menos de cuatro publicaciones, quedan las fotos de la web.
     */
    document.querySelectorAll('[data-instagram]').forEach(async grid => {
        const api = grid.dataset.instagram;
        let posts = null;
        try {
            const response = await fetch(api, { signal: AbortSignal.timeout(8000) });
            if (response.ok) posts = (await response.json()).publicaciones;
        } catch { return; }
        posts = Array.isArray(posts) ? posts.filter(p => /^\d{1,40}$/.test(p?.id) && /^https:\/\/www\.instagram\.com\/[\w/.-]+$/.test(p.enlace)) : [];
        if (posts.length < 4) return;
        const videos = posts.filter(p => p.video);
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const allowed = () => !reduced.matches && !navigator.connection?.saveData;
        let onScreen = false, stopped = false, toggle = null;
        const running = () => allowed() && onScreen && !stopped && !document.hidden;

        function fill(tile, post) {
            const label = post.texto || 'Publicación de Lauren en Instagram';
            tile.post = post;
            tile.link.href = post.enlace;
            tile.link.setAttribute('aria-label', `Ver en Instagram: ${label}`);
            tile.image.src = `${api}/foto/${post.id}`;
            tile.image.alt = label;
            tile.video.classList.remove('is-playing');
            tile.video.removeAttribute('src');
            tile.video.load();
        }
        const tiles = posts.slice(0, 4).map(post => {
            const link = Object.assign(document.createElement('a'), { target: '_blank', rel: 'noopener noreferrer' });
            const image = Object.assign(document.createElement('img'), { width: 720, height: 900, loading: 'lazy', decoding: 'async' });
            image.setAttribute('fetchpriority', 'low');
            const video = Object.assign(document.createElement('video'), { muted: true, defaultMuted: true, playsInline: true, preload: 'none', disablePictureInPicture: true, tabIndex: -1 });
            ['muted', 'playsinline'].forEach(name => video.setAttribute(name, ''));
            video.setAttribute('aria-hidden', 'true');
            link.append(image, video);
            const tile = { link, image, video, post };
            fill(tile, post);
            video.addEventListener('playing', () => video.classList.add('is-playing'));
            video.addEventListener('error', () => { if (video.getAttribute('src')) { tile.failed = tile.post.id; video.classList.remove('is-playing'); } });
            video.addEventListener('ended', () => {
                const showing = new Set(tiles.map(t => t.post.id));
                const start = videos.indexOf(tile.post);
                const next = [...videos.slice(start + 1), ...videos.slice(0, Math.max(start, 0))].find(p => !showing.has(p.id));
                if (next) fill(tile, next);
                sync();
            });
            return tile;
        });

        function sync() {
            tiles.forEach(tile => {
                const { video, post } = tile;
                if (!post.video || tile.failed === post.id || !allowed()) { video.pause(); video.classList.remove('is-playing'); return; }
                if (!running()) { video.pause(); return; }
                if (!video.getAttribute('src')) video.src = `${api}/video/${post.id}`;
                video.play().catch(() => video.classList.remove('is-playing'));
            });
            if (!toggle) return;
            toggle.hidden = !allowed() || !tiles.some(t => t.post.video && t.failed !== t.post.id);
            // Las dos etiquetas ocupan el mismo sitio: cambiar de una a otra no mueve el botón.
            toggle.innerHTML = `<span class="swap-label"><span${stopped ? '' : ' data-off'}>Ver videos</span><span${stopped ? ' data-off' : ''}>Pausar videos</span></span>${icon(stopped ? 'play' : 'pause')}`;
        }
        grid.replaceChildren(...tiles.map(tile => tile.link));
        if (videos.length) {
            const actions = document.createElement('div');
            actions.className = 'social-actions';
            toggle = Object.assign(document.createElement('button'), { type: 'button', className: 'text-link' });
            toggle.addEventListener('click', () => { stopped = !stopped; sync(); });
            actions.append(toggle);
            grid.after(actions);
        }
        document.addEventListener('visibilitychange', sync);
        reduced.addEventListener('change', sync);
        new IntersectionObserver(entries => { onScreen = entries[entries.length - 1].isIntersecting; sync(); }, { threshold: 0.25 }).observe(grid);
        sync();
    });
})();
