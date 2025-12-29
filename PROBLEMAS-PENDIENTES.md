# 🔧 Problemas Pendientes - Lauren Repostería

**Última actualización:** 29 de diciembre de 2025, 05:40 AM  
**Última verificación:** 29 de diciembre de 2025 - Sistema de datos unificado  
**Estado del sitio:** ✅ Funcional - No hay errores críticos

---

## ⚠️ IMPORTANTE: Estado General

El sitio web **FUNCIONA CORRECTAMENTE** en su estado actual. Los siguientes son problemas de **mantenibilidad y optimización**, NO errores que rompan funcionalidad.

**Verificación realizada:**
- ✅ brownies-galletas.html carga sin errores
- ✅ Modal de productos se abre correctamente
- ✅ Carrito de compras funciona
- ✅ No hay errores JavaScript críticos en consola
- ✅ Sistema de datos unificado en catalog-data.js

---

## ✅ RESUELTO: Sistema de Datos Unificado

### ~~1. Sistema de Datos Mixto (Dinámico vs. Estático)~~

**Estado:** ✅ RESUELTO (29/12/2025)  
**Solución aplicada:** Todas las páginas ahora usan `catalog-data.js` como fuente única de datos.

**Cambios realizados:**
1. ✅ `tortas.html` ahora usa `catalog-data.js`
2. ✅ `alfajores.html` ahora usa `catalog-data.js`
3. ✅ `catalog-data.js` actualizado con precios correctos de tortas y alfajores
4. ⚠️ `tortas-data.js` y `alfajores-data.js` pueden eliminarse (obsoletos)

**Beneficios:**
- ✅ Un solo archivo para actualizar precios
- ✅ Datos consistentes en todo el sitio
- ✅ El editor visual (`tabla-productos.html`) funciona para todos los productos

---

## 🟡 PRIORIDAD MEDIA

### 2. Duplicación Masiva de CSS del Modal

**Estado:** ✅ Confirmado  
**Impacto:** Medio - Dificulta mantenimiento de estilos  
**Esfuerzo:** Medio

#### Descripción del Problema:
Cada página HTML tiene **800+ líneas de CSS** idéntico inline para el modal de productos.

#### Evidencia:
```
tortas.html         → Líneas 45-596   (551 líneas de CSS inline)
alfajores.html      → Líneas 38-825   (787 líneas de CSS inline)
brownies-galletas.html → Líneas 38-825 (787 líneas de CSS inline)
detalles.html       → Similar
```

#### Consecuencias:
- ❌ Cambiar un estilo del modal requiere editar 4 archivos
- ❌ Tamaño de archivos HTML inflado
- ❌ Probabilidad de inconsistencias visuales entre páginas

#### Solución Propuesta:
1. Todos los estilos ya existen en `css/quick-view-modal.css`
2. **Eliminar** los bloques `<style>` del modal en cada HTML
3. Verificar que `quick-view-modal.css` tenga todos los estilos necesarios

#### Archivos Afectados:
```
html/tortas.html           → Eliminar <style> líneas 45-596
html/alfajores.html        → Eliminar <style> líneas 38-825
html/brownies-galletas.html → Eliminar <style> líneas 38-825
html/detalles.html         → Eliminar <style> similar
css/quick-view-modal.css   → Ya existe, verificar
```

---

### 3. Editor de Productos Manual (tabla-productos.html)

**Estado:** ✅ Confirmado  
**Impacto:** Medio - Proceso propenso a errores  
**Esfuerzo:** Bajo

#### Descripción del Problema:
El editor visual de productos genera un archivo que debe **descargarse y reemplazarse manualmente**.

#### Proceso Actual:
1. Usuario abre `tabla-productos.html`
2. Edita productos/precios
3. Click en "Guardar Cambios"
4. Navegador descarga `catalog-data.js` a carpeta Descargas
5. Usuario debe **manualmente** copiar el archivo a `js/catalog-data.js`
6. Usuario debe **manualmente** hacer commit de Git

#### Consecuencias:
- ❌ Usuario puede olvidar reemplazar el archivo
- ❌ Cambios pueden perderse
- ❌ No hay rastro en Git de quién/cuándo se editó

#### Solución Propuesta:
**Opción A (Recomendada):** Editar directamente `js/catalog-data.js` con IDE
**Opción B:** Crear script que copie automáticamente el archivo descargado
**Opción C:** Eliminar `tabla-productos.html` y usar solo editor de texto

#### Archivos Afectados:
```
html/tabla-productos.html → Analizar si es necesario
README.md                 → Documentar proceso recomendado
```

---

## 🟢 PRIORIDAD BAJA

### 4. Console Logs en Producción

**Estado:** ✅ Confirmado  
**Impacto:** Muy Bajo - Solo información innecesaria  
**Esfuerzo:** Muy Bajo

