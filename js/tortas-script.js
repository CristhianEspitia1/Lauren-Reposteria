// ========================================
// HERO VIDEO - Ya no se necesita carrusel
// ========================================
// El video se reproduce automáticamente con HTML5

// Animación de aparición al hacer scroll
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px 100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Siempre mostrar el elemento cuando sea visible
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Dejar de observar una vez que se hizo visible
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar tarjetas de precio
document.querySelectorAll('.price-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Observar tarjetas de info
document.querySelectorAll('.info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Observar tarjetas de sabores
document.querySelectorAll('.flavor-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Observar tarjetas de extras (PERSONALIZA)
document.querySelectorAll('.extra-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
    observer.observe(card);
});

// Observar tarjetas de información importante
document.querySelectorAll('.info-card-modern').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
    observer.observe(card);
});

// Observar CTA de información
document.querySelectorAll('.info-cta').forEach(cta => {
    cta.style.opacity = '0';
    cta.style.transform = 'scale(0.9)';
    cta.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s';
    observer.observe(cta);
});

// Observar pasos de intro
document.querySelectorAll('.intro-step').forEach((step, index) => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(40px)';
    step.style.transition = `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
    observer.observe(step);
});

// NO observar el ícono principal - debe estar visible desde el inicio
// document.querySelectorAll('.intro-icon-circle').forEach(icon => {
//     observer.observe(icon);
// });

// Observar header de inspiración
// DESHABILITADO: Causaba conflictos con el carrusel infinito
/*
document.querySelectorAll('.inspiration-header').forEach(header => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(30px)';
    header.style.transition = 'all 0.8s ease-out';
    observer.observe(header);
});
*/

// Observar cards de contacto
document.querySelectorAll('.contact-card-modern').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px) scale(0.95)';
    card.style.transition = `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
    observer.observe(card);
});

// Observar features de contacto
document.querySelectorAll('.contact-features').forEach(features => {
    features.style.opacity = '0';
    features.style.transform = 'translateY(40px)';
    features.style.transition = 'all 0.8s ease-out 0.4s';
    observer.observe(features);
});

// Observar corazón de contacto
document.querySelectorAll('.contact-heart').forEach(heart => {
    heart.style.opacity = '0';
    heart.style.transform = 'scale(0)';
    heart.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s';
    observer.observe(heart);
});

// Smooth scroll para enlaces
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

// DESHABILITADO COMPLETAMENTE: Este scroll listener causaba parpadeo en toda la página
// El problema era la manipulación constante de body.is-scrolling y el parallax en cada frame
/*
// Efecto parallax suave en el hero - OPTIMIZADO
let ticking = false;
let bodyHasScrollClass = false;

// CACHEAR elementos fuera del scroll listener para evitar querySelector en cada frame
const heroCarousel = document.querySelector('.hero-carousel') || document.querySelector('.hero-main-carousel');
const heroHeight = heroCarousel ? heroCarousel.offsetHeight : 0;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;

            // Solo aplicar parallax si existe el hero y estamos en su área
            if (heroCarousel && scrolled < heroHeight) {
                const parallaxSpeed = 0.3;
                // CRÍTICO: Usar translate3d para aceleración GPU
                heroCarousel.style.transform = `translate3d(0, ${scrolled * parallaxSpeed}px, 0)`;
            }

            // PAUSAR CARRUSELES - Solo agregar clase si no está presente
            isScrolling = true;
            if (!bodyHasScrollClass) {
                document.body.classList.add('is-scrolling');
                bodyHasScrollClass = true;
            }

            clearTimeout(scrollPauseTimer);
            scrollPauseTimer = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
                bodyHasScrollClass = false;
                isScrolling = false;
                // Reanudar carruseles (excepto el infinito que nunca se pausa)
                allCarousels.forEach(c => {
                    if (c.startAutoplay) c.startAutoplay();
                });
            }, 300); // Aumentado de 150ms a 300ms para reducir parpadeo

            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });
*/

// Variables para compatibilidad con el resto del código
let ticking = false;
let bodyHasScrollClass = false;
let isScrolling = false;

// Animación del título al cargar
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    if (heroTitle && heroSubtitle) {
        heroTitle.style.opacity = '0';
        heroSubtitle.style.opacity = '0';

        setTimeout(() => {
            heroTitle.style.transition = 'opacity 1s ease-in-out, transform 1s ease-in-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);

        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 1s ease-in-out';
            heroSubtitle.style.opacity = '1';
        }, 800);
    }
});

