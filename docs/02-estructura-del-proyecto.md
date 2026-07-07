# Estructura del proyecto

Sitio estático sin build: se sirve tal cual desde GitHub Pages. No hay bundler,
transpilador ni dependencias de `node_modules` en runtime. Node solo se usa para
las herramientas locales de `scripts/`.

## Árbol de carpetas

```text
LaurenReposteria/
├── index.html              # Entrada raíz: redirige a html/inicio.html
├── 404.html                # Página de error personalizada (GitHub Pages la sirve automáticamente)
├── robots.txt              # Directivas de rastreo + referencia al sitemap
├── sitemap.xml             # Mapa de las 5 páginas públicas
├── CNAME                   # Dominio personalizado (laurenreposteria.com)
│
├── html/                   # Páginas del sitio
│   ├── inicio.html            # Portada
│   ├── tortas.html            # Configurador de tortas personalizadas
│   ├── alfajores.html         # Catálogo de alfajores
│   ├── brownies-galletas.html # Catálogo de brownies y galletas
│   ├── detalles.html          # Cajas y detalles especiales
│   └── tabla-productos.html   # Editor interno del catálogo (no indexado)
│
├── css/                    # Estilos (ver docs/06-guia-de-estilos.md)
│   ├── tokens.css             # Design tokens: única fuente de color, espaciado, sombras, etc.
│   ├── glass-nav.css          # Barra de navegación superior (glassmorphism)
│   ├── header.css             # Cabecera / hero por módulo
│   ├── tortas-styles.css      # Base visual compartida por las páginas de producto
│   ├── inicio-styles.css      # Específico de la portada
│   ├── quick-view-modal.css   # Modal de vista rápida de producto
│   ├── cart.css               # Panel del carrito
│   ├── cart-button-styles.css # Botón flotante del carrito
│   ├── luxury-footer.css      # Pie de página (escritorio)
│   ├── footer-mobile.css      # Ajustes del pie en móvil
│   ├── mobile-fixes.css       # Correcciones responsive transversales
│   └── hide-modal.css         # Utilidades de visibilidad de modales
│
├── js/                     # Lógica de cliente (ver docs/04-componentes.md)
│   ├── catalog-data.js        # Fuente única de productos, precios e imágenes
│   ├── tortas-data.js         # Datos del configurador de tortas
│   ├── alfajores-data.js      # Datos de alfajores
│   ├── quick-view-modal.js    # Modal de vista rápida (sistema vigente)
│   ├── modal-handler.js       # Orquestación de apertura/cierre de modales
│   ├── product-modal-simple.js# Modal simple (legado, en revisión)
│   ├── cart-manager.js        # Estado del carrito + persistencia en localStorage
│   ├── cart-ui.js             # Interfaz del carrito
│   ├── contact-fab.js         # Botón flotante de contacto y menú
│   ├── tortas-script.js       # Interacciones de la página de tortas
│   └── performance-optimizer.js # Carga diferida de imágenes/videos
│
├── assets/
│   └── optimized/          # ÚNICO origen de media en producción (WebP + MP4)
│       └── asset-map.json     # Manifiesto generado por el pipeline de optimización
│
├── scripts/                # Herramientas locales (Node, no se despliegan en runtime)
│   ├── optimize-assets.mjs    # Genera assets/optimized desde las fuentes locales
│   ├── apply-optimized-assets.mjs # Reescribe referencias hacia assets/optimized
│   └── dev-server.mjs         # Servidor estático local con soporte de Range para video
│
├── docs/                   # Esta documentación
├── Guias/                  # Guía de mantenimiento operativa
├── README.md
└── PROBLEMAS-PENDIENTES.md # Estado técnico y riesgos abiertos
```

## Qué se despliega y qué no

Solo lo versionado en git llega a GitHub Pages. Están deliberadamente fuera del
deploy (ver `.gitignore`):

- **Fuentes de media sin optimizar** (`assets/imagenes-*`, `media-fuente/`): material
  pesado que se conserva local para regenerar `assets/optimized`.
- **Masters de video** (`*.mov` en `media-fuente/`).
- Archivos de sistema (`.DS_Store`, `._*`), zips de branding y demos locales.

En producción **todas** las referencias de imagen y video apuntan a
`assets/optimized/…`. Nunca se referencia una fuente pesada en runtime.

## Convención de rutas

- Las páginas viven en `html/`, por lo que referencian assets con `../assets/optimized/…`.
- `index.html`, `404.html`, `robots.txt` y `sitemap.xml` viven en la raíz y usan
  rutas absolutas desde la raíz del dominio (`/assets/optimized/…`).
