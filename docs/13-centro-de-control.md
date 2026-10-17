# Centro de control

Página privada para cambiar productos, precios, textos y fotos sin tocar código: <https://laurenreposteria.com/admin/>. Funciona en el celular y en el computador.

## Cómo se usa

1. **Entrar:** correo y clave. Después, el código de 6 dígitos de la app de códigos (Google Authenticator u otra). La primera vez, el panel muestra un código QR para configurar la app.
2. **Buscar el producto:** con el buscador o los filtros, que siguen las páginas de la web y dicen cuántos productos hay en cada uno: Tortas (todas las tortas y los adicionales), Alfajores (incluye la Torta de Alfajor), Brownies, Galletas (un producto por sabor y la caja surtida) y Detalles. «Ocultos» y «Con cambios» solo aparecen cuando hay alguno. La lista se agrupa con un título por grupo: todas las tortas van juntas en «Tortas», primero Torta Vintage y Torta Sencilla; tocar el nombre o «Editar» abre la ficha.
3. **Editar:** la ficha muestra solo lo que le aplica a ese producto, en este orden: **Lo básico** (nombre, visible, portada), **Precios** (con el aviso «En la tarjeta se verá…» que cambia mientras escribes), **Fotos** (la principal, que va en la tarjeta, y al lado la fila con las demás), **Textos**, **Lo que elige el cliente** (sabores, rellenos, colores), **Cantidad** (solo Alfajores, Brownies, Galletas y Detalles, que se piden por cantidad) y **Dónde aparece** (sección y filtro, que casi nunca cambian). «Eliminar producto» queda al final, lejos de «Guardar». Si cierras la ficha con cambios sin guardar, el panel te pregunta antes. «Guardar» deja el cambio en tu borrador.
4. **Publicar:** la barra de abajo cuenta los cambios sin publicar. «Publicar cambios» los envía y la web los muestra al recargar. «Descartar» vuelve a lo publicado.

Reglas que conviene saber:

- **Precio vacío = «Cotiza por WhatsApp».** Vale para un producto entero o para una sola opción (por ejemplo, 25 a 30 porciones).
- **La portada tiene 4 lugares.** «Mostrar en la portada» pone el producto en «Pequeños grandes favoritos» de la página de inicio. Caben 4: con 4 marcados, la casilla de los demás se bloquea y dice cuáles ocupan la portada; hay que desmarcar uno para poner otro. El panel tampoco publica más de 4 y la web, aunque llegaran más, solo muestra los 4 primeros.
- **Ocultar en vez de eliminar.** La casilla «Visible» quita el producto de la web, del pedido y de Google sin perderlo.
- **Producto nuevo:** toma la estructura del primero de su sección (opciones, porciones, campos de mensaje) con los precios vacíos, y empieza oculto hasta que marques «Visible».
- **Precios de las tortas:** Torta Vintage y Torta Sencilla fijan los precios por porciones; las demás tortas toman los de una de ellas (la fila dice «precios de Torta Vintage»). Si cambias los precios de Torta Vintage, cambian en todas las que los toman. «Ponerle precios propios» le da a una torta sus propios precios.
- **Una torta, muchas fotos.** Cada producto tiene su foto principal (la de la tarjeta) y puede llevar todas las fotos que quieras de la misma referencia: en la web se ven en una fila debajo de la foto grande, con flechas para pasar de una a otra. Así no hace falta crear un producto, con su descripción, por cada foto parecida. En el panel, la principal va grande y las demás en una fila con flechas; «Hacer principal» cambia la de la tarjeta y «Quitar» la saca del producto.
- **La foto principal es única.** Dos tarjetas no pueden tener la misma foto principal. Las demás fotos sí pueden repetirse en varias tortas. El panel no publica un producto visible sin foto.
- **Agregar fotos de la web:** abre todas las fotos de la web y las ya subidas, primero las de la sección del producto. Se tocan todas las que quieras (quedan marcadas «Agregada») y luego «Listo».
- **Subir fotos nuevas:** desde el celular o el computador, varias a la vez (hasta 20 por tanda). El panel las ajusta a 1440 px en WebP y las guarda en el código de la web (`assets/subidas/`), en un solo cambio por tanda. En el panel se ven al instante; en la web, uno o dos minutos después, lo que tarda GitHub Pages en publicar. Sin costo y sin tarjeta. Una foto subida no se borra al quitarla del producto: queda disponible en «Agregar fotos de la web».
- Los adicionales de torta no llevan fotos: el panel y la web los muestran con su icono.
- **Historial:** cada publicación guarda una copia en Firestore (`historial`), para recuperar una versión anterior si hace falta.

