#!/usr/bin/env node
/**
 * SEO del sitio a partir del catálogo: metadatos de cada página, datos estructurados
 * (JSON-LD), sitemap.xml con imágenes y llms.txt. Uso: node scripts/seo.mjs
 * Ejecutar después de cambiar textos SEO, precios, productos o galerías.
 * Con --check no escribe nada y termina con error si algo está desactualizado.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
export const ORIGIN = 'https://laurenreposteria.com';
const read = file => readFileSync(path.join(root, file), 'utf8');

// Catálogo y galerías: la misma fuente que usa el navegador.
const context = { console, Intl, URL };
context.window = context;
vm.createContext(context);
for (const file of ['catalog-data', 'catalog-model', 'gallery-data']) vm.runInContext(read(`js/${file}.js`), context);
const { Catalog, galleryData } = context;
const money = Catalog.money;

export const BUSINESS = {
    name: 'Lauren Repostería',
    slogan: 'Un bocado de alegría',
    description: 'Repostería artesanal en Medellín desde 2022: tortas personalizadas, alfajores, brownies, galletas y detalles de regalo hechos a mano. Pedidos por WhatsApp.',
    telephone: '+573104442796',
    telephoneDisplay: '+57 310 444 2796',
    whatsapp: 'https://wa.me/573104442796',
    email: 'reposterialauren@gmail.com',
    city: 'Medellín', region: 'Antioquia', country: 'CO',
    foundingDate: '2022',
    hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '09:00', closes: '18:00', text: 'Todos los días, también domingos y festivos, de 9:00 a. m. a 6:00 p. m.' },
    sameAs: ['https://www.instagram.com/laurenreposteria22/', 'https://www.tiktok.com/@laurenreposteria']
};

/** Rango de precio real de un producto, recorriendo todas sus combinaciones con precio. */
export function priceRange(product) {
    if (Catalog.quoteOnly(product)) return null;
    const options = (product.options || []).filter(o => !o.multiple && (o.type === 'toggle' || o.choices?.length));
    const values = options.map(o => o.type === 'toggle' ? [false, true] : o.choices.map(c => c.value));
    let combos = [{}];
    for (const [i, option] of options.entries()) {
        combos = combos.flatMap(combo => values[i].map(value => ({ ...combo, [option.id]: value })));
        if (combos.length > 20000) throw new Error(`Demasiadas combinaciones en ${product.id}`);
    }
    const prices = combos.map(selection => Catalog.price(product, { ...Catalog.defaults(product), ...selection })).filter(Number.isFinite).filter(p => p > 0);
    if (!prices.length) return null;
    const unit = Math.min(...prices);
    return { min: unit, max: Math.max(...prices), minimum: Catalog.minimum(product) };
}
const productsOf = categories => Catalog.all().filter(p => categories.includes(p.category));
const lowest = categories => Math.min(...productsOf(categories).map(priceRange).filter(Boolean).map(r => r.min * r.minimum));

