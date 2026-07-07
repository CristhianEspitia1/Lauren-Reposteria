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
        mainImage: '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-12.webp',
        images: [
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-12.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-13.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-14.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-01.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-02.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-03.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-04.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-05.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-06.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-07.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-08.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-09.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-10.webp',
            '../assets/optimized/imagenes-alfajores/personalizados/alfajor-personalizado-11.webp'
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
                priceModifier: true,
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
        price: 22000,
        priceFormatted: '$22.000',
        category: 'cajas',
        description: 'Deliciosos alfajores de maicena rellenos de arequipe. Perfectos para compartir o regalar. Presentación en caja elegante.',
        mainImage: '../assets/optimized/imagenes-alfajores/alfajores-x6.webp',
        images: [
            '../assets/optimized/imagenes-alfajores/alfajores-x6.webp'
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
        price: 37000,
        priceFormatted: '$37.000',
        category: 'cajas',
        description: 'Docena de alfajores de maicena rellenos de arequipe. Ideal para compartir en reuniones o como regalo especial.',
        mainImage: '../assets/optimized/imagenes-alfajores/alfajores-x12.webp',
        images: [
            '../assets/optimized/imagenes-alfajores/alfajores-x12.webp'
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
        price: 27000,
        priceFormatted: '$27.000',
        category: 'minis',
        description: 'Vaso decorativo lleno de mini alfajores. Perfecto para regalar o disfrutar en porciones pequeñas.',
        mainImage: '../assets/optimized/imagenes-alfajores/alfajores-vaso-mini.webp',
        images: [
            '../assets/optimized/imagenes-alfajores/alfajores-vaso-mini.webp'
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
        price: 25000,
        priceFormatted: 'Desde $25.000',
        category: 'tortas',
        description: 'Torta de alfajor rellena de arequipe con 3 capas de relleno. Una experiencia única y deliciosa.',
        mainImage: '../assets/optimized/imagenes-alfajores/torta-alfajor1.webp',
        images: [
            '../assets/optimized/imagenes-alfajores/torta-alfajor1.webp',
            '../assets/optimized/imagenes-alfajores/torta-alfajor2.webp'
        ],
        includes: [
            'Torta de alfajor según tamaño',
            '3 capas de relleno de arequipe',
            'Capas de alfajor de maicena',
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
                    { value: 'personal', label: 'Personal (8 cm)', price: 25000 },
                    { value: '4-6', label: '4-6 porciones (11 cm)', price: 38000 },
                    { value: '6-8', label: '6-8 porciones (13 cm)', price: 45000 },
                    { value: '10-12', label: '10-12 porciones (16 cm)', price: 60000 }
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
        mainImage: '../assets/optimized/imagenes-alfajores/alfajor-bolsita.webp',
        images: [
            '../assets/optimized/imagenes-alfajores/alfajor-bolsita.webp',
            '../assets/optimized/imagenes-alfajores/alfajor-unidad.webp'
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
                priceModifier: true,
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
