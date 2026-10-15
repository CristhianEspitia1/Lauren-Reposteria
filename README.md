# Lauren Repostería

Catálogo de repostería artesanal de Medellín. El visitante descubre una colección, elige presentación, sabores y personalización, reúne su pedido y consulta disponibilidad por WhatsApp. La fecha, la entrega y el pago se confirman con el negocio.

## Vista previa local

Con Node instalado, desde la raíz:

```bash
node scripts/dev-server.mjs 5173
```

Abrir [Inicio](http://127.0.0.1:5173/html/inicio.html). El servidor escucha únicamente en `127.0.0.1`, admite HEAD y rangos de video y muestra la página 404. No requiere instalación de dependencias ni compilación.

## Estructura y mantenimiento

HTML, CSS y JavaScript sin framework. Hosting configurado para GitHub Pages y dominio en `CNAME`.

| Archivo | Responsabilidad |
| --- | --- |
| `html/inicio.html` | Portada, colecciones, cómo pedir, historia y preguntas |
| `html/tortas.html`, `alfajores.html`, `brownies-galletas.html`, `detalles.html` | Colecciones y configuración de productos |
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

La identidad parte del brandbook de Lauren: crema `#F9F5EC`, lila `#D0B4D7`, durazno `#E5C8BA` y albaricoque `#F8B890`. El sitio usa los logos vectoriales originales y una familia compartida de iconos semánticos para la web. Fotografía protagonista, composición editorial, foco visible y movimiento breve que respeta la preferencia de movimiento reducido. El video conserva su proporción original y solo se carga al reproducirlo.

El manual define P22 Mackinac, Proxima Nova y Gentlemens Script. Sus archivos de fuente no están en el proyecto; la adaptación web mantiene por ahora Playfair Display e Inter. Procedencia, variantes y reglas en la [guía de estilos](docs/06-guia-de-estilos.md).

## Comprobaciones

```bash
node --test tests/catalog.test.mjs
git diff --check
```

Revisión local de septiembre de 2026: 13 pruebas de lógica, geometría renderizada de las cinco páginas públicas en siete tamaños de ventana, recorridos de producto/pedido y controles de galería y video. El alcance y los límites se detallan en [accesibilidad](docs/07-accesibilidad.md) y [changelog](docs/10-changelog.md). Esto no equivale a una certificación ni a pruebas en dispositivos físicos.

## Datos comerciales

WhatsApp `573104442796`, Instagram `laurenreposteria22`, TikTok `laurenreposteria`, correo `reposterialauren@gmail.com`. Medellín, desde 2022. Atención de lunes a sábado, 9:00 a. m. a 6:00 p. m. Pedidos con al menos un día de anticipación, sujetos a disponibilidad.

No cambiar importes, contactos ni condiciones sin confirmación del negocio. Los alfajores personalizados quedan por cotización mediante `quoteOnly: true`: el dato heredado de $60.000 no aclara si corresponde a una unidad o a una caja de seis. Ver [pendientes comerciales](PROBLEMAS-PENDIENTES.md).

## Publicación

Los cambios locales y la vista previa no publican el sitio. Revisar el diff, comprobar el flujo afectado y seguir el procedimiento GitHub Pages solo cuando se autorice publicar. No hay backend, autenticación ni pasarela de pago.
