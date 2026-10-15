# Estructura del proyecto

El sitio se sirve directamente, sin bundler ni dependencias en runtime.

```text
index.html / 404.html             Entrada y error con identidad Lauren
robots.txt / sitemap.xml / CNAME  Descubrimiento y hosting
html/                            Inicio y cuatro colecciones
css/tokens.css                   Colores, fuentes, espacios y movimiento
css/site.css                     Base, navegación, portada y pie
css/catalog.css                  Colecciones, filtros y galerías
css/dialogs.css                  Producto, pedido y ampliación de fotografías
css/error.css                    Entradas de error
js/catalog-data.js               Catálogo único
js/catalog-model.js              Precios, opciones y validación
js/brand-icons.js / ui.js         Sistema compartido
js/cart-manager.js / cart-ui.js   Estado y presentación del pedido
js/quick-view-modal.js            Configurador de producto
js/gallery-data.js / site.js      Fotografías e interacción del sitio
js/image-variants.js             Anchos de las fotos para srcset (generado)
assets/brand/                    Logotipos, sello e isotipo SVG
assets/propuestas-fotograficas/  Fotografías WebP, copias responsive y manifest.json
assets/optimized/                Video de la historia, su poster y adornos de detalles
assets/favicon.svg               Marca vectorial de la pestaña
scripts/                         Servidor local y copias responsive
tests/catalog.test.mjs            Pruebas de lógica (Node)
docs/ / Guias/                   Documentación y mantenimiento
```

Las páginas de `html/` usan rutas relativas `../assets/`. La página 404 usa rutas desde la raíz para funcionar con direcciones inexistentes de cualquier profundidad. El repositorio contiene solo los archivos que usa la web; `._*`, `.DS_Store` y `tmp/` están ignorados por Git.

Añadir una regla en el componente responsable; no crear otra capa de parches.
