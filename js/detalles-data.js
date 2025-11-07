// Base de datos completa de productos - DETALLES
const detallesProductsData = {
    'oso-pequeno': {
        id: 'oso-pequeno',
        name: 'Oso Pequeño',
        price: 27000,
        priceFormatted: '$27.000',
        category: 'osos',
        description: 'Adorable oso de chocolate acompañado de mini alfajores y galletas. Perfecto para sorprender con un detalle dulce y especial.',
        mainImage: '../assets/imagenes-detalles/productos/osos/Oso Pequeño.jpg',
        images: [
            '../assets/imagenes-detalles/productos/osos/Oso Pequeño.jpg'
        ],
        includes: [
            'Oso de chocolate (blanco o semiamargo)',
            '6 mini alfajores rellenos de arequipe',
            '3 mini galletas (chips con nueces o red velvet)'
        ],
        customizable: true,
        options: [
            {
                id: 'tipo-chocolate',
                label: 'Tipo de chocolate del oso',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'blanco', label: 'Chocolate Blanco' },
                    { value: 'semiamargo', label: 'Chocolate Semiamargo' }
                ]
            },
            {
                id: 'sabor-galletas',
                label: 'Sabor de las mini galletas',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'chips', label: 'Chips con Nueces' },
                    { value: 'red-velvet', label: 'Red Velvet' }
                ]
            },
            {
                id: 'decoracion-oso',
                label: 'Decoración del oso',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'corazon-rojo', label: 'Corazón de chocolate rojo' },
                    { value: 'corazon-dorado', label: 'Corazón de chocolate dorado' },
                    { value: 'rosa-roja', label: 'Rosa de chocolate roja' },
                    { value: 'rosa-dorada', label: 'Rosa de chocolate dorada' }
                ]
            }
        ],
        personalization: null
    },

    'oso-grande': {
        id: 'oso-grande',
        name: 'Oso Grande',
        price: 49000,
        priceWithMessage: 53000,
        priceFormatted: '$49.000',
        priceWithMessageFormatted: '$53.000',
        category: 'osos',
        description: 'Oso de chocolate de tamaño grande acompañado de brownie, alfajores y galletas. Ideal para celebraciones especiales.',
        mainImage: '../assets/imagenes-detalles/productos/osos/Oso Grande.jpg',
        images: [
            '../assets/imagenes-detalles/productos/osos/Oso Grande.jpg',
            '../assets/imagenes-detalles/productos/osos/Oso Grande con letras.jpg'
        ],
        includes: [
            'Oso de chocolate (blanco o semiamargo)',
            'Brownie grande con Nutella',
            '6 alfajores pequeños rellenos de arequipe',
            '2 galletas grandes (chips con nueces, red velvet o cocoa)'
        ],
        customizable: true,
        options: [
            {
                id: 'tipo-chocolate',
                label: 'Tipo de chocolate del oso',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'blanco', label: 'Chocolate Blanco' },
                    { value: 'semiamargo', label: 'Chocolate Semiamargo' }
                ]
            },
            {
                id: 'sabor-galletas',
                label: 'Sabor de las galletas grandes',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'chips', label: 'Chips con Nueces' },
                    { value: 'red-velvet', label: 'Red Velvet' },
                    { value: 'cocoa', label: 'Cocoa' }
                ]
            },
            {
                id: 'decoracion-oso',
                label: 'Decoración del oso',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'corazon-rojo', label: 'Corazón de chocolate rojo' },
                    { value: 'corazon-dorado', label: 'Corazón de chocolate dorado' },
                    { value: 'rosa-roja', label: 'Rosa de chocolate roja' },
                    { value: 'rosa-dorada', label: 'Rosa de chocolate dorada' }
                ]
            },
            {
                id: 'mensaje-brownie',
                label: '¿Deseas agregar mensaje en el brownie?',
                type: 'toggle',
                required: false,
                priceModifier: 4000,
                note: 'Costo adicional: +$4.000'
            }
        ],
        personalization: {
            enabled: true,
            field: 'mensaje-brownie',
            label: 'Mensaje personalizado en el brownie',
            placeholder: 'Escribe tu mensaje corto aquí...',
            maxLength: 25,
            dependsOn: 'mensaje-brownie'
        }
    },

    'oso-fresas': {
        id: 'oso-fresas',
        name: 'Oso con Fresas',
        price: 59000,
        priceFormatted: '$59.000',
        category: 'osos',
        description: 'Oso de chocolate con fresas cubiertas, brownie y galleta. La combinación perfecta entre chocolate y frescura.',
        mainImage: '../assets/imagenes-detalles/productos/osos/Oso con fresas.jpg',
        images: [
            '../assets/imagenes-detalles/productos/osos/Oso con fresas.jpg'
        ],
        includes: [
            'Oso de chocolate (blanco o semiamargo)',
            'Brownie grande con Nutella o crema de chocolate blanco',
            'Galleta grande (chips con nueces, red velvet o cocoa)',
            '6 fresas cubiertas de chocolate blanco o semiamargo'
        ],
        customizable: true,
        options: [
            {
                id: 'tipo-chocolate-oso',
                label: 'Tipo de chocolate del oso',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'blanco', label: 'Chocolate Blanco' },
                    { value: 'semiamargo', label: 'Chocolate Semiamargo' }
                ]
            },
            {
                id: 'relleno-brownie',
                label: 'Relleno del brownie',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'nutella', label: 'Nutella' },
                    { value: 'chocolate-blanco', label: 'Crema de Chocolate Blanco' }
                ]
            },
            {
                id: 'sabor-galleta',
                label: 'Sabor de la galleta grande',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'chips', label: 'Chips con Nueces' },
                    { value: 'red-velvet', label: 'Red Velvet' },
                    { value: 'cocoa', label: 'Cocoa' }
                ]
            },
            {
                id: 'chocolate-fresas',
                label: 'Tipo de chocolate para las fresas',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'blanco', label: 'Chocolate Blanco' },
                    { value: 'semiamargo', label: 'Chocolate Semiamargo' }
                ]
            },
            {
                id: 'decoracion-oso',
                label: 'Decoración del oso',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'corazon-rojo', label: 'Corazón de chocolate rojo' },
                    { value: 'corazon-dorado', label: 'Corazón de chocolate dorado' },
                    { value: 'rosa-roja', label: 'Rosa de chocolate roja' },
                    { value: 'rosa-dorada', label: 'Rosa de chocolate dorada' }
                ]
            }
        ],
        personalization: null
    },

    'detalle-brownie': {
        id: 'detalle-brownie',
        name: 'Detalle Brownie',
        price: 60000,
        priceFormatted: '$60.000',
        category: 'clasicos',
        description: 'Brownie de 4-6 porciones con mensaje personalizado, acompañado de galleta y mini alfajores. Delicioso y personalizable.',
        mainImage: '../assets/imagenes-detalles/productos/mix/Detalle Brownie.jpg',
        images: [
            '../assets/imagenes-detalles/productos/mix/Detalle Brownie.jpg'
        ],
        includes: [
            'Brownie de 4-6 porciones con mensaje personalizado',
            '1 galleta de cualquier sabor',
            '6 mini alfajores rellenos de arequipe'
        ],
        customizable: true,
        options: [
            {
                id: 'relleno-brownie',
                label: 'Relleno del brownie',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'nutella', label: 'Nutella' },
                    { value: 'arequipe', label: 'Arequipe' }
                ]
            },
            {
                id: 'sabor-galleta',
                label: 'Sabor de la galleta',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'chips', label: 'Chips con Nueces' },
                    { value: 'red-velvet', label: 'Red Velvet' },
                    { value: 'cocoa', label: 'Cocoa' }
                ]
            },
            {
                id: 'decoracion-brownie',
                label: 'Decoración del brownie',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'corazones', label: 'Corazones' },
                    { value: 'estrellas', label: 'Estrellas' },
                    { value: 'mariposas', label: 'Mariposas' },
                    { value: 'rosas', label: 'Rosas' }
                ]
            }
        ],
        personalization: {
            enabled: true,
            field: 'mensaje-brownie',
            label: 'Mensaje personalizado en el brownie',
            placeholder: 'Escribe tu mensaje corto aquí...',
            maxLength: 25,
            required: true
        }
    },

    'detalle-hbd': {
        id: 'detalle-hbd',
        name: 'Detalle HBD',
        price: 92000,
        priceFormatted: '$92.000',
        category: 'clasicos',
        description: 'Mini torta de cumpleaños con letras personalizadas, alfajores, galletas y trufas. Perfecto para celebrar con estilo.',
        mainImage: '../assets/imagenes-detalles/productos/mix/Detalle HBD.jpg',
        images: [
            '../assets/imagenes-detalles/productos/mix/Detalle HBD.jpg'
        ],
        includes: [
            'Mini torta de vainilla cubierta con crema de chocolate y mensaje corto en fondant',
            '3 iniciales de letras con relleno de brownie',
            '4 alfajores pequeños',
            '2 mini galletas cuadradas con Nutella',
            '3 trufas de oreo'
        ],
        customizable: true,
        options: [
            {
                id: 'color-letras',
                label: 'Color de las letras y decoración (puedes combinar dos)',
                type: 'select',
                required: true,
                multiple: true,
                maxSelection: 2,
                choices: [
                    { value: 'blanco', label: 'Blanco' },
                    { value: 'cafe', label: 'Café' },
                    { value: 'azul', label: 'Azul' },
                    { value: 'verde', label: 'Verde' },
                    { value: 'lila', label: 'Lila' },
                    { value: 'rosado', label: 'Rosado' },
                    { value: 'rojo', label: 'Rojo' }
                ]
            }
        ],
        personalization: {
            enabled: true,
            fields: [
                {
                    id: 'iniciales',
                    label: 'Iniciales para las letras de chocolate (3 letras)',
                    placeholder: 'Ej: ABC',
                    maxLength: 3,
                    required: true
                },
                {
                    id: 'mensaje-torta',
                    label: 'Mensaje corto en fondant',
                    placeholder: 'Ej: Feliz Cumpleaños',
                    maxLength: 30,
                    required: true
                }
            ]
        }
    },

    'detalle-margarita': {
        id: 'detalle-margarita',
        name: 'Detalle Margarita',
        price: 65000,
        priceFormatted: '$65.000',
        category: 'clasicos',
        description: 'Variedad de delicias: alfajores, frambuesas cubiertas, mini galletas y brownie. Un regalo completo y delicioso.',
        mainImage: '../assets/imagenes-detalles/productos/mix/Margarita.jpg',
        images: [
            '../assets/imagenes-detalles/productos/mix/Margarita.jpg'
        ],
        includes: [
            'Caja x6 alfajores',
            'Caja x4 frambuesas cubiertas de chocolate',
            'Caja x7 mini galletas (chips con nueces y red velvet)',
            'Porción de brownie con crema de chocolate blanco'
        ],
        customizable: false,
        options: [],
        personalization: null
    },

    'detalle-mix-1': {
        id: 'detalle-mix-1',
        name: 'Detalle Mix',
        price: 50000,
        priceFormatted: '$50.000',
        category: 'mix',
        description: 'Letras personalizadas en chocolate, mini alfajores, chocolatina y galletas. Ideal para sorprender de manera especial.',
        mainImage: '../assets/imagenes-detalles/productos/mix/Detalle Mix.jpg',
        images: [
            '../assets/imagenes-detalles/productos/mix/Detalle Mix.jpg'
        ],
        includes: [
            '2 iniciales de letras en chocolate rellenas de brownie',
            'Mini alfajores (6-8 unidades según espacio)',
            'Chocolatina de M&M',
            '4 mini galletas de chips con nueces'
        ],
        customizable: true,
        options: [
            {
                id: 'color-letras',
                label: 'Color de las letras (puedes combinar dos)',
                type: 'select',
                required: true,
                multiple: true,
                maxSelection: 2,
                choices: [
                    { value: 'blanco', label: 'Blanco' },
                    { value: 'cafe', label: 'Café' },
                    { value: 'azul', label: 'Azul' },
                    { value: 'verde', label: 'Verde' },
                    { value: 'lila', label: 'Lila' },
                    { value: 'rosado', label: 'Rosado' },
                    { value: 'rojo', label: 'Rojo' }
                ]
            }
        ],
        personalization: {
            enabled: true,
            field: 'iniciales',
            label: 'Iniciales para las letras de chocolate (2 letras)',
            placeholder: 'Ej: AB',
            maxLength: 2,
            required: true
        }
    },

    'detalle-mix-2': {
        id: 'detalle-mix-2',
        name: 'Detalle Mix 2',
        price: 56000,
        priceFormatted: '$56.000',
        category: 'mix',
        description: 'Letras en chocolate, alfajores, chocolatina y brownies con arequipe. Una combinación irresistible.',
        mainImage: '../assets/imagenes-detalles/productos/mix/Detalle Mix 2.jpg',
        images: [
            '../assets/imagenes-detalles/productos/mix/Detalle Mix 2.jpg'
        ],
        includes: [
            '2 iniciales de letras en chocolate rellenas de brownie',
            '4 alfajores pequeños',
            'Chocolatina de M&M',
            '2 brownies con arequipe'
        ],
        customizable: true,
        options: [
            {
                id: 'color-letras',
                label: 'Color de las letras (puedes combinar dos)',
                type: 'select',
                required: true,
                multiple: true,
                maxSelection: 2,
                choices: [
                    { value: 'blanco', label: 'Blanco' },
                    { value: 'cafe', label: 'Café' },
                    { value: 'azul', label: 'Azul' },
                    { value: 'verde', label: 'Verde' },
                    { value: 'lila', label: 'Lila' },
                    { value: 'rosado', label: 'Rosado' },
                    { value: 'rojo', label: 'Rojo' }
                ]
            }
        ],
        personalization: {
            enabled: true,
            field: 'iniciales',
            label: 'Iniciales para las letras de chocolate (2 letras)',
            placeholder: 'Ej: AB',
            maxLength: 2,
            required: true
        }
    },

    'detalle-golden-1': {
        id: 'detalle-golden-1',
        name: 'Detalle Golden',
        price: 83000,
        priceFormatted: '$83.000',
        category: 'golden',
        description: 'Mini torta vasca, trufas de oreo, brownie grande y alfajor especial. Una combinación premium.',
        mainImage: '../assets/imagenes-detalles/productos/golden/Detalle Golden.jpg',
        images: [
            '../assets/imagenes-detalles/productos/golden/Detalle Golden.jpg'
        ],
        includes: [
            'Mini torta vasca con mermelada o arequipe',
            '4 trufas de oreo',
            'Brownie grande con Nutella',
            'Alfajor en forma de mostacho'
        ],
        customizable: true,
        options: [
            {
                id: 'relleno-torta-vasca',
                label: 'Relleno de la torta vasca',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'mermelada', label: 'Mermelada' },
                    { value: 'arequipe', label: 'Arequipe' }
                ]
            }
        ],
        personalization: null
    },

    'detalle-golden-2': {
        id: 'detalle-golden-2',
        name: 'Detalle Golden Rosa',
        price: 86000,
        priceFormatted: '$86.000',
        category: 'golden',
        description: 'Mini torta vasca, trufas, brownie y mini galletas. Perfecto para ocasiones especiales.',
        mainImage: '../assets/imagenes-detalles/productos/golden/Detalle Golden Rosa.jpg',
        images: [
            '../assets/imagenes-detalles/productos/golden/Detalle Golden Rosa.jpg'
        ],
        includes: [
            'Mini torta vasca con mermelada o arequipe',
            '3 trufas de oreo',
            'Brownie grande con Nutella',
            '7 mini galletas'
        ],
        customizable: true,
        options: [
            {
                id: 'relleno-torta-vasca',
                label: 'Relleno de la torta vasca',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'mermelada', label: 'Mermelada' },
                    { value: 'arequipe', label: 'Arequipe' }
                ]
            }
        ],
        personalization: null
    },

    'detalle-golden-3': {
        id: 'detalle-golden-3',
        name: 'Detalle Golden Mostacho',
        price: 88000,
        priceSpecial: 94000,
        priceFormatted: '$88.000',
        priceSpecialFormatted: '$94.000',
        category: 'golden',
        description: 'Mini torta vasca, trufas, galleta especial y alfajores. Elije entre galletas sencillas o especiales.',
        mainImage: '../assets/imagenes-detalles/productos/golden/Detalle Golden Mostacho.jpg',
        images: [
            '../assets/imagenes-detalles/productos/golden/Detalle Golden Mostacho.jpg'
        ],
        includes: [
            'Mini torta vasca con mermelada o arequipe',
            '3 trufas de oreo',
            '1 galleta grande (sencilla o especial)',
            '5 alfajores pequeños'
        ],
        customizable: true,
        options: [
            {
                id: 'relleno-torta-vasca',
                label: 'Relleno de la torta vasca',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'mermelada', label: 'Mermelada' },
                    { value: 'arequipe', label: 'Arequipe' }
                ]
            },
            {
                id: 'tipo-galleta',
                label: 'Tipo de galleta',
                type: 'radio',
                required: true,
                priceModifier: true,
                choices: [
                    { value: 'sencilla', label: 'Galleta Sencilla ($88.000)', price: 88000 },
                    { value: 'especial', label: 'Galleta Especial ($94.000)', price: 94000 }
                ]
            },
            {
                id: 'sabor-galleta-sencilla',
                label: 'Sabor de galleta sencilla',
                type: 'radio',
                required: false,
                dependsOn: 'tipo-galleta',
                showWhen: 'sencilla',
                choices: [
                    { value: 'chips-nutella', label: 'Chips con Nueces (Nutella)' },
                    { value: 'red-velvet-queso', label: 'Red Velvet (Crema de Queso)' },
                    { value: 'cocoa-chocolate', label: 'Cocoa (Chocolate)' }
                ]
            },
            {
                id: 'sabor-galleta-especial',
                label: 'Sabor de galleta especial',
                type: 'radio',
                required: false,
                dependsOn: 'tipo-galleta',
                showWhen: 'especial',
                choices: [
                    { value: 'pistachos', label: 'Pistachos (Chocolate Blanco)' },
                    { value: 'chocolate-mermelada', label: 'Chocolate Blanco con Mermelada de Frutos Rojos' },
                    { value: 'panelita-copelia', label: 'Panelita Copelia (Arequipe)' }
                ]
            }
        ],
        personalization: null
    },

    'detalle-torta': {
        id: 'detalle-torta',
        name: 'Detalle con Torta',
        price: 105000,
        priceFormatted: '$105.000',
        category: 'clasicos',
        description: 'Torta de 5 porciones personalizada con frase o número, acompañada de alfajores medianos. Elegancia y sabor.',
        mainImage: '../assets/imagenes-detalles/productos/golden/Detalle con torta.jpg',
        images: [
            '../assets/imagenes-detalles/productos/golden/Detalle con torta.jpg'
        ],
        includes: [
            'Torta de 5 porciones con frase corta o número',
            '5 alfajores medianos'
        ],
        customizable: true,
        options: [
            {
                id: 'sabor-torta',
                label: 'Sabor de la torta',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'vainilla', label: 'Vainilla' },
                    { value: 'chocolate', label: 'Chocolate' },
                    { value: 'red-velvet', label: 'Red Velvet' }
                ]
            }
        ],
        personalization: {
            enabled: true,
            field: 'mensaje-torta',
            label: 'Frase corta o número para la torta',
            placeholder: 'Ej: Feliz Cumpleaños, 25, Te Amo...',
            maxLength: 30,
            required: true,
            note: 'Cualquier variación en el diseño de la torta puede cambiar el valor'
        }
    }
};

// Mapeo de productos por ID de HTML (para compatibilidad con las tarjetas existentes)
const productCardMapping = {
    'Oso Pequeño': 'oso-pequeno',
    'Oso Grande': 'oso-grande',
    'Oso con Fresas': 'oso-fresas',
    'Detalle Brownie': 'detalle-brownie',
    'Detalle HBD': 'detalle-hbd',
    'Detalle Margarita': 'detalle-margarita',
    'Detalle Mix': 'detalle-mix-1',
    'Detalle Mix 2': 'detalle-mix-2',
    'Detalle Golden': 'detalle-golden-1',
    'Detalle Golden Rosa': 'detalle-golden-2',
    'Detalle Golden Mostacho': 'detalle-golden-3',
    'Detalle con Torta': 'detalle-torta'
};