export const PAGES = [
    {
        key: 'inicio', file: 'index.html', path: '/', type: 'WebPage', name: 'Inicio',
        title: 'Repostería artesanal en Medellín | Lauren Repostería',
        description: () => 'Repostería artesanal en Medellín desde 2022: tortas personalizadas, alfajores, brownies, galletas y detalles de regalo. Haz tu pedido por WhatsApp.',
        imageAlt: 'Lauren Repostería: torta vintage con frutos rojos y moño de satén',
        categories: [], gallery: null
    },
    {
        key: 'tortas', file: 'tortas/index.html', path: '/tortas/', type: 'CollectionPage', name: 'Tortas',
        section: 'Tortas personalizadas',
        title: 'Tortas personalizadas en Medellín | Lauren Repostería',
        description: () => `Tortas personalizadas en Medellín desde ${money(lowest(['tortas']))}: vintage o sencillas, de 4 a 30 porciones. Elige bizcocho, relleno y mensaje; pide por WhatsApp.`,
        imageAlt: 'Torta de dos pisos con rosas y mariposas doradas de Lauren Repostería',
        categories: ['tortas', 'extras'], gallery: 'tortas'
    },
    {
        key: 'alfajores', file: 'alfajores/index.html', path: '/alfajores/', type: 'CollectionPage', name: 'Alfajores',
        section: 'Alfajores artesanales',
        title: 'Alfajores artesanales en Medellín | Lauren Repostería',
        description: () => `Alfajores de maicena con arequipe hechos a mano en Medellín, desde ${money(lowest(['alfajores']))}: cajas x6 y x12, mini alfajores, torta de alfajor y alfajores personalizados.`,
        imageAlt: 'Torta de alfajor de tres capas con arequipe de Lauren Repostería',
        categories: ['alfajores'], gallery: 'alfajores'
    },
    {
        key: 'brownies-galletas', file: 'brownies-galletas/index.html', path: '/brownies-galletas/', type: 'CollectionPage', name: 'Brownies y galletas',
        section: 'Brownies y galletas',
        title: 'Brownies y galletas en Medellín | Lauren Repostería',
        description: () => `Brownies con chocolate al 70 % y galletas artesanales de seis sabores en Medellín. Elige presentación, relleno y toppings, desde ${money(lowest(['brownies', 'galletas']))}.`,
        imageAlt: 'Cajas de brownies con toppings de Lauren Repostería',
        categories: ['brownies', 'galletas'], gallery: 'horneados'
    },
    {
        key: 'detalles', file: 'detalles/index.html', path: '/detalles/', type: 'CollectionPage', name: 'Detalles',
        section: 'Detalles y regalos',
        title: 'Detalles y regalos en Medellín | Lauren Repostería',
        description: () => `Detalles y regalos dulces en Medellín desde ${money(lowest(['detalles']))}: cajas con tortas, alfajores, brownies, galletas y ositos de chocolate personalizables.`,
        imageAlt: 'Detalle Golden de Lauren Repostería: caja de regalo con torta vasca y dulces',
        categories: ['detalles'], gallery: 'detalles'
    },
    {
        key: 'preguntas', file: 'preguntas/index.html', path: '/preguntas/', type: 'WebPage', name: 'Preguntas frecuentes',
        social: 'inicio',
        title: 'Preguntas frecuentes en Medellín | Lauren Repostería',
        description: () => 'Anticipación, domicilios, pagos, cambios y cuidados de tu pedido en Lauren Repostería, Medellín. Resuelve tus dudas antes de pedir por WhatsApp.',
        imageAlt: 'Lauren Repostería: torta vintage con frutos rojos y moño de satén',
        categories: [], gallery: null
    }
];

const abs = src => ORIGIN + src;
const escAttr = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const plain = html => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const socialImage = page => `/assets/social/${page.social || page.key}.jpg`;

/** Preguntas visibles de la página: el JSON-LD repite exactamente el texto publicado. */
export function faqs(html) {
    return [...html.matchAll(/<details class="faq-item">\s*<summary>([\s\S]*?)<span[\s\S]*?<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)]
        .map(([, q, a]) => ({ question: plain(q), answer: plain(a) }));
}

function menuItem(product, page) {
    const range = priceRange(product);
    const images = [...new Set([product.mainImage, ...(product.images || [])])].map(abs);
    const item = { '@type': 'MenuItem', '@id': `${ORIGIN}${page.path}#${product.id}`, name: product.name, description: product.description, image: images };
    if (range) {
        const offer = { '@type': 'Offer', price: range.min, priceCurrency: 'COP', availability: 'https://schema.org/MadeToOrder', url: ORIGIN + page.path, seller: { '@id': `${ORIGIN}/#bakery` } };
        if (range.max > range.min) offer.priceSpecification = { '@type': 'PriceSpecification', minPrice: range.min, maxPrice: range.max, priceCurrency: 'COP' };
        if (range.minimum > 1) offer.eligibleQuantity = { '@type': 'QuantitativeValue', minValue: range.minimum, unitCode: 'C62' };
        item.offers = offer;
    }
    return item;
}

function priceRangeText() {
    const ranges = Catalog.all().map(priceRange).filter(Boolean);
    return `${money(Math.min(...ranges.map(r => r.min)))} - ${money(Math.max(...ranges.map(r => r.max)))} COP`;
}

function bakery() {
    return {
        '@type': 'Bakery', '@id': `${ORIGIN}/#bakery`,
        name: BUSINESS.name, alternateName: 'Lauren · Bocado de alegría', slogan: BUSINESS.slogan,
        description: BUSINESS.description, url: `${ORIGIN}/`,
        logo: { '@type': 'ImageObject', '@id': `${ORIGIN}/#logo`, url: abs('/assets/icons/logo.png'), width: 600, height: 360, caption: BUSINESS.name },
        image: [abs('/assets/social/inicio.jpg'), abs('/assets/propuestas-fotograficas/torta-vintage.webp')],
        telephone: BUSINESS.telephone, email: BUSINESS.email,
        address: { '@type': 'PostalAddress', addressLocality: BUSINESS.city, addressRegion: BUSINESS.region, addressCountry: BUSINESS.country },
        areaServed: { '@type': 'City', name: BUSINESS.city },
        foundingDate: BUSINESS.foundingDate,
        openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: BUSINESS.hours.days.map(d => `https://schema.org/${d}`), opens: BUSINESS.hours.opens, closes: BUSINESS.hours.closes }],
        priceRange: priceRangeText(), currenciesAccepted: 'COP',
        servesCuisine: ['Repostería', 'Postres'], knowsLanguage: 'es',
        hasMenu: { '@id': `${ORIGIN}/#menu` },
        contactPoint: [{ '@type': 'ContactPoint', telephone: BUSINESS.telephone, email: BUSINESS.email, contactType: 'customer service', availableLanguage: 'es', areaServed: 'CO', url: BUSINESS.whatsapp }],
        sameAs: BUSINESS.sameAs
    };
}

