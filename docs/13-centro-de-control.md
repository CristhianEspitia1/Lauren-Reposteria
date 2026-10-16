# Centro de control

Página privada para cambiar productos, precios, textos y fotos sin tocar código: <https://laurenreposteria.com/admin/>. Funciona en el celular y en el computador.

## Cómo se usa

1. **Entrar:** correo y clave. Después, el código de 6 dígitos de la app de códigos (Google Authenticator u otra). La primera vez, el panel muestra un código QR para configurar la app.
2. **Buscar el producto:** con el buscador o los filtros por sección (Tortas, Adicionales, Alfajores, Brownies, Galletas, Detalles, Diseños de la galería, Ocultos, Con cambios).
3. **Editar:** «Editar» abre la ficha con nombre, sección, filtro, visibilidad, precios por opción (porciones, tamaños, presentaciones), textos, cantidad mínima y fotos. «Guardar» deja el cambio en tu borrador.
4. **Publicar:** la barra de abajo cuenta los cambios. «Publicar cambios» los envía y la web los muestra al recargar. «Descartar» vuelve a lo publicado.

Reglas que conviene saber:

- **Precio vacío = «Cotiza por WhatsApp».** Vale para un producto entero o para una sola opción (por ejemplo, 25 a 30 porciones).
- **Ocultar en vez de eliminar.** La casilla «Visible» quita el producto de la web, del pedido y de Google sin perderlo.
- **Producto nuevo:** toma la estructura del primero de su sección (opciones, porciones, campos de mensaje) con los precios vacíos, y empieza oculto hasta que marques «Visible».
- **Diseños de la galería de Tortas:** usan los precios y opciones de su torta base. Si cambias los precios de Torta Vintage, cambian en todos sus diseños. «Ponerle precios propios» los separa.
- **Fotos:** por ahora se eligen entre las fotos que ya tiene la web. Subir fotos nuevas llega cuando se active Storage en Firebase (plan Blaze, `us-east1`).
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
