# Lauren Repostería

## Manual de marca: obligatorio

[docs/06-guia-de-estilos.md](docs/06-guia-de-estilos.md) es el manual de marca y la única fuente de verdad visual y de tono del sitio. Es de cumplimiento estricto.

- Leerlo completo antes de crear o modificar cualquier página, sección, componente, estilo, texto, icono, gráfico o fotografía.
- Todo trabajo nuevo usa solo lo que el manual define: tokens de `css/tokens.css`, Playfair Display e Inter con su escala, componentes existentes, iconos de `LaurenIcons`, archivos de `assets/brand/` y la voz cercana, amigable, cariñosa y atenta.
- Si algo necesario no está en el manual, se propone al usuario y se añade primero al manual (y a la versión visual <https://claude.ai/artifact/QDVjXxqDnKd51uysq5t5Qk>) antes de construirlo. No se inventan colores, fuentes, radios, sombras, iconos ni estilos de texto.
- Si un cambio aprobado modifica algo que el manual describe, el manual se actualiza en el mismo cambio para que nunca contradiga la web.
- Antes de terminar, se repasa la lista «Antes de publicar» del manual y se verifica en móvil y escritorio.

## Proyecto

Sitio estático sin build (HTML, CSS y JS vanilla). Vista previa: `node scripts/dev-server.mjs 5173`. Comprobaciones: `node --test tests/*.test.mjs` y `node scripts/seo.mjs --check`. Documentación en [docs/00-indice.md](docs/00-indice.md). No cambiar precios, contactos ni condiciones sin confirmación del negocio.
