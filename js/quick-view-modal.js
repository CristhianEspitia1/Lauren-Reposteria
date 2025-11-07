/**
 * QUICK VIEW MODAL - Componente Reutilizable
 * Para mostrar detalles de productos en modal
 * Compatible con: Tortas, Alfajores, Brownies, Galletas, Detalles
 */

class QuickViewModal {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.currentProduct = null;
        this.selectedOptions = {};
        this.currentPrice = 0;
        this.init();
    }

    /**
     * Inicializar el modal y crear el HTML
     */
    init() {
        this.createModalHTML();
        this.attachEventListeners();
        console.log('[QuickViewModal] Inicializado');
    }

    /**
     * Crear la estructura HTML del modal
     */
    createModalHTML() {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'quick-view-overlay';
        overlay.id = 'quickViewOverlay';

        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.id = 'quickViewModal';
        modal.innerHTML = `
            <button class="quick-view-close" id="quickViewClose" aria-label="Cerrar modal">×</button>
            <div class="quick-view-content">
                <!-- Columna izquierda: Imagen -->
                <div class="quick-view-image-section">
                    <div class="quick-view-image-container">
                        <img src="" alt="" class="quick-view-main-image" id="quickViewMainImage">
                        <div class="quick-view-thumbnails" id="quickViewThumbnails"></div>
                    </div>
                </div>

                <!-- Columna derecha: Información -->
                <div class="quick-view-info-section">
                    <div class="quick-view-info" id="quickViewInfo">
                        <!-- Contenido dinámico se carga aquí -->
                    </div>
                </div>
            </div>
        `;

        // Añadir al DOM
        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // Guardar referencias
        this.overlay = overlay;
        this.modal = modal;
    }

    /**
     * Adjuntar event listeners
     */
    attachEventListeners() {
        // Cerrar con botón X
        const closeBtn = document.getElementById('quickViewClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Cerrar al hacer click en el overlay
        this.overlay.addEventListener('click', () => this.close());

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        // Prevenir scroll del body cuando el modal está abierto
        this.modal.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    /**
     * Abrir modal con un producto específico
     * @param {Object} productData - Datos del producto
     */
    open(productData) {
        if (!productData) {
            console.error('[QuickViewModal] No se proporcionaron datos del producto');
            return;
        }

        console.log('[QuickViewModal] Abriendo modal para:', productData.name);

        this.currentProduct = productData;
        this.selectedOptions = {};
        this.currentPrice = productData.price || 0;

        // Renderizar contenido
        this.renderProduct(productData);

        // Mostrar modal
        setTimeout(() => {
            this.overlay.classList.add('active');
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    }

    /**
     * Cerrar modal
     */
    close() {
        console.log('[QuickViewModal] Cerrando modal');

        this.overlay.classList.remove('active');
        this.modal.classList.remove('active');
        document.body.style.overflow = '';

        // Limpiar después de la animación
        setTimeout(() => {
            this.currentProduct = null;
            this.selectedOptions = {};
        }, 300);
    }

    /**
     * Renderizar el producto en el modal
     * @param {Object} product - Datos del producto
     */
    renderProduct(product) {
        // Renderizar imagen principal
        this.renderMainImage(product);

        // Renderizar miniaturas (si hay múltiples imágenes)
        this.renderThumbnails(product);

        // Renderizar información del producto
        this.renderProductInfo(product);
    }

    /**
     * Renderizar imagen principal
     */
    renderMainImage(product) {
        const mainImage = document.getElementById('quickViewMainImage');
        if (mainImage) {
            mainImage.src = product.mainImage || product.images?.[0] || '';
            mainImage.alt = product.name || 'Producto';
        }
    }

    /**
     * Renderizar miniaturas
     */
    renderThumbnails(product) {
        const thumbnailsContainer = document.getElementById('quickViewThumbnails');
        if (!thumbnailsContainer) return;

        // Limpiar contenedor
        thumbnailsContainer.innerHTML = '';

        // Solo mostrar miniaturas si hay más de una imagen
        const images = product.images || [product.mainImage];
        if (images.length <= 1) return;

        images.forEach((imageSrc, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageSrc;
            thumbnail.alt = `${product.name} - Vista ${index + 1}`;
            thumbnail.className = 'quick-view-thumbnail';
            if (index === 0) thumbnail.classList.add('active');

            // Click en miniatura cambia imagen principal
            thumbnail.addEventListener('click', () => {
                const mainImage = document.getElementById('quickViewMainImage');
                if (mainImage) {
                    mainImage.src = imageSrc;
                }

                // Actualizar estado activo
                document.querySelectorAll('.quick-view-thumbnail').forEach(t =>
                    t.classList.remove('active')
                );
                thumbnail.classList.add('active');
            });

            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    /**
     * Renderizar información del producto
     */
    renderProductInfo(product) {
        const infoContainer = document.getElementById('quickViewInfo');
        if (!infoContainer) return;

        let html = `
            <!-- Nombre -->
            <h2 class="quick-view-title">${product.name}</h2>

            <!-- Precio -->
            <p class="quick-view-price" id="quickViewPrice">${product.priceFormatted || this.formatPrice(product.price)}</p>

            <!-- Descripción -->
            ${product.description ? `<p class="quick-view-description">${product.description}</p>` : ''}

            <!-- Qué incluye -->
            ${this.renderIncludes(product)}

            <!-- Opciones configurables -->
            ${this.renderOptions(product)}

            <!-- Campo de personalización -->
            ${this.renderPersonalization(product)}
        `;

        infoContainer.innerHTML = html;

        // Adjuntar eventos a las opciones
        this.attachOptionListeners(product);
    }

    /**
     * Renderizar sección "Qué incluye"
     */
    renderIncludes(product) {
        if (!product.includes || product.includes.length === 0) return '';

        return `
            <div class="quick-view-includes">
                <h3 class="quick-view-includes-title">Qué Incluye</h3>
                <ul class="quick-view-includes-list">
                    ${product.includes.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    /**
     * Renderizar opciones configurables
     */
    renderOptions(product) {
        if (!product.options || product.options.length === 0) return '';

        return product.options.map(option => {
            // Verificar si la opción depende de otra
            if (option.dependsOn) {
                return `<div class="quick-view-option" id="option-${option.id}" style="display: none;">
                    ${this.renderSingleOption(option)}
                </div>`;
            }

            return `<div class="quick-view-option" id="option-${option.id}">
                ${this.renderSingleOption(option)}
            </div>`;
        }).join('');
    }

    /**
     * Renderizar una opción individual
     */
    renderSingleOption(option) {
        const requiredLabel = option.required ? '<span class="required">*Required</span>' : '';

        switch (option.type) {
            case 'radio':
                return this.renderRadioOption(option, requiredLabel);
            case 'select':
                return this.renderSelectOption(option, requiredLabel);
            case 'toggle':
                return this.renderToggleOption(option, requiredLabel);
            default:
                return '';
        }
    }

    /**
     * Renderizar opción tipo radio
     */
    renderRadioOption(option, requiredLabel) {
        return `
            <label class="quick-view-option-label">
                ${option.label} ${requiredLabel}
            </label>
            <div class="quick-view-choices">
                ${option.choices.map((choice, index) => `
                    <div class="quick-view-choice" data-option-id="${option.id}" data-value="${choice.value}">
                        <input
                            type="radio"
                            name="${option.id}"
                            value="${choice.value}"
                            id="${option.id}-${index}"
                            ${option.required && index === 0 ? 'checked' : ''}
                        >
                        <label for="${option.id}-${index}">${choice.label}</label>
                    </div>
                `).join('')}
            </div>
            ${option.note ? `<p class="quick-view-price-note">${option.note}</p>` : ''}
        `;
    }

    /**
     * Renderizar opción tipo select (para múltiples selecciones)
     */
    renderSelectOption(option, requiredLabel) {
        const note = option.maxSelection ? `Puedes elegir hasta ${option.maxSelection} ${option.maxSelection === 1 ? 'opción' : 'opciones'}` : '';

        // Si es múltiple, usar chips en lugar de select tradicional
        if (option.multiple) {
            return `
                <label class="quick-view-option-label">
                    ${option.label} ${requiredLabel}
                </label>
                ${note ? `<p class="quick-view-option-note">${note}</p>` : ''}
                <div class="quick-view-select-chips" data-option-id="${option.id}" data-max-selection="${option.maxSelection || 1}">
                    ${option.choices.map(choice => {
                        // Agregar clase de color si el chip representa un color
                        const colorClass = this.getColorClass(choice.value);
                        return `
                            <button
                                type="button"
                                class="quick-view-select-chip ${colorClass}"
                                data-value="${choice.value}"
                            >
                                ${choice.label}
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
        }

        // Para select simple (no múltiple), usar el select tradicional
        return `
            <label class="quick-view-option-label">
                ${option.label} ${requiredLabel}
            </label>
            <select
                class="quick-view-select"
                name="${option.id}"
                data-max-selection="1"
            >
                ${option.choices.map(choice => `
                    <option value="${choice.value}">${choice.label}</option>
                `).join('')}
            </select>
            ${note ? `<p class="quick-view-option-note">${note}</p>` : ''}
        `;
    }

    /**
     * Renderizar opción tipo toggle (sí/no)
     */
    renderToggleOption(option, requiredLabel) {
        return `
            <div class="quick-view-toggle" data-option-id="${option.id}">
                <input
                    type="checkbox"
                    name="${option.id}"
                    id="${option.id}-toggle"
                >
                <label for="${option.id}-toggle" class="quick-view-toggle-label">
                    ${option.label}
                </label>
            </div>
            ${option.note ? `<p class="quick-view-price-note">${option.note}</p>` : ''}
        `;
    }

    /**
     * Renderizar campo de personalización
     */
    renderPersonalization(product) {
        if (!product.personalization || !product.personalization.enabled) return '';

        const p = product.personalization;

        // Si tiene múltiples campos de personalización
        if (p.fields && Array.isArray(p.fields)) {
            return `
                <div class="quick-view-personalization">
                    ${p.fields.map(field => `
                        <label class="quick-view-personalization-label">
                            ${field.label} ${field.required ? '<span class="required">*Required</span>' : ''}
                        </label>
                        <input
                            type="text"
                            class="quick-view-personalization-input"
                            placeholder="${field.placeholder || ''}"
                            maxlength="${field.maxLength || 100}"
                            ${field.required ? 'required' : ''}
                            id="personalization-${field.id}"
                        >
                    `).join('')}
                </div>
            `;
        }

        // Campo único de personalización
        const dependsOn = p.dependsOn;
        const displayStyle = dependsOn ? 'style="display: none;"' : '';

        return `
            <div class="quick-view-personalization" id="personalization-section" ${displayStyle}>
                <label class="quick-view-personalization-label">
                    ${p.label} ${p.required ? '<span class="required">*Required</span>' : ''}
                </label>
                <input
                    type="text"
                    class="quick-view-personalization-input"
                    placeholder="${p.placeholder || ''}"
                    maxlength="${p.maxLength || 100}"
                    ${p.required ? 'required' : ''}
                    id="personalization-input"
                >
                ${p.note ? `<p class="quick-view-personalization-note">${p.note}</p>` : ''}
            </div>
        `;
    }

    /**
     * Adjuntar event listeners a las opciones
     */
    attachOptionListeners(product) {
        // Radio buttons - estilos y dependencias
        document.querySelectorAll('.quick-view-choice').forEach(choice => {
            choice.addEventListener('click', () => {
                const radio = choice.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;

                    // Actualizar estilos visuales
                    const optionId = choice.dataset.optionId;
                    document.querySelectorAll(`[data-option-id="${optionId}"]`).forEach(c =>
                        c.classList.remove('selected')
                    );
                    choice.classList.add('selected');

                    // Manejar dependencias y precios
                    this.handleOptionChange(product, optionId, choice.dataset.value);
                }
            });
        });

        // Toggles - personalización condicional
        document.querySelectorAll('.quick-view-toggle input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const toggleContainer = e.target.closest('.quick-view-toggle');
                if (e.target.checked) {
                    toggleContainer.classList.add('active');
                } else {
                    toggleContainer.classList.remove('active');
                }

                // Mostrar/ocultar campo de personalización
                const personalizationSection = document.getElementById('personalization-section');
                if (personalizationSection) {
                    personalizationSection.style.display = e.target.checked ? 'block' : 'none';
                }

                // Actualizar precio si el toggle tiene modificador de precio
                const optionId = e.target.name;
                this.handleOptionChange(product, optionId, e.target.checked);
            });
        });

        // Selects tradicionales
        document.querySelectorAll('.quick-view-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const optionId = e.target.name;
                const value = select.multiple ?
                    Array.from(select.selectedOptions).map(opt => opt.value) :
                    e.target.value;

                this.handleOptionChange(product, optionId, value);
            });
        });

        // Chips seleccionables (para select múltiple)
        document.querySelectorAll('.quick-view-select-chips').forEach(chipsContainer => {
            const optionId = chipsContainer.dataset.optionId;
            const maxSelection = parseInt(chipsContainer.dataset.maxSelection) || 1;

            chipsContainer.querySelectorAll('.quick-view-select-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const isSelected = chip.classList.contains('selected');

                    if (isSelected) {
                        // Deseleccionar
                        chip.classList.remove('selected');
                    } else {
                        // Verificar límite de selección
                        const selectedChips = chipsContainer.querySelectorAll('.quick-view-select-chip.selected');

                        if (selectedChips.length < maxSelection) {
                            chip.classList.add('selected');
                        } else {
                            // Si se alcanzó el límite, deseleccionar el primero y seleccionar el nuevo
                            selectedChips[0].classList.remove('selected');
                            chip.classList.add('selected');
                        }
                    }

                    // Obtener valores seleccionados
                    const selectedValues = Array.from(
                        chipsContainer.querySelectorAll('.quick-view-select-chip.selected')
                    ).map(c => c.dataset.value);

                    // Notificar cambio
                    this.handleOptionChange(product, optionId, selectedValues);
                });
            });
        });
    }

    /**
     * Manejar cambios en las opciones (dependencias, precios, etc.)
     */
    handleOptionChange(product, optionId, value) {
        console.log(`[QuickViewModal] Opción cambiada: ${optionId} = ${value}`);

        this.selectedOptions[optionId] = value;

        // Buscar la opción en los datos del producto
        const option = product.options?.find(opt => opt.id === optionId);
        if (!option) return;

        // Manejar dependencias (mostrar/ocultar opciones dependientes)
        this.handleDependencies(product, optionId, value);

        // Actualizar precio si la opción tiene modificador de precio
        this.updatePrice(product, option, value);
    }

    /**
     * Manejar dependencias entre opciones
     */
    handleDependencies(product, changedOptionId, value) {
        product.options?.forEach(option => {
            if (option.dependsOn === changedOptionId) {
                const optionElement = document.getElementById(`option-${option.id}`);
                if (optionElement) {
                    // Mostrar solo si el valor coincide con showWhen
                    let shouldShow = false;

                    if (Array.isArray(option.showWhen)) {
                        // Si showWhen es un array, verificar si value está en el array
                        shouldShow = option.showWhen.includes(value);
                    } else {
                        // Si es un string, comparar directamente
                        shouldShow = option.showWhen === value;
                    }

                    if (shouldShow) {
                        optionElement.style.display = 'block';
                    } else {
                        optionElement.style.display = 'none';
                    }
                }
            }
        });
    }

    /**
     * Actualizar precio dinámicamente
     */
    updatePrice(product, option, value) {
        let newPrice = product.price || 0;

        // Recalcular el precio basado en TODAS las opciones seleccionadas
        let basePrice = 0;
        let quantity = 1;
        let presentacionValue = null;

        // Primero, obtener el valor de presentación si existe
        product.options?.forEach(opt => {
            if (opt.id === 'presentacion') {
                presentacionValue = this.selectedOptions[opt.id];
            }
        });

        product.options?.forEach(opt => {
            const selectedValue = this.selectedOptions[opt.id];

            if (opt.priceModifier === true && selectedValue) {
                const choice = opt.choices?.find(c => c.value === selectedValue);

                if (choice && choice.price !== undefined) {
                    // Si la opción es "presentacion"
                    if (opt.id === 'presentacion') {
                        // Solo usar el precio de presentación si NO es 'individual'
                        if (selectedValue !== 'individual') {
                            basePrice = choice.price;
                        } else {
                            // Para individual, el precio se define por sabor + cantidad
                            basePrice = choice.price; // Precio base individual
                        }
                    }
                    // Si la opción es "sabor" (para galletas/brownies individuales)
                    else if (opt.id === 'sabor') {
                        basePrice = choice.price;
                    }
                    // Si la opción es "cantidad"
                    else if (opt.id === 'cantidad') {
                        // Si la cantidad tiene precio directo (brownies individuales), usarlo
                        if (choice.price) {
                            basePrice = choice.price;
                        } else {
                            // Si no tiene precio, es multiplicador (galletas)
                            const quantityNumber = parseInt(selectedValue);
                            if (!isNaN(quantityNumber)) {
                                quantity = quantityNumber;
                            }
                        }
                    }
                }
            } else if (typeof opt.priceModifier === 'number') {
                // Precio adicional fijo (para toggles)
                if (selectedValue === true) {
                    newPrice += opt.priceModifier;
                }
            }
        });

        // Calcular precio final
        if (basePrice > 0) {
            // Si presentación es 'individual' y hay cantidad, multiplicar
            if (presentacionValue === 'individual' && quantity > 1) {
                newPrice = basePrice * quantity;
            } else {
                newPrice = basePrice;
            }
        }

        // Actualizar precio en la UI
        this.currentPrice = newPrice;
        const priceElement = document.getElementById('quickViewPrice');
        if (priceElement) {
            priceElement.textContent = this.formatPrice(newPrice);
        }
    }

    /**
     * Formatear precio
     */
    formatPrice(price) {
        if (!price) return '';
        return `$${price.toLocaleString('es-CO')}`;
    }

    /**
     * Obtener clase de color para chips de colores
     */
    getColorClass(value) {
        const colorMap = {
            'blanco': 'chip-color-blanco',
            'cafe': 'chip-color-cafe',
            'azul': 'chip-color-azul',
            'verde': 'chip-color-verde',
            'lila': 'chip-color-lila',
            'rosado': 'chip-color-rosado',
            'rojo': 'chip-color-rojo'
        };

        return colorMap[value] || '';
    }
}

// Inicializar el modal cuando el DOM esté listo
let quickViewModalInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    quickViewModalInstance = new QuickViewModal();
    console.log('[QuickViewModal] Modal listo para usar');
});

// Función global para abrir el modal desde cualquier lugar
function openQuickView(productId, productsData) {
    if (!quickViewModalInstance) {
        console.error('[QuickViewModal] El modal no está inicializado');
        return;
    }

    const product = productsData[productId];
    if (!product) {
        console.error(`[QuickViewModal] Producto no encontrado: ${productId}`);
        return;
    }

    quickViewModalInstance.open(product);
}
