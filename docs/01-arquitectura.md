# Arquitectura

## Visión general

Lauren Repostería es un **sitio estático** compuesto por páginas HTML
independientes que comparten un conjunto común de CSS y JavaScript. No hay
servidor de aplicación: toda la lógica vive en el navegador y el único "backend"
es WhatsApp, adonde se envía el pedido final.

```
┌──────────────────────────────────────────────────────────┐
│                      Navegador                             │
│                                                            │
│   Página HTML  ──carga──►  CSS (tokens + componentes)      │
│       │                                                    │
│       ├── catalog-data.js / tortas-data.js / alfajores…    │  datos
│       ├── quick-view-modal.js  (vista rápida de producto)  │  UI producto
│       ├── cart-manager.js  ──►  localStorage               │  estado
│       ├── cart-ui.js  (panel del carrito)                  │  UI carrito
│       ├── contact-fab.js  (contacto + menú)                │  navegación
│       └── performance-optimizer.js  (lazy media)           │  rendimiento
│                                                            │
│   Pedido  ──generateWhatsAppMessage()──►  wa.me/57310…     │  salida
└──────────────────────────────────────────────────────────┘
                              │
                              ▼
                     GitHub Pages (estático)
                     dominio: laurenreposteria.com
```

## Capas

1. **Datos** (`js/*-data.js`): catálogo de productos, precios, opciones e
   imágenes. `catalog-data.js` es la fuente principal; `tortas-data.js` y
   `alfajores-data.js` sirven a sus páginas específicas.
2. **Presentación** (`html/` + `css/`): cada página define su contenido y carga
   los estilos compartidos. Los design tokens (`css/tokens.css`) centralizan la
   identidad visual.
3. **Interacción** (`js/`): modales de producto, carrito con persistencia,
   contacto, carruseles y carga diferida de media.
4. **Salida**: el carrito arma un mensaje de WhatsApp con el pedido; no hay
   pasarela de pago ni base de datos.

## Flujo del usuario

```
Inicio ──► Categoría (tortas / alfajores / brownies-galletas / detalles)
   │            │
   │            ├─► Vista rápida (modal) ──► Agregar al carrito
   │            │
   └────────────┴─► Carrito (persistente entre páginas) ──► Pedir por WhatsApp
```

El carrito se guarda en `localStorage` (`lauren_shopping_cart`), por lo que
persiste al navegar entre páginas y al recargar. Al confirmar, se genera un
mensaje estructurado y se abre WhatsApp con el número del negocio.

## Decisiones clave

Ver [Decisiones técnicas](03-decisiones-tecnicas.md). En resumen: estático sin
build (ADR-001), media optimizada como único origen en producción (ADR-002),
nombres de assets kebab-case (ADR-003), tipografía Playfair + Inter (ADR-004),
tokens centralizados (ADR-005) y carrito en localStorage (ADR-006).

## Límites y no-objetivos

- No hay autenticación, cuentas ni panel de administración (salvo el editor
  interno `tabla-productos.html`, no indexado).
- No hay pago en línea: la conversión se cierra por WhatsApp.
- No hay contenido dinámico de servidor ni internacionalización.
