/**
 * Catálogo de productos de Lauren Repostería: solo datos, sin lógica.
 * Lo edita el centro de control; el formato de cada campo está en docs/12-catalogo.md.
 * Las reglas (precios, validaciones, etiquetas) viven en js/catalog-model.js.
 */
window.catalogData = {
    "torta-vintage": {
        "id": "torta-vintage",
        "name": "Torta Vintage",
        "category": "tortas",
        "visible": true,
        "featured": true,
        "summary": "Bordes delicados, flores y un acabado hecho a mano.",
        "description": "Torta vintage con bordes arriba, abajo y también en los laterales. Decoración artesanal, flores en fondant y acabado rústico elegante.",
        "includes": [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno premium",
            "Decoración vintage artesanal",
            "Flores y detalles en fondant"
        ],
        "notes": [
            "El precio corresponde al estilo y las porciones elegidas. Los cambios de diseño y los adicionales se confirman en la asesoría."
        ],
        "price": null,
        "mainImage": "/assets/propuestas-fotograficas/torta-vintage.webp",
        "images": [
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
        "summary": "Líneas limpias y el sabor que más te gusta.",
        "description": "Torta sencilla y elegante sin bordes o crema adicional al de la cubierta. Perfecta para quienes buscan un diseño minimalista.",
        "includes": [
            "Torta personalizada según porciones",
            "Bizcocho a elección",
            "Relleno premium",
            "Acabado liso en crema",
            "Decoración sencilla elegante"
        ],
        "notes": [
            "El precio corresponde al estilo y las porciones elegidas. Los cambios de diseño y los adicionales se confirman en la asesoría."
        ],
        "price": null,
        "mainImage": "/assets/propuestas-fotograficas/torta-sencilla.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-sencilla.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-03.webp",
            "/assets/propuestas-fotograficas/galeria-tortas-04.webp"
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
        "personalization": {
            "enabled": true,
            "field": "mensaje",
            "label": "Mensaje personalizado para la torta",
            "placeholder": "Ej.: Feliz cumpleaños",
            "maxLength": 40,
            "required": false
        }
    },
    "galeria-tortas-05": {
        "id": "galeria-tortas-05",
        "name": "Torta corazón lila",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-05.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-05.webp"
        ]
    },
    "galeria-tortas-01": {
        "id": "galeria-tortas-01",
        "name": "Torta Vintage · 2",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-01.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-01.webp"
        ]
    },
    "galeria-tortas-06": {
        "id": "galeria-tortas-06",
        "name": "Torta vintage con frutos rojos",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-06.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-06.webp"
        ]
    },
    "galeria-tortas-07": {
        "id": "galeria-tortas-07",
        "name": "Corazón Hello Kitty",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-07.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-07.webp"
        ]
    },
    "galeria-tortas-08": {
        "id": "galeria-tortas-08",
        "name": "Corazón crema con perlas doradas",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-08.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-08.webp"
        ]
    },
    "galeria-tortas-09": {
        "id": "galeria-tortas-09",
        "name": "Torta vintage azul",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-09.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-09.webp"
        ]
    },
    "galeria-tortas-10": {
        "id": "galeria-tortas-10",
        "name": "Torta corazón roja con moño",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-10.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-10.webp"
        ]
    },
    "galeria-tortas-11": {
        "id": "galeria-tortas-11",
        "name": "Torta negra con detalles dorados",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-11.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-11.webp"
        ]
    },
    "galeria-tortas-12": {
        "id": "galeria-tortas-12",
        "name": "Noche estrellada sobre pedestal",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-12.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-12.webp"
        ]
    },
    "galeria-tortas-13": {
        "id": "galeria-tortas-13",
        "name": "Paw Patrol · Máximo",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-13.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-13.webp"
        ]
    },
    "galeria-tortas-02": {
        "id": "galeria-tortas-02",
        "name": "Torta Vintage · 3",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-02.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-02.webp"
        ]
    },
    "galeria-tortas-14": {
        "id": "galeria-tortas-14",
        "name": "Torta de Las Chicas Superpoderosas",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-14.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-14.webp"
        ]
    },
    "galeria-tortas-15": {
        "id": "galeria-tortas-15",
        "name": "Torta verde para primera comunión",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-15.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-15.webp"
        ]
    },
    "galeria-tortas-16": {
        "id": "galeria-tortas-16",
        "name": "Torta con frambuesas y velas",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-16.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-16.webp"
        ]
    },
    "galeria-tortas-17": {
        "id": "galeria-tortas-17",
        "name": "Paw Patrol rosa",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-17.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-17.webp"
        ]
    },
    "galeria-tortas-18": {
        "id": "galeria-tortas-18",
        "name": "Torta con flores naturales",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
            "/assets/propuestas-fotograficas/galeria-tortas-18.webp"
        ]
    },
    "galeria-tortas-19": {
        "id": "galeria-tortas-19",
        "name": "Torta lila con flores",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-19.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-19.webp"
        ]
    },
    "galeria-tortas-20": {
        "id": "galeria-tortas-20",
        "name": "Torta de chocolate con galletas",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-20.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-20.webp"
        ]
    },
    "galeria-tortas-21": {
        "id": "galeria-tortas-21",
        "name": "Torta roja vintage",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-21.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-21.webp"
        ]
    },
    "galeria-tortas-22": {
        "id": "galeria-tortas-22",
        "name": "Torta infantil con banderines",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-22.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-22.webp"
        ]
    },
    "galeria-tortas-23": {
        "id": "galeria-tortas-23",
        "name": "Torta corazón en blanco y negro",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-23.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-23.webp"
        ]
    },
    "galeria-tortas-24": {
        "id": "galeria-tortas-24",
        "name": "Torta rosada con mensaje",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-24.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-24.webp"
        ]
    },
    "galeria-tortas-25": {
        "id": "galeria-tortas-25",
        "name": "Torta Yaisa",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-25.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-25.webp"
        ]
    },
    "galeria-tortas-26": {
        "id": "galeria-tortas-26",
        "name": "Torta de quince años con rosas",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-26.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-26.webp"
        ]
    },
    "galeria-tortas-27": {
        "id": "galeria-tortas-27",
        "name": "Torta azul para primera comunión",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-27.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-27.webp"
        ]
    },
    "galeria-tortas-28": {
        "id": "galeria-tortas-28",
        "name": "Corazón crema y lila",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-28.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-28.webp"
        ]
    },
    "galeria-tortas-29": {
        "id": "galeria-tortas-29",
        "name": "Harry Potter en negro y dorado",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-29.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-29.webp"
        ]
    },
    "galeria-tortas-30": {
        "id": "galeria-tortas-30",
        "name": "Torta PlayStation · Julián",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-30.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-30.webp"
        ]
    },
    "galeria-tortas-31": {
        "id": "galeria-tortas-31",
        "name": "Torta con decoración de celebración",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-31.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-31.webp"
        ]
    },
    "galeria-tortas-32": {
        "id": "galeria-tortas-32",
        "name": "Torta vintage · Susana",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-32.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-32.webp"
        ]
    },
    "galeria-tortas-33": {
        "id": "galeria-tortas-33",
        "name": "Corazón rojo · Hello 24",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-33.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-33.webp"
        ]
    },
    "galeria-tortas-34": {
        "id": "galeria-tortas-34",
        "name": "Torta Mi Grado",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-34.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-34.webp"
        ]
    },
    "galeria-tortas-35": {
        "id": "galeria-tortas-35",
        "name": "Torta blanca de 25 años",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-35.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-35.webp"
        ]
    },
    "galeria-tortas-36": {
        "id": "galeria-tortas-36",
        "name": "Torta Noche estrellada",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-36.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-36.webp"
        ]
    },
    "galeria-tortas-37": {
        "id": "galeria-tortas-37",
        "name": "Torta Hello Kitty",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-37.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-37.webp"
        ]
    },
    "galeria-tortas-38": {
        "id": "galeria-tortas-38",
        "name": "Torta LOL Surprise",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-38.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-38.webp"
        ]
    },
    "galeria-tortas-39": {
        "id": "galeria-tortas-39",
        "name": "Harry Potter en crema y dorado",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-39.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-39.webp"
        ]
    },
    "galeria-tortas-40": {
        "id": "galeria-tortas-40",
        "name": "Torta de sirena · Valery",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-40.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-40.webp"
        ]
    },
    "galeria-tortas-41": {
        "id": "galeria-tortas-41",
        "name": "Torta de grado con estrellas",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-41.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-41.webp"
        ]
    },
    "galeria-tortas-03": {
        "id": "galeria-tortas-03",
        "name": "Torta Sencilla · 2",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-sencilla",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-03.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-03.webp"
        ]
    },
    "galeria-tortas-04": {
        "id": "galeria-tortas-04",
        "name": "Torta Sencilla · 3",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-sencilla",
        "mainImage": "/assets/propuestas-fotograficas/galeria-tortas-04.webp",
        "images": [
            "/assets/propuestas-fotograficas/galeria-tortas-04.webp"
        ]
    },
    "torta-rosas-mariposas": {
        "id": "torta-rosas-mariposas",
        "name": "Torta con rosas y mariposas",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "mainImage": "/assets/propuestas-fotograficas/torta-rosas-mariposas.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-rosas-mariposas.webp"
        ]
    },
    "torta-negra-cumpleanos": {
        "id": "torta-negra-cumpleanos",
        "name": "Torta negra de cumpleaños",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/torta-negra-cumpleanos.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-negra-cumpleanos.webp"
        ]
    },
    "torta-rosa-diecinueve": {
        "id": "torta-rosa-diecinueve",
        "name": "Torta rosa de diecinueve años",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/torta-rosa-diecinueve-r3.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-rosa-diecinueve-r3.webp"
        ]
    },
    "torta-chocolate-amor": {
        "id": "torta-chocolate-amor",
        "name": "Torta de chocolate para celebrar",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/torta-chocolate-amor.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-chocolate-amor.webp"
        ]
    },
    "torta-azul-mami": {
        "id": "torta-azul-mami",
        "name": "Torta con bordes azules",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/torta-azul-mami.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-azul-mami.webp"
        ]
    },
    "torta-amor-amistad": {
        "id": "torta-amor-amistad",
        "name": "Torta de amor y amistad",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/torta-amor-amistad.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-amor-amistad.webp"
        ]
    },
    "torta-uno": {
        "id": "torta-uno",
        "name": "Torta Uno",
        "category": "tortas",
        "visible": true,
        "design": true,
        "basedOn": "torta-vintage",
        "reference": true,
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
        "mainImage": "/assets/propuestas-fotograficas/torta-uno.webp",
        "images": [
            "/assets/propuestas-fotograficas/torta-uno.webp"
        ]
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
        "personalization": null
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
        "personalization": null
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
        "personalization": null
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
        "price": 22000,
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
        "price": 37000,
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
            "Vaso decorativo",
            "Mini alfajores (30 unidades)",
            "Relleno de arequipe",
            "Presentación especial"
        ],
        "price": 27000,
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
            "Capas de alfajor de maicena",
            "Decoración elegante"
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
        "description": "Caja de 6 alfajores de maicena personalizados para tu celebración. Cada alfajor se decora a mano en fondant según tu ocasión.",
        "includes": [
            "6 alfajores de maicena rellenos de arequipe",
            "Decoración personalizada en fondant",
            "Diseño según tu ocasión",
            "Empaque decorativo",
            "Producto 100 % artesanal"
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
            "Los individuales se piden en grupos de mínimo 6. El vaso de minis no incluye toppings."
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
        "price": 8000,
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
            "/assets/propuestas-fotograficas/galeria-galletas-01.webp",
            "/assets/propuestas-fotograficas/galletas-tres-chocolates.webp"
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
            "/assets/propuestas-fotograficas/galleta-pistacho.webp",
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
        "mainImage": "/assets/propuestas-fotograficas/galletas.webp",
        "images": [
            "/assets/propuestas-fotograficas/galletas.webp",
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
        "mainImage": "/assets/propuestas-fotograficas/galletas-especiales.webp",
        "images": [
            "/assets/propuestas-fotograficas/galletas-especiales.webp",
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
        "mainImage": "/assets/propuestas-fotograficas/galletas.webp",
        "images": [
            "/assets/propuestas-fotograficas/galletas.webp",
            "/assets/propuestas-fotograficas/galletas-tres-chocolates.webp",
            "/assets/propuestas-fotograficas/galletas-especiales.webp"
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
        "price": 27000,
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
        "description": "Oso de chocolate de tamaño grande acompañado de brownie, alfajores y galletas. Ideal para celebraciones especiales.",
        "includes": [
            "Oso de chocolate (blanco o semiamargo)",
            "Brownie grande con Nutella",
            "6 alfajores pequeños rellenos de arequipe",
            "2 galletas grandes"
        ],
        "price": 49000,
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
            "Oso de chocolate",
            "Brownie grande",
            "Galleta grande",
            "6 fresas cubiertas"
        ],
        "price": 59000,
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
        "visible": true,
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
            "Caja x4 frambuesas",
            "Caja x7 mini galletas",
            "Porción de brownie"
        ],
        "price": 65000,
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
        "visible": true,
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
        "visible": true,
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
        "visible": true,
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
        "price": 86000,
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
        "description": "Mini torta vasca, trufas de Oreo, brownie grande y alfajor especial.",
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
