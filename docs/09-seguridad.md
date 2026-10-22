# Seguridad

Catálogo público, sin pasarela de pago. El catálogo publicado vive en Firestore (lectura pública, escritura solo de administradores con doble factor; ver `firestore.rules` y el [centro de control](13-centro-de-control.md)). Sin registro público: los administradores se crean en la consola de Firebase. El pedido permanece en el navegador. WhatsApp recibe el resumen cuando el visitante abre el enlace y decide enviarlo.

## Controles implementados

- `LaurenUI.escape` protege todo texto dinámico en producto, pedido, galería y centro de control. Los mensajes escritos se muestran como texto, no como HTML. `LaurenIcons` solo devuelve iconos del registro.
- Las imágenes dinámicas se limitan, mediante `imagePath`, a rutas locales de `assets/` y a fotos del worker de fotos del proyecto (`https://lauren-reposteria.crizczi22.workers.dev/f/<nombre>.webp|jpg`).
- Fotos subidas: el worker `worker/fotos` verifica la firma, el proyecto, la vigencia y el doble factor TOTP del token de Firebase (y, si se configura el secreto `ADMIN_EMAILS` en Cloudflare, que el correo esté en esa lista); solo responde a los orígenes permitidos; acepta WebP o JPG (por su contenido) de menos de 3 MB y elige él mismo el nombre del archivo. Sirve las fotos con `nosniff` y `Content-Security-Policy: default-src 'none'`. Las fotos no usan llaves ni secretos. Borrar una foto la pasa 30 días a una papelera que nadie ve (`papelera/…` en KV): ni un error ni una sesión robada pueden borrar fotos de forma inmediata e irreversible; se recuperan con `POST /fotos/recuperar/<nombre>`. Cada borrado queda marcado (`fotos-borradas`) y la lista de fotos subidas no muestra las marcadas, aunque la lista de claves de KV tarde en ponerse al día.
- Lo último de Instagram: la llave (`INSTAGRAM_TOKEN`) es un secreto de Cloudflare, nunca del repositorio ni de la web; la renovada se guarda en KV y solo viaja a `graph.instagram.com`. El worker filtra las publicaciones (identificador numérico, enlace a `www.instagram.com`, archivos del CDN de Instagram), solo pide archivos de las publicaciones que ya leyó (no es un proxy abierto), pasa solo fotos y video MP4 y no reenvía cabeceras de Instagram como cookies. La web valida identificadores y enlaces otra vez y escribe los textos como texto.
- Reglas de Firestore: escribir lo publicado exige sesión con doble factor por app (no SMS), solo los campos conocidos, la hora del servidor y, si se firma, el correo propio. Si existe `config/admins` (lista `uids`, escrita solo desde la consola), además hay que estar en esa lista: una cuenta ajena con doble factor no publica ni lee el historial ni las fotos subidas; una lista mal escrita no deja entrar a nadie. Nadie puede borrar lo publicado ni cambiar o borrar el historial. Lo publicado no guarda el correo de quien publica (es de lectura pública); el historial sí, y solo lo leen los administradores. La lista de fotos subidas (`fotos/subidas`) solo la leen y cambian administradores, con los campos conocidos y la hora del servidor, y nadie la borra.
- Catálogo en vivo (`catalog-live.js`): antes de cambiar la copia local, revisa la forma de cada producto (identificador como los del panel, textos donde van textos, listas donde van listas, opciones con `id`, `label` y elecciones de texto) y prueba que cada tarjeta pueda calcular su precio; un catálogo dañado no rompe la página. Si una parte de la página falla al volver a pintarse, las demás se actualizan igual. Las preguntas frecuentes publicadas se revisan aparte (`LaurenFaqs.valid`) y todo lo que traen (preguntas, respuestas, temas, referencias de precio) se escribe escapado: nunca entra como HTML. En Firestore, `preguntas` es opcional, de texto y de menos de 200 000 caracteres.
- Workflow del catálogo: `scripts/pull-catalog.mjs` revisa lo publicado con las reglas del panel (`AdminModel.validate`) antes de escribir; además rechaza identificadores que el panel no crea (solo minúsculas, números y guiones) y cualquier campo `__proto__`, que al cargar `js/catalog-data.js` cambiaría el prototipo del objeto. Si no pasa, no cambia nada y GitHub avisa. El resumen del commit no lleva correos. `llms.txt` escribe cada producto en una sola línea. Las acciones del workflow van fijadas a su commit (no a una etiqueta movible), porque el trabajo puede escribir en `main`.
- Al leer localStorage se valida estructura, opciones, campos y cantidades. Identidad y precios se derivan del catálogo vigente; un precio almacenado no es una fuente de verdad. Un precio de $0 cuenta como sin precio (se cotiza) y el panel no deja publicarlo.
- El mensaje de WhatsApp se codifica con `encodeURIComponent`, y cada nombre, opción y texto escrito va en una sola línea (`Catalog.oneLine`): un salto de línea en el catálogo o en el pedido guardado no puede simular un subtotal ni una indicación del negocio. La foto de referencia de una torta solo puede ser de la web o del worker de fotos (la misma lista que `imagePath`). El número de WhatsApp es fijo en el código. Los enlaces externos usan `noopener noreferrer`.
- Política CSP en las páginas: scripts locales, estilos locales/Google Fonts, fuentes del proveedor, imágenes locales/data y del worker de fotos, y video local. La portada además pide al worker la lista de Instagram (`connect-src`) y sus videos (`media-src`). El centro de control además conecta con Firebase y con el worker de fotos, y no carga scripts externos: el SDK de Firebase 13.0.0 se sirve desde el sitio (`js/vendor/firebase/13.0.0/`, copia de gstatic.com con sus importaciones internas apuntando a la copia local). Sin scripts en línea, objetos embebidos ni formularios enviados a un servidor.
- El centro de control no funciona dentro de otra página (GitHub Pages no permite la cabecera `frame-ancestors`): si lo enmarcan, se oculta y no arranca, y el formulario de entrada empieza oculto, así que ni un marco sin scripts lo muestra. La sesión vive solo en la pestaña (nunca en el equipo) y el cierre por inactividad no acepta horas futuras. Es `noindex` y solo envía el origen (`strict-origin`: «https://laurenreposteria.com/», sin la ruta), para que Google acepte la llave de Firebase limitada a la web.
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

Hecho:

- Las cuentas (el Gmail dueño de Firebase y Cloudflare, GitHub y Hostinger) tienen verificación en dos pasos, según el negocio el 17 de octubre de 2026. Es la protección más importante: quien entre a esas cuentas controla la web.
- La llave de Firebase del navegador («Browser key (auto created by Firebase)») solo funciona desde `https://laurenreposteria.com/*`, `https://lauren-reposteria.firebaseapp.com/*`, `https://lauren-reposteria.web.app/*` y `http://localhost:5173/*` (18 de octubre de 2026). Comprobado: desde la web y desde Firebase responde; desde otro sitio o sin origen, Google la bloquea. Si algún día se publica la web en otra dirección, hay que agregarla allí (Google Cloud → Credenciales).
- Reglas de Firestore con la lista de administradores publicadas y `config/admins` creada con los UID de las dos cuentas (vjaramillo17@gmail.com y crizczi22@gmail.com), verificados contra la consola (22 de octubre de 2026). Comprobado con la sesión real: la cuenta en la lista lee lo de administradores y la lista no se puede leer desde la web.
- GitHub (22 de octubre de 2026): «Secret scanning» y «Push protection» activos, y la regla «Proteger main» impide borrar `main` o reescribir su historial (el workflow del catálogo sigue publicando).
- DNS de `laurenreposteria.com` en Hostinger: `TXT @ "v=spf1 -all"` y `TXT _dmarc "v=DMARC1; p=reject; adkim=s; aspf=s"` (18 de octubre de 2026). El dominio no envía correos, así que nadie puede mandar correos falsos a nombre de Lauren. Si algún día se crea un correo @laurenreposteria.com, hay que cambiar esos dos registros por los del servicio de correo.

Falta (revisado el 22 de octubre de 2026):

- Opcional en Cloudflare: el secreto `ADMIN_EMAILS` del worker ya no hace falta, porque el worker consulta la lista de administradores de Firestore.
- Opcional en Firebase Auth: pedir claves de al menos 12 caracteres (política de contraseñas) y aceptar el código de la app solo en su minuto (hoy se aceptan ±2,5 minutos).

El centro de control no tiene «¿Olvidaste tu clave?» a propósito: el negocio lo considera un riesgo. Una clave olvidada se cambia en la consola de Firebase (Authentication → Usuarios).

## Auditoría del 22 de octubre de 2026

Recorrido de cliente y prueba de ataque, sin tocar datos reales:

- **Como cliente**, en escritorio (1440 px) y en teléfono (390 px, también en Safari de iPhone): las ocho páginas sin errores de consola, peticiones fallidas, desbordes ni enlaces o anclas rotos; los 28 productos abren su ficha, recorren todas sus opciones con el precio correcto, respetan los máximos y lo obligatorio y se agregan al pedido; el pedido suma, cambia cantidades, elimina, deshace, edita, se conserva al recargar y arma el mensaje de WhatsApp; filtros, buscador (con y sin tildes), «Ver toda la colección», menú del teléfono, preguntas, video, cantidades inválidas (0, 100, decimales, texto) y teclado (saltar al contenido, foco dentro de los diálogos, Esc y foco de vuelta).
- **Como atacante**: textos con HTML en productos, preguntas, Instagram, pedido guardado y dirección; `__proto__`, tipos cambiados, números extremos y combinaciones explosivas en el catálogo publicado; saltos de línea en el mensaje de WhatsApp; fotos de otros sitios; el token del worker (firma, `alg`, `kid`, vigencia, doble factor), nombres y tipos de archivo, papelera, Instagram como proxy; reglas de Firestore en el emulador; inyección en el workflow, el JSON-LD, el sitemap y `llms.txt`; y la web publicada (HTTPS obligatorio, `www` y `http` redirigen, la documentación, las herramientas, `.git` y la configuración no se sirven, y lo publicado coincide con el repositorio).

Se corrigió:

- Un nombre de producto con saltos de línea podía inventar líneas en el mensaje de WhatsApp (un subtotal falso, una cuenta para transferir). Ahora todo va en una sola línea.
- La foto de referencia del mensaje aceptaba cualquier dirección `https://` del catálogo; ahora solo las de la web o del worker de fotos.
- El catálogo en vivo aceptaba listas escritas como texto (fotos, «Qué incluye», notas, opciones), que rompían la actualización o la ficha; ahora se rechazan, igual que los identificadores que no crea el panel.
- El workflow podía escribir un `__proto__` en `js/catalog-data.js`; ahora se rechaza. `llms.txt` partía en dos líneas los productos cuya descripción tenía un salto de línea (pasaba con Torta Vintage Sencilla y Mini cake); ahora cada producto va en su línea.
- Las acciones del workflow quedaron fijadas a su commit.
- Reglas con lista de administradores, probadas en el emulador (21 casos: con y sin lista, cuenta ajena con doble factor, SMS, sin sesión, lista dañada, lectura y escritura de la lista). Falta publicarlas (ver arriba).

Revisado y correcto: el escape de todo lo dinámico (web y panel), la política CSP de cada página (sin `unsafe-inline` ni `unsafe-eval`), el corte de marcos del panel, el pedido guardado, el número fijo de WhatsApp, la verificación del token en el worker, la validación de fotos por contenido y su nombre elegido por el worker, la papelera, Instagram (no es un proxy abierto), el JSON-LD (`<` escapado) y el workflow sin inyección de comandos.

### Riesgos que quedan

- Los de cuota gratuita y el historial sin botón, descritos arriba.
- GitHub Pages no permite cabeceras propias: sin HSTS ni `frame-ancestors`. El paso a HTTPS lo hace GitHub (redirige siempre) y el panel se protege de los marcos con JavaScript. Poner Cloudflare delante del dominio permitiría ambas cabeceras.
- `fotos/subidas` comprueba que `nombres` sea una lista de hasta 5000, pero las reglas no pueden revisar cada elemento; el panel descarta lo que no sea una foto del worker.

## Auditoría del centro de control (22 de octubre de 2026)

Recorrido como administradora en la vista previa (escritorio, teléfono y Safari de iPhone) y prueba de ataque al panel, sin iniciar sesión en producción. Sin XSS: todo lo dinámico del panel (catálogo, preguntas, nombres de fotos, respuestas del worker) se escribe escapado.

Se corrigió:

- La sesión quedaba guardada en el equipo (IndexedDB) sin vencer, y el cierre por inactividad se podía apagar escribiendo una hora futura en `localStorage` desde cualquier página del sitio. Ahora la sesión vive solo en la pestaña y una hora futura no cuenta.
- Un producto con más de 20.000 combinaciones de opciones pasaba las revisiones y dejaba la web sin actualizarse y el panel sin poder abrirse; ahora no se publica. Si algo falla después de publicar, el panel ya no dice «No pudimos publicar».
- «Borrar para siempre» podía borrar una foto que otro equipo acababa de publicar; ahora mira lo publicado justo antes.
- Una cuenta sacada de la lista de administradores seguía pudiendo subir y borrar fotos: el worker ahora consulta la misma lista (lee `fotos/subidas` con el token de la persona; si Firestore lo niega, responde 403) y la recuerda un minuto.
- El código QR y la clave del doble factor se quedaban en la página, y al cerrar sesión quedaban fotos por borrar y avisos de la sesión anterior.
- Dos grupos podían quedar con el mismo identificador (uno propio llamado «Adicionales» y el de adicionales), y el producto ya no se podía pedir; dos opciones iguales tampoco se detectaban. Ahora no pasa y, si llega así, no se publica.
- Un producto nuevo podía tomar el identificador de uno eliminado sin publicar, y una pregunta que citaba al viejo pasaba a mostrar el precio del nuevo.
- La lectura de «[precio de …]» tardaba segundos por tecla con un texto largo sin «]»; ahora es lineal.
- Lo publicado con una forma dañada dejaba el panel inservible; ahora se abre la copia de la web y se puede reemplazar publicando. La revisión de forma (`Catalog.wellFormed`) es la misma de la web.
- Nombres hechos de caracteres invisibles o con controles de dirección del texto: no cuentan como nombre y se quitan de lo publicado y del mensaje de WhatsApp.
- El formulario de entrada ya no se ve dentro de un marco sin scripts; la CSP del panel permite `blob:` para abrir fotos que el navegador no lee directo; publicar revisa también el máximo de un documento de Firestore (1 MiB).

Quedan, como riesgos conocidos: «oculto» no es privado; y `localhost:5173` sigue permitido en la llave de Firebase y en el worker para las pruebas locales.
