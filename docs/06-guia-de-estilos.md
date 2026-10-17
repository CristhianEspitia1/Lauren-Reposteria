# Manual de marca

Versión 2.0 · octubre de 2026. Es la referencia obligatoria para cualquier página, sección, componente, texto o pieza nueva del sitio. Todo lo que describe está en uso en la web. Versión visual para compartir: <https://claude.ai/artifact/QDVjXxqDnKd51uysq5t5Qk>.

Si algo nuevo no está cubierto aquí, primero se define en este manual (y en la versión visual) y después se construye.

## 1. Esencia

Lauren Repostería hace tortas, alfajores, brownies, galletas y detalles en Medellín. La web es un catálogo: la persona elige, personaliza, arma su pedido y lo confirma por WhatsApp, donde se acuerdan fecha, entrega y pago.

- **Lema:** Bocado de alegría. Va en el logo, el sello y el titular de portada: «Un bocado de alegría, hecho a mano.».
- **Promesa:** tortas, alfajores y pequeños detalles hechos a mano para celebrar lo que más quieres.
- **Valores visibles:** Hecho a mano · Preparado para ti · Detalles que cuentan · Desde Medellín, con amor.

## 2. Voz y tono

Lauren suena **cercana, amigable, cariñosa y atenta**, como quien te atiende en persona. Español de Colombia, trato de tú, plural para el negocio («elegimos», «confirmamos»). Frases cortas que invitan; sin presión, sin exageraciones y sin solemnidad ni lenguaje espiritual.

| Así sí | Así no |
| --- | --- |
| Tú pones el motivo. Nosotros, el toque dulce. | ¡¡¡Las mejores tortas de Colombia!!! |
| Una forma dulce de decir te quiero. | Una experiencia gourmet que trasciende el paladar. |
| Todo claro. Todo más dulce. | Compra ya, quedan pocas unidades. |
| Hagamos de ese momento un dulce recuerdo. | Estimado cliente, su solicitud ha sido procesada. |

Reglas:

- Titulares en dos tiempos; la parte emotiva va en `<em>` (itálica resaltada).
- Botones que dicen lo que pasa: «Encuentra tu antojo», «Elegir detalles», «Hablemos de tu idea». Avisos que nombran el resultado: «Agregado a tu pedido.».
- Fecha, entrega y pago siempre se confirman con Lauren.
- Sin emojis, sin anglicismos innecesarios, sin mayúsculas para gritar.
- Precios, contactos y condiciones solo cambian con confirmación del negocio.
- Sin precio definido se escribe «Cotiza por WhatsApp» en la tarjeta y «Consultar por WhatsApp» en el botón de la ficha.
- Formatos: `$65.000`, «Desde $24.000», «de 9:00 a. m. a 6:00 p. m.», «al menos 2 días», comillas angulares «».
- Las frases de los dibujos del sistema gráfico no se usan como texto de la web.

## 3. Logo

Vectores originales en `assets/brand/`; nunca se redibujan ni se generan con IA. Una sola tinta.

| Archivo | Uso |
| --- | --- |
| `lauren-logo.svg` | Logo completo en ciruela. Cabecera de todas las páginas (150 px escritorio, 134 px móvil). |
| `lauren-logo-light.svg` | Logo completo en crema. Pie de página sobre lila (168 px). |
| `lauren-sello-light.svg` | Sello circular «Bocado de alegría» sobre la foto principal de la portada, en disco lila con borde crema. |
| `../favicon.svg` | Isotipo blanco sobre lila: pestaña e ícono del celular. |
| `sistema/isotipo-circulo.svg` | Sello sobre las fotos de cabecera del catálogo y en secciones lilas. |

- Mínimo del logo completo: 132 px en pantalla o 3,5 cm impreso; por debajo, isotipo.
- Área de respeto libre de textos, adornos y bordes de foto.
- No estirar, girar, recolorear partes, añadir sombras o brillos, ni ponerlo sobre fotos (solo los sellos van sobre fotos).

## 4. Color

Tokens en `css/tokens.css`. Nunca se escriben colores sueltos en las hojas de estilo; las mezclas se hacen con `color-mix()` a partir de los tokens.

