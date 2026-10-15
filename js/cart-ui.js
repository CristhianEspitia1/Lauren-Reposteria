/** Interfaz del pedido: edición, cantidades, recuperación y salida a WhatsApp. */
(() => {
    'use strict';
    const { escape: esc, icon, imageAttributes } = LaurenUI;
    class CartUI {
        constructor() {
            this.dialog = document.getElementById('cartDialog');
            LaurenUI.dialogEvents(this.dialog);
            this.dialog.innerHTML = `<div class="cart-layout"><header class="cart-header"><div><h2 id="cartTitle">Tu pedido</h2><p id="cartSummary"></p></div><button class="icon-button dialog-close" type="button" data-close-dialog aria-label="Cerrar pedido">${icon('close')}</button></header><div class="cart-content dialog-scroll" id="cartContent"></div><div id="cartNotice" class="cart-notice" role="status" hidden></div><footer class="cart-footer" id="cartFooter"></footer></div>`;
            document.querySelectorAll('[data-open-cart]').forEach(button => button.addEventListener('click', () => this.open()));
            cartManager.addEventListener(() => this.render());
            this.dialog.addEventListener('click', event => this.action(event));
            this.render();
        }
        open() { this.render(); LaurenUI.open(this.dialog); }
        render() {
            const items = cartManager.getItems();
            document.querySelectorAll('[data-cart-count]').forEach(counter => { counter.textContent = cartManager.getTotalItems(); });
            document.querySelectorAll('[data-open-cart]').forEach(button => button.setAttribute('aria-label', `Abrir pedido, ${cartManager.getTotalItems()} ${cartManager.getTotalItems() === 1 ? 'producto' : 'productos'}`));
            // Mismo número que el contador del encabezado, para que el pedido siempre cuadre.
            const total = cartManager.getTotalItems();
            this.dialog.querySelector('#cartSummary').textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
            const content = this.dialog.querySelector('#cartContent');
            if (!items.length) {
                content.innerHTML = `<div class="cart-empty">${icon('bag')}<h3>Algo rico te espera.</h3><p>Elige tus favoritos y reúne aquí los detalles de tu próximo momento especial.</p><button class="btn" type="button" data-explore>Explorar el catálogo ${icon('arrow')}</button></div>`;
            } else {
                content.innerHTML = items.map((item, index) => `<article class="cart-item"><img ${imageAttributes(item.image, '88px')} alt="${esc(item.name)}" width="88" height="110"><div><div class="cart-item-heading"><h3>${esc(item.name)}</h3><button class="icon-button" type="button" data-remove="${index}" aria-label="Eliminar ${esc(item.name)}">${icon('trash')}</button></div><p class="cart-item-price">${Catalog.money(item.price * item.quantity)}</p><div class="cart-item-options">${Object.entries(item.options).map(([key,value]) => `<p>${esc(key)}: ${esc(value)}</p>`).join('')}${item.personalization ? `<p class="cart-personalization">${esc(item.personalization)}</p>` : ''}${item.quantity > 1 ? `<p>${item.quantity} × ${Catalog.money(item.price)}</p>` : ''}</div><div class="cart-item-actions"><div class="quantity-control"><button class="icon-button" type="button" data-cart-quantity="${index}" data-delta="-1" aria-label="Reducir cantidad de ${esc(item.name)}" ${item.quantity <= Catalog.minimum(Catalog.get(item.id)) ? 'disabled' : ''}>${icon('minus')}</button><output aria-label="Cantidad de ${esc(item.name)}">${item.quantity}</output><button class="icon-button" type="button" data-cart-quantity="${index}" data-delta="1" aria-label="Aumentar cantidad de ${esc(item.name)}" ${item.quantity >= Catalog.maximum ? 'disabled' : ''}>${icon('plus')}</button></div><button class="cart-edit" type="button" data-edit="${index}">Editar opciones</button></div></div></article>`).join('');
            }
            if (!cartManager.persistent && items.length) content.insertAdjacentHTML('beforeend', '<p class="storage-warning">Tu navegador no permite guardar el pedido. Puedes enviarlo ahora; al cerrar esta página podría perderse.</p>');
            const footer = this.dialog.querySelector('#cartFooter');
            footer.hidden = !items.length;
            footer.innerHTML = items.length ? `<div class="cart-total"><span>Subtotal de productos</span><strong>${Catalog.money(cartManager.getTotalPrice())}</strong></div><p>${cartManager.isCustom() ? 'Precios en pesos colombianos. Por WhatsApp revisamos contigo el diseño, la fecha y la entrega antes de confirmar.' : 'Precios en pesos colombianos. Por WhatsApp te confirmamos la disponibilidad y coordinamos la entrega. Pedidos con al menos un día de anticipación.'}</p><a class="btn" href="${esc(cartManager.whatsappURL())}" target="_blank" rel="noopener noreferrer">Pedir por WhatsApp ${icon('diagonal')}</a><button class="cart-continue" type="button" data-close-dialog>Seguir eligiendo</button>` : '';
        }
        action(event) {
            const button = event.target.closest('button');
            if (!button) return;
            if (button.hasAttribute('data-explore')) {
                LaurenUI.close(this.dialog);
                const catalog = document.getElementById('catalogo') || document.getElementById('colecciones');
                if (catalog) catalog.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
                else window.location.href = 'inicio.html#colecciones';
            } else if (button.hasAttribute('data-remove')) {
                const removed = cartManager.removeItem(Number(button.dataset.remove));
                this.dialog.querySelector('[data-remove]')?.focus();
                if (removed) {
                    this.removedItem = removed;
                    const notice = this.dialog.querySelector('#cartNotice');
                    notice.innerHTML = '<span>Producto eliminado.</span><button type="button" data-undo>Deshacer</button>';
                    notice.hidden = false;
                    notice.querySelector('button').focus();
                }
            } else if (button.hasAttribute('data-undo') && this.removedItem) {
                if (cartManager.addItem(this.removedItem)) {
                    this.removedItem = null;
                    this.dialog.querySelector('#cartNotice').hidden = true;
                    this.dialog.querySelector('[data-remove]')?.focus();
                }
            } else if (button.hasAttribute('data-cart-quantity')) {
                const index = Number(button.dataset.cartQuantity);
                const delta = Number(button.dataset.delta);
                const item = cartManager.getItems()[index];
                if (item) cartManager.updateQuantity(index, item.quantity + delta);
                const next = this.dialog.querySelector(`[data-cart-quantity="${index}"][data-delta="${delta}"]:not(:disabled)`) || this.dialog.querySelector(`[data-cart-quantity="${index}"]:not(:disabled)`);
                next?.focus({ preventScroll: true });
            } else if (button.hasAttribute('data-edit')) {
                const index = Number(button.dataset.edit);
                const item = cartManager.getItems()[index];
                if (item) window.quickView.open(item.id, { ...item, editIndex: index });
            }
        }
    }
    window.cartUI = new CartUI();
})();
