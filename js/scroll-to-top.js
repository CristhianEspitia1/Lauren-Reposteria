// ========================================
// SCROLL TO TOP BUTTON - Standalone
// ========================================
(function() {
    'use strict';

    // Esperar a que el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        const scrollToTopBtn = document.getElementById('scrollToTop');

        if (!scrollToTopBtn) {
            console.warn('⚠️ Botón scroll-to-top no encontrado en el DOM');
            return;
        }

        console.log('✅ Botón scroll-to-top encontrado, inicializando...');

        // Mostrar/ocultar botón según scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });

        // Scroll suave al hacer click
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Efecto hover
        scrollToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.background = '#E8A77A';
            this.style.boxShadow = '0 8px 25px rgba(249, 181, 140, 0.6)';
        });

        scrollToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.background = '#F9B58C';
            this.style.boxShadow = '0 4px 15px rgba(249, 181, 140, 0.4)';
        });

        // Efecto active (cuando se hace click)
        scrollToTopBtn.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-2px)';
        });

        scrollToTopBtn.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-5px)';
        });

        console.log('✅ Scroll to Top activado correctamente');
    });
})();
