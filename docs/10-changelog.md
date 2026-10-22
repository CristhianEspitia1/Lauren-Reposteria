# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/).
Este proyecto no usa versiones semánticas; se registra por fecha de
auditoría/cambio. Cada día que se lleva a producción se marca con una etiqueta de
Git con su fecha (por ejemplo, `2026-10-17`; si hay otra salida el mismo día,
`2026-10-17-2`) y una versión en GitHub con sus notas, para tener un punto fijo al
que volver.

## [2026-10-22 — Versiones del catálogo en el centro de control]

- «Versiones», junto a «Avisos»: las 12 publicaciones más recientes con su fecha, quién la publicó y qué cambió frente a la anterior; «En la web» marca la que se ve hoy. «Volver a esta versión» pregunta antes (y avisa si se pierden cambios sin publicar) y la deja en el borrador para revisarla y publicarla; trae de vuelta de la papelera las fotos que se borraron hace menos de 30 días. Si alguien publicó desde otro equipo, pide recargar antes.
- El diálogo de «Avisos» mide 600 px, como dice el manual (la regla de la confirmación lo dejaba en 480). En el teléfono, «Avisos» y «Versiones» comparten la línea y «Nuevo producto» va debajo, a todo el ancho.
- El centro de control carga Firebase desde el sitio (`js/vendor/firebase/13.0.0`, la versión 13.0.0 sin cambios salvo sus importaciones internas): ya no depende de `gstatic.com` y solo ejecuta código propio (`script-src 'self'`).
- Manual de marca 3.9. 4 pruebas nuevas (105 en total).

## [2026-10-22 — Auditoría del centro de control]

- Publicado desde el panel: la respuesta de «¿Cuánto cuesta un detalle de regalo?» cita ahora el Detalle Golden ($85.000) en vez del Detalle con Torta, oculto (en la web decía «precio a consultar»), y se corrigieron errores de escritura en Torta Vintage Sencilla, Alfajores Personalizados, Mini cake, Oso Grande y el adicional «Happy Birthday (acrílico)».
- GitHub: «Secret scanning», «Push protection» y la regla «Proteger main» activos.

