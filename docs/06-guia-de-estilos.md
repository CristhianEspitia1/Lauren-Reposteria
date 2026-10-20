# Manual de marca

Versión 3.7 · octubre de 2026. Es la referencia obligatoria para cualquier página, sección, componente, texto o pieza nueva del sitio. Todo lo que describe está en uso en la web. Versión visual para compartir: <https://claude.ai/artifact/QDVjXxqDnKd51uysq5t5Qk>.

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
- Formatos: `$65.000`, «Desde $24.000», «de 9:00 a. m. a 6:00 p. m.», «al menos 2 días», comillas angulares «». En HTML, «a.&nbsp;m.», «p.&nbsp;m.» y «desde&nbsp;2022» llevan espacio duro para que no se partan entre dos líneas en el teléfono.
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

En uso: `cake`, `alfajor`, `brownie`, `cookie`, `gift`, `bag`, `arrow` (avanzar; en espejo, la flecha de atrás de la fila de fotos), `diagonal` (otra página o salir), `close`, `plus`, `minus`, `menu`, `check`, `search`, `zoom`, `trash`, `chat`, `heart` (paso «Escoge porciones y sabor»), `play`, `pause`, `sound`, `muted`, `expand`, `more` (tres puntos: abre las opciones de algo, como el menú de una foto en el centro de control) y los complementos `bow`/`ribbon`, `butterfly`, `birthday-topper`, `pearls`, `crown`. Un icono nuevo se dibuja con las mismas reglas y se añade al registro. Ni emojis, ni fuentes de iconos, ni dibujos de otro estilo.

## 8. Sistema gráfico

Dibujos de línea de `assets/brand/sistema/`, usados como `mask` CSS y coloreados con la paleta: lila sobre fondos claros, blanco sobre lila, albaricoque para el corazón.

| Gráfico | Lugar |
| --- | --- |
| `corazon` | Separador de la franja de valores; final de titulares de portada, historia, pie, colecciones y sabores; y repartidos por el pie, en blanco y albaricoque |
| `porcion-torta` | «Tú pones el motivo…», catálogo de Tortas, titular de redes, pie |
| `brownie` | Titular de redes y pie |
| `mano-flor` | Lila, 96 px, centrada bajo la tarjeta de Tortas de «Tú pones el motivo…» (y del mismo bloque en la 404), a 48 px de su texto, en el hueco antes de «Pedir tu torta…». En escritorio esa sección reserva el hueco abajo (`.collections-section`: tres `--space-3xl`, 192 px) y «Pedir tu torta…» empieza a 32 px (`--space-xl`), para que ambas secciones se vean juntas. Solo escritorio: en el teléfono la tarjeta ocupa todo el ancho y no queda hueco. En el pie, en blanco |
| `isotipo-circulo` | Adicionales de Tortas («Adicionales para *tu torta.*»: entre el título y la frase; en móvil, al final de la frase), catálogos, fotos de cabecera, botón del pie |
| `mucho-encanto` | «Pedir tu torta es así de sencillo», sabores de Tortas y pie |
| `para-ti` | Banner de invitación de cada colección y pie |
| `reposteria` | Firma de «Las cosas bonitas se hacen con amor» y pie |
| `grateful` | Sobre «Un poquito más de Lauren» y pie |
| `rama` | Preguntas frecuentes, foto de cabecera de colección y pie |
| `sello-ovalado` | Preguntas frecuentes (solo escritorio) y pie |
| `dosis-de-encanto` | Firma de la franja inferior del pie (solo escritorio) y bajo el video de la historia |

Los gráficos fijos viven en CSS; el resto los coloca `js/brand-decor.js` por sección. Reglas:

