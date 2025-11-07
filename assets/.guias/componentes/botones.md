# 🔘 BOTONES - Lauren Design System

---

## 1️⃣ BOTÓN PRINCIPAL (CTA)

**Cuándo usar:** Acciones principales, CTAs importantes (WhatsApp, Instagram, Ver Precios)

### Versión Lila (Tortas, Galletas, Detalles)
```html
<button style="background: linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%); color: white; border: none; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1rem; font-weight: 600; cursor: pointer; box-shadow: 0 8px 20px rgba(200, 165, 216, 0.4); transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">
    Texto del Botón
</button>
```

**Hover:**
```css
transform: translateY(-3px);
box-shadow: 0 12px 30px rgba(200, 165, 216, 0.5);
```

**Active (click):**
```css
transform: translateY(-1px);
box-shadow: 0 8px 20px rgba(200, 165, 216, 0.4);
```

### Versión Durazno (Alfajores, Brownies)
```html
<button style="background: linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%); color: white; border: none; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1rem; font-weight: 600; cursor: pointer; box-shadow: 0 8px 20px rgba(249, 181, 140, 0.4); transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">
    Texto del Botón
</button>
```

**Hover:**
```css
transform: translateY(-3px);
box-shadow: 0 12px 30px rgba(249, 181, 140, 0.5);
```

---

## 2️⃣ BOTÓN MINIMALISTA (Dropdown/Toggle)

**Cuándo usar:** Botones secundarios, dropdowns, acciones no críticas

### Con Flecha
```html
<button id="miBoton" style="background: linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%); color: white; border: none; padding: 0.8rem 1.8rem; border-radius: 25px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.6rem; font-family: 'Poppins', sans-serif;">
    Elige tu Topping
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transition: transform 0.3s ease;">
        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</button>
```

**JavaScript para rotar flecha:**
```javascript
// Cuando se abre
arrow.style.transform = 'rotate(180deg)';
// Cuando se cierra
arrow.style.transform = 'rotate(0deg)';
```

### Sin Flecha
```html
<button style="background: linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%); color: white; border: none; padding: 0.8rem 1.8rem; border-radius: 25px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">
    Precios y Cantidades
</button>
```

---

## 3️⃣ BOTÓN DE PRECIOS (Integrado en secciones)

**Cuándo usar:** Dentro de galerías o cards, para abrir modal de precios

```html
<button class="pricing-btn-integrated" style="background: linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%); color: white; border: none; padding: 1rem 2rem; border-radius: 50px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 25px rgba(200, 165, 216, 0.35); font-family: 'Poppins', sans-serif;">
    Ver Precios
</button>
```

**Hover:**
```css
background: linear-gradient(135deg, #D1B5E3 0%, #C9A5D8 100%);
transform: translateY(-3px) scale(1.05);
box-shadow: 0 12px 35px rgba(200, 165, 216, 0.4);
```

**Active:**
```css
transform: translateY(-1px) scale(1.02);
```

---

## 4️⃣ BOTÓN WHATSAPP

**Cuándo usar:** Enlaces directos a WhatsApp

```html
<a href="https://wa.me/573023687321?text=Hola!%20Me%20interesa%20información%20sobre%20sus%20productos" target="_blank" rel="noopener noreferrer" class="whatsapp-btn" style="display: inline-flex; align-items: center; gap: 0.8rem; background: #25D366; color: white; text-decoration: none; padding: 1.2rem 2.5rem; border-radius: 50px; font-weight: 600; font-size: 1rem; transition: all 0.3s ease; box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3); font-family: 'Poppins', sans-serif;">
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
    Contactar por WhatsApp
</a>
```

**Hover:**
```css
background: #20BA5A;
transform: translateY(-3px);
box-shadow: 0 12px 30px rgba(37, 211, 102, 0.4);
```

---

## 5️⃣ BOTÓN INSTAGRAM

**Cuándo usar:** Enlaces a Instagram

```html
<a href="https://www.instagram.com/lauren.reposteria/" target="_blank" rel="noopener noreferrer" class="instagram-btn" style="display: inline-flex; align-items: center; gap: 0.8rem; background: linear-gradient(135deg, #E1306C, #C13584, #833AB4); color: white; text-decoration: none; padding: 1.2rem 2.5rem; border-radius: 50px; font-weight: 600; font-size: 1rem; transition: all 0.3s ease; box-shadow: 0 8px 20px rgba(193, 53, 132, 0.3); font-family: 'Poppins', sans-serif;">
    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
    Síguenos en Instagram
</a>
```

