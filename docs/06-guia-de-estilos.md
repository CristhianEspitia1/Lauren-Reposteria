# Guía de estilos

Fuente de identidad: brandbook de Lauren, diseñado por Trilia, de 23 páginas (no se guarda en el repositorio). Las versiones vectoriales que usa la web viven en `assets/brand/`. Fuente de tokens: [`css/tokens.css`](../css/tokens.css).

Personalidad artesanal, detallista, alegre y cercana. El símbolo oficial combina laurel, amor y delicadeza (páginas 14–15). La fotografía y la composición editorial trasladan esa identidad a la web.

## Paleta oficial

Valores RGB/HEX del manual, página 16.

| Token | HEX | RGB | CMYK | Pantone | Uso |
| --- | --- | --- | --- | --- | --- |
| `--color-cream` | `#f9f5ec` | 249 · 245 · 236 | 3 · 4 · 9 · 0 | 7604 C | Fondo principal |
| `--color-lilac` | `#d0b4d7` | 208 · 180 · 215 | 20 · 34 · 0 · 0 | 7437 C | Acento de marca |
| `--color-peach` | `#e5c8ba` | 229 · 200 · 186 | 11 · 25 · 25 · 1 | 7611 C | Apoyo cálido |
| `--color-apricot` | `#f8b890` | 248 · 184 · 144 | 0 · 36 · 45 · 0 | 1555 C | Selección de texto |

Los fondos y bordes suaves que no son tonos de interfaz se derivan de estos cuatro con `color-mix()`; no se escriben colores sueltos en las hojas de estilo.

Tonos complementarios de interfaz, definidos para superficies, estados y lectura; no son colores adicionales del brandbook:

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-white` | `#fffdf9` | Producto, controles y superficies |
| `--color-text` | `#3f3047` | Tinta: texto, logotipos y foco. Nunca como fondo |
| `--color-text-soft` | `#766a79` | Texto secundario |
| `--color-lilac-light` | `#efe6f3` | Estados seleccionados y fondos suaves |
| `--color-border` | `#ddd3dc` | Separadores |

## Tipografía

El manual (página 17) define **P22 Mackinac** como principal, **Proxima Nova** como secundaria y **Gentlemens Script** como expresiva. El archivo entregado contiene trazados, no archivos de fuente utilizables en la web.

La adaptación web actual conserva **Playfair Display**, regular e itálica, para titulares e **Inter** para lectura y controles del diseño aprobado. No son las fuentes oficiales del manual. La sustitución queda pendiente de disponer de los archivos y licencia para uso web. No declarar una fuente como instalada ni reconstruir su alfabeto a partir del PDF. Mantener una petición de fuentes por página con `display=swap`.

## Logotipos y símbolo

Los SVG de `assets/brand/` conservan los trazados del manual, sin redibujarlos ni generarlos con IA:

| Archivo | Variante y procedencia |
| --- | --- |
| `lauren-logo.svg` / `lauren-logo-light.svg` / `lauren-logo-lilac.svg` | Composición completa, página 7. Lila sobre fondos claros (cabecera) y claro sobre fondos de color (pie), como en las páginas 18, 19 y 22 |
| `lauren-sello-light.svg` | Sello circular «Bocado de alegría», página 13 |
| `lauren-isotipo.svg` | Símbolo de laurel y corazón, página 14 |

Las variantes `-light.svg` son para fondos oscuros. Se usan versiones monocromas: tinta ciruela de interfaz o crema oficial. Las cabeceras y los pies eligen el archivo adecuado sin filtros CSS. El favicon y el icono compartido `brand` reutilizan el símbolo original.

Conservar proporción, orientación y todos los elementos de cada variante; no estirar, invertir, recolorear sus partes por separado ni añadir efectos. Respetar el espacio de seguridad descrito en la página 11; en tamaños pequeños usar una variante simplificada legible, como el isotipo del favicon. Las variantes y los usos correctos están en las páginas 8–13.

