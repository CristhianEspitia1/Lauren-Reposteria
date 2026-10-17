/**
 * Lo último de Instagram para «Un poquito más de Lauren», al final de la portada.
 *
 * Con el secreto INSTAGRAM_TOKEN (llave de la API de Instagram con inicio de sesión de Instagram, de la cuenta
 * profesional @laurenreposteria22), el worker lee las últimas publicaciones, las guarda una hora en KV y sirve
 * sus fotos y videos desde su propio dominio: la web no depende de las direcciones de Instagram, que vencen, y
 * el worker solo pide archivos de las publicaciones que ya leyó. La llave dura 60 días; el cron del worker la
 * renueva cada semana y guarda la nueva en KV. Sin llave, o si Instagram falla, la lista va vacía y la web deja
 * sus cuatro fotos.
 *
 *   GET /instagram             { publicaciones: [{ id, video, enlace, texto }] }, de la más nueva a la más vieja.
 *   GET /instagram/foto/<id>   La foto de la publicación (la portada, si es video).
 *   GET /instagram/video/<id>  El video, con rangos (Range) para que el navegador lo pida por partes.
 */
const GRAPH = 'https://graph.instagram.com';
const FIELDS = 'id,media_type,media_url,thumbnail_url,permalink,caption,children{media_type,media_url,thumbnail_url}';
const LIMIT = 24;
const POSTS_KEY = 'instagram-publicaciones';
const TOKEN_KEY = 'instagram-llave';
const FRESH = 3600;
const RENEW = 7 * 86400;
const MEMORY = 60;
const ID = /^\d{1,40}$/;
const CDN = /^https:\/\/[a-z0-9.-]+\.(?:cdninstagram\.com|fbcdn\.net)\//;
const PERMALINK = /^https:\/\/www\.instagram\.com\/[A-Za-z0-9_/.-]+$/;
const TYPES = { foto: /^image\/(?:jpeg|webp|png)$/, video: /^video\/mp4$/ };
const encoder = new TextEncoder();

/** Texto corto para el nombre accesible: la primera frase, sin emojis, etiquetas ni menciones, de 120 caracteres como mucho. */
export function shortText(caption) {
    const clean = String(caption || '').replace(/\p{Extended_Pictographic}|[️‍]/gu, '').replace(/[#@][\p{L}\p{N}_.]+/gu, '')
        .replace(/\s+/g, ' ').trim();
    const first = clean.split(/(?<=[.!?])\s/)[0].trim();
    if (first.length <= 120) return first;
    return `${first.slice(0, 120).replace(/\s+\S*$/, '')}…`;
}

/**
 * De la respuesta de Instagram a lo que guarda el worker. Solo quedan publicaciones con foto del CDN de Instagram
 * y enlace a instagram.com. Un carrusel se muestra con su primera foto o video. Instagram no entrega el video de
 * los reels con música con derechos: esos quedan como foto, con su portada.
 */
export function postsFrom(media) {
    return (Array.isArray(media) ? media : []).flatMap(item => {
        const first = item?.media_type === 'CAROUSEL_ALBUM' ? item.children?.data?.[0] || {} : item || {};
        const isVideo = first.media_type === 'VIDEO';
        const image = isVideo ? first.thumbnail_url : first.media_url;
        if (!ID.test(String(item?.id)) || !CDN.test(image || '') || !PERMALINK.test(item.permalink || '')) return [];
        const video = isVideo && CDN.test(first.media_url || '') ? first.media_url : null;
        return [{ id: String(item.id), imagen: image, video, enlace: item.permalink, texto: shortText(item.caption) }];
    }).slice(0, LIMIT);
}

const fingerprint = async text => [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(text)))]
    .slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');

