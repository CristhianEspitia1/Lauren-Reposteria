# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/).
Este proyecto no usa versiones semánticas publicadas; se registra por fecha de
auditoría/cambio.

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
