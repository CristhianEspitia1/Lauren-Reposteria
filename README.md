# Lauren Repostería - Sitio web oficial

Sitio estático de Lauren Repostería, marca de repostería artesanal en Medellín, Colombia. El sitio presenta tortas personalizadas, alfajores, brownies, galletas y detalles especiales con una estética dulce, elegante y profesional.

Última auditoría técnica: julio de 2026 (auditoría integral). Documentación completa en [`docs/`](docs/00-indice.md).

## Cómo ejecutarlo localmente

Desde la raíz del proyecto, con Node instalado:

```bash
node scripts/dev-server.mjs 5173
```

Luego abre:

```text
http://127.0.0.1:5173/html/inicio.html
```

El servidor incluye tipos MIME correctos, soporte de *Range* para video y sirve
`404.html`, imitando el comportamiento de GitHub Pages. También se puede abrir
`html/inicio.html` directamente en el navegador, pero el servidor local es mejor
para detectar rutas rotas, errores de carga y comportamiento real de producción.

## Tecnologías

- HTML5 estático.
- CSS3 con variables visuales, responsive design, animaciones y efectos glass/luxury.
- JavaScript vanilla para carrito, modales, carruseles, menú y contacto.
- Assets optimizados locales en `assets/optimized`.
- GitHub Pages / dominio configurado con `CNAME`.

No hay framework, bundler, backend, base de datos ni dependencias instaladas por `package.json`.

## Estructura

```text
LaurenReposteria/
├── index.html                  # Entrada raíz con redirección a html/inicio.html
├── 404.html                    # Página de error personalizada (GitHub Pages)
├── robots.txt / sitemap.xml    # SEO técnico
├── CNAME                       # Dominio personalizado configurado
├── .gitattributes              # Normalización de finales de línea (LF)
├── html/
│   ├── inicio.html             # Página principal
│   ├── tortas.html             # Tortas personalizadas
│   ├── alfajores.html          # Alfajores
│   ├── brownies-galletas.html  # Brownies y galletas
│   ├── detalles.html           # Detalles y cajas especiales
│   └── tabla-productos.html    # Editor interno de productos (no indexado)
├── css/
│   ├── tokens.css              # Design tokens (única fuente de color/tipografía/espaciado)
│   └── …                       # Navegación, header/footer, carrito, modales, responsive
├── js/                         # Datos, carrito, modales, carruseles e interacciones
├── assets/optimized/           # Imágenes, videos, logos e iconos usados en producción
├── scripts/                    # Optimización de assets y servidor de desarrollo
├── docs/                       # Documentación técnica (arquitectura, estilos, etc.)
├── Guias/                      # Mantenimiento técnico vigente
└── PROBLEMAS-PENDIENTES.md     # Estado técnico y riesgos por revisar
```

## Archivos importantes

- `js/catalog-data.js`: fuente principal de productos, precios, opciones e imágenes para modales.
- `js/quick-view-modal.js`: modal reutilizable de vista rápida.
- `js/cart-manager.js` y `js/cart-ui.js`: lógica e interfaz del carrito.
- `js/contact-fab.js`: botón flotante de contacto y menú de navegación.
- `css/tokens.css`: design tokens (color, tipografía, espaciado, sombra, z-index).
- `css/tortas-styles.css`: base visual compartida por páginas de producto.
- `css/quick-view-modal.css`: estilos del modal reutilizable.
- `css/glass-nav.css`: navegación superior.
- `scripts/optimize-assets.mjs`: regenera `assets/optimized` desde fuentes locales (aplica nombres kebab-case).
- `scripts/apply-optimized-assets.mjs`: reescribe referencias hacia assets optimizados.
- `scripts/dev-server.mjs`: servidor estático local (Range de video + 404).

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
- Imágenes y videos nuevos: agregarlos como fuente local en la carpeta de producto correspondiente, ejecutar la optimización y referenciar siempre la salida de `assets/optimized`.
- Las carpetas fuente de media, zips de branding, demos y `.mov` están ignorados para que no se desplieguen en GitHub Pages.

## Recomendaciones de mantenimiento

- Probar siempre en móvil, tablet y desktop antes de publicar.
- Revisar consola del navegador después de tocar JavaScript o rutas de assets.
- Evitar archivos con espacios, emojis, tildes o nombres duplicados en nuevos assets; el proyecto actual los contiene, pero los nuevos deberían seguir una convención más limpia.
- Versionar solo assets optimizados; los originales pesados deben quedar como fuente local o en almacenamiento externo.
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

En la auditoría del 20 de mayo de 2026 se verificó:

- Páginas principales cargan sin errores de consola.
- No hay imágenes rotas visibles en las páginas principales.
- No hay desbordamiento horizontal en móvil, tablet ni desktop.
- Menú, carrito, contacto y vista rápida de producto funcionan.
- SEO básico y Open Graph están presentes en páginas principales.
- Enlaces externos relevantes usan `rel="noopener noreferrer"`.
- No se detectaron claves API, tokens o credenciales expuestas en el frontend.
- Las páginas principales usan `assets/optimized` y no referencian media fuente pesada en runtime.
- Los videos secundarios usan carga diferida para reducir el peso inicial.