// Tracking de clicks en botones de contacto
document.querySelectorAll('.contact-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.classList.contains('whatsapp-btn') ? 'WhatsApp' : 'Instagram';
        console.log(`Click en botón de contacto: ${type}`);
    });
});

// Mensaje de bienvenida
console.log('%c✨ Lauren Tortas Personalizadas ✨', 'color: #C8A5D8; font-size: 20px; font-weight: bold;');
console.log('%cCreando momentos dulces desde 2022', 'color: #B08BBB; font-size: 14px;');

// ========================================
// ANIMACIONES PARA NUEVAS SECCIONES
// ========================================

// Observar items de Top Picks
document.querySelectorAll('.pick-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
    observer.observe(item);
});

// Animación para secciones de contenido (Fillings y Team)
document.querySelectorAll('.fillings-content, .team-content').forEach(content => {
    content.style.opacity = '0';
    content.style.transform = 'translateY(40px)';
    content.style.transition = 'all 0.8s ease-out';
    observer.observe(content);
});

// PARALLAX DUPLICADO ELIMINADO - Ahora se maneja en líneas 128-143

// ========================================
// FUNCIÓN GENÉRICA DE CARRUSEL (REFACTORIZADO)
// ========================================
// Variable global para pausar carruseles durante scroll
let allCarousels = [];
let scrollPauseTimer;
let isScrolling = false;

function createCarousel(config) {
    const {
        slidesSelector,
        dotsSelector,
        carouselSelector,
        autoplayInterval = 4000,
        consoleName = 'Carrusel',
        consoleColor = '#8B5CF6'
    } = config;

    const slides = document.querySelectorAll(slidesSelector);
    const dots = document.querySelectorAll(dotsSelector);
    const carousel = carouselSelector ? document.querySelector(carouselSelector) : null;
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoplayTimer;
    let isPaused = false;

    // Función para mostrar slide con crossfade
    function showSlide(index) {
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // Actualizar indicadores inmediatamente
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }

        // Activar el nuevo slide ANTES de desactivar el anterior (crossfade)
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }

        // Desactivar todos los demás slides después de un pequeño delay
        setTimeout(() => {
            slides.forEach((slide, i) => {
                if (i !== currentSlide) {
                    slide.classList.remove('active');
                }
            });
        }, 50);
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startAutoplay() {
        if (isPaused || isScrolling) return;
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            if (!isPaused && !isScrolling) {
                nextSlide();
            }
        }, autoplayInterval);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
    }

    function pause() {
        isPaused = true;
        stopAutoplay();
    }

    function resume() {
        isPaused = false;
        startAutoplay();
    }

    // Event listeners para indicadores
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            showSlide(index);
            startAutoplay();
        });
    });

    // Pausar autoplay al hacer hover (si existe el contenedor)
    if (carousel) {
        carousel.addEventListener('mouseenter', pause);
        carousel.addEventListener('mouseleave', resume);
    }

    // Iniciar autoplay si hay slides
    if (slides.length > 0) {
        startAutoplay();
    }

    console.log(`%c${consoleName} Activado! ✨`, `color: ${consoleColor}; font-size: 16px; font-weight: bold;`);

    const carouselInstance = { showSlide, nextSlide, startAutoplay, stopAutoplay, pause, resume };
    allCarousels.push(carouselInstance);
    return carouselInstance;
}

// ========================================
// CARRUSELES CON FUNCIÓN GENÉRICA (REFACTORIZADO)
// ========================================

// Carrusel de Bizcochos
const bizcochosCarousel = createCarousel({
    slidesSelector: '.bizcochos-slide',
    dotsSelector: '.bizcochos-dot',
    carouselSelector: '.bizcochos-carousel',
    autoplayInterval: 4000,
    consoleName: '🍰 Carrusel de Bizcochos',
    consoleColor: '#8B5CF6'
});

// Carrusel de Rellenos
const rellenosCarousel = createCarousel({
    slidesSelector: '.rellenos-slide',
    dotsSelector: '.rellenos-dot',
    carouselSelector: '.rellenos-carousel-wrapper',
    autoplayInterval: 4000,
    consoleName: '🍦 Carrusel de Rellenos',
    consoleColor: '#F9B58C'
});

