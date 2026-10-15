# Rendimiento

El sitio no incorpora framework ni dependencias de cliente. Los principales costes son fotografías, fuentes y video.

- Fotografías aprobadas en `assets/propuestas-fotograficas/`, con copias responsive de 320, 640 y 960 px. El navegador elige con `srcset` y `sizes` según el espacio y la densidad de pantalla; conserva la foto completa para tamaños mayores y la ampliación.
- En las cinco páginas públicas, las fotos de portada se solicitan de inmediato y la principal tiene prioridad alta. Las fotos del contenido y las primeras ocho de cada galería usan `loading="eager"`, prioridad baja y `decoding="async"`: comienzan a prepararse al entrar en la página, sin esperar a que el usuario baje. Las miniaturas fuera de la vista del configurador mantienen carga diferida.
- Se reservan proporciones con CSS y atributos de dimensiones para estabilizar la composición.
- Las fotos nunca se ocultan con máscaras, opacidad o animaciones activadas por el scroll. Los efectos de interacción no retrasan la presentación del contenido.
- Galerías paginadas por grupos de ocho. «Ver más creaciones» agrega las nuevas fotos conservando los nodos y las imágenes ya cargadas; no hay carruseles infinitos ni copias para animaciones continuas. Las galerías de las cuatro páginas de catálogo (`data-gallery-all`) muestran todas las fotos de una vez: las 8 primeras cargan de inmediato y el resto con `loading="lazy"`.
- La historia carga su poster `assets/optimized/imagenes-inicio/historia-poster.webp`; el MP4 de unos 5 MB se solicita solo al reproducir. Se conserva el original horizontal, sin ampliación artificial para cubrir un marco.
- Fuentes Playfair Display e Inter en una petición por página, con `display=swap` y preconexión.
- Scripts con `defer`; estilos divididos entre tokens, base, catálogo y diálogos. Se retiraron las capas de CSS/JS obsoletas.

El servidor local admite rangos de bytes, necesarios para avanzar por el video sin descargar otra vez todo el archivo. El script de copias responsive usa `cwebp` y `webpinfo`; no es necesario para la vista previa.

## Mantener las versiones responsive

Tras cambiar una propuesta fotográfica, actualizar su referencia en el inventario y ejecutar:

```bash
node scripts/optimize-photography.mjs
```

Requiere `cwebp` y `webpinfo`. Lee el inventario `manifest.json`; genera copias en `assets/propuestas-fotograficas/responsive/`, el mapa derivado `js/image-variants.js` y actualiza los `srcset` estáticos de las cinco páginas. No reescribe las fotos aprobadas. Reutiliza copias más recientes que su fuente y no amplía imágenes pequeñas. Las nuevas etiquetas HTML deben declarar `sizes` según su componente; el contenido dinámico usa `LaurenUI.imageAttributes` y los cambios de fotografía usan `LaurenUI.setImageSource` para actualizar también el `srcset`.

Las fuentes incluidas suman 18,63 MB; sus versiones de 640 px, 5,63 MB (aproximadamente un 70 % menos). Son tamaños de archivo del conjunto, no una medición de velocidad de una página. La variante elegida depende del dispositivo y de su caché.

Comprobación focalizada de septiembre de 2026: fuentes existentes, sintaxis, inicio sin imágenes ocultas ni pendientes de scroll; galería de ocho a dieciséis imágenes y cambio de foto en el configurador. No se repitió una auditoría responsive completa.

No se publican puntuaciones de Core Web Vitals porque esta revisión no incluyó mediciones de campo ni Lighthouse. Medir en el hosting real si se solicita optimización de campaña; no confundir una comprobación local sin errores con una puntuación de rendimiento.
