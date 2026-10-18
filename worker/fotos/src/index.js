/**
 * Fotos del centro de control de Lauren Repostería (Cloudflare Worker «lauren-reposteria»,
 * en https://lauren-reposteria.crizczi22.workers.dev).
 *
 * El panel (/admin/) sube aquí las fotos nuevas y este worker las guarda en Workers KV (binding FOTOS,
 * plan gratuito, sin tarjeta) y las sirve a la web. Las fotos no usan llaves ni secretos: solo atiende a quien
 * entró al panel con clave y código, verificando el token de Firebase con las llaves públicas de
 * Google (doble factor por app, TOTP).
 *
 *   GET  /f/<nombre>   La foto, pública y con caché larga (el nombre no cambia nunca).
 *   GET  /fotos        Fotos ya subidas: { fotos: [url] } (solo administradores).
 *   POST /fotos/subir  Una foto (multipart: foto, su miniatura de 320 px y nombre) → { foto: url }. La web
 *                      usa la miniatura (<nombre>-320.webp) en las filas de fotos.
 *   DELETE /fotos/<nombre>  Borra una foto subida y su miniatura (solo administradores). El panel solo lo
 *                      ofrece para fotos que ningún producto usa. No se pierden de inmediato: pasan 30 días a la
 *                      papelera (claves «papelera/…», que nadie ve), por si fue un error o alguien entró sin permiso.
 *                      Queda marcada en «fotos-borradas», así GET /fotos no la vuelve a mostrar aunque la lista de
 *                      KV tarde en ponerse al día. Borrar una foto que ya no estaba responde igual (yaNoEstaba).
 *   POST /fotos/recuperar/<nombre>  Devuelve desde la papelera una foto borrada y su miniatura (solo administradores).
 *   GET  /instagram…   Lo último de Instagram para la portada (ver instagram.js). Es lo único que usa un secreto:
 *                      INSTAGRAM_TOKEN, opcional.
 */
import { createInstagram } from './instagram.js';

const NAME = /^[a-z0-9-]{1,80}\.(?:webp|jpg)$/;
const THUMB = /-320\.(?:webp|jpg)$/;
const MAX_BYTES = 3 * 1024 * 1024;
const MAX_THUMB = 400 * 1024;
const TYPES = { webp: 'image/webp', jpg: 'image/jpeg' };
const TRASH = 'papelera/';
const TRASH_TTL = 30 * 86400;
const DELETED = 'fotos-borradas';
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

async function readPhoto(file, max) {
    if (!file || typeof file === 'string') return null;
    if (file.size > max) throw new HttpError(413, 'muy-grande');
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = photoType(bytes);
    if (!type) throw new HttpError(415, 'formato');
    return { bytes, type };
}