#### Descripción del Problema:
Hay múltiples `console.log()` activos en producción.

#### Ejemplos Encontrados:
```javascript
// cart-ui.js línea 55
console.log('✅ CartUI inicializado');

// quick-view-modal.js línea 23
console.log('[QuickViewModal] Inicializado');

// quick-view-modal.js línea 104
console.log('[QuickViewModal] Abriendo modal para:', productData.name);

// quick-view-modal.js línea 572
console.log(`[QuickViewModal] Opción cambiada: ${optionId} = ${value}`);
```

#### Consecuencias:
- ℹ️ Consola saturada con información de debug
- ℹ️ Puede revelar estructura interna del código

#### Solución Propuesta:
1. Reemplazar `console.log()` con comentarios
2. O envolver en condicional `if (DEBUG_MODE)`

#### Archivos Afectados:
```
js/cart-ui.js
js/cart-manager.js
js/quick-view-modal.js
js/tortas-script.js
```

---

## ✅ PROBLEMAS PREVIAMENTE REPORTADOS - YA RESUELTOS

### ~~Error de Validación en Brownies/Galletas~~
**Estado:** ❌ No existe actualmente  
**Última verificación:** 29/11/2025 06:20 AM

Verificación en vivo confirmó que:
- ✅ El modal de brownies se abre correctamente
- ✅ No hay mensaje de "Por favor selecciona todas las opciones requeridas"
- ✅ Los productos se agregan al carrito sin errores

**Conclusión:** Este error estaba en conversaciones antiguas pero **ya fue resuelto**. Las opciones requeridas se auto-seleccionan correctamente (ver `quick-view-modal.js` líneas 111-118).

---

### ~~Orden de Carga de Scripts~~
**Estado:** ❌ No es un problema  
**Última verificación:** 29/11/2025 06:20 AM

Verificación en vivo confirmó que:
- ✅ Los scripts cargan en el orden correcto
- ✅ `cartManager` está disponible cuando `cartUI` lo necesita
- ✅ No hay errores de `undefined` en consola

**Conclusión:** El orden de carga actual funciona correctamente.

---

## 📊 RESUMEN EJECUTIVO

| ID | Problema | Prioridad | Estado | Impacto en Usuario Final |
|----|----------|-----------|--------|------------------------|
| 1 | Sistema de datos mixto | 🔴 Alta | Confirmado | Ninguno (interno) |
| 2 | CSS duplicado del modal | 🟡 Media | Confirmado | Ninguno (interno) |
| 3 | Editor manual de productos | 🟡 Media | Confirmado | Ninguno (interno) |
| 4 | Console logs en producción | 🟢 Baja | Confirmado | Mínimo |

**IMPORTANTE:** Ninguno de estos problemas afecta al usuario final. Todos son temas de **mantenibilidad del código**.

---

## 🎯 RECOMENDACIONES

### Para el Desarrollador:

**Acción Inmediata:**
- Ninguna. El sitio funciona correctamente.

**Mantenimiento Recomendado (orden sugerido):**
1. **Unificar sistema de datos** (Problema #1) - Facilita actualizaciones futuras
2. **Consolidar CSS del modal** (Problema #2) - Reduce tamaño de archivos
3. **Revisar flujo de edición** (Problema #3) - Simplifica actualizaciones

**No Urgente:**
- Limpiar console.logs (Problema #4) - Puede esperar

### Para Actualizaciones de Productos:

**Mientras no se unifique el sistema:**
- Para **Tortas**: Editar `js/tortas-data.js`
- Para **Alfajores**: Editar `js/alfajores-data.js`
- Para **Brownies/Galletas/Detalles**: Editar `js/catalog-data.js`

**Después de unificar:**
- Todo en `js/catalog-data.js`

---

## 📝 HISTORIAL DE VERIFICACIONES

| Fecha | Verificador | Método | Resultado |
|-------|------------|--------|-----------|
| 2025-11-29 06:20 | Antigravity AI | Inspección en vivo + código | Sitio funcional, 4 problemas de mantenibilidad |

---

## 🔗 REFERENCIAS

- [README.md](README.md) - Documentación general del proyecto
- [GUIA-MANTENIMIENTO.md](GUIA-MANTENIMIENTO.md) - Reglas del carrusel infinito
- Commits importantes:
  - `6979cf3` - Fix crítico de case-sensitivity (28/11/2025)
  - `148eecc` - Versión estable con carrusel funcionando

---

**📌 Nota Final:**

Este documento es el resultado de una **verificación REAL en vivo** del sitio web, no de suposiciones basadas en conversaciones antiguas. Todos los problemas listados han sido **confirmados mediante inspección de código y pruebas en navegador**.

Si encuentras algún error o cambio en el estado del sitio, actualiza este documento con la nueva fecha de verificación.
