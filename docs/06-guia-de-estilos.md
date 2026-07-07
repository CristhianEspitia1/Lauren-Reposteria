# Guía de estilos

Fuente única de verdad: [`css/tokens.css`](../css/tokens.css). Usar siempre las
variables; no hardcodear valores.

## Color

### Marca

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-lilac` | `#c8a5d8` | Lila principal de marca |
| `--color-lilac-deep` | `#b8a4d4` | Navegación y carrito |
| `--color-lilac-dark` | `#b08bbb` | Acento oscuro / hover |
| `--color-lilac-strong` | `#9d84c4` | Fin de degradados |
| `--color-lilac-light` | `#f5ebf2` | Fondo suave lila |
| `--color-peach` | `#e8d4c8` | Durazno secundario |

### Texto

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-text` | `#4a3c52` | Texto principal (violeta profundo) |
| `--color-text-soft` | `#8b7b9a` | Texto secundario |
| `--color-ink` | `#1a1a1a` | Alto contraste (nav/carrito) |
| `--color-ink-soft` | `#666666` | Texto atenuado |

### Superficie y degradado

- `--color-white`, `--color-surface-glass`, `--color-surface-cart`
- `--color-border-glass`, `--color-border-lilac`
- `--gradient-lilac`: `linear-gradient(135deg, #b8a4d4, #9d84c4)`

> Nota: el pie de página usa un tono nude/tierra (`#E5C8BA`) propio, heredado del
> diseño original.

## Tipografía

Dos familias, cargadas desde Google Fonts en una sola petición por página:

| Token | Familia | Uso |
| --- | --- | --- |
| `--font-display` | `'Playfair Display', Georgia, serif` | Títulos y encabezados destacados |
| `--font-sans` | `'Inter', 'Helvetica Neue', Arial, sans-serif` | Texto de interfaz y cuerpo |

Pesos disponibles: Playfair 400/600/700; Inter 300/400/500/600/700. Tokens de
peso: `--weight-regular/medium/semibold/bold`.

## Espaciado

Escala base de 4px: `--space-2xs` (4) · `--space-xs` (8) · `--space-sm` (12) ·
`--space-md` (16) · `--space-lg` (24) · `--space-xl` (32) · `--space-2xl` (48) ·
`--space-3xl` (64).

## Radios

`--radius-sm` (8) · `--radius-md` (16) · `--radius-lg` (24) ·
`--radius-pill` (999) · `--radius-nav` (60).

## Sombras

`--shadow-sm` · `--shadow-md` · `--shadow-lg` · `--shadow-lilac` (sombra de marca).

## Efecto glass

`--blur-glass` (12px) para la navegación, `--blur-cart` (20px) para el carrito.

## Transiciones

`--transition-base` (0.4s ease suave) · `--transition-fast` (0.2s ease).

## Capas (z-index)

Escala nombrada para evitar valores mágicos:

```
--z-base: 1   --z-nav: 1000   --z-fab: 1100
--z-cart: 1200   --z-modal: 1300   --z-toast: 1400
```

## Breakpoints

Sistema responsive con tres cortes: **480px** (móvil pequeño), **768px**
(tablet) y **1024px** (escritorio). Enfoque predominante desktop-first con
ajustes móviles en `mobile-fixes.css`.

## Botones

- **Primario**: fondo lila (`--color-lilac`), texto blanco, radio pill, sombra
  de marca. CTA de compra: **"Pedir por WhatsApp"**.
- **Fantasma**: fondo blanco, borde lila, texto lila oscuro.
- Transición `--transition-fast`; elevación sutil en hover (respetando
  `prefers-reduced-motion`).

## Accesibilidad visual

- `prefers-reduced-motion` reduce animaciones globalmente (regla en `tokens.css`).
- Objetivos táctiles cómodos y foco visible. Ver [accesibilidad](07-accesibilidad.md).
