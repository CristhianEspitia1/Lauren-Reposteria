# Lauren Repostería - Sitio web oficial

Sitio estático de Lauren Repostería, marca de repostería artesanal en Medellín, Colombia. El sitio presenta tortas personalizadas, alfajores, brownies, galletas y detalles especiales con una estética dulce, elegante y profesional.

Última auditoría técnica: 16 de mayo de 2026.

## Cómo ejecutarlo localmente

Desde la raíz del proyecto:

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

Luego abre:

```text
http://127.0.0.1:5173/html/inicio.html
```

También se puede abrir `html/inicio.html` directamente en el navegador, pero el servidor local es mejor para detectar rutas rotas, errores de carga y comportamiento real de producción.

## Tecnologías

- HTML5 estático.
- CSS3 con variables visuales, responsive design, animaciones y efectos glass/luxury.
- JavaScript vanilla para carrito, modales, carruseles, menú y contacto.
- Assets locales de imágenes, video, logos y tipografías.
- GitHub Pages / dominio configurado con `CNAME`.

No hay framework, bundler, backend, base de datos ni dependencias instaladas por `package.json`.

## Estructura

```text
LaurenReposteria/
├── index.html                  # Entrada raíz con redirección a html/inicio.html
├── CNAME                       # Dominio personalizado configurado
├── html/
│   ├── inicio.html             # Página principal
│   ├── tortas.html             # Tortas personalizadas
│   ├── alfajores.html          # Alfajores
│   ├── brownies-galletas.html  # Brownies y galletas
│   ├── detalles.html           # Detalles y cajas especiales
│   ├── tabla-productos.html    # Editor visual/manual de productos
│   └── navbar-demo-*.html      # Demos internas de navegación
├── css/                        # Estilos globales, páginas, carrito, header/footer y modales
├── js/                         # Datos, carrito, modales, carruseles e interacciones
├── assets/                     # Imágenes, videos, logos y guías visuales
├── Guias/                      # Documentación histórica del proyecto
└── PROBLEMAS-PENDIENTES.md     # Estado técnico y riesgos por revisar
```

## Archivos importantes

- `js/catalog-data.js`: fuente principal de productos, precios, opciones e imágenes para modales.
- `js/quick-view-modal.js`: modal reutilizable de vista rápida.
- `js/cart-manager.js` y `js/cart-ui.js`: lógica e interfaz del carrito.
- `js/contact-fab.js`: botón flotante de contacto y menú de navegación.
- `css/tortas-styles.css`: base visual compartida por páginas de producto.
- `css/quick-view-modal.css`: estilos del modal reutilizable.
- `css/glass-nav.css`: navegación superior.

## Branding base

- Personalidad: artesanal, dulce, elegante, cercana y confiable.
- Colores principales: lila/morado suave, rosa, durazno y tonos crema/blanco.
- Uso visual: fotografías reales de productos, fondos suaves, tarjetas limpias, botones redondeados y microinteracciones discretas.
- Tono de comunicación: cálido, claro y comercial sin sonar genérico.

## Contacto visible del sitio

- WhatsApp: +57 310 444 2796
- Instagram: @laurenreposteria22
- TikTok: @laurenreposteria
- Email: reposterialauren@gmail.com
- Ubicación: Medellín, Colombia

No cambies teléfonos, redes, precios, productos, ubicación ni textos legales sin confirmación del negocio.

## Cómo modificar contenido

- Productos, precios y opciones: editar `js/catalog-data.js`.
- Textos principales de cada página: editar el archivo correspondiente en `html/`.
- Estilos generales: revisar primero `css/tortas-styles.css`, `css/glass-nav.css`, `css/luxury-footer.css` y `css/quick-view-modal.css`.
- Imágenes: agregar assets en la carpeta de producto correspondiente y verificar que la ruta coincida exactamente, incluyendo mayúsculas, espacios y acentos.

## Recomendaciones de mantenimiento

- Probar siempre en móvil, tablet y desktop antes de publicar.
- Revisar consola del navegador después de tocar JavaScript o rutas de assets.
- Evitar archivos con espacios, emojis, tildes o nombres duplicados en nuevos assets; el proyecto actual los contiene, pero los nuevos deberían seguir una convención más limpia.
- Optimizar videos pesados antes de subirlos a producción.
- Mantener `catalog-data.js` como fuente única para productos cuando sea posible.
- Conservar `PROBLEMAS-PENDIENTES.md` actualizado después de cada auditoría o cambio relevante.

## Despliegue

El proyecto está preparado para GitHub Pages y tiene dominio personalizado configurado en `CNAME`.

Antes de publicar:

```bash
git status
python3 -m http.server 5173 --bind 127.0.0.1
```

Verifica manualmente las páginas principales:

- `/html/inicio.html`
- `/html/tortas.html`
- `/html/alfajores.html`
- `/html/brownies-galletas.html`
- `/html/detalles.html`

## Estado de calidad actual

En la auditoría del 16 de mayo de 2026 se verificó:

- Páginas principales cargan sin errores de consola.
- No hay imágenes rotas visibles en las páginas principales.
- No hay desbordamiento horizontal en móvil, tablet ni desktop.
- Menú, carrito, contacto y vista rápida de producto funcionan.
- SEO básico y Open Graph están presentes en páginas principales.
- Enlaces externos relevantes usan `rel="noopener noreferrer"`.
- No se detectaron claves API, tokens o credenciales expuestas en el frontend.
- Los videos secundarios de Inicio usan carga diferida para reducir el peso inicial.
