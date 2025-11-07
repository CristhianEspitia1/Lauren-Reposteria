# ⚡ REFERENCIA RÁPIDA - Lauren Design System

**Valores más usados para copiar/pegar rápidamente**

---

## 🎨 COLORES

### Copiar estos valores exactos:

```css
/* LILA (Tortas, Galletas, Detalles) */
#C8A5D8          /* Primary */
#B894C8          /* Secondary */
rgba(200, 165, 216, 0.1)    /* Background suave */
rgba(200, 165, 216, 0.4)    /* Shadow */
linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%)

/* DURAZNO (Alfajores, Brownies) */
#F9B58C          /* Primary */
#F4A67C          /* Secondary */
rgba(249, 181, 140, 0.1)    /* Background suave */
rgba(249, 181, 140, 0.4)    /* Shadow */
linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%)

/* NEUTROS */
#4A3C52          /* Texto oscuro */
#8B7B9A          /* Texto claro */
#FFFFFF          /* Blanco */
```

---

## 🔘 BOTÓN PRINCIPAL - COPIAR Y PEGAR

### Lila
```html
<button style="background: linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%); color: white; border: none; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1rem; font-weight: 600; cursor: pointer; box-shadow: 0 8px 20px rgba(200, 165, 216, 0.4); transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">
    Texto Aquí
</button>
```

### Durazno
```html
<button style="background: linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%); color: white; border: none; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1rem; font-weight: 600; cursor: pointer; box-shadow: 0 8px 20px rgba(249, 181, 140, 0.4); transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">
    Texto Aquí
</button>
```

---

## 📦 CARD DE PRECIO - COPIAR Y PEGAR

### Lila
```html
<div style="background: linear-gradient(135deg, rgba(200, 165, 216, 0.1), rgba(232, 212, 200, 0.1)); padding: 1.5rem; border-radius: 20px; margin-bottom: 1.5rem; border: 2px solid rgba(200, 165, 216, 0.2);">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h4 style="font-size: 1.2rem; color: #4A3C52; margin-bottom: 0.5rem;">Nombre</h4>
            <p style="color: #666; font-size: 0.9rem;">Descripción</p>
        </div>
        <div style="background: linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%); color: white; padding: 0.8rem 1.5rem; border-radius: 50px; font-weight: 600; font-size: 1.1rem;">
            $PRECIO
        </div>
    </div>
</div>
```

### Durazno
```html
<div style="background: linear-gradient(135deg, rgba(249, 181, 140, 0.1), rgba(244, 166, 124, 0.1)); padding: 1.5rem; border-radius: 20px; margin-bottom: 1.5rem; border: 2px solid rgba(249, 181, 140, 0.2);">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h4 style="font-size: 1.2rem; color: #4A3C52; margin-bottom: 0.5rem;">Nombre</h4>
            <p style="color: #666; font-size: 0.9rem;">Descripción</p>
        </div>
        <div style="background: linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%); color: white; padding: 0.8rem 1.5rem; border-radius: 50px; font-weight: 600; font-size: 1.1rem;">
            $PRECIO
        </div>
    </div>
</div>
```

---

## ✨ TRANSICIONES MÁS USADAS

```css
/* Default (usar en el 80% de casos) */
transition: all 0.3s ease;

/* Suave profesional (hover de cards) */
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Bounce (dropdowns) */
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Modal entrance */
transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
```

---

## 🎯 HOVER EFFECTS ESTÁNDAR

```css
/* Botones */
transform: translateY(-3px);
box-shadow: 0 12px 30px rgba(200, 165, 216, 0.5);

/* Cards */
transform: translateY(-10px);
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);

/* Links/Items */
transform: translateX(5px);

/* Imágenes */
transform: scale(1.05);
```

---

## 📏 DIMENSIONES ESTÁNDAR

### Border Radius
```
15px  → Pequeño (dropdown items)
20px  → Medio (cards, imágenes)
25px  → Botones pequeños
30px  → Cards grandes, modales
50px  → Botones principales
50%   → Círculos
```

### Padding
```
0.8rem 1.8rem  → Botones pequeños
1rem 2.5rem    → Botones grandes
1.5rem         → Cards normales
3rem           → Modales, cards grandes
```

### Gap (Grid/Flex)
```
0.6rem  → Items muy juntos (ícono + texto)
1rem    → Separación normal
2rem    → Entre secciones
4rem    → Entre columnas principales
```

### Font Size
```
0.85rem  → Dropdown items
0.9rem   → Descripciones pequeñas
0.95rem  → Botones pequeños
1rem     → Texto normal
1.1rem   → Precios
1.2rem   → Subtítulos (h4)
1.3rem   → Títulos sección (h3)
2rem     → Títulos principales (h2)
```

---

## 💫 BOX SHADOWS

