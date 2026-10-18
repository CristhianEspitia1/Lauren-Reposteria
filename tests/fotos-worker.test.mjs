import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, verifyIdToken, photoType, slug } from '../worker/fotos/src/index.js';

const PROJECT = 'lauren-reposteria';
const NOW = 1_800_000_000;
const ORIGIN = 'https://laurenreposteria.com';
const WORKER = 'https://lauren-reposteria.crizczi22.workers.dev';

const b64url = data => Buffer.from(data).toString('base64url');
const pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const jwk = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), kid: 'llave-1', alg: 'RS256', use: 'sig' };
async function idToken(changes = {}, { kid = 'llave-1', key = pair.privateKey } = {}) {
    const payload = { iss: `https://securetoken.google.com/${PROJECT}`, aud: PROJECT, sub: 'admin-1', email: 'admin@lauren.co', iat: NOW - 60, auth_time: NOW - 120, exp: NOW + 3000, firebase: { sign_in_provider: 'password', sign_in_second_factor: 'totp' }, ...changes };
    const head = `${b64url(JSON.stringify({ alg: 'RS256', kid, typ: 'JWT' }))}.${b64url(JSON.stringify(payload))}`;
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(head));
    return `${head}.${b64url(new Uint8Array(signature))}`;
}
const WEBP = new Uint8Array([...Buffer.from('RIFF'), 1, 0, 0, 0, ...Buffer.from('WEBPVP8 '), 0, 0, 7]);
const WEBP_MINI = new Uint8Array([...Buffer.from('RIFF'), 1, 0, 0, 0, ...Buffer.from('WEBPVP8 '), 0, 0, 3]);
const JPG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 16]);

/**
 * Workers KV y las llaves de Google simulados. Con `staleList`, la lista de claves se comporta como la de KV real
 * cuando aún no se pone al día: sigue mostrando las claves borradas y todavía no muestra las nuevas.
 */
function fakeWorker(vars = {}, { staleList = false } = {}) {
    const store = new Map();
    const listed = new Set();
    const kv = {
        async get(key, options) {
            if (!store.has(key)) return null;
            const value = store.get(key).value;
            return (typeof options === 'object' ? options.type : options) === 'json' ? JSON.parse(new TextDecoder().decode(value)) : value.buffer.slice(0);
        },
        async getWithMetadata(key, options) { return store.has(key) ? { value: store.get(key).value.buffer.slice(0), metadata: store.get(key).metadata ?? null } : { value: null, metadata: null }; },
        async put(key, value, options) {
            store.set(key, { value: typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value), metadata: options?.metadata, ttl: options?.expirationTtl });
            if (!staleList) listed.add(key);
        },
        async list({ prefix = '', limit = 1000 } = {}) {
            const keys = staleList ? [...listed] : [...store.keys()];
            return { keys: keys.filter(name => name.startsWith(prefix)).sort().slice(0, limit).map(name => ({ name })), list_complete: true };
        },
        async delete(key) { store.delete(key); }
    };
    // Lo que había antes de que la lista quedara atrasada: se sigue listando aunque se borre.
    kv.listNow = () => store.forEach((_, key) => listed.add(key));
    const env = { FIREBASE_PROJECT: PROJECT, ALLOWED_ORIGINS: `${ORIGIN},http://localhost:5173`, ADMIN_EMAILS: '', FOTOS: kv, ...vars };
    let googleCalls = 0;
    const fetchImpl = async url => {
        assert.ok(String(url).includes('googleapis.com'), 'el worker solo consulta las llaves de Google');
        googleCalls++;
        return new Response(JSON.stringify({ keys: [jwk] }), { headers: { 'Cache-Control': 'public, max-age=20000' } });
    };
    const handler = createHandler({ fetchImpl, now: () => NOW });
    return { store, env, handler, googleCalls: () => googleCalls, call: request => handler.fetch(request, env) };
}
async function upload(worker, { photo = WEBP, thumb = WEBP_MINI, token, name = 'Torta Corazón Lila', origin = ORIGIN } = {}) {
    const form = new FormData();
    if (photo) form.append('foto', new File([photo], 'foto.webp'));
    if (thumb) form.append('miniatura', new File([thumb], 'mini.webp'));
    form.append('nombre', name);
    return worker.call(new Request(`${WORKER}/fotos/subir`, { method: 'POST', body: form, headers: { Authorization: `Bearer ${token ?? await idToken()}`, Origin: origin } }));
}

test('Solo acepta tokens de Firebase del proyecto, vigentes y con doble factor', async () => {
    const opts = { projectId: PROJECT, keys: [jwk], now: NOW };
    assert.equal((await verifyIdToken(await idToken(), opts)).sub, 'admin-1');
    const rejects = async (token, status) => assert.rejects(verifyIdToken(token, opts), error => error.status === status);
    await rejects(await idToken({ aud: 'otro-proyecto' }), 401);
    await rejects(await idToken({ iss: 'https://securetoken.google.com/otro' }), 401);
    await rejects(await idToken({ exp: NOW - 1 }), 401);
    await rejects(await idToken({ sub: '' }), 401);
    await rejects(await idToken({}, { kid: 'otra' }), 401);
    const other = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign']);
    await rejects(await idToken({}, { key: other.privateKey }), 401);
    const [head, , sig] = (await idToken()).split('.');
    await rejects(`${head}.${b64url(JSON.stringify({ sub: 'otro' }))}.${sig}`, 401);
    await rejects('no-es-un-token', 401);
    await rejects(await idToken({ firebase: { sign_in_provider: 'password' } }), 403);
});