// ========================================
// CARRUSEL INFINITO - DESHABILITADO
// ========================================
// DESHABILITADO: La clonación dinámica causaba parpadeos
// Ahora las imágenes se duplican manualmente en el HTML
// Esto elimina completamente los problemas de:
// - Clonación que dispara eventos de load
// - Cambios en el DOM durante scroll
// - IntersectionObserver observando elementos clonados
/*
(function initInfiniteCarousel() {
    const track = document.querySelector('.infinite-carousel-track');
    const wrapper = document.querySelector('.infinite-carousel-wrapper');

    if (track && wrapper) {
        // CRÍTICO: Pausar la animación temporalmente durante la clonación
        const originalAnimation = track.style.animation;
        track.style.animation = 'none';

        // Forzar reflow para asegurar que la animación se pause
        void track.offsetHeight;

        // CRÍTICO: Fijar el height del wrapper para prevenir layout shift
        const wrapperHeight = wrapper.offsetHeight;
        wrapper.style.minHeight = wrapperHeight + 'px';

        // Clonar todos los items para crear el efecto infinito
        const items = Array.from(track.children);

        // IMPORTANTE: Usar DocumentFragment para evitar reflows múltiples
        const fragment = document.createDocumentFragment();

        // Duplicar los items para el loop infinito
        items.forEach(item => {
            const clone = item.cloneNode(true);
            // Marcar clones para identificarlos después
            clone.setAttribute('data-cloned', 'true');
            fragment.appendChild(clone);
        });

        // Agregar todos los clones de una sola vez
        track.appendChild(fragment);

        // Restaurar la animación después de un pequeño delay
        requestAnimationFrame(() => {
            track.style.animation = originalAnimation || '';
        });

        console.log('%c✨ Carrusel Infinito Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');
    } else {
        // Si no está listo, intentar de nuevo cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initInfiniteCarousel);
        }
    }
})();
*/

console.log('%c✨ Carrusel Infinito (sin clonación JS) Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');

// ========================================
// LIGHTBOX - SOLO Carrusel Infinito (NO vintage, NO sencillas)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const carouselItems = document.querySelectorAll('.infinite-carousel-item');

    let currentImageIndex = 0;
    let allImagesSrc = [];

    // Recopilar SOLO las imágenes ORIGINALES del carrusel infinito (NO clonadas)
    carouselItems.forEach((item, index) => {
        // Ignorar elementos clonados
        if (item.hasAttribute('data-cloned')) {
            return;
        }

        const img = item.querySelector('.infinite-carousel-img');
        if (img) {
            allImagesSrc.push(img.src);

            // DESHABILITADO: No queremos que el carrusel abra lightbox
            // item.addEventListener('click', () => {
            //     currentImageIndex = index;
            //     openLightbox(img.src);
            // });
        }
    });

    // Función para abrir el lightbox
    function openLightbox(src) {
        lightboxImg.src = src;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Función para cerrar el lightbox
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Función para mostrar imagen anterior
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + allImagesSrc.length) % allImagesSrc.length;
        lightboxImg.src = allImagesSrc[currentImageIndex];
    }

    // Función para mostrar imagen siguiente
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % allImagesSrc.length;
        lightboxImg.src = allImagesSrc[currentImageIndex];
    }

    // Event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Cerrar al hacer click fuera de la imagen
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Cerrar con tecla ESC y navegación con flechas
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });

    console.log('%c📸 Lightbox Carrusel Infinito Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');
});

// ========================================
// CARRUSEL VINTAGE - REFACTORIZADO
// ========================================
const vintageCarouselInstance = createCarousel({
    slidesSelector: '.vintage-carousel-group',
    dotsSelector: '.vintage-dot',
    carouselSelector: '.vintage-carousel-wrapper',
    autoplayInterval: 3000,
    consoleName: '🎨 Carrusel Vintage Automático',
    consoleColor: '#C8A5D8'
});

