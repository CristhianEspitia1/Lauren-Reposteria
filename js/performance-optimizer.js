// Centralized progressive media loading for pages with large galleries.
(function () {
    const PLACEHOLDER =
        "data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2724%27%20height=%2724%27%20viewBox=%270%200%2024%2024%27%3E%3C/svg%3E";

    const loadImage = (img) => {
        if (!img || img.dataset.loaded === 'true') return;

        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }

        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
        }

        img.dataset.loaded = 'true';
    };

    const observeLazyImages = (root = document) => {
        const images = Array.from(root.querySelectorAll('img[data-src]'));
        if (images.length === 0) return;

        if (!('IntersectionObserver' in window)) {
            images.forEach(loadImage);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                loadImage(entry.target);
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: '180px 0px',
            threshold: 0.01
        });

        images.forEach((img) => observer.observe(img));
    };

    const prepareLazyImages = () => {
        document.querySelectorAll('img[data-src]').forEach((img) => {
            if (!img.getAttribute('src')) {
                img.setAttribute('src', PLACEHOLDER);
            }
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    };

    const refresh = (root = document) => {
        prepareLazyImages();
        observeLazyImages(root);
    };

    window.LaurenPerformanceOptimizer = { refresh, loadImage };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => refresh());
    } else {
        refresh();
    }
})();
