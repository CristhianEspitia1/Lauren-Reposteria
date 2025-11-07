/**
 * FOOTER ACCORDION - MOBILE ONLY
 * Funcionalidad de acordeón para el footer en dispositivos móviles
 * Solo se activa en pantallas menores a 768px
 */

(function() {
    'use strict';

    // Verificar si estamos en móvil
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Inicializar acordeón del footer
    function initFooterAccordion() {
        // Solo ejecutar en móvil
        if (!isMobile()) return;

        // Seleccionar las columnas que serán acordeones (Navegación y Más Información)
        const navigationColumn = document.querySelector('.footer-column:nth-child(2)');
        const informationColumn = document.querySelector('.footer-column:nth-child(4)');

        if (!navigationColumn || !informationColumn) {
            console.warn('Footer columns not found for accordion');
            return;
        }

        // Función para toggle de acordeón
        function toggleAccordion(column) {
            const isActive = column.classList.contains('active');

            if (isActive) {
                // Cerrar
                column.classList.remove('active');
            } else {
                // Abrir
                column.classList.add('active');
            }
        }

        // Agregar event listeners a los títulos
        const navTitle = navigationColumn.querySelector('.footer-column-title');
        const infoTitle = informationColumn.querySelector('.footer-column-title');

        if (navTitle) {
            navTitle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleAccordion(navigationColumn);
            });

            // Hacer que sea evidente que es clickeable
            navTitle.style.cursor = 'pointer';
            navTitle.setAttribute('role', 'button');
            navTitle.setAttribute('aria-expanded', 'false');
            navTitle.setAttribute('tabindex', '0');

            // Soporte para teclado (Enter y Space)
            navTitle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAccordion(navigationColumn);
                    navTitle.setAttribute('aria-expanded',
                        navigationColumn.classList.contains('active') ? 'true' : 'false'
                    );
                }
            });
        }

        if (infoTitle) {
            infoTitle.addEventListener('click', function(e) {
                e.preventDefault();
                toggleAccordion(informationColumn);
            });

            // Hacer que sea evidente que es clickeable
            infoTitle.style.cursor = 'pointer';
            infoTitle.setAttribute('role', 'button');
            infoTitle.setAttribute('aria-expanded', 'false');
            infoTitle.setAttribute('tabindex', '0');

            // Soporte para teclado (Enter y Space)
            infoTitle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAccordion(informationColumn);
                    infoTitle.setAttribute('aria-expanded',
                        informationColumn.classList.contains('active') ? 'true' : 'false'
                    );
                }
            });
        }

        console.log('✅ Footer accordion initialized for mobile');
    }

    // Reinicializar al cambiar tamaño de ventana
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Limpiar clases active si cambiamos a escritorio
            if (!isMobile()) {
                const columns = document.querySelectorAll('.footer-column');
                columns.forEach(col => col.classList.remove('active'));
            }
        }, 250);
    });

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooterAccordion);
    } else {
        initFooterAccordion();
    }

})();
