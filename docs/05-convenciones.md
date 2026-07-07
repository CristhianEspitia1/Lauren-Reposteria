# Convenciones

Reglas para mantener el proyecto coherente a medida que crece. Se prioriza la
simplicidad: es un sitio estático sin build, así que las convenciones deben poder
seguirse a mano.

## Nombres de archivos y assets

**Regla:** `kebab-case`, solo ASCII, sin espacios, sin tildes, sin emojis, sin
mayúsculas, sin puntos internos.

- Correcto: `hero-alfajores-video-1.mp4`, `detalle-golden-rosa.webp`, `oso-pequeno.jpg`
- Evitar: `WhatsApp Video 2025-10-22 at 18.49.06.mp4`, `Detalle Golden Rosa.jpg`,
  `Oso Pequeño.jpg`, `imagenes.brownies.galletas/`

Motivo: GitHub Pages y muchos servidores distinguen mayúsculas/minúsculas y
manejan mal los caracteres especiales en URLs. Un nombre "sucio" funciona en
local (macOS, insensible a mayúsculas) pero rompe en producción.

El pipeline `scripts/optimize-assets.mjs` aplica automáticamente este `slug` al
generar la salida en `assets/optimized`, así que basta con optimizar cualquier
fuente nueva para obtener nombres correctos.

## Carpetas de media

- `assets/imagenes-<modulo>/` para las fuentes (local, ignorado por git).
- `assets/optimized/<misma-ruta>/` para la salida desplegable.
- `media-fuente/` para masters de video `.mov` sin procesar (local, ignorado).

## HTML

- Un solo `<h1>` por página, jerarquía de encabezados sin saltos (`h2` → `h3`…).
- `lang="es"` en `<html>`; textos en español de Colombia.
- Botones que ejecutan acciones: `<button type="button">`. Enlaces para navegar:
  `<a>`. No usar `<a>` con `href="#"` para acciones.
- Toda imagen lleva `alt` descriptivo (vacío `alt=""` solo si es decorativa).
- Enlaces externos con `target="_blank"` llevan `rel="noopener noreferrer"`.
- Media above-the-fold (hero): sin `loading="lazy"`. Resto de imágenes: `loading="lazy"`
  con `data-src` gestionado por `performance-optimizer.js`.

## CSS

- Colores, espaciados, sombras, radios, tipografías y `z-index` salen de
  variables definidas en `css/tokens.css`. No hardcodear valores repetidos.
- Breakpoints estándar: `480px`, `768px`, `1024px`.
- Evitar `!important`. Si aparece, es señal de un conflicto de especificidad que
  conviene resolver en origen.
- Clases descriptivas por componente (`cart-item`, `hero-video`, `product-card`).

## JavaScript

- `const`/`let`, nunca `var`.
- Datos de producto centralizados en `js/catalog-data.js` cuando sea posible.
- Toda inserción de datos dinámicos en el DOM debe escaparse (ver
  `docs/09-seguridad.md`).
- `JSON.parse` sobre `localStorage` siempre dentro de `try/catch`.
- Idioma del código: identificadores y comentarios en español; se aceptan
  términos técnicos en inglés cuando son estándar (`localStorage`, `fetch`).

## Textos y copy

- Español de Colombia, tono cálido y cercano, sin anglicismos innecesarios.
- Mayúsculas al estilo español (solo la primera palabra y nombres propios), no
  Title Case anglosajón.
- Formato de precio unificado: `$22.000` (punto de miles, sin decimales,
  sin espacio tras el símbolo).
- CTA de compra unificado: **"Pedir por WhatsApp"**.

## Git

- Versionar únicamente assets optimizados; nunca las fuentes pesadas.
- No subir `.DS_Store`, `._*`, zips de branding ni `.mov`.