Paleta de marca:

| Token | HEX | RGB | CMYK | Pantone | Uso |
| --- | --- | --- | --- | --- | --- |
| `--color-cream` | `#F9F5EC` | 249 245 236 | 3 4 9 0 | 7604 C | Fondo de todas las páginas |
| `--color-lilac` | `#D0B4D7` | 208 180 215 | 20 34 0 0 | 7437 C | Pie, sellos, avisos, franjas |
| `--color-apricot` | `#F8B890` | 248 184 144 | 0 36 45 0 | 1555 C | Botón principal, resaltado, detalles, selección de texto |
| `--color-peach` | `#E5C8BA` | 229 200 186 | 11 25 25 1 | 7611 C | Etiqueta «Desde», fondo de fotos al cargar, hover |

Tinta y apoyo:

| Token | HEX | Uso |
| --- | --- | --- |
| `--color-text` | `#3F3047` | Texto, logo y foco. Nunca de fondo |
| `--color-text-soft` | `#766A79` | Texto secundario |
| `--color-white` | `#FFFDF9` | Tarjetas, campos y diálogos |
| `--color-lilac-light` | `#EFE6F3` | Fondos suaves |
| `--color-border` | `#DDD3DC` | Líneas y separadores |
| `--color-error` | `#9B3048` | Mensajes de campo |

- Jerarquía: crema dominante; lila de marca; albaricoque solo donde se toca o se resalta; ciruela para leer.
- Fondos de sección: crema (base), lila 45 % + crema (celebración), durazno 35 % + crema (preguntas), lila (pie).
- Contrastes aprobados: ciruela sobre crema 11,2:1, sobre albaricoque 7,1:1, sobre lila 6,5:1; tinta suave sobre crema 4,7:1. Texto blanco sobre lila o albaricoque no (1,9:1).

## 5. Tipografía

Google Fonts en todas las páginas, una petición con `display=swap`: **Playfair Display** 400 e itálica (`--font-display`) para titulares y nombres de producto; **Inter** 400 y 500 (`--font-sans`) para lectura, botones y formularios.

| Elemento | Estilo |
| --- | --- |
| Titular de portada | Playfair 400 · 52–96 px · −0,04 em |
| Titular de sección | Playfair 400 · 36–60 px · −0,04 em |
| Nombre de producto | Playfair 400 · 20 px |
| Título pequeño | Inter 500 · 17,6 px |
| Texto | Inter 400 · 15–16 px · interlineado 1,65–1,85 |
| Etiqueta (`.eyebrow`) | Inter 500 · 11 px · mayúsculas · +0,18 em · raya albaricoque de 24 × 2 px antes |
| Botón y enlace | Inter 500 · 13 px |
| Menú | Inter 400 · 12 px |

La itálica de los titulares grandes lleva debajo una franja albaricoque translúcida (portada, secciones y pie; nunca en texto corrido).

## 6. Formas y espacio

| Forma | Valor | Uso |
| --- | --- | --- |
| Esquina de cinta | `--radius-signature` 4 20 4 20 px; al pasar el cursor se invierte | Botones, video, diálogos |
| Arco | 240 240 5 5 px | Foto principal de portada |
| Cinta amplia | 4 32 4 32 px | Colección destacada |
| Casi recta | `--radius-sm` 4 px | Fotos, opciones, campos |
| Sello | círculo lila, borde crema 6 px | Sellos sobre fotos |
| Píldora | `--radius-pill` | Cantidad, etiqueta «Desde» |

- Espaciado: `--space-xs` 8 · `--space-md` 16 · `--space-lg` 24 · `--space-xl` 32 · `--space-2xl` 48 · `--space-3xl` 64 · `--space-section` 64–120 px.
- Contenido de 1200 px máximo, márgenes fluidos de 20 a 64 px (`--page-gutter`). El menú pasa a móvil por debajo de 800 px.
- Una sola sombra, para lo que flota (`--shadow-float`): botón de WhatsApp, avisos, foto inclinada de portada, flechas de la fila de fotos, y barra de publicar y menú de foto del centro de control.