// ========================================
// LIGHTBOX EXCLUSIVO PARA VINTAGE - SOLO FOTOS VINTAGE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // SOLO seleccionar imágenes de la galería vintage
    const vintageItems = document.querySelectorAll('.vintage-gallery-item');

    let currentVintageIndex = 0;
    let allVintageImagesSrc = [];
    let isVintageLightboxActive = false;

    // Recopilar SOLO las imágenes de la galería vintage
    vintageItems.forEach((item, index) => {
        const img = item.querySelector('.vintage-gallery-img');
        if (img) {
            allVintageImagesSrc.push(img.src);

            // DESACTIVADO: Ya no queremos el lightbox antiguo, ahora usamos Product Quick View Modal
            // item.addEventListener('click', (e) => {
            //     if (e.target.closest('.pricing-btn-integrated')) {
            //         return;
            //     }
            //     currentVintageIndex = index;
            //     isVintageLightboxActive = true;
            //     openVintageLightbox(img.src);
            // });
        }
    });

    // Función para abrir el lightbox de vintage
    function openVintageLightbox(src) {
        lightboxImg.src = src;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Función para cerrar el lightbox vintage
    function closeVintageLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        isVintageLightboxActive = false;
    }

    // Función para mostrar imagen anterior (SOLO vintage)
    function showPrevVintageImage() {
        if (!isVintageLightboxActive) return;
        currentVintageIndex = (currentVintageIndex - 1 + allVintageImagesSrc.length) % allVintageImagesSrc.length;
        lightboxImg.src = allVintageImagesSrc[currentVintageIndex];
    }

    // Función para mostrar imagen siguiente (SOLO vintage)
    function showNextVintageImage() {
        if (!isVintageLightboxActive) return;
        currentVintageIndex = (currentVintageIndex + 1) % allVintageImagesSrc.length;
        lightboxImg.src = allVintageImagesSrc[currentVintageIndex];
    }

    // Sobrescribir los event listeners cuando sea lightbox vintage
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            if (isVintageLightboxActive) {
                showPrevVintageImage();
            }
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            if (isVintageLightboxActive) {
                showNextVintageImage();
            }
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            if (isVintageLightboxActive) {
                closeVintageLightbox();
            }
        });
    }

    console.log('%c🎨 Lightbox Vintage Exclusivo Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');
});

// ========================================
// MODAL PRECIOS VINTAGE - Fade-In con Blur
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const pricingBtns = document.querySelectorAll('#vintagePricingBtn');
    const modalOverlay = document.getElementById('pricingModalOverlay');
    const modalClose = document.getElementById('pricingModalClose');

    if (pricingBtns.length > 0 && modalOverlay && modalClose) {
        // Abrir modal - agregar listener a TODOS los botones
        pricingBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Detener propagación para evitar abrir lightbox
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Evitar scroll
            });
        });

        // Cerrar modal con botón X
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll
        });

        // Cerrar modal al hacer click en el fondo
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        console.log('%c💰 Modal de Precios Vintage Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');
    }
});

// ========================================
// CARRUSEL TORTAS SENCILLAS - REFACTORIZADO
// ========================================
const simpleCarouselInstance = createCarousel({
    slidesSelector: '.simple-carousel-group',
    dotsSelector: '.simple-dot',
    carouselSelector: '.simple-carousel-wrapper',
    autoplayInterval: 3000,
    consoleName: '🎂 Carrusel Tortas Sencillas',
    consoleColor: '#C8A5D8'
});

// ========================================
// LIGHTBOX EXCLUSIVO PARA SENCILLAS - SOLO FOTOS SENCILLAS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // SOLO seleccionar imágenes de la galería sencillas
    const simpleItems = document.querySelectorAll('.simple-gallery-item');

    let currentSimpleIndex = 0;
    let allSimpleImagesSrc = [];
    let isSimpleLightboxActive = false;

    // Recopilar SOLO las imágenes de la galería sencillas
    simpleItems.forEach((item, index) => {
        const img = item.querySelector('.simple-gallery-img');
        if (img) {
            allSimpleImagesSrc.push(img.src);

            // DESACTIVADO: Ya no queremos el lightbox antiguo, ahora usamos Product Quick View Modal
            // item.addEventListener('click', (e) => {
            //     if (e.target.closest('.pricing-btn-integrated')) {
            //         return;
            //     }
            //     currentSimpleIndex = index;
            //     isSimpleLightboxActive = true;
            //     openSimpleLightbox(img.src);
            // });
        }
    });

    // Función para abrir el lightbox de sencillas
    function openSimpleLightbox(src) {
        lightboxImg.src = src;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Función para cerrar el lightbox sencillas
    function closeSimpleLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        isSimpleLightboxActive = false;
    }

    // Función para mostrar imagen anterior (SOLO sencillas)
    function showPrevSimpleImage() {
        if (!isSimpleLightboxActive) return;
        currentSimpleIndex = (currentSimpleIndex - 1 + allSimpleImagesSrc.length) % allSimpleImagesSrc.length;
        lightboxImg.src = allSimpleImagesSrc[currentSimpleIndex];
    }

    // Función para mostrar imagen siguiente (SOLO sencillas)
    function showNextSimpleImage() {
        if (!isSimpleLightboxActive) return;
        currentSimpleIndex = (currentSimpleIndex + 1) % allSimpleImagesSrc.length;
        lightboxImg.src = allSimpleImagesSrc[currentSimpleIndex];
    }

    // Sobrescribir los event listeners cuando sea lightbox sencillas
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            if (isSimpleLightboxActive) {
                showPrevSimpleImage();
            }
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            if (isSimpleLightboxActive) {
                showNextSimpleImage();
            }
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            if (isSimpleLightboxActive) {
                closeSimpleLightbox();
            }
        });
    }

    console.log('%c🎂 Lightbox Sencillas Exclusivo Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');
});