- Completos, dentro del ancho del contenido (salvo en el pie) y sin tocar textos, fotos ni controles; si no caben, prueban su alternativa y si tampoco, no se muestran.
- Nunca dos en la misma esquina; ningún adorno junto a un botón o enlace (las tarjetas de colección, que son un enlace entero, cuentan como ocupadas); ninguno sobre fotos salvo los sellos.
- En móvil solo quedan los marcados con `m: 1`, más pequeños.
- El pie es la sección decorada (diseño «Confeti suave»): todos los dibujos de línea en blanco y en pequeño (isotipo, «Mucho encanto», porción de torta, brownie, tres ramas, dos manos con flor, sello ovalado, «Para ti», «Repostería» y «Grateful», más la firma «Dosis de encanto») y unos veinte corazones blancos y albaricoque de 9 a 14 px, dispersos por todo el pie sin seguir líneas ni patrones, con giros leves. Cada uno tiene su punto en el pie (puede salir del ancho del contenido hacia los márgenes) y, si ahí toca un texto, un enlace, un botón o una línea, se corre al hueco libre más cercano; si no hay, no se muestra. En el teléfono quedan los marcados con `m: 1`, más pequeños.
- «Sanadora de alma» y «Grito de victoria» ya no se usan.

## 9. Componentes

Antes de crear un componente nuevo se reutiliza uno existente.

