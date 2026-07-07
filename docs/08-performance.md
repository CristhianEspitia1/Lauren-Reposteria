# Performance

## Estrategia

El sitio es estático, por lo que el rendimiento depende sobre todo del **peso de
la media** y de la **estrategia de carga**.

## Media

- **Imágenes**: WebP generado por `scripts/optimize-assets.mjs` (calidad 76–86,
  redimensionado por tipo). Es el único formato servido en producción.
- **Video**: MP4 H.264 con `+faststart`, resolución y CRF ajustados por tipo de
  video (hero, tarjeta, historia). Variante móvil separada para el hero de inicio.
- Los originales pesados quedan fuera del deploy (ver
  [decisiones](03-decisiones-tecnicas.md), ADR-002).

## Carga diferida

`js/performance-optimizer.js` implementa lazy loading con `IntersectionObserver`:

- Las imágenes no críticas se sirven con un placeholder SVG y `data-src`; se
  cargan al acercarse al viewport.
- Los videos secundarios usan `preload="none"` y se activan de forma diferida.
- La media above-the-fold (hero) se mantiene con carga temprana para no penalizar
  el LCP.

## Fuentes

- Una sola petición a Google Fonts por página (Playfair Display + Inter) con
  `preconnect` y `display=swap`, lo que evita texto invisible durante la carga
  (FOIT) y reduce peticiones.
- Se eliminó una segunda petición de fuentes redundante que existía por página.

## CSS y JS

- Sin bundler: los archivos se sirven directos. `tokens.css` se carga primero
  para que las variables estén disponibles.
- Scripts al final del `<body>`, sin bloquear el render inicial.

## Core Web Vitals — estado y pendientes

| Métrica | Estado | Acción recomendada |
| --- | --- | --- |
| LCP | Aceptable | Servir el hero con `fetchpriority="high"` y poster liviano |
| CLS | **Mejorable** | Las imágenes no declaran `width`/`height`; añadir dimensiones o `aspect-ratio` en los contenedores para reservar espacio |
| INP | Bueno | Interacciones ligeras (vanilla) |

### CLS — nota importante

Actualmente las imágenes no incluyen atributos `width`/`height`, lo que puede
provocar saltos de layout al cargar. `assets/optimized/asset-map.json` contiene
las dimensiones de cada imagen optimizada; una fase futura puede usarlas para
añadir `width`/`height` (o fijar `aspect-ratio` en las tarjetas) sin distorsionar
el diseño responsive. Ver [roadmap](11-roadmap-y-pendientes.md).

## Verificación

Medir con Lighthouse o WebPageTest antes de campañas de alto tráfico y ajustar
CRF/resolución de video si la calidad visual lo permite.
