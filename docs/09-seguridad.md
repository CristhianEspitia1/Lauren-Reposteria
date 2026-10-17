# Seguridad

Catálogo público, sin pasarela de pago. El catálogo publicado vive en Firestore (lectura pública, escritura solo de administradores con doble factor; ver `firestore.rules` y el [centro de control](13-centro-de-control.md)). Sin registro público: los administradores se crean en la consola de Firebase. El pedido permanece en el navegador. WhatsApp recibe el resumen cuando el visitante abre el enlace y decide enviarlo.

## Controles implementados

- `LaurenUI.escape` protege todo texto dinámico en producto, pedido, galería. Los mensajes escritos se muestran como texto, no como HTML.
- Las imágenes dinámicas se limitan, mediante `imagePath`, a rutas locales de `assets/` y a fotos del worker de fotos del proyecto (`https://lauren-reposteria.crizczi22.workers.dev/f/<nombre>.webp|jpg`).
- Fotos subidas: el worker `worker/fotos` verifica la firma, el proyecto, la vigencia y el doble factor TOTP del token de Firebase; solo responde a los orígenes permitidos; acepta WebP o JPG (por su contenido) de menos de 3 MB y elige él mismo el nombre del archivo. Sirve las fotos con `nosniff` y `Content-Security-Policy: default-src 'none'`. No guarda llaves ni secretos.
- Al leer localStorage se valida estructura, opciones, campos y cantidades. Identidad y precios se derivan del catálogo vigente; un precio almacenado no es una fuente de verdad.
- El mensaje de WhatsApp se codifica con `encodeURIComponent`. Los enlaces externos usan `noopener noreferrer`.
- Política CSP en las páginas: scripts locales, estilos locales/Google Fonts, fuentes del proveedor, imágenes locales/data y del worker de fotos, y video local. El centro de control además conecta con Firebase y con el worker de fotos. Sin objetos embebidos ni formularios enviados a un servidor.
- Servidor local ligado a loopback, métodos GET/HEAD, MIME explícitos, `nosniff`, rechazo de rutas ocultas/fuera del proyecto y rangos inválidos. No usarlo como servidor público.

## Verificación y límites

Las pruebas cubren texto con HTML, rutas de imagen peligrosas, precios/nombres guardados manipulados, cantidades inválidas, JSON corrupto, almacenamiento bloqueado y estructura del resumen. Se comprobó en la UI que una personalización como `<b>Feliz día</b>` permanece literal.

Estos controles protegen la experiencia del catálogo. El frontend nunca autoriza un cobro: el negocio confirma disponibilidad y valor final. No añadir secretos ni datos financieros al catálogo o al almacenamiento del pedido.
