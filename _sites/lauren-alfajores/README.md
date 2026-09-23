# Lauren · Demo independiente de alfajores

Implementación del editable aprobado en HTML, CSS y JavaScript. La actualización
local incorpora las presentaciones reales aportadas por Lauren y sustituye los
sabores conceptuales por solicitud del usuario. Sin dependencias, compilación,
pagos, pedidos reales, autenticación ni datos personales.

## Ejecutar y comprobar

Desde la raíz de LaurenReposteria:

```bash
cd _sites/lauren-alfajores
node scripts/serve.mjs 5180
```

Abrir <http://127.0.0.1:5180/>. Solo se sirve `public/`; el servidor escucha en
127.0.0.1. No es una publicación en Internet.

En otra terminal, desde esta carpeta:

```bash
node --test tests/demo.test.mjs
node scripts/verify.mjs
node scripts/package.mjs
git diff --check -- .
```

`npm run dev`, `npm test`, `npm run check`, `npm run package` y `npm run deploy`
son alias; no requieren `npm install`. Node 22 o posterior.

## Identidad de Lauren Alfajores

La propuesta **12 · Bombón** fue elegida por el usuario para esta web. Se aplica
en cabecera, pie, menú móvil, carrito vacío y favicon. Los SVG
de `public/assets/brand/` conservan los trazados del máster
`artwork/propuestas-logo/12-bombon.svg`; el favicon abrevia las primeras letras.

`public/brand.css` centraliza esta identidad sin alterar el CSS de referencia.
Coiny se usa en los títulos de marca; Outfit en párrafos, navegación, botones,
precios y diálogos. Se ajustaron tamaños, interlineado y espaciado para esta
combinación. Ambas fuentes se sirven localmente en WOFF2 con caracteres latinos
y españoles; sus licencias OFL están junto a ellas. La web no depende de Google
Fonts. La paleta crema, rosa, lavanda y tinta ciruela conserva la identidad.

La página usa una base blanca y fotografías más grandes. Cada presentación,
incluidas las cajas, revela un fondo redondeado con su color del catálogo al
pasar el mouse o enfocar sus controles con teclado. El movimiento es discreto
y respeta la preferencia de movimiento reducido. En pantallas táctiles las
acciones permanecen visibles; el color responde al toque sin bloquearlas.
La portada prescinde de sellos, aros y flechas decorativas. Las fotografías
aprobadas se reutilizan sin editar; su escala contempla los distintos márgenes
transparentes. Estos estilos están en `public/brand.css`; el CSS original se
conserva intacto.

Los textos conservan los titulares de marca y una descripción breve por producto.
Se omiten sobrelíneas decorativas, frases repetidas y notas vacías. Ingredientes,
unidades, tamaños, precios de referencia, mínimos y alcance de la demo siguen
visibles donde ayudan a elegir; las cantidades no se repiten en notas adicionales.

Cinco fotografías de empaques (minis, caja, cajas, bolsitas y torta empacada)
muestran el nuevo logo. Son visualizaciones de packaging para la demo, no una
confirmación de cambios en los empaques físicos. Másteres y prompts de la edición
integrada `image_gen` en `artwork/presentaciones-reales/bombon/`; los WebP públicos
conservan la resolución nativa y transparencia. Las versiones anteriores se
conservan en `mejoradas/`. El alfajor individual conserva la fotografía aprobada
y sirve como referencia de iluminación y textura para toda la colección.

Los másteres seleccionados están en
`artwork/presentaciones-reales/bombon/limpieza/`, junto a sus prompts de
`image_gen` integrado. `minis-estudio.png` (1024 × 1536) fue aprobado por el
usuario como referencia junto al clásico. A partir de las fotos originales se
rehicieron con ese mismo acabado `bolsitas-estudio-celofan.png`, `caja-estudio.png`,
`cajas-estudio.png`, `torta-estudio.png` y `torta-regalo-estudio.png` (1536 × 1024).
Se usan luz difusa clara, color natural y grano fino de maicena, sin la textura
artificial de los retoques anteriores. Se conservan la presentación real y la
identidad Bombón. El clásico y los minis aprobados permanecen sin cambios.

