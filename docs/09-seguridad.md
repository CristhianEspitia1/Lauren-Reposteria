# Seguridad

Al ser un sitio estático sin backend ni datos de usuario en servidor, la
superficie de ataque es pequeña. Aun así se aplican prácticas defensivas.

## Modelo de amenazas

| Vector | Riesgo | Estado |
| --- | --- | --- |
| XSS persistente vía `localStorage` del carrito | Medio | **Mitigado** |
| Inyección en HTML dinámico de modales | Bajo (datos de catálogo confiables) | Vigilado |
| Enlaces externos (`target="_blank"`) | Bajo | `rel="noopener noreferrer"` |
| Credenciales/API keys en el frontend | — | No existen |
| Inyección en el mensaje de WhatsApp | Bajo | `encodeURIComponent` |

## XSS en el carrito (mitigado)

El carrito se guarda en `localStorage` y se vuelve a renderizar en cada carga. La
**personalización** es texto libre que escribe el usuario. Sin escape, un valor
como `"><img src=x onerror=…>` se ejecutaría al renderizar el carrito (self-XSS
persistente) y, como mínimo, rompería la interfaz.

**Mitigación** (`js/cart-ui.js`): función `escapeHtml()` que se aplica a todos
los valores dinámicos antes de insertarlos con `innerHTML` — nombre, imagen,
opciones y personalización. Verificado inyectando payloads: se renderizan como
texto inerte, sin ejecución.

```js
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
```

Además, `CartManager.loadCart()` valida la forma de los datos leídos de
`localStorage` (arreglo de ítems bien formados), tolerando corrupción o
manipulación.

## HTML dinámico de modales

Los modales de producto (`quick-view-modal.js`, `product-modal-simple.js`)
renderizan datos del **catálogo**, controlados por el desarrollador y no por el
usuario, por lo que el riesgo de XSS es bajo. Se recomienda, como refuerzo,
aplicar el mismo `escapeHtml` si en el futuro el catálogo llegara a incorporar
contenido de terceros.

## Enlaces externos

Todos los `target="_blank"` (WhatsApp, Instagram, TikTok) usan
`rel="noopener noreferrer"` para evitar `window.opener` hijacking y fuga de
referrer.

## Datos sensibles

No hay claves de API, tokens ni secretos en el frontend. El único dato de negocio
expuesto es el número de WhatsApp público y las redes sociales, que son
intencionalmente públicos.

## Recomendaciones futuras

- Añadir una **Content-Security-Policy** (vía `<meta http-equiv>` o cabeceras del
  hosting) para restringir orígenes de scripts/estilos.
- Considerar Subresource Integrity si se añadieran scripts de terceros.
