# Problemas pendientes - Lauren Repostería

Última actualización: 16 de mayo de 2026.
Última verificación en navegador: 16 de mayo de 2026.

## Estado general

El sitio queda funcional y estable en las páginas principales. La verificación local confirmó carga correcta en móvil, tablet y desktop, sin errores de consola, sin imágenes rotas visibles, sin desbordamiento horizontal y con los controles principales operativos.

## Resuelto en la auditoría actual

- HTML duplicado y frágil en modales de páginas de producto.
- Imagen vacía en modales y lightbox que podía generar solicitudes rotas.
- Falta de `h1` único en páginas principales.
- Metadatos SEO, canonical, Open Graph, Twitter Card y favicon incompletos.
- Botones interactivos sin `type`, `aria-label`, `aria-expanded` o `aria-controls` donde aplicaba.
- Menú de navegación sin estado accesible para teclado/click.
- `brownies-galletas.html` tenía botón de contacto sin el script correspondiente.
- `console.log` de depuración en producción.
- Rutas rotas en dos assets de detalles adicionales dentro de `catalog-data.js`.
- `css/quick-view-modal.css` contenía bytes nulos y quedó normalizado como texto válido.
- `CNAME` sin salto final y `.gitignore` sin protección contra archivos `._*`.
- Hero de Tortas actualizado con el nuevo video fuente `0516 (1).mov`, exportado a `heroTortas-web.mp4` y `heroTortas-mobile.mp4`, sin zoom artificial ni cambio de escala por breakpoint.
- Hero de Brownies/Galletas actualizado para usar el nuevo video `heroCookies-web.mp4`, con variante móvil `heroCookies-mobile.mp4`, exportados desde `heroCookies.mov` y sin zoom artificial.
- Sistema de heroes actualizado para usar proporciones estables por módulo (`inicio`, `tortas`, `alfajores`, `brownies-galletas` y `detalles`) en lugar de alturas fijas y recortes con `scale()`.
- Carga inicial pesada en Inicio por videos secundarios, corregida con carga diferida para tarjetas y video de "Nuestra historia".

## Pendiente por confirmar con el negocio

### Datos de contacto inconsistentes en documentación histórica

El sitio y el README usan:

- WhatsApp: `573104442796`
- Instagram: `laurenreposteria22`

Algunos archivos internos de guías mencionan:

- WhatsApp: `573023687321`
- Instagram: `lauren.reposteria`

No se modificaron esos datos porque pueden ser información real antigua o alternativa. Se necesita confirmación de cuál es el dato oficial antes de unificar toda la documentación.

## Riesgos técnicos pendientes

### Assets pesados

Hay varios videos de más de 2 MB. El más pesado detectado es `assets/imagenes-inicio/Nuestra-historia.mp4` con aproximadamente 17 MB. El nuevo hero de Tortas quedó en `assets/imagenes-tortas/herotortas/heroTortas-web.mp4` con aproximadamente 11 MB para escritorio y `heroTortas-mobile.mp4` con aproximadamente 7.5 MB para móvil/tablet. El nuevo hero de Brownies/Galletas quedó en `assets/imagenes.brownies.galletas/Hero/heroCookies-web.mp4` con aproximadamente 8.3 MB para escritorio y `heroCookies-mobile.mp4` con aproximadamente 5.4 MB para móvil/tablet. Ya no se descargan videos secundarios al abrir Inicio, pero conviene seguir comprimiendo videos antes de una campaña con mucho tráfico.

### Bandas internas en videos fuente

El CSS ya no usa zoom artificial para esconder bandas. Si una franja aparece de nuevo, debe corregirse en el archivo de video fuente mediante exportación/corte del video, no con `transform: scale()` en el sitio.

### Nombres de archivo delicados

El proyecto contiene rutas con espacios, acentos, mayúsculas, caracteres especiales y nombres duplicados o similares. Funcionan si la ruta coincide exactamente, pero aumentan el riesgo de errores en GitHub Pages o servidores sensibles a mayúsculas/minúsculas.

### CSS inline histórico

Las páginas todavía conservan bloques extensos de CSS inline heredado. No bloquean el sitio, pero hacen más difícil mantener estilos a largo plazo. La recomendación es migrar gradualmente esos estilos a archivos CSS compartidos sin cambiar la apariencia.

### Editor visual de productos

`html/tabla-productos.html` puede ser útil como herramienta interna, pero no reemplaza un flujo controlado de edición. Si se usa, hay que revisar manualmente el archivo descargado antes de reemplazar `js/catalog-data.js`.

## Checklist de verificación actual

- Páginas principales cargan correctamente.
- Menú móvil abre y actualiza `aria-expanded`.
- Carrito abre y muestra overlay.
- Botón flotante de contacto abre y actualiza `aria-expanded`.
- Vista rápida de tortas abre con contenido e imagen.
- No hay errores de consola en la verificación local.
- No hay imágenes rotas ni `alt` faltantes en páginas principales.
- No hay IDs duplicados en páginas principales.
- No hay enlaces externos `target="_blank"` sin `noopener`.
- No se detectaron claves API, tokens ni credenciales expuestas en frontend.

## Recomendaciones futuras

- Confirmar y unificar los datos oficiales de WhatsApp e Instagram.
- Comprimir videos grandes y evaluar formatos modernos.
- Crear una convención nueva de nombres de assets: minúsculas, sin espacios, sin tildes y con guiones.
- Reducir CSS inline heredado en ciclos pequeños, verificando visualmente cada página.
- Mantener pruebas en navegador antes de publicar cambios en productos, precios o rutas.
