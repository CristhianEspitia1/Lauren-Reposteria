/**
 * Product Modal - Lógica para modales de vista rápida de productos
 * Lauren Repostería 2024
 *
 * Requiere: modal-handler.js
 */

const ProductModal = {
    currentProduct: null,
    currentImageIndex: 0,

    /**
     * Inicializa el modal de producto
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

        // Event listeners para thumbnails
        this.initThumbnails();

        console.log('[ProductModal] Inicializado');
    },

    /**
     * Abre el modal con datos de un producto
     * @param {Object} product - Datos del producto
     */
    open: function(product) {
        if (!product) {
            console.error('[ProductModal] No se proporcionaron datos del producto');
            return;
        }

        this.currentProduct = product;
        this.currentImageIndex = 0;

        // Actualizar contenido del modal
        this.updateModalContent(product);

        // Abrir modal usando ModalHandler
        const modal = document.getElementById('productModalOverlay');
        if (modal && typeof ModalHandler !== 'undefined') {
            ModalHandler.open(modal);
        }
    },

    /**
     * Actualiza el contenido del modal con datos del producto
     * @param {Object} product - Datos del producto
     */
    updateModalContent: function(product) {
        // Título
        const titleEl = document.getElementById('productModalTitle');
        if (titleEl) titleEl.textContent = product.title || '';

        // Precio
        const priceEl = document.getElementById('productModalPrice');
        if (priceEl) priceEl.textContent = product.price || '';

        // Nota de precio (opcional)
        const priceNoteEl = document.getElementById('productModalPriceNote');
        if (priceNoteEl && product.priceNote) {
            priceNoteEl.textContent = product.priceNote;
            priceNoteEl.style.display = 'block';
        } else if (priceNoteEl) {
            priceNoteEl.style.display = 'none';
        }

        // Descripción
        const descEl = document.getElementById('productModalDescription');
        if (descEl) descEl.textContent = product.description || '';

        // Incluye (lista)
        const includesListEl = document.getElementById('productModalIncludesList');
        if (includesListEl && product.includes) {
            includesListEl.innerHTML = product.includes
                .map(item => `<li>${item}</li>`)
                .join('');
        }

        // Imágenes
        this.updateImages(product.images || []);

        // CTA Button (WhatsApp)
        const ctaBtn = document.getElementById('productModalCTA');
        if (ctaBtn && product.whatsappLink) {
            ctaBtn.href = product.whatsappLink;
        }
    },

    /**
     * Actualiza las imágenes del producto en el modal
     * @param {Array} images - Array de URLs de imágenes
     */
    updateImages: function(images) {
        if (!images || images.length === 0) return;

        // Imagen principal
        const mainImageEl = document.getElementById('productModalMainImage');
        if (mainImageEl) {
            mainImageEl.src = images[0];
            mainImageEl.alt = this.currentProduct?.title || 'Producto';
        }

        // Thumbnails
        const thumbnailsContainer = document.getElementById('productModalThumbnails');
        if (thumbnailsContainer && images.length > 1) {
            thumbnailsContainer.innerHTML = images
                .map((img, index) => `
                    <div class="product-modal-thumbnail ${index === 0 ? 'active' : ''}"
                         data-index="${index}"
                         role="button"
                         aria-label="Ver imagen ${index + 1}"
                         tabindex="0">
                        <img src="${img}" alt="Miniatura ${index + 1}" loading="lazy">
                    </div>
                `)
                .join('');

            // Reinicializar event listeners
            this.initThumbnails();
        }
    },

    /**
     * Inicializa event listeners para thumbnails
     */
    initThumbnails: function() {
        const thumbnails = document.querySelectorAll('.product-modal-thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => this.handleThumbnailClick(e));
            thumb.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleThumbnailClick(e);
                }
            });
        });
    },

    /**
     * Maneja el click en un thumbnail
     * @param {Event} event - Evento de click
     */
    handleThumbnailClick: function(event) {
        const thumbnail = event.currentTarget;
        const index = parseInt(thumbnail.dataset.index);

        if (isNaN(index)) return;

        // Actualizar imagen principal
        const mainImageEl = document.getElementById('productModalMainImage');
        const images = this.currentProduct?.images || [];

        if (mainImageEl && images[index]) {
            mainImageEl.src = images[index];
            this.currentImageIndex = index;

            // Actualizar clase active en thumbnails
            document.querySelectorAll('.product-modal-thumbnail').forEach(t => {
                t.classList.remove('active');
            });
            thumbnail.classList.add('active');
        }
    },

    /**
     * Cierra el modal de producto
     */
    close: function() {
        const modal = document.getElementById('productModalOverlay');
        if (modal && typeof ModalHandler !== 'undefined') {
            ModalHandler.close(modal);
        }
        this.currentProduct = null;
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ProductModal.init();
    });
} else {
    ProductModal.init();
}

// Exportar para uso global
window.ProductModal = ProductModal;