| Componente | Clase | Regla |
| --- | --- | --- |
| Botón principal | `.btn` | Albaricoque, flecha, esquina de cinta; hover lila con esquinas invertidas. Uno por bloque |
| Botón secundario | `.btn-secondary` | Borde lila, fondo transparente; hover durazno |
| Botón claro | `.btn-light` | Crema sobre lila; hover albaricoque |
| Enlace de texto | `.text-link` | Subrayado ciruela; flecha `arrow` para avanzar, `diagonal` para otra página. Al pasar el cursor la flecha avanza 8 px dentro de un margen ya reservado: el enlace no empuja lo que tiene al lado. Si su texto cambia (como «Pausar videos» y «Ver videos»), las dos etiquetas ocupan el mismo sitio |
| Tortas de la portada | `.featured-cakes` | Fondo lila 45 % + crema, sección compacta (64 px arriba y abajo; 48 en móvil). Fila de título con «Una torta tan única *como tu celebración.*», sin frase, y a la derecha el botón principal «Encuentra tu estilo», alineado con la última línea del titular (en móvil, debajo del titular). Debajo, cuatro tarjetas de torta (`.product-grid.four-columns`, compactas: con frase corta solo si la torta la tiene). Las tortas se eligen en el centro de control con «Portada»; si hay menos de cuatro marcadas, se completan con las siguientes del catálogo |
| Pasos para pedir | `.steps` | «Pedir tu torta es así de *sencillo.*», en la portada después de «Tú pones el motivo…»: cuatro pasos de torta (Elige tu torta, Escoge porciones y sabor, Dale tu toque, La confirmamos contigo), cada uno con número en itálica, icono de 40 px a trazo 1,2, título Playfair y texto en tinta suave. Cuatro columnas en escritorio, dos hasta 800 px y una en móvil |
| Foto que cambia | `[data-photo-cycle]` | Solo la foto de Tortas en «Tú pones el motivo…»: recorre en orden aleatorio las fotos de las tortas visibles del catálogo (también las que se suben desde el centro de control), una cada 4 s con un fundido de 800 ms. La siguiente se carga antes de mostrarse. Con movimiento reducido o «ahorro de datos» en el teléfono, queda fija |
| Lo último de Instagram | `.social-grid[data-instagram]` | «Un poquito más de *Lauren.*», al final de la portada: cuatro casillas 4:5 alineadas (dos por fila en el teléfono), separadas 14 px (12 en móvil), con esquina casi recta (`--radius-sm`) y fondo durazno mientras cargan. Muestran las últimas publicaciones de @laurenreposteria22, que el worker de fotos trae de Instagram; cada casilla abre su publicación. Si es video, se reproduce solo, sin sonido, y al terminar esa casilla pasa a otro video que no esté en otra casilla (si no queda otro, repite el suyo). Las fotos y portadas se quedan fijas. Debajo, al centro, «Pausar videos» (`pause`) o «Ver videos» (`play`) como enlace de texto, solo si hay videos. Mientras Instagram no responda, quedan cuatro fotos de la web |
| Tarjeta de producto | `.product-card` | Foto 4:5, nombre Playfair 20 px, precio, frase corta en tinta suave, «Elegir detalles». Las tarjetas de torta son compactas (cuatro columnas): llevan la frase corta solo si la torta la tiene, nunca la descripción larga, y «Elegir detalles» queda a la misma altura en toda la fila; «Desde» en píldora durazno si el precio varía; «Cotiza por WhatsApp» si aún no tiene precio. Si el producto tiene más fotos, abajo a la izquierda de la foto asoman hasta tres (miniaturas asomadas, `.product-more`: 34 × 42 px, borde crema de 2 px, esquina casi recta, sombra flotante, encimadas 8 px) y una píldora blanca cálida con los que quedan («+12 diseños», Inter 500 11 px). En tarjetas de menos de 270 px asoman dos y la píldora dice solo «+13». Así se entiende que dentro hay más diseños; el botón lo dice también al lector de pantalla («Ver Torta Vintage, 16 diseños») En la cuadrícula (`.product-grid`) ninguna tarjeta se queda sola en la última fila: las filas incompletas se centran bajo las de arriba y, si sobraría una, la fila anterior le cede otra. Con cuatro columnas: 5 = 3 + 2, 6 = 4 + 2, 7 = 4 + 3, 8 = 4 + 4, 9 = 4 + 3 + 2; con tres: 4 = 2 + 2, 5 = 3 + 2, 7 = 3 + 2 + 2. Las tarjetas siempre miden lo mismo. En el teléfono, a dos columnas, una última tarjeta impar va centrada |
| Filtros de colección | `.catalog-toolbar` | Entre el titular y las tarjetas de Alfajores y Detalles. A la izquierda, los grupos de la página como botones `.filter` (Inter 12 px, borde, esquina de cinta 2/12 px; el elegido en lila, hover lila al 30 %), empezando por «Todos»; a la derecha, el buscador (icono `search`, línea inferior, 240 px). Debajo, la cuenta en tinta suave («12 creaciones para elegir») y, sin resultados, «Aún no encontramos ese antojo.» con «Ver toda la colección». Cada producto va en un grupo, que se elige en el centro de control («Filtro en la página»): Alfajores, Cajas y minis · Especiales; Detalles, Con ositos · Mix y mensajes · Golden y tortas. En el teléfono, los botones bajan a varias líneas y el buscador va debajo, a todo el ancho. Tortas no lleva filtros: cada torta reúne en su ficha las fotos de su estilo y precio (fila de fotos), y esos grupos se arman en el centro de control uniendo fotos |
| Sabores de Tortas | `.flavor-section` | «Un sabor para *recordar.*» en Tortas, sobre lila 45 % + crema. La frase cuenta los que hay («Cuatro bizcochos, siete rellenos y tu combinación favorita.») y, si alguno sube el precio, lo dice: «Algunos tienen un valor adicional según el tamaño de la torta: lo ves al elegirla.». «El bizcocho»: tarjetas con foto 3:2, nombre Playfair y una frase en tinta suave; «El relleno»: fotos 1:1 con su nombre. Salen de la primera torta del catálogo, en su orden; cada uno con su foto subida desde el centro de control o la de la web que le corresponde. Los que aún no tienen foto van debajo en una línea, Inter 14 px en tinta suave: «**También:** Crema de vainilla · Ganache de café» (`.flavor-more`). Filas parejas (ver «Adicionales para tu torta») |
| Imagen para compartir | `scripts/social-card.html` | La vista previa al compartir un enlace (WhatsApp, redes): JPEG 1200 × 630 por página (`assets/social/`), hecha con los tokens y la composición de la portada. Fondo crema, sin marcos ni colores sueltos. A la izquierda, el logo en ciruela (200 px), la etiqueta de la página en Inter 500 18 px con la raya albaricoque de 36 × 3 px, el titular en dos tiempos en Playfair 400 76 px (−0,04 em) con la itálica sobre la franja albaricoque, y «laurenreposteria.com · Pedidos por WhatsApp» en tinta suave. A la derecha, la foto de la página en arco (240 240 5 5) y el sello lila «Bocado de alegría» con borde crema, arriba a la derecha. El título que muestra el chat empieza por la marca: «Lauren Repostería · Tortas personalizadas en Medellín» (en la portada, «Lauren Repostería · Un bocado de alegría, hecho a mano») |
| Adicionales para tu torta | `.extras-grid` | Vitrina en Tortas: «Adicionales para *tu torta.*» y la frase «Son detalles que le ponemos a tu torta y tienen un valor adicional, que se suma al total. Márcalos en «Adicionales» cuando elijas tu torta.». Cada adicional con su icono (56 px, trazo 1,2), nombre Playfair y el precio que escribe el negocio en texto libre (Inter 13 px, tinta suave; respeta los saltos de línea y se parte dentro de su columna), y «Consultar» abajo, alineado en toda la fila. **Filas parejas** (también en bizcochos y rellenos): hasta 5 por fila (3 hasta 800 px, 2 en el teléfono), todas del mismo ancho; al agregar o quitar, las filas se reparten parejas (6 = 3 + 3, 7 = 4 + 3) y la última va centrada |
| Mensaje de la torta | `.personal-fields` | Lo que va escrito en una torta (mensaje, frase, número o letras) no se escribe en la web, en las tortas ni en «Detalle torta»: en su lugar, en tinta suave, «La frase, el número o las letras de tu torta los acordamos contigo en la asesoría por WhatsApp.». Los demás textos propios (tema de los alfajores personalizados, iniciales y letras de Detalles) conservan sus campos |
| Qué incluye | `.product-includes` | Siempre visible, sin desplegar |
| Opciones | `.choice` | Borde 4 px; elegida en lila 45 % con borde ciruela y punto ciruela de 5 px antes del texto. El sitio del punto está reservado en todas: marcar o desmarcar nunca cambia el ancho ni mueve las demás opciones. Si una opción fija el precio, lo dice tras un punto medio («8 a 10 porciones · $105.000»); si suma al total, con «+» y el valor del tamaño elegido («Nutella · +$12.000»), que cambia al elegir otro tamaño. Bajo un grupo con opciones que suman: «Las opciones con «+» tienen un valor adicional que se suma al total.». «Adicionales» (opcional, varios) va después de los sabores, con «Detalles que le ponemos a tu torta. Marca los que quieras: cada uno suma su valor al total.»; uno sin precio para ese tamaño se puede marcar, pero la torta pasa a «Consultar por WhatsApp». Cada producto tiene los suyos |
| Casillas | `.toggle-option` | Check y esquina de cinta 3/9 px; marcada en lila |
| Cantidad | `.quantity-control` | Píldora con botones de 44 px |
| Contador del pedido | `.cart-count` | Círculo de 22 px junto a la bolsa |
| Aviso | `.toast` | Lila, radio 12 px, sombra flotante, acción subrayada. Va en la capa superior: se ve también encima de un diálogo abierto |
| WhatsApp flotante | `.contact-fab` | Círculo albaricoque de 52 px, abajo a la derecha |
| Fila de fotos | `.photo-strip` | Miniaturas 4:5 en una sola línea que se desplaza a lo ancho, nunca en varias filas. Las flechas `arrow` flotan sobre los extremos de la fila, encima de las miniaturas, sin quitarles espacio: círculo de 28 px (área táctil de 44 px), blanco cálido al 90 % con borde y sombra flotante, centrado en la altura de las fotos; en hover, durazno; se ocultan al llegar al extremo. En la ficha de la web solo aparecen si las miniaturas no caben; entonces la fila deja bajo cada flecha su espacio (44 px) para que nunca tape una miniatura. La elegida lleva borde ciruela y se centra en la fila; cerca de un extremo, la fila llega a su borde y se queda ahí. La fila siempre avanza hacia el lado al que se va, nunca retrocede ni salta. En la ficha va debajo de la foto principal; en el centro de control, junto a la principal |
| Pregunta frecuente | `.faq-item` | Único elemento desplegable; «+» que gira 45° |
| Fila de producto (centro de control) | `.admin-row` | Foto 4:5 de 56 px, nombre Playfair 20 px (abre la ficha, como «Editar») y precio en tinta suave; «Visible» con la casilla de la ficha; en las tortas, también «Portada» (hasta cuatro: con la portada llena, un aviso dice que hay que desmarcar una); y «Editar» como enlace de texto. Etiquetas en píldora: durazno «Oculto», lila «Nuevo» y «Con cambios». Las filas se agrupan bajo una etiqueta (`.eyebrow`) con el grupo y su cuenta: Tortas (todas juntas), Vitrina de adicionales (Tortas) y cada sección. El filtro «En portada» reúne las tortas marcadas |
| Ficha de producto (centro de control) | `.admin-editor` | Diálogo de editar y crear, en dos columnas en escritorio: a la izquierda, el formulario (Lo básico, Precios, Fotos, Textos, Lo que elige el cliente, Cantidad; en «Lo que elige el cliente», todos los grupos desplegados, cada opción en su tarjeta crema con borde: nombre, su costo con una casilla por tamaño (vacío = sin costo; en adicionales, «Cotiza») y «Mismo valor en todos», y en bizcochos y rellenos de las tortas su foto de 64 px con «Subir foto» o «Cambiar foto»; «Agregar un grupo» y «Agregar adicionales»; en las tortas, la nota de que el mensaje se acuerda en la asesoría (en la web no se escribe). Cada producto es independiente: nada se toma de otro. Los textos que trae un producto nuevo (los del primero de su sección) van escritos, no de ejemplo, para editarlos o borrarlos. En la vitrina de adicionales, «Precio en la vitrina» es texto libre); a la derecha, fija al desplazarse, «Así se verá en la web» con la tarjeta real (`.product-card`, o `.extra` para los adicionales) que cambia mientras se escribe, y debajo «En la web» (Visible y, solo en tortas, Portada) y «Dónde aparece». Por debajo de 960 px, una columna: arriba la tarjeta en pequeño (foto de 72 px, nombre y precio) y el estado; «Dónde aparece» al final |
| Menú de foto (centro de control) | `.admin-photo-menu` | Bajo cada foto de la ficha, a la derecha, el icono `more` en un botón de 44 px (`.icon-button`) abre un menú flotante: blanco cálido, borde, `--radius-md` y sombra flotante, junto a los tres puntos. Opciones de 44 px en Inter 500 13 px con icono de 18 px: «Hacer principal» (`check`) y «Sacar de esta torta» (`minus`; «Sacar de este producto» fuera de Tortas); en la principal, «Es la principal» apagada en tinta suave. Hover durazno. Se cierra al tocar fuera, con Esc o al desplazar. Sacar una foto nunca la pierde y el aviso dice a dónde fue: una foto de la web vuelve a «Agregar fotos de la web», libre para otro producto; con una foto subida, la confirmación pregunta si guardarla en tus fotos («Guardarla en mis fotos», la opción segura) o borrarla («Borrarla»), y se borra al publicar los cambios. En «Agregar fotos de la web», las fotos subidas que ningún producto usa llevan los mismos tres puntos con «Borrar para siempre» (`trash`), que pide la confirmación y la quita de la lista en el acto; una foto subida que se va a borrar dice «Se borra al publicar»; mientras una foto está elegida, sus tres puntos se esconden. En ese selector, las fotos libres van primero y las que ya están en otro producto quedan al final de su sección, tapadas: desenfoque de 6 px y opacidad .45 sobre el fondo blanco cálido, con su línea «En «…»» legible; se aclaran al pasar por encima, con el foco o al elegirlas, y se pueden tocar igual (se mueven o se unen) |
| Confirmación y aviso (centro de control) | `.admin-confirm` | Diálogo pequeño (480 px) del mismo estilo que los demás, en lugar de los avisos del navegador: toda acción delicada pregunta antes, nombrando el producto («¿Salir sin guardar *Torta Sencilla*?», «¿Ocultar *Torta Vintage*?», «¿Pasar *Torta Vintage* a Detalles?»): salir sin guardar o con cambios sin publicar, publicar (con la lista de lo que cambia), descartar, ocultar un producto, pasarlo a otra sección, guardar una ficha con algo por revisar (precios vacíos), quitar una opción con nombre, un grupo o la foto de un sabor, poner el mismo valor en todos los tamaños, eliminar un producto, unir o mover fotos, sacar una foto subida y borrarla. Sin «Cancelar» es un aviso de un solo botón («Entendido»), como lo que falta antes de publicar. El foco empieza en la opción segura. Lleva titular Playfair con la parte clave en `<em>`, texto en tinta suave que dice qué pasa y cuándo se ve en la web, si hace falta una lista de lo afectado (filas crema con borde: foto de 40 px, nombre Playfair y cuenta en tinta suave) o de lo que hay que revisar (viñetas en tinta), y abajo a la derecha la opción segura en secundario («Cancelar», «Volver», «Seguir editando», «Conservarlo»…) y la acción en principal, con `check`, que dice lo que pasa («Eliminar», «Unir y seguir»). Esc o fuera cancelan. Se muestra una sola vez por tanda, al confirmar, nunca en cada toque |
| Avisos (centro de control) | `.admin-notices` | Botón secundario «Avisos» junto a «Nuevo producto», con su cuenta en una píldora lila. Abre un diálogo de la marca (600 px): «Tus *avisos.*» (o «Todo *en orden.*») con tres grupos bajo una etiqueta y su cuenta: «Para poder publicar» (lo que lo impide), «Para revisar» (se puede publicar, pero conviene completarlo: un aviso por producto y por tema, como «5 adicionales sin precio (…)» o bizcochos sin foto) y «Lo que pasó» (lo que no se permitió o falló mientras se usaba el panel, con su hora). Cada aviso en una fila crema con borde y, si lleva a un producto, «Ir a arreglarlo» como enlace de texto, que abre su ficha. Si algo impide publicar, «Publicar cambios» abre los avisos. Lo que no se permite o falla sale además en el aviso rápido |
| Barra de publicar (centro de control) | `.admin-savebar` | Blanco cálido, borde, radio 12 px y sombra flotante, abajo al centro; cuenta los cambios y lleva «Descartar» (secundario) y «Publicar cambios» (principal) |

