// Función throttle para optimizar eventos de scroll
function throttle(func, wait) {
    let timeout;
    let lastRan;
    return function(...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                if ((Date.now() - lastRan) >= wait) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, wait - (Date.now() - lastRan));
        }
    };
}

// Smooth scroll para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animación de aparición al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar todas las tarjetas de productos
document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Observar secciones
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Efecto hover en las tarjetas de productos
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Resaltar el enlace activo - OPTIMIZADO con IntersectionObserver
(function initActiveNavTracking() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    if (!sections.length || !navLinks.length) return;

    // Cache: Mapear hrefs a links
    const linkMap = new Map();
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) linkMap.set(href.substring(1), link);
    });

    let currentActive = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const id = entry.target.getAttribute('id');
                const link = linkMap.get(id);

                if (link && currentActive !== link) {
                    if (currentActive) currentActive.classList.remove('active');
                    link.classList.add('active');
                    currentActive = link;
                }
            }
        });
    }, {
        threshold: [0.5],
        rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => observer.observe(section));
})();

// Animación del título hero
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        }
    };

    setTimeout(typeWriter, 500);
}

// Contador animado para precios (opcional)
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = '$' + Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Efecto parallax suave en el hero
window.addEventListener('scroll', throttle(() => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}, 16));

// Agregar clase cuando se pasa el mouse sobre price-items
document.querySelectorAll('.price-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Click en contacto de WhatsApp con tracking
document.querySelectorAll('.whatsapp').forEach(button => {
    button.addEventListener('click', function(e) {
        console.log('WhatsApp button clicked');
        // Aquí podrías agregar analytics si lo necesitas
    });
});

// Click en contacto de Instagram con tracking
document.querySelectorAll('.instagram').forEach(button => {
    button.addEventListener('click', function(e) {
        console.log('Instagram button clicked');
        // Aquí podrías agregar analytics si lo necesitas
    });
});

// ========================================
// MENÚ HAMBURGUESA
// ========================================
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle && mainNav) {
    // Toggle menu al hacer click en el botón
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');

        // Prevenir scroll cuando el menú está abierto
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }, 100));

    // Scroll suave al hacer click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// LAZY LOADING DE IMÁGENES
// ========================================
if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback para navegadores que no soportan lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    const images = document.querySelectorAll('img');
    images.forEach(img => imageObserver.observe(img));
}

// Mensaje de bienvenida en consola
console.log('%c¡Bienvenido al Catálogo Lauren! 🎂', 'color: #C8A5D8; font-size: 20px; font-weight: bold;');
console.log('%cRepostería artesanal desde 2022', 'color: #B08BBB; font-size: 14px;');

// Easter egg: Mensaje especial al hacer scroll hasta el final
let hasScrolledToBottom = false;
window.addEventListener('scroll', throttle(() => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !hasScrolledToBottom) {
        hasScrolledToBottom = true;
        console.log('%c¡Gracias por ver todo el catálogo! 💜', 'color: #C8A5D8; font-size: 16px;');
    }
}, 100));
