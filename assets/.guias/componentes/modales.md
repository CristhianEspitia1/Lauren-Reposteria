# 🪟 MODALES - Lauren Design System

---

## 1️⃣ MODAL DE PRECIOS (Estilo Vintage/Profesional)

**Cuándo usar:** Mostrar lista de precios, tamaños, porciones

### HTML Completo
```html
<!-- Modal de Precios con Blur -->
<div class="pricing-modal-overlay" id="pricingModalOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 9999; opacity: 0; visibility: hidden; transition: opacity 0.4s ease, visibility 0.4s ease;">
    <div class="pricing-modal-content" id="pricingModalContent" style="background: white; border-radius: 30px; padding: 3rem; max-width: 600px; width: 90%; max-height: 85vh; overflow-y: auto; box-shadow: 0 30px 90px rgba(0, 0, 0, 0.2); position: relative; transform: scale(0.3); transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.5s ease;">

        <!-- Botón Cerrar -->
        <button class="pricing-modal-close" id="pricingModalClose" style="position: absolute; top: 20px; right: 20px; background: rgba(200, 165, 216, 0.1); border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 2rem; color: #C8A5D8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; line-height: 1; padding: 0;">
            &times;
        </button>

        <!-- Contenido -->
        <div class="vintage-pricing-list">
            <h5 class="vintage-pricing-title" style="text-align: center; font-size: 1.8rem; color: #C8A5D8; margin-bottom: 0.5rem; font-weight: 700; font-family: 'Poppins', sans-serif;">Precios - Torta Vintage</h5>
            <p class="vintage-pricing-subtitle" style="text-align: center; color: #8B7B9A; font-size: 0.95rem; margin-bottom: 2.5rem;">Con bordes arriba, abajo y también en los laterales</p>

            <div class="pricing-list-container">
                <!-- Item Normal -->
                <div class="pricing-list-item" style="display: flex; align-items: center; padding: 1.2rem 1.5rem; margin-bottom: 1rem; background: linear-gradient(135deg, rgba(200, 165, 216, 0.03), rgba(232, 212, 200, 0.03)); border-radius: 15px; border: 1px solid rgba(200, 165, 216, 0.15); transform: translateX(-20px); opacity: 0; animation: slideInLeft 0.5s ease forwards; animation-delay: 0.1s; transition: all 0.3s ease;">
                    <span class="list-icon" style="font-size: 1.5rem; margin-right: 1rem;">🎂</span>
                    <span class="list-portions" style="font-weight: 600; color: #4A3C52; min-width: 120px; font-family: 'Poppins', sans-serif;">4-5 porciones</span>
                    <span class="list-dots" style="flex: 1; border-bottom: 2px dotted rgba(200, 165, 216, 0.3); margin: 0 1rem;"></span>
                    <span class="list-price" style="font-weight: 700; color: #C8A5D8; font-size: 1.1rem; font-family: 'Poppins', sans-serif;">$65.000</span>
                </div>

                <!-- Item Popular -->
                <div class="pricing-list-item popular-item" style="display: flex; align-items: center; padding: 1.2rem 1.5rem; margin-bottom: 1rem; background: linear-gradient(135deg, rgba(200, 165, 216, 0.08), rgba(232, 212, 200, 0.08)); border-radius: 15px; border: 2px solid #C8A5D8; transform: translateX(-20px); opacity: 0; animation: slideInLeft 0.5s ease forwards; animation-delay: 0.2s; transition: all 0.3s ease; position: relative;">
                    <span class="list-icon" style="font-size: 1.5rem; margin-right: 1rem;">🎂</span>
                    <span class="list-portions" style="font-weight: 600; color: #4A3C52; min-width: 120px; font-family: 'Poppins', sans-serif;">8-10 porciones</span>
                    <span class="list-dots" style="flex: 1; border-bottom: 2px dotted rgba(200, 165, 216, 0.3); margin: 0 1rem;"></span>
                    <span class="list-price" style="font-weight: 700; color: #C8A5D8; font-size: 1.1rem; font-family: 'Poppins', sans-serif;">$105.000</span>
                    <span class="list-star" style="position: absolute; top: -8px; right: 10px; font-size: 1.2rem; animation: starPulse 2s ease-in-out infinite;">⭐</span>
                </div>

                <!-- Más items... -->
            </div>
        </div>
    </div>
</div>

<!-- Animaciones -->
<style>
@keyframes slideInLeft {
    from {
        transform: translateX(-20px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes starPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}
</style>
```

