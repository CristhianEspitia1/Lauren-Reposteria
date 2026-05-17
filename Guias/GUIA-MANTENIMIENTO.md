# 🛡️ Guía de Mantenimiento - Lauren Repostería

## ⚠️ REGLAS DE ORO PARA EL CARRUSEL INFINITO

### ❌ NUNCA HAGAS ESTO:

1. **NO agregues scroll listeners** que manipulen el DOM
   - ❌ `window.addEventListener('scroll', ...)`
   - ❌ `document.body.classList.add('is-scrolling')`

2. **NO clones elementos con JavaScript**
   - ❌ `cloneNode()` en el carrusel
   - ❌ `appendChild()` dinámico durante el scroll

3. **NO agregues propiedades GPU problemáticas** al carrusel:
   - ❌ `will-change: transform` en `.infinite-carousel-track`
   - ❌ `backface-visibility` individual en items
   - ❌ `transform: translateZ(0)` en estado inicial

4. **NO remuevas el `transition`** de `.infinite-carousel-item`
   - ✅ Debe tener: `transition: transform 0.3s ease, box-shadow 0.3s ease;`

5. **NO comentes el hover** del carrusel
   - ✅ Debe estar activo: `.infinite-carousel-item:hover { ... }`

---

## ✅ CONFIGURACIÓN CORRECTA DEL CARRUSEL

### HTML (`html/tortas.html`)
```html
<div class="infinite-carousel-track">
    <!-- 40 elementos originales -->
    <div class="infinite-carousel-item">...</div>
    <!-- ... más items ... -->

    <!-- 40 elementos duplicados manualmente -->
    <div class="infinite-carousel-item">...</div>
    <!-- ... más items ... -->
</div>
```

**Total: 80 elementos estáticos en HTML**

---

### CSS (`css/tortas-styles.css`)

#### Wrapper del carrusel:
```css
.infinite-carousel-wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: 20px;
    padding: 20px 0;
    /* Opcional: contain: layout style paint; */
}
```

#### Track del carrusel:
```css
.infinite-carousel-track {
    display: flex;
    gap: 30px;
    animation: scroll-left 600s linear infinite;
    width: max-content;
    /* SIN will-change, SIN backface-visibility */
}
```

#### Items del carrusel:
```css
.infinite-carousel-item {
    flex-shrink: 0;
    width: 280px;
    height: 280px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* ✅ CRÍTICO */
    cursor: default;
    position: relative;
}

.infinite-carousel-item:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(200, 165, 216, 0.25);
} /* ✅ DEBE ESTAR ACTIVO */
```

#### Keyframe:
```css
@keyframes scroll-left {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}
```

---

### JavaScript (`js/tortas-script.js`)

#### Scroll listener - DEBE ESTAR COMENTADO:
```javascript
// DESHABILITADO COMPLETAMENTE
/*
window.addEventListener('scroll', () => {
    // ... código comentado ...
});
*/
```

#### Clonación - DEBE ESTAR COMENTADA:
```javascript
// DESHABILITADO
/*
(function initInfiniteCarousel() {
    // ... código comentado ...
})();
*/
```

#### Error handler - DEBE EXCLUIR CARRUSEL:
```javascript
images.forEach(img => {
    // Ignorar imágenes del carrusel
    if (img.classList.contains('infinite-carousel-img')) {
        return;
    }
    // ... resto del código ...
});
```

---

## 📦 SISTEMA DE RESPALDOS

### Antes de hacer cambios importantes:

#### 1. Verificar estado actual:
```bash
cd C:\Users\crizc\OneDrive\Escritorio\LaurenReposteria
git status
```

#### 2. Crear un commit ANTES de modificar:
```bash
git add .
git commit -m "Antes de modificar el carrusel"
```

#### 3. Hacer tus cambios

#### 4. Si algo sale mal, revertir:
```bash
# Ver commits anteriores
git log --oneline

# Volver al commit anterior
git reset --hard HEAD~1

# O volver a un commit específico
git reset --hard [código-del-commit]
```

---

## 🔍 CÓMO PROBAR CAMBIOS

### Antes de considerar un cambio "correcto":

1. **Abrir DevTools (F12)**
2. **Ir a la pestaña Performance**
3. **Grabar mientras haces scroll**
4. **Verificar:**
   - ✅ No hay "Layout Shift"
   - ✅ No hay repaints masivos
   - ✅ FPS estable (60fps)

5. **Probar en diferentes navegadores:**
   - Chrome/Edge
   - Firefox
   - Safari (si es posible)

6. **Probar en diferentes resoluciones:**
   - Desktop (1920x1080)
   - Tablet (768px)
   - Mobile (375px)

---

## 🚨 SI ALGO SE ROMPE

### Opción 1: Revertir con Git
```bash
git reset --hard HEAD~1
```

### Opción 2: Copiar del respaldo
```bash
# Copiar CSS
copy C:\LaurenReposteria\css\tortas-styles.css C:\Users\crizc\OneDrive\Escritorio\LaurenReposteria\css\tortas-styles.css

# Copiar JS
copy C:\LaurenReposteria\js\tortas-script.js C:\Users\crizc\OneDrive\Escritorio\LaurenReposteria\js\tortas-script.js

# Copiar HTML
copy C:\LaurenReposteria\html\tortas.html C:\Users\crizc\OneDrive\Escritorio\LaurenReposteria\html\tortas.html
```

### Opción 3: Usar este commit como referencia
```bash
# Ver el commit funcional
git show 148eecc

# Restaurar archivos específicos de ese commit
git checkout 148eecc -- css/tortas-styles.css
git checkout 148eecc -- js/tortas-script.js
git checkout 148eecc -- html/tortas.html
```

---

## 📝 CHECKLIST ANTES DE SUBIR CAMBIOS

- [ ] El carrusel se desliza sin parpadeos
- [ ] No hay errores en la consola del navegador
- [ ] El hover funciona suavemente
- [ ] Probado en Chrome y Firefox
- [ ] Hard refresh (Ctrl+Shift+R) realizado
- [ ] Commit creado con descripción clara
- [ ] Respaldo manual creado (opcional)

---

## 🎯 ARCHIVOS CRÍTICOS A NO MODIFICAR

Estos archivos contienen la configuración funcional del carrusel:

1. `css/tortas-styles.css` (líneas 2079-2125)
2. `js/tortas-script.js` (líneas 142-455)
3. `html/tortas.html` (líneas 969-1216)

**Si necesitas modificarlos, SIEMPRE haz un commit antes.**

---

## 📞 CONTACTO DE EMERGENCIA

Si algo se rompe y no puedes solucionarlo:

1. **Restaura el respaldo:** `C:\LaurenReposteria\`
2. **Revierte con Git:** `git reset --hard 148eecc`
3. **Lee esta guía nuevamente** 📖

---

**Última actualización:** Noviembre 2025
**Versión estable:** Commit 148eecc
**Estado:** ✅ Funcionando correctamente