## Composición

Ancho máximo de 1200 px, márgenes fluidos y secciones con altura natural. Cabecera con categorías visibles en escritorio y menú desplegable en ventanas estrechas. La portada combina un titular editorial con fotografías de producto; las colecciones priorizan elegir una creación y luego sus detalles.

Fotografías con proporciones reservadas y recortes elegidos por contexto. Las fichas y galerías usan un encuadre 4:5; la imagen ampliada conserva la toma completa y coloca las miniaturas debajo. Los sabores usan 3:2 y los rellenos, 1:1. El video horizontal conserva todo el encuadre mediante `object-fit: contain`; nunca usar un arco vertical ni zoom para ocultar partes de una entrevista.

## Controles e iconos

`js/brand-icons.js` define **Trazo Lauren**, pictogramas propios en retícula de **24 unidades**, trazo **1.5**, terminales redondos y proporciones regulares. Las acciones tienen geometría clara; los productos se reconocen por sus capas, siluetas y empaques. Evitar ondulaciones en signos funcionales y pequeños adornos que desaparezcan al reducirlos.

El registro incluye `brand`, extraído del isotipo oficial, que conserva su retícula original de 32; los controles no se presentan como dibujos del manual.

Los tamaños de interfaz suelen ser 20–24 px. Para ilustraciones de 40–64 px se usa `--icon-stroke-display: 1.2`, compartido por los complementos, pasos y estados vacíos. El área interactiva es independiente: controles de cantidad y eliminación con 44 px. Los SVG heredan `currentColor`, llevan `aria-hidden="true"` y `focusable="false"`; el control aporta su nombre accesible. Usar nombres semánticos compartidos, no emojis, icon fonts o dibujos aislados.

Los complementos usan `bow`, `butterfly`, `birthday-topper`, `pearls` y `crown`: representan el lazo, la mariposa, el letrero de cumpleaños, las perlas y la corona. `catalog-data.js` declara el nombre mediante `icon`; tanto la colección como el editor consumen ese registro. No volver a mostrar las antiguas ilustraciones raster como iconos de interfaz.

`ribbon` reutiliza el mismo lazo de `bow`. `zoom` significa ampliar una fotografía; `plus` añade productos, cantidad o más resultados. Reproducción y pausa usan formas sólidas para distinguir sus estados. Los nombres desconocidos no generan una flecha de sustitución.

El alfajor representa dos galletas redondas de borde liso y una capa central de arequipe. Mantenerlo horizontal, con contornos simples, sin relleno sólido ni bordes ondulados, usando el mismo trazo que el resto de la familia.

La acción principal usa color ciruela, flecha de dirección precisa y esquinas `4px 20px 4px 20px`. Las acciones secundarias son texto/subrayado o superficies neutras. Las opciones, campos, controles de cantidad, búsqueda, avisos y diálogos comparten paleta y foco. Las casillas opcionales usan el check y las esquinas de la marca.

## Movimiento

Cambios breves al interactuar: apertura de diálogos, desplazamiento pequeño de la flecha y transformación de las esquinas. Curva propia `--ease-ribbon`. El contenido está visible desde el inicio, sin apariciones en cascada, máscaras ni desvanecimientos al bajar. Sin scroll forzado ni reproducción automática. Respetar siempre `prefers-reduced-motion`; el contenido sigue accesible sin animación.

Los ajustes responsive viven junto a sus componentes. El menú cambia a 800 px y las composiciones se reorganizan según el contenido; no volver a crear un archivo general de parches móviles.

## Fotografía

Dirección: mesa horizontal de lino marfil, pared crema lisa, luz suave de ventana y encuadres verticales 4:5, salvo los sabores y rellenos. El producto, su decoración y su empaque son la referencia principal. [`manifest.json`](../assets/propuestas-fotograficas/manifest.json) es el inventario de las 107 fotografías publicadas.