El centro de control (`/admin/`) usa los mismos tokens, letras y componentes: campos y opciones de la ficha, casillas, botones, enlaces y avisos. Sus textos siguen la voz de la marca. Nada se ve genérico: no hay desplegables, menús ni avisos del sistema; las listas cortas (torta base, sección, filtro) se eligen con las opciones `.choice`, las acciones de una foto van en el menú de foto y toda pregunta o aviso usa la confirmación de la marca (`.admin-confirm`). Solo queda el aviso del navegador al cerrar la pestaña con cambios sin publicar, que la web no puede cambiar.

Estructura de toda página pública: cabecera fija con logo, menú y pedido; contenido; pie lila; botón flotante de WhatsApp y diálogos de producto, pedido y galería.

En el teléfono, el pie va en dos columnas (una sola por debajo de 380 px, para que ningún enlace se parta) y su línea final se apila: primero «© … Hecho a mano en Medellín desde 2022» y debajo «Volver arriba», lejos del botón de WhatsApp.

## 10. Fotografía

- Mesa de lino marfil, pared crema lisa, luz suave de ventana. Producto, decoración y empaque protagonistas.
- Proporciones: 4:5 en tarjetas, galerías, fichas y publicaciones de Instagram; 3:2 en sabores; 1:1 en rellenos; video 16:9 con `object-fit: contain`.
- Al ampliar se ve la foto completa con miniaturas debajo. Mientras carga, el espacio se ve durazno.
- Ficha de producto: la foto principal grande y, debajo, la fila de fotos (`.photo-strip`) con las demás fotos de la misma referencia. Las fotos grandes van en una fila (`.product-slides`) que sigue al dedo o al trackpad y se detiene en cada foto; con las flechas o una miniatura vecina se desliza a la siguiente, y a una miniatura lejana se llega con un fundido corto, sin pasar por las de en medio. La siguiente y la anterior se cargan antes de llegar. Las flechas van en la fila, sobre las miniaturas, nunca encima de la foto grande.
- Cada foto vive en un solo producto: una referencia con varias fotos es un producto con su fila de fotos, no varios productos parecidos. Las páginas de colección no repiten esas fotos en galerías aparte: Alfajores, Brownies y galletas y Detalles tienen solo su catálogo (y, en Alfajores y Detalles, el banner de invitación).
- Fotos subidas desde el centro de control: se guardan en WebP de 1440 px como máximo. Mejor verticales, en 4:5, como las de la web.
- Solo fotos reales de Lauren (también las de su Instagram): ni de banco, ni generadas con IA, ni con filtros que cambien el color. Nada encima de la foto salvo los sellos, la flecha y las miniaturas asomadas de las tarjetas y, sobre las miniaturas de la fila de fotos, sus flechas.
- Inventario: `assets/propuestas-fotograficas/manifest.json`.

