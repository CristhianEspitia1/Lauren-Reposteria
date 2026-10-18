/** Utilidades de interfaz: iconos, texto seguro, diálogos y avisos. */
(() => {
    'use strict';
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const icon = name => window.LaurenIcons(name);
    // Fotos subidas desde el centro de control: las guarda y sirve el worker de fotos (worker/fotos), con su miniatura de 320 px. Igual que AdminModel.IMAGE.
    const uploaded = /^https:\/\/lauren-reposteria\.crizczi22\.workers\.dev\/f\/[a-z0-9-]{1,80}\.(?:webp|jpg)$/;
    const imagePath = value => typeof value === 'string' && (/^\/assets\/(?:(?:optimized|propuestas-fotograficas)\/[a-z0-9/_.-]+\.(?:webp|png|jpg)|brand\/lauren-(?:logo|isotipo|sello|wordmark)(?:-light)?\.svg)$/.test(value) || uploaded.test(value)) && !value.includes('..') ? value : '/assets/brand/lauren-isotipo.svg';
    function imageSources(value, sizes) {
        const src = imagePath(value);
        if (uploaded.test(src)) return { sizes, srcset: `${src.replace(/\.(webp|jpg)$/, '-320.$1')} 320w, ${src} 1440w`, src };
        const width = window.LaurenImageWidths?.[src];
        if (!width) return { src };
        const name = src.split('/').pop().replace(/\.webp$/, '');
        const variants = [320, 640, 960].filter(size => size < width)
            .map(size => `/assets/propuestas-fotograficas/responsive/${name}-${size}.webp ${size}w`);
        return { sizes, srcset: [...variants, `${src} ${width}w`].join(', '), src };
    }
    const imageAttributes = (value, sizes) => Object.entries(imageSources(value, sizes))
        .map(([name, value]) => `${name}="${escape(value)}"`).join(' ');
    function setImageSource(image, value) {
        const sources = imageSources(value, image.getAttribute('sizes') || '100vw');
        if (!sources.srcset) { image.removeAttribute('srcset'); image.removeAttribute('sizes'); }
        Object.entries(sources).forEach(([name, value]) => image.setAttribute(name, value));
    }
    /**
     * Fila de fotos (`.photo-strip`): miniaturas en una sola línea que se desplaza a lo ancho, con una
     * flecha translúcida a cada lado. Las flechas usan el icono `arrow` (la de atrás, en espejo).
     */
    const stripArrow = (step, label) => `<button type="button" class="photo-strip-arrow" data-strip-step="${step}" aria-label="${escape(label)}">${icon('arrow')}</button>`;
    // La elegida se centra en la fila; cerca de un extremo, la fila llega a su borde y se queda ahí. Bajo cada flecha
    // queda su espacio reservado, así que nunca tapa una miniatura, y la fila siempre avanza hacia donde se va.
    function centerInStrip(item, instant = false) {
        const track = item?.closest('.photo-strip-track');
        if (!track) return;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const max = track.scrollWidth - track.clientWidth;
        const left = Math.min(max, Math.max(0, item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2));
        track.scrollTo({ left, behavior: reduced || instant ? 'instant' : 'smooth' });
    }
    /** Las flechas solo hacen falta si las miniaturas no caben: si caben, se ocultan y la fila no reserva su espacio. */
    function fitStrip(strip) {
        if (!strip) return;
        strip.classList.remove('is-scrollable');
        const track = strip.querySelector('.photo-strip-track');
        strip.classList.toggle('is-scrollable', track.scrollWidth > track.clientWidth + 1);
    }
    /**
     * Miniaturas asomadas: abajo a la izquierda de la foto de una tarjeta asoman hasta tres fotos más del producto y una
     * píldora con cuántos diseños quedan («+12 diseños»). En tarjetas angostas asoman dos y la píldora dice solo «+13».
     */
    function moreDesigns(images) {
        const others = images.slice(1);
        if (!others.length) return '';
        const wide = others.length - 3, short = others.length - 2;
        const count = short > 0 ? `<span class="product-more-count${wide > 0 ? '' : ' is-short-only'}">${wide > 0 ? `<span class="product-more-wide">+${wide} ${wide === 1 ? 'diseño' : 'diseños'}</span>` : ''}<span class="product-more-short">+${short}</span></span>` : '';
        return `<span class="product-more" aria-hidden="true">${others.slice(0, 3).map(src => `<img ${imageAttributes(src, '40px')} alt="" width="34" height="42" loading="lazy" decoding="async">`).join('')}${count}</span>`;
    }
    const wa = text => `https://wa.me/573104442796?text=${encodeURIComponent(text)}`;
    const openers = new WeakMap();
    let toastTimer;
    function open(dialog) {
        const previous = document.querySelector('dialog[open]');
        openers.set(dialog, previous ? openers.get(previous) || document.activeElement : document.activeElement);
        document.querySelectorAll('dialog[open]').forEach(other => other.close());
        dialog.showModal();
        document.documentElement.classList.add('has-dialog');
        dialog.querySelector('.dialog-scroll')?.scrollTo(0, 0);
    }
    function close(dialog) { dialog.close(); }
    function dialogEvents(dialog) {
        dialog.addEventListener('click', event => {
            if (event.target === dialog) {
                const bounds = dialog.getBoundingClientRect();
                if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close(dialog);
            }
            if (event.target.closest('[data-close-dialog]')) close(dialog);
        });
        dialog.addEventListener('close', () => {
            if (!document.querySelector('dialog[open]')) {
                document.documentElement.classList.remove('has-dialog');
                const opener = openers.get(dialog);
                if (opener?.isConnected && !opener.closest('dialog:not([open])')) opener.focus({ preventScroll: true });
                else document.querySelector('[data-open-cart]')?.focus({ preventScroll: true });
            }
        });
    }
    // El aviso entra en la capa superior (popover) para verse también encima de un diálogo abierto.
    function toast(message, action) {
        const notice = document.getElementById('toast');
        if (!notice) return;
        const layered = 'showPopover' in notice;
        const hide = () => { if (layered && notice.matches(':popover-open')) notice.hidePopover(); notice.hidden = true; };
        clearTimeout(toastTimer);
        notice.replaceChildren();
        const text = document.createElement('span');
        text.textContent = message;
        notice.append(text);
        if (action) {
            const button = document.createElement('button');
            button.type = 'button'; button.textContent = action.label;
            button.addEventListener('click', () => { action.run(); hide(); });
            notice.append(button);
        }
        notice.hidden = false;
        if (layered) {
            notice.popover = 'manual';
            if (notice.matches(':popover-open')) notice.hidePopover();
            notice.showPopover();
        }
        toastTimer = setTimeout(() => { if (!notice.contains(document.activeElement)) hide(); }, 6500);
    }
    window.LaurenUI = { escape, icon, imagePath, imageAttributes, setImageSource, stripArrow, centerInStrip, fitStrip, moreDesigns, wa, open, close, dialogEvents, toast };
})();
