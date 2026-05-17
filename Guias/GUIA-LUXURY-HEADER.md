# 🎨 Guía de Uso - Luxury Header

Header premium con navegación flotante tipo "pill" y hero section elegante.

---

## 📁 Archivos

- **CSS**: `css/luxury-header.css`
- **HTML Demo**: `html/luxury-header-modular.html`

---

## 🎯 Características

✅ **Navegación flotante** con efecto glassmorphism  
✅ **Logo central** en tipografía Serif Italic (Playfair Display)  
✅ **Enlaces laterales** con animación de subrayado  
✅ **Hero section** con animaciones fade-up  
✅ **Línea vertical decorativa** al final del hero  
✅ **Diseño responsivo** (desktop, tablet, móvil)  
✅ **Fácil personalización** mediante variables CSS  

---

## 🛠️ Integración en tu Proyecto

### 1. Agregar las fuentes de Google

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 2. Vincular el CSS

```html
<link rel="stylesheet" href="css/luxury-header.css">
```

### 3. Copiar el HTML del Header y Hero

Copia las secciones `<nav class="luxury-nav-container">` y `<section class="luxury-hero">` del archivo demo.

---

## ✏️ Personalización Fácil

### Cambiar Textos

#### Logo
```html
<a href="inicio.html" class="luxury-nav-logo">TU LOGO AQUÍ</a>
```

#### Badge
```html
<span class="luxury-badge">Est. 2024</span>
```

#### Título del Hero
```html
<h1 class="luxury-hero-title">
    <span class="line-1">Tu Título</span>
    <span class="line-2">Principal</span>
</h1>
```

#### Subtítulo
```html
<p class="luxury-hero-subtitle">
    Tu descripción aquí. Puedes escribir lo que quieras.
</p>
```

---

## 🎨 Personalizar Colores y Estilos

Edita las **variables CSS** en `luxury-header.css`:

```css
:root {
    /* Colores principales */
    --luxury-primary: #1a1a1a;
    --luxury-accent: #b8a4d4;        /* Color acento (lila) */
    --luxury-accent-soft: #d4c4e8;   /* Color acento suave */
    --luxury-white: #ffffff;
    --luxury-bg: #fafafa;            /* Fondo general */
    
    /* Espaciado */
    --nav-top-spacing: 2rem;         /* Distancia del nav al top */
    --nav-blur: 16px;                /* Intensidad del blur */
}
```

---

## 📐 Estructura del Header

```html
<nav class="luxury-nav-container">
    <div class="luxury-nav-pill">
        <div class="luxury-nav-content">
            <!-- 2 enlaces izquierda -->
            <ul class="luxury-nav-links left">
                <li><a href="#" class="luxury-nav-link">Link 1</a></li>
                <li><a href="#" class="luxury-nav-link">Link 2</a></li>
            </ul>
            
            <!-- Logo central -->
            <a href="#" class="luxury-nav-logo">Logo</a>
            
            <!-- 2 enlaces derecha -->
            <ul class="luxury-nav-links right">
                <li><a href="#" class="luxury-nav-link">Link 3</a></li>
                <li><a href="#" class="luxury-nav-link">Link 4</a></li>
            </ul>
        </div>
    </div>
</nav>
```

---

## 📱 Comportamiento Responsive

### Desktop (> 768px)
- Nav flotante centrado con 4 enlaces + logo central
- Hero con título gigante

### Tablet (768px - 1024px)
- Nav con espaciado reducido
- Tamaños de fuente ajustados

### Móvil (< 768px)
- **Solo se muestra el logo** (los enlaces se ocultan)
- Nav más compacto (top: 1rem)
- Hero con tamaños de fuente optimizados

---

## 🔧 Añadir Más Enlaces

Para agregar más enlaces, simplemente añade elementos `<li>` dentro de `luxury-nav-links`:

```html
<ul class="luxury-nav-links left">
    <li><a href="productos.html" class="luxury-nav-link">Productos</a></li>
    <li><a href="galeria.html" class="luxury-nav-link">Galería</a></li>
    <li><a href="nosotros.html" class="luxury-nav-link">Nosotros</a></li>
</ul>
```

---

## 💡 Consejos de Diseño

1. **Logo**: Mantén el texto corto (idealmente 1 palabra) para mejor visual
2. **Enlaces**: Máximo 2-3 enlaces por lado para no sobrecargar
3. **Título Hero**: 2 líneas funciona mejor. Primera línea normal, segunda en cursiva
4. **Badge**: Usa para mensajes cortos tipo "Est. 2022", "Premium", "New"
5. **Subtítulo**: Máximo 2 frases para mantener claridad

---

## 🎬 Animaciones

Todas las animaciones están incluidas y se ejecutan automáticamente:

- **Nav**: Slide down desde arriba (0.8s)
- **Badge**: Fade up (1s, delay 0.2s)
- **Título línea 1**: Fade up (1s, delay 0.4s)
- **Título línea 2**: Fade up (1s, delay 0.6s)
- **Subtítulo**: Fade up (1s, delay 0.8s)
- **Línea decorativa**: Fade up (1s, delay 1s)

---

## 🌟 Ejemplo de Uso Completo

Ver archivo: `html/luxury-header-modular.html`

---

## 📞 Notas Adicionales

- **Glassmorphism** funciona mejor sobre fondos con contenido (imágenes, videos)
- El efecto **backdrop-filter** puede no funcionar en navegadores muy antiguos
- Para mejor rendimiento, usa **imágenes optimizadas** en el fondo

---

**¡Listo para usar! 🚀**
