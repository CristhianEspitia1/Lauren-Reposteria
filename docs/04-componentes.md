# Componentes

## Módulos JavaScript

Todos son scripts clásicos (no ES modules) que se cargan con `<script src>` y se
comunican por objetos globales en `window`. El orden de carga importa: los datos
y `cart-manager` deben cargarse antes que la UI que los consume.

| Módulo | Rol | Global expuesto | Cargado por |
| --- | --- | --- | --- |
| `catalog-data.js` | Catálogo de productos (fuente principal) | `window.CATALOG…` | brownies-galletas, detalles, tabla-productos |
| `tortas-data.js` | Datos del configurador de tortas | — | tortas |
| `alfajores-data.js` | Datos de alfajores | — | alfajores |
| `quick-view-modal.js` | Modal de vista rápida (único sistema de modal) | `window.openQuickView` | tortas, alfajores, brownies-galletas, detalles |
| `cart-manager.js` | Estado del carrito + persistencia + WhatsApp | `window.cartManager` | todas menos tabla |
| `cart-ui.js` | Panel e interfaz del carrito | `window.cartUI` | todas menos tabla |
| `contact-fab.js` | Botón flotante de contacto y menú | — | todas menos tabla |
| `tortas-script.js` | Interacciones de tortas + fallback de imágenes | — | inicio, tortas, alfajores, detalles |
| `performance-optimizer.js` | Carga diferida de imágenes/videos | — | todas |

> **Nota de arquitectura.** El sitio usa un único sistema de modal de producto
> (`quick-view-modal.js`). La portada tenía un segundo sistema
> (`product-modal-simple.js` + `modal-handler.js`) que quedó huérfano —sin
> disparadores que lo abrieran— y se eliminó en la auditoría de julio de 2026.

## Carrito

- **`CartManager`** (`cart-manager.js`): mantiene un arreglo de ítems en memoria
  y lo sincroniza con `localStorage` bajo la clave `lauren_shopping_cart`. Valida
  la forma de los datos al cargar (tolerante a corrupción). Expone
  `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `getTotalPrice`,
  `formatPrice` y `sendToWhatsApp`. Patrón observador vía `addEventListener`.
- **`CartUI`** (`cart-ui.js`): renderiza el panel, escucha cambios del manager y
  actualiza badge, lista, total y estado vacío. **Escapa todo dato dinámico**
  antes de insertarlo en el DOM (ver [seguridad](09-seguridad.md)).

Esquema de un ítem del carrito:

```js
{
  id, name, price,            // identidad y precio (number)
  quantity,                   // cantidad (number)
  image,                      // ruta de imagen o ''
  options,                    // { "Tamaño": "Mediana", ... }
  personalization,            // texto libre del usuario
  addedAt                     // timestamp
}
```

## Modal de vista rápida

`quick-view-modal.js` construye el modal a partir de los datos del producto:
imagen principal con miniaturas, nombre, precio, descripción, "qué incluye",
opciones configurables, campo de personalización y botón de agregar al carrito.
Cierra con botón, clic fuera y tecla Escape.

## Componentes de UI (CSS)

| Componente | CSS | Notas |
| --- | --- | --- |
| Navegación superior | `glass-nav.css`, `header.css` | Efecto glass, sticky |
| Hero por módulo | `header.css`, inline por página | Video de fondo + logo translúcido |
| Tarjeta de producto | `tortas-styles.css` | Patrón compartido entre catálogos |
| Modal de vista rápida | `quick-view-modal.css` | Reutilizable |
| Carrito | `cart.css`, `cart-button-styles.css` | Panel lateral + botón |
| Pie de página | `luxury-footer.css`, `footer-mobile.css` | Nude/tierra, redes sociales |
| Ajustes móviles | `mobile-fixes.css` | Correcciones responsive transversales |

Ver la [guía de estilos](06-guia-de-estilos.md) para tokens y patrones visuales.
