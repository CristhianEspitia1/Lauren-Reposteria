// Base de datos de productos - ALFAJORES
// Datos extraídos de la página alfajores.html

const detallesProductsData = {
    'alfajor-personalizado': {
        id: 'alfajor-personalizado',
        name: 'Alfajores Personalizados',
        price: 60000,
        priceFormatted: '$60.000',
        category: 'personalizados',
        description: 'Alfajores de maicena personalizados con diseños únicos para tus celebraciones. Cada alfajor es decorado artesanalmente con fondant y detalles especiales según tu ocasión.',
        mainImage: '../assets/imagenes-alfajores/personalizados/aaa.jpg',
        images: [
            '../assets/imagenes-alfajores/personalizados/aaa.jpg',
            '../assets/imagenes-alfajores/personalizados/b.jpg',
            '../assets/imagenes-alfajores/personalizados/bb.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-22 at 19.11.33_03be5587.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-22 at 19.15.12_ce194214.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-22 at 19.30.22_44a7ffb4.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.02.55_d40a95c7.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.03.30_f1881042.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.04.09_49a8317f.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.04.58_9e0bd10b.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.05.09_520ee439.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.05.22_518737f4.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.05.57_19f53c16.jpg',
            '../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.06.08_75e702b1.jpg'
        ],
        includes: [
            'Alfajores de maicena rellenos de arequipe',
            'Decoración personalizada en fondant',
            'Diseño según tu ocasión especial',
            'Empaque decorativo incluido',
            'Producto artesanal 100%'
        ],
        customizable: true,
        options: [
            {
                id: 'diseno',
                label: 'Tipo de diseño',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'basico', label: 'Diseño Básico - $60.000 (unidad)', price: 60000 }
                ]
            },
            {
                id: 'cantidad',
                label: 'Cantidad mínima',
                type: 'radio',
                required: true,
                choices: [
                    { value: '6', label: '6 unidades' }
                ]
            }
        ],
        personalization: {
            enabled: true,
            field: 'tema',
            label: 'Tema o motivo de la celebración',
            placeholder: 'Ej: Baby shower, Cumpleaños, Boda, etc.',
            maxLength: 100,
            required: true
        }
    },

    'caja-x6': {
        id: 'caja-x6',
        name: 'Caja x6 Alfajores',
        price: 16000,
        priceFormatted: '$16.000',
        category: 'cajas',
        description: 'Deliciosos alfajores de maicena rellenos de arequipe. Perfectos para compartir o regalar. Presentación en caja elegante.',
        mainImage: '../assets/imagenes-alfajores/Alfajores x6.png',
        images: [
            '../assets/imagenes-alfajores/Alfajores x6.png'
        ],
        includes: [
            '6 alfajores de maicena',
            'Relleno generoso de arequipe',
            'Caja para regalo',
            'Producto artesanal'
        ],
        customizable: false,
        options: [],
        personalization: null
    },

    'caja-x12': {
        id: 'caja-x12',
        name: 'Caja x12 Alfajores',
        price: 32000,
        priceFormatted: '$32.000',
        category: 'cajas',
        description: 'Docena de alfajores de maicena rellenos de arequipe. Ideal para compartir en reuniones o como regalo especial.',
        mainImage: '../assets/imagenes-alfajores/Alfajores x12.png',
        images: [
            '../assets/imagenes-alfajores/Alfajores x12.png'
        ],
        includes: [
            '12 alfajores de maicena',
            'Relleno generoso de arequipe',
            'Caja para regalo',
            'Producto artesanal'
        ],
        customizable: false,
        options: [],
        personalization: null
    },

    'vaso-minis': {
        id: 'vaso-minis',
        name: 'Vaso de Mini Alfajores',
        price: 14000,
        priceFormatted: '$14.000',
        category: 'minis',
        description: 'Vaso decorativo lleno de mini alfajores. Perfecto para regalar o disfrutar en porciones pequeñas.',
        mainImage: '../assets/imagenes-alfajores/Alfajores vaso mini.jpg',
        images: [
            '../assets/imagenes-alfajores/Alfajores vaso mini.jpg'
        ],
        includes: [
            'Vaso decorativo',
            'Mini alfajores (30 unidades)',
            'Relleno de arequipe',
            'Presentación especial'
        ],
        customizable: false,
        options: [],
        personalization: null
    },

    'torta-alfajor': {
        id: 'torta-alfajor',
        name: 'Torta de Alfajor',
        price: 50000,
        priceFormatted: 'Desde $50.000',
        category: 'tortas',
        description: 'Torta especial hecha con capas de alfajor de maicena y relleno de arequipe. Una experiencia única y deliciosa.',
        mainImage: '../assets/imagenes-alfajores/TortaAlfajor1.png',
        images: [
            '../assets/imagenes-alfajores/TortaAlfajor1.png',
            '../assets/imagenes-alfajores/TortaAlfajor2.png'
        ],
        includes: [
            'Torta de alfajor según tamaño',
            'Capas de alfajor de maicena',
            'Relleno de arequipe',
            'Decoración elegante'
        ],
        customizable: true,
        options: [
            {
                id: 'tamano',
                label: 'Tamaño de la torta',
                type: 'radio',
                required: true,
                priceModifier: true,
                choices: [
                    { value: 'personal', label: 'Personal (8 cm)', price: 50000 },
                    { value: '4-6', label: '4-6 porciones (11 cm)', price: 62000 },
                    { value: '6-8', label: '6-8 porciones (13 cm)', price: 72000 },
                    { value: '10-12', label: '10-12 porciones (16 cm)', price: 87000 }
                ]
            }
        ],
        personalization: {
            enabled: true,
            field: 'mensaje',
            label: 'Mensaje personalizado (opcional)',
            placeholder: 'Ej: Feliz Cumpleaños',
            maxLength: 30,
            required: false
        }
    },

    'alfajor-individual': {
        id: 'alfajor-individual',
        name: 'Alfajores Individuales',
        price: 2000,
        priceFormatted: 'Desde $2.000',
        category: 'individuales',
        description: 'Alfajores de maicena individuales empacados en bolsas. Se venden a partir de 6 unidades por referencia o tamaño.',
        mainImage: '../assets/imagenes-alfajores/AlfajorBolsita.png',
        images: [
            '../assets/imagenes-alfajores/AlfajorBolsita.png',
            '../assets/imagenes-alfajores/AlfajorUnidad.png'
        ],
        includes: [
            'Alfajores de maicena rellenos de arequipe',
            'Empacado en bolsas individuales',
            'Venta mínima: 6 unidades por referencia o tamaño',
            'Producto artesanal 100%'
        ],
        customizable: true,
        options: [
            {
                id: 'presentacion',
                label: 'Presentación y precio por unidad',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'mini-3', label: 'Minis x3 (2 cm c/u) - $3.000', price: 3000 },
                    { value: 'mini-6', label: 'Minis x6 (2 cm c/u) - $5.000', price: 5000 },
                    { value: 'pequeno', label: 'Pequeño unidad (3 cm) - $2.000', price: 2000 },
                    { value: 'mediano', label: 'Mediano unidad (4 cm) - $3.000', price: 3000 },
                    { value: 'grande', label: 'Grande unidad (5 cm) - $4.000', price: 4000 }
                ]
            }
        ],
        personalization: null
    }
};

// Mapeo de productos por nombre
const productCardMapping = {
    'Caja x6': 'caja-x6',
    'Caja x12': 'caja-x12',
    'Vaso de Minis': 'vaso-minis',
    'Torta de Alfajor': 'torta-alfajor',
    'Alfajores Individuales': 'alfajor-individual'
};
