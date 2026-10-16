/**
 * Fotos del centro de control de Lauren Repostería (Cloudflare Worker «lauren-fotos»).
 *
 * El panel (/admin/) sube aquí las fotos nuevas y este worker las guarda en el repositorio de la web,
 * en assets/subidas/, con un solo commit por tanda. GitHub Pages las publica en uno o dos minutos.
 * La llave de GitHub vive aquí como secreto (GITHUB_TOKEN), nunca en el navegador.
 *
 * Solo atiende a quien entró al panel con clave y código: cada petición trae el token de Firebase,
 * que se verifica con las llaves públicas de Google y debe tener doble factor por app (TOTP).
 *
 *   GET  /fotos          Fotos ya subidas: { fotos: ['/assets/subidas/…'] }
 *   POST /fotos/subir    Una foto (multipart: foto, nombre). Se guarda en GitHub sin publicar y
 *                        devuelve { blob, nombre, firma }. Una por petición: así cada una cabe en
 *                        los límites del plan gratuito.
 *   POST /fotos/publicar { fotos: [{ blob, nombre, firma }] } → un commit con todas: { fotos: [rutas] }.
 *                        La firma (HMAC) garantiza que solo se publican fotos revisadas aquí, con el
 *                        nombre que puso este worker.
 */
const FOLDER = 'assets/subidas';
const NAME = /^[a-z0-9-]{1,80}\.(?:webp|jpg)$/;
const MAX_BYTES = 3 * 1024 * 1024;
const MAX_BATCH = 20;
const GOOGLE_KEYS = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const encoder = new TextEncoder();

export class HttpError extends Error {
    constructor(status, code) { super(code); this.status = status; this.code = code; }
}

/** Igual que AdminModel.slug: «Torta Corazón Lila» → «torta-corazon-lila». */
export const slug = text => String(text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

function fromBase64Url(text) {
    const base64 = text.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64 + '='.repeat((4 - base64.length % 4) % 4));
    return Uint8Array.from(binary, c => c.charCodeAt(0));
}
function toBase64(bytes) {
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(binary);
}
const toHex = buffer => [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');

/**
 * Verifica el token de Firebase (RS256) del panel: firma de Google, proyecto, vigencia y doble factor.
 * Devuelve sus datos o lanza HttpError 401 (sesión no válida) o 403 (sin doble factor).
 */
export async function verifyIdToken(token, { projectId, keys, now = Date.now() / 1000 }) {
    const parts = String(token || '').split('.');
    if (parts.length !== 3) throw new HttpError(401, 'sesion');
    let header, payload;
    try {
        header = JSON.parse(new TextDecoder().decode(fromBase64Url(parts[0])));
        payload = JSON.parse(new TextDecoder().decode(fromBase64Url(parts[1])));
    } catch { throw new HttpError(401, 'sesion'); }
    const jwk = header.alg === 'RS256' && keys.find(key => key.kid === header.kid);
    if (!jwk) throw new HttpError(401, 'sesion');
    const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, fromBase64Url(parts[2]), encoder.encode(`${parts[0]}.${parts[1]}`));
    const skew = 300;
    if (!valid || payload.iss !== `https://securetoken.google.com/${projectId}` || payload.aud !== projectId
        || typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 128
        || !(payload.exp > now) || !(payload.iat <= now + skew) || !(payload.auth_time <= now + skew)) throw new HttpError(401, 'sesion');
    if (payload.firebase?.sign_in_second_factor !== 'totp') throw new HttpError(403, 'doble-factor');
    return payload;
}

/** WebP (RIFF…WEBP) o JPG (FF D8 FF), mirando los primeros bytes; cualquier otra cosa no se acepta. */
export function photoType(bytes) {
    const text = (from, to) => String.fromCharCode(...bytes.subarray(from, to));
    if (bytes.length > 12 && text(0, 4) === 'RIFF' && text(8, 12) === 'WEBP') return 'webp';
    if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg';
    return null;
}

