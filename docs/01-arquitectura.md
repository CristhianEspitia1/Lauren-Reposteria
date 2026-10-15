# Arquitectura

Sitio estático, sin build ni backend. Las cinco páginas públicas comparten estilos, reglas del catálogo, iconografía y diálogos. El hosting sirve archivos; el navegador construye el pedido y prepara un enlace de WhatsApp.

## Recorrido

Inicio → colección → producto → presentación, sabores y personalización → pedido → consulta por WhatsApp. El visitante puede editar opciones, cambiar cantidades, eliminar y deshacer antes de abrir WhatsApp. La consulta no confirma una compra, fecha ni pago.

Los productos por cotización abren una consulta con sus opciones y mensaje. Las galerías permiten ampliar una referencia y consultar un diseño inspirado en esa fotografía.

## Responsabilidades

- `catalog-data.js`: identidad de cada producto, fotografías, precios y opciones. No mantener catálogos paralelos por página.
- `catalog-model.js`: cálculo puro, valores iniciales, opciones visibles, límites y validación. UI y carrito consumen las mismas reglas.
- `cart-manager.js`: normaliza el pedido contra el catálogo vigente, persiste, combina productos iguales y genera el resumen.
- `quick-view-modal.js` y `cart-ui.js`: presentan los formularios y el pedido; no duplican reglas comerciales.
- `brand-icons.js` y `ui.js`: SVG originales, escape de texto, rutas de imagen, diálogos y avisos.
- `site.js` y `gallery-data.js`: navegación, filtros, búsqueda, fotografía ampliable y reproducción bajo control del visitante.

## Persistencia y límites

El pedido se guarda bajo `lauren_shopping_cart` en localStorage y se sincroniza entre pestañas del mismo origen. Se valida al leer y se recalculan los importes desde el catálogo. Si no se puede escribir, continúa en memoria y muestra el aviso correspondiente. No guardar datos de pago ni credenciales.

Ver [componentes](04-componentes.md), [seguridad](09-seguridad.md) y [decisiones](03-decisiones-tecnicas.md).
