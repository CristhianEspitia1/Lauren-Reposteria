# Lauren Repostería

Catálogo de repostería artesanal de Medellín. El visitante descubre una colección, elige presentación, sabores y personalización, reúne su pedido y consulta disponibilidad por WhatsApp. La fecha, la entrega y el pago se confirman con el negocio.

## Vista previa local

Con Node instalado, desde la raíz:

```bash
node scripts/dev-server.mjs 5173
```

Abrir [Inicio](http://127.0.0.1:5173/). El servidor escucha únicamente en `127.0.0.1`, admite HEAD y rangos de video y muestra la página 404. No requiere instalación de dependencias ni compilación.

## Estructura y mantenimiento

HTML, CSS y JavaScript sin framework. Hosting configurado para GitHub Pages y dominio en `CNAME`.

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Portada (`/`): colecciones, cómo pedir, historia y preguntas |
| `tortas/`, `alfajores/`, `brownies-galletas/`, `detalles/` (`index.html`) | Colecciones en URL limpias (`/tortas/`…) |
| `html/*.html` | Redirecciones de las direcciones anteriores |
| `scripts/seo.mjs`, `scripts/social-images.mjs` | Metadatos, JSON-LD, `sitemap.xml`, `llms.txt`, imágenes para compartir e iconos; ver [SEO](docs/11-seo.md) |
| `js/catalog-data.js` | Única fuente de productos, importes, opciones y personalización |
| `js/catalog-model.js` | Reglas de precio, dependencias y validación |
| `js/quick-view-modal.js` | Elegir y editar un producto |
| `js/cart-manager.js`, `js/cart-ui.js` | Pedido persistente y resumen de WhatsApp |
| `js/brand-icons.js`, `js/ui.js` | Iconografía original Trazo Lauren y utilidades compartidas |
| `js/site.js`, `js/gallery-data.js` | Navegación, colecciones, galerías y reproductor |
| `js/image-variants.js`, `scripts/optimize-photography.mjs` | Copias responsive de las fotos aprobadas; mantenimiento en [rendimiento](docs/08-performance.md) |
| `css/tokens.css`, `site.css`, `catalog.css`, `dialogs.css` | Identidad y componentes responsive |
| `assets/optimized/` | Video de la historia, su poster y adornos de detalles |
| `assets/brand/` | Logotipos, sello e isotipo SVG de la marca |
| `assets/propuestas-fotograficas/` | Fotografías WebP del sitio, sus copias responsive y el inventario `manifest.json` |
| `tests/catalog.test.mjs` | Pruebas de precios, validaciones, persistencia y pedido |

El repositorio contiene solo los archivos que usa la web. La documentación vigente comienza en [docs/00-indice.md](docs/00-indice.md); las instrucciones operativas están en [la guía de mantenimiento](Guias/GUIA-MANTENIMIENTO.md).

## Identidad visual

El [manual de marca](docs/06-guia-de-estilos.md) es obligatorio para todo cambio visual o de texto: crema `#F9F5EC`, lila `#D0B4D7`, albaricoque `#F8B890` y durazno `#E5C8BA`; Playfair Display e Inter; logos vectoriales originales, iconos Trazo Lauren y una voz cercana, amigable, cariñosa y atenta.

## Comprobaciones

```bash
node --test tests/*.test.mjs
node scripts/seo.mjs --check
git diff --check
```

Revisión local de septiembre de 2026: 13 pruebas de lógica, geometría renderizada de las cinco páginas públicas en siete tamaños de ventana, recorridos de producto/pedido y controles de galería y video. El alcance y los límites se detallan en [accesibilidad](docs/07-accesibilidad.md) y [changelog](docs/10-changelog.md). Esto no equivale a una certificación ni a pruebas en dispositivos físicos.

## Datos comerciales

WhatsApp `573104442796`, Instagram `laurenreposteria22`, TikTok `laurenreposteria`, correo `reposterialauren@gmail.com`. Medellín, desde 2022. Atención todos los días, también domingos y festivos, de 9:00 a. m. a 6:00 p. m. Pedidos con al menos 2 días de anticipación, sujetos a disponibilidad.

No cambiar importes, contactos ni condiciones sin confirmación del negocio. Los alfajores personalizados cuestan $60.000 por caja de 6 (confirmado por el negocio en octubre de 2026). Solo los adicionales de torta siguen por cotización. Ver [pendientes comerciales](PROBLEMAS-PENDIENTES.md).

## Publicación

Los cambios locales y la vista previa no publican el sitio. Revisar el diff, comprobar el flujo afectado y seguir el procedimiento GitHub Pages solo cuando se autorice publicar. No hay backend, autenticación ni pasarela de pago.