### JavaScript
```javascript
// Elementos
const modalOverlay = document.getElementById('pricingModalOverlay');
const modalContent = document.getElementById('pricingModalContent');
const closeBtn = document.getElementById('pricingModalClose');
const openBtn = document.getElementById('openPricingBtn'); // Tu botón que abre el modal

// Abrir modal
openBtn.addEventListener('click', function() {
    modalOverlay.classList.add('active');
    // Forzar pequeño delay para que la animación se vea
    setTimeout(() => {
        modalContent.classList.add('active');
    }, 10);
});

// Cerrar modal con botón X
closeBtn.addEventListener('click', function() {
    modalContent.classList.remove('active');
    setTimeout(() => {
        modalOverlay.classList.remove('active');
    }, 300);
});

// Cerrar modal al hacer click en el overlay
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        modalContent.classList.remove('active');
        setTimeout(() => {
            modalOverlay.classList.remove('active');
        }, 300);
    }
});
```

### CSS para Estados Active
```css
.pricing-modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.pricing-modal-content.active {
    transform: scale(1);
    opacity: 1;
}

.pricing-list-item:hover {
    background: rgba(200, 165, 216, 0.05);
    transform: translateX(8px);
    border-color: rgba(200, 165, 216, 0.3);
}

.pricing-modal-close:hover {
    background: rgba(200, 165, 216, 0.2);
    color: #B08BBB;
    transform: rotate(90deg) scale(1.1);
}

.pricing-modal-close:active {
    transform: rotate(90deg) scale(0.95);
}
```

---

## 2️⃣ MODAL SIMPLE (Sin Lista de Precios)

**Cuándo usar:** Mensajes, confirmaciones, información general

### HTML
```html
<div class="simple-modal-overlay" id="simpleModalOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 9999; opacity: 0; visibility: hidden; transition: opacity 0.4s ease, visibility 0.4s ease;">
    <div class="simple-modal-content" id="simpleModalContent" style="background: white; border-radius: 30px; padding: 3rem; max-width: 500px; width: 90%; box-shadow: 0 30px 90px rgba(0, 0, 0, 0.2); position: relative; transform: scale(0.7); opacity: 0; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;">

        <!-- Botón Cerrar -->
        <button class="simple-modal-close" id="simpleModalClose" style="position: absolute; top: 20px; right: 20px; background: rgba(200, 165, 216, 0.1); border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 2rem; color: #C8A5D8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
            &times;
        </button>

        <!-- Contenido -->
        <div class="modal-body" style="text-align: center;">
            <h3 style="font-size: 1.8rem; color: #C8A5D8; margin-bottom: 1rem; font-family: 'Poppins', sans-serif;">Título del Modal</h3>
            <p style="color: #8B7B9A; line-height: 1.6; margin-bottom: 2rem;">
                Contenido del modal aquí. Puede ser texto, imágenes, o cualquier contenido.
            </p>

            <!-- Botones de acción -->
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="modal-btn-secondary" style="background: rgba(200, 165, 216, 0.1); color: #C8A5D8; border: 2px solid #C8A5D8; padding: 0.8rem 1.8rem; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">
                    Cancelar
                </button>
                <button class="modal-btn-primary" style="background: linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%); color: white; border: none; padding: 0.8rem 1.8rem; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">
                    Confirmar
                </button>
            </div>
        </div>
    </div>
</div>
```

### CSS Estados Active
```css
.simple-modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.simple-modal-content.active {
    transform: scale(1);
    opacity: 1;
}
```

---

## 3️⃣ MODAL CON IMAGEN

**Cuándo usar:** Mostrar galería, producto destacado

### HTML
```html
<div class="image-modal-overlay" id="imageModalOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; opacity: 0; visibility: hidden; transition: opacity 0.4s ease, visibility 0.4s ease;">
    <div class="image-modal-content" id="imageModalContent" style="max-width: 90%; max-height: 90vh; position: relative; transform: scale(0.8); opacity: 0; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;">

        <!-- Botón Cerrar -->
        <button class="image-modal-close" id="imageModalClose" style="position: absolute; top: -50px; right: 0; background: rgba(255, 255, 255, 0.2); border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 2rem; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
            &times;
        </button>

        <!-- Imagen -->
        <img id="modalImage" src="" alt="Imagen ampliada" style="max-width: 100%; max-height: 90vh; border-radius: 20px; box-shadow: 0 30px 90px rgba(0, 0, 0, 0.5);">

        <!-- Caption opcional -->
        <p id="modalCaption" style="text-align: center; color: white; margin-top: 1rem; font-size: 1.1rem; font-family: 'Poppins', sans-serif;"></p>
    </div>
</div>
```

