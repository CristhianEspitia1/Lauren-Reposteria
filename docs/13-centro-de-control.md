# Centro de control

Página privada para cambiar productos, precios, textos y fotos sin tocar código: <https://laurenreposteria.com/admin/>. Funciona en el celular y en el computador.

## Cómo se usa

1. **Entrar:** correo y clave. Después, el código de 6 dígitos de la app de códigos (Google Authenticator u otra). La primera vez, el panel muestra un código QR para configurar la app.
2. **Buscar el producto:** con el buscador o los filtros, que siguen las páginas de la web y dicen cuántos productos hay en cada uno: Tortas (todas las tortas y los adicionales), Alfajores (incluye la Torta de Alfajor), Brownies, Galletas (un producto por sabor y la caja surtida) y Detalles. «Ocultos» y «Con cambios» solo aparecen cuando hay alguno. La lista se agrupa con un título por grupo: todas las tortas van juntas en «Tortas», primero Torta Vintage y Torta Sencilla; tocar el nombre o «Editar» abre la ficha.
3. **Editar:** la ficha muestra solo lo que le aplica a ese producto, en este orden: **Lo básico** (nombre, visible, portada), **Precios** (con el aviso «En la tarjeta se verá…» que cambia mientras escribes), **Fotos** (la primera es la de la tarjeta), **Textos**, **Lo que elige el cliente** (sabores, rellenos, colores), **Cantidad** (solo Alfajores, Brownies, Galletas y Detalles, que se piden por cantidad) y **Dónde aparece** (sección y filtro, que casi nunca cambian). «Eliminar producto» queda al final, lejos de «Guardar». Si cierras la ficha con cambios sin guardar, el panel te pregunta antes. «Guardar» deja el cambio en tu borrador.
4. **Publicar:** la barra de abajo cuenta los cambios sin publicar. «Publicar cambios» los envía y la web los muestra al recargar. «Descartar» vuelve a lo publicado.

Reglas que conviene saber:

- **Precio vacío = «Cotiza por WhatsApp».** Vale para un producto entero o para una sola opción (por ejemplo, 25 a 30 porciones).
- **Ocultar en vez de eliminar.** La casilla «Visible» quita el producto de la web, del pedido y de Google sin perderlo.
- **Producto nuevo:** toma la estructura del primero de su sección (opciones, porciones, campos de mensaje) con los precios vacíos, y empieza oculto hasta que marques «Visible».
- **Precios de las tortas:** Torta Vintage y Torta Sencilla fijan los precios por porciones; las demás tortas toman los de una de ellas (la fila dice «precios de Torta Vintage»). Si cambias los precios de Torta Vintage, cambian en todas las que los toman. «Ponerle precios propios» le da a una torta sus propios precios.
- **Cada foto va en un solo producto.** La ficha de un producto muestra solo sus fotos; «Agregar una foto de la web» ofrece solo las que no usa ningún otro producto, y el panel no deja publicar una foto repetida ni un producto visible sin foto. Así la ficha de Torta Vintage no muestra las fotos de otras tortas.
- **Fotos:** por ahora se eligen entre las fotos que ya tiene la web. Subir fotos nuevas llega cuando se active Storage en Firebase (plan Blaze, `us-east1`). Los adicionales de torta no llevan fotos: el panel y la web los muestran con su icono.
- **Historial:** cada publicación guarda una copia en Firestore (`historial`), para recuperar una versión anterior si hace falta.

## Cómo funciona

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Página | `admin/index.html`, `css/admin.css` | Interfaz con los tokens y componentes del manual de marca. No se indexa (`noindex`) |
| Acceso y edición | `js/admin.js` | Firebase Auth con doble factor (TOTP), borrador, editor y publicación |
| Reglas del borrador | `js/admin-model.js` | Plantillas, identificadores, precios en pesos y validación. Probado en `tests/admin.test.mjs` |
| Lectura en vivo | `js/catalog-live.js` | La web pinta con `js/catalog-data.js` y, en paralelo, lee lo publicado; si cambió, vuelve a pintar tarjetas, precios y pedido |
| Seguridad de datos | `firestore.rules` | Lectura pública de `catalogo/actual`; escritura solo con sesión y doble factor |
| Proyecto | `js/firebase-config.js`, `firebase.json`, `.firebaserc` | Proyecto `lauren-reposteria`, Firestore en `us-east1` |

- Lo publicado vive en el documento `catalogo/actual` (`json`, `updatedAt`, `updatedBy`). Publicar es una transacción: si alguien publicó mientras editabas, se detiene y pide recargar.
- Firebase Auth usa Identity Platform: sin registro público, doble factor por app de códigos y usuarios creados solo desde la consola (Authentication → Usuarios).
- `?vista-previa` en `localhost` abre el panel sin sesión para revisar el diseño; no publica.

## Pendientes

- **Fotos nuevas:** activar Storage (plan Blaze, `us-east1`), reglas de Storage y subida con compresión desde el panel.
- **Copia de la web y SEO:** `js/catalog-data.js`, el JSON-LD, el sitemap y `llms.txt` se generan desde el catálogo del repositorio. Hasta automatizarlo, después de publicar cambios grandes se trae lo publicado al repositorio y se ejecuta `node scripts/seo.mjs`.
- **Ventana de temporada:** se diseña primero en el manual de marca.

## Mantenimiento

```bash
firebase deploy --only firestore:rules --project lauren-reposteria
node --test tests/*.test.mjs
```
