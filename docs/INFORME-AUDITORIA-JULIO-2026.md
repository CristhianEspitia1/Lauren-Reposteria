# Informe de auditoría técnica — Lauren Repostería

**Fecha:** julio de 2026
**Alcance:** auditoría integral (arquitectura, HTML/SEO, CSS, JavaScript,
accesibilidad, rendimiento, seguridad, consistencia, media, copy y documentación)
con corrección directa y verificación en navegador.

---

## 1. Resumen ejecutivo

El sitio partía de una base funcional pero con deuda técnica típica de un
proyecto crecido por iteraciones: nombres de archivo frágiles, fuentes rotas,
código muerto, un vector de XSS en el carrito, falta de infraestructura SEO y
finales de línea mixtos. Se corrigieron todos estos puntos **sin alterar la
identidad visual ni la funcionalidad de cara al cliente**, se generó
documentación profesional en `docs/` y se dejaron las mejoras de mayor riesgo
documentadas como fases futuras.

Todas las páginas se verificaron en navegador (móvil y escritorio): cargan sin
errores de consola, sin peticiones fallidas y sin desbordamiento horizontal. El
flujo de compra (modal → opciones → carrito → WhatsApp) funciona de extremo a
extremo.

---

## 2. Problemas encontrados

### Críticos / Altos

1. **XSS persistente en el carrito.** `cart-ui.js` insertaba en el DOM datos del
   carrito —incluida la *personalización*, texto libre del usuario— sin escapar.
   Como el carrito se guarda en `localStorage` y se re-renderiza en cada carga,
   un valor con HTML se ejecutaba de forma persistente (o rompía la interfaz).
2. **Fuentes rotas y no cargadas.** La carpeta `fonts/` (11 MB) apuntaba a rutas
   locales de Windows (`file:///C:/…`) y no la enlazaba ninguna página. El CSS
   declaraba seis familias, pero Montserrat y Outfit nunca se descargaban.
3. **Nombres de archivo frágiles.** Assets con espacios, tildes, emojis,
   mayúsculas y puntos internos (p. ej. un `.mp4` con emoji, `imagenes.brownies.galletas/`).
   Funcionaban en macOS pero podían romper en GitHub Pages (sensible a
   mayúsculas).
4. **Sin infraestructura SEO.** No existían `robots.txt`, `sitemap.xml`, página
   `404` ni datos estructurados `schema.org`.

### Medios

5. **Código muerto.** Dos módulos de modal (`product-modal-simple.js`,
   `modal-handler.js`) cargados solo por la portada, sin ningún disparador que
   los activara; cinco assets optimizados sin referencia; carpeta `fonts/`.
6. **Carga de fuentes duplicada.** Cada página hacía dos peticiones a Google
   Fonts (con `preconnect` repetidos) para cargar familias solapadas.
7. **Finales de línea mixtos** (CRLF/LF) entre archivos.
8. **Formato de precio inconsistente** entre el carrito (`$ 176.000`, vía `Intl`)
   y el resto del sitio (`$176.000`).
9. **Lectura de `localStorage` sin validar forma** en el carrito (tolerante a
   errores de parseo, pero no a datos con forma inválida).

### Bajos / Higiene

10. Salto de encabezados `h2→h4` en `tortas.html`.
11. Imágenes sin `width`/`height` (riesgo de CLS).
12. `<link>` inválido embebido dentro de un comentario en `luxury-footer.css`.
13. Archivos de sistema `._*`/`.DS_Store` en el árbol de trabajo.
14. `tabla-productos.html` (editor interno) sin `noindex`.

---

## 3. Cambios realizados

### Arquitectura y limpieza
- Eliminada la carpeta `fonts/` (11 MB) y cinco assets optimizados sin referencia.
- **Migración de 293 assets a `kebab-case` ASCII** con reescritura de referencias
  en 13 archivos y en `asset-map.json`; `slug` integrado en `optimize-assets.mjs`
  para mantener la convención. Masters `.mov` movidos a `media-fuente/` (ignorado).
- Eliminado el sistema de modal huérfano de la portada (2 archivos JS + bloque
  HTML inerte); el sitio queda con **un único sistema de modal**.
- Normalización de finales de línea a **LF** + `.gitattributes`.
- Limpieza de archivos `._*`/`.DS_Store`.