---

## 4️⃣ MODAL FULLSCREEN

**Cuándo usar:** Formularios largos, contenido extenso

### HTML
```html
<div class="fullscreen-modal-overlay" id="fullscreenModalOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; z-index: 9999; opacity: 0; visibility: hidden; transition: opacity 0.4s ease, visibility 0.4s ease; overflow-y: auto;">
    <div class="fullscreen-modal-content" id="fullscreenModalContent" style="max-width: 1200px; margin: 0 auto; padding: 2rem; transform: translateY(50px); opacity: 0; transition: transform 0.5s ease, opacity 0.5s ease;">

        <!-- Header fijo -->
        <div class="fullscreen-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; border-bottom: 2px solid rgba(200, 165, 216, 0.2); margin-bottom: 2rem; position: sticky; top: 0; background: white; z-index: 10;">
            <h2 style="font-size: 2rem; color: #C8A5D8; font-family: 'Poppins', sans-serif;">Título</h2>
            <button class="fullscreen-modal-close" id="fullscreenModalClose" style="background: rgba(200, 165, 216, 0.1); border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 2rem; color: #C8A5D8; cursor: pointer; transition: all 0.3s ease;">
                &times;
            </button>
        </div>

        <!-- Contenido -->
        <div class="fullscreen-body">
            <!-- Tu contenido aquí -->
        </div>
    </div>
</div>
```

---

## 🎨 VARIACIONES DE COLOR

### Por Producto
```css
/* Tortas, Galletas, Detalles - Lila */
color: #C8A5D8;
border-color: #C8A5D8;
background: rgba(200, 165, 216, 0.1);

/* Alfajores, Brownies - Durazno */
color: #F9B58C;
border-color: #F9B58C;
background: rgba(249, 181, 140, 0.1);
```

---

## ⚙️ FUNCIONES JAVASCRIPT REUTILIZABLES

### Función Genérica para Abrir Modal
```javascript
function openModal(overlayId, contentId) {
    const overlay = document.getElementById(overlayId);
    const content = document.getElementById(contentId);

    overlay.classList.add('active');
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';

    setTimeout(() => {
        content.classList.add('active');
        content.style.transform = 'scale(1)';
        content.style.opacity = '1';
    }, 10);

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

function closeModal(overlayId, contentId) {
    const overlay = document.getElementById(overlayId);
    const content = document.getElementById(contentId);

    content.classList.remove('active');
    content.style.transform = 'scale(0.3)';
    content.style.opacity = '0';

    setTimeout(() => {
        overlay.classList.remove('active');
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';

        // Restaurar scroll del body
        document.body.style.overflow = '';
    }, 300);
}
```

### Uso
```javascript
// Abrir
openModal('pricingModalOverlay', 'pricingModalContent');

// Cerrar
closeModal('pricingModalOverlay', 'pricingModalContent');
```

---

## 📱 RESPONSIVE

### Ajustes para Móvil
```css
@media (max-width: 768px) {
    .pricing-modal-content,
    .simple-modal-content {
        padding: 2rem 1.5rem;
        max-width: 95%;
    }

    .vintage-pricing-title {
        font-size: 1.5rem;
    }

    .pricing-list-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .list-dots {
        display: none;
    }
}
```

---

## ✅ CHECKLIST DE MODALES

- [ ] Overlay con backdrop-filter: blur(12px)
- [ ] Z-index: 9999
- [ ] Transiciones suaves (0.4s ease)
- [ ] Transform scale entrance
- [ ] Botón cerrar con hover rotate(90deg)
- [ ] Click en overlay cierra el modal
- [ ] Prevenir scroll del body cuando está abierto
- [ ] Responsive: max-width 95% en móvil
- [ ] Border-radius: 30px en contenido
- [ ] Box-shadow fuerte para elevación
- [ ] Animación slideInLeft en items de lista
- [ ] Estrella con pulso en item popular
