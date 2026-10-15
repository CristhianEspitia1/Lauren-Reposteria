# Accesibilidad

La implementación incluye estructura semántica, `lang="es"`, enlace para saltar al contenido, un h1 por página, controles de teclado y foco visible. Los SVG decorativos se ocultan del árbol accesible; las acciones de solo icono tienen nombre.

## Comportamiento

- Producto, pedido, galería y video ampliado usan `dialog` nativo, Escape y restauración del foco.
- Menú con `aria-expanded` y cierre por Escape, selección y clic exterior.
- Formularios con etiquetas, grupos, campos requeridos, límites y errores junto al dato correspondiente.
- Controles móviles de acción con áreas táctiles amplias; campos de texto a 16 px.
- Filtros con estado seleccionado; resultados y avisos accesibles. El temporizador del video no anuncia cada segundo.
- Movimiento reducido global y video iniciado por el visitante, con controles propios.

## Comprobación local, septiembre de 2026

Se recorrieron menú móvil, elección de productos, errores de personalización, edición de opciones/cantidad, eliminación/deshacer, galería con Escape y controles del video. Se revisaron muestras visuales en escritorio y móvil y geometría renderizada de las cinco páginas públicas a 360, 430, 768, 1024, 1440 y 1920 px, además de 844 × 390 horizontal: sin desbordamiento horizontal ni imágenes cargadas rotas en esos estados.

Los cinco complementos muestran SVG propios junto a su nombre, sin imágenes raster decorativas.

No es una certificación WCAG. No se hizo una evaluación con lectores de pantalla, una suite de navegadores físicos ni mediciones Lighthouse. La entrevista original todavía no aporta un archivo de subtítulos; añadirlo requiere una transcripción fiel y revisada. No inventar texto para sustituir la narración.