## 7. Iconos

Familia **Trazo Lauren** en `js/brand-icons.js`, llamada con `LaurenIcons(nombre)` o `data-icon`. Retícula de 24, trazo 1,5, puntas redondas, `currentColor`, `aria-hidden="true"`; el control aporta el nombre accesible. Trazo 1,2 (`--icon-stroke-display`) para ilustraciones de 40–64 px. Área táctil mínima de 44 px.

En uso: `cake`, `alfajor`, `brownie`, `cookie`, `gift`, `bag`, `arrow` (avanzar; en espejo, la flecha de atrás de la fila de fotos), `diagonal` (otra página o salir), `close`, `plus`, `minus`, `menu`, `check`, `search`, `zoom`, `trash`, `chat`, `play`, `pause`, `sound`, `muted`, `expand`, `more` (tres puntos: abre las opciones de algo, como el menú de una foto en el centro de control) y los complementos `bow`/`ribbon`, `butterfly`, `birthday-topper`, `pearls`, `crown`. Un icono nuevo se dibuja con las mismas reglas y se añade al registro. Ni emojis, ni fuentes de iconos, ni dibujos de otro estilo.

## 8. Sistema gráfico

Dibujos de línea de `assets/brand/sistema/`, usados como `mask` CSS y coloreados con la paleta: lila sobre fondos claros, blanco sobre lila, albaricoque para el corazón.

| Gráfico | Lugar |
| --- | --- |
| `corazon` | Separador de la franja de valores; final de titulares de portada, historia, pie, colecciones y sabores |
| `porcion-torta` | «Tú pones el motivo…», inspiración de Tortas, titular de redes |
| `brownie` | «Pequeños grandes favoritos», inspiración de Brownies y galletas, titular de redes |
| `mano-flor` | Junto a «Una torta tan única como tu celebración» |
| `isotipo-circulo` | Celebración, catálogos, fotos de cabecera, botón del pie |
| `mucho-encanto` | «Pedir es así de sencillo» y sabores |
| `sanadora-de-alma` | Bajo el video de la historia, inspiración de Alfajores |
| `para-ti` | Inspiración de Detalles |
| `reposteria` | Firma de «Las cosas bonitas se hacen con amor» |
| `grateful` | Sobre «Un poquito más de Lauren» |
| `rama` | Preguntas frecuentes y foto de cabecera de colección |
| `sello-ovalado` | Preguntas frecuentes, solo escritorio |
| `dosis-de-encanto` | Firma de la franja inferior del pie, solo escritorio |
| `grito-de-victoria` | Banner de invitación de cada colección |

Los gráficos fijos viven en CSS; el resto los coloca `js/brand-decor.js` por sección (variantes con `data-page` en `<body>`). Reglas:

- Completos, dentro del ancho del contenido y sin tocar textos, fotos ni controles; si no caben, prueban su alternativa y si tampoco, no se muestran.
- Nunca dos en la misma esquina; ningún adorno junto a un botón o enlace; ninguno sobre fotos salvo los sellos.
- En móvil solo quedan los marcados con `m: 1`, más pequeños.

## 9. Componentes

Antes de crear un componente nuevo se reutiliza uno existente.

