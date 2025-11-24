const fs = require('fs');
const path = require('path');

const files = [
    'html/tortas.html',
    'html/alfajores.html',
    'html/brownies-galletas.html',
    'html/detalles.html',
    'html/inicio.html'
];

const cartPanelHTML = `
    <!-- Overlay oscuro del carrito -->
    <div class="cart-overlay" id="cartOverlay"></div>

    <!-- Panel lateral del carrito -->
    <div class="cart-panel" id="cartPanel">
        <div class="cart-header">
            <div class="cart-title-wrapper">
                <div class="cart-icon-bg">
                    <svg viewBox="0 0 24 24"><path d="M16 6V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0-1 1v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1h-4zm-6-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4V5z"/></svg>
                </div>
                <div>
                    <h2 class="cart-title">Mi Carrito</h2>
                    <p class="cart-count">0 productos</p>
                </div>
            </div>
            <button class="cart-close-btn">
                <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
        </div>
        <div class="cart-content">
            <div class="cart-items"></div>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span class="cart-total-label">Total:</span>
                <span class="cart-total-value">$0</span>
            </div>
            <button class="cart-checkout-btn">
                <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/></svg>
                Enviar Pedido por WhatsApp
            </button>
        </div>
    </div>
`;

const cartScripts = `    <!-- Scripts del carrito -->
    <script src="../js/cart-manager.js"></script>
    <script src="../js/cart-ui.js"></script>
`;

files.forEach(file => {
    console.log(`Procesando: ${file}`);
    let content = fs.readFileSync(file, 'utf8');

    // 1. Agregar CSS si no existe
    if (!content.includes('cart.css')) {
        content = content.replace(
            /<link rel="stylesheet" href="\.\.\/css\/quick-view-modal\.css">/,
            `<link rel="stylesheet" href="../css/quick-view-modal.css">\r\n    <link rel="stylesheet" href="../css/cart.css">`
        );
        console.log('  ✓ CSS agregado');
    }

    // 2. Agregar panel HTML si no existe
    if (!content.includes('cart-panel')) {
        content = content.replace(
            /(<\/nav>)/,
            `$1${cartPanelHTML}`
        );
        console.log('  ✓ Panel HTML agregado');
    }

    // 3. Agregar scripts si no existen
    if (!content.includes('cart-manager.js')) {
        content = content.replace(
            /(<\/body>)/,
            `${cartScripts}\r\n$1`
        );
        console.log('  ✓ Scripts agregados');
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`  ✅ ${file} actualizado\n`);
});

console.log('✅ ¡Integración completada en todas las páginas!');
