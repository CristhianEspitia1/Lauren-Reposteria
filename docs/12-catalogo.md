# Catálogo de productos

`js/catalog-data.js` guarda solo datos (JSON dentro de `window.catalogData`), sin lógica. Es el mismo formato que publica el [centro de control](13-centro-de-control.md) en Firestore: cada producto es un objeto con los campos de esta tabla, y la web lo muestra sin tocar HTML ni JS. Las reglas (precio, validación, etiquetas) viven en `js/catalog-model.js`.

## Campos de un producto

| Campo | Obligatorio | Uso |
| --- | --- | --- |
| `id` | Sí | Identificador estable en kebab-case. No cambiarlo: lo usan los pedidos guardados |
| `name` | Sí | Nombre en la tarjeta y la ficha |
| `category` | Sí | `tortas`, `alfajores`, `brownies`, `galletas`, `detalles` o `extras`. Decide en qué página aparece |
| `group` | En Tortas, Alfajores y Detalles | Subgrupo (filtro) dentro de su página: `cumpleanos`, `corazon`, `flores`, `infantiles`, `tematicas`, `grados` (Tortas); `cajas`, `especiales` (Alfajores); `osos`, `mix`, `golden` (Detalles). Cada producto visible de esas páginas va en uno; se elige en el centro de control y la lista vive en `AdminModel.GROUPS` y en los botones de cada página |
| `visible` | Sí | `false` oculta el producto: no se muestra, no se pide y no entra al SEO |
| `featured` | No | Solo tortas: `true` la muestra en «Una torta tan única como tu celebración» de la portada (cuatro como máximo; si faltan, se completan con las siguientes tortas). En otras secciones no tiene efecto |
| `summary` | No | Frase corta de la tarjeta; sin ella se usa `description` |
| `description` | Sí | Texto de la ficha |
| `includes` | No | Lista «Qué incluye» |
| `notes` | No | Aclaraciones bajo las opciones de la ficha |
| `price` | No | Precio cuando ninguna opción lo fija. `null` = «Cotiza por WhatsApp» |
| `priceMax` | No | Solo extras: tope del rango («$2.000 - $3.000») |
| `priceSuffix` | No | Complemento del precio de la tarjeta: `c/u`, `la caja` |
| `minimum` | No | Cantidad mínima por pedido (por defecto 1) |
| `quantityLabel` | No | Rótulo de la cantidad (por defecto «Cantidad de esta presentación») |
| `icon` | No | Solo extras: icono de `LaurenIcons` |
| `mainImage`, `images` | Sí, salvo extras | Foto principal y galería de la ficha, rutas de `assets/`. Los extras no llevan fotos: se muestran con su `icon` |
| `options` | No | Opciones que elige el cliente (ver abajo) |
| `personalization` | No | Campos de texto (mensaje, iniciales, tema); `null` si no lleva |
| `basedOn` | No | Torta (`torta-vintage`, `torta-sencilla`) de la que toma lo que no define: opciones, precios, notas, textos, mínimo. No se repite en el JSON-LD |

## Opciones y precios

Cada opción tiene `id`, `label`, `type` (`radio`, `select` o `toggle`), `required` y `choices` (`value`, `label`). Además:

- **Precio por elección:** si alguna elección lleva `price`, esa opción fija el valor del producto (porciones, presentación, tamaño). `price: null` en una elección = esa elección se cotiza por WhatsApp; la ficha cambia el total por el botón «Consultar por WhatsApp».
- **Orden:** se recorren las opciones visibles en orden; la última elección con precio manda. Así, en brownies la presentación «Individual» se completa con las «Unidades en la bolsa».
- `perUnit: true` añade «c/u» al precio de la elección.
- `multiplier: true` multiplica el precio por el número elegido (galletas individuales × cantidad).
- `dependsOn` + `showWhen`: la opción solo aparece con esa elección de otra opción.
- `toggle` con `priceModifier`: suma ese valor al marcarse.
- `multiple` + `maxSelection`: elección de varios valores (colores), sin precio.

La tarjeta calcula sola su precio: «$22.000» si es único, «Desde $65.000» si varía, el rango en los extras y «Cotiza por WhatsApp» si no hay ninguno.

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