Los seis másteres de estudio se exportan con `cwebp -lossless -exact -m 6`;
la decodificación RGBA coincide píxel por píxel con los PNG, incluida la
transparencia. Las mismas imágenes se reutilizan en portada, catálogo y fichas.
Minis y bolsitas conservan la corrección de sombra CSS y rotación. Los másteres
previos permanecen para comparar; `prompts.json` identifica las versiones
seleccionadas y `validation.json` registra las comprobaciones actuales.

La revisión de esta identidad comprobó que los títulos y el contenido no se
desbordan a 360, 390, 768, 1024 y 1440 px. Se revisaron visualmente portada y
cajas en escritorio y portada, bolsitas, menú, carrito vacío y ficha de caja a
390 px. Pasaron las diez pruebas existentes, el verificador y el empaquetado;
los recursos del servidor local coinciden con los archivos. El detalle está en
`artwork/presentaciones-reales/bombon/validation.json`. Son comprobaciones en
ventanas del navegador, no en teléfonos físicos. Esta identidad sigue en local.

### Propuestas locales de logo

`artwork/propuestas-logo/` reúne trece propuestas de identidad exclusivas para
Lauren Alfajores. Las 09–13 desarrollan los favoritos del usuario: 01 Cremoso,
02 Dos tapas y 04 Redondo. Las propuestas iniciales y los originales del
brandbook se conservan; la elección se aplica únicamente a la demo de alfajores.

La comparativa interactiva se abre con `node artwork/propuestas-logo/serve.mjs`
en <http://127.0.0.1:5181/>. Permite alternar los cinco nuevos logos y los tres
favoritos sobre una recreación de la cabecera y descargar los SVG y PNG
transparentes. Los SVG usan trazados
sin dependencia de fuentes; sus fuentes de origen y licencias OFL están en
`artwork/propuestas-logo/fonts/`. El generador es `build_logos.py` (requiere
fontTools). Las propuestas y su servidor quedan fuera del despliegue público.

## Estructura y edición

| Ruta | Responsabilidad |
| --- | --- |
| `public/index.html` | Contenido y estructura aprobados; meta `noindex` |
| `public/styles.css` | CSS original completo, sin cambios |
| `public/presentations.css` | Adaptación de fotografías, opciones de presentación y pantallas pequeñas sobre los tokens aprobados |
| `public/brand.css` | Logo Bombón, fuentes locales y escala tipográfica responsive |
| `public/assets/brand/` y `public/assets/fonts/` | SVG de la identidad elegida, WOFF2 y licencias |
| `public/catalog.js` | Presentaciones, tamaños, sabores de caja, mínimos, precios de referencia y fotografías |
| `public/app.js` | Fichas, configurador de cajas, cambio de fotografía, selección local, resumen y cantidades |
| `public/assets/presentaciones/` | Siete WebP transparentes usados en la web |
| `public/assets/` | Las cuatro imágenes originales y las cuatro variantes conceptuales anteriores se conservan sin usar |
| `artwork/presentaciones-reales/` | Referencias del usuario, primer retoque, prompts y comprobaciones; no se publica |
| `artwork/presentaciones-reales/mejoradas/` | Fotografías antes de aplicar Bombón; originales seleccionados y estado del segundo retoque |
| `artwork/presentaciones-reales/bombon/` | Cinco empaques con la nueva identidad, prompts y comprobación de transparencia |
| `artwork/alfajor-original-v2/` | Recursos de la propuesta conceptual anterior, conservados; no se publica |
| `public/config.js` | Modo demo, URL canónica verificada y contactos futuros vacíos |
| `reference/editable/` | Ocho originales conservados sin cambios |
| `reference/provenance.json` | Procedencia real y hashes calculados en esta sesión |
| `scripts/` | Servidor, validación, empaquetado por lista y despliegue aislado |
| `tests/` | Pruebas de lógica; no se publican |
| `evidence/` | Resultados y capturas reales; no se publican |
| `artifacts/` | Copias de los archivos permitidos para hosting, ignoradas por Git |

