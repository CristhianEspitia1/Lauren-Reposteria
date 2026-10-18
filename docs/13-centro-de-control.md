# Centro de control

Página privada para cambiar productos, precios, textos y fotos sin tocar código: <https://laurenreposteria.com/admin/>. Funciona en el celular y en el computador.

## Cómo se usa

1. **Entrar:** correo y clave. Después, el código de 6 dígitos de la app de códigos (Google Authenticator u otra). La primera vez, el panel muestra un código QR para configurar la app. La sesión queda abierta entre visitas, pero se cierra sola tras 30 minutos sin usar el panel (en cualquiera de sus pestañas). Si tenías cambios sin publicar o una ficha abierta, al entrar de nuevo con el mismo correo sigues donde ibas, mientras no cierres la pestaña.
2. **Buscar el producto:** con el buscador o los filtros, que siguen las páginas de la web y dicen cuántos productos hay en cada uno: Tortas (todas las tortas y los adicionales), Alfajores (incluye la Torta de Alfajor), Brownies, Galletas (un producto por sabor y la caja surtida) y Detalles. «Ocultos» y «Con cambios» solo aparecen cuando hay alguno. La lista se agrupa con un título por grupo: todas las tortas van juntas en «Tortas», primero Torta Vintage y Torta Sencilla; tocar el nombre o «Editar» abre la ficha.
3. **Editar:** la ficha muestra solo lo que le aplica a ese producto. En el computador va en dos columnas: a la derecha, fija, la tarjeta tal como se verá en la web (cambia mientras escribes), si está visible o en la portada y dónde aparece; en el celular, la tarjeta en pequeño va arriba. El formulario sigue este orden: **Lo básico** (nombre), **Precios** (con el aviso «En la tarjeta se verá…» que cambia mientras escribes), **Fotos** (la principal, que va en la tarjeta, y al lado la fila con las demás), **Textos**, **Lo que elige el cliente** (sabores, rellenos, colores) y **Cantidad** (solo Alfajores, Brownies, Galletas y Detalles, que se piden por cantidad). **Dónde aparece** (sección y filtro, que casi nunca cambian) va al lado de la tarjeta. «Eliminar producto» queda al final, lejos de «Guardar». Si cierras la ficha con cambios sin guardar, el panel te pregunta antes. «Guardar» deja el cambio en tu borrador.
4. **Publicar:** la barra de abajo cuenta los cambios sin publicar. «Publicar cambios» los envía y la web los muestra al recargar. «Descartar» vuelve a lo publicado.

Reglas que conviene saber:

- **Precio vacío = «Cotiza por WhatsApp».** Vale para un producto entero o para una sola opción (por ejemplo, 25 a 30 porciones).
- **La portada muestra 4 tortas.** En la lista, cada torta tiene la casilla «Portada» (y en su ficha, «Mostrar en la portada»): la pone en «Una torta tan única como tu celebración» de la página de inicio. Caben 4: con 4 marcadas, el panel avisa y no deja marcar una quinta hasta desmarcar otra. El filtro «En portada» muestra las elegidas. Si marcas menos de 4, la web completa con las siguientes tortas del catálogo. Salen en el orden del catálogo. Los productos de otras secciones ya no van a la portada.
- **Ocultar en vez de eliminar.** La casilla «Visible» quita el producto de la web, del pedido y de Google sin perderlo.
- **Producto nuevo:** toma la estructura del primero de su sección (opciones, porciones, campos de mensaje) con los precios vacíos, y empieza oculto hasta que marques «Visible».
- **Precios de las tortas:** Torta Vintage y Torta Sencilla fijan los precios por porciones; las demás tortas toman los de una de ellas (la fila dice «precios de Torta Vintage»). Si cambias los precios de Torta Vintage, cambian en todas las que los toman. «Ponerle precios propios» le da a una torta sus propios precios.
- **Una torta, muchas fotos.** Cada producto tiene su foto principal (la de la tarjeta) y puede llevar todas las fotos que quieras de la misma referencia: en la web se ven en una fila debajo de la foto grande, con flechas para pasar de una a otra. Así no hace falta crear un producto, con su descripción, por cada foto parecida. En el panel, la principal va grande y las demás en una fila con flechas; Bajo cada foto, los tres puntos abren sus opciones: «Hacer principal» cambia la de la tarjeta y «Quitar» la saca del producto.
- **Cada foto vive en un solo producto.** Dos tarjetas no comparten foto principal y una foto adicional tampoco se repite. El panel no publica un producto visible sin foto.
- **Agregar fotos de la web:** abre todas las fotos de la web y las ya subidas, primero las de la sección del producto, y dice dónde está hoy cada una. Se tocan todas las que quieras (quedan marcadas «Agregada») y luego «Listo». Si la foto ya está en otro producto, se mueve («Se mueve aquí»): sale de allí al guardar. Si es la foto de la tarjeta de otro producto, ese producto se une a este («Se une a este»): todas sus fotos pasan aquí y ese producto se elimina. No se pueden unir Torta Vintage ni Torta Sencilla, porque otras tortas toman sus precios. Al tocar «Listo» (o cerrar, o Esc), el panel muestra un solo resumen con todo lo que se une y se mueve; «Volver» deja seguir eligiendo. Si el selector se cierra sin confirmar (por ejemplo, porque la sesión venció), esa tanda se deshace. Al guardar, solo se une o se mueve lo que sigue en la ficha: si quitaste esa foto, el otro producto queda como estaba. Todo se ve en la web al «Publicar cambios», y el historial guarda la versión anterior.
- **Subir fotos nuevas:** desde el celular o el computador, varias a la vez (hasta 20 por tanda). El panel las ajusta a 1440 px en WebP, con una miniatura de 320 px para las filas de fotos, y el worker de fotos de Cloudflare las guarda y las sirve al instante. Sin costo, sin tarjeta y sin llaves que venzan. Una foto subida no se borra al quitarla del producto: queda disponible en «Agregar fotos de la web», marcada «Foto subida, sin usar». Si ya no la quieres, sus tres puntos tienen «Borrar para siempre»: deja de verse y sale del panel con su miniatura. Por seguridad, el worker la guarda 30 días en una papelera que nadie ve (por si fue un error o alguien entró sin permiso); pasado ese tiempo se borra sola. Para recuperarla hace falta ayuda técnica (`POST /fotos/recuperar/<nombre>` con la sesión del panel). Solo aparece en fotos que ningún producto usa, ni en el borrador ni en lo publicado, y no mientras la tienes elegida. Una foto borrada puede seguir viéndose hasta un día por la caché de Cloudflare, y una versión vieja del historial que la usara ya no la mostraría.
- Los adicionales de torta no llevan fotos: el panel y la web los muestran con su icono.
- **Historial:** cada publicación guarda una copia en Firestore (`historial`), con el correo de quien publicó, para recuperar una versión anterior si hace falta. Nadie puede cambiarla ni borrarla, ni siquiera un administrador.

