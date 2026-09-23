# Resultados de la entrega

22 de septiembre de 2026, hora de Bogotá (23 de septiembre UTC).

**Estado: demo implementada y publicada.**

- Pública: <https://cristhianespitia1.github.io/Lauren-Alfajores-Demo/>.
- Local: <http://127.0.0.1:5180/>.
- Repositorio de hosting: <https://github.com/CristhianEspitia1/Lauren-Alfajores-Demo>.
- Versión verificada: `c3471fc77c88d2155c974da2276a5115be4d7a5b`.
- GitHub Pages: `built`, HTTPS activo, sin dominio personalizado.

## Fuente utilizada

Los ocho archivos de `reference/editable/` coinciden con el ZIP recuperado de
Descargas. CSS e imágenes de la implementación conservan los mismos bytes.
El HTML mantiene el contenido aprobado; se añadieron la meta `noindex` y la
carga de configuración. JavaScript cambia únicamente la validación de IDs
inválidos y la recuperación del foco después de modificar cantidades.

No se recibió `Lauren_Codex_Kit`. No se pudo leer su HTML autónomo, checklist,
auditoría, capturas ni manifiesto. La referencia de esta comparación es el
editable confirmado por el encargo, no una reconstrucción del diseño.
La lista exacta de archivos faltantes está en `../reference/provenance.json`.

## Pruebas ejecutadas

| Área | Método y resultado |
| --- | --- |
| Precios y catálogo | 12 pruebas Node aprobadas. Incluyen cuatro sabores, 28.000 por caja, dos cajas + Arequipe = 62.500 COP y nueve alfajores |
| Caja de 4 | Navegador local y URL pública: un sabor de cada uno, agregar, duplicar y sumar un Arequipe |
| Cajas de 6 y 12 | Navegador móvil local: repeticiones de pistacho, 45.000 y 90.000 COP; añadir y vaciar |
| Capacidad y edición | Navegador: incompleta deshabilitada, exceso bloqueado, cambio a tamaño menor con aviso sin borrar contenido, retirar posición, restar por sabor y vaciar |
| Selección | Navegador: añadir, cambiar cantidad, vaciar, estado vacío, recarga y restauración del ejemplo de nueve alfajores |
| Límites de 99/50 | Pruebas Node sobre las funciones reales de la aplicación con DOM simulado; no se recorrieron manualmente 99 clics o 50 líneas |
| Almacenamiento | Pruebas Node: JSON corrupto, valores/tipos/IDs inválidos y acceso que lanza excepción. Recalcula desde el catálogo, no desde precios almacenados |
| Fichas | Navegador: abrir los cuatro sabores, comprobar receta conceptual, añadir y cerrar con Escape |
| Teclado | Navegador: foco devuelto al botón de cada ficha; al completar la caja pasa al control de restar; Escape y botones de cierre funcionan |
| Copia | Pruebas Node: API, alternativa con `execCommand` y selección del texto para Ctrl+C/⌘C. En navegador público/local, el botón devuelve aviso de éxito; el pegado del sistema queda pendiente (ver límites) |
| Descarga | Archivos recibidos realmente en Descargas desde localhost y HTTPS. Ambos comparados íntegramente con el resumen de 62.500 COP; copias en `mi-seleccion-lauren.txt` y `live-download.txt` |
| Menú móvil y FAQ | Abrir, navegar, cerrar menú; expandir y contraer FAQ. Comprobado localmente y en la URL pública |
| Responsive | 360, 390, 430, 768, 1024 y 1440 px: sin desbordamiento horizontal; geometría y estilos calculados idénticos entre editable e implementación |
| Fuentes | Outfit, DM Sans y Fraunces: `document.fonts.status=loaded` y comprobaciones de carga positivas, local y publicado |
| Imágenes y anclas | Cuatro WebP originales, imágenes renderizadas cargadas y ninguna ancla interna rota en la página pública |
| Movimiento reducido | Regla `prefers-reduced-motion: reduce` presente en la hoja cargada. No se cambió la preferencia del sistema |
| Consola | Sin errores propios de la aplicación observados. Chrome emitió avisos de una extensión ajena, registrados en `live-console.json` |
| HTTP público | Nueve recursos 200, hashes idénticos a la entrega; referencias, pruebas, evidencia, README y CNAME ausentes en el hosting (404) |
| Sitio principal | 475 archivos previos intactos; HEAD y diff previos idénticos. Portada local 200 y abierta en navegador. Su dominio público ya fallaba por DNS antes de la tarea y sigue igual |

