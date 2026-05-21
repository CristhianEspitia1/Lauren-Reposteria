/**
 * CATALOG LOADER - LAUREN REPOSTERÍA
 * 
 * Este script lee los datos de 'catalogData' (definido en catalog-data.js)
 * y genera el HTML para las secciones dinámicas de la página.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Renderizar secciones de Tortas
    renderTortasExtras();
    renderTortasVintage();
    renderTortasSencillas();

    // Renderizar secciones de Alfajores
    renderAlfajoresCajas();
    renderAlfajoresTortas();
    renderAlfajoresIndividuales();

    // Re-inicializar carruseles de Tortas si la función existe
    if (typeof window.initTortasCarousels === 'function') {
        setTimeout(() => {
            window.initTortasCarousels();
        }, 100);
    }
});

/**
 * Renderizar Extras de Tortas
 */
function renderTortasExtras() {
    const container = document.getElementById('tortas-extras-container');
    if (!container) return;

    const extras = Object.values(catalogData).filter(product => product.category === 'extras');
    let html = '';

    extras.forEach(extra => {
        let priceDisplay = extra.priceFormatted;
        const priceClass = extra.price === 0 ? 'extra-price-tag special-price' : 'extra-price-tag';

        html += `
            <div class="extra-card">
                <div class="extra-icon-wrapper">
                    <img src="${extra.mainImage}" alt="${extra.name}" class="extra-icon-img">
                </div>
                <div class="extra-content">
                    <h3 class="extra-title">${extra.name}</h3>
                    <p class="extra-description">${extra.description}</p>
                    <div class="${priceClass}">
                        <span class="price-range">${priceDisplay}</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Renderizar Galería de Tortas Vintage
 */
function renderTortasVintage() {
    const container = document.getElementById('tortas-vintage-container');
    if (!container || !catalogData['torta-vintage']) return;

    const product = catalogData['torta-vintage'];
    const images = product.images || [product.mainImage];
    const chunkSize = 4; // 4 imágenes por grupo

    let html = '';

    // Generar grupos de imágenes
    for (let i = 0; i < images.length; i += chunkSize) {
        const chunk = images.slice(i, i + chunkSize);
        const isActive = i === 0 ? 'active' : '';

        html += `<div class="vintage-carousel-group ${isActive}">`;

        chunk.forEach(imgSrc => {
            html += `
                <div class="vintage-gallery-item">
                    <img src="${imgSrc}" alt="${product.name}" class="vintage-gallery-img">
                </div>
            `;
        });

        html += `</div>`;
    }

    // Generar indicadores (dots)
    const numGroups = Math.ceil(images.length / chunkSize);
    let dotsHtml = '<div class="vintage-carousel-dots">';
    for (let i = 0; i < numGroups; i++) {
        const isActive = i === 0 ? 'active' : '';
        dotsHtml += `<span class="vintage-dot ${isActive}" data-group="${i}"></span>`;
    }
    dotsHtml += '</div>';

    // Botón Ver Precios
    const btnHtml = `
        <div class="pricing-btn-wrapper">
            <button class="pricing-btn-integrated" id="vintagePricingBtn">
                Ver Precios
            </button>
        </div>
    `;

    container.innerHTML = html + dotsHtml + btnHtml;
}

/**
 * Renderizar Galería de Tortas Sencillas
 */
function renderTortasSencillas() {
    const container = document.getElementById('tortas-sencillas-container');
    if (!container || !catalogData['torta-sencilla']) return;

    const product = catalogData['torta-sencilla'];
    const images = product.images || [product.mainImage];
    const chunkSize = 3; // 3 imágenes por grupo

    let html = '';

    // Generar grupos de imágenes
    for (let i = 0; i < images.length; i += chunkSize) {
        const chunk = images.slice(i, i + chunkSize);
        const isActive = i === 0 ? 'active' : '';

        html += `<div class="simple-carousel-group ${isActive}">`;

        chunk.forEach(imgSrc => {
            html += `
                <div class="simple-gallery-item">
                    <img src="${imgSrc}" alt="${product.name}" class="simple-gallery-img">
                </div>
            `;
        });

        html += `</div>`;
    }

    // Generar indicadores (dots)
    const numGroups = Math.ceil(images.length / chunkSize);
    let dotsHtml = '<div class="simple-carousel-dots">';
    for (let i = 0; i < numGroups; i++) {
        const isActive = i === 0 ? 'active' : '';
        dotsHtml += `<span class="simple-dot ${isActive}" data-group="${i}"></span>`;
    }
    dotsHtml += '</div>';

    // Botón Ver Precios
    const btnHtml = `
        <div class="pricing-btn-wrapper">
            <button class="pricing-btn-integrated" id="sencillasPricingBtn">
                Ver Precios
            </button>
        </div>
    `;

    container.innerHTML = html + dotsHtml + btnHtml;
}

/**
 * Renderizar Cajas de Alfajores
 */
function renderAlfajoresCajas() {
    const container = document.getElementById('alfajores-cajas-container');
    if (!container) return;

    // Productos a mostrar en el carrusel de cajas
    const products = [
        catalogData['caja-x6'],
        catalogData['vaso-minis'],
        catalogData['caja-x12']
    ].filter(Boolean); // Filtrar undefined

    let html = `<div class="cajas-carousel-group active">`;

    products.forEach(product => {
        // ID especial para el botón de la caja x6 (que tiene el botón overlay)
        const isCajaX6 = product.id === 'caja-x6';

        html += `
            <div class="cajas-gallery-item" id="${product.id}Img">
                <img src="${product.mainImage}" alt="${product.name}" class="cajas-gallery-img">
                ${isCajaX6 ? `
                <button class="pricing-btn-integrated cajas-pricing-btn-overlay" id="cajasPricingBtn">
                    Ver Precios
                </button>` : ''}
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

/**
 * Renderizar Tortas de Alfajor
 */
function renderAlfajoresTortas() {
    const container = document.getElementById('alfajores-tortas-container');
    if (!container || !catalogData['torta-alfajor']) return;

    const product = catalogData['torta-alfajor'];
    const images = product.images || [product.mainImage];

    // Tomar solo las primeras 2 imágenes para el grid
    const displayImages = images.slice(0, 2);

    let html = '';

    displayImages.forEach((imgSrc, index) => {
        // Estilos inline para mantener el diseño original
        const position = index === 0 ? '20%' : '60%';

        html += `
            <div class="torta-alfajor-item" style="border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;">
                <img src="${imgSrc}" alt="${product.name}" 
                    class="torta-alfajor-img"
                    style="width: 100%; height: 416px; object-fit: cover; object-position: center ${position}; display: block; margin: 0; padding: 0; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); transform: scale(1.08);">
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Renderizar Alfajores Individuales
 */
function renderAlfajoresIndividuales() {
    const container = document.getElementById('alfajores-individuales-container');
    if (!container) return;

    // Usar imágenes hardcodeadas por ahora ya que no están claras en el data
    // O usar las de catalogData si existen
    const bolsitaImg = "../assets/optimized/imagenes-alfajores/AlfajorBolsita.webp";
    const unidadImg = "../assets/optimized/imagenes-alfajores/AlfajorUnidad.webp";

    const html = `
        <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 2.5rem;">
            <!-- Imagen de alfajores en bolsitas -->
            <div class="alfajor-individual-item" style="position: relative; border-radius: 25px; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 20px 60px rgba(139, 69, 19, 0.15);">
                <img src="${bolsitaImg}" alt="Alfajores en Bolsita" class="alfajor-bolsita-img" style="width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%); pointer-events: none;"></div>
            </div>

            <!-- Imagen de alfajor unitario -->
            <div class="alfajor-individual-item" style="position: relative; border-radius: 25px; overflow: hidden; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 20px 60px rgba(139, 69, 19, 0.15);">
                <img src="${unidadImg}" alt="Alfajor Unitario" class="alfajor-unitario-img" style="width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%); pointer-events: none;"></div>
            </div>
        </div>

        <!-- Botón Ver Precios -->
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 2rem; width: 100%;">
            <button class="pricing-btn-integrated" id="individualesPricingBtn">
                Ver Precios
            </button>
        </div>
    `;

    container.innerHTML = html;
}