test('Reconoce WebP y JPG por su contenido y nombra las fotos sin tildes', () => {
    assert.equal(photoType(WEBP), 'webp');
    assert.equal(photoType(JPG), 'jpg');
    assert.equal(photoType(new TextEncoder().encode('<html><script>')), null);
    assert.equal(slug('Torta Corazón Lila · ñ'), 'torta-corazon-lila-n');
});

test('Sube una foto con su miniatura y la sirve al instante, con caché larga', async () => {
    const worker = fakeWorker();
    const response = await upload(worker);
    assert.equal(response.status, 201);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN);
    const { foto } = await response.json();
    assert.match(foto, /^https:\/\/lauren-reposteria\.crizczi22\.workers\.dev\/f\/torta-corazon-lila-[a-z0-9]+\.webp$/);
    const name = foto.split('/').pop();
    assert.deepEqual([...worker.store.keys()].sort(), [name, name.replace('.webp', '-320.webp')].sort());

    const image = await worker.call(new Request(foto));
    assert.equal(image.status, 200);
    assert.equal(image.headers.get('Content-Type'), 'image/webp');
    assert.match(image.headers.get('Cache-Control'), /immutable/);
    assert.equal(image.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.deepEqual(new Uint8Array(await image.arrayBuffer()), WEBP);
    const mini = await worker.call(new Request(foto.replace('.webp', '-320.webp')));
    assert.deepEqual(new Uint8Array(await mini.arrayBuffer()), WEBP_MINI);
    assert.equal((await worker.call(new Request(`${WORKER}/f/no-existe.webp`))).status, 404);
    assert.equal((await worker.call(new Request(`${WORKER}/f/..%2Fsecreto.webp`))).status, 404);
    assert.equal((await worker.call(new Request(foto, { method: 'DELETE' }))).status, 405);
});

test('Lista solo las fotos subidas, sin sus miniaturas', async () => {
    const worker = fakeWorker();
    const { foto } = await (await upload(worker)).json();
    const response = await worker.call(new Request(`${WORKER}/fotos`, { headers: { Authorization: `Bearer ${await idToken()}`, Origin: ORIGIN } }));
    assert.deepEqual((await response.json()).fotos, [foto]);
    assert.equal(worker.googleCalls(), 1, 'las llaves de Google se guardan en memoria');
});

test('Borra una foto subida y su miniatura, solo con sesión de administrador, y la guarda 30 días en la papelera', async () => {
    const worker = fakeWorker();
    const { foto } = await (await upload(worker)).json();
    const name = foto.split('/').pop();
    const thumb = name.replace('.webp', '-320.webp');
    const remove = async (target, token) => worker.call(new Request(`${WORKER}/fotos/${target}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token ?? await idToken()}`, Origin: ORIGIN } }));
    assert.equal((await remove(name, 'x.y.z')).status, 401);
    assert.equal((await remove(thumb)).status, 400, 'la miniatura no se borra sola');
    assert.equal((await remove('..%2Fsecreto.webp')).status, 400);
    assert.deepEqual([...worker.store.keys()].sort(), [name, thumb].sort(), 'nada se borró aún');
    const response = await remove(name);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { borrada: name, recuperableHasta: new Date((NOW + 30 * 86400) * 1000).toISOString() });
    assert.deepEqual([...worker.store.keys()].filter(k => k !== 'fotos-borradas').sort(), [`papelera/${name}`, `papelera/${thumb}`].sort(), 'la foto y su miniatura pasan a la papelera');
    for (const key of [`papelera/${name}`, `papelera/${thumb}`]) {
        assert.equal(worker.store.get(key).ttl, 30 * 86400, 'la papelera se vacía sola a los 30 días');
        assert.equal(worker.store.get(key).metadata.por, 'admin@lauren.co');
    }
    const again = await remove(name);
    assert.equal(again.status, 200, 'borrar dos veces no es un error');
    assert.deepEqual(await again.json(), { borrada: name, yaNoEstaba: true });
    assert.equal((await worker.call(new Request(foto))).status, 404, 'la web ya no la muestra');
    assert.equal((await worker.call(new Request(`${WORKER}/f/papelera%2F${name}`))).status, 404, 'la papelera no se sirve');
    const list = await worker.call(new Request(`${WORKER}/fotos`, { headers: { Authorization: `Bearer ${await idToken()}`, Origin: ORIGIN } }));
    assert.deepEqual((await list.json()).fotos, [], 'la papelera no aparece entre las fotos subidas');
    const preflight = await worker.call(new Request(`${WORKER}/fotos/${name}`, { method: 'OPTIONS', headers: { Origin: ORIGIN } }));
    assert.match(preflight.headers.get('Access-Control-Allow-Methods'), /DELETE/);
});