function graph(page, html) {
    const url = ORIGIN + page.path;
    const nodes = [bakery(), {
        '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: BUSINESS.name,
        alternateName: 'Lauren', inLanguage: 'es-CO', publisher: { '@id': `${ORIGIN}/#bakery` }
    }];
    const questions = faqs(html);
    const webpage = {
        '@type': questions.length ? [page.type, 'FAQPage'] : page.type, '@id': `${url}#webpage`, url,
        name: page.title, description: page.description(), inLanguage: 'es-CO',
        isPartOf: { '@id': `${ORIGIN}/#website` }, about: { '@id': `${ORIGIN}/#bakery` },
        primaryImageOfPage: { '@type': 'ImageObject', url: abs(socialImage(page)), width: 1200, height: 630, caption: page.imageAlt }
    };
    if (questions.length) webpage.mainEntity = questions.map(q => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } }));
    if (page.path !== '/') {
        webpage.breadcrumb = { '@id': `${url}#breadcrumb` };
        if (page.section) webpage.hasPart = { '@id': `${url}#menu` };
        nodes.push({
            '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
            itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: `${ORIGIN}/` }, { '@type': 'ListItem', position: 2, name: page.name, item: url }]
        });
        if (page.section) nodes.push({ '@type': 'MenuSection', '@id': `${url}#menu`, name: page.section, url, hasMenuItem: productsOf(page.categories).map(p => menuItem(p, page)) });
    } else {
        nodes.push({
            '@type': 'Menu', '@id': `${ORIGIN}/#menu`, name: `Carta de ${BUSINESS.name}`, inLanguage: 'es-CO',
            hasMenuSection: PAGES.filter(p => p.section).map(p => ({ '@type': 'MenuSection', '@id': `${ORIGIN}${p.path}#menu`, name: p.section, url: ORIGIN + p.path }))
        });
        const video = html.match(/<video[^>]*data-src="([^"]+)"[^>]*poster="([^"]+)"/);
        if (video) nodes.push({
            '@type': 'VideoObject', '@id': `${ORIGIN}/#historia`, name: 'La historia de Lauren Repostería',
            description: 'Lauren cuenta cómo nació su repostería artesanal en Medellín y cómo prepara cada creación a mano.',
            thumbnailUrl: abs(video[2]), contentUrl: abs(video[1]), uploadDate: '2026-07-07T00:00:00-05:00', duration: 'PT1M30S',
            inLanguage: 'es-CO', publisher: { '@id': `${ORIGIN}/#bakery` }
        });
    }
    nodes.push(webpage);
    return { '@context': 'https://schema.org', '@graph': nodes };
}

function head(page, html) {
    const url = ORIGIN + page.path;
    const description = escAttr(page.description());
    const image = abs(socialImage(page));
    const json = JSON.stringify(graph(page, html)).replace(/</g, '\\u003c');
    return `<!-- seo: generado por scripts/seo.mjs; editar allí, no aquí -->
<title>${escAttr(page.title)}</title>
<meta name="description" content="${description}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="es-CO" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta name="theme-color" content="#f9f5ec">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${BUSINESS.name}">
<meta property="og:locale" content="es_CO">
<meta property="og:title" content="${escAttr(page.title)}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escAttr(page.imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escAttr(page.title)}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${escAttr(page.imageAlt)}">
<script type="application/ld+json">${json}</script>
<!-- /seo -->`;
}

/** Inserta o reemplaza el bloque SEO; la primera vez retira las etiquetas sueltas anteriores. */
export function withHead(page, html) {
    const block = head(page, html);
    if (html.includes('<!-- seo:')) return html.replace(/<!-- seo:[\s\S]*?<!-- \/seo -->/, block);
    const legacy = /^(?:<title>.*<\/title>|<meta name="(?:description|theme-color|robots|twitter:[^"]+)"[^>]*>|<meta property="og:[^"]+"[^>]*>|<link rel="(?:canonical|icon|apple-touch-icon|manifest)"[^>]*>|<script type="application\/ld\+json">.*<\/script>)\s*$/;
    const lines = html.split('\n').filter(line => !legacy.test(line.trim()));
    const viewport = lines.findIndex(line => line.startsWith('<meta name="viewport"'));
    lines.splice(viewport + 1, 0, block);
    return lines.join('\n');
}