## Cómo funciona

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Página | `admin/index.html`, `css/admin.css` | Interfaz con los tokens y componentes del manual de marca. No se indexa (`noindex`) |
| Acceso y edición | `js/admin.js` | Firebase Auth con doble factor (TOTP), borrador, editor y publicación |
| Reglas del borrador | `js/admin-model.js` | Plantillas, identificadores, precios en pesos y validación. Probado en `tests/admin.test.mjs` |
| Lectura en vivo | `js/catalog-live.js` | La web pinta con `js/catalog-data.js` y, en paralelo, lee lo publicado; si cambió, vuelve a pintar tarjetas, precios y pedido |
| Seguridad de datos | `firestore.rules` | Lectura pública de `catalogo/actual`; escritura solo con sesión y doble factor |
| Fotos subidas | `worker/fotos/` (Cloudflare Worker `lauren-reposteria`, <https://lauren-reposteria.crizczi22.workers.dev>) | Recibe las fotos del panel, verifica la sesión de Firebase con doble factor, revisa que sean WebP o JPG de menos de 3 MB y las guarda en `assets/subidas/` con un commit por tanda. La llave de GitHub vive solo ahí, como secreto. Probado en `tests/fotos-worker.test.mjs` |
| Proyecto | `js/firebase-config.js`, `firebase.json`, `.firebaserc` | Proyecto `lauren-reposteria`, Firestore en `us-east1` |

- Lo publicado vive en el documento `catalogo/actual` (`json`, `updatedAt`, `updatedBy`). Publicar es una transacción: si alguien publicó mientras editabas, se detiene y pide recargar.
- Firebase Auth usa Identity Platform: sin registro público, doble factor por app de códigos y usuarios creados solo desde la consola (Authentication → Usuarios).
- `?vista-previa` en `localhost` abre el panel sin sesión para revisar el diseño; no publica.

## Pendientes

- **Copia de la web y SEO:** `js/catalog-data.js`, el JSON-LD, el sitemap y `llms.txt` se generan desde el catálogo del repositorio. Hasta automatizarlo, después de publicar cambios grandes se trae lo publicado al repositorio y se ejecuta `node scripts/seo.mjs`.
- **Ventana de temporada:** se diseña primero en el manual de marca.

## Subir fotos nuevas: cómo funciona y cómo se activa

```text
Panel (/admin/) ──foto + token de Firebase──▶ Worker lauren-reposteria (Cloudflare, gratis)
                                               │ verifica clave + código (doble factor)
                                               │ revisa que sea una foto
                                               ▼
                         GitHub: assets/subidas/<nombre>.webp (1 commit por tanda)
                                               ▼
                         GitHub Pages publica la web (1–2 minutos)
```

- `GET /fotos` lista las subidas; `POST /fotos/subir` recibe una foto (una por petición, para caber en el plan gratuito) y devuelve su nombre firmado; `POST /fotos/publicar` hace el commit con toda la tanda. Solo se publican fotos firmadas por el worker, con el nombre que él eligió.
- Orígenes permitidos: `laurenreposteria.com` y `localhost:5173` (`ALLOWED_ORIGINS` en `worker/fotos/wrangler.toml`). `ADMIN_EMAILS` puede limitar la subida a ciertos correos.
- Como el panel escribe en `main`, **antes de cambiar el código en el computador hay que traer esos cambios**: `git pull`.

Activación (una sola vez):

1. **Cuenta de Cloudflare** gratuita en <https://dash.cloudflare.com/sign-up>. Al entrar a *Workers & Pages* se elige el subdominio `*.workers.dev`.
2. **Llave de GitHub** en *Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token*: solo el repositorio `Lauren-Reposteria`, permiso *Contents: Read and write*, la duración más larga disponible. Se copia una sola vez.
3. En una terminal, dentro de `worker/fotos`:
   ```bash
   npx wrangler login
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler deploy
   ```
   El segundo comando pide pegar la llave; el tercero muestra la dirección del worker.
4. Esa dirección va en `PHOTOS_API` (`js/admin.js`) y en `connect-src` de `admin/index.html`.

Cuando la llave venza, se crea otra (paso 2) y se repite `npx wrangler secret put GITHUB_TOKEN`.

## Mantenimiento

```bash
firebase deploy --only firestore:rules --project lauren-reposteria
cd worker/fotos && npx wrangler deploy
node --test tests/*.test.mjs
```
