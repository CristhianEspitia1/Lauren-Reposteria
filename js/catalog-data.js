/**
 * CATÁLOGO DE PRODUCTOS - LAUREN REPOSTERÍA
 * Actualizado desde el Tablero Visual
 */

const catalogData = {
    'torta-vintage': {
        id: 'torta-vintage',
        name: 'Torta Vintage',
        price: 96000,
        priceFormatted: 'Desde $96.000',
        category: 'tortas',
        description: 'Torta vintage con decoración artesanal, flores en fondant y acabado rústico elegante. Cada torta es única y personalizada según tus preferencias.',
        mainImage: '../assets/imagenes-tortas/06-galeria-vintage/Gemini_Generated_Image_reksf1reksf1reks.png',
        images: [
            "../assets/imagenes-tortas/06-galeria-vintage/Gemini_Generated_Image_reksf1reksf1reks.png",
            "../assets/imagenes-tortas/06-galeria-vintage/Gemini_Generated_Image_4tb78o4tb78o4tb7.png",
            "../assets/imagenes-tortas/06-galeria-vintage/Gemini_Generated_Image_3cka7v3cka7v3cka.png"
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
                        "label": "Zanahoria con Nueces"
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
                        "label": "Crema de Queso"
                    },
                    {
                        "value": "frutos-rojos",
                        "label": "Frutos Rojos"
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
                        "value": "8-10",
                        "label": "8-10 porciones",
                        "price": 95000
                    },
                    {
                        "value": "15-20",
                        "label": "15-20 porciones",
                        "price": 145000
                    },
                    {
                        "value": "25-30",
                        "label": "25-30 porciones",
                        "price": 210000
                    },
                    {
                        "value": "30-40",
                        "label": "30-40 porciones",
                        "price": 280000
                    },
                    {
                        "value": "40-50",
                        "label": "40-50 porciones",
                        "price": 350000
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej: Feliz Cumpleaños María",
            "maxLength": 40,
            "required": false,
            "note": "Todas las letras se realizan con moldes para garantizar un acabado profesional"
        }
    },

    'torta-sencilla': {
        id: 'torta-sencilla',
        name: 'Torta Sencilla',
        price: 70000,
        priceFormatted: 'Desde $70.000',
        category: 'tortas',
        description: 'Torta sencilla y elegante con acabado liso en crema. Perfecta para quienes buscan un diseño minimalista pero delicioso.',
        mainImage: '../assets/imagenes-tortas/07-tortas-sencillas/Gemini_Generated_Image_45m3co45m3co45m3.png',
        images: [
            "../assets/imagenes-tortas/07-tortas-sencillas/Gemini_Generated_Image_45m3co45m3co45m3.png",
            "../assets/imagenes-tortas/07-tortas-sencillas/Gemini_Generated_Image_vy4pszvy4pszvy4p.png",
            "../assets/imagenes-tortas/07-tortas-sencillas/Gemini_Generated_Image_6ttesv6ttesv6tte.png"
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
                        "label": "Zanahoria con Nueces"
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
                        "label": "Crema de Queso"
                    },
                    {
                        "value": "frutos-rojos",
                        "label": "Frutos Rojos"
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
                        "value": "8-10",
                        "label": "8-10 porciones",
                        "price": 70000
                    },
                    {
                        "value": "15-20",
                        "label": "15-20 porciones",
                        "price": 110000
                    },
                    {
                        "value": "25-30",
                        "label": "25-30 porciones",
                        "price": 165000
                    },
                    {
                        "value": "30-40",
                        "label": "30-40 porciones",
                        "price": 220000
                    },
                    {
                        "value": "40-50",
                        "label": "40-50 porciones",
                        "price": 275000
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej: Feliz Cumpleaños",
            "maxLength": 40,
            "required": false
        }
    },

    'extra-monos': {
        id: 'extra-monos',
        name: 'Moños (Lazitos)',
        price: 2000,
        priceFormatted: '$2.000 - $3.000',
        category: 'extras',
        description: 'Hermosos lazos decorativos para darle un toque tierno a tu torta.',
        mainImage: '../assets/logos/Detalles adicionales/lazo.png',
        personalization: null
    },

    'extra-mariposas': {
        id: 'extra-mariposas',
        name: 'Mariposas',
        price: 2000,
        priceFormatted: '$2.000 - $3.000',
        category: 'extras',
        description: 'Mariposas comestibles o decorativas que dan vida y movimiento.',
        mainImage: '../assets/logos/Detalles adicionales/mariposa.png',
        personalization: null
    },

    'extra-hbd': {
        id: 'extra-hbd',
        name: 'Happy Birthday',
        price: 5000,
        priceFormatted: '$5.000 - $8.000',
        category: 'extras',
        description: 'Topper de Happy Birthday en diversos estilos y colores.',
        mainImage: '../assets/logos/Detalles adicionales/hbd.png',
        personalization: null
    },

    'extra-perlas': {
        id: 'extra-perlas',
        name: 'Perlas Comestibles',
        price: 5000,
        priceFormatted: '$5.000 - $10.000',
        category: 'extras',
        description: 'Perlas en mayor cantidad para un acabado lujoso.',
        mainImage: '../assets/logos/Detalles adicionales/perla.png',
        personalization: null
    },

    'extra-coronas': {
        id: 'extra-coronas',
        name: 'Coronas Especiales',
        price: 0,
        priceFormatted: 'Precio en asesoría',
        category: 'extras',
        description: 'Diseños personalizados y únicos de coronas.',
        mainImage: '../assets/logos/Detalles adicionales/corona.png',
        personalization: null
    },

    'alfajor-personalizado': {
        id: 'alfajor-personalizado',
        name: 'Alfajores Personalizados',
        price: 60000,
        priceFormatted: '$60.000',
        category: 'alfajores',
        description: 'Alfajores de maicena personalizados con diseños únicos para tus celebraciones. Cada alfajor es decorado artesanalmente con fondant y detalles especiales según tu ocasión.',
        mainImage: '../assets/imagenes-alfajores/personalizados/aaa.jpg',
        images: [
            "../assets/imagenes-alfajores/personalizados/aaa.jpg",
            "../assets/imagenes-alfajores/personalizados/b.jpg",
            "../assets/imagenes-alfajores/personalizados/bb.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-22 at 19.11.33_03be5587.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-22 at 19.15.12_ce194214.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-22 at 19.30.22_44a7ffb4.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.02.55_d40a95c7.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.03.30_f1881042.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.04.09_49a8317f.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.04.58_9e0bd10b.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.05.09_520ee439.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.05.22_518737f4.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.05.57_19f53c16.jpg",
            "../assets/imagenes-alfajores/personalizados/WhatsApp Image 2025-10-23 at 14.06.08_75e702b1.jpg"
        ],
        includes: [
            "Alfajores de maicena rellenos de arequipe",
            "Decoración personalizada en fondant",
            "Diseño según tu ocasión especial",
            "Empaque decorativo incluido",
            "Producto artesanal 100%"
        ],
        customizable: true,
        options: [
            {
                "id": "diseno",
                "label": "Tipo de diseño",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "basico",
                        "label": "Diseño Básico - $60.000 (unidad)",
                        "price": 60000
                    }
                ]
            },
            {
                "id": "cantidad",
                "label": "Cantidad mínima",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "6",
                        "label": "6 unidades"
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "tema",
            "label": "Tema o motivo de la celebración",
            "placeholder": "Ej: Baby shower, Cumpleaños, Boda, etc.",
            "maxLength": 100,
            "required": true
        }
    },

    'caja-x6': {
        id: 'caja-x6',
        name: 'Caja x6 Alfajores',
        price: 16000,
        priceFormatted: '$16.000',
        category: 'alfajores',
        description: 'Deliciosos alfajores de maicena rellenos de arequipe. Perfectos para compartir o regalar. Presentación en caja elegante.',
        mainImage: '../assets/imagenes-alfajores/Alfajores x6.png',
        images: [
            "../assets/imagenes-alfajores/Alfajores x6.png"
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
        price: 32000,
        priceFormatted: '$32.000',
        category: 'alfajores',
        description: 'Docena de alfajores de maicena rellenos de arequipe. Ideal para compartir en reuniones o como regalo especial.',
        mainImage: '../assets/imagenes-alfajores/Alfajores x12.png',
        images: [
            "../assets/imagenes-alfajores/Alfajores x12.png"
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
        price: 14000,
        priceFormatted: '$14.000',
        category: 'alfajores',
        description: 'Vaso decorativo lleno de mini alfajores. Perfecto para regalar o disfrutar en porciones pequeñas.',
        mainImage: '../assets/imagenes-alfajores/Alfajores vaso mini.jpg',
        images: [
            "../assets/imagenes-alfajores/Alfajores vaso mini.jpg"
        ],
        includes: [
            "Vaso decorativo",
            "Mini alfajores (aprox. 15-20 unidades)",
            "Relleno de arequipe",
            "Presentación especial"
        ],
        customizable: false,
        personalization: null
    },

    'torta-alfajor': {
        id: 'torta-alfajor',
        name: 'Torta de Alfajor',
        price: 50000,
        priceFormatted: 'Desde $50.000',
        category: 'alfajores',
        description: 'Torta especial hecha con capas de alfajor de maicena, relleno de arequipe y cobertura de chocolate. Una experiencia única y deliciosa.',
        mainImage: '../assets/imagenes-alfajores/TortaAlfajor1.png',
        images: [
            "../assets/imagenes-alfajores/TortaAlfajor1.png",
            "../assets/imagenes-alfajores/TortaAlfajor2.png"
        ],
        includes: [
            "Torta de alfajor según tamaño",
            "Capas de alfajor de maicena",
            "Relleno de arequipe",
            "Cobertura de chocolate",
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
                        "price": 50000
                    },
                    {
                        "value": "4-6",
                        "label": "4-6 porciones (11 cm)",
                        "price": 62000
                    },
                    {
                        "value": "6-8",
                        "label": "6-8 porciones (13 cm)",
                        "price": 72000
                    },
                    {
                        "value": "10-12",
                        "label": "10-12 porciones (16 cm)",
                        "price": 87000
                    }
                ]
            }
        ],
        personalization: {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado (opcional)",
            "placeholder": "Ej: Feliz Cumpleaños",
            "maxLength": 30,
            "required": false
        }
    },

    'alfajor-individual': {
        id: 'alfajor-individual',
        name: 'Alfajores Individuales',
        price: 2000,
        priceFormatted: 'Desde $2.000',
        category: 'alfajores',
        description: 'Alfajores de maicena individuales empacados en bolsas. Se venden a partir de 6 unidades por referencia o tamaño.',
        mainImage: '../assets/imagenes-alfajores/AlfajorBolsita.png',
        images: [
            "../assets/imagenes-alfajores/AlfajorBolsita.png",
            "../assets/imagenes-alfajores/AlfajorUnidad.png"
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
                "label": "Presentación y precio por unidad",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "mini-3",
                        "label": "Minis x3 (2 cm c/u) - $3.000",
                        "price": 3000
                    },
                    {
                        "value": "mini-6",
                        "label": "Minis x6 (2 cm c/u) - $5.000",
                        "price": 5000
                    },
                    {
                        "value": "pequeno",
                        "label": "Pequeño unidad (3 cm) - $2.000",
                        "price": 2000
                    },
                    {
                        "value": "mediano",
                        "label": "Mediano unidad (4 cm) - $3.000",
                        "price": 3000
                    },
                    {
                        "value": "grande",
                        "label": "Grande unidad (5 cm) - $4.000",
                        "price": 4000
                    }
                ]
            }
        ],
        personalization: null
    },

    'brownies': {
        id: 'brownies',
        name: 'Brownies',
        price: 6500,
        priceFormatted: 'Desde $6.500',
        category: 'brownies',
        description: 'Brownie melcochudo a base de Nutella y chocolate al 70%. Toppings a tu elección: Nutella, Arequipe, M&M, Hershey\'s blanca y Galleta Oreo.',
        mainImage: '../assets/imagenes.brownies.galletas/Brownies/cajaX16.jpg',
        images: [
            "../assets/imagenes.brownies.galletas/Brownies/cajaX16.jpg",
            "../assets/imagenes.brownies.galletas/Brownies/browniesX3.jpg",
            "../assets/imagenes.brownies.galletas/Brownies/browniesX6.jpg",
            "../assets/imagenes.brownies.galletas/Brownies/browniesIndividuales.png"
        ],
        includes: [
            "Brownies hechos con Nutella y chocolate 70%",
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
                "priceModifier": true,
                "choices": [
                    {
                        "value": "individual",
                        "label": "Individual (4.5 cm) - Mínimo 6 unidades en bolsa",
                        "price": 6500
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
                        "label": "Vaso de mini brownies x20 unidades (sin toppings)",
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
                        "label": "Hershey's Blanca"
                    },
                    {
                        "value": "oreo",
                        "label": "Galleta Oreo"
                    }
                ]
            },
            {
                "id": "cantidad",
                "label": "Cantidad (solo para individuales)",
                "type": "radio",
                "required": true,
                "dependsOn": "presentacion",
                "showWhen": "individual",
                "priceModifier": true,
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
        price: 8000,
        priceFormatted: 'Desde $8.000',
        category: 'galletas',
        description: 'Galletas artesanales horneadas diariamente con ingredientes premium. Cada una tiene su relleno especial según el sabor.',
        mainImage: '../assets/imagenes.brownies.galletas/Galletas/1.png',
        images: [
            "../assets/imagenes.brownies.galletas/Galletas/1.png",
            "../assets/imagenes.brownies.galletas/Galletas/2.png",
            "../assets/imagenes.brownies.galletas/Galletas/3.jpg"
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
                "priceModifier": true,
                "choices": [
                    {
                        "value": "individual",
                        "label": "Galleta Individual",
                        "price": 8000
                    },
                    {
                        "value": "caja-surtida",
                        "label": "Caja Surtida x6 unidades (todos los sabores)",
                        "price": 46000
                    }
                ]
            },
            {
                "id": "sabor",
                "label": "Sabor de la galleta",
                "type": "radio",
                "required": true,
                "priceModifier": true,
                "choices": [
                    {
                        "value": "chips",
                        "label": "Chips con Nueces + Nutella (Tradicional)",
                        "price": 8000
                    },
                    {
                        "value": "red-velvet",
                        "label": "Red Velvet con Chips Blanco + Crema de Queso (Tradicional)",
                        "price": 8000
                    },
                    {
                        "value": "cocoa",
                        "label": "Cocoa con Chocolate Semiamargo y al 70% (Tradicional)",
                        "price": 8000
                    },
                    {
                        "value": "pistachos",
                        "label": "Pistachos + Chocolate Blanco (Especial)",
                        "price": 10000
                    },
                    {
                        "value": "chocolate-blanco",
                        "label": "Galleta con trozos de Chocolate Blanco + Mermelada de Frambuesa (Especial)",
                        "price": 10000
                    },
                    {
                        "value": "panelita",
                        "label": "Panelita Copelia + Arequipe (Especial)",
                        "price": 10000
                    }
                ]
            },
            {
                "id": "cantidad",
                "label": "Cantidad (mínimo 3 galletas)",
                "type": "radio",
                "required": true,
                "priceModifier": true,
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
        mainImage: '../assets/imagenes-detalles/productos/osos/Oso Pequeño.jpg',
        images: [
            "../assets/imagenes-detalles/productos/osos/Oso Pequeño.jpg"
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
                        "label": "Chocolate Blanco"
                    },
                    {
                        "value": "semiamargo",
                        "label": "Chocolate Semiamargo"
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
                        "label": "Chips con Nueces"
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
        priceFormatted: '$49.000',
        category: 'detalles',
        description: 'Oso de chocolate de tamaño grande acompañado de brownie, alfajores y galletas. Ideal para celebraciones especiales.',
        mainImage: '../assets/imagenes-detalles/productos/osos/Oso Grande.jpg',
        images: [
            "../assets/imagenes-detalles/productos/osos/Oso Grande.jpg",
            "../assets/imagenes-detalles/productos/osos/Oso Grande con letras.jpg"
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
                        "label": "Chocolate Blanco"
                    },
                    {
                        "value": "semiamargo",
                        "label": "Chocolate Semiamargo"
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
                        "label": "Chips con Nueces"
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
            "dependsOn": "mensaje-brownie"
        }
    },

    'oso-fresas': {
        id: 'oso-fresas',
        name: 'Oso con Fresas',
        price: 59000,
        priceFormatted: '$59.000',
        category: 'detalles',
        description: 'Oso de chocolate con fresas cubiertas, brownie y galleta. La combinación perfecta entre chocolate y frescura.',
        mainImage: '../assets/imagenes-detalles/productos/osos/Oso con fresas.jpg',
        images: [
            "../assets/imagenes-detalles/productos/osos/Oso con fresas.jpg"
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
                        "label": "Chocolate Blanco"
                    },
                    {
                        "value": "semiamargo",
                        "label": "Chocolate Semiamargo"
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
                        "label": "Crema de Chocolate Blanco"
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
                        "label": "Chips con Nueces"
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
                        "label": "Chocolate Blanco"
                    },
                    {
                        "value": "semiamargo",
                        "label": "Chocolate Semiamargo"
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
        description: 'Brownie de 4-6 porciones con mensaje personalizado, acompañado de galleta y mini alfajores.',
        mainImage: '../assets/imagenes-detalles/productos/mix/Detalle Brownie.jpg',
        images: [
            "../assets/imagenes-detalles/productos/mix/Detalle Brownie.jpg"
        ],
        includes: [
            "Brownie de 4-6 porciones",
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
                        "label": "Chips con Nueces"
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
        mainImage: '../assets/imagenes-detalles/productos/mix/Detalle HBD.jpg',
        images: [
            "../assets/imagenes-detalles/productos/mix/Detalle HBD.jpg"
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
                    "placeholder": "Ej: ABC",
                    "maxLength": 3,
                    "required": true
                },
                {
                    "id": "mensaje-torta",
                    "label": "Mensaje corto en fondant",
                    "placeholder": "Ej: Feliz Cumpleaños",
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
        mainImage: '../assets/imagenes-detalles/productos/mix/Margarita.jpg',
        images: [
            "../assets/imagenes-detalles/productos/mix/Margarita.jpg"
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
        mainImage: '../assets/imagenes-detalles/productos/mix/Detalle Mix.jpg',
        images: [
            "../assets/imagenes-detalles/productos/mix/Detalle Mix.jpg"
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
            "placeholder": "Ej: AB",
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
        mainImage: '../assets/imagenes-detalles/productos/mix/Detalle Mix 2.jpg',
        images: [
            "../assets/imagenes-detalles/productos/mix/Detalle Mix 2.jpg"
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
            "placeholder": "Ej: AB",
            "maxLength": 2,
            "required": true
        }
    },

    'detalle-golden-1': {
        id: 'detalle-golden-1',
        name: 'Detalle Golden',
        price: 83000,
        priceFormatted: '$83.000',
        category: 'detalles',
        description: 'Mini torta vasca, trufas de oreo, brownie grande y alfajor especial.',
        mainImage: '../assets/imagenes-detalles/productos/golden/Detalle Golden.jpg',
        images: [
            "../assets/imagenes-detalles/productos/golden/Detalle Golden.jpg"
        ],
        includes: [
            "Mini torta vasca",
            "4 trufas de oreo",
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

    'detalle-golden-2': {
        id: 'detalle-golden-2',
        name: 'Detalle Golden Rosa',
        price: 86000,
        priceFormatted: '$86.000',
        category: 'detalles',
        description: 'Mini torta vasca, trufas, brownie y mini galletas.',
        mainImage: '../assets/imagenes-detalles/productos/golden/Detalle Golden Rosa.jpg',
        images: [
            "../assets/imagenes-detalles/productos/golden/Detalle Golden Rosa.jpg"
        ],
        includes: [
            "Mini torta vasca",
            "3 trufas de oreo",
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
        price: 88000,
        priceFormatted: '$88.000',
        category: 'detalles',
        description: 'Mini torta vasca, trufas, galleta especial y alfajores.',
        mainImage: '../assets/imagenes-detalles/productos/golden/Detalle Golden Mostacho.jpg',
        images: [
            "../assets/imagenes-detalles/productos/golden/Detalle Golden Mostacho.jpg"
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
                "priceModifier": true,
                "choices": [
                    {
                        "value": "sencilla",
                        "label": "Galleta Sencilla ($88.000)",
                        "price": 88000
                    },
                    {
                        "value": "especial",
                        "label": "Galleta Especial ($94.000)",
                        "price": 94000
                    }
                ]
            },
            {
                "id": "sabor-galleta-sencilla",
                "label": "Sabor de galleta sencilla",
                "type": "radio",
                "required": false,
                "dependsOn": "tipo-galleta",
                "showWhen": "sencilla",
                "choices": [
                    {
                        "value": "chips-nutella",
                        "label": "Chips con Nueces (Nutella)"
                    },
                    {
                        "value": "red-velvet-queso",
                        "label": "Red Velvet (Crema de Queso)"
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
                "required": false,
                "dependsOn": "tipo-galleta",
                "showWhen": "especial",
                "choices": [
                    {
                        "value": "pistachos",
                        "label": "Pistachos (Chocolate Blanco)"
                    },
                    {
                        "value": "chocolate-mermelada",
                        "label": "Chocolate Blanco con Mermelada"
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

    'detalle-torta': {
        id: 'detalle-torta',
        name: 'Detalle con Torta',
        price: 105000,
        priceFormatted: '$105.000',
        category: 'detalles',
        description: 'Torta de 5 porciones personalizada con frase o número, acompañada de alfajores medianos.',
        mainImage: '../assets/imagenes-detalles/productos/golden/Detalle con torta.jpg',
        images: [
            "../assets/imagenes-detalles/productos/golden/Detalle con torta.jpg"
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
            "placeholder": "Ej: Feliz Cumpleaños, 25, Te Amo...",
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