// ========================================
// MODAL PRECIOS TORTAS SENCILLAS - Fade-In con Blur
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const simplePricingBtns = document.querySelectorAll('#simplePricingBtn');
    const simpleModalOverlay = document.getElementById('simplePricingModalOverlay');
    const simpleModalClose = document.getElementById('simplePricingModalClose');

    if (simplePricingBtns.length > 0 && simpleModalOverlay && simpleModalClose) {
        // Abrir modal - agregar listener a TODOS los botones
        simplePricingBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Detener propagación para evitar abrir lightbox
                simpleModalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        simpleModalClose.addEventListener('click', () => {
            simpleModalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        simpleModalOverlay.addEventListener('click', (e) => {
            if (e.target === simpleModalOverlay) {
                simpleModalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && simpleModalOverlay.classList.contains('active')) {
                simpleModalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        console.log('%c💰 Modal de Precios Sencillas Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');
    }
});

// ========================================
// MENÚ HAMBURGUESA RESPONSIVE
// ========================================
const menuToggleMinimal = document.querySelector('.menu-toggle-minimal');
const minimalNav = document.getElementById('minimalNav');
const navItems = document.querySelectorAll('.nav-item');

if (menuToggleMinimal && minimalNav) {
    // Resetear estado del menú al cargar la página
    minimalNav.classList.remove('active');
    menuToggleMinimal.setAttribute('aria-expanded', 'false');

    // Toggle menu al hacer click en el botón
    menuToggleMinimal.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isExpanded = menuToggleMinimal.getAttribute('aria-expanded') === 'true';
        menuToggleMinimal.setAttribute('aria-expanded', !isExpanded);
        minimalNav.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            minimalNav.classList.remove('active');
            menuToggleMinimal.setAttribute('aria-expanded', 'false');
        });
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-toggle-minimal') && !e.target.closest('.minimal-nav')) {
            minimalNav.classList.remove('active');
            menuToggleMinimal.setAttribute('aria-expanded', 'false');
        }
    });

    // Cerrar menú con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && minimalNav.classList.contains('active')) {
            minimalNav.classList.remove('active');
            menuToggleMinimal.setAttribute('aria-expanded', 'false');
        }
    });

    console.log('%c🍔 Menú Hamburguesa Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    // Mostrar/ocultar botón según scroll - CON THROTTLE
    let scrollTopTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTopTicking) {
            window.requestAnimationFrame(() => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
                scrollTopTicking = false;
            });
            scrollTopTicking = true;
        }
    });

    // Scroll suave al hacer click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    console.log('%c⬆️ Scroll to Top Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');
}

// ========================================
// MENÚ DESPLEGABLE DE CONTACTO
// ========================================
const contactDropdownBtn = document.querySelector('.contact-dropdown-btn');
const contactDropdownMenu = document.querySelector('.contact-dropdown-menu');
const dropdownArrow = document.querySelector('.dropdown-arrow');

if (contactDropdownBtn && contactDropdownMenu) {
    // Resetear estado del dropdown al cargar la página
    contactDropdownBtn.setAttribute('aria-expanded', 'false');
    contactDropdownMenu.classList.remove('active');
    if (dropdownArrow) {
        dropdownArrow.style.transform = 'rotate(0deg)';
    }

    // Alternar dropdown al hacer click en el botón
    contactDropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isExpanded = contactDropdownBtn.getAttribute('aria-expanded') === 'true';
        contactDropdownBtn.setAttribute('aria-expanded', !isExpanded);
        contactDropdownMenu.classList.toggle('active');

        // Rotar la flecha
        if (dropdownArrow) {
            dropdownArrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.contact-dropdown')) {
            contactDropdownBtn.setAttribute('aria-expanded', 'false');
            contactDropdownMenu.classList.remove('active');
            if (dropdownArrow) {
                dropdownArrow.style.transform = 'rotate(0deg)';
            }
        }
    });

    // Cerrar dropdown con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactDropdownMenu.classList.contains('active')) {
            contactDropdownBtn.setAttribute('aria-expanded', 'false');
            contactDropdownMenu.classList.remove('active');
            if (dropdownArrow) {
                dropdownArrow.style.transform = 'rotate(0deg)';
            }
        }
    });

    console.log('%c📞 Menú Desplegable de Contacto Activado! ✨', 'color: #C8A5D8; font-size: 16px; font-weight: bold;');
}

