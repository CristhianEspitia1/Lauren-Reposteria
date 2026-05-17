// ========================================
// BOTÓN FLOTANTE DE CONTACTO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const contactFab = document.getElementById('contactFab');
    const contactMenu = document.getElementById('contactMenu');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const navMenuButton = document.querySelector('.nav-menu-btn');
    const navMenuDropdown = document.getElementById('mainNavMenu');

    if (contactFab && contactMenu) {
        contactFab.setAttribute('aria-expanded', 'false');

        contactFab.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = contactMenu.classList.toggle('active');
            contactFab.classList.toggle('active', isOpen);
            contactFab.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', (e) => {
            if (!contactFab.contains(e.target) && !contactMenu.contains(e.target)) {
                contactFab.classList.remove('active');
                contactMenu.classList.remove('active');
                contactFab.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactMenu.classList.contains('active')) {
                contactFab.classList.remove('active');
                contactMenu.classList.remove('active');
                contactFab.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (navMenuWrapper && navMenuButton && navMenuDropdown) {
        const closeNavMenu = () => {
            navMenuWrapper.classList.remove('is-open');
            navMenuButton.setAttribute('aria-expanded', 'false');
        };

        navMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenuWrapper.classList.toggle('is-open');
            navMenuButton.setAttribute('aria-expanded', String(isOpen));
        });

        navMenuDropdown.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeNavMenu);
        });

        document.addEventListener('click', (e) => {
            if (!navMenuWrapper.contains(e.target)) closeNavMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNavMenu();
        });
    }
});
