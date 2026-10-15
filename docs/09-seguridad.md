# Seguridad

Catálogo público, sin autenticación, base de datos ni pasarela de pago. El pedido permanece en el navegador. WhatsApp recibe el resumen cuando el visitante abre el enlace y decide enviarlo.

## Controles implementados

- `LaurenUI.escape` protege todo texto dinámico en producto, pedido, galería. Los mensajes escritos se muestran como texto, no como HTML.
- Las imágenes dinámicas se limitan a rutas locales de `assets/optimized` mediante `imagePath`.
- Al leer localStorage se valida estructura, opciones, campos y cantidades. Identidad y precios se derivan del catálogo vigente; un precio almacenado no es una fuente de verdad.
- El mensaje de WhatsApp se codifica con `encodeURIComponent`. Los enlaces externos usan `noopener noreferrer`.
- Política CSP en las páginas: scripts locales, estilos locales/Google Fonts, fuentes del proveedor, imágenes locales/data y video local. Sin objetos embebidos ni formularios enviados a un servidor.
- Servidor local ligado a loopback, métodos GET/HEAD, MIME explícitos, `nosniff`, rechazo de rutas ocultas/fuera del proyecto y rangos inválidos. No usarlo como servidor público.

## Verificación y límites

Las pruebas cubren texto con HTML, rutas de imagen peligrosas, precios/nombres guardados manipulados, cantidades inválidas, JSON corrupto, almacenamiento bloqueado y estructura del resumen. Se comprobó en la UI que una personalización como `<b>Feliz día</b>` permanece literal.

Estos controles protegen la experiencia del catálogo. El frontend nunca autoriza un cobro: el negocio confirma disponibilidad y valor final. No añadir secretos ni datos financieros al catálogo o al almacenamiento del pedido.
