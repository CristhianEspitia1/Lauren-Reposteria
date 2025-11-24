/**
 * CART UI - Interfaz de Usuario del Carrito
 * Lauren Repostería 2025
 * 
 * Maneja la renderización y eventos de la interfaz del carrito
 */

class CartUI {
    constructor(cartManager) {
        this.cart = cartManager;
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Referencias a elementos del DOM
        this.cartPanel = document.getElementById('cartPanel');
        this.cartOverlay = document.getElementById('cartOverlay');
        this.cartIcon = document.querySelector('.nav-icon');
        this.cartBadge = document.querySelector('.cart-badge');
        this.cartContent = document.querySelector('.cart-items');
        this.cartCount = document.querySelector('.cart-count');
        this.cartTotalValue = document.querySelector('.cart-total-value');
        this.checkoutBtn = document.querySelector('.cart-checkout-btn');
        this.closeBtn = document.querySelector('.cart-close-btn');

        if (!this.cartPanel) {
            console.warn('[CartUI] Panel del carrito no encontrado');
            return;
        }

        // Configurar event listeners
        this.setupEventListeners();

        // Escuchar cambios del carrito
        this.cart.addEventListener((eventType) => {
            this.updateUI();
            if (eventType === 'itemAdded') {
                this.animateBadge();
                this.showAddedNotification();
            }
        });

        // Renderizar estado inicial
        this.updateUI();

        console.log('✅ CartUI inicializado');
    }

    setupEventListeners() {
        // Abrir carrito
        if (this.cartIcon) {
            this.cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openCart();
            });
        }

        // Cerrar carrito
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeCart());
        }

        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.closeCart());
        }

        // Checkout
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }

        // Tecla ESC para cerrar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cartPanel?.classList.contains('active')) {
                this.closeCart();
            }
        });
    }

    openCart() {
        if (this.cartPanel && this.cartOverlay) {
            this.cartPanel.classList.add('active');
            this.cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCart() {
        if (this.cartPanel && this.cartOverlay) {
            this.cartPanel.classList.remove('active');
            this.cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    updateUI() {
        this.updateBadge();
        this.updateCartCount();
        this.renderItems();
        this.updateTotal();
    }

    updateBadge() {
        const count = this.cart.getTotalItems();
        if (this.cartBadge) {
            this.cartBadge.textContent = count;
            // Ocultar badge si el carrito está vacío
            this.cartBadge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    updateCartCount() {
        const count = this.cart.getTotalItems();
        if (this.cartCount) {
            this.cartCount.textContent = count === 1 ? '1 producto' : `${count} productos`;
        }
    }

    renderItems() {
        if (!this.cartContent) return;

        const items = this.cart.getItems();

        if (items.length === 0) {
            this.renderEmptyState();
            if (this.checkoutBtn) {
                this.checkoutBtn.disabled = true;
            }
            return;
        }

        if (this.checkoutBtn) {
            this.checkoutBtn.disabled = false;
        }

        this.cartContent.innerHTML = items.map((item, index) => this.renderCartItem(item, index)).join('');

        // Agregar event listeners a los botones
        this.attachItemEventListeners();
    }

    renderCartItem(item, index) {
        const optionsHTML = this.renderOptions(item.options);
        const personalizationHTML = item.personalization
            ? `<div class="cart-item-personalization">💌 "${item.personalization}"</div>`
            : '';

        return `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image || '../assets/logos/LOGOS LAUREN PNG-13.png'}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    ${optionsHTML}
                    ${personalizationHTML}
                    <div class="cart-item-price">${this.cart.formatPrice(item.price)} c/u</div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="cart-qty-btn" data-action="decrease" data-index="${index}">−</button>
                            <span class="cart-qty-value">${item.quantity}</span>
                            <button class="cart-qty-btn" data-action="increase" data-index="${index}">+</button>
                        </div>
                        <button class="cart-item-remove" data-index="${index}" title="Eliminar">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderOptions(options) {
        if (!options || Object.keys(options).length === 0) {
            return '';
        }

        const optionsText = Object.entries(options)
            .map(([key, value]) => `<span class="cart-item-option">${key}: ${value}</span>`)
            .join('');

        return `<div class="cart-item-options">${optionsText}</div>`;
    }

    renderEmptyState() {
        this.cartContent.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M16 6V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0-1 1v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1h-4zm-6-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4V5z"/>
                    </svg>
                </div>
                <p class="cart-empty-text">Tu carrito está vacío</p>
            </div>
        `;
    }

    attachItemEventListeners() {
        // Botones de cantidad
        document.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                const action = btn.dataset.action;
                const item = this.cart.getItems()[index];

                if (action === 'increase') {
                    this.cart.updateQuantity(index, item.quantity + 1);
                } else if (action === 'decrease') {
                    this.cart.updateQuantity(index, item.quantity - 1);
                }
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.cart.removeItem(index);
            });
        });
    }

    updateTotal() {
        if (this.cartTotalValue) {
            this.cartTotalValue.textContent = this.cart.formatPrice(this.cart.getTotalPrice());
        }
    }

    animateBadge() {
        if (this.cartBadge) {
            this.cartBadge.classList.add('animate');
            setTimeout(() => {
                this.cartBadge.classList.remove('animate');
            }, 600);
        }
    }

    showAddedNotification() {
        // Crear notification toast
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #25D366 0%, #20BA5A 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 600;
            animation: slideInRight 0.4s ease, slideOutRight 0.4s ease 2.6s;
        `;
        toast.textContent = '✓ Producto agregado al carrito';

        // Agregar estilos de animación
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(400px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    handleCheckout() {
        if (this.cart.getTotalItems() === 0) {
            return;
        }

        this.cart.sendToWhatsApp();
        this.closeCart();
    }
}

// Inicializar cuando el cart manager esté disponible
if (window.cartManager) {
    window.cartUI = new CartUI(window.cartManager);
} else {
    console.warn('[CartUI] CartManager no está disponible');
}
