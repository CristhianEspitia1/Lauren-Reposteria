# Componentes

Los scripts clásicos se cargan con `defer`, en el orden declarado en cada página. No requieren gestor de paquetes.

| Módulo | Interfaz | Responsabilidad |
| --- | --- | --- |
| `catalog-data.js` | `catalogData` | Datos comerciales únicos, sin lógica ([formato](12-catalogo.md)) |
| `catalog-model.js` | `Catalog` | `get`, `all` (solo visibles), `defaults`, `price`, `quote`, `range`, `priceLabel`, `priceRefText`, `minimum`, `validate`, `fields`, `summary` |
| `brand-icons.js` | `LaurenIcons(nombre)`, `LaurenIcons.names` | SVG por nombre semántico e inventario inmutable; nombres desconocidos devuelven cadena vacía |
| `ui.js` | `LaurenUI` | `escape`, `imagePath`, `wa`, `open`, `close`, `dialogEvents`, `toast` |
| `cart-manager.js` | `cartManager` | Estado, persistencia, edición y resumen de WhatsApp |
| `quick-view-modal.js` | `quickView` | Configurar o editar un producto |
| `cart-ui.js` | `cartUI` | Diálogo lateral, lista, cantidades, eliminar/deshacer y subtotal |
| `gallery-data.js` | `galleryData` | Referencias reales por colección |
| `catalog-live.js` | Evento `catalog:updated` | Lee lo publicado en el centro de control y avisa si cambió |
| `admin-model.js`, `admin.js` | `AdminModel`, página `/admin/` | Centro de control: acceso con doble factor, borrador y publicación ([detalle](13-centro-de-control.md)) |
| `site.js` | Atributos `data-*` | Navegación, productos por `data-category` o `data-featured`, filtros por `group`, importes `data-price`, galería y video |

## Producto y pedido

`Catalog` determina qué opciones están visibles, el precio y la personalización exigida. Las cajas surtidas no heredan el precio de una galleta individual. Los mínimos y límites se aplican tanto al agregar como al editar y leer el pedido guardado. Las variantes con importes propios y los extras activados recalculan inmediatamente el subtotal. Una elección sin precio cambia el total por «Consultar por WhatsApp» y no entra al pedido.

El carrito conserva `id`, `quantity`, `selection` y `personal`; deriva del catálogo el nombre, imagen, precio y resumen legible. Dos productos solo se combinan si coinciden sus opciones y personalización. `getItems()` devuelve una copia para impedir modificaciones accidentales del estado.

Los diálogos nativos contienen el foco, hacen inerte el fondo y cierran con Escape. La edición desde el pedido conserva opciones y vuelve al resumen. El aviso para deshacer una eliminación está dentro del propio diálogo.

## Galería y video

La galería comienza con ocho imágenes; «Ver más» añade otro grupo. La ampliación ofrece anterior/siguiente, teclado y enlace de consulta con la referencia.

La historia tiene imagen completa en proporción horizontal, poster local y carga del MP4 únicamente al pulsar reproducir. Controles propios de pausa, sonido, avance y ampliación. La ampliación traslada el mismo reproductor a un diálogo: conserva posición y controles sin depender de la API de pantalla completa del navegador.
