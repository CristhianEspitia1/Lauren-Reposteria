/**
 * Product Modal Simple - Quick View Restaurado
 * Lauren Repostería 2024
 * 
 * SOLO restaura funcionalidad, NO inventa datos
 * Requiere: modal-handler.js
 */

const ProductQuickView = {
    /**
     * Inicializa el sistema de Quick View
     */
    init: function () {
        // Inicializar modal con ModalHandler
        if (typeof ModalHandler !== 'undefined') {
            ModalHandler.init({
                modalId: 'productModalOverlay',
                closeButtonId: 'productModalClose',
                contentId: 'productModalContainer'
            });
        }

        // Event delegation global para clicks
        this.initEventDelegation();

        console.log('[ProductQuickView] Sistema restaurado');
    },

    /**
     * Event delegation global
     * Busca elementos con data-product-trigger
     */
    initEventDelegation: function () {
        document.addEventListener('click', (e) => {
            // Buscar elemento con data-product-trigger
            const trigger = e.target.closest('[data-product-trigger]');

            if (trigger) {
                e.preventDefault();

                // Obtener datos del elemento
                const productData = {
                    nombre: trigger.dataset.productName || trigger.textContent,
                    descripcion: trigger.dataset.productDesc || '',
                    precio: trigger.dataset.productPrice || '',
                    imagen: trigger.dataset.productImage || trigger.querySelector('img')?.src || '',
                    whatsapp: trigger.dataset.productWhatsapp || 'https://wa.me/573104442796'
                };

                this.open(productData);
            }
        });
    },

    /**
     * Abre el Quick View con datos proporcionados
     * @param {Object} data - Datos del producto
     */
    open: function (data) {
        if (!data) {
            console.warn('[ProductQuickView] No se proporcionaron datos');
            return;
        }

        // Actualizar contenido
        const titleEl = document.getElementById('productModalTitle');
        if (titleEl) titleEl.textContent = data.nombre || '';

        const descEl = document.getElementById('productModalDescription');
        if (descEl) {
            if (data.descripcion) {
                descEl.textContent = data.descripcion;
                descEl.style.display = 'block';
            } else {
                descEl.style.display = 'none';
            }
        }

        const priceEl = document.getElementById('productModalPrice');
        if (priceEl) {
            if (data.precio) {
                priceEl.textContent = data.precio;
                priceEl.style.display = 'block';
            } else {
                priceEl.style.display = 'none';
            }
        }

        const imageEl = document.getElementById('productModalMainImage');
        if (imageEl && data.imagen) {
            imageEl.src = data.imagen;
            imageEl.alt = data.nombre || 'Producto';
        }

        // Inyectar botón de carrito si no existe
        const ctaBtn = document.getElementById('productModalCTA');
        if (ctaBtn) {
            ctaBtn.href = data.whatsapp;

            // Buscar o crear botón de carrito
            let cartBtn = document.getElementById('simpleModalAddToCartBtn');
            if (!cartBtn) {
                cartBtn = document.createElement('button');
                cartBtn.id = 'simpleModalAddToCartBtn';
                cartBtn.className = 'product-modal-cta-btn';
                cartBtn.style.marginTop = '10px';
                cartBtn.style.background = 'linear-gradient(135deg, #b8a4d4 0%, #9d84c4 100%)';
                cartBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2z"/></svg>
                    Agregar al Carrito
                `;
                // Insertar después del botón de WhatsApp
                ctaBtn.parentNode.insertBefore(cartBtn, ctaBtn.nextSibling);
            }

            this.attachCartListener(cartBtn, data);
        }

        // Abrir modal
        const modal = document.getElementById('productModalOverlay');
        if (modal && typeof ModalHandler !== 'undefined') {
            ModalHandler.open(modal);
        }
    },

    /**
     * Adjunta listener al botón de carrito
     */
    attachCartListener: function (btn, data) {
        // Clonar para eliminar listeners previos
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Parsear precio (ej: "$50.000" -> 50000)
            let price = 0;
            if (data.precio) {
                price = parseInt(data.precio.replace(/[^0-9]/g, '')) || 0;
            }

            const cartItem = {
                id: 'simple-' + Date.now(), // ID temporal único
                name: data.nombre,
                price: price,
                image: data.imagen,
                quantity: 1,
                options: {}, // No hay opciones en modal simple
                personalization: ''
            };

            if (window.cartManager) {
                window.cartManager.addItem(cartItem);

                // Feedback visual
                const originalText = newBtn.innerHTML;
                newBtn.innerHTML = '✓ Agregado';
                newBtn.style.background = '#4CAF50';
                setTimeout(() => {
                    newBtn.innerHTML = originalText;
                    newBtn.style.background = 'linear-gradient(135deg, #b8a4d4 0%, #9d84c4 100%)';
                }, 2000);
            } else {
                console.error('[ProductQuickView] CartManager no disponible');
                alert('Error: El carrito no está disponible');
            }
        });
    }
};

// Inicializar al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ProductQuickView.init();
    });
} else {
    ProductQuickView.init();
}

// Exportar
window.ProductQuickView = ProductQuickView;
window.productModal = ProductQuickView; // Alias para compatibilidad
