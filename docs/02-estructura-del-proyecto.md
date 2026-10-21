# Estructura del proyecto

El sitio se sirve directamente, sin bundler ni dependencias en runtime.

```text
index.html / 404.html             Portada (/) y error con identidad Lauren
tortas/ alfajores/ brownies-galletas/ detalles/  Colecciones (index.html)
html/                            Redirecciones de las direcciones anteriores
robots.txt / sitemap.xml / CNAME  Descubrimiento y hosting (sitemap generado)
llms.txt / site.webmanifest       Resumen para asistentes de IA (generado) y manifest
_config.yml                      Exclusiones de publicación en GitHub Pages
favicon.ico / assets/icons/       Iconos PNG/ICO y logotipo rasterizado (generados)
assets/social/                   Imágenes 1200 × 630 para compartir (generadas)
css/tokens.css                   Colores, fuentes, espacios y movimiento
css/site.css                     Base, navegación, portada y pie
css/catalog.css                  Colecciones, filtros y galerías
css/dialogs.css                  Producto, pedido y ampliación de fotografías
js/catalog-data.js               Catálogo único
js/catalog-model.js              Precios, opciones y validación
js/brand-icons.js / ui.js         Sistema compartido
js/cart-manager.js / cart-ui.js   Estado y presentación del pedido
js/quick-view-modal.js            Configurador de producto
js/gallery-data.js / site.js      Fotografías e interacción del sitio
js/image-variants.js             Anchos de las fotos para srcset (generado)
js/flavors.js                    «Un sabor para recordar» (Tortas) desde el catálogo
js/faq-data.js / faqs.js         Preguntas frecuentes (solo datos) y sus reglas: cada página, precios y enlaces
assets/brand/                    Logotipos, sello e isotipo SVG
assets/propuestas-fotograficas/  Fotografías WebP, copias responsive y manifest.json
assets/optimized/                Video de la historia y su poster
assets/favicon.svg               Marca vectorial de la pestaña
scripts/                         Servidor local, copias responsive, SEO y huellas de CSS/JS, catálogo publicado e imágenes sociales
admin/ / css/admin.css           Centro de control (/admin/, no se indexa)
js/admin.js / admin-model.js      Panel: acceso, ficha, fotos y reglas del borrador
js/firebase-config.js / catalog-live.js  Proyecto de Firebase y lectura en vivo de lo publicado
worker/fotos/                    Cloudflare Worker que guarda y sirve las fotos subidas desde /admin/ (no se publica en Pages)
.github/workflows/catalogo.yml   Trae cada hora el catálogo publicado y regenera el SEO
tests/                           Pruebas de lógica y de SEO (Node)
tests/fixtures/catalog-data.js   Catálogo de prueba fijo para las reglas de precios y del panel
tests/catalogo-real.test.mjs     Reglas que debe cumplir el catálogo real, sin importes fijos
docs/ / Guias/                   Documentación y mantenimiento
```

Todas las páginas y los datos de JavaScript usan rutas desde la raíz (`/assets/…`, `/tortas/`), válidas en el dominio propio y en el servidor local. El bloque `<!-- seo: … -->` del `<head>` lo genera `scripts/seo.mjs`; no editarlo a mano. El repositorio contiene solo los archivos que usa la web; `._*`, `.DS_Store` y `tmp/` están ignorados por Git.

Añadir una regla en el componente responsable; no crear otra capa de parches.