El catálogo editable está en `PRODUCTS`, en `public/catalog.js`. Las cinco
presentaciones son alfajor original, vaso de 30 minis, torta, bolsitas y cajas.
Los tamaños, mínimos y precios de las presentaciones base se transcribieron del
catálogo existente `../../js/catalog-data.js`, sin importar ni modificar su
código. Son precios de referencia en COP enteros, sin cálculo de transporte.
Las cajas nuevas responden al encargo de 3, 6 o 12 alfajores, todos de 5 cm.
Sus precios son `null` hasta que Lauren los defina: se muestra «Precio por
confirmar», sin reutilizar importes anteriores ni convertirlos en cero.

La ficha permite elegir tamaño; la página permite alternar fotografías de tortas
y cajas. «Arma tu caja» abre un configurador con las tres capacidades fijas y
cinco opciones de `BOX_FLAVORS`: arequipe clásico, Nutella, chocolate, cubierto de
chocolate negro y cubierto de chocolate blanco. La vista previa permite mezclar
estos sabores; esta modalidad queda propuesta a la espera de confirmación del
usuario. La fotografía de empaque existente es de referencia y no se regeneró.

Solo se puede añadir una caja cuya suma de sabores coincida con su capacidad.
Reducir la capacidad conserva lo elegido y pide retirar el exceso. Los contadores
conservan el foco al deshabilitar una acción; el borrador permanece durante la
sesión al cerrar la ficha y se vacía al añadir la caja. Cada combinación se guarda
en una línea distinta; combinaciones equivalentes se agrupan. El resumen muestra
la cantidad de cada sabor **por caja**. Las cajas clásicas guardadas en versiones
anteriores se restauran con todas sus unidades de arequipe y los precios actuales.

Los individuales y las bolsitas parten de un mínimo de seis de la misma variante.
El contador suma productos/presentaciones, no los alfajores contenidos en cada
empaque. Cada línea acepta hasta 99 y la selección hasta 50 líneas. Los precios
siempre se recalculan desde el catálogo. Si cualquier línea tiene precio pendiente,
el total también queda por confirmar y las demás líneas conservan sus importes.
La clave local es
`lauren-alfajores-presentaciones-v1`: la selección conceptual anterior permanece
intacta en su clave previa y no se convierte automáticamente.

`demo` permanece en `true`; cambiar esa propiedad no implementa un canal comercial.
No incorporar contactos ni activar ventas sin un encargo posterior.

## Fotografías de las presentaciones reales

Las siete fotografías aportadas por el usuario se retocaron con la herramienta
integrada `image_gen`: extracción del fondo, luz, balance de color y detalle.
Se mantienen las tapas claras de maicena, el arequipe y las presentaciones de las
fotos. Las etiquetas pequeñas ilegibles de bolsitas y torta empacada se
simplificaron con el nombre de marca; no se inventaron contactos. Estas imágenes
retocadas no son reproducciones técnicas exactas del impreso original.

El segundo retoque anterior mejoró torta, bolsitas, caja, grupo de cajas y torta
empacada. El generador devolvió `usage_limit_reached` para el alfajor individual y
el vaso de minis en esa ronda. Posteriormente, al elegir Bombón, fue posible
editar el vaso y los otros cuatro empaques con la herramienta integrada. El
alfajor individual conserva su primer retoque. No se utilizó una API de pago
alternativa.

