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
    init: function() {
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
    initEventDelegation: function() {
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
    open: function(data) {
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

        const ctaBtn = document.getElementById('productModalCTA');
        if (ctaBtn) {
            ctaBtn.href = data.whatsapp;
        }

        // Ocultar secciones opcionales si no tienen datos
        const includesList = document.getElementById('productModalIncludesList');
        if (includesList) {
            includesList.closest('div')?.style.setProperty('display', 'none');
        }

        const optionsDiv = document.getElementById('productModalOptions');
        if (optionsDiv) {
            optionsDiv.style.display = 'none';
        }

        const personalizationDiv = document.getElementById('productModalPersonalization');
        if (personalizationDiv) {
            personalizationDiv.style.display = 'none';
        }

        // Abrir modal
        const modal = document.getElementById('productModalOverlay');
        if (modal && typeof ModalHandler !== 'undefined') {
            ModalHandler.open(modal);
        }
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
