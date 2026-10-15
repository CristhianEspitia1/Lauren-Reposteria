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

    const descriptions = {
        'torta-vintage': 'Bordes delicados, flores y un acabado hecho a mano.',
        'torta-sencilla': 'Líneas limpias y el sabor que más te gusta.',
        'caja-x6': 'Seis pequeños bocados de maicena y arequipe.',
        'caja-x12': 'Una docena de razones para compartir.',
        'vaso-minis': '30 mini alfajores en un vaso para regalar.',
        'alfajor-personalizado': 'Tu ocasión, convertida en un detalle comestible.',
        'torta-alfajor': 'Tres capas de arequipe para celebrar distinto.',
        'alfajor-individual': 'Tu presentación favorita, desde 6 unidades.',
        brownies: 'Chocolate al 70 %, Nutella y tus toppings favoritos.',
        galletas: 'Seis sabores. Un centro suave que lo dice todo.'
    };
    function priceLabel(text) {
        const match = /^desde\s+/i.exec(text);
        return match ? `<span class="price-from">Desde</span> ${esc(text.slice(match[0].length))}` : esc(text);
    }
    function productCard(product, sizes, compact) {
        const quoted = Catalog.quoteOnly(product);
        return `<article class="product-card"><button type="button" class="product-image" data-product="${esc(product.id)}" aria-label="Ver ${esc(product.name)}"><img ${imageAttributes(product.mainImage, sizes)} alt="${esc(product.name)}" width="600" height="680" loading="lazy" fetchpriority="low" decoding="async"><span class="product-open">${icon('diagonal')}</span></button><div class="product-meta"><h3><button type="button" class="product-name" data-product="${esc(product.id)}">${esc(product.name)}</button></h3><p class="product-price">${quoted ? 'A tu medida' : priceLabel(product.priceFormatted)}</p></div>${compact ? '' : `<p class="product-description">${esc(descriptions[product.id] || product.description)}</p>`}<button type="button" class="text-link" data-product="${esc(product.id)}">${quoted ? 'Consultar diseño' : 'Elegir detalles'} ${icon('arrow')}</button></article>`;
    }
    const groups = { osos: ['oso-pequeno', 'oso-grande', 'oso-fresas'], mix: ['detalle-brownie', 'detalle-hbd', 'detalle-margarita', 'detalle-mix-1', 'detalle-mix-2'], golden: ['detalle-golden-1', 'detalle-golden-2', 'detalle-golden-3', 'detalle-torta'], cajas: ['caja-x6', 'caja-x12', 'vaso-minis'], especiales: ['torta-alfajor', 'alfajor-personalizado', 'alfajor-individual'] };
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    document.querySelectorAll('[data-products]').forEach(grid => {
        const products = grid.dataset.products.split(',').map(id => Catalog.get(id.trim())).filter(Boolean);
        const scope = grid.closest('[data-catalog-section]') || grid.parentElement;
        const search = scope.querySelector('[data-product-search]');
        const filters = Array.from(scope.querySelectorAll('[data-filter]'));
        let filter = 'all';
        function render() {
            const searchText = normalize(search?.value.trim() || '');
            const visible = products.filter(p => (filter === 'all' || groups[filter]?.includes(p.id)) && normalize([p.name, p.description, p.category].join(' ')).includes(searchText));
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
    });
    document.addEventListener('click', event => {
        const button = event.target.closest('[data-product]');
        if (button) window.quickView.open(button.dataset.product, {
            selection: button.dataset.flavor ? { presentacion: 'individual', sabor: button.dataset.flavor } : undefined
        });
    });
    document.querySelectorAll('[data-extras]').forEach(grid => {
        grid.innerHTML = Catalog.all().filter(p => p.category === 'extras').map(p => `<article class="extra"><span class="extra-symbol" aria-hidden="true">${icon(p.icon || 'gift')}</span><h3>${esc(p.name)}</h3><p>${esc(p.priceFormatted)}</p><a class="text-link" href="${esc(wa(`Hola, Laura. Quisiera agregar ${p.name} a mi torta. ¿Me ayudas a cotizarlo?`))}" target="_blank" rel="noopener noreferrer">Consultar ${icon('diagonal')}</a></article>`).join('');
    });

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
})();
