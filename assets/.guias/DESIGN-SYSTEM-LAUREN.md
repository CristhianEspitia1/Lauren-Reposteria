# 🎨 DESIGN SYSTEM - LAUREN REPOSTERÍA

**Versión:** 1.0
**Última actualización:** 2025-10-24
**Propósito:** Guía completa de estilos, componentes y patrones de diseño para mantener consistencia en todas las páginas de Lauren.

---

## 📚 ÍNDICE

1. [Paleta de Colores](#paleta-de-colores)
2. [Tipografía](#tipografía)
3. [Espaciado y Dimensiones](#espaciado-y-dimensiones)
4. [Componentes](#componentes)
5. [Efectos y Transiciones](#efectos-y-transiciones)
6. [Nomenclatura y Convenciones](#nomenclatura-y-convenciones)
7. [Estructura de Páginas](#estructura-de-páginas)

---

## 🎨 PALETA DE COLORES

### Variables CSS (Root)
```css
:root {
    --primary-lilac: #C8A5D8;      /* Lila principal */
    --secondary-peach: #E8D4C8;    /* Durazno secundario */
    --dark-lilac: #B08BBB;         /* Lila oscuro */
    --light-lilac: #F5EBF2;        /* Lila claro */
    --white: #FFFFFF;              /* Blanco */
    --dark-text: #4A3C52;          /* Texto oscuro */
    --light-text: #8B7B9A;         /* Texto claro */
}
```

### Colores por Producto
| Producto | Color Principal | Gradiente |
|----------|----------------|-----------|
| **Tortas** | Lila `#C8A5D8` | `linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%)` |
| **Alfajores** | Durazno `#F9B58C` | `linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%)` |
| **Brownies** | Durazno `#F9B58C` | `linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%)` |
| **Galletas** | Lila `#C8A5D8` | `linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%)` |
| **Detalles** | Lila `#C8A5D8` | `linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%)` |

### Fondos y Overlays
```css
/* Fondo general de página */
background: linear-gradient(135deg, #FFFCFA 0%, #FFFAF7 25%, #FFF9F5 50%, #FFFAF7 75%, #FFFCFA 100%);
background-attachment: fixed;

/* Pattern sutil (::before en body) */
background-image:
    radial-gradient(circle at 20% 30%, rgba(249, 181, 140, 0.06) 0%, transparent 60%),
    radial-gradient(circle at 80% 70%, rgba(209, 181, 215, 0.04) 0%, transparent 60%),
    radial-gradient(circle at 50% 10%, rgba(249, 181, 140, 0.05) 0%, transparent 55%),
    radial-gradient(circle at 30% 90%, rgba(232, 212, 200, 0.05) 0%, transparent 55%);

/* Modal overlay con blur */
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
```

### Fondos de Cards (Sutiles)
```css
/* Durazno suave */
background: linear-gradient(135deg, rgba(249, 181, 140, 0.1), rgba(244, 166, 124, 0.1));

/* Lila suave */
background: linear-gradient(135deg, rgba(200, 165, 216, 0.1), rgba(232, 212, 200, 0.1));

/* Muy sutil (otras presentaciones) */
background: linear-gradient(135deg, rgba(249, 181, 140, 0.08), rgba(244, 166, 124, 0.08));
```

---

## 🔤 TIPOGRAFÍA

### Font Families
```css
/* Botones, títulos, elementos importantes */
font-family: 'Poppins', sans-serif;

/* Texto general, descripciones */
font-family: 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes
| Elemento | Tamaño | Uso |
|----------|--------|-----|
| Dropdown items | `0.85rem` | Items en menús desplegables |
| Descripciones | `0.9rem` | Subtextos, descripciones de productos |
| Botones pequeños | `0.95rem` | Botones secundarios, minimalistas |
| Texto normal | `1rem` | Párrafos, texto general |
| Precios | `1.1rem` | Precios en badges |
| Subtítulos | `1.2rem` | H4, nombres de productos |
| Títulos sección | `1.3rem` | H3, títulos de subsecciones |
| Títulos principales | `2rem` | H2, títulos de secciones |

### Font Weights
```css
font-weight: 500;  /* Regular mejorado - textos importantes */
font-weight: 600;  /* Semi-bold - botones, nombres, precios */
font-weight: 700;  /* Bold - títulos principales */
```

### Estilos de Texto Especiales
```css
/* Títulos uppercase con spacing */
text-transform: uppercase;
letter-spacing: 1px;

/* Títulos con gradiente (no usar mucho) */
background: linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 📐 ESPACIADO Y DIMENSIONES

### Padding Estándar
```css
padding: 0.8rem 1.8rem;  /* Botones pequeños/minimalistas */
padding: 1rem;           /* Pequeño - cards internos */
padding: 1rem 2.5rem;    /* Botones principales grandes */
padding: 1.5rem;         /* Medio - cards de precios */
padding: 2rem;           /* Grande - secciones */
padding: 3rem;           /* Extra grande - modales, cards principales */
padding: 3rem 2.5rem;    /* Cards de productos */
```

### Margins
```css
margin: 1.5rem 0;  /* Entre elementos cercanos */
margin: 2rem 0;    /* Entre secciones medianas */
margin: 3rem 0;    /* Entre secciones grandes */
```

### Gaps (Flexbox/Grid)
```css
gap: 0.6rem;   /* Items muy pequeños (íconos + texto) */
gap: 1rem;     /* General, lista de items */
gap: 1.5rem;   /* Cards en grid, elementos medianos */
gap: 2rem;     /* Cards grandes, columnas */
gap: 4rem;     /* Separación entre columnas principales */
```

### Border Radius
```css
border-radius: 15px;  /* Elementos pequeños (dropdown items) */
border-radius: 20px;  /* Cards normales, imágenes, badges */
border-radius: 25px;  /* Botones pequeños/minimalistas */
border-radius: 30px;  /* Cards grandes, modales */
border-radius: 50px;  /* Botones principales, pills, badges de precio */
border-radius: 50%;   /* Círculos perfectos (cerrar, dots) */
```

### Box Shadows
```css
/* Suave - elevación mínima */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

/* Media - cards normales */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

/* Fuerte - hover, destacados */
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);

/* Modal - máxima elevación */
box-shadow: 0 30px 90px rgba(0, 0, 0, 0.2);

/* Botón hover (con color lila) */
box-shadow: 0 12px 30px rgba(200, 165, 216, 0.4);

/* Botón hover (con color durazno) */
box-shadow: 0 12px 30px rgba(249, 181, 140, 0.4);

/* Botón WhatsApp hover */
box-shadow: 0 12px 30px rgba(37, 211, 102, 0.4);
```

---

## ✨ EFECTOS Y TRANSICIONES

### Transiciones Estándar
```css
/* General - usar por defecto */
transition: all 0.3s ease;

/* Solo transform (más performante) */
transition: transform 0.3s ease;

/* Opacidad/fade */
transition: opacity 0.4s ease;

/* Múltiples propiedades específicas */
transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
```

### Transiciones Especiales (Cubic Bezier)
```css
/* Bounce suave - dropdowns */
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Smooth professional - galerías, items importantes */
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Modal entrance - aparición dramática */
transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);

/* Fade suave */
transition: opacity 0.6s ease-in-out;
```

### Hover Effects Comunes

#### Elevación (translateY)
```css
/* Elevación suave - cards, botones */
transform: translateY(-3px);

/* Elevación media - cards grandes */
transform: translateY(-5px);

/* Elevación fuerte - elementos destacados */
transform: translateY(-10px);
```

#### Escala
```css
/* Escala sutil - imágenes, íconos */
transform: scale(1.05);

/* Escala + elevación - botones principales */
transform: translateY(-3px) scale(1.05);

/* Solo para dots/indicadores */
transform: scale(1.2);
```

#### Desplazamiento (translateX)
```css
/* Links, items de lista */
transform: translateX(5px);

/* Items de menú con animación */
transform: translateX(8px);
```

#### Rotación
```css
/* Flecha dropdown (abierto) */
transform: rotate(180deg);

/* Botón cerrar hover */
transform: rotate(90deg) scale(1.1);
```

### Estados de Botones
```css
/* Normal */
transform: scale(1);

/* Hover */
transform: translateY(-3px) scale(1.05);

/* Active (click) */
transform: translateY(-1px) scale(1.02);
```

---

## 🔘 COMPONENTES

Ver archivos detallados en `/componentes/`:
- `botones.md` - Todos los estilos de botones
- `carruseles.md` - Hero, sabores, vintage, infinito
- `modales.md` - Precios y generales
- `cards.md` - Productos, precios, sabores
- `dropdowns.md` - Contacto, toppings
- `headers.md` - Navegación y header fijo
- `footers.md` - Footer con redes sociales
- `decoraciones.md` - Líneas, ornamentos, patterns

---

## 📋 NOMENCLATURA Y CONVENCIONES

### Clases CSS
```
.nombre-componente           /* Componente principal */
.nombre-componente-parte     /* Parte del componente */
.nombre-componente.estado    /* Modificador de estado */
```

Ejemplos:
- `.pricing-modal-overlay`
- `.pricing-modal-content`
- `.pricing-modal.active`

### Estructura de Archivos
```
PaginaWebLauren/
├── index.html
├── tortas.html
├── alfajores.html
├── brownies-galletas.html
├── detalles.html
├── css/
│   └── tortas-styles.css
├── js/
│   └── tortas-script.js
├── assets/
│   ├── logos/
│   ├── imagenes-tortas/
│   ├── imagenes-alfajores/
│   ├── imagenes-brownies-galletas/
│   └── videos/
└── .guias/
    ├── DESIGN-SYSTEM-LAUREN.md
    ├── componentes/
    └── recetas/
```

### IDs vs Classes
- **IDs**: Solo para JavaScript (`#toppingsToggle`, `#browniePricesToggle`)
- **Classes**: Para estilos reutilizables (`.pricing-modal-overlay`)

### Orden de Secciones en Páginas
1. Header (fijo)
2. Hero section (video/carousel)
3. Introducción con logo
4. Contenido principal (sabores, precios, etc.)
5. Información adicional
6. Footer
7. Modales (fuera del flujo)
8. Scripts

---

## 🏗️ ESTRUCTURA DE PÁGINAS

### Template Básico
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lauren - [Producto]</title>
    <link rel="stylesheet" href="css/tortas-styles.css">
</head>
<body>
    <!-- Header -->
    <header class="minimal-header">...</header>

    <!-- Hero -->
    <section class="hero-main-carousel">...</section>

    <!-- Introducción -->
    <section class="intro-section-modern">...</section>

    <!-- Contenido principal -->
    <section class="[nombre-seccion]">...</section>

    <!-- Footer -->
    <footer class="modern-footer">...</footer>

    <!-- Modales -->
    <div class="pricing-modal-overlay">...</div>

    <!-- Scripts -->
    <script src="js/tortas-script.js"></script>
</body>
</html>
```

### Grid Layout para Productos
```css
/* 2 columnas (Brownies | Galletas) */
.split-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
}

/* Responsive */
@media (max-width: 1024px) {
    .split-container {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
}
```

---

## 📝 NOTAS DE VERSIÓN

### v1.0 (2025-10-24)
- Creación inicial del Design System
- Documentación completa de colores, tipografía y componentes
- Guías de uso para todos los elementos principales
- Recetas para casos comunes de implementación

---

## 🎯 CHECKLIST DE CONSISTENCIA

Antes de publicar una nueva página, verifica:

- [ ] Usa las variables de color correctas
- [ ] Border radius según tabla de dimensiones
- [ ] Transiciones con duración 0.3s (o especificadas)
- [ ] Box shadows según nivel de elevación
- [ ] Font family: Poppins para botones, Helvetica para texto
- [ ] Padding/margins según escala definida
- [ ] Header altura exacta: 88px
- [ ] Logo altura: 85px
- [ ] Botones con border-radius 25px o 50px
- [ ] Hover effects en todos los elementos interactivos
- [ ] Modales con overlay blur
- [ ] Responsive breakpoint a 1024px