// ========================================
// MODAL PRECIOS TORTAS DE ALFAJOR
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const tortaAlfajorBtn = document.getElementById('tortaAlfajorPricingBtn');
    const tortaAlfajorModalOverlay = document.getElementById('tortaAlfajorPricingModalOverlay');
    const tortaAlfajorModalClose = document.getElementById('tortaAlfajorPricingModalClose');

    if (tortaAlfajorBtn && tortaAlfajorModalOverlay && tortaAlfajorModalClose) {
        // Abrir modal
        tortaAlfajorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            tortaAlfajorModalOverlay.style.display = 'flex';
            setTimeout(() => {
                tortaAlfajorModalOverlay.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden';
        });

        // Cerrar modal con el botón X
        tortaAlfajorModalClose.addEventListener('click', () => {
            tortaAlfajorModalOverlay.classList.remove('active');
            setTimeout(() => {
                tortaAlfajorModalOverlay.style.display = 'none';
            }, 300);
            document.body.style.overflow = '';
        });

        // Cerrar modal al hacer click fuera
        tortaAlfajorModalOverlay.addEventListener('click', (e) => {
            if (e.target === tortaAlfajorModalOverlay) {
                tortaAlfajorModalOverlay.classList.remove('active');
                setTimeout(() => {
                    tortaAlfajorModalOverlay.style.display = 'none';
                }, 300);
                document.body.style.overflow = '';
            }
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && tortaAlfajorModalOverlay.classList.contains('active')) {
                tortaAlfajorModalOverlay.classList.remove('active');
                setTimeout(() => {
                    tortaAlfajorModalOverlay.style.display = 'none';
                }, 300);
                document.body.style.overflow = '';
            }
        });

        console.log('%c🎂 Modal de Precios Tortas de Alfajor Activado! ✨', 'color: #FFB69E; font-size: 16px; font-weight: bold;');
    }
});

// ========================================
// MODAL PRECIOS ALFAJORES EN BOLSITA
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const alfajoresBolsitaBtn = document.getElementById('alfajoresBolsitaPricingBtn');
    const alfajoresBolsitaModalOverlay = document.getElementById('alfajoresBolsitaPricingModalOverlay');
    const alfajoresBolsitaModalClose = document.getElementById('alfajoresBolsitaPricingModalClose');

    if (alfajoresBolsitaBtn && alfajoresBolsitaModalOverlay && alfajoresBolsitaModalClose) {
        // Abrir modal
        alfajoresBolsitaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alfajoresBolsitaModalOverlay.style.display = 'flex';
            setTimeout(() => {
                alfajoresBolsitaModalOverlay.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden';
        });

        // Cerrar modal con el botón X
        alfajoresBolsitaModalClose.addEventListener('click', () => {
            alfajoresBolsitaModalOverlay.classList.remove('active');
            setTimeout(() => {
                alfajoresBolsitaModalOverlay.style.display = 'none';
            }, 300);
            document.body.style.overflow = '';
        });

        // Cerrar modal al hacer click fuera
        alfajoresBolsitaModalOverlay.addEventListener('click', (e) => {
            if (e.target === alfajoresBolsitaModalOverlay) {
                alfajoresBolsitaModalOverlay.classList.remove('active');
                setTimeout(() => {
                    alfajoresBolsitaModalOverlay.style.display = 'none';
                }, 300);
                document.body.style.overflow = '';
            }
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && alfajoresBolsitaModalOverlay.classList.contains('active')) {
                alfajoresBolsitaModalOverlay.classList.remove('active');
                setTimeout(() => {
                    alfajoresBolsitaModalOverlay.style.display = 'none';
                }, 300);
                document.body.style.overflow = '';
            }
        });

        console.log('%c🍪 Modal de Precios Alfajores en Bolsita Activado! ✨', 'color: #F9B58C; font-size: 16px; font-weight: bold;');
    }
});

