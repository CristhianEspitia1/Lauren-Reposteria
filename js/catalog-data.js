/**
 * CATÁLOGO DE PRODUCTOS - LAUREN REPOSTERÍA
 * Actualizado desde el Tablero Visual
 */

const catalogData = {
    'torta-vintage': {
        id: 'torta-vintage',
        name: 'Torta Vintage',
        price: 65000,
        priceFormatted: 'Desde $65.000',
        category: 'tortas',
        description: 'Torta vintage con bordes arriba, abajo y también en los laterales. Decoración artesanal, flores en fondant y acabado rústico elegante.',
        mainImage: '/assets/propuestas-fotograficas/torta-vintage.webp',
        images: [
            "/assets/propuestas-fotograficas/torta-vintage.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-01.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-02.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-06.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-16.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-09.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-05.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-08.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-32.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-28.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-24.webp",
            "/assets/propuestas-fotograficas/torta-rosas-mariposas.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-10.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-21.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-33.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-23.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-07.webp"
        ],
        includes: [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno premium",
            "Decoración vintage artesanal",
            "Flores y detalles en fondant"
        ],
        customizable: true,
        options: [
            {
                "id": "sabor",
                "label": "Sabor del bizcocho",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "chocolate",
                        "label": "Chocolate"
                    },
                    {
                        "value": "red-velvet",
                        "label": "Red Velvet"
                    },
                    {
                        "value": "vainilla",
                        "label": "Vainilla"
                    },
                    {
                        "value": "zanahoria",
                        "label": "Zanahoria con nueces"
                    }
                ]
            },
            {
                "id": "relleno",
                "label": "Relleno",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "arequipe",
                        "label": "Arequipe"
                    },
                    {
                        "value": "crema-queso",
                        "label": "Crema de queso"
                    },
                    {
                        "value": "frutos-rojos",
                        "label": "Frutos rojos"
                    },
                    {
                        "value": "chocolate",
                        "label": "Chocolate"
                    },
                    {
                        "value": "nutella",
                        "label": "Nutella"
                    }
                ]
            },
            {
                "id": "porciones",
                "label": "Número de porciones",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "4-5",
                        "label": "4 a 5 porciones",
                        "price": 65000
                    },
                    {
                        "value": "8-10",
                        "label": "8 a 10 porciones",
                        "price": 105000
                    },
                    {
                        "value": "12-15",
                        "label": "12 a 15 porciones",
                        "price": 150000
                    },
                    {
                        "value": "18-20",
                        "label": "18 a 20 porciones",
                        "price": 172000
                    },
                    {
                        "value": "25-30",
                        "label": "25 a 30 porciones",
                        "price": 235000
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej.: Feliz cumpleaños, María",
            "maxLength": 40,
            "required": false,
            "note": "Todas las letras se realizan con moldes para garantizar un acabado profesional"
        }
    },

    'torta-sencilla': {
        id: 'torta-sencilla',
        name: 'Torta Sencilla',
        price: 58000,
        priceFormatted: 'Desde $58.000',
        category: 'tortas',
        description: 'Torta sencilla y elegante sin bordes o crema adicional al de la cubierta. Perfecta para quienes buscan un diseño minimalista.',
        mainImage: '/assets/propuestas-fotograficas/torta-sencilla.webp',
        images: [
            "/assets/propuestas-fotograficas/torta-sencilla.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-03.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-04.webp"
        ],
        includes: [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno premium",
            "Acabado liso en crema",
            "Decoración sencilla elegante"
        ],
        customizable: true,
        options: [
            {
                "id": "sabor",
                "label": "Sabor del bizcocho",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "chocolate",
                        "label": "Chocolate"
                    },
                    {
                        "value": "red-velvet",
                        "label": "Red Velvet"
                    },
                    {
                        "value": "vainilla",
                        "label": "Vainilla"
                    },
                    {
                        "value": "zanahoria",
                        "label": "Zanahoria con nueces"
                    }
                ]
            },
            {
                "id": "relleno",
                "label": "Relleno",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "arequipe",
                        "label": "Arequipe"
                    },
                    {
                        "value": "crema-queso",
                        "label": "Crema de queso"
                    },
                    {
                        "value": "frutos-rojos",
                        "label": "Frutos rojos"
                    },
                    {
                        "value": "chocolate",
                        "label": "Chocolate"
                    },
                    {
                        "value": "nutella",
                        "label": "Nutella"
                    }
                ]
            },
            {
                "id": "porciones",
                "label": "Número de porciones",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "4-5",
                        "label": "4 a 5 porciones",
                        "price": 58000
                    },
                    {
                        "value": "8-10",
                        "label": "8 a 10 porciones",
                        "price": 90000
                    },
                    {
                        "value": "12-15",
                        "label": "12 a 15 porciones",
                        "price": 135000
                    },
                    {
                        "value": "18-20",
                        "label": "18 a 20 porciones",
                        "price": 155000
                    },
                    {
                        "value": "25-30",
                        "label": "25 a 30 porciones",
                        "price": 215000
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej.: Feliz cumpleaños",
            "maxLength": 40,
            "required": false
        }
    },

    'extra-monos': {
        id: 'extra-monos',
        icon: 'bow',
        name: 'Moños (lacitos)',
        price: 2000,
        priceFormatted: '$2.000 - $3.000',
        category: 'extras',
        description: 'Hermosos lazos decorativos para darle un toque tierno a tu torta.',
        mainImage: '/assets/optimized/logos/detalles-adicionales/mono.webp',
        personalization: null
    },

    'extra-mariposas': {
        id: 'extra-mariposas',
        icon: 'butterfly',
        name: 'Mariposas',
        price: 2000,
        priceFormatted: '$2.000 - $3.000',
        category: 'extras',
        description: 'Mariposas comestibles o decorativas que dan vida y movimiento.',
        mainImage: '/assets/optimized/logos/detalles-adicionales/mariposa.webp',
        personalization: null
    },

    'extra-hbd': {
        id: 'extra-hbd',
        icon: 'birthday-topper',
        name: 'Happy Birthday',
        price: 5000,
        priceFormatted: '$5.000 - $8.000',
        category: 'extras',
        description: 'Topper de Happy Birthday en diversos estilos y colores.',
        mainImage: '/assets/optimized/logos/detalles-adicionales/hb-1.webp',
        personalization: null
    },

    'extra-perlas': {
        id: 'extra-perlas',
        icon: 'pearls',
        name: 'Perlas comestibles',
        price: 5000,
        priceFormatted: '$5.000 - $10.000',
        category: 'extras',
        description: 'Perlas en mayor cantidad para un acabado lujoso.',
        mainImage: '/assets/optimized/logos/detalles-adicionales/perla.webp',
        personalization: null
    },

    'extra-coronas': {
        id: 'extra-coronas',
        icon: 'crown',
        name: 'Coronas especiales',
        price: 0,
        priceFormatted: 'Precio en asesoría',
        category: 'extras',
        description: 'Diseños personalizados y únicos de coronas.',
        mainImage: '/assets/optimized/logos/detalles-adicionales/corona.webp',
        personalization: null
    },

    'alfajor-personalizado': {
        id: 'alfajor-personalizado',
        // Confirmado por el negocio (octubre de 2026): $60.000 por caja de 6.
        name: 'Alfajores Personalizados',
        price: 60000,
        priceFormatted: '$60.000 la caja',
        category: 'alfajores',
        description: 'Caja de 6 alfajores de maicena personalizados para tu celebración. Cada alfajor se decora a mano en fondant según tu ocasión.',
        mainImage: '/assets/propuestas-fotograficas/alfajor-personalizado.webp',
        images: [
            "/assets/propuestas-fotograficas/alfajor-personalizado.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-01.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-02.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-03.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-04.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-05.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-06.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-07.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-08.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-09.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-10.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-11.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-12.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-13.webp"
        ],
        includes: [
            "6 alfajores de maicena rellenos de arequipe",
            "Decoración personalizada en fondant",
            "Diseño según tu ocasión",
            "Empaque decorativo",
            "Producto 100 % artesanal"
        ],
        customizable: true,
        personalization: {
            "enabled": true,
            "field": "tema",
            "label": "Tema o motivo de la celebración",
            "placeholder": "Ej.: baby shower, cumpleaños, boda",
            "maxLength": 100,
            "required": true
        }
    },

    'caja-x6': {
        id: 'caja-x6',
        name: 'Caja x6 Alfajores',
        price: 22000,
        priceFormatted: '$22.000',
        category: 'alfajores',
        description: 'Deliciosos alfajores de maicena rellenos de arequipe. Perfectos para compartir o regalar. Presentación en caja elegante.',
        mainImage: '/assets/propuestas-fotograficas/caja-x6.webp',
        images: [
            "/assets/propuestas-fotograficas/caja-x6.webp"
        ],
        includes: [
            "6 alfajores de maicena",
            "Relleno generoso de arequipe",
            "Caja para regalo",
            "Producto artesanal"
        ],
        customizable: false,
        personalization: null
    },

    'caja-x12': {
        id: 'caja-x12',
        name: 'Caja x12 Alfajores',
        price: 37000,
        priceFormatted: '$37.000',
        category: 'alfajores',
        description: 'Docena de alfajores de maicena rellenos de arequipe. Ideal para compartir en reuniones o como regalo especial.',
        mainImage: '/assets/propuestas-fotograficas/caja-x12.webp',
        images: [
            "/assets/propuestas-fotograficas/caja-x12.webp"
        ],
        includes: [
            "12 alfajores de maicena",
            "Relleno generoso de arequipe",
            "Caja para regalo",
            "Producto artesanal"
        ],
        customizable: false,
        personalization: null
    },

    'vaso-minis': {
        id: 'vaso-minis',
        name: 'Vaso de Mini Alfajores',
        price: 27000,
        priceFormatted: '$27.000',
        category: 'alfajores',
        description: 'Vaso decorativo lleno de mini alfajores. Perfecto para regalar o disfrutar en porciones pequeñas.',
        mainImage: '/assets/propuestas-fotograficas/vaso-minis.webp',
        images: [
            "/assets/propuestas-fotograficas/vaso-minis.webp"
        ],
        includes: [
            "Vaso decorativo",
            "Mini alfajores (30 unidades)",
            "Relleno de arequipe",
            "Presentación especial"
        ],
        customizable: false,
        personalization: null
    },

    'torta-alfajor': {
        id: 'torta-alfajor',
        name: 'Torta de Alfajor',
        price: 25000,
        priceFormatted: 'Desde $25.000',
        category: 'alfajores',
        description: 'Torta de alfajor rellena de arequipe con 3 capas de relleno. Una experiencia única y deliciosa.',
        mainImage: '/assets/propuestas-fotograficas/torta-alfajor.webp',
        images: [
            "/assets/propuestas-fotograficas/torta-alfajor.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-14.webp"
        ],
        includes: [
            "Torta de alfajor según tamaño",
            "3 capas de relleno de arequipe",
            "Capas de alfajor de maicena",
            "Decoración elegante"
        ],
        customizable: true,
        options: [
            {
                "id": "tamano",
                "label": "Tamaño de la torta",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "personal",
                        "label": "Personal (8 cm)",
                        "price": 25000
                    },
                    {
                        "value": "4-6",
                        "label": "4 a 6 porciones (11 cm)",
                        "price": 38000
                    },
                    {
                        "value": "6-8",
                        "label": "6 a 8 porciones (13 cm)",
                        "price": 45000
                    },
                    {
                        "value": "10-12",
                        "label": "10 a 12 porciones (16 cm)",
                        "price": 60000
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado (opcional)",
            "placeholder": "Ej.: Feliz cumpleaños",
            "maxLength": 30,
            "required": false
        }
    },

    'alfajor-individual': {
        id: 'alfajor-individual',
        name: 'Alfajores Individuales',
        price: 2000,
        priceFormatted: 'Desde $2.000 c/u',
        category: 'alfajores',
        description: 'Alfajores de maicena individuales empacados en bolsas. Se venden a partir de 6 unidades por referencia o tamaño.',
        mainImage: '/assets/propuestas-fotograficas/alfajor-individual.webp',
        images: [
            "/assets/propuestas-fotograficas/alfajor-individual.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-15.webp"
        ],
        includes: [
            "Alfajores de maicena rellenos de arequipe",
            "Empacado en bolsas individuales",
            "Venta mínima: 6 unidades por referencia o tamaño",
            "Producto artesanal 100%"
        ],
        customizable: true,
        options: [
            {
                "id": "presentacion",
                "label": "Presentación",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "mini-3",
                        "label": "Bolsita de 3 minis (2 cm)",
                        "price": 3000
                    },
                    {
                        "value": "mini-6",
                        "label": "Bolsita de 6 minis (2 cm)",
                        "price": 5000
                    },
                    {
                        "value": "pequeno",
                        "label": "Pequeño (3 cm)",
                        "price": 2000,
                        "perUnit": true
                    },
                    {
                        "value": "mediano",
                        "label": "Mediano (4 cm)",
                        "price": 3000,
                        "perUnit": true
                    },
                    {
                        "value": "grande",
                        "label": "Grande (5 cm)",
                        "price": 4000,
                        "perUnit": true
                    }
                ]
            }
        ],
        personalization: null
    },

    'brownies': {
        id: 'brownies',
        name: 'Brownies',
        price: 24000,
        priceFormatted: 'Desde $24.000',
        category: 'brownies',
        description: 'Brownie melcochudo a base de Nutella y chocolate al 70 %. Toppings a tu elección: Nutella, arequipe, M&M, Hershey\'s blanca y galleta Oreo.',
        mainImage: '/assets/propuestas-fotograficas/brownies.webp',
        images: [
            "/assets/propuestas-fotograficas/brownies.webp",
            "/assets/propuestas-fotograficas/galeria-brownies-01.webp",
            "/assets/propuestas-fotograficas/galeria-brownies-02.webp",
            "/assets/propuestas-fotograficas/galeria-brownies-03.webp"
        ],
        includes: [
            "Brownies hechos con Nutella y chocolate al 70 %",
            "Textura melcochuda perfecta",
            "Topping a elección",
            "Horneados frescos bajo pedido"
        ],
        customizable: true,
        options: [
            {
                "id": "presentacion",
                "label": "Presentación",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "individual",
                        "label": "Individual (4,5 cm), en bolsa",
                        "price": 6500,
                        "perUnit": true
                    },
                    {
                        "value": "caja-x3",
                        "label": "Caja x3",
                        "price": 24000
                    },
                    {
                        "value": "caja-x6",
                        "label": "Caja x6",
                        "price": 43000
                    },
                    {
                        "value": "caja-x16",
                        "label": "Caja x16",
                        "price": 93000
                    },
                    {
                        "value": "vaso-minis",
                        "label": "Vaso de 20 mini brownies (sin toppings)",
                        "price": 27000
                    }
                ]
            },
            {
                "id": "topping",
                "label": "Topping",
                "type": "radio",
                "required": true,
                "dependsOn": "presentacion",
                "showWhen": [
                    "individual",
                    "caja-x3",
                    "caja-x6",
                    "caja-x16"
                ],
                "choices": [
                    {
                        "value": "nutella",
                        "label": "Nutella"
                    },
                    {
                        "value": "arequipe",
                        "label": "Arequipe"
                    },
                    {
                        "value": "m&m",
                        "label": "M&M"
                    },
                    {
                        "value": "hersheys",
                        "label": "Hershey's blanca"
                    },
                    {
                        "value": "oreo",
                        "label": "Galleta Oreo"
                    }
                ]
            },
            {
                "id": "cantidad",
                "label": "Unidades en la bolsa",
                "type": "radio",
                "required": true,
                "dependsOn": "presentacion",
                "showWhen": "individual",
                "choices": [
                    {
                        "value": "6",
                        "label": "6 unidades",
                        "price": 39000
                    },
                    {
                        "value": "12",
                        "label": "12 unidades",
                        "price": 78000
                    },
                    {
                        "value": "18",
                        "label": "18 unidades",
                        "price": 117000
                    },
                    {
                        "value": "24",
                        "label": "24 unidades",
                        "price": 156000
                    }
                ]
            }
        ],
        personalization: null
    },

    'galletas': {
        id: 'galletas',
        name: 'Galletas',
        price: 24000,
        priceFormatted: 'Desde $24.000',
        category: 'galletas',
        description: 'Galletas artesanales horneadas diariamente con ingredientes premium. Cada una tiene su relleno especial según el sabor.',
        mainImage: '/assets/propuestas-fotograficas/galletas.webp',
        images: [
            "/assets/propuestas-fotograficas/galletas.webp",
            "/assets/propuestas-fotograficas/galeria-galletas-01.webp",
            "/assets/propuestas-fotograficas/galeria-galletas-02-r2.webp"
        ],
        includes: [
            "Galletas artesanales",
            "Ingredientes premium",
            "Relleno especial según sabor",
            "Horneadas frescas bajo pedido"
        ],
        customizable: true,
        options: [
            {
                "id": "presentacion",
                "label": "Presentación",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "individual",
                        "label": "Galletas individuales",
                        "price": 8000
                    },
                    {
                        "value": "caja-surtida",
                        "label": "Caja surtida x6 (todos los sabores)",
                        "price": 46000
                    }
                ]
            },
            {
                "id": "sabor",
                "label": "Sabor de la galleta",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "chips",
                        "label": "Chips con nueces + Nutella (tradicional)",
                        "price": 8000,
                        "perUnit": true
                    },
                    {
                        "value": "red-velvet",
                        "label": "Red velvet con chips blancos + crema de queso (tradicional)",
                        "price": 8000,
                        "perUnit": true
                    },
                    {
                        "value": "cocoa",
                        "label": "Cocoa con chocolate semiamargo y al 70 % (tradicional)",
                        "price": 8000,
                        "perUnit": true
                    },
                    {
                        "value": "pistachos",
                        "label": "Pistachos + chocolate blanco (especial)",
                        "price": 10000,
                        "perUnit": true
                    },
                    {
                        "value": "chocolate-blanco",
                        "label": "Trozos de chocolate blanco + mermelada de frambuesa (especial)",
                        "price": 10000,
                        "perUnit": true
                    },
                    {
                        "value": "panelita",
                        "label": "Panelita Copelia + arequipe (especial)",
                        "price": 10000,
                        "perUnit": true
                    }
                ]
            },
            {
                "id": "cantidad",
                "label": "Número de galletas (mínimo 3)",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "3",
                        "label": "3 galletas"
                    },
                    {
                        "value": "6",
                        "label": "6 galletas"
                    },
                    {
                        "value": "12",
                        "label": "12 galletas"
                    }
                ]
            }
        ],
        personalization: null
    },

    'oso-pequeno': {
        id: 'oso-pequeno',
        name: 'Oso Pequeño',
        price: 27000,
        priceFormatted: '$27.000',
        category: 'detalles',
        description: 'Adorable oso de chocolate acompañado de mini alfajores y galletas. Perfecto para sorprender con un detalle dulce y especial.',
        mainImage: '/assets/propuestas-fotograficas/oso-pequeno.webp',
        images: [
            "/assets/propuestas-fotograficas/oso-pequeno.webp"
        ],
        includes: [
            "Oso de chocolate (blanco o semiamargo)",
            "6 mini alfajores rellenos de arequipe",
            "3 mini galletas (chips con nueces o red velvet)"
        ],
        customizable: true,
        options: [
            {
                "id": "tipo-chocolate",
                "label": "Tipo de chocolate del oso",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "blanco",
                        "label": "Chocolate blanco"
                    },
                    {
                        "value": "semiamargo",
                        "label": "Chocolate semiamargo"
                    }
                ]
            },
            {
                "id": "sabor-galletas",
                "label": "Sabor de las mini galletas",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "chips",
                        "label": "Chips con nueces"
                    },
                    {
                        "value": "red-velvet",
                        "label": "Red Velvet"
                    }
                ]
            },
            {
                "id": "decoracion-oso",
                "label": "Decoración del oso",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "corazon-rojo",
                        "label": "Corazón de chocolate rojo"
                    },
                    {
                        "value": "corazon-dorado",
                        "label": "Corazón de chocolate dorado"
                    },
                    {
                        "value": "rosa-roja",
                        "label": "Rosa de chocolate roja"
                    },
                    {
                        "value": "rosa-dorada",
                        "label": "Rosa de chocolate dorada"
                    }
                ]
            }
        ],
        personalization: null
    },

    'oso-grande': {
        id: 'oso-grande',
        name: 'Oso Grande',
        price: 49000,
        priceFormatted: 'Desde $49.000',
        category: 'detalles',
        description: 'Oso de chocolate de tamaño grande acompañado de brownie, alfajores y galletas. Ideal para celebraciones especiales.',
        mainImage: '/assets/propuestas-fotograficas/oso-grande.webp',
        images: [
            "/assets/propuestas-fotograficas/oso-grande.webp",
            "/assets/propuestas-fotograficas/galeria-detalles-01.webp"
        ],
        includes: [
            "Oso de chocolate (blanco o semiamargo)",
            "Brownie grande con Nutella",
            "6 alfajores pequeños rellenos de arequipe",
            "2 galletas grandes"
        ],
        customizable: true,
        options: [
            {
                "id": "tipo-chocolate",
                "label": "Tipo de chocolate del oso",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "blanco",
                        "label": "Chocolate blanco"
                    },
                    {
                        "value": "semiamargo",
                        "label": "Chocolate semiamargo"
                    }
                ]
            },
            {
                "id": "sabor-galletas",
                "label": "Sabor de las galletas grandes",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "chips",
                        "label": "Chips con nueces"
                    },
                    {
                        "value": "red-velvet",
                        "label": "Red Velvet"
                    },
                    {
                        "value": "cocoa",
                        "label": "Cocoa"
                    }
                ]
            },
            {
                "id": "decoracion-oso",
                "label": "Decoración del oso",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "corazon-rojo",
                        "label": "Corazón de chocolate rojo"
                    },
                    {
                        "value": "corazon-dorado",
                        "label": "Corazón de chocolate dorado"
                    },
                    {
                        "value": "rosa-roja",
                        "label": "Rosa de chocolate roja"
                    },
                    {
                        "value": "rosa-dorada",
                        "label": "Rosa de chocolate dorada"
                    }
                ]
            },
            {
                "id": "mensaje-brownie",
                "label": "¿Deseas agregar mensaje en el brownie?",
                "type": "toggle",
                "required": false,
                "priceModifier": 4000,
                "note": "Costo adicional: +$4.000"
            }
        ],
        personalization: {
            "enabled": true,
            "field": "mensaje-brownie",
            "label": "Mensaje personalizado en el brownie",
            "placeholder": "Escribe tu mensaje corto aquí...",
            "maxLength": 25,
            "dependsOn": "mensaje-brownie",
            "required": true
        }
    },

    'oso-fresas': {
        id: 'oso-fresas',
        name: 'Oso con Fresas',
        price: 59000,
        priceFormatted: '$59.000',
        category: 'detalles',
        description: 'Oso de chocolate con fresas cubiertas, brownie y galleta. La combinación perfecta entre chocolate y frescura.',
        mainImage: '/assets/propuestas-fotograficas/oso-fresas.webp',
        images: [
            "/assets/propuestas-fotograficas/oso-fresas.webp"
        ],
        includes: [
            "Oso de chocolate",
            "Brownie grande",
            "Galleta grande",
            "6 fresas cubiertas"
        ],
        customizable: true,
        options: [
            {
                "id": "tipo-chocolate-oso",
                "label": "Tipo de chocolate del oso",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "blanco",
                        "label": "Chocolate blanco"
                    },
                    {
                        "value": "semiamargo",
                        "label": "Chocolate semiamargo"
                    }
                ]
            },
            {
                "id": "relleno-brownie",
                "label": "Relleno del brownie",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "nutella",
                        "label": "Nutella"
                    },
                    {
                        "value": "chocolate-blanco",
                        "label": "Crema de chocolate blanco"
                    }
                ]
            },
            {
                "id": "sabor-galleta",
                "label": "Sabor de la galleta grande",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "chips",
                        "label": "Chips con nueces"
                    },
                    {
                        "value": "red-velvet",
                        "label": "Red Velvet"
                    },
                    {
                        "value": "cocoa",
                        "label": "Cocoa"
                    }
                ]
            },
            {
                "id": "chocolate-fresas",
                "label": "Tipo de chocolate para las fresas",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "blanco",
                        "label": "Chocolate blanco"
                    },
                    {
                        "value": "semiamargo",
                        "label": "Chocolate semiamargo"
                    }
                ]
            },
            {
                "id": "decoracion-oso",
                "label": "Decoración del oso",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "corazon-rojo",
                        "label": "Corazón de chocolate rojo"
                    },
                    {
                        "value": "corazon-dorado",
                        "label": "Corazón de chocolate dorado"
                    },
                    {
                        "value": "rosa-roja",
                        "label": "Rosa de chocolate roja"
                    },
                    {
                        "value": "rosa-dorada",
                        "label": "Rosa de chocolate dorada"
                    }
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
        category: 'detalles',
        description: 'Brownie de 4 a 6 porciones con mensaje personalizado, acompañado de galleta y mini alfajores.',
        mainImage: '/assets/propuestas-fotograficas/detalle-brownie.webp',
        images: [
            "/assets/propuestas-fotograficas/detalle-brownie.webp"
        ],
        includes: [
            "Brownie de 4 a 6 porciones",
            "1 galleta",
            "6 mini alfajores"
        ],
        customizable: true,
        options: [
            {
                "id": "relleno-brownie",
                "label": "Relleno del brownie",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "nutella",
                        "label": "Nutella"
                    },
                    {
                        "value": "arequipe",
                        "label": "Arequipe"
                    }
                ]
            },
            {
                "id": "sabor-galleta",
                "label": "Sabor de la galleta",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "chips",
                        "label": "Chips con nueces"
                    },
                    {
                        "value": "red-velvet",
                        "label": "Red Velvet"
                    },
                    {
                        "value": "cocoa",
                        "label": "Cocoa"
                    }
                ]
            },
            {
                "id": "decoracion-brownie",
                "label": "Decoración del brownie",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "corazones",
                        "label": "Corazones"
                    },
                    {
                        "value": "estrellas",
                        "label": "Estrellas"
                    },
                    {
                        "value": "mariposas",
                        "label": "Mariposas"
                    },
                    {
                        "value": "rosas",
                        "label": "Rosas"
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "mensaje-brownie",
            "label": "Mensaje personalizado en el brownie",
            "placeholder": "Escribe tu mensaje corto aquí...",
            "maxLength": 25,
            "required": true
        }
    },

    'detalle-hbd': {
        id: 'detalle-hbd',
        name: 'Detalle HBD',
        price: 92000,
        priceFormatted: '$92.000',
        category: 'detalles',
        description: 'Mini torta de cumpleaños con letras personalizadas, alfajores, galletas y trufas.',
        mainImage: '/assets/propuestas-fotograficas/detalle-hbd.webp',
        images: [
            "/assets/propuestas-fotograficas/detalle-hbd.webp"
        ],
        includes: [
            "Mini torta de vainilla",
            "3 iniciales de letras",
            "4 alfajores pequeños",
            "2 mini galletas",
            "3 trufas"
        ],
        customizable: true,
        options: [
            {
                "id": "color-letras",
                "label": "Color de las letras y decoración",
                "type": "select",
                "required": true,
                "multiple": true,
                "maxSelection": 2,
                "choices": [
                    {
                        "value": "blanco",
                        "label": "Blanco"
                    },
                    {
                        "value": "cafe",
                        "label": "Café"
                    },
                    {
                        "value": "azul",
                        "label": "Azul"
                    },
                    {
                        "value": "verde",
                        "label": "Verde"
                    },
                    {
                        "value": "lila",
                        "label": "Lila"
                    },
                    {
                        "value": "rosado",
                        "label": "Rosado"
                    },
                    {
                        "value": "rojo",
                        "label": "Rojo"
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "fields": [
                {
                    "id": "iniciales",
                    "label": "Iniciales para las letras (3 letras)",
                    "placeholder": "Ej.: ABC",
                    "maxLength": 3,
                    "required": true
                },
                {
                    "id": "mensaje-torta",
                    "label": "Mensaje corto en fondant",
                    "placeholder": "Ej.: Feliz cumpleaños",
                    "maxLength": 30,
                    "required": true
                }
            ]
        }
    },

    'detalle-margarita': {
        id: 'detalle-margarita',
        name: 'Detalle Margarita',
        price: 65000,
        priceFormatted: '$65.000',
        category: 'detalles',
        description: 'Variedad de delicias: alfajores, frambuesas cubiertas, mini galletas y brownie.',
        mainImage: '/assets/propuestas-fotograficas/detalle-margarita.webp',
        images: [
            "/assets/propuestas-fotograficas/detalle-margarita.webp"
        ],
        includes: [
            "Caja x6 alfajores",
            "Caja x4 frambuesas",
            "Caja x7 mini galletas",
            "Porción de brownie"
        ],
        customizable: false,
        personalization: null
    },

    'detalle-mix-1': {
        id: 'detalle-mix-1',
        name: 'Detalle Mix',
        price: 50000,
        priceFormatted: '$50.000',
        category: 'detalles',
        description: 'Letras personalizadas en chocolate, mini alfajores, chocolatina y galletas.',
        mainImage: '/assets/propuestas-fotograficas/detalle-mix-1.webp',
        images: [
            "/assets/propuestas-fotograficas/detalle-mix-1.webp"
        ],
        includes: [
            "2 iniciales de letras",
            "Mini alfajores",
            "Chocolatina M&M",
            "4 mini galletas"
        ],
        customizable: true,
        options: [
            {
                "id": "color-letras",
                "label": "Color de las letras",
                "type": "select",
                "required": true,
                "multiple": true,
                "maxSelection": 2,
                "choices": [
                    {
                        "value": "blanco",
                        "label": "Blanco"
                    },
                    {
                        "value": "cafe",
                        "label": "Café"
                    },
                    {
                        "value": "azul",
                        "label": "Azul"
                    },
                    {
                        "value": "verde",
                        "label": "Verde"
                    },
                    {
                        "value": "lila",
                        "label": "Lila"
                    },
                    {
                        "value": "rosado",
                        "label": "Rosado"
                    },
                    {
                        "value": "rojo",
                        "label": "Rojo"
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "iniciales",
            "label": "Iniciales para las letras (2 letras)",
            "placeholder": "Ej.: AB",
            "maxLength": 2,
            "required": true
        }
    },

    'detalle-mix-2': {
        id: 'detalle-mix-2',
        name: 'Detalle Mix 2',
        price: 56000,
        priceFormatted: '$56.000',
        category: 'detalles',
        description: 'Letras en chocolate, alfajores, chocolatina y brownies con arequipe.',
        mainImage: '/assets/propuestas-fotograficas/detalle-mix-2.webp',
        images: [
            "/assets/propuestas-fotograficas/detalle-mix-2.webp"
        ],
        includes: [
            "2 iniciales de letras",
            "4 alfajores pequeños",
            "Chocolatina M&M",
            "2 brownies con arequipe"
        ],
        customizable: true,
        options: [
            {
                "id": "color-letras",
                "label": "Color de las letras",
                "type": "select",
                "required": true,
                "multiple": true,
                "maxSelection": 2,
                "choices": [
                    {
                        "value": "blanco",
                        "label": "Blanco"
                    },
                    {
                        "value": "cafe",
                        "label": "Café"
                    },
                    {
                        "value": "azul",
                        "label": "Azul"
                    },
                    {
                        "value": "verde",
                        "label": "Verde"
                    },
                    {
                        "value": "lila",
                        "label": "Lila"
                    },
                    {
                        "value": "rosado",
                        "label": "Rosado"
                    },
                    {
                        "value": "rojo",
                        "label": "Rojo"
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "iniciales",
            "label": "Iniciales para las letras (2 letras)",
            "placeholder": "Ej.: AB",
            "maxLength": 2,
            "required": true
        }
    },

    'detalle-golden-1': {
        id: 'detalle-golden-1',
        name: 'Detalle Golden',
        price: 88000,
        priceFormatted: 'Desde $88.000',
        category: 'detalles',
        description: 'Mini torta vasca, trufas, galleta especial y alfajores.',
        mainImage: '/assets/propuestas-fotograficas/detalle-golden-1.webp',
        images: [
            "/assets/propuestas-fotograficas/detalle-golden-1.webp"
        ],
        includes: [
            "Mini torta vasca",
            "3 trufas",
            "1 galleta grande",
            "5 alfajores"
        ],
        customizable: true,
        options: [
            {
                "id": "relleno-torta-vasca",
                "label": "Relleno de la torta vasca",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "mermelada",
                        "label": "Mermelada"
                    },
                    {
                        "value": "arequipe",
                        "label": "Arequipe"
                    }
                ]
            },
            {
                "id": "tipo-galleta",
                "label": "Tipo de galleta",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "sencilla",
                        "label": "Galleta sencilla",
                        "price": 88000
                    },
                    {
                        "value": "especial",
                        "label": "Galleta especial",
                        "price": 94000
                    }
                ]
            },
            {
                "id": "sabor-galleta-sencilla",
                "label": "Sabor de galleta sencilla",
                "type": "radio",
                "required": true,
                "dependsOn": "tipo-galleta",
                "showWhen": "sencilla",
                "choices": [
                    {
                        "value": "chips-nutella",
                        "label": "Chips con nueces (Nutella)"
                    },
                    {
                        "value": "red-velvet-queso",
                        "label": "Red velvet (crema de queso)"
                    },
                    {
                        "value": "cocoa-chocolate",
                        "label": "Cocoa (Chocolate)"
                    }
                ]
            },
            {
                "id": "sabor-galleta-especial",
                "label": "Sabor de galleta especial",
                "type": "radio",
                "required": true,
                "dependsOn": "tipo-galleta",
                "showWhen": "especial",
                "choices": [
                    {
                        "value": "pistachos",
                        "label": "Pistachos (chocolate blanco)"
                    },
                    {
                        "value": "chocolate-mermelada",
                        "label": "Chocolate blanco con mermelada"
                    },
                    {
                        "value": "panelita-copelia",
                        "label": "Panelita Copelia (Arequipe)"
                    }
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
        category: 'detalles',
        description: 'Mini torta vasca, trufas, brownie y mini galletas.',
        mainImage: '/assets/propuestas-fotograficas/detalle-golden-2.webp',
        images: [
            "/assets/propuestas-fotograficas/detalle-golden-2.webp"
        ],
        includes: [
            "Mini torta vasca",
            "3 trufas de Oreo",
            "Brownie grande",
            "7 mini galletas"
        ],
        customizable: true,
        options: [
            {
                "id": "relleno-torta-vasca",
                "label": "Relleno de la torta vasca",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "mermelada",
                        "label": "Mermelada"
                    },
                    {
                        "value": "arequipe",
                        "label": "Arequipe"
                    }
                ]
            }
        ],
        personalization: null
    },

    'detalle-golden-3': {
        id: 'detalle-golden-3',
        name: 'Detalle Golden Mostacho',
        price: 83000,
        priceFormatted: '$83.000',
        category: 'detalles',
        description: 'Mini torta vasca, trufas de Oreo, brownie grande y alfajor especial.',
        mainImage: '/assets/propuestas-fotograficas/detalle-golden-3.webp',
        images: [
            "/assets/propuestas-fotograficas/detalle-golden-3.webp"
        ],
        includes: [
            "Mini torta vasca",
            "4 trufas de Oreo",
            "Brownie grande",
            "Alfajor mostacho"
        ],
        customizable: true,
        options: [
            {
                "id": "relleno-torta-vasca",
                "label": "Relleno de la torta vasca",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "mermelada",
                        "label": "Mermelada"
                    },
                    {
                        "value": "arequipe",
                        "label": "Arequipe"
                    }
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
        category: 'detalles',
        description: 'Torta de 5 porciones personalizada con frase o número, acompañada de alfajores medianos.',
        mainImage: '/assets/propuestas-fotograficas/detalle-torta.webp',
        images: [
            "/assets/propuestas-fotograficas/detalle-torta.webp"
        ],
        includes: [
            "Torta de 5 porciones",
            "5 alfajores medianos"
        ],
        customizable: true,
        options: [
            {
                "id": "sabor-torta",
                "label": "Sabor de la torta",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "vainilla",
                        "label": "Vainilla"
                    },
                    {
                        "value": "chocolate",
                        "label": "Chocolate"
                    },
                    {
                        "value": "red-velvet",
                        "label": "Red Velvet"
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "mensaje-torta",
            "label": "Frase corta o número para la torta",
            "placeholder": "Ej.: Feliz cumpleaños, 25, Te amo",
            "maxLength": 30,
            "required": true,
            "note": "Cualquier variación en el diseño de la torta puede cambiar el valor"
        }
    },

};

// Compatibilidad
const detallesProductsData = catalogData;
const productCardMapping = {};
// Mapeo automático de nombres a IDs
Object.values(catalogData).forEach(p => { productCardMapping[p.name] = p.id; });
