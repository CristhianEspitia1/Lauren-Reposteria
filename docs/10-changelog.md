# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/).
Este proyecto no usa versiones semánticas publicadas; se registra por fecha de
auditoría/cambio.

## [Auditoría de julio 2026]

Auditoría técnica y refactorización integral. Base de código profesionalizada sin
alterar la identidad visual ni la funcionalidad de cara al cliente.

### Añadido
- `robots.txt`, `sitemap.xml` y `404.html` personalizado on-brand.
- `css/tokens.css`: sistema centralizado de design tokens.
- `scripts/dev-server.mjs`: servidor local con soporte de *Range* para video y 404.
- Carpeta `docs/` con documentación de arquitectura, estructura, decisiones,
  componentes, guía de estilos, convenciones, performance, SEO, accesibilidad y
  seguridad.
- Metadatos SEO y `schema.org` donde faltaban.

### Cambiado
- **Nombres de assets** migrados a `kebab-case` ASCII (293 archivos) y `slug`
  integrado en el pipeline de optimización para mantener la convención.
- Consolidación de la carga de fuentes en una sola petición por página.
- Unificación de tokens de color, tipografía y espaciado.

### Eliminado
- Carpeta `fonts/` (11 MB, familia no utilizada y con rutas locales de Windows).
- Cinco assets optimizados sin referencia alguna en el código.
- Archivos de sistema `._*` y `.DS_Store` del árbol de trabajo.

### Corregido
- Rutas de assets frágiles (espacios, tildes, emojis, mayúsculas) que podían
  romper en GitHub Pages.
- (Ver el informe de auditoría para el detalle completo de correcciones de
  accesibilidad, seguridad, copy y consistencia.)

---

> Historial previo: ver `git log`. Antes de esta auditoría el proyecto había
> tenido una revisión en mayo de 2026 centrada en heroes, media y limpieza de
> guías obsoletas.