export function createInstagram({ fetchImpl = (...args) => fetch(...args), now = () => Date.now() / 1000 } = {}) {
    let memory = null;

    /** La llave vigente: la renovada en KV si salió del mismo secreto; si el secreto cambió, la del secreto. */
    async function credentials(env) {
        if (!env.INSTAGRAM_TOKEN || !env.FOTOS) return null;
        const base = await fingerprint(env.INSTAGRAM_TOKEN);
        const saved = await env.FOTOS.get(TOKEN_KEY, { type: 'json' });
        const same = saved?.base === base && typeof saved.token === 'string';
        return { token: same ? saved.token : env.INSTAGRAM_TOKEN, base, renewed: same ? saved.renovada : null };
    }

    async function read(env) {
        const access = await credentials(env);
        if (!access) return [];
        const response = await fetchImpl(`${GRAPH}/me/media?fields=${encodeURIComponent(FIELDS)}&limit=${LIMIT}&access_token=${encodeURIComponent(access.token)}`);
        if (!response.ok) throw new Error('instagram');
        const list = postsFrom((await response.json())?.data);
        await env.FOTOS.put(POSTS_KEY, JSON.stringify({ leidas: now(), publicaciones: list }));
        memory = { at: now(), list };
        return list;
    }

    /**
     * Las publicaciones guardadas. Si tienen más de una hora, se leen de nuevo: en segundo plano si hay algo que
     * mostrar mientras tanto. Si Instagram falla, siguen las guardadas.
     */
    async function posts(env, ctx, { force = false } = {}) {
        if (!env.INSTAGRAM_TOKEN || !env.FOTOS) return [];
        if (!force && memory && now() - memory.at < MEMORY) return memory.list;
        const saved = await env.FOTOS.get(POSTS_KEY, { type: 'json' });
        const list = Array.isArray(saved?.publicaciones) ? saved.publicaciones : null;
        if (!force && list && now() - saved.leidas < FRESH) { memory = { at: now(), list }; return list; }
        const update = read(env).catch(() => list || []);
        if (!force && list && ctx?.waitUntil) { ctx.waitUntil(update); return list; }
        return update;
    }

    /** Renueva la llave cada semana (Instagram la da por 60 días y solo la renueva si tiene más de un día). */
    async function renew(env) {
        const access = await credentials(env);
        if (!access) return 'sin-llave';
        if (access.renewed && now() - access.renewed < RENEW) return 'al-dia';
        const response = await fetchImpl(`${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(access.token)}`);
        const token = response.ok ? (await response.json())?.access_token : null;
        if (typeof token !== 'string' || !token) return 'fallo';
        await env.FOTOS.put(TOKEN_KEY, JSON.stringify({ token, base: access.base, renovada: now() }));
        return 'renovada';
    }

    async function file(request, env, ctx, kind, id) {
        const security = { 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'" };
        const missing = status => new Response(null, { status, headers: { ...security, 'Cache-Control': 'no-store' } });
        if (!ID.test(id)) return missing(404);
        const target = list => { const post = list.find(p => p.id === id); return kind === 'video' ? post?.video : post?.imagen; };
        let url = target(await posts(env, ctx));
        if (!url || !CDN.test(url)) return missing(404);
        const headers = {};
        const range = request.headers.get('Range');
        if (kind === 'video' && range) headers.Range = range;
        let upstream = await fetchImpl(url, { headers });
        // Las direcciones de Instagram vencen: si una ya no sirve, se lee la lista de nuevo y se intenta una vez más.
        if ([403, 404, 410].includes(upstream.status)) {
            url = target(await posts(env, ctx, { force: true }));
            if (!url || !CDN.test(url)) return missing(404);
            upstream = await fetchImpl(url, { headers });
        }
        const type = (upstream.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
        if (![200, 206].includes(upstream.status) || !TYPES[kind].test(type)) return missing(502);
        const out = {
            ...security, 'Content-Type': type, 'Access-Control-Allow-Origin': '*', 'Cross-Origin-Resource-Policy': 'cross-origin',
            'Cache-Control': kind === 'foto' ? 'public, max-age=86400' : 'public, max-age=3600'
        };
        for (const name of ['Content-Length', 'Content-Range', 'Accept-Ranges']) {
            const value = upstream.headers.get(name);
            if (value) out[name] = value;
        }
        return new Response(request.method === 'HEAD' ? null : upstream.body, { status: upstream.status, headers: out });
    }

    return {
        renew,
        posts,
        async fetch(request, env, ctx) {
            const url = new URL(request.url);
            if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: { 'X-Content-Type-Options': 'nosniff' } });
            const media = /^\/instagram\/(foto|video)\/([^/]+)$/.exec(url.pathname);
            if (media) return file(request, env, ctx, media[1], media[2]);
            if (url.pathname !== '/instagram') return new Response(null, { status: 404, headers: { 'X-Content-Type-Options': 'nosniff' } });
            const list = await posts(env, ctx);
            return new Response(JSON.stringify({ publicaciones: list.map(({ id, video, enlace, texto }) => ({ id, video: Boolean(video), enlace, texto })) }), {
                headers: {
                    'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'", 'Content-Type': 'application/json; charset=utf-8',
                    'Cache-Control': 'public, max-age=600', 'Access-Control-Allow-Origin': '*'
                }
            });
        },
        /** Cron diario: renueva la llave si toca y trae lo último publicado. */
        async scheduled(env) {
            const llave = await renew(env);
            const list = await posts(env, null, { force: true });
            return { llave, publicaciones: list.length };
        }
    };
}
