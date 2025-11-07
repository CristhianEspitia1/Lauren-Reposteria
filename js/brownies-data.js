// Base de datos de productos - BROWNIES Y GALLETAS
// Datos extraídos de la página brownies-galletas.html

const detallesProductsData = {
    'brownies': {
        id: 'brownies',
        name: 'Brownies',
        price: 6500,
        priceFormatted: 'Desde $6.500',
        category: 'brownies',
        description: 'Brownie melcochudo a base de Nutella y chocolate al 70%. Toppings a tu elección: Nutella, Arequipe, M&M, Hershey\'s blanca y Galleta Oreo.',
        mainImage: '../assets/imagenes.brownies.galletas/Brownies/cajaX16.jpg',
        images: [
            '../assets/imagenes.brownies.galletas/Brownies/cajaX16.jpg',
            '../assets/imagenes.brownies.galletas/Brownies/browniesX3.jpg',
            '../assets/imagenes.brownies.galletas/Brownies/browniesX6.jpg',
            '../assets/imagenes.brownies.galletas/Brownies/browniesIndividuales.png'
        ],
        includes: [
            'Brownies hechos con Nutella y chocolate 70%',
            'Textura melcochuda perfecta',
            'Topping a elección',
            'Horneados frescos bajo pedido'
        ],
        customizable: true,
        options: [
            {
                id: 'presentacion',
                label: 'Presentación',
                type: 'radio',
                required: true,
                priceModifier: true,
                choices: [
                    { value: 'individual', label: 'Individual (4.5 cm) - Mínimo 6 unidades en bolsa', price: 6500 },
                    { value: 'caja-x3', label: 'Caja x3', price: 24000 },
                    { value: 'caja-x6', label: 'Caja x6', price: 43000 },
                    { value: 'caja-x16', label: 'Caja x16', price: 93000 },
                    { value: 'vaso-minis', label: 'Vaso de mini brownies x20 unidades (sin toppings)', price: 27000 }
                ]
            },
            {
                id: 'topping',
                label: 'Topping',
                type: 'radio',
                required: true,
                dependsOn: 'presentacion',
                showWhen: ['individual', 'caja-x3', 'caja-x6', 'caja-x16'],
                choices: [
                    { value: 'nutella', label: 'Nutella' },
                    { value: 'arequipe', label: 'Arequipe' },
                    { value: 'm&m', label: 'M&M' },
                    { value: 'hersheys', label: "Hershey's Blanca" },
                    { value: 'oreo', label: 'Galleta Oreo' }
                ]
            },
            {
                id: 'cantidad',
                label: 'Cantidad (solo para individuales)',
                type: 'radio',
                required: true,
                dependsOn: 'presentacion',
                showWhen: 'individual',
                priceModifier: true,
                choices: [
                    { value: '6', label: '6 unidades', price: 39000 },
                    { value: '12', label: '12 unidades', price: 78000 },
                    { value: '18', label: '18 unidades', price: 117000 },
                    { value: '24', label: '24 unidades', price: 156000 }
                ]
            }
        ],
        personalization: null
    },

    'galletas': {
        id: 'galletas',
        name: 'Galletas',
        price: 8000,
        priceFormatted: 'Desde $8.000',
        category: 'galletas',
        description: 'Galletas artesanales horneadas diariamente con ingredientes premium. Cada una tiene su relleno especial según el sabor.',
        mainImage: '../assets/imagenes.brownies.galletas/Galletas/1.png',
        images: [
            '../assets/imagenes.brownies.galletas/Galletas/1.png',
            '../assets/imagenes.brownies.galletas/Galletas/2.png',
            '../assets/imagenes.brownies.galletas/Galletas/3.jpg'
        ],
        includes: [
            'Galletas artesanales',
            'Ingredientes premium',
            'Relleno especial según sabor',
            'Horneadas frescas bajo pedido'
        ],
        customizable: true,
        options: [
            {
                id: 'presentacion',
                label: 'Presentación',
                type: 'radio',
                required: true,
                priceModifier: true,
                choices: [
                    { value: 'individual', label: 'Galleta Individual', price: 8000 },
                    { value: 'caja-surtida', label: 'Caja Surtida x6 unidades (todos los sabores)', price: 46000 }
                ]
            },
            {
                id: 'sabor',
                label: 'Sabor de la galleta',
                type: 'radio',
                required: true,
                dependsOn: 'presentacion',
                showWhen: 'individual',
                priceModifier: true,
                choices: [
                    { value: 'chips', label: 'Chips con Nueces + Nutella (Tradicional)', price: 8000 },
                    { value: 'red-velvet', label: 'Red Velvet con Chips Blanco + Crema de Queso (Tradicional)', price: 8000 },
                    { value: 'cocoa', label: 'Cocoa con Chocolate Semiamargo y al 70% (Tradicional)', price: 8000 },
                    { value: 'pistachos', label: 'Pistachos + Chocolate Blanco (Especial)', price: 10000 },
                    { value: 'chocolate-blanco', label: 'Chocolate Blanco + Mermelada de Frambuesa (Especial)', price: 10000 },
                    { value: 'panelita', label: 'Panelita Copelia + Arequipe (Especial)', price: 10000 }
                ]
            },
            {
                id: 'cantidad',
                label: 'Cantidad (mínimo 3 galletas)',
                type: 'radio',
                required: true,
                dependsOn: 'presentacion',
                showWhen: 'individual',
                priceModifier: true,
                choices: [
                    { value: '3', label: '3 galletas' },
                    { value: '6', label: '6 galletas' },
                    { value: '12', label: '12 galletas' }
                ]
            }
        ],
        personalization: null
    }
};

// Mapeo de productos por nombre
const productCardMapping = {
    'Brownies': 'brownies',
    'Brownies Lauren': 'brownies',
    'Galletas': 'galletas',
    'Galletas Lauren': 'galletas'
};