**Hover:**
```css
transform: translateY(-3px);
box-shadow: 0 12px 30px rgba(193, 53, 132, 0.4);
```

---

## 6️⃣ BOTÓN CERRAR MODAL (X)

**Cuándo usar:** Cerrar modales, popups

```html
<button class="pricing-modal-close" id="modalClose" style="position: absolute; top: 20px; right: 20px; background: rgba(200, 165, 216, 0.1); border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 2rem; color: #C8A5D8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; line-height: 1; padding: 0;">
    &times;
</button>
```

**Hover:**
```css
background: rgba(200, 165, 216, 0.2);
color: #B08BBB;
transform: rotate(90deg) scale(1.1);
```

**Active:**
```css
transform: rotate(90deg) scale(0.95);
```

---

## 7️⃣ BOTÓN CONTACTO (Dropdown Header)

**Cuándo usar:** En el header, botón que abre dropdown de contacto

```html
<button class="contact-dropdown-btn" style="background: linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%); color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 25px; font-weight: 600; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">
    Contacto
    <svg class="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="transition: transform 0.3s ease;">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
</button>
```

**Hover:**
```css
background: linear-gradient(135deg, #FAC19C 0%, #F5B18C 100%);
transform: translateY(-2px);
box-shadow: 0 8px 20px rgba(249, 181, 140, 0.3);
```

**Flecha cuando está abierto:**
```css
transform: rotate(180deg);
```

---

## 8️⃣ BOTÓN HAMBURGUESA (Mobile Menu)

**Cuándo usar:** Menú móvil en header

```html
<button class="menu-toggle-minimal" aria-label="Abrir menú de navegación" aria-expanded="false" style="background: none; border: none; cursor: pointer; display: none; flex-direction: column; gap: 5px; padding: 10px;">
    <span class="hamburger" style="width: 25px; height: 3px; background: white; border-radius: 2px; transition: all 0.3s ease;"></span>
    <span class="hamburger" style="width: 25px; height: 3px; background: white; border-radius: 2px; transition: all 0.3s ease;"></span>
    <span class="hamburger" style="width: 25px; height: 3px; background: white; border-radius: 2px; transition: all 0.3s ease;"></span>
</button>
```

**Mostrar en móvil:**
```css
@media (max-width: 768px) {
    .menu-toggle-minimal {
        display: flex;
    }
}
```

---

## 9️⃣ BOTÓN SCROLL TO TOP

**Cuándo usar:** Botón fijo para volver arriba

```html
<button class="scroll-to-top" id="scrollToTop" aria-label="Volver arriba" style="position: fixed; bottom: 30px; right: 30px; background: linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%); color: white; border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; box-shadow: 0 8px 20px rgba(200, 165, 216, 0.4); opacity: 0; visibility: hidden; transition: all 0.3s ease; z-index: 999; display: flex; align-items: center; justify-content: center;">
    ↑
</button>
```

**Mostrar cuando scroll > 300px:**
```javascript
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});
```

**Hover:**
```css
transform: translateY(-5px);
box-shadow: 0 12px 30px rgba(200, 165, 216, 0.5);
```

---

## 🎨 VARIACIONES DE COLOR

### Tabla de Gradientes por Contexto

| Contexto | Gradiente | Sombra Hover |
|----------|-----------|--------------|
| Tortas | `linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%)` | `0 12px 30px rgba(200, 165, 216, 0.5)` |
| Alfajores | `linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%)` | `0 12px 30px rgba(249, 181, 140, 0.5)` |
| Brownies | `linear-gradient(135deg, #F9B58C 0%, #F4A67C 100%)` | `0 12px 30px rgba(249, 181, 140, 0.5)` |
| Galletas | `linear-gradient(135deg, #C8A5D8 0%, #B894C8 100%)` | `0 12px 30px rgba(200, 165, 216, 0.5)` |
| WhatsApp | `#25D366` | `0 12px 30px rgba(37, 211, 102, 0.4)` |
| Instagram | `linear-gradient(135deg, #E1306C, #C13584, #833AB4)` | `0 12px 30px rgba(193, 53, 132, 0.4)` |

---

## ✅ CHECKLIST DE BOTONES

Antes de crear un botón, verifica:

- [ ] Font-family: 'Poppins', sans-serif
- [ ] Font-weight: 600
- [ ] Border: none
- [ ] Cursor: pointer
- [ ] Transition: all 0.3s ease
- [ ] Border-radius según tipo (25px o 50px)
- [ ] Box-shadow con color apropiado
- [ ] Hover con transform y shadow
- [ ] Active state si es interactivo
- [ ] Color de gradiente según producto
- [ ] Padding según tamaño (ver tabla)
