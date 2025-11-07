# 🎯 ÍNDICE VISUAL - ¿QUÉ NECESITAS HACER?

**Encuentra rápidamente el archivo que necesitas según tu tarea**

---

## 🔘 NECESITO CREAR UN BOTÓN

### → Archivo: `/componentes/botones.md`

**¿Qué tipo de botón?**

| Tipo | Cuándo usar | Sección en el archivo |
|------|-------------|----------------------|
| **Principal grande** | WhatsApp, Instagram, CTAs importantes | "1. Botón Principal (CTA)" |
| **Minimalista** | Dropdowns, acciones secundarias | "2. Botón Minimalista" |
| **Ver Precios** | Abrir modal de precios | "3. Botón de Precios" |
| **WhatsApp** | Enlace directo a chat | "4. Botón WhatsApp" |
| **Instagram** | Enlace a perfil | "5. Botón Instagram" |
| **Cerrar (X)** | Cerrar modales | "6. Botón Cerrar Modal" |

---

## 🪟 NECESITO CREAR UN MODAL/POPUP

### → Archivo: `/componentes/modales.md`

**¿Qué tipo de modal?**

| Tipo | Cuándo usar | Sección |
|------|-------------|---------|
| **Lista de precios** | Mostrar precios con formato elegante | "1. Modal de Precios" |
| **Simple** | Mensajes, confirmaciones | "2. Modal Simple" |
| **Con imagen** | Galería, zoom de foto | "3. Modal con Imagen" |
| **Fullscreen** | Formularios largos | "4. Modal Fullscreen" |

---

## 🎠 NECESITO UN CARRUSEL/GALERÍA

### → Archivo: `/componentes/carruseles.md`

**¿Qué tipo de carrusel?**

| Tipo | Cuándo usar | Referencia |
|------|-------------|-----------|
| **Hero con videos** | Portada de página | Página: tortas.html |
| **Sabores/Productos** | Mostrar opciones | Página: tortas.html (sabores) |
| **Galería vintage** | Fotos de productos | Página: tortas.html (vintage) |
| **Scroll infinito** | Muchas imágenes | Página: tortas.html (carrusel infinito) |
| **Dos imágenes simples** | Producto + detalles | Página: brownies-galletas.html |

---

## 📋 NECESITO CREAR UNA TARJETA/CARD

### → Archivo: `/componentes/cards.md`

**¿Qué tipo de card?**

| Tipo | Cuándo usar |
|------|-------------|
| **Producto** | Presentar un producto |
| **Precio** | Mostrar precio + descripción |
| **Sabor** | Opción de sabor/relleno |
| **Destacada** | Con badge "Popular" |

---

## 📂 NECESITO UN DROPDOWN/MENÚ DESPLEGABLE

### → Archivo: `/componentes/dropdowns.md`

**¿Qué tipo de dropdown?**

| Tipo | Cuándo usar |
|------|-------------|
| **Contacto (header)** | WhatsApp, Instagram, TikTok |
| **Toppings** | Lista de opciones |
| **Personalizado** | Cualquier lista de opciones |

---

## 🎨 NECESITO SABER QUÉ COLOR USAR

### → Archivo: `DESIGN-SYSTEM-LAUREN.md` → Sección "Paleta de Colores"

**Regla rápida:**
- **Tortas, Galletas, Detalles:** Lila `#C8A5D8`
- **Alfajores, Brownies:** Durazno `#F9B58C`

---

## 📏 NECESITO SABER DIMENSIONES/ESPACIADO

### → Archivo: `DESIGN-SYSTEM-LAUREN.md` → Sección "Espaciado y Dimensiones"

**Valores más comunes:**
- Border radius botón: `25px` o `50px`
- Padding botón: `0.8rem 1.8rem` o `1rem 2.5rem`
- Gap entre elementos: `1rem` o `2rem`
- Shadow cards: `0 20px 60px rgba(0, 0, 0, 0.1)`

---

## 🎭 NECESITO SABER QUÉ TRANSICIÓN USAR

### → Archivo: `DESIGN-SYSTEM-LAUREN.md` → Sección "Efectos y Transiciones"

**Valores estándar:**
```css
transition: all 0.3s ease;  /* Default */
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);  /* Suave profesional */
```

---

## 📄 NECESITO CREAR UNA NUEVA PÁGINA COMPLETA

### → Archivo: `/recetas/agregar-nueva-pagina-producto.md`

