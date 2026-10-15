# Decisiones técnicas (ADR)

Registro ligero de decisiones de arquitectura. Cada entrada explica el contexto,
la decisión y sus consecuencias, para no re-litigarlas más adelante.

## ADR-001 — Mantener sitio estático sin build

**Contexto.** El proyecto es un catálogo de repostería con pedido por WhatsApp.
No hay backend, autenticación ni contenido dinámico de servidor. El equipo que lo
mantiene no es de perfil técnico avanzado.

**Decisión.** Conservar HTML/CSS/JS plano servido por GitHub Pages, sin bundler
ni framework. Node solo para herramientas locales (`scripts/`).

**Consecuencias.** Publicación sencilla mediante el flujo autorizado de GitHub Pages. Sin paso de build que pueda
romperse. A cambio, se asume algo de duplicación de HTML (cabecera/pie repetidos
por página) que se controla con convenciones y verificación, no con componentes.

## ADR-002 — `assets/optimized` como único origen de media en producción

**Decisión.** El runtime referencia solo media optimizada: fotografías WebP en
`assets/propuestas-fotograficas/` (con copias responsive) y el video MP4 H.264 en
`assets/optimized/`. El repositorio no guarda originales ni material de referencia.

**Consecuencias.** El repositorio y el deploy pesan mucho menos. Las copias
responsive se regeneran con `scripts/optimize-photography.mjs`.

## ADR-003 — Convención de nombres kebab-case ASCII para assets

**Contexto.** El proyecto contenía rutas con espacios, tildes, emojis, mayúsculas
y puntos internos (`imagenes.brownies.galletas/`, `Oso Pequeño.jpg`, un `.mp4`
con emoji). Funcionaban en macOS (insensible a mayúsculas) pero son frágiles en
GitHub Pages.

**Decisión.** Todos los assets usan nombres `kebab-case` ASCII.

**Consecuencias.** URLs robustas y predecibles.

## ADR-004 — Tipografías: Playfair Display + Inter

**Contexto.** El CSS declaraba seis familias (`Montserrat`, `Inter`,
`Playfair Display`, `Outfit`, `Manrope`, `Helvetica Neue`), pero Google Fonts solo
cargaba Playfair + Inter (+ Manrope en un segundo `<link>` para el pie).
`Montserrat` y `Outfit` nunca se descargaban y caían al `sans-serif` del sistema.

**Decisión.** Estandarizar en **Playfair Display** (títulos display) e **Inter**
(texto). Un único `<link>` de Google Fonts por página con `display=swap`.

**Consecuencias.** Menos peticiones, comportamiento tipográfico predecible y
consistente entre módulos. Los elementos que declaraban `Montserrat`/`Outfit`
ya renderizaban con el fallback del sistema, así que la unificación no altera su
apariencia actual.

## ADR-005 — Design tokens centralizados en `css/tokens.css`

**Contexto.** El lila de marca estaba definido con valores distintos en tres
archivos (`#C8A5D8`, `#b8a4d4`), junto a colores de texto y sombras divergentes.

**Decisión.** Crear `css/tokens.css` como única fuente de variables de diseño
(color, tipografía, espaciado, sombra, radio, transición, `z-index`), cargado
primero en cada página.

**Consecuencias.** Un solo lugar para ajustar la identidad visual. Reduce el
riesgo de inconsistencias al añadir páginas o componentes.

## ADR-006 — Persistencia del carrito en `localStorage`

**Decisión.** El carrito se guarda en `localStorage` para persistir entre páginas
del sitio estático (no hay sesión de servidor).

**Consecuencias.** El estado sobrevive a la navegación y a recargas. Requiere
lectura defensiva (`try/catch` y validación de forma) porque el contenido es
manipulable por el usuario y podría corromperse; los datos se escapan al
renderizarse para evitar XSS persistente.


## ADR-007 — Identidad y reglas compartidas, septiembre de 2026

**Decisión.** Reemplazar las capas visuales superpuestas por tokens y cuatro hojas compartidas. Conservar la paleta y tipografías de Lauren, con composición editorial e iconos SVG originales. Retirar los catálogos duplicados por categoría; `catalog-data.js` y `catalog-model.js` gobiernan todas las páginas y el pedido.

**Consecuencias.** Una corrección de precio, validación o control se aplica al recorrido completo. Los diálogos nativos aportan foco y Escape sin dependencias. La cabecera/pie permanecen en HTML por página y deben actualizarse de forma consistente.

## ADR-008 — Cotizar cuando la unidad de precio no está confirmada

El dato heredado de alfajores personalizados es ambiguo. Se conserva su importe interno y se usa `quoteOnly: true` para ofrecer una consulta con opciones y mensaje. No inferir una nueva tarifa. La decisión comercial pendiente vive en `PROBLEMAS-PENDIENTES.md`.

## ADR-009 — Un solo diseño

Se evaluaron cuatro propuestas visuales y se eligió la original (Esencia). Las alternativas, su comparador y las páginas de revisión de fotos e iconos se retiraron en octubre de 2026 para no mantener código sin uso.