test('Recupera una foto borrada desde la papelera, solo con sesión de administrador', async () => {
    const worker = fakeWorker();
    const { foto } = await (await upload(worker)).json();
    const name = foto.split('/').pop();
    const headers = async (token) => ({ Authorization: `Bearer ${token ?? await idToken()}`, Origin: ORIGIN });
    await worker.call(new Request(`${WORKER}/fotos/${name}`, { method: 'DELETE', headers: await headers() }));
    const restore = async (target, token, method = 'POST') => worker.call(new Request(`${WORKER}/fotos/recuperar/${target}`, { method, headers: await headers(token) }));
    assert.equal((await restore(name, 'x.y.z')).status, 401);
    assert.equal((await restore(name, await idToken({ firebase: {} }))).status, 403);
    assert.equal((await restore(name, undefined, 'GET')).status, 405);
    assert.equal((await restore('no-existe.webp')).status, 404);
    assert.equal((await restore('..%2Fsecreto.webp')).status, 400);
    const response = await restore(name);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { recuperada: foto });
    assert.deepEqual([...worker.store.keys()].filter(k => k !== 'fotos-borradas').sort(), [name, name.replace('.webp', '-320.webp')].sort(), 'vuelven la foto y su miniatura');
    const listed = await worker.call(new Request(`${WORKER}/fotos`, { headers: await headers() }));
    assert.deepEqual((await listed.json()).fotos, [foto], 'vuelve a la lista de fotos subidas');
    assert.equal(worker.store.get(name).ttl, undefined, 'recuperada, ya no vence');
    assert.equal(worker.store.get(name).metadata.borrada, undefined);
    assert.deepEqual(new Uint8Array(await (await worker.call(new Request(foto))).arrayBuffer()), WEBP, 'la web la muestra otra vez');
    assert.equal((await restore(name)).status, 404, 'ya no está en la papelera');
});

test('Rechaza otros archivos, otros sitios, sesiones sin doble factor y correos fuera de la lista', async () => {
    const worker = fakeWorker();
    assert.equal((await upload(worker, { photo: new TextEncoder().encode('<svg onload=alert(1)>') })).status, 415);
    assert.equal((await upload(worker, { photo: new Uint8Array(3 * 1024 * 1024 + 1).fill(255) })).status, 413);
    assert.equal((await upload(worker, { thumb: null })).status, 400);
    assert.equal((await upload(worker, { thumb: JPG })).status, 415);
    assert.equal((await upload(worker, { origin: 'https://otro-sitio.com' })).status, 403);
    assert.equal((await upload(worker, { token: 'x.y.z' })).status, 401);
    assert.equal((await upload(worker, { token: await idToken({ firebase: {} }) })).status, 403);
    const strict = fakeWorker({ ADMIN_EMAILS: 'lauren@lauren.co, otra@lauren.co' });
    assert.equal((await upload(strict)).status, 403);
    assert.equal((await upload(fakeWorker({ ADMIN_EMAILS: 'Admin@Lauren.co' }))).status, 201);
    assert.equal(worker.store.size, 0, 'nada se guardó');
    const preflight = await worker.call(new Request(`${WORKER}/fotos/subir`, { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173' } }));
    assert.equal(preflight.status, 204);
    assert.match(preflight.headers.get('Access-Control-Allow-Headers'), /Authorization/);
    const missing = fakeWorker({ FOTOS: undefined });
    assert.equal((await upload(missing)).status, 500);
});

test('Una foto borrada no vuelve a la lista aunque la lista de KV siga atrasada', async () => {
    const worker = fakeWorker({}, { staleList: true });
    const auth = { Authorization: `Bearer ${await idToken()}`, Origin: ORIGIN };
    const { foto } = await (await upload(worker)).json();
    const otra = (await (await upload(worker, { name: 'Otra torta' })).json()).foto;
    worker.env.FOTOS.listNow();
    const list = async () => (await (await worker.call(new Request(`${WORKER}/fotos`, { headers: auth }))).json()).fotos.sort();
    assert.deepEqual(await list(), [foto, otra].sort());
    const response = await worker.call(new Request(`${WORKER}/fotos/${foto.split('/').pop()}`, { method: 'DELETE', headers: auth }));
    assert.equal(response.status, 200);
    assert.deepEqual(await list(), [otra], 'la borrada no vuelve aunque KV la siga listando');
    const reciente = (await (await upload(worker, { name: 'Recién subida' })).json()).foto;
    const quick = await worker.call(new Request(`${WORKER}/fotos/${reciente.split('/').pop()}`, { method: 'DELETE', headers: auth }));
    assert.equal(quick.status, 200, 'una foto recién subida se borra aunque la lista aún no la muestre');
    assert.ok(!(await quick.json()).yaNoEstaba);
    assert.equal((await worker.call(new Request(reciente))).status, 404);
});