**Sigue los 11 pasos:**
1. Crear estructura de archivos
2. Personalizar header
3. Configurar hero
4. Sección introducción
5. Definir color
6. Agregar galería
7. Agregar precios
8. Footer
9. JavaScript
10. Personalizar colores
11. Agregar a navegación

---

## ➕ NECESITO AGREGAR UNA SECCIÓN A UNA PÁGINA EXISTENTE

### Secciones comunes:

| Quiero agregar... | Ver ejemplo en... |
|-------------------|-------------------|
| **Video + Carrusel lado a lado** | `brownies-galletas.html` (sección brownies) |
| **Galería vintage** | `tortas.html` (galería vintage) |
| **Lista de sabores** | `tortas.html` (bizcochos y rellenos) |
| **Grid de productos** | `brownies-galletas.html` (brownies \| galletas) |
| **Carrusel infinito** | `tortas.html` (carrusel infinito) |

---

## 🎨 NECESITO UN HEADER/NAVEGACIÓN

### → Archivo: `/componentes/headers.md`

**El header es idéntico en todas las páginas**
Solo cambia el `class="active"` según la página actual.

---

## 👣 NECESITO UN FOOTER

### → Archivo: `/componentes/footers.md`

**El footer es idéntico en todas las páginas**
Copia de cualquier página existente.

---

## ✅ NECESITO VERIFICAR QUE TODO ESTÁ BIEN

### → Archivo: `/recetas/mantener-consistencia.md`

**Checklist de:**
- Colores correctos
- Transiciones suaves
- Responsive funcionando
- Links actualizados
- Sin errores de consola

---

## 🆘 NO SÉ QUÉ ARCHIVO NECESITO

### → Empieza aquí: `README.md`

Luego:
1. **Para entender todo el sistema:** `DESIGN-SYSTEM-LAUREN.md`
2. **Para componentes específicos:** `/componentes/[nombre].md`
3. **Para tareas completas:** `/recetas/[tarea].md`

---

## 🎯 FLUJO DE TRABAJO RECOMENDADO

### Para Crear Algo Nuevo:

```
1. ¿Qué necesito? (botón, modal, página, etc.)
   ↓
2. Buscar en este ÍNDICE-VISUAL.md
   ↓
3. Ir al archivo correspondiente
   ↓
4. Copiar el código base
   ↓
5. Personalizar (texto, colores, imágenes)
   ↓
6. Verificar con checklist
   ↓
7. ✅ ¡Listo!
```

---

## 📊 ARCHIVOS POR FRECUENCIA DE USO

### Muy Frecuentes (usar casi siempre)
1. `botones.md` - Para cualquier botón
2. `DESIGN-SYSTEM-LAUREN.md` - Colores y valores
3. `modales.md` - Para precios y popups

### Frecuentes (usar seguido)
4. `carruseles.md` - Para galerías
5. `cards.md` - Para productos/precios
6. `agregar-nueva-pagina-producto.md` - Nuevas páginas

### Ocasionales (consultar cuando sea necesario)
7. `dropdowns.md`
8. `headers.md`
9. `footers.md`
10. `decoraciones.md`

---

## 💡 TIPS RÁPIDOS

### Tip 1: Copia de Páginas Existentes
- **Tortas:** Página más completa, tiene todo
- **Alfajores:** Colores durazno, estructura simple
- **Brownies-galletas:** Grid 2 columnas, dropdowns

### Tip 2: No Reinventes la Rueda
Si algo ya existe en otra página, cópialo y personalízalo.

### Tip 3: Verifica en Múltiples Páginas
Antes de crear algo nuevo, revisa si ya existe en:
1. tortas.html
2. alfajores.html
3. brownies-galletas.html

### Tip 4: Usa Buscar/Reemplazar
Para cambiar colores en bloque:
- Buscar: `#C8A5D8`
- Reemplazar: `#F9B58C`

---

## 🎨 DECISION TREE: ¿QUÉ COLOR USAR?

```
¿Es una página de Tortas, Galletas o Detalles?
    SÍ → Lila (#C8A5D8)
    NO ↓

¿Es una página de Alfajores o Brownies?
    SÍ → Durazno (#F9B58C)
    NO ↓

¿Es un producto dulce nuevo?
    → Elige: Lila o Durazno (lo que no tengas mucho)
```

---

**Última actualización:** 2025-10-24

**¿Aún tienes dudas?**
1. Lee `README.md`
2. Revisa `DESIGN-SYSTEM-LAUREN.md`
3. Compara con páginas existentes