Másteres PNG de 1536 × 1024 px antes del cambio de marca en
`artwork/presentaciones-reales/mejoradas/` y los cinco empaques actualizados en
`artwork/presentaciones-reales/bombon/`.
La herramienta mantuvo esa resolución nativa; no hubo ampliación artificial.
Los prompts y el estado de cada imagen están en `mejoradas/prompts.json`; la
primera edición está documentada en `artwork/presentaciones-reales/prompts.json`.
Los WebP conservan el alfa. El clásico aprobado mantiene su exportación
`cwebp -q 90 -alpha_q 100 -m 6`; las seis fotos de estudio usan la exportación
sin pérdida descrita arriba. Los originales y el primer retoque se conservan.
`artwork/lauren-productos-sin-fondo.zip` corresponde a una exportación anterior;
los másteres actuales y sus prompts son los identificados en `bombon/limpieza/`.

Las presentaciones están integradas en la vista previa local. La URL pública
indicada abajo corresponde al despliegue anterior; esta actualización no se ha
publicado. `check-live.mjs` se ejecuta después de publicar deliberadamente la
misma versión, no para validar cambios que solo existen en local.

## Procedencia y límites de la referencia

El paquete `Lauren_Codex_Kit` no estaba disponible. Se recuperó
`~/Downloads/Lauren_Web_Archivos_Editables.zip` y su carpeta `lauren-web/`;
los ocho archivos de la carpeta coincidieron byte por byte con el ZIP.
El encargo pegado por el usuario confirma esta versión editable y sus tokens.

Faltan el HTML autónomo `Lauren_Alfajores_Web_Interactiva.html`, las capturas
entregadas, `PROMPT_MAESTRO.md`, `CHECKLIST_ACEPTACION.md`, `AUDITORIA_ORIGEN.md`,
`AGENTS_LAUREN.md` y el manifiesto/verificador del kit. La comparación realizada
es contra el editable recuperado, no contra archivos inexistentes. El checklist
operativo es el encargo completo recibido el 22 de septiembre de 2026.
El manifiesto local no se presenta como un manifiesto suministrado por el usuario.

Para abrir esa referencia conservada (solo local):

```bash
python3 -m http.server 5174 --bind 127.0.0.1 --directory reference/editable
```

## Aislamiento y publicación

El sitio principal conserva sus archivos y `CNAME`, su carrito y su GitHub Pages.
Esta carpeta comienza con `_` para que el Jekyll del sitio principal la excluya
por defecto. No añadirla a `include` ni publicar la raíz del proyecto sin revisar
esa separación. El destino independiente recibe únicamente la lista explícita
de archivos de `scripts/files.mjs`.

URL pública: <https://cristhianespitia1.github.io/Lauren-Alfajores-Demo/>.

Destino: `CristhianEspitia1/Lauren-Alfajores-Demo`, rama `codex/lauren-demo`,
GitHub Pages desde `/`. Solo contiene el artefacto público. No se publica el
repositorio principal ni se hace push de sus cambios locales.

```bash
# Primera creación del repositorio público independiente y publicación:
node scripts/deploy.mjs --init
# Publicaciones posteriores en el mismo destino:
node scripts/deploy.mjs
# Estado real, URL asignada y última versión:
gh api repos/CristhianEspitia1/Lauren-Alfajores-Demo/pages
gh api repos/CristhianEspitia1/Lauren-Alfajores-Demo/pages/builds/latest
```

El script crea un clon temporal separado, copia solo los archivos permitidos,
hace commit y push normal sin `--force` y configura exclusivamente ese Pages.
Registra la URL devuelta por GitHub y el commit en `evidence/deployment.json`.
Que el push termine no significa que la URL esté lista: esperar el estado `built`
y comprobar sus recursos y flujos antes de anunciar el despliegue.
`node scripts/check-live.mjs` contrasta los recursos servidos con los
archivos locales y comprueba que cinco rutas internas devuelven 404.

