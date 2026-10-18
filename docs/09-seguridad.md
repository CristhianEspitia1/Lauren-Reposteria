# Seguridad

Catálogo público, sin pasarela de pago. El catálogo publicado vive en Firestore (lectura pública, escritura solo de administradores con doble factor; ver `firestore.rules` y el [centro de control](13-centro-de-control.md)). Sin registro público: los administradores se crean en la consola de Firebase. El pedido permanece en el navegador. WhatsApp recibe el resumen cuando el visitante abre el enlace y decide enviarlo.

## Controles implementados

- `LaurenUI.escape` protege todo texto dinámico en producto, pedido, galería y centro de control. Los mensajes escritos se muestran como texto, no como HTML. `LaurenIcons` solo devuelve iconos del registro.
- Las imágenes dinámicas se limitan, mediante `imagePath`, a rutas locales de `assets/` y a fotos del worker de fotos del proyecto (`https://lauren-reposteria.crizczi22.workers.dev/f/<nombre>.webp|jpg`).
- Fotos subidas: el worker `worker/fotos` verifica la firma, el proyecto, la vigencia y el doble factor TOTP del token de Firebase; solo responde a los orígenes permitidos; acepta WebP o JPG (por su contenido) de menos de 3 MB y elige él mismo el nombre del archivo. Sirve las fotos con `nosniff` y `Content-Security-Policy: default-src 'none'`. Las fotos no usan llaves ni secretos. Borrar una foto la pasa 30 días a una papelera que nadie ve (`papelera/…` en KV): ni un error ni una sesión robada pueden borrar fotos de forma inmediata e irreversible; se recuperan con `POST /fotos/recuperar/<nombre>`. Cada borrado queda marcado (`fotos-borradas`) y la lista de fotos subidas no muestra las marcadas, aunque la lista de claves de KV tarde en ponerse al día.
- Lo último de Instagram: la llave (`INSTAGRAM_TOKEN`) es un secreto de Cloudflare, nunca del repositorio ni de la web; la renovada se guarda en KV y solo viaja a `graph.instagram.com`. El worker filtra las publicaciones (identificador numérico, enlace a `www.instagram.com`, archivos del CDN de Instagram), solo pide archivos de las publicaciones que ya leyó (no es un proxy abierto), pasa solo fotos y video MP4 y no reenvía cabeceras de Instagram como cookies. La web valida identificadores y enlaces otra vez y escribe los textos como texto.
- Reglas de Firestore: escribir lo publicado exige sesión con doble factor por app (no SMS), solo los campos conocidos, la hora del servidor y, si se firma, el correo propio. Nadie puede borrar lo publicado ni cambiar o borrar el historial. Lo publicado no guarda el correo de quien publica (es de lectura pública); el historial sí, y solo lo leen los administradores. La lista de fotos subidas (`fotos/subidas`) solo la leen y cambian administradores, con los campos conocidos y la hora del servidor, y nadie la borra.
- Catálogo en vivo (`catalog-live.js`): antes de cambiar la copia local, prueba que cada tarjeta pueda calcular su precio; un catálogo dañado no rompe la página.
- Workflow del catálogo: `scripts/pull-catalog.mjs` revisa lo publicado con las reglas del panel (`AdminModel.validate`) antes de escribir; si no pasa, no cambia nada y GitHub avisa. El resumen del commit no lleva correos.
- Al leer localStorage se valida estructura, opciones, campos y cantidades. Identidad y precios se derivan del catálogo vigente; un precio almacenado no es una fuente de verdad. Un precio de $0 cuenta como sin precio (se cotiza) y el panel no deja publicarlo.
- El mensaje de WhatsApp se codifica con `encodeURIComponent`. Los enlaces externos usan `noopener noreferrer`.
- Política CSP en las páginas: scripts locales, estilos locales/Google Fonts, fuentes del proveedor, imágenes locales/data y del worker de fotos, y video local. La portada además pide al worker la lista de Instagram (`connect-src`) y sus videos (`media-src`). El centro de control además conecta con Firebase y con el worker de fotos, y solo carga scripts externos de `https://www.gstatic.com/firebasejs/13.0.0/`. Sin scripts en línea, objetos embebidos ni formularios enviados a un servidor.
- El centro de control no funciona dentro de otra página (GitHub Pages no permite la cabecera `frame-ancestors`): si lo enmarcan, se oculta y no arranca. Es `noindex` y no envía `Referer`.
- GitHub Pages no publica la documentación, las herramientas ni la configuración de Firebase (`_config.yml`).
- Servidor local ligado a loopback, métodos GET/HEAD, MIME explícitos, `nosniff`, rechazo de rutas ocultas/fuera del proyecto y rangos inválidos. No usarlo como servidor público.

