import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2724%27%20height=%2724%27%20viewBox=%270%200%2024%2024%27%3E%3C/svg%3E";
const BROKEN_PLACEHOLDER =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3C/svg%3E';

const mapPath = path.join(ROOT, 'assets/optimized/asset-map.json');
const assetMap = JSON.parse(readFileSync(mapPath, 'utf8')).files;

const files = [
    'index.html',
    'html/inicio.html',
    'html/tortas.html',
    'html/alfajores.html',
    'html/brownies-galletas.html',
    'html/detalles.html',
    'html/tabla-productos.html',
    'js/tortas-data.js',
    'js/alfajores-data.js',
    'js/catalog-data.js',
    'js/catalog-loader.js',
    'js/cart-ui.js',
    'js/quick-view-modal.js',
    'js/tortas-script.js'
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toEncodedPath = (value) => value.split('/').map(encodeURIComponent).join('/');

const buildVariants = (original, optimized) => {
    const variants = new Map();
    const originals = new Set([
        original,
        original.normalize('NFC'),
        original.normalize('NFD'),
        toEncodedPath(original),
        toEncodedPath(original.normalize('NFC')),
        toEncodedPath(original.normalize('NFD'))
    ]);

    const optimizeds = new Set([
        optimized,
        optimized.normalize('NFC'),
        optimized.normalize('NFD')
    ]);

    originals.forEach((source) => {
        optimizeds.forEach((target) => {
            variants.set(source, target);
            variants.set(`../${source}`, `../${target}`);
            variants.set(`./${source}`, `./${target}`);
        });
    });

    return variants;
};

const replacementPairs = [];
const optimizedByOriginal = new Map();
for (const entry of Object.values(assetMap)) {
    optimizedByOriginal.set(entry.original.normalize('NFC'), entry.optimized);
    optimizedByOriginal.set(entry.original.normalize('NFD'), entry.optimized);
    const variants = buildVariants(entry.original, entry.optimized);
    variants.forEach((target, source) => {
        replacementPairs.push([source, target]);
    });
}

replacementPairs.sort((a, b) => b[0].length - a[0].length);

const replaceAssetRefs = (content) => {
    let next = content;
    for (const [source, target] of replacementPairs) {
        next = next.replace(new RegExp(escapeRegExp(source), 'g'), target);
    }
    return next;
};

const stripAssetPrefix = (value) => {
    const decoded = value.replace(/^\.\//, '').replace(/^\.\.\//, '');
    try {
        return decodeURIComponent(decoded).normalize('NFC');
    } catch {
        return decoded.normalize('NFC');
    }
};

const optimizedRefFor = (value, prefix = '../') => {
    const normalized = stripAssetPrefix(value);
    const optimized = optimizedByOriginal.get(normalized);
    return optimized ? `${prefix}${optimized}` : null;
};

const repairBrokenPlaceholders = (content) => {
    return content.replace(new RegExp(escapeRegExp(BROKEN_PLACEHOLDER), 'g'), PLACEHOLDER);
};

const rewriteLazyImageTags = (content) => {
    return content.replace(/<img\b[^>]*>/g, (tag) => {
        const hasLazy = /\sloading=(["'])lazy\1/i.test(tag);
        const hasDataSrc = /\sdata-src=/i.test(tag);
        const srcMatch = tag.match(/\ssrc=(["'])(.*?)\1/i);
        const src = srcMatch?.[2] || '';
        const isLocalOptimized = src.includes('assets/optimized/');
        const isRuntimeTemplate = src.includes('${');
        const keepEager =
            /\b(hero-logo-translucent|intro-main-icon-img|modal-main-image|lightbox-img|quick-view-main-image)\b/.test(tag) ||
            /\bid=(["'])(productModalMainImage|quickViewMainImage|lightboxImg)\1/i.test(tag);

        if (!hasLazy || hasDataSrc || !srcMatch || !isLocalOptimized || isRuntimeTemplate || keepEager) {
            return tag;
        }

        let next = tag.replace(/\ssrc=(["'])(.*?)\1/i, ` src="${PLACEHOLDER}" data-src="${src}"`);
        if (!/\sdecoding=/i.test(next)) {
            next = next.replace(/>$/, ' decoding="async">');
        }
        return next;
    });
};

const addPerformanceScript = (content, file) => {
    if (content.includes('performance-optimizer.js')) return content;
    if (!file.startsWith('html/')) return content;
    const script = '    <script src="../js/performance-optimizer.js"></script>\n';

    const anchor = content.match(/^[ \t]*<script src="\.\.\/js\/tortas-script\.js"><\/script>\r?\n/m);
    if (anchor) {
        return content.replace(anchor[0], `${anchor[0]}${script}`);
    }

    const bodyClose = content.lastIndexOf('</body>');
    if (bodyClose === -1) return content;
    return `${content.slice(0, bodyClose)}${script}\n${content.slice(bodyClose)}`;
};

const rewriteFaviconTypes = (content) => {
    return content.replace(
        /(<link\s+rel="icon"\s+type=")image\/png("[^>]*href="[^"]+\.webp"[^>]*>)/gi,
        '$1image/webp$2'
    );
};

const replaceInfiniteCarouselInner = (content, newInner) => {
    const startTag = '<div class="infinite-carousel-track">';
    const start = content.indexOf(startTag);
    if (start === -1) return content;

    const openTagEnd = content.indexOf('>', start);
    let cursor = openTagEnd + 1;
    let depth = 1;

    while (cursor < content.length && depth > 0) {
        const nextOpen = content.indexOf('<div', cursor);
        const nextClose = content.indexOf('</div>', cursor);
        if (nextClose === -1) return content;

        if (nextOpen !== -1 && nextOpen < nextClose) {
            depth += 1;
            cursor = nextOpen + 4;
        } else {
            depth -= 1;
            cursor = nextClose + 6;
        }
    }

    const closeStart = cursor - 6;
    return `${content.slice(0, openTagEnd + 1)}${newInner}${content.slice(closeStart)}`;
};

const dedupeTortasCarousel = (content) => {
    const startTag = '<div class="infinite-carousel-track">';
    const start = content.indexOf(startTag);
    if (start === -1) return content;

    const openTagEnd = content.indexOf('>', start);
    let cursor = openTagEnd + 1;
    let depth = 1;

    while (cursor < content.length && depth > 0) {
        const nextOpen = content.indexOf('<div', cursor);
        const nextClose = content.indexOf('</div>', cursor);
        if (nextClose === -1) return content;

        if (nextOpen !== -1 && nextOpen < nextClose) {
            depth += 1;
            cursor = nextOpen + 4;
        } else {
            depth -= 1;
            cursor = nextClose + 6;
        }
    }

    const closeStart = cursor - 6;
    const inner = content.slice(openTagEnd + 1, closeStart);
    const itemRegex = /\s*<div class="infinite-carousel-item">[\s\S]*?<\/div>\s*/g;
    const items = inner.match(itemRegex) || [];
    const seen = new Set();
    const unique = [];

    for (const item of items) {
        const mediaMatch = item.match(/\s(?:data-src|src)=(["'])(.*?)\1/i);
        const key = mediaMatch?.[2] || item;
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(item.trimEnd());
    }

    if (unique.length === items.length) return content;

    const newInner = [
        '',
        '                <!-- Se mantiene una sola copia; el loop infinito se duplica en JS al montar. -->',
        ...unique,
        '            '
    ].join('\n');

    return replaceInfiniteCarouselInner(content, newInner);
};

const restoreTortasCarouselItems = (content) => {
    let committed = '';
    try {
        committed = execFileSync('git', ['show', 'HEAD:html/tortas.html'], {
            cwd: ROOT,
            encoding: 'utf8'
        });
    } catch {
        return content;
    }

    const refs = [];
    const seen = new Set();
    const trackStart = committed.indexOf('<div class="infinite-carousel-track">');
    const sectionEnd = committed.indexOf('<!-- Sección de adicionales -->', trackStart);
    const scope = trackStart !== -1 && sectionEnd !== -1 ? committed.slice(trackStart, sectionEnd) : committed;
    const refRegex = /src=(["'])(\.\.\/assets\/imagenes-tortas\/05-carrusel-infinito\/[^"']+)\1/g;
    let match;

    while ((match = refRegex.exec(scope))) {
        const optimized = optimizedRefFor(match[2]);
        if (!optimized || seen.has(optimized)) continue;
        seen.add(optimized);
        refs.push(optimized);
    }

    if (refs.length < 2) return content;

    const items = refs.map((ref) => `                <div class="infinite-carousel-item">
                    <img src="${PLACEHOLDER}" data-src="${ref}"
                        alt="Torta Lauren" class="infinite-carousel-img" loading="lazy" decoding="async">
                </div>`);

    const newInner = [
        '',
        '                <!-- Se mantiene una sola copia; el loop infinito se duplica en JS al montar. -->',
        ...items,
        '            '
    ].join('\n');

    return replaceInfiniteCarouselInner(content, newInner);
};

const rewriteTablaDynamicImages = (content) => {
    return content.replace(
        '<img src="${product.mainImage}" alt="${product.name}" onerror="this.src=\'https://via.placeholder.com/60\'">',
        '<img loading="lazy" decoding="async" src="${product.mainImage}" alt="${product.name}" onerror="this.src=\'https://via.placeholder.com/60\'">'
    );
};

const rewriteAlfajoresHeroVideos = (content) => {
    const gridMatch = content.match(/<div class="hero-video-grid">[\s\S]*?<\/div>\s*<div class="hero-overlay">/);
    if (!gridMatch) return content;

    let index = 0;
    const delays = [0, 4500, 7000, 9500];
    const rewritten = gridMatch[0].replace(/<video class="hero-grid-video"([\s\S]*?)<\/video>/g, (video) => {
        index += 1;
        if (index === 1) {
            return video.replace('<video class="hero-grid-video"', '<video class="hero-grid-video" preload="metadata"');
        }

        const delay = delays[index - 1] || 1200;
        let next = video
            .replace('<video class="hero-grid-video"', `<video class="hero-grid-video" preload="none" data-lazy-video data-video-delay="${delay}"`)
            .replace(/\ssrc=(["'])(.*?)\1/i, ' data-src=$1$2$1');
        return next;
    });

    return content.replace(gridMatch[0], rewritten);
};

const addHeroVideoPreload = (content) => {
    return content.replace(/<video\b[^>]*>/g, (tag) => {
        if (!/\bclass=(["'])(?:(?!\1).)*(?:hero-background-video|hero-video)(?:(?!\1).)*\1/.test(tag)) {
            return tag;
        }
        if (/\bpreload=/.test(tag)) return tag;
        return tag.replace('<video', '<video preload="metadata"');
    });
};

const cleanupDuplicateVideoAttrs = (content) => {
    let next = content;
    next = next.replace(/\s+preload="metadata"\s+preload="metadata"/g, ' preload="metadata"');
    next = next.replace(
        /\s+preload="none"\s+data-lazy-video\s+data-video-delay="([^"]+)"\s+preload="none"\s+data-lazy-video\s+data-video-delay="\1"/g,
        ' preload="none" data-lazy-video data-video-delay="$1"'
    );
    return next;
};

for (const file of files) {
    const abs = path.join(ROOT, file);
    let content = readFileSync(abs, 'utf8');
    let next = repairBrokenPlaceholders(replaceAssetRefs(content));

    if (file.endsWith('.html')) {
        next = rewriteLazyImageTags(next);
        next = addPerformanceScript(next, file);
        next = rewriteFaviconTypes(next);
        next = addHeroVideoPreload(next);
        next = cleanupDuplicateVideoAttrs(next);
    }

    if (file === 'html/tortas.html') {
        next = dedupeTortasCarousel(next);
        next = restoreTortasCarouselItems(next);
    }

    if (file === 'html/alfajores.html') {
        next = rewriteAlfajoresHeroVideos(next);
    }

    if (file === 'html/tabla-productos.html') {
        next = rewriteTablaDynamicImages(next);
    }

    if (file.endsWith('.html')) {
        next = cleanupDuplicateVideoAttrs(next);
    }

    if (next !== content) {
        writeFileSync(abs, next);
        console.log(`[updated] ${file}`);
    }
}
