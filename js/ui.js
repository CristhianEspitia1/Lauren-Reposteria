/** Utilidades de interfaz: iconos, texto seguro, diálogos y avisos. */
(() => {
    'use strict';
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const icon = name => window.LaurenIcons(name);
    const imagePath = value => typeof value === 'string' && /^\.\.\/assets\/(?:(?:optimized|propuestas-fotograficas)\/[a-z0-9/_.-]+\.(?:webp|png|jpg)|brand\/lauren-(?:logo|isotipo|sello|wordmark)(?:-light|-lilac)?\.svg)$/.test(value) && !value.slice(3).includes('..') ? value : '../assets/brand/lauren-isotipo.svg';
    function imageSources(value, sizes) {
        const src = imagePath(value);
        const width = window.LaurenImageWidths?.[src];
        if (!width) return { src };
        const name = src.split('/').pop().replace(/\.webp$/, '');
        const variants = [320, 640, 960].filter(size => size < width)
            .map(size => `../assets/propuestas-fotograficas/responsive/${name}-${size}.webp ${size}w`);
        return { sizes, srcset: [...variants, `${src} ${width}w`].join(', '), src };
    }
    const imageAttributes = (value, sizes) => Object.entries(imageSources(value, sizes))
        .map(([name, value]) => `${name}="${escape(value)}"`).join(' ');
    function setImageSource(image, value) {
        const sources = imageSources(value, image.getAttribute('sizes') || '100vw');
        if (!sources.srcset) { image.removeAttribute('srcset'); image.removeAttribute('sizes'); }
        Object.entries(sources).forEach(([name, value]) => image.setAttribute(name, value));
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
    function toast(message, action) {
        const notice = document.getElementById('toast');
        if (!notice) return;
        clearTimeout(toastTimer);
        notice.replaceChildren();
        const text = document.createElement('span');
        text.textContent = message;
        notice.append(text);
        if (action) {
            const button = document.createElement('button');
            button.type = 'button'; button.textContent = action.label;
            button.addEventListener('click', () => { action.run(); notice.hidden = true; });
            notice.append(button);
        }
        notice.hidden = false;
        toastTimer = setTimeout(() => { if (!notice.contains(document.activeElement)) notice.hidden = true; }, 6500);
    }
    window.LaurenUI = { escape, icon, imagePath, imageAttributes, setImageSource, wa, open, close, dialogEvents, toast };
})();