La demo tiene `meta robots=noindex,nofollow,noarchive`; el servidor local también
envía `X-Robots-Tag`. GitHub Pages no admite configurar esa cabecera aquí, por eso
la meta es la protección de indexación publicada. `robots.txt` dentro de una URL
de proyecto no sustituye el archivo del origen; no depender de él. Esto no hace
privada la demo. No contiene secretos ni referencias/pruebas/capturas internas.

GitHub Pages está disponible para repositorios públicos en GitHub Free:
[documentación del proveedor](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
No se contratan servicios, dominios, planes ni se cambian registros DNS.
Fuentes oficiales de configuración:
[API de Pages](https://docs.github.com/en/rest/pages/pages),
[exclusiones de Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll).

## Revertir solamente esta demo

Usar un clon del repositorio de despliegue, nunca la raíz de LaurenReposteria:

```bash
gh repo clone CristhianEspitia1/Lauren-Alfajores-Demo lauren-alfajores-hosting
cd lauren-alfajores-hosting
git log --oneline
# Sustituir COMMIT por el despliegue posterior que se quiere deshacer:
git revert COMMIT
git push origin codex/lauren-demo
```

La primera publicación no tiene una versión anterior. Para despublicarla, un
encargo explícito posterior puede desactivar Pages únicamente en ese repositorio.
No quitar ni alterar el Pages o DNS de `Lauren-Reposteria`.

## Decisiones técnicas y pendientes

- Conservar composición y paleta. La tipografía y el logo incorporan la elección
  de Bombón; las fotografías, las descripciones y las opciones de presentación
  incorporan los encargos posteriores del usuario.
  El catálogo de referencia se copió de forma independiente; no se comparte
  carrito, navegación, autenticación ni publicación con el sitio principal.
- Añadir validación explícita de identificadores: la prueba de almacenamiento
  demostró que el original aceptaba `toString`, `__proto__` y arrays como producto.
  Ahora se rechazan y todos los precios se recalculan desde el catálogo.
- Conservar el foco de teclado al deshabilitar o retirar un control de cantidad.
- El CSS adicional centra las imágenes altas sin ampliar la columna, conserva
  espacio antes del texto y amplía los controles táctiles compactos a 44 px.
- Coiny y Outfit se sirven localmente; los respaldos del sistema cubren cualquier
  fallo de carga. Los logos son trazados SVG y no dependen de las fuentes.
- Pendientes comerciales: aprobación final de las fotografías retocadas y del
  catálogo, recetas, alérgenos, conservación, disponibilidad, contacto, entrega
  y canal de venta. No bloquean esta demostración; no se inventaron datos.
- El dominio del sitio principal ya fallaba por DNS antes de esta tarea.
  Su configuración no se cambió. El detalle de verificación queda en `evidence/`.

Ver `artwork/presentaciones-reales/validation.json` para las comprobaciones de la
versión de presentaciones reales y sus capturas. Las catorce pruebas actuales de
lógica cubren variantes, precios pendientes, combinaciones y capacidad de cajas,
límites, almacenamiento, resumen, copia y descarga. El configurador se comprobó
en escritorio y a 390 px, incluyendo una caja mixta de tres unidades, su selección
y resumen. Las pruebas del
navegador usan tamaños de ventana; no equivalen a dispositivos físicos.
Se comprobaron anchos de 360, 390, 430, 768, 1024, 1440 y 1920 px, además de
844 × 390 en horizontal. Se corrigieron el espacio de la foto de minis, controles
táctiles, cierre accesible al desplazar las fichas, recorte de fotografía en
horizontal y el icono de las preguntas abiertas. Se verificaron navegación,
variantes, cantidades, restauración local, resumen y copia. La descarga se cubre
con prueba de lógica. El atajo de zoom no tuvo efecto en la vista integrada;
zoom al 200 % y pruebas en iOS/Android físicos quedan sin verificar.
`evidence/RESULTADOS.md` conserva la evidencia de la demo conceptual anterior.
