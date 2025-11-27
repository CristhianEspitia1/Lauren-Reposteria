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

---

## 🛠️ Tecnologías

- HTML5
- CSS3 (Animaciones, Flexbox, Grid)
- JavaScript (Vanilla, sin frameworks)
- Git (Control de versiones)

  ## 📞 Contacto

  - **WhatsApp**: 310 444 27 96
  - **Instagram**: @laurenreposteria22
  - **TikTok**: @laurenreposteria
  - **Email**: reposterialauren@gmail.com
  - **Ubicación**: Medellín, Colombia

  ## 📝 Información

  - ⏰ Horario: Lunes a Sábado, 9:00 AM - 6:00 PM
  - 📅 Pedidos con mínimo 1 día de anticipación
  - 🎨 Productos 100% personalizables

  ---

  © 2024 Lauren Repostería. Todos los derechos reservados.

  **Hecho con 💜 en Medellín, Colombia**
