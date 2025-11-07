# 📄 RECETA: Agregar Nueva Página de Producto

**Tiempo estimado:** 15-20 minutos
**Dificultad:** Media

---

## 🎯 Objetivo
Crear una nueva página de producto (ej: cupcakes, postres, etc.) siguiendo el estándar de Lauren.

---

## 📋 CHECKLIST PREVIO

Antes de empezar, ten listo:
- [ ] Nombre del producto
- [ ] Color principal (lila o durazno)
- [ ] Imágenes del producto (mínimo 2 para carrusel)
- [ ] Video para hero (opcional pero recomendado)
- [ ] Lista de sabores/variaciones
- [ ] Precios y cantidades

---

## 🛠️ PASO 1: Crear Estructura de Archivos

### 1.1 Crear carpeta de imágenes
```bash
mkdir "C:\Users\crizc\OneDrive\Escritorio\PaginaWebLauren\assets\imagenes-[nombre-producto]"
mkdir "C:\Users\crizc\OneDrive\Escritorio\PaginaWebLauren\assets\imagenes-[nombre-producto]\Hero"
mkdir "C:\Users\crizc\OneDrive\Escritorio\PaginaWebLauren\assets\imagenes-[nombre-producto]\Galeria"
```

### 1.2 Copiar template base
Copia uno de estos archivos como base:
- **Producto con lila:** `tortas.html` o `galletas.html`
- **Producto con durazno:** `alfajores.html` o `brownies-galletas.html`

Renombra a: `[nombre-producto].html`

---

## 🎨 PASO 2: Personalizar Header y Metadatos

### 2.1 Actualizar `<title>` y meta tags
```html
<title>Lauren - [Nombre Producto] | [Descripción Corta]</title>
<meta name="description" content="[Descripción del producto]. Lauren Repostería - Medellín, Colombia.">
<meta name="keywords" content="[producto], [variación], Lauren, Medellín, Colombia">
```

### 2.2 Actualizar navegación activa
```html
<nav class="minimal-nav" id="minimalNav">
    <a href="index.html" class="nav-item">Inicio</a>
    <a href="tortas.html" class="nav-item">Tortas</a>
    <a href="alfajores.html" class="nav-item">Alfajores</a>
    <a href="brownies-galletas.html" class="nav-item">Brownies y Galletas</a>
    <a href="[nombre-producto].html" class="nav-item active">[Nombre]</a>
    <a href="detalles.html" class="nav-item">Detalles</a>
</nav>
```

---

## 🎬 PASO 3: Configurar Hero Section

### 3.1 Con un solo video
```html
<section class="hero-main-carousel">
    <div class="carousel-wrapper">
        <div class="hero-video-grid">
            <video class="hero-grid-video" autoplay muted loop playsinline>
                <source src="assets/imagenes-[nombre-producto]/Hero/video.mp4" type="video/mp4">
            </video>
        </div>
        <div class="hero-overlay"></div>
        <div class="hero-content-box">
            <img src="assets/logos/03_ LOGOS PNG LAUREN/LOGOS LAUREN PNG-59.png" alt="Lauren Logo" class="hero-logo-translucent">
        </div>
    </div>
</section>
```

### 3.2 Con carrusel de imágenes (estilo alfajores)
Ver archivo: `/componentes/carruseles.md` sección "Hero Carousel"

---

## 📝 PASO 4: Sección de Introducción

```html
<section class="intro-section-modern">
    <div class="container">
        <div class="intro-content-wrapper">
            <!-- Ícono flotante -->
            <div class="floating-icon-container">
                <img src="assets/logos/03_ LOGOS PNG LAUREN/LOGOS LAUREN PNG-18.png" alt="Lauren Icon" class="floating-logo-intro">
            </div>

            <!-- Header -->
            <div class="section-header-decorated">
                <div class="section-decoration-left"></div>
                <div class="section-title-wrapper">
                    <h2 class="section-title-elegant">[NOMBRE PRODUCTO]</h2>
                </div>
                <div class="section-decoration-right"></div>
            </div>

            <p class="section-subtitle-elegant-center">[Subtítulo atractivo]</p>
            <p class="intro-text-modern">[Descripción del producto, ingredientes, características especiales]</p>
        </div>
    </div>
</section>
```

---

## 🎨 PASO 5: Definir Color del Producto

En el `<head>`, agregar estilos personalizados:

### Opción A: Lila
```html
<style>
    /* Variables para este producto */
    :root {
        --product-primary: #C8A5D8;
        --product-secondary: #B894C8;
        --product-light: rgba(200, 165, 216, 0.1);
    }
</style>
```

### Opción B: Durazno
```html
<style>
    :root {
        --product-primary: #F9B58C;
        --product-secondary: #F4A67C;
        --product-light: rgba(249, 181, 140, 0.1);
    }
</style>
```

---

## 🖼️ PASO 6: Agregar Galería/Carrusel de Producto

