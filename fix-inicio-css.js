const fs = require('fs');

console.log('Corrigiendo solo inicio.html...');

let content = fs.readFileSync('html/inicio.html', 'utf8');

// 1. Agregar CSS si no existe
if (!content.includes('cart.css')) {
    // Buscar después de inicio-styles.css
    content = content.replace(
        /<link rel="stylesheet" href="\.\.\/css\/inicio-styles\.css">/,
        `<link rel="stylesheet" href="../css/inicio-styles.css">\r\n    <link rel="stylesheet" href="../css/cart.css">`
    );
    console.log('  ✓ CSS de carrito agregado');
} else {
    console.log('  ℹ CSS ya existe');
}

fs.writeFileSync('html/inicio.html', content, 'utf8');
console.log('✅ inicio.html actualizado correctamente');