## 11. Movimiento y acceso

| Interacción | Comportamiento |
| --- | --- |
| Botón principal | Esquinas intercambiadas y lila, 600 ms con `--ease-ribbon` |
| Flecha | Avanza unos píxeles, 560 ms |
| Menú | Subrayado albaricoque que crece, 420 ms |
| Diálogos | Aparecen subiendo 10 px, 260 ms |
| Fotos de producto | Se acercan levemente al pasar el cursor, 600 ms |
| Fotos de la ficha | Se deslizan de una a otra y se detienen en cada foto; a una lejana, fundido de 140 + 260 ms. Con movimiento reducido, cambian sin animación |
| Foto de Tortas en la portada | Cambia cada 4 s con un fundido de 800 ms |
| Videos de Instagram en la portada | Se reproducen solos, sin sonido; al terminar, la casilla pasa a otro video |

- Todo el contenido visible desde el inicio: sin apariciones en cascada, máscaras ni desvanecimientos al bajar.
- Nada salta al elegir: marcar una opción, pasar el cursor o cambiar un texto nunca cambia el tamaño de un control ni mueve lo que está a su lado o encima. Lo que aparece al elegir (el punto de la opción, «Oculto», «Agregada», las unidades del total) tiene su sitio reservado desde el principio, y si la ficha del centro de control se vuelve a dibujar, la opción tocada se queda bajo el dedo.
- Sin reproducción automática ni scroll forzado. Dos excepciones: la foto de Tortas en «Tú pones el motivo…», que cambia sola, sin sonido ni texto, y se detiene con el cursor o el foco encima, fuera de pantalla y con la pestaña oculta; y los videos de «Un poquito más de Lauren», sin sonido, que se pausan fuera de pantalla, con la pestaña oculta o con «Pausar videos». `prefers-reduced-motion` apaga las animaciones y deja esa foto fija; con movimiento reducido o «ahorro de datos», los videos muestran su portada fija.
- Foco visible: contorno ciruela de 2 px. Áreas táctiles de 44 px. Ajustes responsive junto a cada componente.
- En pantallas táctiles, lo pequeño se toca en 44 px de alto sin cambiar cómo se ve: enlaces del pie, la ruta («Inicio / Tortas»), el nombre de cada producto y la barra del video.
- En el teléfono ningún texto de lectura baja de 11 px: la etiqueta (`.eyebrow`) y la franja de valores van a 11 px. Solo el contador del pedido, la píldora «Desde» y el tiempo del video son más pequeños, por ser marcas y no texto para leer.

## 12. Antes de publicar

1. Colores solo de `css/tokens.css`.
2. Titulares en Playfair Display e interfaz en Inter, con la escala de este manual.
3. Componentes existentes reutilizados.
4. Iconos de `LaurenIcons`, trazo 1,5.
5. Logo y dibujos de `assets/brand/`, sin redibujar.
6. Textos cercanos, amigables, cariñosos y atentos.
7. Precios, contactos y condiciones confirmados por Lauren.
8. Fotos reales en sus proporciones.
9. Foco visible, 44 px, movimiento reducido y nada que salte al elegir.
10. Revisado en móvil y en escritorio.
