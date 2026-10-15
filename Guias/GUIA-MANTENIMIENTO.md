# Guía de mantenimiento — Lauren Repostería

## Trabajar localmente

```bash
node scripts/dev-server.mjs 5173
```

Abrir `http://127.0.0.1:5173/`. No requiere instalar dependencias. El servidor solo acepta conexiones locales.

## Productos y precios

La fuente única es `js/catalog-data.js`. Mantener el identificador del producto y sus opciones para conservar compatibilidad con pedidos guardados. Ajustar importes y su texto visible juntos, con confirmación del negocio.

Las reglas calculadas se centralizan en `js/catalog-model.js` y se comprueban con:

```bash
node --test tests/catalog.test.mjs
```

El caso de alfajores personalizados permanece por cotización hasta confirmar la unidad de venta; ver [pendientes](../PROBLEMAS-PENDIENTES.md).

## Fotografías y video

1. Guardar los originales fuera del repositorio; aquí solo vive lo que usa la web.
2. Añadir la fotografía WebP en `assets/propuestas-fotograficas/`, con nombre ASCII en kebab-case, y registrarla en `manifest.json`.
3. Ejecutar `node scripts/optimize-photography.mjs` para generar sus copias responsive (requiere `cwebp` y `webpinfo`).
4. En galerías, actualizar `js/gallery-data.js`; cada imagen debe corresponder a su descripción.

El poster de la entrevista está en `assets/optimized/imagenes-inicio/historia-poster.webp`. Al cambiar el video, exportar también un fotograma representativo, conservar su proporción y actualizar el poster. El reproductor carga el MP4 al pulsar reproducir; no activar autoplay.

## Estilos e iconos

Seguir el [manual de marca](../docs/06-guia-de-estilos.md), obligatorio para todo cambio. Tokens en `css/tokens.css`; estilos por responsabilidad en `site.css`, `catalog.css` y `dialogs.css`. Usar `LaurenIcons(nombre)` desde el registro original. No reintroducir icon fonts ni parches globales de móvil.

## Entregar y publicar

Comprobar sintaxis y el flujo afectado, sin repetir una auditoría completa por cada ajuste. Para cambios comerciales, ejecutar las pruebas del catálogo. Para cambios visuales, abrir una vista previa del resultado y revisar el componente en un ancho amplio y uno estrecho.

```bash
git diff --check
```

Publicar solo con autorización explícita y revisar después las rutas públicas de inicio, tortas, alfajores, brownies-galletas y detalles. Las pruebas no envían mensajes a clientes ni cambian datos del negocio.