// ========================================
// MODAL PRECIOS ALFAJORES UNIDAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const alfajoresUnidadBtn = document.getElementById('alfajoresUnidadPricingBtn');
    const alfajoresUnidadModalOverlay = document.getElementById('alfajoresUnidadPricingModalOverlay');
    const alfajoresUnidadModalClose = document.getElementById('alfajoresUnidadPricingModalClose');

    if (alfajoresUnidadBtn && alfajoresUnidadModalOverlay && alfajoresUnidadModalClose) {
        // Abrir modal
        alfajoresUnidadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alfajoresUnidadModalOverlay.style.display = 'flex';
            setTimeout(() => {
                alfajoresUnidadModalOverlay.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden';
        });

        // Cerrar modal con el botón X
        alfajoresUnidadModalClose.addEventListener('click', () => {
            alfajoresUnidadModalOverlay.classList.remove('active');
            setTimeout(() => {
                alfajoresUnidadModalOverlay.style.display = 'none';
            }, 300);
            document.body.style.overflow = '';
        });

        // Cerrar modal al hacer click fuera
        alfajoresUnidadModalOverlay.addEventListener('click', (e) => {
            if (e.target === alfajoresUnidadModalOverlay) {
                alfajoresUnidadModalOverlay.classList.remove('active');
                setTimeout(() => {
                    alfajoresUnidadModalOverlay.style.display = 'none';
                }, 300);
                document.body.style.overflow = '';
            }
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && alfajoresUnidadModalOverlay.classList.contains('active')) {
                alfajoresUnidadModalOverlay.classList.remove('active');
                setTimeout(() => {
                    alfajoresUnidadModalOverlay.style.display = 'none';
                }, 300);
                document.body.style.overflow = '';
            }
        });

        console.log('%c🍪 Modal de Precios Alfajores Unidad Activado! ✨', 'color: #F9B58C; font-size: 16px; font-weight: bold;');
    }
});

// ========================================
// EFECTOS HOVER PARA IMÁGENES DE ALFAJORES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Efectos para tortas de alfajor
    const tortaItems = document.querySelectorAll('.torta-alfajor-item');
    tortaItems.forEach(item => {
        const img = item.querySelector('.torta-alfajor-img');
        if (img) {
            item.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.08)';
                item.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
            });
            item.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                item.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        }
    });

    // Efectos para imágenes de alfajores individuales (bolsita y unidad)
    const alfajorIndividualItems = document.querySelectorAll('.alfajor-individual-item');
    alfajorIndividualItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            item.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.08)';
                item.style.boxShadow = '0 25px 70px rgba(139, 69, 19, 0.25)';
                item.style.transform = 'translateY(-5px)';
            });
            item.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                item.style.boxShadow = '0 20px 60px rgba(139, 69, 19, 0.15)';
                item.style.transform = 'translateY(0)';
            });
        }
    });

    // Efecto hover para botón de alfajores en bolsita
    const alfajoresBolsitaBtn = document.getElementById('alfajoresBolsitaPricingBtn');
    if (alfajoresBolsitaBtn) {
        alfajoresBolsitaBtn.addEventListener('mouseenter', () => {
            alfajoresBolsitaBtn.style.background = 'linear-gradient(135deg, #F4A67C 0%, #F09964 100%)';
            alfajoresBolsitaBtn.style.transform = 'translateY(-2px)';
            alfajoresBolsitaBtn.style.boxShadow = '0 6px 25px rgba(249, 181, 140, 0.6)';
        });
        alfajoresBolsitaBtn.addEventListener('mouseleave', () => {
            alfajoresBolsitaBtn.style.background = 'linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%)';
            alfajoresBolsitaBtn.style.transform = 'translateY(0)';
            alfajoresBolsitaBtn.style.boxShadow = '0 4px 20px rgba(249, 181, 140, 0.5)';
        });
    }

    // Efecto hover para botón de alfajores unidad
    const alfajoresUnidadBtn = document.getElementById('alfajoresUnidadPricingBtn');
    if (alfajoresUnidadBtn) {
        alfajoresUnidadBtn.addEventListener('mouseenter', () => {
            alfajoresUnidadBtn.style.background = 'linear-gradient(135deg, #F4A67C 0%, #F09964 100%)';
            alfajoresUnidadBtn.style.transform = 'translateY(-2px)';
            alfajoresUnidadBtn.style.boxShadow = '0 6px 25px rgba(249, 181, 140, 0.6)';
        });
        alfajoresUnidadBtn.addEventListener('mouseleave', () => {
            alfajoresUnidadBtn.style.background = 'linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%)';
            alfajoresUnidadBtn.style.transform = 'translateY(0)';
            alfajoresUnidadBtn.style.boxShadow = '0 4px 20px rgba(249, 181, 140, 0.5)';
        });
    }

    // Efecto hover para botón de tortas de alfajor
    const tortaAlfajorBtn = document.getElementById('tortaAlfajorPricingBtn');
    if (tortaAlfajorBtn) {
        tortaAlfajorBtn.addEventListener('mouseenter', () => {
            tortaAlfajorBtn.style.background = 'linear-gradient(135deg, #F4A67C 0%, #F09964 100%)';
            tortaAlfajorBtn.style.transform = 'translateY(-2px)';
            tortaAlfajorBtn.style.boxShadow = '0 6px 25px rgba(249, 181, 140, 0.6)';
        });
        tortaAlfajorBtn.addEventListener('mouseleave', () => {
            tortaAlfajorBtn.style.background = 'linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%)';
            tortaAlfajorBtn.style.transform = 'translateY(0)';
            tortaAlfajorBtn.style.boxShadow = '0 4px 15px rgba(249, 181, 140, 0.3)';
        });
    }

    console.log('%c✨ Efectos Hover de Alfajores Activados! ✨', 'color: #F9B58C; font-size: 16px; font-weight: bold;');
});