function lastmod(files) {
    const changed = execFileSync('git', ['status', '--porcelain', '--', ...files], { cwd: root, encoding: 'utf8' }).trim();
    if (changed) return new Date().toISOString().slice(0, 10);
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], { cwd: root, encoding: 'utf8' }).trim() || new Date().toISOString().slice(0, 10);
}

/** Fotografías visibles en la página: HTML estático, galería y productos de sus categorías. */
export function pageImages(page, html) {
    const fromHtml = [...html.matchAll(/\bsrc="(\/assets\/(?:propuestas-fotograficas|optimized)\/[^"]+\.(?:webp|jpg|png))"/g)].map(m => m[1]).filter(src => !src.includes('/responsive/'));
    const fromGallery = page.gallery ? galleryData[page.gallery].map(item => item.src) : [];
    const fromProducts = productsOf(page.categories).flatMap(p => [p.mainImage, ...(p.images || [])]);
    const featured = page.path === '/' ? [...html.matchAll(/data-products="([^"]+)"/g)].flatMap(m => m[1].split(',')).map(id => Catalog.get(id)?.mainImage) : [];
    return [...new Set([...fromHtml, ...fromGallery, ...fromProducts, ...featured].filter(Boolean))];
}

function sitemap(pages) {
    const urls = pages.map(({ page, html }) => {
        const images = pageImages(page, html).map(src => `\n    <image:image><image:loc>${abs(src)}</image:loc></image:image>`).join('');
        const date = lastmod([page.file, 'js/catalog-data.js', 'js/gallery-data.js']);
        return `  <url>\n    <loc>${ORIGIN}${page.path}</loc>\n    <lastmod>${date}</lastmod>${images}\n  </url>`;
    }).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;
}

function llms() {
    const sections = PAGES.filter(p => p.section).map(page => {
        const items = productsOf(page.categories).map(product => {
            const range = priceRange(product);
            const price = !range ? 'precio según diseño' : range.max > range.min ? `desde ${money(range.min)}` : money(range.min);
            const unit = range?.minimum > 1 ? ` por unidad, mínimo ${range.minimum}` : '';
            return `- ${product.name} (${price}${unit}): ${product.description}`;
        }).join('\n');
        return `## [${page.section}](${ORIGIN}${page.path})\n\n${page.description()}\n\n${items}`;
    }).join('\n\n');
    return `# ${BUSINESS.name}

> ${BUSINESS.description}

- Ciudad: ${BUSINESS.city}, ${BUSINESS.region}, Colombia. Desde ${BUSINESS.foundingDate}.
- Horario: ${BUSINESS.hours.text}
- Pedidos: se arman en ${ORIGIN}/ y se confirman por WhatsApp (${BUSINESS.telephoneDisplay}, ${BUSINESS.whatsapp}). Con al menos 2 días de anticipación y sujetos a disponibilidad. Se reservan con un anticipo del 50 %; se paga por transferencia o en efectivo. Fecha, entrega y pago se coordinan por WhatsApp.
- Correo: ${BUSINESS.email}
- Redes: ${BUSINESS.sameAs.join(', ')}
- Precios en pesos colombianos (COP). Cada producto se hace a mano; las fotografías son referencias.

${sections}
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const check = process.argv.includes('--check');
    const pages = PAGES.map(page => ({ page, html: read(page.file) }));
    const outputs = new Map();
    for (const { page, html } of pages) {
        if (!existsSync(path.join(root, socialImage(page)))) throw new Error(`Falta ${socialImage(page)}: ejecutar node scripts/social-images.mjs`);
        outputs.set(page.file, withHead(page, html));
    }
    outputs.set('sitemap.xml', sitemap(pages.map(({ page }) => ({ page, html: outputs.get(page.file) }))));
    outputs.set('llms.txt', llms());
    const stale = [...outputs].filter(([file, content]) => !existsSync(path.join(root, file)) || read(file) !== content).map(([file]) => file);
    if (check) {
        // lastmod depende del estado de Git; la comprobación ignora solo esa línea.
        const relevant = stale.filter(file => file !== 'sitemap.xml' || read(file).replace(/<lastmod>.*<\/lastmod>/g, '') !== outputs.get(file).replace(/<lastmod>.*<\/lastmod>/g, ''));
        if (relevant.length) { console.error(`SEO desactualizado: ${relevant.join(', ')}. Ejecutar node scripts/seo.mjs`); process.exit(1); }
        console.log('SEO al día.');
    } else {
        for (const file of stale) writeFileSync(path.join(root, file), outputs.get(file));
        console.log(stale.length ? `Actualizado: ${stale.join(', ')}` : 'SEO al día.');
    }
}
