# SEO

Estado: octubre de 2026. Objetivo: que Lauren Repostería aparezca en búsquedas locales de Medellín («tortas personalizadas Medellín», «alfajores Medellín», «detalles de regalo Medellín»), que sus enlaces se vean bien al compartirse por WhatsApp e Instagram y que buscadores y asistentes de IA describan el negocio con datos correctos.

## Arquitectura de URL

| URL | Archivo | Búsqueda principal |
| --- | --- | --- |
| `/` | `index.html` | Repostería artesanal en Medellín |
| `/tortas/` | `tortas/index.html` | Tortas personalizadas en Medellín |
| `/alfajores/` | `alfajores/index.html` | Alfajores artesanales en Medellín |
| `/brownies-galletas/` | `brownies-galletas/index.html` | Brownies y galletas en Medellín |
| `/detalles/` | `detalles/index.html` | Detalles y regalos en Medellín |

- La portada ya no es una redirección a `/html/inicio.html`: el dominio raíz concentra la autoridad.
- Las direcciones anteriores (`/html/*.html`) quedan como páginas de redirección inmediata con `canonical` hacia la nueva URL. GitHub Pages no permite 301; Google interpreta `meta refresh` con 0 segundos como redirección permanente. No borrarlas mientras sigan apareciendo en Search Console.
- GitHub Pages redirige `/tortas` → `/tortas/`. Enlazar siempre con barra final.
- `_config.yml` excluye `docs/`, `Guias/`, `scripts/`, `tests/` y los Markdown internos de la publicación (Jekyll los convertiría en páginas indexables). `robots.txt` lo refuerza.

## Generadores

```bash
node scripts/seo.mjs            # metadatos, JSON-LD, sitemap.xml y llms.txt
node scripts/seo.mjs --check    # falla si algo quedó desactualizado
node scripts/social-images.mjs  # imágenes 1200 × 630 e iconos (Chrome + sips, macOS)
node --test tests/*.test.mjs    # incluye tests/seo.test.mjs
```

Ejecutar `seo.mjs` después de cambiar precios, productos, galerías, preguntas frecuentes o textos SEO. Los títulos, descripciones y textos alternativos de las imágenes sociales se editan en `PAGES` dentro de `scripts/seo.mjs`; los datos del negocio, en `BUSINESS`. El bloque entre `<!-- seo: … -->` y `<!-- /seo -->` de cada página se reescribe completo. También reescribe el importe de cada `<span data-price="…">` del cuerpo, para que las preguntas frecuentes y su JSON-LD citen el precio vigente ([formato](12-catalogo.md#precios-dentro-de-los-textos)).

## Qué genera cada página

- `<title>` único (≤ 60 caracteres) y `meta description` única (120–160) con producto + Medellín y el precio mínimo real calculado desde `catalog-data.js`.
- `canonical`, `hreflang` `es-CO` y `x-default`, `robots` con `max-image-preview:large` (imágenes grandes en Discover y Google Imágenes).
- Open Graph y Twitter con imagen JPEG 1200 × 630 propia por página (`assets/social/`). WhatsApp e Instagram no muestran de forma fiable vistas previas WebP.
- Favicon SVG + `favicon.ico` + `apple-touch-icon` + `site.webmanifest` con iconos 192/512 y maskable.
- JSON-LD (`@graph`):
  - `Bakery` (`#bakery`): nombre, logo PNG, teléfono, correo, Medellín/Antioquia, horario lunes a sábado 9:00–18:00, rango de precios calculado, redes y `hasMenu`.
  - `WebSite` y `WebPage`/`CollectionPage` + `FAQPage` con las preguntas visibles copiadas textualmente del HTML.
  - Colecciones: `BreadcrumbList` y `MenuSection` con un `MenuItem` por producto (imágenes y `Offer` en COP con precio mínimo, rango y cantidad mínima). Se usa `Menu`/`MenuItem` y no `Product` porque las directrices de Google reservan los fragmentos de producto a páginas de un solo producto.
  - Portada: `Menu` con las cuatro secciones y `VideoObject` de la historia.
- `sitemap.xml` con `lastmod` desde Git y todas las fotografías de cada página (`image:image`); se omiten `changefreq` y `priority`, que Google ignora.
- `llms.txt`: resumen del negocio y la carta con precios para asistentes de IA.

## Contenido en la página

- Un único `h1` por página que incluye la búsqueda principal en el antetítulo («Tortas personalizadas en Medellín») sin cambiar el diseño (`h1 .eyebrow`).
- Preguntas de precio en cada colección y de ubicación/horario en la portada, con importes comprobados contra el catálogo por `tests/seo.test.mjs`.
- Textos alternativos descriptivos en las fotografías estáticas; imágenes bajo el primer pantallazo con `loading="lazy"`. Las fichas de producto también se cargan en diferido.

## Comprobaciones automáticas (`tests/seo.test.mjs`)

Bloque SEO al día; longitud y unicidad de títulos y descripciones; `canonical`, `og:url`, `lang` y un solo `h1`; JSON-LD válido con negocio, migas, carta y preguntas iguales a las visibles; precios citados presentes en el catálogo; todos los `href`, `src`, `srcset`, `poster` y rutas de datos apuntan a archivos existentes; redirecciones antiguas; sitemap, robots, manifest e iconos.

Estas pruebas no sustituyen la validación externa después de publicar (ver abajo).

## Tareas externas (requieren las cuentas del negocio)

1. **Google Search Console**: verificar el dominio `laurenreposteria.com` (registro DNS TXT), enviar `https://laurenreposteria.com/sitemap.xml`, solicitar indexación de las cinco URL y revisar «Páginas» y «Mejoras» (migas de pan, vídeos). Usar «Cambio de dirección» no aplica: el dominio es el mismo.
2. **Perfil de Empresa de Google** (Google Maps): crear o reclamar «Lauren Repostería», categoría *Pastelería*/*Repostería*, área de servicio Medellín (sin dirección pública si atienden desde casa), horario lunes a sábado 9:00–18:00, teléfono, web `https://laurenreposteria.com/`, enlace de pedidos a WhatsApp, fotos reales y publicaciones periódicas. Es el factor con más peso en búsquedas locales.
3. **Reseñas**: pedir reseñas en Google a clientes satisfechos (enlace corto del perfil en el mensaje de entrega). No marcar reseñas en JSON-LD propio: Google no muestra estrellas de reseñas autoservidas para negocios locales.
4. **Bing Webmaster Tools**: importar desde Search Console; alimenta también a asistentes que usan Bing.
5. **DNS**: confirmar que `www.laurenreposteria.com` redirige al dominio raíz (registro CNAME a `<usuario>.github.io` y «Enforce HTTPS» activo en GitHub Pages).
6. **Coherencia NAP**: mismo nombre, teléfono y ciudad en Instagram, TikTok, WhatsApp Business y directorios.
7. **Validar tras publicar**: [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results), [validador de Schema.org](https://validator.schema.org/), [depurador de Facebook](https://developers.facebook.com/tools/debug/) para refrescar la vista previa, y PageSpeed Insights en móvil.

## Siguientes mejoras con mayor impacto

- Páginas propias por producto estrella (por ejemplo `/tortas/torta-vintage/`) con texto, fotos y preguntas específicas: permitirían marcado `Product` válido y posicionar búsquedas de cola larga.
- Subtítulos WebVTT y transcripción del video de la historia (ver pendientes).
- Contenido estacional (Día de la Madre, Amor y Amistad, Navidad) en las colecciones antes de cada fecha.
