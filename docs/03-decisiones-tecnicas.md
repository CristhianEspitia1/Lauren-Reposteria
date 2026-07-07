# Decisiones técnicas (ADR)

Registro ligero de decisiones de arquitectura. Cada entrada explica el contexto,
la decisión y sus consecuencias, para no re-litigarlas más adelante.

## ADR-001 — Mantener sitio estático sin build

**Contexto.** El proyecto es un catálogo de repostería con pedido por WhatsApp.
No hay backend, autenticación ni contenido dinámico de servidor. El equipo que lo
mantiene no es de perfil técnico avanzado.

**Decisión.** Conservar HTML/CSS/JS plano servido por GitHub Pages, sin bundler
ni framework. Node solo para herramientas locales (`scripts/`).

**Consecuencias.** Despliegue trivial (git push). Sin paso de build que pueda
romperse. A cambio, se asume algo de duplicación de HTML (cabecera/pie repetidos
por página) que se controla con convenciones y verificación, no con componentes.

## ADR-002 — `assets/optimized` como único origen de media en producción

**Decisión.** Todo el runtime referencia `assets/optimized/…` (WebP para imagen,
MP4 H.264 para video). Las fuentes pesadas quedan locales e ignoradas por git.

**Consecuencias.** El repositorio y el deploy pesan mucho menos. El pipeline
`optimize-assets.mjs` regenera la salida de forma reproducible. Riesgo: si el
proyecto se mueve de máquina, hay que copiar las fuentes locales aparte.

## ADR-003 — Convención de nombres kebab-case ASCII para assets

**Contexto.** El proyecto contenía rutas con espacios, tildes, emojis, mayúsculas
y puntos internos (`imagenes.brownies.galletas/`, `Oso Pequeño.jpg`, un `.mp4`
con emoji). Funcionaban en macOS (insensible a mayúsculas) pero son frágiles en
GitHub Pages.

**Decisión.** Migrar todos los assets a `kebab-case` ASCII e integrar el `slug`
en `optimize-assets.mjs` para que la salida sea siempre limpia e idempotente.

**Consecuencias.** URLs robustas y predecibles. Se reescribieron las referencias
en HTML/JS/CSS y `asset-map.json` en una migración única y verificada.

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