- Recorrido como administradora en la vista previa, en escritorio y teléfono: lista, filtros, buscador, avisos, fichas de todos los productos, precios y cantidades con valores raros, grupos y opciones, «Elegir varias», portada, ocultar, cambiar de sección, producto nuevo en cada sección, fotos (menú, sacar, selector, mover y unir), preguntas frecuentes («Agregar precio», orden, temas, eliminar), descartar y Esc.
- Al guardar una ficha, lo que impide guardarla (un precio con letras o de $0) se dice primero; antes preguntaba «¿Guardar así?» como si fuera un precio vacío y después daba el error.
- Una pregunta frecuente que cita el precio de un producto oculto, eliminado o sin precio ya no se puede publicar (en la web decía «precio a consultar»; pasaba en «¿Cuánto cuesta un detalle de regalo?», que citaba a Detalle con Torta, oculto, y ya se corrigió). El panel lo avisa al ocultar o eliminar ese producto.
- Avisos nuevos para revisar: dos productos visibles con el mismo nombre o la misma descripción (un producto nuevo empieza con la del primero de su sección) y una página que quedaría sin productos.
- Publicar revisa antes el tamaño máximo de las reglas y, si Firestore niega el permiso con la sesión al día, dice que la cuenta no tiene permiso en vez de «tu sesión venció».
- La vista previa de las tortas en la ficha es la tarjeta compacta de la web; la caja de «Agregar precio» es más alta en el teléfono; los textos largos sin espacios (un enlace pegado en una descripción) se parten en tarjetas, fichas, pedido, preguntas y panel en vez de cortarse.
- Seguridad del panel ([detalle](09-seguridad.md#auditoría-del-centro-de-control-22-de-octubre-de-2026)): la sesión vive solo en la pestaña y el cierre por inactividad no se puede burlar; el worker de fotos respeta la lista de administradores; «Borrar para siempre» mira lo publicado antes; no se publican productos con demasiadas combinaciones, grupos u opciones repetidos ni nombres invisibles; identificadores nuevos que no reutilizan los de productos eliminados; lectura de precios lineal; lo publicado dañado se puede reemplazar; el doble factor y la sesión anterior no dejan rastros; el panel arranca oculto.
- 6 pruebas nuevas (101 en total).

## [2026-10-22 — Auditoría de cliente y de seguridad]

- Recorrido completo como cliente en escritorio y teléfono (también Safari de iPhone) y prueba de ataque a la web, el panel, el worker, las reglas y el workflow. Detalle en [seguridad](09-seguridad.md#auditoría-del-22-de-octubre-de-2026).
- Pedido: las opciones se leen en el mismo orden que en la ficha (porciones primero) y sin las aclaraciones del formulario («Número de galletas: 6 galletas»), en el pedido y en el mensaje de WhatsApp. «Deshacer» devuelve el producto a su lugar en la lista, con el foco en él.
- Mensaje de WhatsApp en una sola línea por dato y foto de referencia solo de la web o del worker; catálogo en vivo que revisa la forma de cada producto; el workflow rechaza `__proto__` e identificadores que no crea el panel; `llms.txt` con cada producto en su línea; acciones del workflow en v5 (Node 24, sin el aviso de Node 20) y fijadas a su commit.
- Reglas de Firestore con lista de administradores (`config/admins`), probadas en el emulador, publicadas y con la lista creada (las dos cuentas); `ADMIN_EMAILS` del worker pasa a ser un secreto opcional de Cloudflare.
- 9 pruebas nuevas.

## [2026-10-20 — Varios toppings con máximo y ofertas por cantidad]

- Un grupo de opciones puede dejar elegir varias, con un máximo por tamaño: toppings de brownies, hasta 3 en las cajas x3 y x6 y hasta 4 en la x16. Se configura en el panel («El cliente puede elegir varias» y «Cuántas puede elegir») y la ficha no deja marcar de más.
- Galletas: «Poner un precio a cada cantidad» deja escribir el precio de 3, 6 o 12 galletas (ofertas) en vez de multiplicar el de una.
- Manual de marca 3.8. 2 pruebas nuevas.

## [2026-10-20 — Preguntas frecuentes desde el centro de control]

- Las preguntas de Portada, Tortas, Alfajores, Brownies y galletas, Detalles y la página de preguntas se editan en el panel: una sola lista (filtro «Preguntas»), cada pregunta con sus páginas y su tema, en el orden de la lista (flechas para subir y bajar). Se agregan, se cambian y se eliminan, y se publican con «Publicar cambios».
- Los precios dentro de las respuestas siguen saliendo del catálogo vigente: «Agregar precio» los pone en palabras («[precio de Torta Sencilla, 25 a 30 porciones]»), y «[página Tortas]» pone un enlace.
- Datos en `js/faq-data.js` (repositorio) y en `preguntas` de `catalogo/actual` (Firestore); `scripts/seo.mjs` escribe las secciones y su JSON-LD, la web las lee en vivo y el workflow las trae al repositorio con el catálogo. Reglas de Firestore con el campo nuevo.
- Manual de marca 3.8. 9 pruebas nuevas.

## [2026-10-19 — Lo nuevo de Tortas, en los demás productos]

- Revisión de Alfajores, Brownies y galletas y Detalles: sus páginas ya salen del catálogo, sin secciones escritas a mano, y lo nuevo (costos por tamaño, adicionales propios, avisos, preguntas antes de lo delicado, filas parejas e imagen para compartir) ya les aplica.
- «Detalle torta» también acuerda la frase o el número de la torta en la asesoría, como las tortas; las letras e iniciales de los demás detalles siguen escribiéndose en la ficha.
- En los productos que se piden por unidad (galletas × 6), los costos adicionales se cobran por cada unidad.
- El panel dice según qué grupo cambian los costos de cada producto («según «Presentación»»).
- Manual de marca 3.7. 2 pruebas nuevas.

## [2026-10-19 — Filas parejas sin estilos en el HTML]

- En producción, la política de seguridad de la web bloqueaba el `style="--n: …"` que llevaban las filas de bizcochos y rellenos, y se veían angostas. Ahora `site.js` pone `--n` con el CSSOM (permitido) y, sin él, las filas usan su máximo por fila. Prueba: el HTML de «Un sabor para recordar» no lleva estilos.

## [2026-10-19 — El mensaje de la torta se acuerda en la asesoría]

- La ficha de las tortas ya no tiene campo para escribir el mensaje: dice «El mensaje o las letras de tu torta los acordamos contigo en la asesoría por WhatsApp.». Se quita la casilla de la frase del panel. Los alfajores y detalles personalizados conservan sus campos.
- Textos al día: el paso «Dale tu toque» de la portada, la pregunta «¿Puedo personalizar mi pedido?» de Tortas y la descripción de Tortas para Google y al compartir.
- Manual de marca 3.6.

## [2026-10-19 — Avisos y preguntas antes de lo delicado en el centro de control]

- Botón «Avisos» con su número: reúne lo que impide publicar, lo que conviene revisar (un aviso por producto y por tema) y lo que no se permitió o falló mientras se usaba el panel, cada uno con «Ir a arreglarlo». Si algo impide publicar, «Publicar cambios» abre los avisos; un error inesperado del panel también queda anotado.
- El panel pregunta, con el nombre del producto, antes de salir sin guardar, ocultar, pasar a otra sección, publicar (con la lista de lo que cambia), guardar con algo por revisar, quitar una opción, el mensaje de una torta o la foto de un sabor, y poner el mismo valor en todos los tamaños.
- La frase de la torta vuelve a ser solo la casilla «Se puede escribir una frase o letras en la torta».
- Textos del panel más sencillos. Manual de marca 3.5.

## [2026-10-19 — Cada grupo con sus propios sabores, adicionales y precios por tamaño]

- Sale «Sabores y adicionales» compartido de Tortas: cada producto tiene sus propios bizcochos, rellenos, adicionales, porciones, precios y textos, editados en su ficha y todo desplegado. Las tortas que tomaban los precios de otra quedan con su propia copia al publicar desde el panel.
- Costos por tamaño: un relleno, bizcocho o adicional puede sumar un valor distinto para cada porción («Nutella · +$5.000» en 4 a 6 y «+$25.000» en 25 a 30), con «Mismo valor en todos». La ficha de la web cambia el «+» al elegir otro tamaño y avisa que esas opciones suman al total.
- Fotos de bizcochos y rellenos desde el panel («Subir foto»), para «Un sabor para recordar»; si alguno sube el precio, la frase de la sección lo dice.
- La vitrina «Los detalles hacen la diferencia» pasa a «Adicionales para tu torta», con una frase que explica que tienen un valor adicional, y su precio es texto libre.
- Bizcochos, rellenos y adicionales se acomodan solos en filas parejas al agregar o quitar; los textos largos no se salen de su espacio.
- Los textos que trae un producto nuevo quedan escritos (no de ejemplo) para editarlos o borrarlos; los de la frase de la torta se editan en la ficha.
- Manual de marca 3.4.

## [2026-10-19 — La marca al compartir un enlace]

- Las imágenes que salen al compartir la web (WhatsApp, redes) se rehicieron con el manual: los colores, letras y franja albaricoque de la marca, y la foto en arco con el sello lila, como la portada. Antes usaban rosas que no son de la paleta, Playfair en 500 y un marco lila que el manual no tiene.
- El título que muestra el chat empieza por la marca: «Lauren Repostería · Tortas personalizadas en Medellín».
- Manual de marca 3.3: «Imagen para compartir».

## [2026-10-19 — La sincronización del catálogo vuelve a funcionar]

- El workflow «Catálogo publicado» fallaba en cada corrida desde el 17 de octubre: 4 pruebas fijaban precios y tortas concretas («Desde $65.000», más de 40 tortas, `galeria-tortas-13`…) y el negocio cambió precios y unió tortas desde el panel. Nada de lo publicado llegaba al repositorio (primera pintura de la web, JSON-LD, sitemap, `llms.txt`).
- Las pruebas de reglas (precios, pedido, panel) usan ahora un catálogo de prueba fijo, `tests/fixtures/catalog-data.js`. El catálogo real se revisa en `tests/catalogo-real.test.mjs` con reglas que valen para cualquier catálogo: se publica idéntico, cada producto muestra su precio y se puede abrir, las tortas tienen torta base, foto y adicionales, y «Un sabor para recordar» se arma.
- `js/catalog-data.js` al día con lo publicado (36 productos; 5 tortas tras unir fotos), con su SEO.

## [2026-10-19 — «Un sabor para recordar» desde el catálogo]

- La sección de sabores de /tortas/ ya no está escrita a mano: muestra los bizcochos y rellenos del catálogo (los de «Sabores y adicionales»), en su orden y con su nombre, y la frase cuenta los que hay («Cuatro bizcochos, siete rellenos…»). Lo que cuesta más dice «+$10.000».
- Los que no tienen foto (hoy, Crema de vainilla y Ganache de café) van debajo: «También: Crema de vainilla · Ganache de café».
- `js/flavors.js` lo pinta en el navegador al llegar lo publicado y `scripts/seo.mjs` lo escribe en el HTML.
- Manual de marca 3.2: componente «Sabores de Tortas» con la línea «También».
- 1 prueba nueva.

## [2026-10-19 — Sabores, rellenos premium y adicionales que suman al total]

- «Frase corta de la tarjeta» ya se ve en las tortas (en /tortas/ y en la portada), bajo el nombre. Antes las tarjetas de torta eran compactas y nunca la mostraban, aunque el panel la ofrecía. Sin frase, la tarjeta queda solo con nombre y precio, y «Elegir detalles» queda alineado en toda la fila.
- Rellenos y bizcochos con costo adicional: cada uno puede llevar un valor fijo («Nutella · +$10.000») que se suma al total de la torta. Nuevo campo `extra` en las elecciones del catálogo.
- Los adicionales de torta (moños, mariposas, perlas…) se marcan en la ficha de cada torta y suman su precio. Uno sin precio fijo (o con el rango de antes) se puede marcar, pero la torta pasa a «Consultar por WhatsApp». Los pedidos guardados antes siguen funcionando.
- Centro de control: nueva fila «Sabores y adicionales», arriba de las tortas, para agregar, quitar y poner precio a bizcochos, rellenos y adicionales en un solo lugar, para todas las tortas. Avisa si hoy alguna torta tiene otra lista. Los adicionales ya no van como filas sueltas.
- Centro de control: casilla «Se puede escribir una frase o letras en la torta» en la ficha de cada torta.
- /tortas/: «Los detalles hacen la diferencia» ahora invita a elegirlos en los detalles de la torta.
- Manual de marca 3.1: tarjeta de torta con frase corta, opciones con «+», adicionales en la ficha y el diálogo «Sabores y adicionales».
- 2 pruebas nuevas: costos adicionales, adicionales y pedidos guardados antes; copia de bizcochos y rellenos en todas las tortas.

## [2026-10-17 — Las fotos que ya tienen producto, tapadas]

- En «Agregar fotos de la web», las fotos que ya están en otro producto se ven borrosas y van al final de su sección, para que las libres se encuentren de un vistazo. Se aclaran al pasar por encima o al tocarlas, y se pueden seguir moviendo o uniendo como antes.

## [2026-10-17 — La lista de fotos subidas, siempre al día]

- Las fotos de prueba seguían apareciendo después de borrarlas: la lista de fotos subidas salía de Cloudflare, que no garantiza estar al día después de borrar, y al borrar varias seguidas podía perder alguna marca de borrado. Ahora la lista vive en Firestore (`fotos/subidas`, solo administradores): el panel anota cada foto al subirla y la quita al borrarla, así que una foto borrada desaparece en el acto y en todos los dispositivos. Cloudflare sigue guardando los archivos.
- Las fotos subidas antes de este cambio que ningún producto usa (las de prueba) ya no aparecen en «Agregar fotos de la web».
- Reglas de Firestore para `fotos/subidas`, probadas en el emulador (32 casos).

## [2026-10-17 — Borrar fotos de verdad y sacarlas de un producto]

- «Borrar para siempre» ya borra de verdad: la foto sale de la lista en el acto y no vuelve al recargar. Antes, la lista de fotos subidas venía de Cloudflare, que tarda en ponerse al día después de borrar, y si Cloudflare decía que la foto no existía, el panel la dejaba a la vista con «Esa foto ya estaba borrada». Ahora el worker marca cada foto borrada y nunca la vuelve a listar, y borrar dos veces no es un error.
- Si algo falla al borrar, el aviso lo dice (antes decía «No pudimos subir las fotos»).
- En los tres puntos de cada foto, «Quitar» pasa a «Sacar de esta torta» («Sacar de este producto» fuera de Tortas), y el aviso dice a dónde va la foto: una de la web vuelve a «Agregar fotos de la web»; con una subida, el panel pregunta «Guardarla en mis fotos» o «Borrarla», y la borrada se borra al publicar (en el selector dice «Se borra al publicar»).
- Manual de marca 2.6: el menú de foto con «Sacar de esta torta» y la nueva confirmación.
- 2 pruebas nuevas: una foto borrada no vuelve aunque la lista de KV siga atrasada, y al publicar solo se borran las fotos sacadas que nadie usa.

## [2026-10-17 — Tortas sin subgrupos]

- Salen los filtros y el buscador de Tortas que llegaron en la versión anterior, a pedido del negocio: las tortas no se agrupan con botones, sino que cada torta reúne en su ficha las fotos de su estilo y precio (Torta Vintage, Torta Sencilla…). Esos grupos se arman en el centro de control uniendo fotos («Agregar fotos de la web» → «Se une a este»).
- El panel deja de pedir subgrupo en Tortas, y Alfajores y Detalles vuelven a como estaban: un producto nuevo toma el filtro del primero de su sección.
- El catálogo publicado deja de guardar subgrupos en las tortas.
- Manual de marca 2.5: «Filtros de colección» describe solo Alfajores y Detalles.

## [2026-10-17 — Subgrupos en Tortas]

- La página de Tortas tiene los mismos filtros que Alfajores y Detalles, con buscador: Cumpleaños (13), De corazón (8), Flores y frutos (6), Infantiles (8), Temáticas (6) y Grados y comuniones (4). Los eligió el negocio; cada torta va en uno.
- En el centro de control, cada torta tiene «Filtro en la página» en «Dónde aparece». Un producto nuevo empieza sin subgrupo y no se publica visible hasta elegirlo (en Tortas, Alfajores y Detalles).
- Un subgrupo sin productos no se muestra en la web, y si era el elegido vuelve a «Todos».
- Manual de marca 2.5: «Filtros de colección» (`.catalog-toolbar`), que ya se usaba en Alfajores y Detalles sin estar en el manual.
- 2 pruebas nuevas: los botones de cada página coinciden con los subgrupos del panel y ningún producto visible queda sin subgrupo.

## [2026-10-17 — Auditoría de seguridad y del centro de control]

- Fotos subidas: «Borrar para siempre» ya no las borra al instante. Pasan 30 días a una papelera del worker que nadie ve y se pueden recuperar (`POST /fotos/recuperar/<nombre>`); así ni un error ni una sesión robada causan una pérdida irreversible.
- Lo publicado (`catalogo/actual`, de lectura pública) deja de guardar el correo de quien publica; el historial, que solo leen los administradores, lo conserva. Las reglas aceptan las dos formas mientras llega el panel nuevo. El resumen de los commits del catálogo tampoco lleva correos.
- El workflow del catálogo revisa lo publicado con las reglas del panel antes de traerlo: un catálogo dañado o escrito sin pasar por el panel no llega al repositorio. La web en vivo tampoco cambia a un catálogo que no puede dibujar.
- El centro de control no arranca dentro de otra página (protección contra clics engañosos) y solo carga scripts de la versión fija de Firebase.
- Precios: «65.000,00» se lee $65.000 (antes, $6.500.000); no se publica un precio de $0, que se veía «Cotiza por WhatsApp» en la tarjeta y $0 en la ficha; en los adicionales, el «Precio hasta» debe ser mayor que el «Precio desde». La tarjeta de «Así se verá en la web» dice «Revisa los precios» mientras haya uno con letras.
- Un adicional sin precio dice «Cotiza por WhatsApp», como pide el manual y como avisaba el panel (antes, «Precio en asesoría»).
- Panel: «Este producto pasa a…» en el resumen de unir (decía «Esta producto»), y al guardar un producto oculto el aviso recuerda marcar «Visible».
- Foco con teclado al abrir una ficha: contorno ciruela en lugar del del navegador. La cabecera usa el crema del manual en vez de un color suelto.
- GitHub Pages deja de publicar `firebase.json` y `firestore.rules`; el sitemap escapa las direcciones de las fotos.
- [Seguridad](09-seguridad.md): resultados de la auditoría, riesgos que quedan y lo pendiente en las cuentas externas.
- 6 pruebas nuevas (precios, papelera y revisión del catálogo publicado).

## [2026-10-17 — Nada se mueve al elegir]

- En la ficha de producto, marcar una opción (porciones, bizcocho, relleno…) ya no ensancha el botón: el punto de la elegida tiene su sitio reservado en todas, así que las filas no se reacomodan al tocar. Pasa igual en las opciones del centro de control.
- En «Agregar fotos de la web», la línea «Agregada», «Se mueve aquí» o «Se une a este» tiene su espacio reservado bajo cada foto: marcar una ya no empuja hacia abajo las fotos siguientes.
- Total de la ficha: las unidades («12 unidades») van en su propia línea y, en los productos que las suman, el desglose guarda siempre sus dos líneas. Antes, en el teléfono, elegir 12 galletas o la bolsa de brownies partía el desglose en dos y el pie crecía.
- Los enlaces de texto ya no empujan lo que tienen al lado al pasar el cursor: la flecha avanza dentro de un margen reservado (antes, «Ver todas las preguntas» movía a «Te ayudamos por WhatsApp», y «Cómo hacer tu pedido» se corría a la izquierda). «Pausar videos» y «Ver videos» ocupan el mismo sitio.
- Centro de control: «Oculto» en «Así se verá en la web» tiene su sitio reservado (marcar «Visible» bajaba 2 px la tarjeta y las casillas), y al cambiar la sección o la torta base la opción tocada se queda bajo el dedo aunque la ficha cambie de partes.
- Manual de marca 2.4: el punto de `.choice` y su sitio reservado, la regla «Nada salta al elegir» y el punto 9 de «Antes de publicar».

## [2026-10-17 — Lo último de Instagram en la portada]

- «Un poquito más de Lauren» muestra las cuatro publicaciones más nuevas de @laurenreposteria22, y cada casilla abre la suya en Instagram. Los videos se reproducen solos, sin sonido, y al terminar esa casilla pasa a otro video que no esté en otra (si no queda otro, repite el suyo). Se pausan fuera de pantalla, con la pestaña oculta y con «Pausar videos», al centro debajo; con movimiento reducido o «ahorro de datos» queda la portada.
- Las cuatro casillas quedan alineadas (antes, la segunda y la cuarta bajaban 32 px), en 4:5 como las galerías, con esquina casi recta y fondo durazno mientras cargan. Sale la esquina de 80 px de la tercera en móvil, que no estaba en el manual.
- Worker de fotos: `GET /instagram`, `/instagram/foto/<id>` y `/instagram/video/<id>` (`worker/fotos/src/instagram.js`), con la lista guardada una hora en KV y un cron diario que renueva la llave cada semana. Sin la llave `INSTAGRAM_TOKEN`, la portada deja sus cuatro fotos. Pasos para conectarla en el centro de control («Conectar Instagram»).
- Manual de marca 2.3: «Lo último de Instagram», segunda excepción a la reproducción automática y proporción 4:5 de sus casillas.
- 7 pruebas nuevas del worker (`tests/instagram-worker.test.mjs`).

## [2026-10-17 — Pedir tu torta, paso a paso, y revisión del móvil]

- «Pedir tu torta es así de sencillo»: cuatro pasos pensados para tortas (Elige tu torta, Escoge porciones y sabor, Dale tu toque, La confirmamos contigo), en cuatro columnas en escritorio, dos en tableta y una en móvil.
- «Una torta tan única como tu celebración»: sin frase, más compacta (64 px arriba y abajo; 48 en móvil) y con «Encuentra tu estilo» a la derecha del titular (en móvil, debajo).
- La mano con flores (`mano-flor`) pasa al hueco bajo la tarjeta de Tortas de «Tú pones el motivo…», antes de «Pedir tu torta…»: 96 px, centrada y a 48 px del texto de la tarjeta; solo escritorio. Para que siempre quepa completa, en escritorio esa sección reserva 192 px abajo (`.collections-section`) y «Pedir tu torta…» empieza a 32 px, más junto a la sección anterior. Las tarjetas de colección cuentan enteras como ocupadas para los dibujos.
- La foto de Tortas en «Tú pones el motivo…» recorre las fotos de las tortas visibles del catálogo cada 4 s con un fundido (`data-photo-cycle` en `js/site.js`): toma también las que se suben desde el panel y se actualiza si cambia el catálogo. Se detiene con el cursor o el foco, fuera de pantalla, con la pestaña oculta, con movimiento reducido y con «ahorro de datos».
- Se recupera el isotipo de «Los detalles hacen la diferencia» en Tortas, que se había perdido al quitar la sección de celebración; en móvil va al final de la frase (`desk` en `js/brand-decor.js`).
- Casilla «Portada» del panel: desmarcar y volver a marcar deja la torta como estaba publicada, sin un cambio fantasma.
- Revisión del móvil en 320, 360, 375, 390 y 414 px y en tableta, en las siete páginas: sin desbordes ni dibujos sobre el contenido. Áreas táctiles de 44 px en pantallas táctiles (pie, ruta, nombres de producto, barra del video); etiqueta y franja de valores a 11 px; horario y año del pie con espacios duros; pie en una columna por debajo de 380 px y su línea final apilada; `text-size-adjust` para el iPhone.
- Manual de marca 2.2 y su versión visual: pasos para pedir, tortas de la portada, foto que cambia (única excepción a la reproducción automática), icono `heart`, lugares de `mano-flor` e `isotipo-circulo`, y reglas del móvil.

## [2026-10-17 — La portada se centra en las tortas]

- Inicio: después de «Tú pones el motivo…» va «Pedir es así de sencillo» y luego «Una torta tan única como tu celebración», con su frase, cuatro tortas y el botón «Encuentra tu estilo». Salen «Pequeños grandes favoritos» y las dos fotos fijas de la celebración; la mano con flores (`mano-flor`) acompaña el nuevo titular.
- `Catalog.featured()` devuelve solo tortas: primero las marcadas con `featured` y, si faltan, las siguientes del catálogo, hasta 4. `Catalog.featurable()` dice qué puede ir a la portada.
- Centro de control: casilla «Portada» en la fila de cada torta y filtro «En portada». La casilla de la ficha solo aparece en tortas y el límite de 4 cuenta solo tortas. Los productos de otras secciones que tenían la marca dejan de salir en la portada.
- Manual de marca 2.1: sección «Tortas de la portada», fila del panel con «Portada» y nuevos lugares de `mano-flor`, `brownie` e `isotipo-circulo`.

## [2026-10-17 — Huella en CSS y JS]

- Las páginas piden cada CSS y JS propio con la huella de su contenido (`?v=` y 10 caracteres de su hash). La pone `scripts/seo.mjs` en todas las páginas, también `404.html` y `admin/index.html`, y la mantiene el workflow del catálogo. Así, después de publicar, nadie recibe una mezcla de archivos viejos y nuevos por la caché de 10 minutos de GitHub Pages. `seo.mjs --check` y una prueba nueva fallan si una huella quedó vieja.

## [2026-10-17 — Catálogo publicado al día solo]

- Nuevo workflow «Catálogo publicado» (`.github/workflows/catalogo.yml`): cada hora revisa, con solo dos archivos, si lo publicado en el centro de control cambió. Si cambió, ejecuta `scripts/pull-catalog.mjs`, corre las pruebas y las comprobaciones de SEO y, solo si pasan, hace commit en `main` y pide la publicación de GitHub Pages. También se lanza a mano desde la pestaña Actions.
- `scripts/pull-catalog.mjs` sale con 1 si el repositorio está atrasado y con 2 si algo falla, sin cambiar nada.
- Antes de trabajar en el repositorio: `git pull` (CLAUDE.md, README y guía del centro de control).

## [2026-10-17 — Reauditoría y limpieza]

- Panel sin avisos del navegador: salir con cambios, descartar, publicar con errores, salir de la ficha sin guardar, quitar un grupo y eliminar un producto usan la confirmación de la marca (`.admin-confirm`), con el foco en la opción segura; sin «Cancelar» es un aviso de un botón.
- «Agregar fotos de la web»: si el selector se cierra sin confirmar (cierre forzado o sesión vencida), lo que se unía o se movía se deshace; Esc pasa por el resumen; soltar cualquier foto de un producto unido deshace la unión; al guardar solo se une o se mueve lo que sigue en la ficha; un segundo toque mientras carga no abre otro selector; una foto elegida no se puede borrar.
- La ficha también trata Esc con su confirmación, y al cambiar una opción con el teclado el foco se queda en ella.
- Avisos (`.toast`) en la capa superior: se ven encima de los diálogos, también en la web.
- Ficha de la web: las flechas de la fila de fotos solo aparecen si las miniaturas no caben y nunca tapan la primera ni la última.
- Worker de fotos: comprueba que una foto existe sin descargarla antes de borrarla.
- Catálogo: `node scripts/pull-catalog.mjs` trae al repositorio lo publicado en el panel y regenera el SEO (`--check` avisa si quedó atrás). Se trajo lo publicado hoy (4 tortas unidas a Torta Vintage) y las pruebas eligen sus ejemplos del catálogo en lugar de productos fijos.
- Limpieza: reglas CSS sin uso o repetidas, nombre de la torta base escapado en las notas de la ficha, y metadatos de macOS y objetos duplicados dentro de `.git` (causaban los avisos `non-monotonic index`).

## [2026-10-17 — Borrar fotos subidas sin usar]

- Las fotos subidas se guardan en el worker de fotos y «Quitar» solo las saca del producto, por eso seguían en «Agregar fotos de la web». Ahora las que ningún producto usa se marcan «Foto subida, sin usar» y sus tres puntos tienen «Borrar para siempre», con la confirmación de la marca. El worker suma `DELETE /fotos/<nombre>` (borra la foto y su miniatura, solo con sesión de administrador), con su prueba en `tests/fotos-worker.test.mjs`.

## [2026-10-17 — Un solo resumen al unir]

- «Agregar fotos de la web» ya no pregunta en cada foto. Al tocarlas quedan marcadas «Se une a este» o «Se mueve aquí», y al tocar «Listo» (o cerrar) aparece un solo resumen con la lista de productos que se unen (foto, nombre y cuántas fotos traen) y de dónde salen las fotos movidas. «Volver» deja seguir eligiendo y «Unir y seguir» confirma.

## [2026-10-17 — Agregar fotos de la web mueve y une]

- En «Agregar fotos de la web», cada foto vive en un solo producto. Una foto adicional de otro producto se mueve: sale de allí al guardar. La foto de la tarjeta de otro producto ofrece unirlo, con una confirmación de la marca (`.admin-confirm`): todas sus fotos pasan a la ficha abierta y ese producto se elimina al guardar; en la web se ve al publicar. Las tortas base (Vintage y Sencilla) no se pueden unir porque otras toman sus precios. El selector dice dónde está hoy cada foto.
- En el celular, la ficha usa todo el ancho y la vista previa ya no se monta sobre el título.

## [2026-10-17 — Sin desplegables genéricos en el panel]

- «Toma los precios de», «Sección de la web» y «Filtro en la página» se eligen con las opciones de la ficha (`.choice`) en lugar de desplegables del sistema. En el celular, «Eliminar producto» queda al final, después de «Dónde aparece». El manual lo deja como regla del centro de control.

## [2026-10-17 — Ficha con vista previa al lado]

- La ficha de editar y crear del centro de control pasa a dos columnas en escritorio: el formulario a la izquierda y, a la derecha y fija, la tarjeta real de la web que cambia mientras se escribe, con «En la web» (Visible y Portada) y, al final, «Dónde aparece». En el celular, la tarjeta va arriba en pequeño. El panel carga `css/catalog.css` para usar la misma tarjeta. Manual y versión visual actualizados.

## [2026-10-17 — Menú de tres puntos en las fotos]

- La fila de fotos (ficha de la web y centro de control) tiene ahora las flechas flotando sobre los extremos de las miniaturas: círculo de 28 px con área táctil de 44 px y sombra flotante, centradas en la altura de las fotos, y ocultas al llegar al final. La fila usa todo el ancho. Manual y versión visual actualizados.
- En la ficha del centro de control, «Principal», «Hacer principal» y «Quitar» pasan a un menú que se abre con los tres puntos bajo cada foto. Nuevo icono `more` y nuevo componente «Menú de foto» (`.admin-photo-menu`) en el manual de marca y en su versión visual.

## [2026-10-17 — La sesión del panel se cierra sola]

- El centro de control cierra la sesión tras 30 minutos sin actividad, también al volver otro día con la sesión guardada. Los cambios sin publicar y la ficha abierta se conservan para el mismo usuario hasta que vuelva a entrar en esa pestaña.

## [2026-10-16 — Portada con cuatro lugares]

- «Mostrar en la portada» admite como máximo 4 productos (`Catalog.FEATURED`): el panel bloquea la casilla cuando ya hay 4 y no deja publicar más; la web y el SEO usan `Catalog.featured()`, que nunca devuelve más de 4.

## [2026-10-16 — Todas las tortas iguales]

- Las 50 tortas se tratan igual: todas mandan su foto en el mensaje de WhatsApp y todas pueden marcarse «Mostrar en la portada» y tener frase corta. Se quitan del catálogo las marcas internas `design` y `reference`; solo `basedOn` indica de qué torta toma los precios (y esas no se repiten en el JSON-LD, como antes).

## [2026-10-16 — Centro de control más sencillo]

- Lista: filtros con la cuenta de productos («Ocultos» y «Con cambios» solo cuando hay alguno), grupos con título (Tortas, con todas las tortas juntas; Adicionales de torta y cada sección) y el nombre del producto abre su ficha.
- Ficha: secciones en el orden en que se usan (Lo básico, Precios, Fotos, Textos, Lo que elige el cliente, Cantidad, Dónde aparece), aviso en vivo «En la tarjeta se verá…», columnas «Opción» y «Precio», textos sin palabras técnicas, cuadros de texto a la medida de su contenido, «Eliminar producto» al final y confirmación al cerrar con cambios sin guardar.
- Barra de publicar: «N cambios sin publicar. Aún no se ven en la web.». El selector de fotos ya no usa estilos en línea (los bloquea la CSP).

## [2026-10-16 — Una torta, muchas fotos]

- Ficha de producto: la foto principal grande y, debajo, la fila de fotos (`.photo-strip`) en una sola línea, con flechas translúcidas a los lados, la elegida centrada y cambio de foto deslizando el dedo. Nuevo componente en el manual de marca.
- Centro de control: la principal grande y las demás en una fila con flechas; «Agregar fotos de la web» deja tocar varias a la vez. La regla «cada foto va en un solo producto» pasa a «la foto principal es única»: las demás fotos pueden repetirse entre tortas.
- «Subir fotos nuevas»: el panel comprime cada foto (1440 px y miniatura de 320 px) y el worker de Cloudflare `worker/fotos` (`lauren-reposteria.crizczi22.workers.dev`) las guarda en Workers KV y las sirve al instante. Sin costo, sin tarjeta y sin llaves; no usa Firebase Storage ni GitHub. Pruebas en `tests/fotos-worker.test.mjs`.

## [2026-10-16 — Una foto por producto y editor según el tipo]

- Cada foto va en un solo producto. Torta Vintage y Torta Sencilla dejan de mostrar en su ficha las fotos de los diseños de la galería (cada diseño ya tiene la suya). Galletas: Red Velvet y Pistachos quedan con su foto propia, Panelita con `galletas.webp`, Chocolate blanco con `galletas-especiales.webp` y la caja surtida con `galletas-tres-chocolates.webp`.
- Centro de control: «Agregar una foto de la web» ofrece solo fotos libres; no se publica una foto repetida ni un producto visible sin foto. La cantidad mínima y su nombre solo aparecen en Alfajores, Brownies, Galletas y Detalles.

## [2026-10-16 — Panel ordenado y galletas por sabor]

- Centro de control: un filtro por tipo de producto (Tortas reúne bases, diseños y adicionales; Alfajores incluye la Torta de Alfajor; Brownies y Galletas por separado). Los adicionales de torta se muestran con su icono y ya no llevan fotos; se eliminan las 5 fotos antiguas de `assets/optimized/logos`.
- Galletas: el producto único se separa en seis productos, uno por sabor (`galleta-chips`, `galleta-red-velvet`, `galleta-cocoa`, `galleta-pistachos`, `galleta-chocolate-blanco`, `galleta-panelita`), y `galletas-caja-surtida`. Mismos precios: $8.000 tradicionales y $10.000 especiales por unidad, mínimo 3; caja surtida $46.000. La rejilla de Brownies y galletas pasa a cuatro columnas y los botones «Elegir este sabor» abren la ficha de cada sabor.

## [2026-10-15 — Centro de control]

- Nueva página privada `/admin/`: acceso con correo, clave y código de app (doble factor TOTP con Firebase Identity Platform), lista de productos con buscador y filtros, editor de precios por opción, textos, cantidad, visibilidad y fotos de la web, productos nuevos desde la plantilla de su sección y publicación con un botón.
- Firestore (`us-east1`): `catalogo/actual` con lectura pública y escritura solo de administradores con doble factor; cada publicación queda en `historial`. Reglas en `firestore.rules`.
- La web lee lo publicado en vivo (`js/catalog-live.js`) y vuelve a pintar tarjetas, precios de los textos y pedido. Sin conexión sigue con `js/catalog-data.js`. CSP: `connect-src` admite `firestore.googleapis.com`.
- Manual de marca: fila de producto y barra de publicar del centro de control.

## [2026-10-15 — Catálogo editable, fase 1 del centro de control]

- `js/catalog-data.js` pasa a ser solo datos (JSON), listo para que lo edite el centro de control. Formato en `docs/12-catalogo.md`.
- Salen del código y pasan a los datos: frases de las tarjetas (`summary`), notas de la ficha (`notes`), filtros (`group`), destacados de la portada (`featured`), mínimo y rótulo de cantidad, complemento del precio y las reglas especiales de galletas y brownies.
- El precio de cada tarjeta se calcula desde las opciones; se elimina `priceFormatted`. Los precios de las preguntas frecuentes e introducciones se enlazan al catálogo con `data-price`.
- Precio vacío: la tarjeta dice «Cotiza por WhatsApp» y, en la ficha, una elección sin precio cambia el total por «Consultar por WhatsApp». `visible: false` oculta un producto de la web, del pedido y del SEO.
- Las páginas listan sus productos por categoría: un producto nuevo aparece solo en su sección. Los precios publicados no cambian.
- Los diseños de la galería de Tortas pasan al mismo formato con `basedOn`: heredan opciones, precios y notas de Torta Vintage o Torta Sencilla, así que un cambio de precio en la torta base llega a todos sus diseños.

## [2026-10-15 — Cada torta con su ficha]

- La página de Tortas deja la galería de fotos sueltas: cada foto es una tarjeta de producto que abre la misma ficha de Torta Vintage (qué incluye, porciones, bizcocho, relleno, mensaje y total).
- Los diseños que ya estaban en las fotos de Torta Vintage o Torta Sencilla toman sus porciones y precios. Los demás usan los precios de Torta Vintage como referencia, con descripción propia y una nota de que el valor final se confirma por WhatsApp.
- Un diseño sin estilo (`null`) queda listo para el panel: muestra «Cotiza por WhatsApp», se eligen porciones sin precio y la consulta llega a WhatsApp con la foto.
- El pedido incluye el enlace de la foto de cada diseño, para que Laura sepa cuál es. Los diseños no se repiten en el menú del JSON-LD ni en `llms.txt`.

## [2026-10-15 — Torta de Alfajor sin frase]

- La Torta de Alfajor ya no ofrece «Mensaje personalizado»: no es personalizable. Solo se elige el tamaño, y el pedido llega a WhatsApp como pedido listo para entregar.

## [2026-10-15 — Manual de marca obligatorio y nueva 404]

- `docs/06-guia-de-estilos.md` pasa a ser el manual de marca 2.0, con solo lo que usa la web hoy. `CLAUDE.md` lo hace obligatorio para todo cambio visual o de texto.
- La 404 usa la cabecera, el pie, el pedido y el botón de WhatsApp del sitio, un encabezado con foto en arco y sello, y el bloque de colecciones de la portada. Se elimina `css/error.css`.

## [2026-10-15 — Qué incluye siempre visible y nuevo titular]

- La ficha de producto muestra «Qué incluye» siempre abierto, como un bloque con título y lista, sin botón para desplegar. Aplica a los 22 productos que tienen esa información.
- El titular de la portada pasa a «Un bocado de alegría, hecho a mano.».

## [2026-10-15 — SEO integral]

- URL limpias: la portada pasa de `/html/inicio.html` (redirección desde `/`) a `/`; las colecciones a `/tortas/`, `/alfajores/`, `/brownies-galletas/` y `/detalles/`. Las direcciones antiguas redirigen con `canonical`. Rutas de páginas y datos desde la raíz (`/assets/…`); el pedido guardado toma la foto vigente del catálogo.
- `scripts/seo.mjs` genera desde el catálogo títulos, descripciones, canonical, hreflang, Open Graph/Twitter, JSON-LD (`Bakery`, `WebSite`, `CollectionPage`, `FAQPage`, `BreadcrumbList`, `Menu`/`MenuItem` con precios, `VideoObject`), `sitemap.xml` con imágenes y `llms.txt`.
- `scripts/social-images.mjs`: tarjetas JPEG 1200 × 630 por página, `favicon.ico`, `apple-touch-icon`, iconos del manifest y logotipo PNG. Nuevo `site.webmanifest`.
- H1 con la búsqueda principal en el antetítulo, preguntas de precio y ubicación con importes del catálogo, textos alternativos descriptivos y carga diferida bajo el primer pantallazo. La 404 enlaza a las colecciones.
- `_config.yml` evita que GitHub Pages publique documentación y herramientas; `robots.txt` lo refuerza.
- `tests/seo.test.mjs` (7 pruebas). Detalle y tareas externas en [SEO](11-seo.md).

## [2026-10-15 — Mensajes de WhatsApp según el tipo de pedido]

- El pedido se clasifica con `Catalog.custom`: es personalizado si incluye una torta o cualquier producto con mensaje, iniciales o tema escrito. Un pedido listo (cajas, bolsitas, brownies, galletas, detalles sin texto) ya no menciona diseño ni «valor final de la personalización».
- Pedido listo: «Quiero hacer este pedido», pide fecha y domicilio o recogida y cierra con «¿Me confirmas la disponibilidad?». Pedido personalizado: «Quiero encargar este pedido personalizado», pide fecha de la celebración, invita a enviar una foto de referencia y propone revisar el diseño.
- Cada producto muestra «Valor» o «2 × $22.000 = $44.000» en lugar de «Precio por presentación». Las etiquetas pierden aclaraciones de formulario («(opcional)», «(3 letras)») y el interruptor del mensaje pagado del Oso Grande no se repite junto al texto.
- El aviso del carrito cambia con el tipo de pedido y recuerda la anticipación mínima de 2 días en pedidos listos. La cotización de adicionales ya no deja líneas vacías.

## [2026-10-15 — Auditoría de catálogo, precios e imágenes]

- Revisados los 23 productos y 579 combinaciones de opciones: todos los totales del pedido (precio × cantidad) suman bien y todas las fotos de fichas y galerías existen con sus tamaños adaptables.
- Brownies y Galletas muestran «Desde $24.000», el mínimo real que se puede pedir (antes $6.500 y $8.000 por unidad). Alfajores individuales: «Desde $2.000 c/u». Oso Grande y Detalle Golden pasan a «Desde» porque tienen precios variables.
- La ficha muestra el desglose del total (p. ej. «2 × $78.000 · 24 unidades») y marca «c/u» en los precios por unidad. El encabezado del pedido cuenta lo mismo que el icono del carrito.
- El mensaje pagado del Oso Grande (+$4.000) y el sabor de galleta del Detalle Golden pasan a ser obligatorios. Retiradas marcas `priceModifier: true` sin efecto y unificados los rangos de porciones («4 a 5 porciones»).
- Alfajores personalizados: $60.000 por caja de 6, ya se agregan al pedido (antes solo por cotización). Se quitaron las opciones de un solo valor y la etiqueta «$60.000 (unidad)».
- Etiquetas de opciones en mayúsculas al estilo español y sin precios escritos a mano: el precio lo añade la ficha desde los datos, con «c/u» cuando es por unidad (`perUnit`).
- 15 pruebas pasan (2 nuevas: precio de tarjeta = mínimo real; opciones pagadas obligatorias; la de alfajores personalizados se reescribió).

## [2026-10-15 — Limpieza: un solo diseño]

- Se elige el diseño original (Esencia). Retirados las propuestas 2–4, el comparador `modelos.html`, las páginas de revisión `fotografias.html` e `iconos.html` y sus hojas y scripts.
- Retirados el sitio demo `_sites/lauren-alfajores`, `tmp/`, `src/` vacío, el pipeline antiguo (`optimize-assets.mjs`, `apply-optimized-assets.mjs`, `asset-map.json`), el informe de auditoría de julio, el roadmap y el editor local del catálogo (`tabla-productos.html`).
- Retirados del proyecto los originales de fotos y video, el brandbook `.ai`, los PNG generados y todas las imágenes sin referencia en la web. `manifest.json` queda como inventario de las 107 fotos publicadas.
- Documentación actualizada a la estructura vigente.

## [2026-09-30 — Sobremesa]

- Añadida la cuarta propuesta, Sobremesa, en inicio y las cuatro colecciones: tipografía amplia, fotografía vertical y composición editorial en crema/lila. Comparte la marca, el catálogo y el pedido con las propuestas anteriores.
- Comparador y selector ampliados a cuatro diseños; el cambio de modelo conserva la página y la selección del pedido.
- Dos rondas de revisión visual y ajustes. Comprobada la geometría sin desbordamiento horizontal en las cinco páginas a 360, 1024 y 1440 px; portada a 768 px y portada, menú, configurador y pedido a 390 px. Verificado que cambiar 4 → 3 → 4 conserva la selección.
- Las 13 pruebas de catálogo/pedido pasan. Actualizadas las dos expectativas antiguas de imagen de respaldo para reflejar el isotipo SVG vigente, sin modificar la implementación. Sintaxis del cargador y las composiciones, y `git diff --check`, correctos.
- Disponible en vista previa local. Sin publicación ni pruebas en dispositivos físicos.

## [2026-09-23 — Fotografías y scroll]

- Eliminadas las máscaras y demoras de aparición al bajar en los tres modelos. El contenido permanece visible sin depender de un observador de scroll.
- Generadas copias de 320, 640 y 960 px para las 107 fotografías del inventario y la portada Serena; integradas mediante fuentes responsive en portadas, colecciones, galerías, configurador y miniaturas del pedido.
- Fotos públicas con carga anticipada y prioridad para la portada; las galerías conservan los grupos de ocho y agregan nuevas imágenes sin reconstruir las anteriores.
- Verificadas sintaxis, fuentes locales, los tres inicios sin fotos ocultas o pendientes, ampliación de la galería de tortas y cambio de foto del producto. Sin publicación ni medición de Core Web Vitals.

## [2026-09-22 — Rediseño integral local]

### Familia de iconos refinada

- Redibujados los pictogramas semánticos para los tres modelos, con retícula de 24 unidades, trazo uniforme, geometría clara y siluetas propias de productos y complementos. El isotipo oficial conserva sus trazados.
- Añadida una lupa específica para ampliar imágenes, diferenciada del signo de añadir. Tamaños de trazo para ilustraciones grandes compartidos mediante token; controles de cantidad y eliminación de 44 px.
- Eliminadas las ilustraciones duplicadas de los pasos en el HTML de inicio. Muestrario local en `html/iconos.html`, que consume la misma familia que el sitio y permite verla a 48 y 20 px.
- Comprobados los 33 nombres del registro, sus SVG, referencias y sintaxis. Revisión focalizada en escritorio del muestrario, complementos, ampliación de fotos, pedido vacío y controles de cantidad del configurador; no se repitió la matriz responsive completa.

### Alineación con el brandbook

- Revisadas las 23 páginas del manual aportado por el usuario. Actualizados los cuatro colores de marca a sus valores oficiales en los tokens compartidos por los tres modelos.
- Extraídos los trazados originales del logotipo, nombre, sello e isotipo a SVG monocromos. Aplicados en cabeceras, pies, comparadores, favicon y composiciones que muestran el símbolo; eliminados los filtros y giros que afectaban esas reproducciones.
- Documentadas las tipografías oficiales y la diferencia con Playfair Display e Inter, que se mantienen como adaptación web hasta disponer de los archivos de fuente correspondientes.
- Comprobación focalizada: sintaxis de los tres módulos afectados, nueve SVG válidos, 24 referencias HTML y admisión de las 107 fotografías y ocho recursos de marca en la utilidad de rutas. Revisados el logo y sello de Esencia, el isotipo de Serena y el pie claro de Encuentro en el navegador.
- Conservados el archivo Illustrator local, las fotografías, las composiciones aprobadas y el funcionamiento del catálogo. Sin publicación en producción.

### Colección fotográfica compartida

- Aplicadas 107 fotografías renovadas a los tres modelos locales: 22 principales, 76 tomas adicionales, cuatro sabores y cinco rellenos. Las copias de una misma toma comparten edición; los originales se conservan.
- Galería de comparación en `html/fotografias.html`, con filtros, numeración estable y acceso a los PNG. Inventario y prompts en `assets/propuestas-fotograficas/manifest.json`.
- Ampliadas las galerías de las cuatro colecciones. Las fichas muestran la foto completa y las miniaturas debajo; sabores y rellenos tienen sus proporciones propias.
- Corregidos el fondo de la galleta con guante y la perspectiva de la torta rosa de 19 años a partir de las observaciones del usuario. El sello de esta última se reemplazó usando el logotipo oficial de Lauren como referencia.
- Comprobadas existencia y referencias de los 107 archivos, sintaxis del JavaScript afectado, portadas de los tres modelos, apertura de imágenes y miniaturas. Comprobación focalizada a 390 px del configurador y los rellenos. Sin nueva auditoría integral ni publicación.

### Propuestas Serena y Encuentro

- Conservado el modelo 1, Esencia; añadidos modelo 2, Serena, y modelo 3, Encuentro, con portadas, colecciones, componentes de compra y pies adaptados a cada dirección visual.
- Composiciones rehechas tomando Esencia como referencia: tipografía Playfair, fondos claros, lila como acento, curvas y navegación superior. Fotografía de campaña para la portada Serena y composición del regalo Golden en Encuentro; los importes del catálogo se conservan.
- Comparador en `html/modelos.html` y selector por URL que conserva la página y el pedido; sin modificar la paleta, los importes o contactos.
- Sustituidas las ilustraciones raster de los cinco complementos por SVG semánticos originales, también usados en el editor.
- Verificadas las diez páginas alternativas a 360, 768, 1024 y 1440 px, muestras visuales a 390 px y recorridos de menú, configurador, carrito y cambio de modelo. Cambios disponibles en vista previa local.

### Base del modelo 1

- Portada y cuatro colecciones rediseñadas con fotografía real, paleta crema/lila, titulares editoriales, navegación visible y adaptación a ventanas estrechas.
- Familia original de iconos Trazo Lauren, botones y controles compartidos, foco visible y movimiento reducido.
- Catálogo único, filtros/búsqueda, galerías ampliables y configuración de producto. Recalculados los precios por presentación, sabor, cantidad y extras; validación de mínimos, colores, iniciales y mensajes.
- Pedido persistente con edición de opciones, cantidades, eliminación/deshacer y resumen de WhatsApp. Texto dinámico escapado y precios derivados de la fuente vigente.
- Entrevista en su proporción horizontal completa, poster y controles propios de reproducción, sonido, avance y ampliación.
- Editor de catálogo con borrador seguro y descarga de todos los campos; entradas raíz/404 y metadatos de categoría coherentes.
- Eliminados 16 archivos CSS/JS obsoletos y los estilos inline extensos. Añadida CSP y reforzado el servidor local para rangos y rutas.
- 13 pruebas de lógica del catálogo/pedido. Comprobaciones renderizadas en siete tamaños para las cinco páginas públicas y recorridos de producto, pedido, búsqueda, galería y video. Exportación descargada del editor comparada con los 27 productos y todas sus propiedades. Verificados HEAD, rangos de video y rechazo de rutas inválidas del servidor local. Alcance detallado en accesibilidad; sin envío de mensajes ni publicación en producción.
- Alfajores personalizados por cotización hasta confirmar la unidad de venta del precio heredado.

## [Auditoría de julio 2026]

Auditoría técnica y refactorización integral. Base de código profesionalizada sin
alterar la identidad visual ni la funcionalidad de cara al cliente.

### Añadido
- `robots.txt`, `sitemap.xml` y `404.html` personalizado on-brand.
- `css/tokens.css`: sistema centralizado de design tokens.
- `scripts/dev-server.mjs`: servidor local con soporte de *Range* para video y 404.
- Carpeta `docs/` con documentación de arquitectura, estructura, decisiones,
  componentes, guía de estilos, convenciones, performance, SEO, accesibilidad y
  seguridad.
- Metadatos SEO y `schema.org` donde faltaban.

### Cambiado
- **Nombres de assets** migrados a `kebab-case` ASCII (293 archivos) y `slug`
  integrado en el pipeline de optimización para mantener la convención.
- Consolidación de la carga de fuentes en una sola petición por página.
- Unificación de tokens de color, tipografía y espaciado.

### Eliminado
- Carpeta `fonts/` (11 MB, familia no utilizada y con rutas locales de Windows).
- Cinco assets optimizados sin referencia alguna en el código.
- Archivos de sistema `._*` y `.DS_Store` del árbol de trabajo.

### Corregido
- Rutas de assets frágiles (espacios, tildes, emojis, mayúsculas) que podían
  romper en GitHub Pages.
- (Ver el informe de auditoría para el detalle completo de correcciones de
  accesibilidad, seguridad, copy y consistencia.)

---

> Historial previo: ver `git log`. Antes de esta auditoría el proyecto había
> tenido una revisión en mayo de 2026 centrada en heroes, media y limpieza de
> guías obsoletas.
