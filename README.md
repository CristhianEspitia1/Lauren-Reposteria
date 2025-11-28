# 🎂 Lauren Repostería - Sitio Web Oficial

![Lauren Repostería](assets/logos/LOGOS%20LAUREN%20PNG-55.png)

**Bocado de Alegría desde 2022**

Sitio web oficial de Lauren Repostería - Repostería artesanal en Medellín, Colombia.

---

## 🚀 INICIO RÁPIDO

### Abrir el sitio localmente:
1. Navega a: `C:\Users\crizc\OneDrive\Escritorio\LaurenReposteria\html\`
2. Abre `tortas.html` en tu navegador

---

## 📁 Estructura del Proyecto

```
LaurenReposteria/
├── html/                    # Páginas HTML
│   ├── tortas.html         # ⭐ Página principal de tortas
│   ├── alfajores.html
│   ├── brownies-galletas.html
│   └── detalles.html
├── css/                     # Hojas de estilo
│   ├── tortas-styles.css   # ⭐ Estilos principales
│   ├── header.css
│   ├── mobile-fixes.css
│   └── ...
├── js/                      # Scripts JavaScript
│   ├── tortas-script.js    # ⭐ Script principal
│   ├── tortas-data.js
│   ├── scroll-to-top.js
│   └── ...
├── assets/                  # Recursos multimedia
│   ├── imagenes-tortas/
│   ├── logos/
│   └── ...
├── backups/                 # Respaldos automáticos
├── GUIA-MANTENIMIENTO.md   # 📖 Guía de mantenimiento
├── crear-respaldo.bat      # 💾 Crear respaldo antes de cambios
└── restaurar-respaldo.bat  # ↩️ Restaurar si algo falla
```

---

## ⚠️ ANTES DE HACER CAMBIOS

### Opción 1: Usar Git (Recomendado)
```bash
cd C:\Users\crizc\OneDrive\Escritorio\LaurenReposteria
git add .
git commit -m "Descripción de lo que vas a cambiar"
```

### Opción 2: Usar script de respaldo
1. Doble click en `crear-respaldo.bat`
2. Espera a que termine
3. Haz tus cambios

---

## 🆘 SI ALGO SE ROMPE

### Método 1: Restaurar con script
1. Doble click en `restaurar-respaldo.bat`
2. Confirma la restauración
3. Abre el navegador y presiona **Ctrl+Shift+R**

### Método 2: Revertir con Git
```bash
# Ver historial de cambios
git log --oneline

# Volver al commit anterior
git reset --hard HEAD~1

# O volver a la versión estable
git reset --hard 148eecc
```

### Método 3: Copiar del respaldo principal
Los archivos originales funcionales están en:
```
C:\LaurenReposteria\
```

---

## 📖 DOCUMENTACIÓN IMPORTANTE

- **[GUIA-MANTENIMIENTO.md](GUIA-MANTENIMIENTO.md)** - Reglas para el carrusel infinito
- **Commits importantes:**
  - `148eecc` - Versión estable con carrusel funcionando
  - `cc1984a` - Guía de mantenimiento agregada
  - `0d68b04` - Scripts de respaldo agregados

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### Productos:
- 🎂 Tortas personalizadas
- 🍪 Alfajores artesanales
- 🍫 Brownies
- 🍪 Galletas decoradas
- 🎁 Detalles especiales

### Quick View Modal 🆕
- ✅ Vista rápida de productos sin recargar la página
- ✅ Selección dinámica de opciones y precios
- ✅ Integración con carrito de compras
- ✅ Disponible en Alfajores, Brownies y Galletas

### Carruseles Automáticos 🆕
- ✅ Rotación automática de imágenes en Brownies y Galletas
- ✅ Pausa inteligente al pasar el mouse (hover)
- ✅ Navegación manual con indicadores (dots)
- ✅ Transiciones suaves

### Carrusel Infinito (Tortas)
- ✅ 80 elementos HTML estáticos (40 + 40 duplicados)
- ✅ Animación CSS pura sin JavaScript
- ✅ Sin parpadeo durante el scroll
- ✅ Hover effects suaves
- ✅ Compatible con todos los navegadores

### Optimizaciones y Correcciones
- ✅ Restauración crítica de scripts en `alfajores.html`
- ✅ Integración robusta de `catalog-data.js` y `quick-view-modal.js`
- ✅ Scroll listener deshabilitado donde no es necesario
- ✅ CSS optimizado con transitions
- ✅ Error handlers mejorados
- ✅ **Fix crítico de case-sensitivity** para imágenes en servidores Linux (GitHub Pages)

---

## 🌐 DESPLIEGUE Y PRODUCCIÓN

### Sitio Web en Vivo
**URL:** https://CristhianEspitia1.github.io/Lauren-Reposteria/

### Actualizar el Sitio Web
```bash
# 1. Hacer cambios locales y probar
# 2. Guardar con Git
git add .
git commit -m "Descripción del cambio"

