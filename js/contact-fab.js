// ========================================
// BOTÓN FLOTANTE DE CONTACTO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const contactFab = document.getElementById('contactFab');
    const contactMenu = document.getElementById('contactMenu');

    if (contactFab && contactMenu) {
        // Toggle menú al hacer clic en el botón
        contactFab.addEventListener('click', (e) => {
            e.stopPropagation();
            contactFab.classList.toggle('active');
            contactMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!contactFab.contains(e.target) && !contactMenu.contains(e.target)) {
                contactFab.classList.remove('active');
                contactMenu.classList.remove('active');
            }
        });

        // Cerrar menú con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactMenu.classList.contains('active')) {
                contactFab.classList.remove('active');
                contactMenu.classList.remove('active');
            }
        });

        console.log('✅ Botón flotante de contacto inicializado');
    } else {
        console.warn('⚠️ El botón flotante de contacto no fue encontrado en el DOM');
    }
});