### Grid con Video + Carrusel (estilo brownies)
```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;">
    <!-- Video -->
    <div style="border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
        <video style="width: 100%; display: block; border-radius: 20px;" autoplay muted loop playsinline>
            <source src="assets/imagenes-[producto]/video.mp4" type="video/mp4">
        </video>
    </div>

    <!-- Carrusel de Imágenes -->
    <div class="fillings-carousel producto-images-carousel" style="position: relative;">
        <div class="fillings-carousel-wrapper producto-images-wrapper">
            <div class="fillings-slide producto-img-slide active">
                <img src="assets/imagenes-[producto]/imagen1.jpg" alt="[Producto]" class="fillings-img" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
            </div>
            <div class="fillings-slide producto-img-slide">
                <img src="assets/imagenes-[producto]/imagen2.jpg" alt="[Producto]" class="fillings-img" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
            </div>
        </div>
        <div class="fillings-indicators producto-images-indicators">
            <span class="fillings-dot producto-img-dot active" data-slide="0"></span>
            <span class="fillings-dot producto-img-dot" data-slide="1"></span>
        </div>
    </div>
</div>
```

**JavaScript requerido:** Ver `/componentes/carruseles.md`

---

## 💰 PASO 7: Agregar Precios

### Opción A: Modal (recomendado)
```html
<!-- Botón -->
<button id="productoPricesToggle" style="background: linear-gradient(135deg, var(--product-primary) 0%, var(--product-secondary) 100%); color: white; border: none; padding: 0.8rem 1.8rem; border-radius: 25px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">
    Precios y Cantidades
</button>

<!-- Modal -->
<!-- Ver /componentes/modales.md para código completo -->
```

### Opción B: Cards directas
```html
<div style="background: linear-gradient(135deg, var(--product-light), var(--product-light)); padding: 1.5rem; border-radius: 20px; margin-bottom: 1.5rem; border: 2px solid rgba(var(--product-primary), 0.2);">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h4 style="font-size: 1.2rem; color: var(--dark-text); margin-bottom: 0.5rem;">[Nombre]</h4>
            <p style="color: #666; font-size: 0.9rem;">[Descripción]</p>
        </div>
        <div style="background: linear-gradient(135deg, var(--product-primary) 0%, var(--product-secondary) 100%); color: white; padding: 0.8rem 1.5rem; border-radius: 50px; font-weight: 600; font-size: 1.1rem;">
            $[PRECIO]
        </div>
    </div>
</div>
```

---

## 📱 PASO 8: Agregar Footer

Copiar footer de cualquier página existente (son idénticos).

---

## ⚙️ PASO 9: JavaScript

### 9.1 Incluir scripts
```html
<script src="js/tortas-script.js"></script>
```

### 9.2 Agregar scripts específicos
Si tienes carruseles, dropdowns o modales, agregar el JavaScript correspondiente.

Ver archivos en `/componentes/` para códigos específicos.

---

## 🎨 PASO 10: Personalización de Colores

Reemplazar todos los colores hardcodeados con las variables:

**Buscar y reemplazar:**
- `#C8A5D8` → `var(--product-primary)` (si es lila)
- `#F9B58C` → `var(--product-primary)` (si es durazno)

---

## 🔗 PASO 11: Agregar a Navegación Principal

Actualizar `index.html` y todas las demás páginas:

```html
<nav class="minimal-nav">
    ...
    <a href="[nombre-producto].html" class="nav-item">[Nombre]</a>
    ...
</nav>
```

---

## ✅ CHECKLIST FINAL

Antes de publicar, verificar:

- [ ] Título y meta tags actualizados
- [ ] Navegación activa en la página correcta
- [ ] Hero section funcional
- [ ] Imágenes optimizadas y cargando
- [ ] Videos en autoplay, loop, muted
- [ ] Colores consistentes con design system
- [ ] Botones con hover effects
- [ ] Modales funcionando correctamente
- [ ] JavaScript sin errores en consola
- [ ] Responsive en móvil (probar breakpoint 1024px)
- [ ] Links de WhatsApp/Instagram actualizados
- [ ] Footer presente y completo
- [ ] Scroll to top funcionando
- [ ] Sin errores 404 en imágenes/videos

---

## 🐛 Solución de Problemas Comunes

### Video no se reproduce
```javascript
// Agregar este script
document.querySelectorAll('video').forEach(video => {
    video.play().catch(e => console.log('Autoplay blocked:', e));
});
```

### Carrusel no cambia
- Verificar que los IDs sean únicos
- Revisar que el JavaScript esté incluido
- Comprobar nombres de clases

### Colores incorrectos
- Verificar variables CSS en `:root`
- Usar buscar/reemplazar para colores hardcodeados

---

## 📚 Referencias

- Design System completo: `/.guias/DESIGN-SYSTEM-LAUREN.md`
- Botones: `/.guias/componentes/botones.md`
- Modales: `/.guias/componentes/modales.md`
- Carruseles: `/.guias/componentes/carruseles.md`