### SEO
- Creados `robots.txt`, `sitemap.xml` (5 páginas) y `404.html` on-brand.
- Añadidos datos estructurados `schema.org/Bakery` (JSON-LD) en la portada.
- `noindex` en el editor interno `tabla-productos.html`.

### HTML / Accesibilidad
- Corregido el salto de encabezados `h2→h4` en `tortas.html`.
- Verificado: `h1` único por página, cobertura total de `alt`, botones con
  `type`, enlaces externos con `rel="noopener noreferrer"`.

### CSS / Consistencia visual
- Nuevo `css/tokens.css`: fuente única de color, tipografía, espaciado, sombra,
  radio, `z-index` y una regla global de `prefers-reduced-motion`.
- **Tipografía unificada a dos familias** (Playfair Display + Inter). Familias
  huérfanas (Montserrat/Outfit/Manrope) normalizadas a Inter; `body` base pasado
  a Inter.

### Rendimiento
- Carga de fuentes consolidada en **una sola petición por página** con
  `preconnect` y `display=swap`.

### JavaScript / Seguridad
- **Escape de todo dato dinámico** en `cart-ui.js` (`escapeHtml`) — corrige el
  XSS persistente. Verificado con payloads.
- Validación de forma de los datos de `localStorage` en `cart-manager.js`.
- Formato de precio unificado a `$X.000`.

### Documentación
- Carpeta `docs/` con 12 documentos (arquitectura, estructura, decisiones,
  componentes, convenciones, guía de estilos, accesibilidad, performance,
  seguridad, changelog, roadmap y este informe).
- README, `PROBLEMAS-PENDIENTES.md` y guía de mantenimiento actualizados.
- Nuevo `scripts/dev-server.mjs` (servidor local con Range de video y 404).

---

## 4. Justificación de decisiones importantes

- **Mantener el sitio estático sin build** (ADR-001): el negocio despliega con un
  simple push; introducir un bundler añadiría un punto de fallo sin beneficio
  claro para el tamaño del proyecto.
- **No reescribir `mobile-fixes.css`** (379 `!important`): funciona y el sitio se
  ve correcto en móvil. Reescribirlo a ciegas arriesga romper el layout de 5
  páginas en producción. Se documenta como fase futura por lotes con verificación.
- **No migrar en masa las imágenes a `width`/`height`**: hacerlo mal distorsiona
  el diseño responsive. Se deja el enfoque concreto (usar `asset-map.json` o
  `aspect-ratio`) documentado.
- **Conservar los datos de contacto actuales**: el sitio ya es coherente
  (`573104442796`, `laurenreposteria22`); la confirmación formal corresponde al
  negocio, no a la auditoría.
- **Unificar tipografía sin cambio visual perceptible**: Montserrat/Outfit nunca
  se cargaban (caían a `sans-serif`), por lo que estandarizar en Inter no altera
  lo que el usuario ya veía y elimina inconsistencia.

---

## 5. Riesgos y limitaciones

- **Cambios de gran diff.** La migración de nombres y la normalización LF generan
  un diff extenso; se recomienda revisar por bloques temáticos.
- **Fuentes de media locales.** Los originales pesados siguen fuera de git; mover
  el proyecto de máquina requiere copiarlos aparte.
- **Deuda pendiente conocida.** `mobile-fixes.css`, CSS inline por página y CLS de
  imágenes siguen presentes; están priorizados en el [roadmap](11-roadmap-y-pendientes.md).
- **Sin commit automático.** Los cambios quedan en el árbol de trabajo; no se
  commiteó nada (a la espera de decisión del responsable).

---

## 6. Recomendaciones para futuras fases

Ver el [roadmap](11-roadmap-y-pendientes.md). En orden de valor/riesgo:

1. Dimensiones de imagen para eliminar CLS (usar `asset-map.json`).
2. Skip link de teclado y auditoría de foco visible.
3. Imágenes Open Graph por página (hoy comparten el logo).
4. Reducir `mobile-fixes.css` por lotes, eliminando `!important`.
5. Consolidar `tortas-data.js`/`alfajores-data.js` en `catalog-data.js`.
6. Migrar el CSS inline de las páginas a archivos compartidos.
7. Content-Security-Policy y cabeceras de seguridad.
8. Sistema de componentes para eliminar la duplicación de cabecera/pie.

**Confirmar con el negocio:** número de WhatsApp, Instagram y TikTok oficiales.