| Componente | Clase | Regla |
| --- | --- | --- |
| Botón principal | `.btn` | Albaricoque, flecha, esquina de cinta; hover lila con esquinas invertidas. Uno por bloque |
| Botón secundario | `.btn-secondary` | Borde lila, fondo transparente; hover durazno |
| Botón claro | `.btn-light` | Crema sobre lila; hover albaricoque |
| Enlace de texto | `.text-link` | Subrayado ciruela; flecha `arrow` para avanzar, `diagonal` para otra página |
| Tarjeta de producto | `.product-card` | Foto 4:5, nombre Playfair 20 px, precio, «Elegir detalles»; «Desde» en píldora durazno si el precio varía; «Cotiza por WhatsApp» si aún no tiene precio |
| Qué incluye | `.product-includes` | Siempre visible, sin desplegar |
| Opciones | `.choice` | Borde 4 px; elegida en lila 45 % con borde ciruela |
| Casillas | `.toggle-option` | Check y esquina de cinta 3/9 px; marcada en lila |
| Cantidad | `.quantity-control` | Píldora con botones de 44 px |
| Contador del pedido | `.cart-count` | Círculo de 22 px junto a la bolsa |
| Aviso | `.toast` | Lila, radio 12 px, sombra flotante, acción subrayada. Va en la capa superior: se ve también encima de un diálogo abierto |
| WhatsApp flotante | `.contact-fab` | Círculo albaricoque de 52 px, abajo a la derecha |
| Fila de fotos | `.photo-strip` | Miniaturas 4:5 en una sola línea que se desplaza a lo ancho, nunca en varias filas. Las flechas `arrow` flotan sobre los extremos de la fila, encima de las miniaturas, sin quitarles espacio: círculo de 28 px (área táctil de 44 px), blanco cálido al 90 % con borde y sombra flotante, centrado en la altura de las fotos; en hover, durazno; se ocultan al llegar al extremo. En la ficha de la web solo aparecen si las miniaturas no caben; entonces la fila deja bajo cada flecha su espacio (44 px) para que nunca tape una miniatura: la primera y la última se ven completas pegadas a su borde, y cerca de un extremo la fila se queda en él. La elegida lleva borde ciruela y se centra en la fila cuando se puede (la primera empieza a la izquierda). En la ficha va debajo de la foto principal; en el centro de control, junto a la principal |
| Pregunta frecuente | `.faq-item` | Único elemento desplegable; «+» que gira 45° |
| Fila de producto (centro de control) | `.admin-row` | Foto 4:5 de 56 px, nombre Playfair 20 px (abre la ficha, como «Editar») y precio en tinta suave; «Visible» con la casilla de la ficha y «Editar» como enlace de texto. Etiquetas en píldora: durazno «Oculto», lila «Nuevo» y «Con cambios». Las filas se agrupan bajo una etiqueta (`.eyebrow`) con el grupo y su cuenta: Tortas (todas juntas), Adicionales de torta y cada sección |
| Ficha de producto (centro de control) | `.admin-editor` | Diálogo de editar y crear, en dos columnas en escritorio: a la izquierda, el formulario (Lo básico, Precios, Fotos, Textos, Lo que elige el cliente, Cantidad); a la derecha, fija al desplazarse, «Así se verá en la web» con la tarjeta real (`.product-card`, o `.extra` para los adicionales) que cambia mientras se escribe, y debajo «En la web» (Visible y Portada) y «Dónde aparece». Por debajo de 960 px, una columna: arriba la tarjeta en pequeño (foto de 72 px, nombre y precio) y el estado; «Dónde aparece» al final |
| Menú de foto (centro de control) | `.admin-photo-menu` | Bajo cada foto de la ficha, a la derecha, el icono `more` en un botón de 44 px (`.icon-button`) abre un menú flotante: blanco cálido, borde, `--radius-md` y sombra flotante, junto a los tres puntos. Opciones de 44 px en Inter 500 13 px con icono de 18 px: «Hacer principal» (`check`) y «Quitar» (`trash`); en la principal, «Es la principal» apagada en tinta suave. Hover durazno. Se cierra al tocar fuera, con Esc o al desplazar. En «Agregar fotos de la web», las fotos subidas que ningún producto usa llevan los mismos tres puntos con «Borrar para siempre» (`trash`), que pide la confirmación; mientras una foto está elegida, sus tres puntos se esconden |
| Confirmación y aviso (centro de control) | `.admin-confirm` | Diálogo pequeño (480 px) del mismo estilo que los demás, en lugar de los avisos del navegador: salir con cambios sin publicar o sin guardar, descartar, quitar un grupo, eliminar un producto, unir o mover fotos y borrar una foto subida. Sin «Cancelar» es un aviso de un solo botón («Entendido»), como lo que falta antes de publicar. El foco empieza en la opción segura. Lleva titular Playfair con la parte clave en `<em>`, texto en tinta suave que dice qué pasa y cuándo se ve en la web, si hace falta una lista de lo afectado (filas crema con borde: foto de 40 px, nombre Playfair y cuenta en tinta suave) o de lo que hay que revisar (viñetas en tinta), y abajo a la derecha la opción segura en secundario («Cancelar», «Volver», «Seguir editando», «Conservarlo»…) y la acción en principal, con `check`, que dice lo que pasa («Eliminar», «Unir y seguir»). Esc o fuera cancelan. Se muestra una sola vez por tanda, al confirmar, nunca en cada toque |
| Barra de publicar (centro de control) | `.admin-savebar` | Blanco cálido, borde, radio 12 px y sombra flotante, abajo al centro; cuenta los cambios y lleva «Descartar» (secundario) y «Publicar cambios» (principal) |

