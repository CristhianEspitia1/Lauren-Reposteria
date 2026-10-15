/** Carrito persistente. Los precios guardados se recalculan desde el catálogo. */
class CartManager {
    constructor(storage = window.localStorage) {
        this.cartKey = 'lauren_shopping_cart';
        this.storage = storage;
        this.listeners = [];
        this.persistent = true;
        this.cart = this.loadCart();
        window.addEventListener('storage', event => {
            if (event.key === this.cartKey || event.key === null) {
                this.cart = this.loadCart();
                this.notifyListeners('cartUpdated');
            }
        });
    }
    normalize(item) {
        if (!item || typeof item !== 'object') return null;
        const product = Catalog.get(item.id);
        if (!product || Catalog.quoteOnly(product)) return null;
        if (!Number.isInteger(item.quantity) || item.quantity < Catalog.minimum(product) || item.quantity > Catalog.maximum) return null;
        let selection = item.selection;
        let personal = item.personal;
        // Migración del formato anterior: resolver las etiquetas contra el catálogo.
        if (!selection) {
            selection = Catalog.defaults(product);
            for (const option of product.options || []) {
                const saved = item.options?.[option.label];
                if (typeof saved !== 'string') continue;
                if (option.type === 'toggle') selection[option.id] = saved === 'Sí';
                else if (option.multiple) selection[option.id] = option.choices.filter(c => saved.split(', ').includes(c.label)).map(c => c.value);
                else selection[option.id] = option.choices.find(c => c.label === saved)?.value || '';
            }
            personal = {};
            const fields = Catalog.fields(product, selection);
            if (fields.length === 1 && typeof item.personalization === 'string') personal[fields[0].id] = item.personalization;
        }
        if (!selection || typeof selection !== 'object' || Array.isArray(selection) || !personal || typeof personal !== 'object' || Array.isArray(personal)) return null;
        if (Object.values(personal).some(value => typeof value !== 'string')) return null;
        if (Catalog.validate(product, selection, personal).length) return null;
        const price = Catalog.price(product, selection);
        if (!Number.isSafeInteger(price) || price <= 0) return null;
        return {
            id: product.id, name: product.name, image: product.mainImage, price, quantity: item.quantity,
            selection: Object.fromEntries(Catalog.choices(product, selection).map(option => [option.id, selection[option.id]])),
            personal: Object.fromEntries(Catalog.fields(product, selection).map(field => [field.id, String(personal[field.id] || '').trim()])),
            options: Catalog.summary(product, selection), personalization: Catalog.personalText(product, selection, personal)
        };
    }
    loadCart() {
        try {
            const parsed = JSON.parse(this.storage.getItem(this.cartKey) || '[]');
            if (!Array.isArray(parsed)) return [];
            return parsed.slice(0, 100).map(item => this.normalize(item)).filter(Boolean);
        } catch { this.persistent = false; return []; }
    }
    saveCart() {
        try { this.storage.setItem(this.cartKey, JSON.stringify(this.cart)); this.persistent = true; }
        catch { this.persistent = false; }
        this.notifyListeners('cartUpdated');
    }
    key(item) {
        const sorted = obj => Object.entries(obj || {}).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, Array.isArray(value) ? [...value].sort() : value]);
        return JSON.stringify([item.id, sorted(item.selection), sorted(item.personal)]);
    }
    addItem(input, editIndex = null) {
        const item = this.normalize(input);
        if (!item) return false;
        if (editIndex !== null && (!Number.isInteger(editIndex) || !this.cart[editIndex])) return false;
        const duplicate = this.cart.findIndex((existing, index) => index !== editIndex && this.key(existing) === this.key(item));
        if (duplicate !== -1 && this.cart[duplicate].quantity + item.quantity > Catalog.maximum) return false;
        if (this.cart.length >= 100 && duplicate === -1 && editIndex === null) return false;
        if (duplicate !== -1) {
            this.cart[duplicate].quantity += item.quantity;
            if (editIndex !== null) this.cart.splice(editIndex, 1);
        } else if (editIndex !== null) this.cart[editIndex] = item;
        else this.cart.push(item);
        this.saveCart();
        return true;
    }
    removeItem(index) {
        if (!Number.isInteger(index) || !this.cart[index]) return;
        const [removed] = this.cart.splice(index, 1);
        this.saveCart();
        return removed;
    }
    updateQuantity(index, quantity) {
        const item = this.cart[index];
        if (!item || !Number.isInteger(quantity) || quantity < Catalog.minimum(Catalog.get(item.id)) || quantity > Catalog.maximum) return false;
        item.quantity = quantity;
        this.saveCart();
        return true;
    }
    clearCart() { this.cart = []; this.saveCart(); }
    getItems() { return JSON.parse(JSON.stringify(this.cart)); }
    getTotalItems() { return this.cart.reduce((total, item) => total + item.quantity, 0); }
    getTotalPrice() { return this.cart.reduce((total, item) => total + item.price * item.quantity, 0); }
    formatPrice(price) { return Catalog.money(price); }
    isCustom() { return this.cart.some(item => Catalog.custom(Catalog.get(item.id), item.personalization)); }
    // El cierre cambia según el pedido: uno listo solo coordina entrega; uno personalizado también el diseño.
    generateWhatsAppMessage() {
        if (!this.cart.length) return '';
        const custom = this.isCustom();
        const lines = [custom ? 'Hola, Lauren. Quiero encargar este pedido personalizado:' : 'Hola, Lauren. Quiero hacer este pedido:', ''];
        this.cart.forEach((item, index) => {
            lines.push(`*${index + 1}. ${item.name}*`);
            for (const [key, value] of Object.entries(item.options)) lines.push(`${key}: ${value}`);
            if (item.personalization) lines.push(item.personalization);
            const subtotal = this.formatPrice(item.price * item.quantity);
            lines.push(item.quantity > 1 ? `${item.quantity} × ${this.formatPrice(item.price)} = ${subtotal}` : `Valor: ${subtotal}`, '');
        });
        lines.push(`*Subtotal de productos: ${this.formatPrice(this.getTotalPrice())} COP*`, '');
        if (custom) lines.push('Para coordinar:', '- Fecha de la celebración: ', '- Domicilio o recogida: ', '', 'Si tengo una foto de referencia, te la envío por aquí. Quedo pendiente para revisar contigo el diseño y la disponibilidad.');
        else lines.push('Para coordinar la entrega:', '- Fecha: ', '- Domicilio o recogida: ', '', '¿Me confirmas la disponibilidad, por favor?');
        return encodeURIComponent(lines.join('\n'));
    }
    whatsappURL() { return this.cart.length ? `https://wa.me/573104442796?text=${this.generateWhatsAppMessage()}` : ''; }
    addEventListener(callback) { this.listeners.push(callback); }
    notifyListeners(event) { this.listeners.forEach(callback => callback(event, null, this)); }
}
try { window.cartManager = new CartManager(); }
catch { window.cartManager = new CartManager({ getItem: () => null, setItem: () => { throw new Error('Sin almacenamiento'); } }); }
