// Base de datos de productos - TORTAS
// Datos extraídos de la página tortas.html

const detallesProductsData = {
    'torta-vintage': {
        id: 'torta-vintage',
        name: 'Torta Vintage',
        price: 95000,
        priceFormatted: 'Desde $95.000',
        category: 'vintage',
        description: 'Torta vintage con decoración artesanal, flores en fondant y acabado rústico elegante. Cada torta es única y personalizada según tus preferencias.',
        mainImage: '../assets/imagenes-tortas/06-galeria-vintage/Gemini_Generated_Image_reksf1reksf1reks.png',
        images: [
            '../assets/imagenes-tortas/06-galeria-vintage/Gemini_Generated_Image_reksf1reksf1reks.png',
            '../assets/imagenes-tortas/06-galeria-vintage/Gemini_Generated_Image_4tb78o4tb78o4tb7.png',
            '../assets/imagenes-tortas/06-galeria-vintage/Gemini_Generated_Image_3cka7v3cka7v3cka.png'
        ],
        includes: [
            'Torta personalizada según porciones',
            'Bizcocho a elección',
            'Relleno premium',
            'Decoración vintage artesanal',
            'Flores y detalles en fondant'
        ],
        customizable: true,
        options: [
            {
                id: 'sabor',
                label: 'Sabor del bizcocho',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'chocolate', label: 'Chocolate' },
                    { value: 'red-velvet', label: 'Red Velvet' },
                    { value: 'vainilla', label: 'Vainilla' },
                    { value: 'zanahoria', label: 'Zanahoria con Nueces' }
                ]
            },
            {
                id: 'relleno',
                label: 'Relleno',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'arequipe', label: 'Arequipe' },
                    { value: 'crema-queso', label: 'Crema de Queso' },
                    { value: 'frutos-rojos', label: 'Frutos Rojos' },
                    { value: 'chocolate', label: 'Chocolate' },
                    { value: 'nutella', label: 'Nutella' }
                ]
            },
            {
                id: 'porciones',
                label: 'Número de porciones',
                type: 'radio',
                required: true,
                choices: [
                    { value: '8-10', label: '8-10 porciones', price: 95000 },
                    { value: '15-20', label: '15-20 porciones', price: 145000 },
                    { value: '25-30', label: '25-30 porciones', price: 210000 },
                    { value: '30-40', label: '30-40 porciones', price: 280000 },
                    { value: '40-50', label: '40-50 porciones', price: 350000 }
                ]
            }
        ],
        personalization: {
            enabled: true,
            field: 'mensaje',
            label: 'Mensaje personalizado para la torta',
            placeholder: 'Ej: Feliz Cumpleaños María',
            maxLength: 40,
            required: false,
            note: 'Todas las letras se realizan con moldes para garantizar un acabado profesional'
        }
    },

    'torta-sencilla': {
        id: 'torta-sencilla',
        name: 'Torta Sencilla',
        price: 70000,
        priceFormatted: 'Desde $70.000',
        category: 'sencilla',
        description: 'Torta sencilla y elegante con acabado liso en crema. Perfecta para quienes buscan un diseño minimalista pero delicioso.',
        mainImage: '../assets/imagenes-tortas/07-tortas-sencillas/Gemini_Generated_Image_45m3co45m3co45m3.png',
        images: [
            '../assets/imagenes-tortas/07-tortas-sencillas/Gemini_Generated_Image_45m3co45m3co45m3.png',
            '../assets/imagenes-tortas/07-tortas-sencillas/Gemini_Generated_Image_vy4pszvy4pszvy4p.png',
            '../assets/imagenes-tortas/07-tortas-sencillas/Gemini_Generated_Image_6ttesv6ttesv6tte.png'
        ],
        includes: [
            'Torta personalizada según porciones',
            'Bizcocho a elección',
            'Relleno premium',
            'Acabado liso en crema',
            'Decoración sencilla elegante'
        ],
        customizable: true,
        options: [
            {
                id: 'sabor',
                label: 'Sabor del bizcocho',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'chocolate', label: 'Chocolate' },
                    { value: 'red-velvet', label: 'Red Velvet' },
                    { value: 'vainilla', label: 'Vainilla' },
                    { value: 'zanahoria', label: 'Zanahoria con Nueces' }
                ]
            },
            {
                id: 'relleno',
                label: 'Relleno',
                type: 'radio',
                required: true,
                choices: [
                    { value: 'arequipe', label: 'Arequipe' },
                    { value: 'crema-queso', label: 'Crema de Queso' },
                    { value: 'frutos-rojos', label: 'Frutos Rojos' },
                    { value: 'chocolate', label: 'Chocolate' },
                    { value: 'nutella', label: 'Nutella' }
                ]
            },
            {
                id: 'porciones',
                label: 'Número de porciones',
                type: 'radio',
                required: true,
                choices: [
                    { value: '8-10', label: '8-10 porciones', price: 70000 },
                    { value: '15-20', label: '15-20 porciones', price: 110000 },
                    { value: '25-30', label: '25-30 porciones', price: 165000 },
                    { value: '30-40', label: '30-40 porciones', price: 220000 },
                    { value: '40-50', label: '40-50 porciones', price: 275000 }
                ]
            }
        ],
        personalization: {
            enabled: true,
            field: 'mensaje',
            label: 'Mensaje personalizado para la torta',
            placeholder: 'Ej: Feliz Cumpleaños',
            maxLength: 40,
            required: false
        }
    }
};

// Mapeo de productos por nombre (para las galerías)
const productCardMapping = {
    'Torta Vintage': 'torta-vintage',
    'Torta Sencilla': 'torta-sencilla'
};