## Cómo funciona

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Página | `admin/index.html`, `css/admin.css` | Interfaz con los tokens y componentes del manual de marca. No se indexa (`noindex`) |
| Acceso y edición | `js/admin.js` | Firebase Auth con doble factor (TOTP), borrador, editor y publicación |
| Reglas del borrador | `js/admin-model.js` | Plantillas, identificadores, precios en pesos y validación. Probado en `tests/admin.test.mjs` |
| Lectura en vivo | `js/catalog-live.js` | La web pinta con `js/catalog-data.js` y, en paralelo, lee lo publicado; si cambió, vuelve a pintar tarjetas, precios y pedido |
| Seguridad de datos | `firestore.rules` | Lectura pública de `catalogo/actual`; escritura solo con sesión y doble factor |
| Fotos subidas | `worker/fotos/` (Cloudflare Worker `lauren-reposteria`, <https://lauren-reposteria.crizczi22.workers.dev>) | Recibe las fotos del panel, verifica la sesión de Firebase con doble factor, revisa que sean WebP o JPG de menos de 3 MB, las guarda en Workers KV (`FOTOS`) y las sirve en `/f/<nombre>`. Sin llaves ni secretos. Además trae lo último de Instagram para la portada (`src/instagram.js`, ver «Conectar Instagram»). Probado en `tests/fotos-worker.test.mjs` y `tests/instagram-worker.test.mjs` |
| Proyecto | `js/firebase-config.js`, `firebase.json`, `.firebaserc` | Proyecto `lauren-reposteria`, Firestore en `us-east1` |

- Lo publicado vive en el documento `catalogo/actual` (`json`, `updatedAt`). Es de lectura pública, así que no lleva el correo de quien publica: ese queda en la copia del historial (`updatedBy`), que solo leen los administradores. Publicar es una transacción: si alguien publicó mientras editabas, se detiene y pide recargar.
- Firebase Auth usa Identity Platform: sin registro público, doble factor por app de códigos y usuarios creados solo desde la consola (Authentication → Usuarios).
- Cierre por inactividad: `js/admin.js` guarda la hora de la última actividad (toque, tecla, escritura o desplazamiento) en `localStorage` (`lauren-admin-actividad`), compartida entre pestañas. Cada 30 segundos, al volver a la pestaña y al recuperar la sesión guardada, si pasaron más de 30 minutos (`IDLE_MS`) cierra la sesión. Si el navegador no deja guardar, cuenta solo la pestaña abierta.
- `?vista-previa` en `localhost` abre el panel sin sesión para revisar el diseño; no publica.
- **Catálogo del repositorio al día solo:** `js/catalog-data.js` (la primera pintura de la web), el JSON-LD, el sitemap y `llms.txt` salen del catálogo del repositorio. El workflow «Catálogo publicado» (`.github/workflows/catalogo.yml`) revisa cada hora si lo publicado cambió. Si cambió, ejecuta `node scripts/pull-catalog.mjs`, que primero revisa lo publicado con las mismas reglas que el panel aplica al publicar (un catálogo dañado o escrito sin pasar por el panel no llega al repositorio), corre las pruebas y, solo si pasan, hace commit en `main` y pide la publicación de la web. Si algo falla, no cambia nada y GitHub avisa por correo. Para no esperar la hora: GitHub → Actions → «Catálogo publicado» → «Run workflow», o el script a mano.
- Como ese workflow hace commits en `main`, antes de trabajar en el repositorio hay que hacer `git pull`. GitHub pausa los workflows programados tras 60 días sin actividad en el repositorio; si pasa, se reactiva en la pestaña Actions.

## Pendientes

- **Ventana de temporada:** se diseña primero en el manual de marca.
- **Conectar Instagram** (dejado para después el 17 de octubre de 2026): la web y el worker ya están listos en producción desde la versión `2026-10-17-4`, pero falta poner la llave `INSTAGRAM_TOKEN` en Cloudflare. Mientras tanto, «Un poquito más de Lauren» muestra sus cuatro fotos de siempre y no se rompe nada. Pasos en «Conectar Instagram», más abajo.

## Subir fotos nuevas: cómo funciona

```text
Panel (/admin/) ──foto + miniatura + token de Firebase──▶ Worker lauren-reposteria (Cloudflare, gratis)
                                                           │ verifica clave + código (doble factor)
                                                           │ revisa que sea una foto
                                                           ▼
                                      Workers KV «FOTOS»: <nombre>.webp y <nombre>-320.webp
                                                           ▼
                     La web la muestra desde https://lauren-reposteria.crizczi22.workers.dev/f/<nombre>.webp
```

- `GET /f/<nombre>` sirve la foto (pública, caché de un año: el nombre nunca cambia). `GET /fotos` lista las subidas, `POST /fotos/subir` recibe una foto con su miniatura, `DELETE /fotos/<nombre>` la pasa con su miniatura a la papelera (claves `papelera/…` en KV, que se vacían solas a los 30 días y nunca se sirven ni se listan) y `POST /fotos/recuperar/<nombre>` la devuelve desde allí; todas exigen la sesión del panel con doble factor.
- La web usa la miniatura de 320 px en las filas de fotos y la foto completa en la ficha (`srcset` en `LaurenUI.imageAttributes`).
- Orígenes permitidos: `laurenreposteria.com` y `localhost:5173` (`ALLOWED_ORIGINS` en `worker/fotos/wrangler.toml`). `ADMIN_EMAILS` puede limitar la subida a ciertos correos.
- Publicación: Cloudflare Workers Builds está conectado al repositorio y publica el worker solo cuando cambia `worker/fotos`. La primera publicación creó el almacén KV sola.
- Plan gratuito de Cloudflare: 100.000 vistas de fotos y 500 fotos nuevas al día, y 1 GB de espacio (unas 4.500 fotos con su miniatura). La cuenta es `crizczi22@gmail.com`.

## Conectar Instagram

«Un poquito más de Lauren», al final de la portada, muestra las cuatro publicaciones más nuevas de @laurenreposteria22. Los videos se reproducen solos, sin sonido, y al terminar cada casilla pasa a otro video que no esté en otra. Mientras no haya llave, o si Instagram no responde, la portada deja sus cuatro fotos.

```text
Instagram (API con inicio de sesión de Instagram) ──llave INSTAGRAM_TOKEN──▶ Worker lauren-reposteria
                                                                              │ lee las últimas 24 publicaciones cada hora
                                                                              │ guarda la lista en KV y renueva la llave cada semana
                                                                              ▼
La portada pide /instagram y muestra /instagram/foto/<id> y /instagram/video/<id>, siempre desde el worker
```

**Estado:** pendiente. Falta la llave; la portada muestra sus cuatro fotos de siempre.

### Para qué sirve cada paso

- **Cuenta profesional:** Instagram solo deja que otras páginas lean las publicaciones de cuentas profesionales, no de cuentas personales.
- **App en Meta:** es la forma oficial de pedirle permiso a Instagram. Sin ella, Instagram no entrega las publicaciones a ninguna web.
- **La llave:** es ese permiso. Deja que la web lea la cuenta, y solo leerla: no puede publicar nada.
- **Guardarla en Cloudflare:** así queda escondida en el worker. Si estuviera en el código de la web, cualquiera podría verla y usarla.

Se hace una sola vez, en unos 15 minutos. Los pasos de Meta y Cloudflare los hace quien tenga esas cuentas, porque piden sus contraseñas.

### Paso a paso

1. **Revisar que la cuenta sea profesional.** En la app de Instagram, con @laurenreposteria22: perfil → menú ☰ → «Tipo de cuenta y herramientas». Si dice «Cambiar a cuenta profesional», tocarlo, elegir una categoría (por ejemplo, Panadería) y luego «Empresa». Si ya es profesional, seguir al paso 2.
2. **Crear la app en Meta.**
   1. Entrar a <https://developers.facebook.com/apps> con una cuenta de Facebook. La primera vez pide registrarse como desarrollador: aceptar las condiciones y confirmar el correo o el teléfono.
   2. «Crear app». Nombre, por ejemplo «Web Lauren», y el correo de contacto.
   3. Caso de uso: «Administrar mensajes y contenido en Instagram».
   4. Si pregunta por un portafolio empresarial, elegir no conectarlo por ahora.
   5. «Crear app». Puede pedir la contraseña de Facebook.

   No hace falta publicar la app ni pasar la revisión de Meta, porque solo lee la cuenta de Lauren.
3. **Sacar la llave.**
   1. En la app, entrar al caso de uso de Instagram → «Configuración de la API con inicio de sesión de Instagram».
   2. En «Generar tokens de acceso», tocar «Agregar cuenta», entrar con @laurenreposteria22 y aceptar los permisos.
   3. Al lado de la cuenta, «Generar token», y copiar el texto largo que aparece (suele empezar por `IGAA`).

   Si Meta pide agregar la cuenta como evaluadora: en «Roles de la app» → «Evaluadores de Instagram», agregar a @laurenreposteria22; en la app de Instagram, aceptar la invitación en Configuración → Apps y sitios web → Invitaciones de evaluador; y volver a «Generar token».

   La llave es privada: no se manda por chat ni se pega en otro lado que no sea el paso 4.
4. **Guardarla en Cloudflare.**
   1. Entrar a <https://dash.cloudflare.com> con `crizczi22@gmail.com`.
   2. Workers y Pages → `lauren-reposteria` → Configuración → Variables y secretos → Agregar.
   3. Tipo «Secreto», nombre `INSTAGRAM_TOKEN` (exactamente así) y, como valor, la llave.
   4. «Implementar».

   Nunca va en el repositorio.
5. **Comprobar.**
   1. Abrir <https://lauren-reposteria.crizczi22.workers.dev/instagram>: debe mostrar una lista con las publicaciones. Si sale `{"publicaciones":[]}`, la llave no quedó bien: revisar que el nombre sea exacto y que se copió completa.
   2. Abrir laurenreposteria.com en una ventana privada y bajar hasta «Un poquito más de Lauren»: deben estar las cuatro publicaciones más nuevas, con los videos reproduciéndose. En una ventana normal puede tardar hasta 10 minutos.

Meta cambia a veces el nombre de los botones; si alguno no coincide, se busca el más parecido.

### Si no se quiere conectar

- No hace falta hacer nada: la sección sigue con sus cuatro fotos.
- Otra opción, sin Meta: elegir unos reels, bajarlos y subirlos a la web. Se ven igual, con reproducción automática y uno tras otro, pero hay que repetirlo cada vez que se quieran mostrar reels nuevos. Para eso habría que agregar a la web una lista de videos propios; hoy la sección solo lee Instagram.

### Después de conectarla

- La llave dura 60 días. El cron diario del worker (`[triggers]` en `wrangler.toml`) la renueva cada semana y guarda la nueva en KV (`instagram-llave`). Solo hay que repetir los pasos 3 y 4 si Meta la revoca (por ejemplo, al cambiar la contraseña de Instagram) o si el worker pasó 60 días sin renovarla. Al poner un secreto nuevo, el worker deja la llave guardada y usa la nueva.
- Instagram no entrega el video de los reels con música de su biblioteca: esos se ven con su portada fija y, al tocarlos, se abren en Instagram.
- El worker solo pide a Instagram archivos de publicaciones que ya leyó, nunca direcciones que le lleguen de afuera, y la web nunca ve las direcciones de Instagram, que vencen.
- Cada foto o trozo de video cuenta como una visita del worker en el plan gratuito (100.000 al día).

## Mantenimiento

```bash
firebase deploy --only firestore:rules --project lauren-reposteria
node scripts/pull-catalog.mjs   # trae lo publicado y regenera el SEO (el workflow lo hace solo cada hora)
node --test tests/*.test.mjs
# El worker de fotos se publica solo al subir cambios de worker/fotos a main.
```
