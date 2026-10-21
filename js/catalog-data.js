/**
 * Catálogo de productos de Lauren Repostería: solo datos, sin lógica.
 * Lo edita el centro de control; el formato de cada campo está en docs/12-catalogo.md.
 * Las reglas (precios, validaciones, etiquetas) viven en js/catalog-model.js.
 */
window.catalogData = {
    "torta-vintage": {
        "id": "torta-vintage",
        "name": "Tortas Vintage con frambuesas",
        "category": "tortas",
        "visible": true,
        "featured": true,
        "description": "Torta vintage con bordes clásicos en la parte superior e inferior, sutiles detalles en los laterales y frambuesas frescas sobre la torta.",
        "includes": [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno a elección",
            "Decoración vintage",
            "Frambuesas frescas",
            "Elección de colores"
        ],
        "notes": [
            "El precio corresponde a lo descrito y las porciones elegidas. Los cambios de diseño y los adicionales se confirman en la asesoría."
        ],
        "price": null,
        "mainImage": "/assets/propuestas-fotograficas/torta-vintage.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-vintage.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-16.webp"
        ],
        "options": [
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
                        "value": "chocolate",
                        "label": "Chocolate oscuro"
                    },
                    {
                        "value": "crema-de-vainilla",
                        "label": "Crema de vainilla"
                    },
                    {
                        "value": "ganache-de-cafe",
                        "label": "Ganache de café",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
                    },
                    {
                        "value": "mermelada-de-frutos-rojos",
                        "label": "Mermelada de frutos rojos",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
                    },
                    {
                        "value": "nutella",
                        "label": "Nutella",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
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
                        "label": "4 a 6 porciones",
                        "price": 110000
                    },
                    {
                        "value": "8-10",
                        "label": "8 a 10 porciones",
                        "price": 155000
                    },
                    {
                        "value": "12-15",
                        "label": "12 a 15 porciones",
                        "price": 215000
                    },
                    {
                        "value": "18-20",
                        "label": "18 a 20 porciones",
                        "price": 265000
                    },
                    {
                        "value": "25-30",
                        "label": "25 a 30 porciones",
                        "price": 385000
                    }
                ]
            },
            {
                "id": "adicionales",
                "label": "Adicionales",
                "type": "radio",
                "required": false,
                "multiple": true,
                "addons": true,
                "note": "Detalles que le ponemos a tu torta. Marca los que quieras: cada uno suma su valor al total.",
                "choices": [
                    {
                        "value": "monos-lacitos",
                        "label": "Moños (lacitos)",
                        "extra": {
                            "4-5": 2000,
                            "8-10": 2000,
                            "12-15": 4000,
                            "18-20": 4000,
                            "25-30": 6000
                        }
                    },
                    {
                        "value": "mariposas",
                        "label": "Mariposas",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    },
                    {
                        "value": "happy-birthday",
                        "label": "Happy Birthday(acrilico)",
                        "extra": {
                            "4-5": 9000,
                            "8-10": 12000,
                            "12-15": 15000,
                            "18-20": 15000,
                            "25-30": 18000
                        }
                    },
                    {
                        "value": "perlas-comestibles",
                        "label": "Perlas comestibles",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    },
                    {
                        "value": "glitter-comestible",
                        "label": "Glitter comestible",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 12000,
                            "25-30": 15000
                        }
                    }
                ],
                "maxSelection": 5
            }
        ],
        "personalization": {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej.: Feliz cumpleaños, María",
            "maxLength": 40,
            "required": false,
            "note": "Todas las letras se realizan con moldes para garantizar un acabado profesional"
        }
    },
    "torta-sencilla": {
        "id": "torta-sencilla",
        "name": "Torta Sencilla",
        "category": "tortas",
        "visible": true,
        "description": "Torta con diseño delicado que destaca por su sencillez y pequeños detalles. Decoraciones como frases cortas, corazones, pinceladas o flores de crema.",
        "includes": [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno a elección",
            "Acabado liso en crema",
            "Decoración sencilla",
            "Elección de colores"
        ],
        "notes": [
            "El precio corresponde a lo descrito y las porciones elegidas. Los cambios de diseño y los adicionales se confirman en la asesoría."
        ],
        "price": null,
        "mainImage": "/assets/propuestas-fotograficas/torta-sencilla.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-sencilla.webp",
            "/assets/propuestas-fotograficas/torta-chocolate-amor.webp",
            "/assets/propuestas-fotograficas/torta-rosa-diecinueve-r3.webp",
            "/assets/propuestas-fotograficas/torta-amor-amistad.webp"
        ],
        "options": [
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
                        "value": "chocolate",
                        "label": "Chocolate oscuro"
                    },
                    {
                        "value": "crema-de-vainilla",
                        "label": "Crema de vainilla"
                    },
                    {
                        "value": "ganache-de-cafe",
                        "label": "Ganache de café",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
                    },
                    {
                        "value": "mermelada-de-frutos-rojos",
                        "label": "Mermelada de frutos rojos",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
                    },
                    {
                        "value": "nutella",
                        "label": "Nutella",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
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
                        "label": "4 a 6 porciones",
                        "price": 70000
                    },
                    {
                        "value": "8-10",
                        "label": "8 a 10 porciones",
                        "price": 110000
                    },
                    {
                        "value": "12-15",
                        "label": "12 a 15 porciones",
                        "price": 150000
                    },
                    {
                        "value": "18-20",
                        "label": "18 a 20 porciones",
                        "price": 195000
                    },
                    {
                        "value": "25-30",
                        "label": "25 a 30 porciones",
                        "price": 285000
                    }
                ]
            },
            {
                "id": "adicionales",
                "label": "Adicionales",
                "type": "radio",
                "required": false,
                "multiple": true,
                "addons": true,
                "note": "Detalles que le ponemos a tu torta. Marca los que quieras: cada uno suma su valor al total.",
                "choices": [
                    {
                        "value": "monos-lacitos",
                        "label": "Moños (lacitos)",
                        "extra": {
                            "4-5": 2000,
                            "8-10": 2000,
                            "12-15": 4000,
                            "18-20": 4000,
                            "25-30": 6000
                        }
                    },
                    {
                        "value": "mariposas",
                        "label": "Mariposas",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    },
                    {
                        "value": "happy-birthday",
                        "label": "Happy Birthday",
                        "extra": {
                            "4-5": 9000,
                            "8-10": 12000,
                            "12-15": 15000,
                            "18-20": 15000,
                            "25-30": 18000
                        }
                    },
                    {
                        "value": "perlas-comestibles",
                        "label": "Perlas comestibles",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    },
                    {
                        "value": "glitter-comestible",
                        "label": "Glitter comestible",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 12000,
                            "25-30": 15000
                        }
                    }
                ],
                "maxSelection": 5
            }
        ],
        "personalization": {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej.: Feliz cumpleaños",
            "maxLength": 40,
            "required": false
        }
    },
    "galeria-tortas-01": {
        "id": "galeria-tortas-01",
        "name": "Torta Vintage Sencilla",
        "category": "tortas",
        "visible": true,
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-28.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-28.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-01.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-03.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-08.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-10.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-23.webp",
            "/assets/propuestas-fotograficas/torta-rosas-mariposas.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-02.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-33.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-21.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-24.webp",
            "/assets/propuestas-fotograficas/torta-azul-mami.webp"
        ],
        "options": [
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
                        "value": "chocolate",
                        "label": "Chocolate oscuro"
                    },
                    {
                        "value": "crema-de-vainilla",
                        "label": "Crema de vainilla"
                    },
                    {
                        "value": "ganache-de-cafe",
                        "label": "Ganache de café",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
                    },
                    {
                        "value": "mermelada-de-frutos-rojos",
                        "label": "Mermelada de frutos rojos",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
                    },
                    {
                        "value": "nutella",
                        "label": "Nutella",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
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
                        "label": "4 a 6 porciones",
                        "price": 80000
                    },
                    {
                        "value": "8-10",
                        "label": "8 a 10 porciones",
                        "price": 125000
                    },
                    {
                        "value": "12-15",
                        "label": "12 a 15 porciones",
                        "price": 160000
                    },
                    {
                        "value": "18-20",
                        "label": "18 a 20 porciones",
                        "price": 210000
                    },
                    {
                        "value": "25-30",
                        "label": "25 a 30 porciones",
                        "price": 305000
                    }
                ]
            },
            {
                "id": "adicionales",
                "label": "Adicionales",
                "type": "radio",
                "required": false,
                "multiple": true,
                "addons": true,
                "note": "Detalles que le ponemos a tu torta. Marca los que quieras: cada uno suma su valor al total.",
                "choices": [
                    {
                        "value": "monos-lacitos",
                        "label": "Moños (lacitos)",
                        "extra": {
                            "4-5": 2000,
                            "8-10": 2000,
                            "12-15": 4000,
                            "18-20": 4000,
                            "25-30": 6000
                        }
                    },
                    {
                        "value": "mariposas",
                        "label": "Mariposas",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    },
                    {
                        "value": "happy-birthday",
                        "label": "Happy Birthday",
                        "extra": {
                            "4-5": 9000,
                            "8-10": 12000,
                            "12-15": 15000,
                            "18-20": 15000,
                            "25-30": 18000
                        }
                    },
                    {
                        "value": "perlas-comestibles",
                        "label": "Perlas comestibles",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    },
                    {
                        "value": "glitter-comestible",
                        "label": "Glitter comestible",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 12000,
                            "25-30": 15000
                        }
                    }
                ],
                "maxSelection": 5
            }
        ],
        "description": "Torta Vintage sencilla con bordes clásicos en la parte superior e inferir, sutiles detalles en los laterales, frase corta sobre la torta y elección de colores a tu gusto.\n(Cualquier detalle que no este mencionado será adicional y puedes consultarlo en la sección de \"adicionales\" o durante la asesoría)",
        "includes": [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno a elección",
            "Decoración vintage",
            "Frase corta",
            "Elección de colores"
        ],
        "notes": [
            "El precio corresponde a lo descrito y las porciones elegidas. Los cambios de diseño y los adicionales se confirman en la asesoría."
        ],
        "price": null,
        "personalization": {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej.: Feliz cumpleaños, María",
            "maxLength": 40,
            "required": false,
            "note": "Todas las letras se realizan con moldes para garantizar un acabado profesional"
        }
    },
    "galeria-tortas-06": {
        "id": "galeria-tortas-06",
        "name": "Tortas con personajes",
        "category": "tortas",
        "visible": true,
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-39.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-39.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-11.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-12.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-13.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-15.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-14.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-17.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-22.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-20.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-27.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-29.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-30.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-31.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-36.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-34.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-37.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-38.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-41.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-40.webp"
        ],
        "options": [
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
                        "value": "chocolate",
                        "label": "Chocolate oscuro"
                    },
                    {
                        "value": "crema-de-vainilla",
                        "label": "Crema de vainilla"
                    },
                    {
                        "value": "ganache-de-cafe",
                        "label": "Ganache de café",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
                    },
                    {
                        "value": "mermelada-de-frutos-rojos",
                        "label": "Mermelada de frutos rojos",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
                    },
                    {
                        "value": "nutella",
                        "label": "Nutella",
                        "extra": {
                            "4-5": 4000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 15000,
                            "25-30": 25000
                        }
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
                        "label": "4 a 6 porciones",
                        "price": 104000
                    },
                    {
                        "value": "8-10",
                        "label": "8 a 10 porciones",
                        "price": 145000
                    },
                    {
                        "value": "12-15",
                        "label": "12 a 15 porciones",
                        "price": 190000
                    },
                    {
                        "value": "18-20",
                        "label": "18 a 20 porciones",
                        "price": 240000
                    },
                    {
                        "value": "25-30",
                        "label": "25 a 30 porciones",
                        "price": 345000
                    }
                ]
            },
            {
                "id": "adicionales",
                "label": "Adicionales",
                "type": "radio",
                "required": false,
                "multiple": true,
                "addons": true,
                "note": "Detalles que le ponemos a tu torta. Marca los que quieras: cada uno suma su valor al total.",
                "choices": [
                    {
                        "value": "monos-lacitos",
                        "label": "Moños (lacitos)",
                        "extra": {
                            "4-5": 2000,
                            "8-10": 2000,
                            "12-15": 4000,
                            "18-20": 4000,
                            "25-30": 6000
                        }
                    },
                    {
                        "value": "mariposas",
                        "label": "Mariposas",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    },
                    {
                        "value": "happy-birthday",
                        "label": "Happy Birthday",
                        "extra": {
                            "4-5": 9000,
                            "8-10": 12000,
                            "12-15": 15000,
                            "18-20": 15000,
                            "25-30": 18000
                        }
                    },
                    {
                        "value": "perlas-comestibles",
                        "label": "Perlas comestibles",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    },
                    {
                        "value": "glitter-comestible",
                        "label": "Glitter comestible",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 8000,
                            "12-15": 10000,
                            "18-20": 12000,
                            "25-30": 15000
                        }
                    }
                ],
                "maxSelection": 5
            }
        ],
        "description": "Torta sencilla con personajes o temáticas específicas, las figuras van impresas en papel comestible y sobre fondant.",
        "includes": [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno a elección",
            "Figuras impresas en papel de azúcar",
            "Elección de colores"
        ],
        "notes": [
            "El precio corresponde a lo descrito y las porciones elegidas. Los cambios de diseño y los adicionales se confirman en la asesoría."
        ],
        "price": null,
        "personalization": {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej.: Feliz cumpleaños, María",
            "maxLength": 40,
            "required": false,
            "note": "Todas las letras se realizan con moldes para garantizar un acabado profesional"
        }
    },
    "galeria-tortas-18": {
        "id": "galeria-tortas-18",
        "name": "Torta con flores naturales",
        "category": "tortas",
        "visible": true,
        "description": "Un diseño hecho a mano para tu celebración. Elige las porciones, el bizcocho y el relleno; confirmamos contigo el valor final por WhatsApp.",
        "includes": [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno premium",
            "Decoración como la de la foto, hecha a mano"
        ],
        "notes": [
            "Es un precio de referencia según las porciones. Confirmamos contigo el valor final de este diseño y sus adicionales por WhatsApp."
        ],
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-18.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-18.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-26.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-25.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-35.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-19.webp"
        ],
        "price": null,
        "options": [
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
                        "value": "chocolate",
                        "label": "Chocolate oscuro"
                    },
                    {
                        "value": "crema-de-vainilla",
                        "label": "Crema de vainilla"
                    },
                    {
                        "value": "ganache-de-cafe",
                        "label": "Ganache de café"
                    },
                    {
                        "value": "mermelada-de-frutos-rojos",
                        "label": "Mermelada de frutos rojos"
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
                        "label": "4 a 6 porciones",
                        "price": 110000
                    },
                    {
                        "value": "8-10",
                        "label": "8 a 10 porciones",
                        "price": 155000
                    },
                    {
                        "value": "12-15",
                        "label": "12 a 15 porciones",
                        "price": 215000
                    },
                    {
                        "value": "18-20",
                        "label": "18 a 20 porciones",
                        "price": 265000
                    },
                    {
                        "value": "25-30",
                        "label": "25 a 30 porciones",
                        "price": 385000
                    }
                ]
            },
            {
                "id": "adicionales",
                "label": "Adicionales",
                "type": "radio",
                "required": false,
                "multiple": true,
                "addons": true,
                "note": "Detalles que le ponemos a tu torta. Marca los que quieras: cada uno suma su valor al total.",
                "choices": [
                    {
                        "value": "monos-lacitos",
                        "label": "Moños (lacitos)",
                        "extra": {
                            "4-5": 2000,
                            "8-10": 2000,
                            "12-15": 4000,
                            "18-20": 4000,
                            "25-30": 6000
                        }
                    },
                    {
                        "value": "mariposas",
                        "label": "Mariposas",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    },
                    {
                        "value": "happy-birthday",
                        "label": "Happy Birthday",
                        "extra": {
                            "4-5": 9000,
                            "8-10": 12000,
                            "12-15": 15000,
                            "18-20": 15000,
                            "25-30": 18000
                        }
                    },
                    {
                        "value": "perlas-comestibles",
                        "label": "Perlas comestibles",
                        "extra": {
                            "4-5": 5000,
                            "8-10": 5000,
                            "12-15": 8000,
                            "18-20": 8000,
                            "25-30": 10000
                        }
                    }
                ],
                "maxSelection": 4
            }
        ],
        "personalization": {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej.: Feliz cumpleaños, María",
            "maxLength": 40,
            "required": false,
            "note": "Todas las letras se realizan con moldes para garantizar un acabado profesional"
        }
    },
    "mini-cake": {
        "id": "mini-cake",
        "name": "Mini cake",
        "category": "tortas",
        "visible": true,
        "description": "Mini torta con diseños sencillos o tipo vintage, en este tamaño no se realiza cualquier decoración, solo las referencias seleccionadas.\n(Puedes consultar mediante WhatsApp si tienes otro diseño diferente)",
        "includes": [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno a elección",
            "Decoración Sencilla o tipo vintage",
            "Elección de colores"
        ],
        "notes": [
            "El precio corresponde a lo descrito y las porciones elegidas. Los cambios de diseño y los adicionales se confirman en la asesoría."
        ],
        "price": null,
        "mainImage": "/assets/propuestas-fotograficas/torta-negra-cumpleanos.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-negra-cumpleanos.webp",
            "/assets/propuestas-fotograficas/torta-uno.webp"
        ],
        "options": [
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
                        "value": "chocolate",
                        "label": "Chocolate oscuro"
                    },
                    {
                        "value": "ganache-de-cafe",
                        "label": "Ganache de café",
                        "extra": {
                            "4-5": 4000
                        }
                    },
                    {
                        "value": "nutella",
                        "label": "Nutella",
                        "extra": {
                            "4-5": 4000
                        }
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
                        "label": "2 a 4 porciones",
                        "price": 58000
                    }
                ]
            },
            {
                "id": "adicionales",
                "label": "Adicionales",
                "type": "radio",
                "required": false,
                "multiple": true,
                "addons": true,
                "note": "Detalles que le ponemos a tu torta. Marca los que quieras: cada uno suma su valor al total.",
                "choices": [
                    {
                        "value": "monos-lacitos",
                        "label": "Moños (lacitos)",
                        "extra": {
                            "4-5": 3000
                        }
                    },
                    {
                        "value": "mariposas",
                        "label": "Mariposas",
                        "extra": {
                            "4-5": 5000
                        }
                    },
                    {
                        "value": "perlas-comestibles",
                        "label": "Perlas comestibles",
                        "extra": {
                            "4-5": 5000
                        }
                    },
                    {
                        "value": "glitter-comestible",
                        "label": "Glitter comestible",
                        "extra": {
                            "4-5": 5000
                        }
                    }
                ],
                "maxSelection": 4
            }
        ],
        "personalization": {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej.: Feliz cumpleaños, María",
            "maxLength": 40,
            "required": false,
            "note": "Todas las letras se realizan con moldes para garantizar un acabado profesional"
        }
    },
    "extra-monos": {
        "id": "extra-monos",
        "name": "Moños (lacitos)",
        "category": "extras",
        "visible": true,
        "description": "Hermosos lazos decorativos para darle un toque tierno a tu torta.",
        "price": 2000,
        "priceMax": 3000,
        "icon": "bow",
        "options": [],
        "personalization": null,
        "priceText": "De $2.000 a $6.000"
    },
    "extra-mariposas": {
        "id": "extra-mariposas",
        "name": "Mariposas",
        "category": "extras",
        "visible": true,
        "description": "Mariposas comestibles o decorativas que dan vida y movimiento.",
        "price": 2000,
        "priceMax": 3000,
        "icon": "butterfly",
        "options": [],
        "personalization": null,
        "priceText": "$5.000 a $10.000"
    },
    "extra-hbd": {
        "id": "extra-hbd",
        "name": "Happy Birthday",
        "category": "extras",
        "visible": true,
        "description": "Topper de Happy Birthday en diversos estilos y colores.",
        "price": 5000,
        "priceMax": 8000,
        "icon": "birthday-topper",
        "options": [],
        "personalization": null,
        "priceText": "$9.000 a $18.000"
    },
    "extra-perlas": {
        "id": "extra-perlas",
        "name": "Perlas comestibles",
        "category": "extras",
        "visible": true,
        "description": "Perlas en mayor cantidad para un acabado lujoso.",
        "price": 5000,
        "priceMax": 10000,
        "icon": "pearls",
        "options": [],
        "personalization": null
    },
    "extra-coronas": {
        "id": "extra-coronas",
        "name": "Coronas especiales",
        "category": "extras",
        "visible": true,
        "description": "Diseños personalizados y únicos de coronas.",
        "price": null,
        "icon": "crown",
        "options": [],
        "personalization": null
    },
    "caja-x6": {
        "id": "caja-x6",
        "name": "Caja x6 Alfajores",
        "category": "alfajores",
        "group": "cajas",
        "visible": true,
        "featured": true,
        "summary": "Seis pequeños bocados de maicena y arequipe.",
        "description": "Deliciosos alfajores de maicena rellenos de arequipe. Perfectos para compartir o regalar. Presentación en caja elegante.",
        "includes": [
            "6 alfajores de maicena",
            "Relleno generoso de arequipe",
            "Caja para regalo",
            "Producto artesanal"
        ],
        "price": 25000,
        "mainImage": "/assets/propuestas-fotograficas/caja-x6.webp",
        "images": [
            "/assets/propuestas-fotograficas/caja-x6.webp"
        ],
        "options": [],
        "personalization": null
    },
    "caja-x12": {
        "id": "caja-x12",
        "name": "Caja x12 Alfajores",
        "category": "alfajores",
        "group": "cajas",
        "visible": true,
        "summary": "Una docena de razones para compartir.",
        "description": "Docena de alfajores de maicena rellenos de arequipe. Ideal para compartir en reuniones o como regalo especial.",
        "includes": [
            "12 alfajores de maicena",
            "Relleno generoso de arequipe",
            "Caja para regalo",
            "Producto artesanal"
        ],
        "price": 40000,
        "mainImage": "/assets/propuestas-fotograficas/caja-x12.webp",
        "images": [
            "/assets/propuestas-fotograficas/caja-x12.webp"
        ],
        "options": [],
        "personalization": null
    },
    "vaso-minis": {
        "id": "vaso-minis",
        "name": "Vaso de Mini Alfajores",
        "category": "alfajores",
        "group": "cajas",
        "visible": true,
        "summary": "30 mini alfajores en un vaso para regalar.",
        "description": "Vaso decorativo lleno de mini alfajores. Perfecto para regalar o disfrutar en porciones pequeñas.",
        "includes": [
            "Mini alfajores (30 unidades)",
            "Relleno de arequipe",
            "Presentación especial"
        ],
        "price": 28000,
        "mainImage": "/assets/propuestas-fotograficas/vaso-minis.webp",
        "images": [
            "/assets/propuestas-fotograficas/vaso-minis.webp"
        ],
        "options": [],
        "personalization": null
    },
    "torta-alfajor": {
        "id": "torta-alfajor",
        "name": "Torta de Alfajor",
        "category": "alfajores",
        "group": "especiales",
        "visible": true,
        "summary": "Tres capas de arequipe para celebrar distinto.",
        "description": "Torta de alfajor rellena de arequipe con 3 capas de relleno. Una experiencia única y deliciosa.",
        "includes": [
            "Torta de alfajor según tamaño",
            "3 capas de relleno de arequipe",
            "Capas de alfajor de maicena"
        ],
        "price": null,
        "mainImage": "/assets/propuestas-fotograficas/torta-alfajor.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-alfajor.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-14.webp"
        ],
        "options": [
            {
                "id": "tamano",
                "label": "Tamaño de la torta",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "personal",
                        "label": "Personal (8 cm)",
                        "price": 27000
                    },
                    {
                        "value": "4-6",
                        "label": "4 a 6 porciones (11 cm)",
                        "price": 42000
                    },
                    {
                        "value": "6-8",
                        "label": "6 a 8 porciones (13 cm)",
                        "price": 52000
                    },
                    {
                        "value": "10-12",
                        "label": "10 a 12 porciones (16 cm)",
                        "price": 64000
                    }
                ]
            }
        ],
        "personalization": null
    },
    "alfajor-individual": {
        "id": "alfajor-individual",
        "name": "Alfajores Individuales",
        "category": "alfajores",
        "group": "especiales",
        "visible": true,
        "summary": "Tu presentación favorita, desde 6 unidades.",
        "description": "Alfajores de maicena individuales empacados en bolsas. Se venden a partir de 6 unidades por referencia o tamaño.",
        "includes": [
            "Alfajores de maicena rellenos de arequipe",
            "Empacado en bolsas individuales",
            "Venta mínima: 6 unidades por referencia o tamaño",
            "Producto artesanal 100%"
        ],
        "notes": [
            "Mínimo 6 unidades de la misma presentación. El precio mostrado es por unidad o bolsita, según tu elección."
        ],
        "price": null,
        "priceSuffix": "c/u",
        "minimum": 6,
        "quantityLabel": "Unidades o bolsitas",
        "mainImage": "/assets/propuestas-fotograficas/alfajor-individual.webp",
        "images": [
            "/assets/propuestas-fotograficas/alfajor-individual.webp",
            "/assets/propuestas-fotograficas/galeria-alfajores-15.webp"
        ],
        "options": [
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
        "personalization": null
    },
    "alfajor-personalizado": {
        "id": "alfajor-personalizado",
        "name": "Alfajores Personalizados",
        "category": "alfajores",
        "group": "especiales",
        "visible": true,
        "summary": "Tu ocasión, convertida en un detalle comestible.",
        "description": "Caja de 6 alfajores de maicena con relleno de arequipe, decoración en fondant o impresión comestible según el diseño que requieras (puedes confirmar mediante WhatsApp como seria la decoración)",
        "includes": [
            "6 alfajores de maicena rellenos de arequipe",
            "Decoración en fondant o impresión comestible",
            "Caja con tapa transparente y moño"
        ],
        "notes": [
            "Cada caja trae 6 alfajores decorados con el mismo tema. Afinamos el diseño contigo por WhatsApp."
        ],
        "price": 60000,
        "priceSuffix": "la caja",
        "quantityLabel": "Número de cajas",
        "mainImage": "/assets/propuestas-fotograficas/alfajor-personalizado.webp",
        "images": [
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
        "options": [],
        "personalization": {
            "enabled": true,
            "field": "tema",
            "label": "Tema o motivo de la celebración",
            "placeholder": "Ej.: baby shower, cumpleaños, boda",
            "maxLength": 100,
            "required": true
        }
    },
    "brownies": {
        "id": "brownies",
        "name": "Brownies",
        "category": "brownies",
        "visible": true,
        "summary": "Chocolate al 70 %, Nutella y tus toppings favoritos.",
        "description": "Brownie melcochudo a base de Nutella y chocolate al 70 %. Toppings a tu elección: Nutella, arequipe, M&M, Hershey's blanca y galleta Oreo.",
        "includes": [
            "Brownies hechos con Nutella y chocolate al 70 %",
            "Textura melcochuda perfecta",
            "Topping a elección",
            "Horneados frescos bajo pedido"
        ],
        "notes": [
            "El vaso de minis no incluye toppings."
        ],
        "price": null,
        "mainImage": "/assets/propuestas-fotograficas/brownies.webp",
        "images": [
            "/assets/propuestas-fotograficas/brownies.webp",
            "/assets/propuestas-fotograficas/galeria-brownies-01.webp",
            "/assets/propuestas-fotograficas/galeria-brownies-02.webp",
            "/assets/propuestas-fotograficas/galeria-brownies-03.webp"
        ],
        "options": [
            {
                "id": "presentacion",
                "label": "Presentación",
                "type": "radio",
                "required": true,
                "choices": [
                    {
                        "value": "caja-x3",
                        "label": "Caja x3",
                        "price": 26000
                    },
                    {
                        "value": "caja-x6",
                        "label": "Caja x6",
                        "price": 45000
                    },
                    {
                        "value": "caja-x16",
                        "label": "Caja x16",
                        "price": 95000
                    },
                    {
                        "value": "vaso-minis",
                        "label": "Vaso de 20 mini brownies (sin toppings)",
                        "price": 28000
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
                ],
                "multiple": true,
                "maxSelection": {
                    "caja-x3": 3,
                    "caja-x6": 3,
                    "caja-x16": 5
                }
            }
        ],
        "personalization": null
    },
    "galleta-chips": {
        "id": "galleta-chips",
        "name": "Galleta Chips con nueces",
        "category": "galletas",
        "visible": true,
        "summary": "Con relleno de Nutella.",
        "description": "Galleta artesanal de chips con nueces y un centro suave de Nutella. Horneada con ingredientes premium.",
        "includes": [
            "Galleta artesanal",
            "Ingredientes premium",
            "Relleno de Nutella",
            "Horneada fresca bajo pedido"
        ],
        "notes": [
            "Mínimo 3 galletas."
        ],
        "price": 10000,
        "mainImage": "/assets/propuestas-fotograficas/galleta-nutella-corte.webp",
        "images": [
            "/assets/propuestas-fotograficas/galleta-nutella-corte.webp",
            "/assets/propuestas-fotograficas/galleta-nutella-mano.webp"
        ],
        "options": [
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
                ],
                "multiplier": true
            }
        ],
        "personalization": null
    },
    "galleta-red-velvet": {
        "id": "galleta-red-velvet",
        "name": "Galleta Red Velvet",
        "category": "galletas",
        "visible": true,
        "summary": "Chips blancos y crema de queso.",
        "description": "Galleta artesanal de red velvet con chips blancos y relleno de crema de queso. Horneada con ingredientes premium.",
        "includes": [
            "Galleta artesanal",
            "Ingredientes premium",
            "Relleno de crema de queso",
            "Horneada fresca bajo pedido"
        ],
        "notes": [
            "Mínimo 3 galletas."
        ],
        "price": 8000,
        "mainImage": "/assets/propuestas-fotograficas/galeria-galletas-01.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-galletas-01.webp"
        ],
        "options": [
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
                ],
                "multiplier": true
            }
        ],
        "personalization": null
    },
    "galleta-cocoa": {
        "id": "galleta-cocoa",
        "name": "Galleta Cocoa",
        "category": "galletas",
        "visible": true,
        "summary": "Chocolate semiamargo y al 70 %.",
        "description": "Galleta artesanal de cocoa con chocolate semiamargo y al 70 %. Horneada con ingredientes premium.",
        "includes": [
            "Galleta artesanal",
            "Ingredientes premium",
            "Chocolate semiamargo y al 70 %",
            "Horneada fresca bajo pedido"
        ],
        "notes": [
            "Mínimo 3 galletas."
        ],
        "price": 8000,
        "mainImage": "/assets/propuestas-fotograficas/galleta-chocolate.webp",
        "images": [
            "/assets/propuestas-fotograficas/galleta-chocolate.webp",
            "/assets/propuestas-fotograficas/galeria-galletas-02-r2.webp"
        ],
        "options": [
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
                ],
                "multiplier": true
            }
        ],
        "personalization": null
    },
    "galleta-pistachos": {
        "id": "galleta-pistachos",
        "name": "Galleta de Pistachos",
        "category": "galletas",
        "visible": true,
        "summary": "Con chocolate blanco.",
        "description": "Galleta artesanal de pistachos con chocolate blanco. Horneada con ingredientes premium.",
        "includes": [
            "Galleta artesanal",
            "Ingredientes premium",
            "Chocolate blanco",
            "Horneada fresca bajo pedido"
        ],
        "notes": [
            "Mínimo 3 galletas."
        ],
        "price": 10000,
        "mainImage": "/assets/propuestas-fotograficas/galleta-pistacho.webp",
        "images": [
            "/assets/propuestas-fotograficas/galleta-pistacho.webp"
        ],
        "options": [
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
                ],
                "multiplier": true
            }
        ],
        "personalization": null
    },
    "galleta-chocolate-blanco": {
        "id": "galleta-chocolate-blanco",
        "name": "Galleta de Chocolate blanco",
        "category": "galletas",
        "visible": true,
        "summary": "Con mermelada de frambuesa.",
        "description": "Galleta artesanal de trozos de chocolate blanco y mermelada de frambuesa. Horneada con ingredientes premium.",
        "includes": [
            "Galleta artesanal",
            "Ingredientes premium",
            "Mermelada de frambuesa",
            "Horneada fresca bajo pedido"
        ],
        "notes": [
            "Mínimo 3 galletas."
        ],
        "price": 10000,
        "mainImage": "/assets/propuestas-fotograficas/galletas-especiales.webp",
        "images": [
            "/assets/propuestas-fotograficas/galletas-especiales.webp"
        ],
        "options": [
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
                ],
                "multiplier": true
            }
        ],
        "personalization": null
    },
    "galleta-panelita": {
        "id": "galleta-panelita",
        "name": "Galleta de Panelita Copelia",
        "category": "galletas",
        "visible": true,
        "summary": "Con relleno de arequipe.",
        "description": "Galleta artesanal de Panelita Copelia y relleno de arequipe. Horneada con ingredientes premium.",
        "includes": [
            "Galleta artesanal",
            "Ingredientes premium",
            "Relleno de arequipe",
            "Horneada fresca bajo pedido"
        ],
        "notes": [
            "Mínimo 3 galletas."
        ],
        "price": 10000,
        "mainImage": "/assets/propuestas-fotograficas/galletas.webp",
        "images": [
            "/assets/propuestas-fotograficas/galletas.webp"
        ],
        "options": [
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
                ],
                "multiplier": true
            }
        ],
        "personalization": null
    },
    "galletas-caja-surtida": {
        "id": "galletas-caja-surtida",
        "name": "Caja surtida de galletas",
        "category": "galletas",
        "visible": true,
        "featured": true,
        "summary": "Los seis sabores en una sola caja.",
        "description": "Seis galletas artesanales, una de cada sabor: tres tradicionales y tres especiales. Horneadas con ingredientes premium.",
        "includes": [
            "6 galletas, una de cada sabor",
            "Ingredientes premium",
            "Relleno especial según sabor",
            "Horneadas frescas bajo pedido"
        ],
        "price": 46000,
        "mainImage": "/assets/propuestas-fotograficas/galletas-tres-chocolates.webp",
        "images": [
            "/assets/propuestas-fotograficas/galletas-tres-chocolates.webp"
        ],
        "options": [],
        "personalization": null
    },
    "oso-pequeno": {
        "id": "oso-pequeno",
        "name": "Oso Pequeño",
        "category": "detalles",
        "group": "osos",
        "visible": true,
        "featured": true,
        "description": "Adorable oso de chocolate acompañado de mini alfajores y galletas. Perfecto para sorprender con un detalle dulce y especial.",
        "includes": [
            "Oso de chocolate (blanco o semiamargo)",
            "6 mini alfajores rellenos de arequipe",
            "3 mini galletas (chips con nueces o red velvet)"
        ],
        "price": 28000,
        "mainImage": "/assets/propuestas-fotograficas/oso-pequeno.webp",
        "images": [
            "/assets/propuestas-fotograficas/oso-pequeno.webp"
        ],
        "options": [
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
        "personalization": null
    },
    "oso-grande": {
        "id": "oso-grande",
        "name": "Oso Grande",
        "category": "detalles",
        "group": "osos",
        "visible": true,
        "description": "Oso de chocolate  acompañado de brownie, alfajores y galletas. Ideal para celebraciones especiales.",
        "includes": [
            "Oso de chocolate (blanco o semiamargo)",
            "Brownie grande con Nutella",
            "6 alfajores pequeños rellenos de arequipe",
            "2 galletas grandes"
        ],
        "price": 54000,
        "mainImage": "/assets/propuestas-fotograficas/oso-grande.webp",
        "images": [
            "/assets/propuestas-fotograficas/oso-grande.webp",
            "/assets/propuestas-fotograficas/galeria-detalles-01.webp"
        ],
        "options": [
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
        "personalization": {
            "enabled": true,
            "field": "mensaje-brownie",
            "label": "Mensaje personalizado en el brownie",
            "placeholder": "Escribe tu mensaje corto aquí...",
            "maxLength": 25,
            "dependsOn": "mensaje-brownie",
            "required": true
        }
    },
    "oso-fresas": {
        "id": "oso-fresas",
        "name": "Oso con Fresas",
        "category": "detalles",
        "group": "osos",
        "visible": true,
        "description": "Oso de chocolate con fresas cubiertas, brownie y galleta. La combinación perfecta entre chocolate y frescura.",
        "includes": [
            "Oso de chocolate (blanco o semiamargo)",
            "Brownie grande",
            "Galleta grande",
            "6 fresas cubiertas de chocolate (blanco o semiamargo)"
        ],
        "price": 61000,
        "mainImage": "/assets/propuestas-fotograficas/oso-fresas.webp",
        "images": [
            "/assets/propuestas-fotograficas/oso-fresas.webp"
        ],
        "options": [
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
        "personalization": null
    },
    "detalle-brownie": {
        "id": "detalle-brownie",
        "name": "Detalle Brownie",
        "category": "detalles",
        "group": "mix",
        "visible": true,
        "description": "Brownie de 4 a 6 porciones con mensaje personalizado, acompañado de galleta y mini alfajores.",
        "includes": [
            "Brownie de 4 a 6 porciones",
            "1 galleta",
            "6 mini alfajores"
        ],
        "price": 60000,
        "mainImage": "/assets/propuestas-fotograficas/detalle-brownie.webp",
        "images": [
            "/assets/propuestas-fotograficas/detalle-brownie.webp"
        ],
        "options": [
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
        "personalization": {
            "enabled": true,
            "field": "mensaje-brownie",
            "label": "Mensaje personalizado en el brownie",
            "placeholder": "Escribe tu mensaje corto aquí...",
            "maxLength": 25,
            "required": true
        }
    },
    "detalle-hbd": {
        "id": "detalle-hbd",
        "name": "Detalle HBD",
        "category": "detalles",
        "group": "mix",
        "visible": false,
        "description": "Mini torta de cumpleaños con letras personalizadas, alfajores, galletas y trufas.",
        "includes": [
            "Mini torta de vainilla",
            "3 iniciales de letras",
            "4 alfajores pequeños",
            "2 mini galletas",
            "3 trufas"
        ],
        "price": 92000,
        "mainImage": "/assets/propuestas-fotograficas/detalle-hbd.webp",
        "images": [
            "/assets/propuestas-fotograficas/detalle-hbd.webp"
        ],
        "options": [
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
        "personalization": {
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
    "detalle-margarita": {
        "id": "detalle-margarita",
        "name": "Detalle Margarita",
        "category": "detalles",
        "group": "mix",
        "visible": true,
        "description": "Variedad de delicias: alfajores, frambuesas cubiertas, mini galletas y brownie.",
        "includes": [
            "Caja x6 alfajores",
            "Caja x4 frambuesas cubiertas de chocolate",
            "Caja x7 mini galletas surtidas",
            "Porción de brownie con crema de chocolate blanco"
        ],
        "price": 67000,
        "mainImage": "/assets/propuestas-fotograficas/detalle-margarita.webp",
        "images": [
            "/assets/propuestas-fotograficas/detalle-margarita.webp"
        ],
        "options": [],
        "personalization": null
    },
    "detalle-torta": {
        "id": "detalle-torta",
        "name": "Detalle con Torta",
        "category": "detalles",
        "group": "golden",
        "visible": false,
        "description": "Torta de 5 porciones personalizada con frase o número, acompañada de alfajores medianos.",
        "includes": [
            "Torta de 5 porciones",
            "5 alfajores medianos"
        ],
        "price": 105000,
        "mainImage": "/assets/propuestas-fotograficas/detalle-torta.webp",
        "images": [
            "/assets/propuestas-fotograficas/detalle-torta.webp"
        ],
        "options": [
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
        "personalization": {
            "enabled": true,
            "field": "mensaje-torta",
            "label": "Frase corta o número para la torta",
            "placeholder": "Ej.: Feliz cumpleaños, 25, Te amo",
            "maxLength": 30,
            "required": true,
            "note": "Cualquier variación en el diseño de la torta puede cambiar el valor"
        }
    },
    "detalle-mix-1": {
        "id": "detalle-mix-1",
        "name": "Detalle Mix",
        "category": "detalles",
        "group": "mix",
        "visible": false,
        "description": "Letras personalizadas en chocolate, mini alfajores, chocolatina y galletas.",
        "includes": [
            "2 iniciales de letras",
            "Mini alfajores",
            "Chocolatina M&M",
            "4 mini galletas"
        ],
        "price": 50000,
        "mainImage": "/assets/propuestas-fotograficas/detalle-mix-1.webp",
        "images": [
            "/assets/propuestas-fotograficas/detalle-mix-1.webp"
        ],
        "options": [
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
        "personalization": {
            "enabled": true,
            "field": "iniciales",
            "label": "Iniciales para las letras (2 letras)",
            "placeholder": "Ej.: AB",
            "maxLength": 2,
            "required": true
        }
    },
    "detalle-mix-2": {
        "id": "detalle-mix-2",
        "name": "Detalle Mix 2",
        "category": "detalles",
        "group": "mix",
        "visible": false,
        "description": "Letras en chocolate, alfajores, chocolatina y brownies con arequipe.",
        "includes": [
            "2 iniciales de letras",
            "4 alfajores pequeños",
            "Chocolatina M&M",
            "2 brownies con arequipe"
        ],
        "price": 56000,
        "mainImage": "/assets/propuestas-fotograficas/detalle-mix-2.webp",
        "images": [
            "/assets/propuestas-fotograficas/detalle-mix-2.webp"
        ],
        "options": [
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
        "personalization": {
            "enabled": true,
            "field": "iniciales",
            "label": "Iniciales para las letras (2 letras)",
            "placeholder": "Ej.: AB",
            "maxLength": 2,
            "required": true
        }
    },
    "detalle-golden-1": {
        "id": "detalle-golden-1",
        "name": "Detalle Golden",
        "category": "detalles",
        "group": "golden",
        "visible": true,
        "description": "Mini torta vasca, trufas, galleta especial y alfajores.",
        "includes": [
            "Mini torta vasca",
            "3 trufas",
            "1 galleta grande",
            "5 alfajores"
        ],
        "price": null,
        "mainImage": "/assets/propuestas-fotograficas/detalle-golden-1.webp",
        "images": [
            "/assets/propuestas-fotograficas/detalle-golden-1.webp"
        ],
        "options": [
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
                        "price": 85000
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
            }
        ],
        "personalization": null
    },
    "detalle-golden-2": {
        "id": "detalle-golden-2",
        "name": "Detalle Golden Rosa",
        "category": "detalles",
        "group": "golden",
        "visible": true,
        "description": "Mini torta vasca, trufas, brownie y mini galletas.",
        "includes": [
            "Mini torta vasca",
            "3 trufas de Oreo",
            "Brownie grande",
            "7 mini galletas"
        ],
        "price": 85000,
        "mainImage": "/assets/propuestas-fotograficas/detalle-golden-2.webp",
        "images": [
            "/assets/propuestas-fotograficas/detalle-golden-2.webp"
        ],
        "options": [
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
        "personalization": null
    },
    "detalle-golden-3": {
        "id": "detalle-golden-3",
        "name": "Detalle Golden Mostacho",
        "category": "detalles",
        "group": "golden",
        "visible": true,
        "description": "Mini torta vasca, trufas de Oreo, brownie grande y alfajores especial.",
        "includes": [
            "Mini torta vasca",
            "4 trufas de Oreo",
            "Brownie grande",
            "Alfajor mostacho"
        ],
        "price": 83000,
        "mainImage": "/assets/propuestas-fotograficas/detalle-golden-3.webp",
        "images": [
            "/assets/propuestas-fotograficas/detalle-golden-3.webp"
        ],
        "options": [
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
        "personalization": null
    }
};
