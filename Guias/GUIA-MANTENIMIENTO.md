# Guía de mantenimiento - Lauren Repostería

## Principios actuales

- Producción usa solo rutas bajo `assets/optimized`.
- Las carpetas fuente de imágenes y videos son locales e ignoradas por Git.
- No subir zips, demos, capturas de auditoría, `.mov` ni metadatos `._*`.
- Nombres de archivo en `kebab-case` ASCII (sin espacios, tildes, emojis ni
  mayúsculas). El pipeline de optimización lo aplica automáticamente.
- Antes de publicar, verificar las páginas principales con servidor local.
- Documentación técnica completa en `docs/`.

## Servidor local

```bash
node scripts/dev-server.mjs 5173
# Abrir http://127.0.0.1:5173/html/inicio.html
```

## Flujo para cambiar media

1. Agregar la foto o video fuente en la carpeta local de producto
   (`assets/imagenes-<modulo>/`).
2. Ejecutar `node scripts/optimize-assets.mjs` (genera WebP/MP4 en
   `assets/optimized` con nombres kebab-case).
3. Ejecutar `node scripts/apply-optimized-assets.mjs`.
4. Revisar que HTML/JS/CSS apunten a `assets/optimized`.
5. Probar en móvil y escritorio.

## Carrusel infinito de tortas

El HTML debe conservar una sola copia de los items. El loop se duplica al montar
con JavaScript para reducir HTML inicial y mantener el scroll continuo.

No vuelvas a duplicar manualmente los items en `html/tortas.html`; si se agregan
fotos, agrega las fuentes, optimiza y deja que el script reconstruya las rutas.

## Estilos

- Color, tipografía, espaciado, sombra y `z-index` salen de `css/tokens.css`.
- Tipografía del sitio: Playfair Display (títulos) + Inter (texto).
- Evitar `!important`; ver `docs/06-guia-de-estilos.md`.

## Verificaciones rápidas

```bash
# Rutas que no deben apuntar a fuentes sin optimizar:
rg -n --pcre2 "(?<!optimized/)assets/(?!optimized)|\.png|\.jpg|\.jpeg|\.mov" html js css index.html scripts README.md
# Basura de sistema:
find . -path ./.git -prune -o \( -name '.DS_Store' -o -name '._*' -o -name 'Thumbs.db' \) -type f -print
# Sintaxis de JS:
find js scripts -type f \( -name '*.js' -o -name '*.mjs' \) ! -name '._*' -print0 | xargs -0 -n1 node --check
# Servidor local:
node scripts/dev-server.mjs 5173
```

## Páginas que deben abrir sin errores

- `/html/inicio.html`
- `/html/tortas.html`
- `/html/alfajores.html`
- `/html/brownies-galletas.html`
- `/html/detalles.html`
- `/html/tabla-productos.html` (editor interno, no indexado)