La prueba de IDs inválidos falló inicialmente en el código original (aceptaba
cuatro entradas inválidas); pasó después de la corrección. El navegador también
mostró pérdida de foco al completar la caja; la versión publicada conserva el foco.

Los servidores locales de la referencia y del campo auxiliar de portapapeles
registraron peticiones automáticas a `/favicon.ico` con 404: esos archivos no
existen en el material original ni en la utilidad. No fallaron sus recursos de
catálogo. En la publicación, los nueve recursos de la entrega devolvieron 200.

## Comparación visual

Vistas principales: **1440 × 1000** y **390 × 844**, con las fuentes cargadas,
datos equivalentes y mismo scroll. Diez pares de capturas reales en Chrome:
portada, sabores, cajas, armador y selección, en cada tamaño.

Ocho pares son idénticos píxel por píxel. La portada de escritorio tiene 398
píxeles distintos (diferencia máxima 6/255 por canal) y la selección de escritorio
31 (máxima 1/255). Se inspeccionaron: son variaciones puntuales de rasterizado,
sin diferencias de composición ni geometría. No se aplicaron tolerancias para
ocultar cambios. Los números exactos quedan en `pixel-comparison.json`.

Las primeras capturas largas del navegador integrado produjeron uniones y
escalados incorrectos. Se descartaron y se reemplazaron por capturas de ventana
en Chrome. No se usa aquella comparación de imágenes largas como evidencia.
Las dimensiones de los PNG son las devueltas por la herramienta; las medidas de
viewport se verificaron por separado en el navegador.

| Vista | Original conservado | Demo pública |
| --- | --- | --- |
| Portada escritorio | [Original](original-desktop.png) | [Publicada](public-desktop.png) |
| Sabores escritorio | [Original](original-desktop-flavors.png) | [Publicada](public-desktop-flavors.png) |
| Cajas escritorio | [Original](original-desktop-boxes.png) | [Publicada](public-desktop-boxes.png) |
| Armador escritorio | [Original](original-desktop-builder.png) | [Publicada](public-desktop-builder.png) |
| Selección escritorio | [Original](original-desktop-cart.png) | [Publicada](public-desktop-cart.png) |
| Portada móvil | [Original](original-mobile.png) | [Publicada](public-mobile.png) |
| Sabores móvil | [Original](original-mobile-flavors.png) | [Publicada](public-mobile-flavors.png) |
| Cajas móvil | [Original](original-mobile-boxes.png) | [Publicada](public-mobile-boxes.png) |
| Armador móvil | [Original](original-mobile-builder.png) | [Publicada](public-mobile-builder.png) |
| Selección móvil | [Original](original-mobile-cart.png) | [Publicada](public-mobile-cart.png) |

## Comandos utilizados

Desde `_sites/lauren-alfajores/`:

```bash
node scripts/serve.mjs 5180
node --test tests/demo.test.mjs
node scripts/verify.mjs
node scripts/deploy.mjs --init
node scripts/deploy.mjs
node scripts/check-live.mjs
python3 scripts/compare-captures.py
gh api repos/CristhianEspitia1/Lauren-Alfajores-Demo/pages/builds/latest
```

El script de despliegue invocó el empaquetado sin compilación. Las interacciones
de navegador se ejecutaron con las herramientas de control de Codex; no son una
suite Playwright instalada en el proyecto. Los resultados se guardan en
`browser-checks.json`, `live-browser-checks.json`, `responsive-comparison.json`
y `dialog-comparison.json`. La prueba de comparación de PNG requiere Python y Pillow.

## Límites y pendientes concretos

1. Recibir el kit para contrastar además el HTML autónomo y su checklist original.
2. Verificar el pegado real del portapapeles cuando el Mac esté desbloqueado.
   La API de copia devuelve éxito, pero el portapapeles virtual de la herramienta
   aparece vacío. El control nativo pidió desbloquear el equipo. No se declara
   probado el pegado del sistema. La alternativa bloqueada sí fue simulada en Node.
   Para repetirlo: servir `tests/clipboard.html` localmente, copiar un resumen de
   la demo, pegarlo con ⌘V en su campo y comparar el texto completo.
3. La vista principal pública no pudo verificarse operativa porque
   `laurenreposteria.com` no resuelve por DNS desde este entorno. Fallaba antes
   y no se modificó. Su versión local funciona y los archivos permanecen intactos.
4. No se probaron dispositivos físicos, Safari/Firefox ni la preferencia de
   movimiento reducido del sistema. La revisión corresponde a Chromium y Chrome.

La demo sigue sin pagos, pedidos enviados ni datos comerciales confirmados.
No hubo compras, cambios DNS ni publicación de los cambios del sitio principal.
