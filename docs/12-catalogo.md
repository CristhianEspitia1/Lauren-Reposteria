# Catálogo de productos

`js/catalog-data.js` guarda solo datos (JSON dentro de `window.catalogData`), sin lógica. Es el mismo formato que publica el [centro de control](13-centro-de-control.md) en Firestore: cada producto es un objeto con los campos de esta tabla, y la web lo muestra sin tocar HTML ni JS. Las reglas (precio, validación, etiquetas) viven en `js/catalog-model.js`.

## Campos de un producto

| Campo | Obligatorio | Uso |
| --- | --- | --- |
| `id` | Sí | Identificador estable en kebab-case. No cambiarlo: lo usan los pedidos guardados |
| `name` | Sí | Nombre en la tarjeta y la ficha |
| `category` | Sí | `tortas`, `alfajores`, `brownies`, `galletas`, `detalles` o `extras`. Decide en qué página aparece |
| `group` | No | Filtro dentro de la página: `cajas`, `especiales` (Alfajores); `osos`, `mix`, `golden` (Detalles) |
| `visible` | Sí | `false` oculta el producto: no se muestra, no se pide y no entra al SEO |
| `featured` | No | Solo tortas: `true` la muestra en «Una torta tan única como tu celebración» de la portada (cuatro como máximo; si faltan, se completan con las siguientes tortas). En otras secciones no tiene efecto |
| `summary` | No | Frase corta de la tarjeta; sin ella se usa `description`. En las tarjetas de torta (compactas) solo se muestra si existe, nunca la descripción |
| `description` | Sí | Texto de la ficha |
| `includes` | No | Lista «Qué incluye» |
| `notes` | No | Aclaraciones bajo las opciones de la ficha |
| `price` | No | Precio cuando ninguna opción lo fija. `null` = «Cotiza por WhatsApp» |
| `priceMax` | No | Solo extras, formato anterior: tope del rango («$2.000 - $3.000») |
| `priceText` | No | Solo extras (vitrina «Adicionales para tu torta»): el precio en texto libre, como lo escribe el negocio («De $2.000 a $5.000 según el tamaño»). Si existe, es lo que se ve |
| `priceSuffix` | No | Complemento del precio de la tarjeta: `c/u`, `la caja` |
| `minimum` | No | Cantidad mínima por pedido (por defecto 1) |
| `quantityLabel` | No | Rótulo de la cantidad (por defecto «Cantidad de esta presentación») |
| `icon` | No | Solo extras: icono de `LaurenIcons` |
| `mainImage`, `images` | Sí, salvo extras | Foto principal y galería de la ficha, rutas de `assets/`. Los extras no llevan fotos: se muestran con su `icon` |
| `options` | No | Opciones que elige el cliente (ver abajo) |
| `personalization` | No | Campos de texto (mensaje, iniciales, tema); `null` si no lleva. `enabled: false` lo apaga sin perder su configuración. En las tortas no se usa: el mensaje se acuerda en la asesoría (`Catalog.fields` no devuelve campos para ellas) |
| `basedOn` | No | Formato anterior: torta de la que tomaba lo que no definía. El centro de control lo copia en cada torta al abrirse (cada grupo es independiente); la web aún lo lee mientras no se publique |

## Opciones y precios

Cada opción tiene `id`, `label`, `type` (`radio`, `select` o `toggle`), `required` y `choices` (`value`, `label`). Además:

- **Precio por elección:** si alguna elección lleva `price`, esa opción fija el valor del producto (porciones, presentación, tamaño). `price: null` en una elección = esa elección se cotiza por WhatsApp; la ficha cambia el total por el botón «Consultar por WhatsApp».
- **Orden:** se recorren las opciones visibles en orden; la última elección con precio manda. Así, en brownies la presentación «Individual» se completa con las «Unidades en la bolsa».
- `perUnit: true` añade «c/u» al precio de la elección.
- `multiplier: true` multiplica el precio por el número elegido (galletas individuales × cantidad).
- `dependsOn` + `showWhen`: la opción solo aparece con esa elección de otra opción.
- `toggle` con `priceModifier`: suma ese valor al marcarse.
- `multiple` + `maxSelection`: elección de varios valores (colores).
- **Costo adicional por elección:** `extra` suma ese valor al total. Puede ser un número (igual en todos los tamaños) o un valor por tamaño: `extra: { "4-5": 5000, "25-30": 20000 }`, con las claves de las elecciones del **tamaño** (la primera opción con precio por elección, sin `dependsOn` ni `multiplier`: porciones, presentación; `Catalog.sizeOption`). Vacío o sin valor para ese tamaño: no suma.
- **Adicionales:** una opción con `addons: true` y `multiple: true` (en la ficha, «Adicionales», opcional). Cada elección suma su `extra` del tamaño elegido; una sin valor para ese tamaño se puede marcar, pero la selección se cotiza por WhatsApp. Cada producto tiene los suyos.
- `image` en una elección de `sabor` o `relleno` (tortas): su foto subida desde el centro de control, para «Un sabor para recordar».

### «Un sabor para recordar» (/tortas/)

Sale de los bizcochos y rellenos de la primera torta visible del catálogo: `js/flavors.js` la pinta en el navegador y `scripts/seo.mjs` la escribe en el HTML publicado. Cada uno usa su foto subida (`image`, también si se subió en otra torta con el mismo nombre) o la de la web que le corresponde (por valor o por nombre; lista en `PHOTOS`); los que no tienen foto van en «También: …».

## Precios dentro de los textos

Los importes de las páginas (preguntas frecuentes, introducciones) no se escriben a mano. Se marcan con `<span data-price="…">` y se llenan desde el catálogo, tanto en el navegador (`site.js`) como en el HTML publicado (`scripts/seo.mjs`):

| Referencia | Importe |
| --- | --- |
| `caja-x6` | Precio mínimo del producto |
| `torta-vintage?porciones=25-30` | Precio de esa elección |
| `@tortas` o `@brownies,galletas` | Pedido mínimo de esas categorías (precio × cantidad mínima) |

Si el producto se oculta o queda sin precio, el texto dice «precio a consultar». La prueba `tests/seo.test.mjs` impide precios escritos a mano en las páginas.

## Después de cambiar el catálogo

Lo publicado desde el centro de control llega solo al repositorio en menos de una hora (workflow «Catálogo publicado», ver [centro de control](13-centro-de-control.md#cómo-funciona)). Para traerlo ya, también regenera el SEO:

```bash
node scripts/pull-catalog.mjs
node --test tests/*.test.mjs
```

Si se editó `js/catalog-data.js` a mano, basta con `node scripts/seo.mjs` y las pruebas.