```css
/* Suave - elementos sutiles */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

/* Media - cards normales */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

/* Fuerte - hover, destacados */
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);

/* Modal - máxima elevación */
box-shadow: 0 30px 90px rgba(0, 0, 0, 0.2);

/* Botón hover lila */
box-shadow: 0 12px 30px rgba(200, 165, 216, 0.4);

/* Botón hover durazno */
box-shadow: 0 12px 30px rgba(249, 181, 140, 0.4);
```

---

## 🖼️ VIDEO ESTÁNDAR

```html
<video style="width: 100%; display: block; border-radius: 20px;" autoplay muted loop playsinline>
    <source src="ruta/video.mp4" type="video/mp4">
</video>
```

---

## 🎨 SECTION HEADER DECORADO

```html
<div class="section-header-decorated">
    <div class="section-decoration-left"></div>
    <div class="section-title-wrapper">
        <h2 class="section-title-elegant">TÍTULO</h2>
    </div>
    <div class="section-decoration-right"></div>
</div>
<p class="section-subtitle-elegant-center">Subtítulo elegante</p>
```

---

## 🔗 LINKS WHATSAPP E INSTAGRAM

### WhatsApp
```html
<a href="https://wa.me/573023687321?text=Hola!%20Me%20interesa%20información%20sobre%20sus%20productos" target="_blank" rel="noopener noreferrer">WhatsApp</a>
```

### Instagram
```html
<a href="https://www.instagram.com/lauren.reposteria/" target="_blank" rel="noopener noreferrer">Instagram</a>
```

---

## ⚙️ JAVASCRIPT MODAL (Básico)

```javascript
// Abrir
modalOverlay.classList.add('active');
modalOverlay.style.opacity = '1';
modalOverlay.style.visibility = 'visible';
setTimeout(() => {
    modalContent.style.transform = 'scale(1)';
}, 10);

// Cerrar
modalContent.style.transform = 'scale(0.3)';
setTimeout(() => {
    modalOverlay.style.opacity = '0';
    modalOverlay.style.visibility = 'hidden';
}, 300);
```

---

## 📱 RESPONSIVE BREAKPOINT

```css
@media (max-width: 1024px) {
    /* Grid a 1 columna */
    .grid-2-cols {
        grid-template-columns: 1fr;
    }

    /* Padding reducido */
    .container {
        padding: 1.5rem;
    }
}
```

---

## 🎯 GRID 2 COLUMNAS ESTÁNDAR

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
    <div>Columna 1</div>
    <div>Columna 2</div>
</div>
```

**Responsive:**
```css
@media (max-width: 1024px) {
    grid-template-columns: 1fr;
}
```

---

## 🌟 BADGE "POPULAR"

```html
<div style="position: absolute; top: -12px; right: 20px; background: linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%); color: white; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
    Popular
</div>
```

---

## 🎨 BACKGROUND PATTERN (Body)

```css
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
        radial-gradient(circle at 20% 30%, rgba(249, 181, 140, 0.06) 0%, transparent 60%),
        radial-gradient(circle at 80% 70%, rgba(209, 181, 215, 0.04) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
}
```

---

## 📋 LISTA CON DOTS DECORATIVOS

```html
<div style="display: flex; align-items: center;">
    <span style="font-weight: 600;">Item</span>
    <span style="flex: 1; border-bottom: 2px dotted rgba(200, 165, 216, 0.3); margin: 0 1rem;"></span>
    <span style="font-weight: 700; color: #C8A5D8;">$Precio</span>
</div>
```

---

## 🔄 FLECHA ROTABLE (Dropdown)

```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="arrow" style="transition: transform 0.3s ease;">
    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**JavaScript:**
```javascript
// Abrir
arrow.style.transform = 'rotate(180deg)';
// Cerrar
arrow.style.transform = 'rotate(0deg)';
```

---

## 🎬 ANIMACIÓN FADE IN

```css
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Uso */
animation: fadeIn 0.8s ease-in-out;
```

---

## 🎪 HEADER (Altura fija)

```css
.minimal-header {
    height: 88px;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    background: #d1b5d7;
}

.logo-container {
    height: 85px;
}
```

---

## 💡 TIPS DE COPY/PASTE

### Cambiar todos los colores lila a durazno:
```
Buscar: #C8A5D8
Reemplazar: #F9B58C

Buscar: #B894C8
Reemplazar: #F4A67C

Buscar: rgba(200, 165, 216
Reemplazar: rgba(249, 181, 140
```

### Cambiar durazno a lila (inverso):
```
Buscar: #F9B58C
Reemplazar: #C8A5D8

Buscar: #F4A67C
Reemplazar: #B894C8

Buscar: rgba(249, 181, 140
Reemplazar: rgba(200, 165, 216
```

---

**Última actualización:** 2025-10-24

**Úsala así:**
1. Busca lo que necesitas
2. Copia el código
3. Pega en tu HTML/CSS
4. Personaliza el texto/valores
5. ✅ Listo!
