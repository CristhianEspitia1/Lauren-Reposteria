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
    document.addEventListener('catalog:updated', () => catalogRenders.forEach(render => render()));
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
    // Importes dentro de textos («desde $58.000»): salen del catálogo vigente, no del HTML.
    const renderPrices = () => document.querySelectorAll('[data-price]').forEach(element => { element.textContent = Catalog.priceRefText(element.dataset.price); });
    renderPrices();
    catalogRenders.push(renderPrices);
    document.addEventListener('click', event => {
        const button = event.target.closest('[data-product]');
        if (button) window.quickView.open(button.dataset.product);
    });
    document.querySelectorAll('[data-extras]').forEach(grid => {
        const render = () => { grid.innerHTML = Catalog.all().filter(p => p.category === 'extras').map(p => `<article class="extra"><span class="extra-symbol" aria-hidden="true">${icon(p.icon || 'gift')}</span><h3>${esc(p.name)}</h3><p>${esc(Catalog.priceLabel(p).text)}</p><a class="text-link" href="${esc(wa(`Hola, Laura. Quisiera agregar ${p.name} a mi torta. ¿Me ayudas a cotizarlo?`))}" target="_blank" rel="noopener noreferrer">Consultar ${icon('diagonal')}</a></article>`).join(''); };
        render();
        catalogRenders.push(render);
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