El centro de control (`/admin/`) usa los mismos tokens, letras y componentes: campos y opciones de la ficha, casillas, botones, enlaces y avisos. Sus textos siguen la voz de la marca. Nada se ve genérico: no hay desplegables, menús ni avisos del sistema; las listas cortas (torta base, sección, filtro) se eligen con las opciones `.choice`, las acciones de una foto van en el menú de foto y toda pregunta o aviso usa la confirmación de la marca (`.admin-confirm`). Solo queda el aviso del navegador al cerrar la pestaña con cambios sin publicar, que la web no puede cambiar.

Estructura de toda página pública: cabecera fija con logo, menú y pedido; contenido; pie lila; botón flotante de WhatsApp y diálogos de producto, pedido y galería.

## 10. Fotografía

- Mesa de lino marfil, pared crema lisa, luz suave de ventana. Producto, decoración y empaque protagonistas.
- Proporciones: 4:5 en tarjetas, galerías y fichas; 3:2 en sabores; 1:1 en rellenos; video 16:9 con `object-fit: contain`.
- Al ampliar se ve la foto completa con miniaturas debajo. Mientras carga, el espacio se ve durazno.
- Ficha de producto: la foto principal grande y, debajo, la fila de fotos (`.photo-strip`) con las demás fotos de la misma referencia. Se cambia de foto con las flechas, tocando una miniatura o deslizando el dedo sobre la foto. Las flechas van en la fila, sobre las miniaturas, nunca encima de la foto grande.
- Cada foto vive en un solo producto: una referencia con varias fotos es un producto con su fila de fotos, no varios productos parecidos.
- Fotos subidas desde el centro de control: se guardan en WebP de 1440 px como máximo. Mejor verticales, en 4:5, como las de la web.
- Solo fotos reales de Lauren: ni de banco, ni generadas con IA, ni con filtros que cambien el color. Nada encima de la foto salvo los sellos y, sobre las miniaturas de la fila de fotos, sus flechas.
- Inventario: `assets/propuestas-fotograficas/manifest.json`.

## 11. Movimiento y acceso

| Interacción | Comportamiento |
| --- | --- |
| Botón principal | Esquinas intercambiadas y lila, 600 ms con `--ease-ribbon` |
| Flecha | Avanza unos píxeles, 560 ms |
| Menú | Subrayado albaricoque que crece, 420 ms |
| Diálogos | Aparecen subiendo 10 px, 260 ms |
| Fotos de producto | Se acercan levemente al pasar el cursor, 600 ms |

- Todo el contenido visible desde el inicio: sin apariciones en cascada, máscaras ni desvanecimientos al bajar.
- Sin reproducción automática ni scroll forzado. `prefers-reduced-motion` apaga las animaciones.
- Foco visible: contorno ciruela de 2 px. Áreas táctiles de 44 px. Ajustes responsive junto a cada componente.

## 12. Antes de publicar

1. Colores solo de `css/tokens.css`.
2. Titulares en Playfair Display e interfaz en Inter, con la escala de este manual.
3. Componentes existentes reutilizados.
4. Iconos de `LaurenIcons`, trazo 1,5.
5. Logo y dibujos de `assets/brand/`, sin redibujar.
6. Textos cercanos, amigables, cariñosos y atentos.
7. Precios, contactos y condiciones confirmados por Lauren.
8. Fotos reales en sus proporciones.
9. Foco visible, 44 px y movimiento reducido.
10. Revisado en móvil y en escritorio.
