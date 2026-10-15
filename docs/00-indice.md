# Documentación — Lauren Repostería

Documentación técnica del sitio. Punto de entrada para cualquier persona que
retome el proyecto.

La fuente de identidad es el brandbook de Lauren. Su aplicación a la web, paleta, tipografías y recursos vectoriales se documentan en la [guía de estilos](06-guia-de-estilos.md).

## Índice

1. [Arquitectura](01-arquitectura.md) — visión general del sistema y flujo.
2. [Estructura del proyecto](02-estructura-del-proyecto.md) — carpetas y qué se despliega.
3. [Decisiones técnicas (ADR)](03-decisiones-tecnicas.md) — por qué se hizo cada cosa.
4. [Componentes](04-componentes.md) — módulos JS y componentes de UI.
5. [Convenciones](05-convenciones.md) — reglas de nombres, HTML, CSS, JS y copy.
6. [Guía de estilos](06-guia-de-estilos.md) — color, tipografía, espaciado, componentes visuales.
7. [Accesibilidad](07-accesibilidad.md) — prácticas implementadas y alcance de comprobación.
8. [Performance](08-performance.md) — estrategia de rendimiento y media.
9. [Seguridad](09-seguridad.md) — modelo de amenazas y prácticas.
10. [Changelog](10-changelog.md) — histórico de cambios.
11. [SEO](11-seo.md) — URLs, metadatos, datos estructurados, sitemap y tareas externas.
11. [Pendientes](../PROBLEMAS-PENDIENTES.md) — decisiones comerciales abiertas.

## Resumen del proyecto

Sitio estático (HTML/CSS/JS vanilla, sin build) de repostería artesanal en
Medellín, Colombia. Catálogo con pedido por WhatsApp. Preparado para GitHub Pages
sobre el dominio `laurenreposteria.com`.

## Arranque rápido

```bash
# Servidor local (Node, con soporte de Range para video y 404):
node scripts/dev-server.mjs 5173
# Abrir: http://127.0.0.1:5173/
```

Ver [README](../README.md) para el detalle de instalación, despliegue y edición
de contenido.
