/**
 * CART MANAGER - Sistema de Gestión del Carrito
 * Lauren Repostería 2025
 * 
 * Gestiona el estado del carrito de compras con persistencia en localStorage
 */

class CartManager {
    constructor() {
        this.cartKey = 'lauren_shopping_cart';
        this.cart = this.loadCart();
        this.listeners = [];
        this.whatsappNumber = '573104442796';
    }

    /**
     * Carga el carrito desde localStorage
     */
    loadCart() {
        try {
            const saved = localStorage.getItem(this.cartKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('[Cart] Error al cargar carrito:', error);
            return [];
        }
    }

    /**
     * Guarda el carrito en localStorage
     */
    saveCart() {
        try {
            localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
            this.notifyListeners('cartUpdated');
        } catch (error) {
            console.error('[Cart] Error al guardar carrito:', error);
        }
    }

    /**
     * Agrega un producto al carrito
     * @param {Object} product - Objeto del producto
     * @returns {boolean} - true si se agregó correctamente
     */
    addItem(product) {
        try {
            // Validar que el producto tenga los campos necesarios
            if (!product.id || !product.name || !product.price) {
                console.error('[Cart] Producto inválido:', product);
                return false;
            }

            // Buscar si ya existe un producto idéntico (mismo id y opciones)
            const existingIndex = this.findDuplicateItem(product);

            if (existingIndex !== -1) {
                // Si existe, incrementar cantidad
                this.cart[existingIndex].quantity += 1;
            } else {
                // Si no existe, agregar nuevo item
                const cartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image || '',
                    options: product.options || {},
                    personalization: product.personalization || '',
                    addedAt: Date.now()
                };
                this.cart.push(cartItem);
            }

            this.saveCart();
            this.notifyListeners('itemAdded', product);
            return true;
        } catch (error) {
            console.error('[Cart] Error al agregar producto:', error);
            return false;
        }
    }

    /**
     * Busca un item duplicado en el carrito
     * @param {Object} product - Producto a buscar
     * @returns {number} - Índice del item o -1 si no existe
     */
    findDuplicateItem(product) {
        return this.cart.findIndex(item => {
            // Comparar ID
            if (item.id !== product.id) return false;

            // Comparar opciones (si existen)
            const itemOptions = JSON.stringify(item.options || {});
            const productOptions = JSON.stringify(product.options || {});
            if (itemOptions !== productOptions) return false;

            // Comparar personalización
            if (item.personalization !== (product.personalization || '')) return false;

            return true;
        });
    }

    /**
     * Elimina un item del carrito
     * @param {number} index - Índice del item a eliminar
     */
    removeItem(index) {
        if (index >= 0 && index < this.cart.length) {
            const removed = this.cart.splice(index, 1)[0];
            this.saveCart();
            this.notifyListeners('itemRemoved', removed);
        }
    }

    /**
     * Actualiza la cantidad de un item
     * @param {number} index - Índice del item
     * @param {number} quantity - Nueva cantidad
     */
    updateQuantity(index, quantity) {
        if (index >= 0 && index < this.cart.length) {
            const newQty = Math.max(0, parseInt(quantity) || 0);

            if (newQty === 0) {
                this.removeItem(index);
            } else {
                this.cart[index].quantity = newQty;
                this.saveCart();
            }
        }
    }

    /**
     * Vacía el carrito
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.notifyListeners('cartCleared');
    }

    /**
     * Obtiene todos los items del carrito
     */
    getItems() {
        return [...this.cart];
    }

    /**
     * Obtiene el número total de items
     */
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Calcula el precio total del carrito
     */
    getTotalPrice() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Formatea un precio a formato colombiano
     */
    formatPrice(price) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    /**
     * Genera el mensaje para WhatsApp
     */
    generateWhatsAppMessage() {
        if (this.cart.length === 0) {
            return '';
        }

        let message = '🛍️ *PEDIDO DESDE LA WEB - LAUREN REPOSTERÍA*\n\n';
        message += '📋 *Detalle del Pedido:*\n\n';

        this.cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`;
            message += `   Cantidad: ${item.quantity}\n`;
            message += `   Precio c/u: ${this.formatPrice(item.price)}\n`;

            // Agregar opciones si existen
            if (item.options && Object.keys(item.options).length > 0) {
                message += '   Opciones:\n';
                for (const [key, value] of Object.entries(item.options)) {
                    message += `   • ${key}: ${value}\n`;
                }
            }

            // Agregar personalización si existe
            if (item.personalization) {
                message += `   💌 Personalización: "${item.personalization}"\n`;
            }

            message += `   Subtotal: ${this.formatPrice(item.price * item.quantity)}\n\n`;
        });

        message += '━━━━━━━━━━━━━━━━\n';
        message += `💰 *TOTAL: ${this.formatPrice(this.getTotalPrice())}*\n\n`;
        message += '✨ ¡Gracias por tu pedido!';

        return encodeURIComponent(message);
    }

    /**
     * Abre WhatsApp con el mensaje del pedido
     */
    sendToWhatsApp() {
        const message = this.generateWhatsAppMessage();
        if (message) {
            const url = `https://wa.me/${this.whatsappNumber}?text=${message}`;
            window.open(url, '_blank');
        }
    }

    /**
     * Registra un listener para eventos del carrito
     */
    addEventListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notifica a todos los listeners
     */
    notifyListeners(eventType, data) {
        this.listeners.forEach(callback => {
            try {
                callback(eventType, data, this);
            } catch (error) {
                console.error('[Cart] Error en listener:', error);
            }
        });
    }

    /**
     * Obtiene información resumida del carrito
     */
    getCartSummary() {
        return {
            itemCount: this.getTotalItems(),
            total: this.getTotalPrice(),
            totalFormatted: this.formatPrice(this.getTotalPrice()),
            isEmpty: this.cart.length === 0
        };
    }
}

// Crear instancia global del carrito
window.cartManager = new CartManager();

