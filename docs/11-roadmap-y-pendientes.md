# Roadmap y pendientes

Trabajo que aporta valor pero que, por alcance o riesgo, conviene abordar como
una fase propia con verificación visual página a página. Ordenado por relación
valor/riesgo.

## Corto plazo (bajo riesgo)

1. **Dimensiones de imagen (CLS).** Añadir `width`/`height` o `aspect-ratio` a las
   imágenes usando `assets/optimized/asset-map.json`. Mejora Core Web Vitals.
2. **Accesibilidad de teclado.** Añadir un enlace "saltar al contenido" (skip
   link) al inicio de cada página y auditar el foco visible.
3. **Imágenes Open Graph por página.** Hoy todas comparten el logo; una foto real
   por categoría mejora el aspecto al compartir en redes.
4. **Unificar formato de `<title>`.** Coexisten "Lauren Repostería | …" y
   "Lauren - …". Estandarizar a un solo patrón.

## Medio plazo (riesgo moderado, requiere verificación)

5. **Reducir `mobile-fixes.css`.** Concentra 379 `!important` como capa de
   parches responsive. Migrar sus reglas al CSS de cada componente y eliminar los
   `!important` mejora la mantenibilidad. Alto riesgo visual: hacerlo por lotes
   pequeños verificando en móvil.
6. **Consolidar fuentes de datos.** Evaluar unificar `tortas-data.js` y
   `alfajores-data.js` dentro de `catalog-data.js` como fuente única.
7. **Migrar CSS inline de las páginas** a archivos compartidos, reduciendo el
   tamaño de los `<head>` y la duplicación entre páginas.

## Largo plazo (nueva fase de desarrollo)

8. **Content-Security-Policy** y cabeceras de seguridad (requiere control del
   hosting o `<meta http-equiv>`).
9. **Re-encode de video** con AV1/HEVC o CRF más agresivo para campañas de alto
   tráfico, midiendo calidad.
10. **Sistema de componentes** (includes de servidor, plantillas o un generador
    estático ligero) para eliminar la duplicación de cabecera/pie entre páginas
    sin abandonar la simplicidad del despliegue.

## Confirmaciones pendientes con el negocio

- Validar que el número de WhatsApp (`573104442796`), Instagram
  (`laurenreposteria22`) y TikTok (`laurenreposteria`) son los oficiales
  definitivos. El sitio ya es coherente en todas las páginas; solo falta la
  confirmación formal.
- Mantener una copia externa de los originales de fotos y videos (fuentes de
  `assets/optimized`).
