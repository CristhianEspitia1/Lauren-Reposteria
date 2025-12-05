// Base de datos de productos - TORTAS
// Datos extraídos de la página tortas.html

const detallesProductsData = {
    'torta-vintage': {
        id: 'torta-vintage',
        name: 'Torta Vintage',
        price: 65000,
        priceFormatted: 'Desde $65.000',
        category: 'vintage',
        description: 'Torta vintage con bordes arriba, abajo y también en los laterales. Decoración artesanal, flores en fondant y acabado rústico elegante.',
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
                priceModifier: true,
                choices: [
                    { value: '4-5', label: '4-5 porciones', price: 65000 },
                    { value: '8-10', label: '8-10 porciones', price: 105000 },
                    { value: '12-15', label: '12-15 porciones', price: 150000 },
                    { value: '18-20', label: '18-20 porciones', price: 172000 },
                    { value: '25-30', label: '25-30 porciones', price: 235000 }
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
        price: 58000,
        priceFormatted: 'Desde $58.000',
        category: 'sencilla',
        description: 'Torta sencilla y elegante sin bordes o crema adicional al de la cubierta. Perfecta para quienes buscan un diseño minimalista.',
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
                priceModifier: true,
                choices: [
                    { value: '4-5', label: '4-5 porciones', price: 58000 },
                    { value: '8-10', label: '8-10 porciones', price: 90000 },
                    { value: '12-15', label: '12-15 porciones', price: 135000 },
                    { value: '18-20', label: '18-20 porciones', price: 155000 },
                    { value: '25-30', label: '25-30 porciones', price: 215000 }
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
