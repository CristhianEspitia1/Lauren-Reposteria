# 📚 GUÍAS DE DISEÑO - LAUREN REPOSTERÍA

Bienvenido al sistema de documentación de Lauren. Esta carpeta contiene toda la información necesaria para mantener consistencia visual y funcional en todas las páginas del sitio.

---

## 🗂️ ESTRUCTURA

```
.guias/
├── README.md                           ← Estás aquí
├── DESIGN-SYSTEM-LAUREN.md             ← Guía completa (LEER PRIMERO)
├── componentes/                        ← Componentes específicos
│   ├── botones.md                      ← Todos los tipos de botones
│   ├── modales.md                      ← Modales y popups
│   ├── carruseles.md                   ← Carruseles y galerías
│   ├── cards.md                        ← Tarjetas de productos/precios
│   ├── dropdowns.md                    ← Menús desplegables
│   ├── headers.md                      ← Navegación y header
│   ├── footers.md                      ← Footer y redes sociales
│   └── decoraciones.md                 ← Líneas, ornamentos
└── recetas/                            ← Guías paso a paso
    ├── agregar-nueva-pagina-producto.md
    ├── agregar-seccion-video-carrusel.md
    ├── agregar-modal-precios.md
    └── mantener-consistencia.md
```

---

## 🚀 INICIO RÁPIDO

### Para Crear Algo Nuevo

1. **¿Es un componente común (botón, modal, etc.)?**
   → Ve a `/componentes/[nombre].md`

2. **¿Es una tarea completa (nueva página, sección)?**
   → Ve a `/recetas/[tarea].md`

3. **¿Necesitas información general (colores, tipografía)?**
   → Lee `DESIGN-SYSTEM-LAUREN.md`

---

## 📖 CÓMO USAR ESTA DOCUMENTACIÓN

### Ejemplo 1: Necesito crear un botón
```
1. Abrir: /componentes/botones.md
2. Buscar el tipo de botón que necesitas
3. Copiar el código HTML
4. Ajustar el texto y colores si es necesario
5. ✅ Listo
```

### Ejemplo 2: Necesito agregar una nueva página de producto
```
1. Abrir: /recetas/agregar-nueva-pagina-producto.md
2. Seguir los pasos en orden
3. Verificar checklist final
4. ✅ Listo
```

### Ejemplo 3: ¿Qué color usar para brownies?
```
1. Abrir: DESIGN-SYSTEM-LAUREN.md
2. Buscar "Colores por Producto"
3. Brownies = Durazno (#F9B58C)
4. ✅ Listo
```

---

## 🎯 PRINCIPIOS DE DISEÑO LAUREN

### 1. **Consistencia Visual**
- Siempre usar las mismas transiciones (0.3s ease)
- Respetar los border-radius establecidos
- Mantener espaciado uniforme

### 2. **Colores por Producto**
- **Lila (#C8A5D8):** Tortas, Galletas, Detalles
- **Durazno (#F9B58C):** Alfajores, Brownies

### 3. **Elegancia y Suavidad**
- Evitar animaciones bruscas
- Usar cubic-bezier para transiciones especiales
- Preferir elevación (translateY) sobre otros efectos

### 4. **Responsive First**
- Breakpoint principal: 1024px
- Mobile: simplificar grids a 1 columna
- Touch-friendly: botones mínimo 44px

### 5. **Performance**
- Preferir `transform` sobre `left/top`
- Usar `will-change` en animaciones complejas
- Lazy load para imágenes/videos pesados

---

## 🔍 BÚSQUEDA RÁPIDA

### Por Tipo de Elemento

| Necesito... | Archivo | Sección |
|-------------|---------|---------|
| Botón principal | `componentes/botones.md` | "Botón Principal (CTA)" |
| Botón WhatsApp | `componentes/botones.md` | "Botón WhatsApp" |
| Modal de precios | `componentes/modales.md` | "Modal de Precios" |
| Carrusel de imágenes | `componentes/carruseles.md` | "Carrusel de Sabores" |
| Dropdown | `componentes/dropdowns.md` | "Dropdown de Contacto" |
| Header | `componentes/headers.md` | "Header Fijo" |

### Por Tarea

| Quiero... | Archivo |
|-----------|---------|
| Crear nueva página | `recetas/agregar-nueva-pagina-producto.md` |
| Agregar sección con video | `recetas/agregar-seccion-video-carrusel.md` |
| Agregar precios | `recetas/agregar-modal-precios.md` |
| Verificar consistencia | `recetas/mantener-consistencia.md` |

---

## 📏 VALORES ESTÁNDAR (Referencia Rápida)

### Transiciones
```css
/* Default */
transition: all 0.3s ease;

/* Hover suave */
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Bounce */
transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Border Radius
```css
15px  /* Pequeño */
20px  /* Medio */
25px  /* Botones pequeños */
30px  /* Cards/Modales */
50px  /* Botones principales */
50%   /* Círculos */
```

### Box Shadows
```css
/* Suave */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

/* Media */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

/* Fuerte */
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);

/* Modal */
box-shadow: 0 30px 90px rgba(0, 0, 0, 0.2);
```

### Padding
```css
0.8rem 1.8rem  /* Botones pequeños */
1rem 2.5rem    /* Botones grandes */
1.5rem         /* Cards */
3rem           /* Modales */
```

---

## ⚠️ REGLAS DE ORO

### ✅ SIEMPRE
- Usa `font-family: 'Poppins'` en botones
- Agrega `transition` a elementos interactivos
- Incluye hover effects
- Verifica responsive en 1024px
- Mantén consistencia de colores por producto

### ❌ NUNCA
- Mezclar colores de productos diferentes en una página
- Usar transiciones sin duración definida
- Crear botones sin border-radius
- Olvidar estados hover/active
- Usar píxeles fijos en lugar de rem

---

## 🆘 AYUDA

### Si algo no funciona:

1. **Verifica el archivo correspondiente en `/componentes/`**
2. **Lee la sección de "Solución de Problemas"**
3. **Compara con una página que funciona (tortas.html o alfajores.html)**
4. **Revisa la consola del navegador (F12)**

### Si necesitas algo que no está documentado:

1. **Busca en páginas existentes** (tortas, alfajores)
2. **Sigue el patrón visual** de elementos similares
3. **Documenta lo nuevo** para futuras referencias

---

## 📝 CHANGELOG

### v1.0 (2025-10-24)
- Creación inicial del sistema de documentación
- Documentación completa de componentes principales
- Recetas para tareas comunes
- Guía de colores y estilos

---

## 🎨 FILOSOFÍA DE DISEÑO

**Lauren es elegancia, suavidad y atención al detalle.**

Cada elemento debe sentirse premium, refinado y cuidadosamente diseñado. Los colores pastel (lila y durazno) transmiten dulzura y delicadeza. Las transiciones suaves y las sombras sutiles crean profundidad sin ser agresivas.

Al crear cualquier nuevo elemento, pregúntate:
- ¿Se siente premium?
- ¿Es consistente con el resto del sitio?
- ¿La transición es suave?
- ¿Los colores respetan la paleta?

Si la respuesta es sí a todas, estás en el camino correcto. ✨

---

**Última actualización:** 2025-10-24
**Versión:** 1.0