export function createHandler({ fetchImpl = (...args) => fetch(...args), now = () => Date.now() / 1000 } = {}) {
    const instagram = createInstagram({ fetchImpl, now });
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
        async fetch(request, env, ctx) {
            const url = new URL(request.url);
            const security = { 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'" };
            if (url.pathname === '/instagram' || url.pathname.startsWith('/instagram/')) return instagram.fetch(request, env, ctx);

            // La foto: pública, para la web y el panel.
            const file = /^\/f\/([^/]+)$/.exec(url.pathname)?.[1];
            if (file !== undefined) {
                if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: security });
                const stored = NAME.test(file) && env.FOTOS ? await env.FOTOS.get(file, { type: 'arrayBuffer', cacheTtl: 86400 }) : null;
                if (!stored) return new Response('No existe.', { status: 404, headers: { ...security, 'Cache-Control': 'no-store' } });
                return new Response(request.method === 'HEAD' ? null : stored, {
                    headers: { ...security, 'Content-Type': TYPES[file.split('.').pop()], 'Content-Length': String(stored.byteLength), 'Cache-Control': 'public, max-age=31536000, immutable', 'Access-Control-Allow-Origin': '*' }
                });
            }

            const origin = request.headers.get('Origin') || '';
            const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
            const cors = allowed.includes(origin) ? {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Headers': 'Authorization, Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Max-Age': '86400'
            } : {};
            const reply = (status, data) => new Response(JSON.stringify(data), {
                status,
                headers: { ...security, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin', ...cors }
            });
            const remove = /^\/fotos\/([^/]+)$/.exec(url.pathname)?.[1];
            const restore = /^\/fotos\/recuperar\/([^/]+)$/.exec(url.pathname)?.[1];
            if (!['/fotos', '/fotos/subir'].includes(url.pathname) && remove === undefined && restore === undefined) return reply(404, { error: 'no-existe' });
            if (!cors['Access-Control-Allow-Origin']) return reply(403, { error: 'origen' });
            if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, Vary: 'Origin' } });
            try {
                if (!env.FOTOS || !env.FIREBASE_PROJECT) throw new HttpError(500, 'configuracion');
                const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
                const user = await verifyIdToken(token, { projectId: env.FIREBASE_PROJECT, keys: await googleKeys(), now: now() });
                const admins = String(env.ADMIN_EMAILS || '').toLowerCase().split(',').map(e => e.trim()).filter(Boolean);
                if (admins.length && !admins.includes(String(user.email || '').toLowerCase())) throw new HttpError(403, 'permiso');
                const link = name => `${url.origin}/f/${name}`;
                const thumbOf = name => name.replace(/\.(\w+)$/, '-320.$1');
                // Pasa un archivo de una clave a otra (con sus datos, que `change` puede ajustar) y borra el de origen.
                async function move(from, to, { expirationTtl, change = data => data } = {}) {
                    const { value, metadata } = await env.FOTOS.getWithMetadata(from, { type: 'arrayBuffer' });
                    if (!value) return false;
                    await env.FOTOS.put(to, value, { ...(expirationTtl ? { expirationTtl } : {}), metadata: change(metadata || {}) });
                    await env.FOTOS.delete(from);
                    return true;
                }

                // La lista de claves de KV tarda en ponerse al día (puede seguir mostrando una foto recién borrada):
                // cada borrado deja una marca, y la lista de fotos subidas nunca muestra las marcadas.
                const marks = async () => (await env.FOTOS.get(DELETED, { type: 'json' })) || {};
                async function mark(name, deleted) {
                    const all = await marks();
                    if (deleted) all[name] = new Date(now() * 1000).toISOString(); else delete all[name];
                    // A los 30 días la lista ya está al día y la papelera se vació sola: la marca sobra.
                    for (const [key, date] of Object.entries(all)) if (now() - Date.parse(date) / 1000 > TRASH_TTL) delete all[key];
                    await env.FOTOS.put(DELETED, JSON.stringify(all));
                }

                if (restore !== undefined) {
                    if (request.method !== 'POST') throw new HttpError(405, 'metodo');
                    if (!NAME.test(restore) || THUMB.test(restore)) throw new HttpError(400, 'nombre');
                    const back = { change: ({ borrada, por, ...data }) => data };
                    if (!(await move(`${TRASH}${restore}`, restore, back))) throw new HttpError(404, 'no-existe');
                    await move(`${TRASH}${thumbOf(restore)}`, thumbOf(restore), back);
                    await mark(restore, false);
                    return reply(200, { recuperada: link(restore) });
                }

                if (remove !== undefined && remove !== 'subir') {
                    if (request.method !== 'DELETE') throw new HttpError(405, 'metodo');
                    if (!NAME.test(remove) || THUMB.test(remove)) throw new HttpError(400, 'nombre');
                    // A la papelera por 30 días (KV la borra sola al vencer): primero la miniatura, luego la foto. Si ya no
                    // estaba, igual queda marcada: el panel deja de mostrarla y borrar dos veces no es un error.
                    const deleted = { borrada: new Date(now() * 1000).toISOString(), por: String(user.email || user.sub) };
                    const trash = { expirationTtl: TRASH_TTL, change: data => ({ ...data, ...deleted }) };
                    await move(thumbOf(remove), `${TRASH}${thumbOf(remove)}`, trash);
                    const existed = await move(remove, `${TRASH}${remove}`, trash);
                    await mark(remove, true);
                    return reply(200, existed ? { borrada: remove, recuperableHasta: new Date((now() + TRASH_TTL) * 1000).toISOString() } : { borrada: remove, yaNoEstaba: true });
                }

                if (url.pathname === '/fotos') {
                    if (request.method !== 'GET') throw new HttpError(405, 'metodo');
                    const gone = await marks();
                    const names = [];
                    let cursor;
                    do {
                        const page = await env.FOTOS.list({ cursor, limit: 1000 });
                        names.push(...page.keys.map(k => k.name).filter(n => NAME.test(n) && !THUMB.test(n) && !gone[n]));
                        cursor = page.list_complete ? null : page.cursor;
                    } while (cursor);
                    return reply(200, { fotos: names.map(link) });
                }

                if (request.method !== 'POST') throw new HttpError(405, 'metodo');
                let form;
                try { form = await request.formData(); } catch { throw new HttpError(400, 'formulario'); }
                const photo = await readPhoto(form.get('foto'), MAX_BYTES);
                if (!photo) throw new HttpError(400, 'sin-foto');
                const thumb = await readPhoto(form.get('miniatura'), MAX_THUMB);
                if (!thumb) throw new HttpError(400, 'sin-miniatura');
                if (thumb.type !== photo.type) throw new HttpError(415, 'formato');
                const base = `${slug(form.get('nombre')).slice(0, 50) || 'foto'}-${Date.now().toString(36)}${toHex(crypto.getRandomValues(new Uint8Array(3)))}`;
                const name = `${base}.${photo.type}`;
                const metadata = { subida: new Date(now() * 1000).toISOString() };
                await env.FOTOS.put(`${base}-320.${thumb.type}`, thumb.bytes, { metadata: { ...metadata, de: name } });
                await env.FOTOS.put(name, photo.bytes, { metadata });
                return reply(201, { foto: link(name) });
            } catch (error) {
                if (error instanceof HttpError) return reply(error.status, { error: error.code });
                return reply(500, { error: 'interno' });
            }
        },
        scheduled(event, env, ctx) {
            ctx.waitUntil(instagram.scheduled(env));
        }
    };
}

export default createHandler();