async function sign(secret, blob, name) {
    const key = await crypto.subtle.importKey('raw', encoder.encode(`lauren-fotos:${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(`${blob}:${name}`)));
}

/** Llama a la API de GitHub del repositorio de la web. */
function github(env, fetchImpl) {
    return async (method, path, body) => {
        const response = await fetchImpl(`https://api.github.com/repos/${env.GITHUB_REPO}${path}`, {
            method,
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${env.GITHUB_TOKEN}`,
                'User-Agent': 'lauren-fotos',
                'X-GitHub-Api-Version': '2022-11-28',
                ...(body ? { 'Content-Type': 'application/json' } : {})
            },
            body: body ? JSON.stringify(body) : undefined
        });
        if (!response.ok) throw Object.assign(new HttpError(502, 'github'), { github: response.status });
        return response.json();
    };
}

/** Un commit con todas las fotos de la tanda sobre la rama de la web. Si otro cambio llegó a la vez, reintenta. */
export async function commitPhotos(env, fetchImpl, photos) {
    const api = github(env, fetchImpl);
    const branch = env.GITHUB_BRANCH || 'main';
    const message = `Fotos subidas desde el centro de control (${photos.length})`;
    for (let attempt = 1; ; attempt++) {
        const parent = (await api('GET', `/git/ref/heads/${branch}`)).object.sha;
        const base = (await api('GET', `/git/commits/${parent}`)).tree.sha;
        const tree = await api('POST', '/git/trees', { base_tree: base, tree: photos.map(p => ({ path: `${FOLDER}/${p.nombre}`, mode: '100644', type: 'blob', sha: p.blob })) });
        const commit = await api('POST', '/git/commits', { message, tree: tree.sha, parents: [parent] });
        try {
            await api('PATCH', `/git/refs/heads/${branch}`, { sha: commit.sha, force: false });
            return commit.sha;
        } catch (error) {
            if (error.github !== 422 || attempt >= 3) throw error;
        }
    }
}

export function createHandler({ fetchImpl = (...args) => fetch(...args), now = () => Date.now() / 1000 } = {}) {
    let cachedKeys = null;
    let keysUntil = 0;
    async function googleKeys() {
        if (cachedKeys && now() < keysUntil) return cachedKeys;
        const response = await fetchImpl(GOOGLE_KEYS);
        if (!response.ok) throw new HttpError(503, 'llaves');
        cachedKeys = (await response.json()).keys || [];
        const maxAge = Number(/max-age=(\d+)/.exec(response.headers.get('Cache-Control') || '')?.[1] || 3600);
        keysUntil = now() + Math.min(maxAge, 6 * 3600);
        return cachedKeys;
    }

    return {
        async fetch(request, env) {
            const origin = request.headers.get('Origin') || '';
            const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
            const cors = allowed.includes(origin) ? {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Headers': 'Authorization, Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Max-Age': '86400'
            } : {};
            const reply = (status, data) => new Response(JSON.stringify(data), {
                status,
                headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Origin', ...cors }
            });
            const { pathname } = new URL(request.url);
            if (!['/fotos', '/fotos/subir', '/fotos/publicar'].includes(pathname)) return reply(404, { error: 'no-existe' });
            if (!cors['Access-Control-Allow-Origin']) return reply(403, { error: 'origen' });
            if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, Vary: 'Origin' } });
            try {
                if (!env.GITHUB_TOKEN || !env.GITHUB_REPO || !env.FIREBASE_PROJECT) throw new HttpError(500, 'configuracion');
                const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
                const user = await verifyIdToken(token, { projectId: env.FIREBASE_PROJECT, keys: await googleKeys(), now: now() });
                const admins = String(env.ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim()).filter(Boolean);
                if (admins.length && !admins.includes(String(user.email || '').toLowerCase())) throw new HttpError(403, 'permiso');
                const api = github(env, fetchImpl);

                if (pathname === '/fotos') {
                    if (request.method !== 'GET') throw new HttpError(405, 'metodo');
                    let items = [];
                    try { items = await api('GET', `/contents/${FOLDER}?ref=${encodeURIComponent(env.GITHUB_BRANCH || 'main')}`); }
                    catch (error) { if (error.github !== 404) throw error; }
                    return reply(200, { fotos: items.filter(item => item.type === 'file' && NAME.test(item.name)).map(item => `/${FOLDER}/${item.name}`) });
                }
                if (request.method !== 'POST') throw new HttpError(405, 'metodo');

                if (pathname === '/fotos/subir') {
                    let form;
                    try { form = await request.formData(); } catch { throw new HttpError(400, 'formulario'); }
                    const file = form.get('foto');
                    if (!file || typeof file === 'string') throw new HttpError(400, 'sin-foto');
                    if (file.size > MAX_BYTES) throw new HttpError(413, 'muy-grande');
                    const bytes = new Uint8Array(await file.arrayBuffer());
                    const type = photoType(bytes);
                    if (!type) throw new HttpError(415, 'formato');
                    const random = toHex(crypto.getRandomValues(new Uint8Array(3)));
                    const nombre = `${slug(form.get('nombre')).slice(0, 50) || 'foto'}-${Date.now().toString(36)}${random}.${type}`;
                    const blob = (await api('POST', '/git/blobs', { content: toBase64(bytes), encoding: 'base64' })).sha;
                    return reply(201, { blob, nombre, firma: await sign(env.GITHUB_TOKEN, blob, nombre) });
                }

                let body;
                try { body = await request.json(); } catch { throw new HttpError(400, 'formulario'); }
                const photos = Array.isArray(body?.fotos) ? body.fotos : [];
                if (!photos.length) throw new HttpError(400, 'sin-foto');
                if (photos.length > MAX_BATCH) throw new HttpError(413, 'demasiadas');
                for (const photo of photos) {
                    const ok = photo && /^[0-9a-f]{40}$/.test(photo.blob) && NAME.test(photo.nombre)
                        && typeof photo.firma === 'string' && photo.firma === await sign(env.GITHUB_TOKEN, photo.blob, photo.nombre);
                    if (!ok) throw new HttpError(400, 'firma');
                }
                const unique = [...new Map(photos.map(p => [p.nombre, { blob: p.blob, nombre: p.nombre }])).values()];
                await commitPhotos(env, fetchImpl, unique);
                return reply(201, { fotos: unique.map(p => `/${FOLDER}/${p.nombre}`) });
            } catch (error) {
                if (error instanceof HttpError) return reply(error.status, { error: error.code });
                return reply(500, { error: 'interno' });
            }
        }
    };
}

export default createHandler();