# 3. Subir a GitHub (el sitio se actualiza automáticamente en 2-3 minutos)
git push origin main
```

### Verificar Despliegue
- Ve a: https://github.com/CristhianEspitia1/Lauren-Reposteria/actions
- Espera a ver el ✅ verde
- Recarga tu sitio con `Ctrl + Shift + R`

---

## ⚠️ IMPORTANTE: Case-Sensitivity en Nombres de Archivo

**CRÍTICO:** GitHub Pages usa servidores Linux que **SÍ distinguen mayúsculas/minúsculas**.

### ❌ Problema Común:
```
Windows:   "Imagen.jpg" = "imagen.jpg"  (son el mismo)
Linux:     "Imagen.jpg" ≠ "imagen.jpg"  (son diferentes!)
```

### ✅ Solución:
1. **Usa siempre minúsculas** en nombres de archivo
2. **Reemplaza espacios con guiones**: `mi-imagen.jpg`
3. **Sé consistente** entre HTML y archivo

### Cómo Renombrar Correctamente:
```bash
# Si Windows no detecta el cambio de mayúsculas:
git rm --cached "assets/imagen/Foto.jpg"
git add "assets/imagen/foto.jpg"
git commit -m "Fix: Rename file for case-sensitivity"
git push origin main
```

---

## 🛠️ Tecnologías

- HTML5
- CSS3 (Animaciones, Flexbox, Grid)
- JavaScript (Vanilla, sin frameworks)
- Git & GitHub (Control de versiones y despliegue)
- GitHub Pages (Hosting)

---

## 📊 ESTADÍSTICAS DEL PROYECTO

- **Páginas HTML**: 5 páginas completas
- **Productos**: 50+ productos con imágenes y precios
- **Scripts JS**: 10+ módulos organizados  
- **Archivos CSS**: 8 hojas de estilo optimizadas
- **Commits**: 100+ commits documentados
- **Estado**: ✅ En producción y funcionando

---

## 📞 CONTACTO

**Lauren Repostería**  
📍 Medellín, Colombia

- 📱 **WhatsApp**: [+57 310 444 2796](https://wa.me/573104442796)
- 📸 **Instagram**: [@laurenreposteria22](https://instagram.com/laurenreposteria22)
- 🎵 **TikTok**: @laurenreposteria
- 📧 **Email**: reposterialauren@gmail.com

### 📝 Información de Servicio

- ⏰ **Horario**: Lunes a Sábado, 9:00 AM - 6:00 PM
- 📅 **Pedidos**: Mínimo 1 día de anticipación
- 🎨 **Personalización**: 100% productos personalizables
- 🚚 **Entregas**: Disponibles en Medellín

---

## 📌 NOTAS IMPORTANTES

### Commits Clave:
- `6979cf3` - ✅ **Fix crítico de case-sensitivity** (28/11/2025)
- `bcbbdb5` - Restauración completa de detalles.html con grid de productos
- `148eecc` - Versión estable con carrusel funcionando
- `cc1984a` - Guía de mantenimiento agregada

### Para Desarrolladores:
- Siempre probar localmente antes de hacer push
- Usar `Ctrl + Shift + R` para hard refresh
- Revisar la consola del navegador para errores
- Verificar el estado de despliegue en GitHub Actions

---

**© 2025 Lauren Repostería**. Todos los derechos reservados.

**Hecho con 💜 en Medellín, Colombia**

*Última actualización: 28 de noviembre de 2025*