## Verificación y límites

Las pruebas cubren texto con HTML, rutas de imagen peligrosas, precios/nombres guardados manipulados, cantidades inválidas, JSON corrupto, almacenamiento bloqueado, estructura del resumen, la papelera de fotos y la revisión del catálogo publicado. Se comprobó en la UI que una personalización como `<b>Feliz día</b>` permanece literal.

Estos controles protegen la experiencia del catálogo. El frontend nunca autoriza un cobro: el negocio confirma disponibilidad y valor final. No añadir secretos ni datos financieros al catálogo o al almacenamiento del pedido.

## Auditoría del 17 de octubre de 2026

Recorrido completo del centro de control (vista previa) y de la web, más pruebas de ataque que no tocan datos reales:

- Firestore, sin sesión: escribir, borrar, consultar el historial, listar colecciones o crear documentos en otras colecciones devuelve `PERMISSION_DENIED`; solo se lee lo publicado. Las reglas se probaron además en el emulador (22 casos: sin código, con SMS, firmando como otra persona, fecha inventada, campos extra, catálogo vacío o gigante, borrar lo publicado, cambiar el historial…). Las reglas publicadas coinciden con `firestore.rules`.
- Firebase Auth: registro público apagado, protección contra la enumeración de correos activa, doble factor por app activo y las dos cuentas de administrador con correo confirmado y app de códigos.
- Worker de fotos: sin origen, desde otro sitio, sin sesión, con tokens sin firma o con llaves inventadas responde 401/403; no sirve la llave ni la lista de Instagram por `/f/`; no sigue direcciones externas.
- Repositorio público sin secretos en su historial (solo la llave web de Firebase, que es pública por diseño). Facturación de Google Cloud apagada: un abuso agota la cuota gratuita del día, no genera cobros.

### Riesgos que quedan

- Cuotas gratuitas: alguien podría pedir miles de veces lo publicado (50.000 lecturas de Firestore al día) o las fotos subidas (100.000 visitas al worker al día). La web sigue con su copia local, pero ese día las fotos subidas y el panel podrían fallar hasta que la cuota se renueve. No hay daño permanente.
- Historial sin botón: volver a una versión anterior del catálogo exige ayuda técnica.

### Pendiente fuera del código (lo hace quien tenga las cuentas)

Hecho: las cuentas (el Gmail dueño de Firebase y Cloudflare, GitHub y Hostinger) tienen verificación en dos pasos, según el negocio el 17 de octubre de 2026. Es la protección más importante: quien entre a esas cuentas controla la web.

Falta (revisado el 17 de octubre de 2026):

- GitHub → Settings → Code security: activar «Secret scanning» y «Push protection» (gratis en repositorios públicos), para que GitHub bloquee una llave subida por error.
- Google Cloud → Credenciales → «Browser key (auto created by Firebase)»: restringirla a los sitios `https://laurenreposteria.com/*`, `https://lauren-reposteria.firebaseapp.com/*` y `http://localhost:5173/*`.
- Hostinger → DNS de `laurenreposteria.com`: el dominio no envía correos, así que conviene publicar `TXT @ "v=spf1 -all"` y `TXT _dmarc "v=DMARC1; p=reject"` para que nadie pueda mandar correos falsos a nombre de Lauren.
- Opcional en Firebase Auth: pedir claves de al menos 12 caracteres (política de contraseñas) y aceptar el código de la app solo en su minuto (hoy se aceptan ±2,5 minutos).

El centro de control no tiene «¿Olvidaste tu clave?» a propósito: el negocio lo considera un riesgo. Una clave olvidada se cambia en la consola de Firebase (Authentication → Usuarios).
