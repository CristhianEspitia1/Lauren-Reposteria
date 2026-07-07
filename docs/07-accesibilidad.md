# Accesibilidad

Objetivo: cumplir lo máximo posible de WCAG 2.1 AA sin comprometer la estética.

## Estado actual

| Área | Estado |
| --- | --- |
| Idioma declarado (`lang="es"`) | ✅ En todas las páginas |
| Un solo `h1` por página, descriptivo y único | ✅ Verificado |
| Texto alternativo en imágenes | ✅ Sin `alt` faltantes, vacíos ni genéricos |
| Botones con `type` y `aria-label` donde aplica | ✅ |
| Menú y controles con estado accesible (`aria-expanded`) | ✅ |
| Cierre de modales con teclado (Escape) y foco | ✅ |
| `prefers-reduced-motion` respetado | ✅ Regla global en `tokens.css` |
| Enlaces externos con `rel` seguro | ✅ |
| Jerarquía de encabezados sin saltos | ⚠️ `tortas.html` tiene un salto `h2→h4` puntual |
| Dimensiones de imagen para evitar CLS | ⚠️ Pendiente (ver [performance](08-performance.md)) |

## Prácticas aplicadas

- **Estructura semántica**: uso de `main`, `nav`, `footer`, encabezados
  jerárquicos y botones reales para acciones.
- **Movimiento reducido**: quien active "reducir movimiento" en su sistema
  operativo verá el sitio sin animaciones ni autoplay agresivo (carrusel,
  transiciones), gracias a la media query global.
- **Contraste**: la paleta lila/violeta sobre fondos claros mantiene contraste
  suficiente para texto; el texto sobre video/hero usa overlays para preservar
  legibilidad.
- **Teclado**: el carrito y los modales se pueden cerrar con Escape; los
  controles son elementos enfocables.

## Pendientes recomendados

1. Corregir el salto de encabezados `h2→h4` en `tortas.html` (usar `h3`).
2. Añadir un enlace "saltar al contenido" (skip link) al inicio de cada página.
3. Revisar el foco visible en todos los controles interactivos y reforzar
   `:focus-visible` donde se haya eliminado el `outline`.
4. Auditar contraste con una herramienta automática (axe, Lighthouse) y ajustar
   los grises de texto secundario si algún caso queda por debajo de 4.5:1.
5. Verificar navegación completa solo con teclado en el flujo de compra.