// ========================================
// CARRUSEL INFINITO - ALFAJORES PERSONALIZADOS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const alfajoresTrack = document.getElementById('alfajoresPersonalizadosCarousel');

    if (alfajoresTrack) {
        // Clonar todos los items para crear el efecto infinito
        const items = Array.from(alfajoresTrack.children);

        // Duplicar los items para el loop infinito
        items.forEach(item => {
            const clone = item.cloneNode(true);
            alfajoresTrack.appendChild(clone);
        });

        console.log('%c🎨 Carrusel Infinito de Alfajores Personalizados Activado! ✨', 'color: #F9B58C; font-size: 16px; font-weight: bold;');
    }
});

// ========================================
// MANEJO DE ERRORES DE VIDEOS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
        video.addEventListener('error', function() {
            console.error('❌ Error cargando video:', this.src || this.querySelector('source')?.src);

            // Ocultar el video que falló
            this.style.opacity = '0.3';
            this.style.filter = 'grayscale(100%)';

            console.log('⚠️ Video ocultado para evitar pantalla negra');
        });

        video.addEventListener('loadeddata', function() {
            console.log('✅ Video cargado correctamente:', this.src || this.querySelector('source')?.src);
        });
    });

    console.log(`📹 Monitoreando ${videos.length} videos para detectar errores`);
});

// ========================================
// MANEJO DE ERRORES DE IMÁGENES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Ignorar imágenes sin src o con src vacío (modales/lightbox que se llenan dinámicamente)
        if (!img.hasAttribute('src') || img.getAttribute('src') === '') {
            return;
        }

        // CRÍTICO: Ignorar imágenes del carrusel infinito para evitar parpadeos
        if (img.classList.contains('infinite-carousel-img')) {
            return;
        }

        img.addEventListener('error', function() {
            console.error('❌ Error cargando imagen:', this.src);

            // Intentar cargar logo de Lauren como fallback
            if (!this.src.includes('LOGOS LAUREN PNG-55.png')) {
                this.src = '../assets/logos/LOGOS LAUREN PNG-55.png';
                console.log('🔄 Imagen reemplazada con logo de fallback');
            } else {
                // Si el logo también falla, ocultar
                this.style.opacity = '0.3';
                console.log('⚠️ Imagen ocultada completamente');
            }
        });

        // DESHABILITADO: Los console.log en load causan ralentización
        /*
        img.addEventListener('load', function() {
            if (this.complete && this.naturalHeight !== 0) {
                console.log('✅ Imagen cargada correctamente:', this.src);
            }
        });
        */
    });

    const validImages = Array.from(images).filter(img =>
        img.hasAttribute('src') &&
        img.getAttribute('src') !== '' &&
        !img.classList.contains('infinite-carousel-img')
    );
    console.log(`🖼️ Monitoreando ${validImages.length} imágenes para detectar errores (excluyendo carrusel infinito)`);
});
