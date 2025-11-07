/**
 * Modal Handler - Gestión centralizada de modales
 * Lauren Repostería 2024
 *
 * Maneja apertura/cierre de modales bloqueando/restaurando scroll del body
 */

const ModalHandler = {
    // Estado actual de scroll antes de abrir modal
    scrollPosition: 0,

    /**
     * Abre un modal y bloquea el scroll del body
     * @param {HTMLElement} modal - Elemento modal a abrir
     */
    open: function(modal) {
        if (!modal) return;

        // Guardar posición actual de scroll
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';

        // Mostrar modal
        modal.style.display = 'flex';
        modal.classList.add('active');

        // Focus en el modal para accesibilidad
        modal.setAttribute('aria-hidden', 'false');

        console.log('[ModalHandler] Modal abierto');
    },

    /**
     * Cierra un modal y restaura el scroll del body
     * @param {HTMLElement} modal - Elemento modal a cerrar
     */
    close: function(modal) {
        if (!modal) return;

        // Ocultar modal
        modal.style.display = 'none';
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');

        // Restaurar scroll del body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Restaurar posición de scroll
        window.scrollTo(0, this.scrollPosition);

        console.log('[ModalHandler] Modal cerrado, scroll restaurado');
    },

    /**
     * Cierra modal al hacer click fuera del contenido
     * @param {Event} event - Evento de click
     * @param {HTMLElement} modal - Elemento modal
     * @param {HTMLElement} content - Contenido del modal
     */
    closeOnOutsideClick: function(event, modal, content) {
        if (event.target === modal || !content.contains(event.target)) {
            this.close(modal);
        }
    },

    /**
     * Cierra modal con tecla Escape
     * @param {Event} event - Evento de teclado
     * @param {HTMLElement} modal - Elemento modal
     */
    closeOnEscape: function(event, modal) {
        if (event.key === 'Escape') {
            this.close(modal);
        }
    },

    /**
     * Inicializa un modal con sus controles
     * @param {Object} config - Configuración del modal
     * @param {string} config.modalId - ID del modal
     * @param {string} config.closeButtonId - ID del botón cerrar (opcional)
     * @param {string} config.contentId - ID del contenedor de contenido (opcional)
     */
    init: function(config) {
        const modal = document.getElementById(config.modalId);
        if (!modal) {
            console.warn(`[ModalHandler] Modal ${config.modalId} no encontrado`);
            return;
        }

        // Inicializar con aria-hidden
        modal.setAttribute('aria-hidden', 'true');

        // Botón cerrar
        if (config.closeButtonId) {
            const closeBtn = document.getElementById(config.closeButtonId);
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close(modal));
            }
        }

        // Click fuera del modal
        if (config.contentId) {
            const content = document.getElementById(config.contentId);
            modal.addEventListener('click', (e) => this.closeOnOutsideClick(e, modal, content));
        }

        // Tecla Escape
        document.addEventListener('keydown', (e) => this.closeOnEscape(e, modal));

        console.log(`[ModalHandler] Modal ${config.modalId} inicializado`);
    }
};

// Exportar para uso global
window.ModalHandler = ModalHandler;
