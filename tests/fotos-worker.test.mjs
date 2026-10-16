import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, verifyIdToken, photoType, slug } from '../worker/fotos/src/index.js';

const PROJECT = 'lauren-reposteria';
const NOW = 1_800_000_000;
const ORIGIN = 'https://laurenreposteria.com';
const env = { FIREBASE_PROJECT: PROJECT, GITHUB_REPO: 'lauren/web', GITHUB_BRANCH: 'main', GITHUB_TOKEN: 'secreto-de-prueba', ALLOWED_ORIGINS: `${ORIGIN},http://localhost:5173`, ADMIN_EMAILS: '' };

const b64url = data => Buffer.from(data).toString('base64url');
const pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const jwk = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), kid: 'llave-1', alg: 'RS256', use: 'sig' };
async function idToken(changes = {}, { kid = 'llave-1', key = pair.privateKey } = {}) {
    const payload = { iss: `https://securetoken.google.com/${PROJECT}`, aud: PROJECT, sub: 'admin-1', email: 'admin@lauren.co', iat: NOW - 60, auth_time: NOW - 120, exp: NOW + 3000, firebase: { sign_in_provider: 'password', sign_in_second_factor: 'totp' }, ...changes };
    const head = `${b64url(JSON.stringify({ alg: 'RS256', kid, typ: 'JWT' }))}.${b64url(JSON.stringify(payload))}`;
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(head));
    return `${head}.${b64url(new Uint8Array(signature))}`;
}
const WEBP = new Uint8Array([...Buffer.from('RIFF'), 1, 0, 0, 0, ...Buffer.from('WEBPVP8 '), 0, 0]);
const JPG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 16]);

/** GitHub y las llaves de Google simulados: registra cada llamada. */
function fakeServices({ refConflicts = 0, folder = [] } = {}) {
    const calls = [];
    let conflicts = refConflicts;
    const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers });
    const fetchImpl = async (url, options = {}) => {
        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body) : null;
        calls.push({ url: String(url), method, body, auth: options.headers?.Authorization });
        if (String(url).includes('googleapis.com')) return json({ keys: [jwk] }, 200, { 'Cache-Control': 'public, max-age=20000' });
        const path = String(url).replace('https://api.github.com/repos/lauren/web', '');
        if (path === '/git/blobs') return json({ sha: 'b'.repeat(40) }, 201);
        if (path === '/git/ref/heads/main') return json({ object: { sha: 'c'.repeat(40) } });
        if (path.startsWith('/git/commits/')) return json({ tree: { sha: 't'.repeat(40) } });
        if (path === '/git/trees') return json({ sha: 'n'.repeat(40) }, 201);
        if (path === '/git/commits') return json({ sha: 'd'.repeat(40) }, 201);
        if (path === '/git/refs/heads/main') return conflicts-- > 0 ? json({ message: 'not fast forward' }, 422) : json({ object: { sha: 'd'.repeat(40) } });
        if (path.startsWith('/contents/assets/subidas')) return folder ? json(folder) : json({ message: 'Not Found' }, 404);
        return json({ message: 'inesperado' }, 500);
    };
    return { calls, handler: createHandler({ fetchImpl, now: () => NOW }) };
}
async function upload(handler, bytes, { token, name = 'Torta Corazón Lila', origin = ORIGIN } = {}) {
    const form = new FormData();
    form.append('foto', new File([bytes], 'foto.webp'));
    form.append('nombre', name);
    return handler.fetch(new Request('https://lauren-fotos.example.workers.dev/fotos/subir', { method: 'POST', body: form, headers: { Authorization: `Bearer ${token ?? await idToken()}`, Origin: origin } }), env);
}
const publish = async (handler, fotos, token) => handler.fetch(new Request('https://lauren-fotos.example.workers.dev/fotos/publicar', {
    method: 'POST', body: JSON.stringify({ fotos }), headers: { Authorization: `Bearer ${token ?? await idToken()}`, Origin: ORIGIN, 'Content-Type': 'application/json' }
}), env);

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

test('Sube una foto: la guarda en GitHub sin publicar y devuelve su nombre firmado', async () => {
    const { calls, handler } = fakeServices();
    const response = await upload(handler, WEBP);
    assert.equal(response.status, 201);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), ORIGIN);
    const data = await response.json();
    assert.match(data.nombre, /^torta-corazon-lila-[a-z0-9]+\.webp$/);
    assert.match(data.firma, /^[0-9a-f]{64}$/);
    const blob = calls.find(c => c.url.endsWith('/git/blobs'));
    assert.equal(blob.auth, 'Bearer secreto-de-prueba');
    assert.deepEqual(Buffer.from(blob.body.content, 'base64'), Buffer.from(WEBP));
    assert.ok(!calls.some(c => c.url.includes('/git/refs/')), 'subir no publica');
});

test('Publica la tanda en un solo commit dentro de assets/subidas, y reintenta si otro cambio llegó a la vez', async () => {
    const { calls, handler } = fakeServices({ refConflicts: 1 });
    const first = await (await upload(handler, WEBP)).json();
    const second = await (await upload(handler, JPG, { name: 'Torta Corazón Lila' })).json();
    const response = await publish(handler, [first, second]);
    assert.equal(response.status, 201);
    assert.deepEqual((await response.json()).fotos, [`/assets/subidas/${first.nombre}`, `/assets/subidas/${second.nombre}`]);
    const trees = calls.filter(c => c.url.endsWith('/git/trees'));
    assert.equal(trees.length, 2, 'un intento fallido y uno bueno');
    assert.deepEqual(trees[1].body.tree.map(t => t.path), [`assets/subidas/${first.nombre}`, `assets/subidas/${second.nombre}`]);
    assert.equal(calls.filter(c => c.url.endsWith('/git/refs/heads/main')).at(-1).body.force, false);
    assert.equal(calls.filter(c => c.url.endsWith('/git/commits') && c.method === 'POST').length, 2);
});

test('No publica fotos con el nombre o la firma cambiados', async () => {
    const { calls, handler } = fakeServices();
    const photo = await (await upload(handler, WEBP)).json();
    for (const fake of [{ ...photo, nombre: 'index.html' }, { ...photo, nombre: 'otra-foto.webp' }, { ...photo, blob: 'e'.repeat(40) }, { ...photo, firma: '0'.repeat(64) }, { ...photo, nombre: '../../index.html' }]) {
        const response = await publish(handler, [fake]);
        assert.equal(response.status, 400, JSON.stringify(fake));
    }
    assert.ok(!calls.some(c => c.url.endsWith('/git/trees')));
});

test('Rechaza otros archivos, otros sitios, sesiones sin doble factor y correos fuera de la lista', async () => {
    const { calls, handler } = fakeServices();
    assert.equal((await upload(handler, new TextEncoder().encode('<svg onload=alert(1)>'))).status, 415);
    assert.equal((await upload(handler, new Uint8Array(3 * 1024 * 1024 + 1).fill(255))).status, 413);
    assert.equal((await upload(handler, WEBP, { origin: 'https://otro-sitio.com' })).status, 403);
    assert.equal((await upload(handler, WEBP, { token: 'x.y.z' })).status, 401);
    assert.equal((await upload(handler, WEBP, { token: await idToken({ firebase: {} }) })).status, 403);
    const strict = { ...env, ADMIN_EMAILS: 'lauren@lauren.co, otra@lauren.co' };
    const form = new FormData(); form.append('foto', new File([WEBP], 'a.webp'));
    const denied = await handler.fetch(new Request('https://x.workers.dev/fotos/subir', { method: 'POST', body: form, headers: { Authorization: `Bearer ${await idToken()}`, Origin: ORIGIN } }), strict);
    assert.equal(denied.status, 403);
    assert.ok(!calls.some(c => c.url.includes('api.github.com')), 'nada llega a GitHub');
    const preflight = await handler.fetch(new Request('https://x.workers.dev/fotos/subir', { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173' } }), env);
    assert.equal(preflight.status, 204);
    assert.match(preflight.headers.get('Access-Control-Allow-Headers'), /Authorization/);
});

test('Lista las fotos ya subidas (y ninguna si la carpeta aún no existe)', async () => {
    const list = async folder => {
        const { handler } = fakeServices({ folder });
        const response = await handler.fetch(new Request('https://x.workers.dev/fotos', { headers: { Authorization: `Bearer ${await idToken()}`, Origin: ORIGIN } }), env);
        return (await response.json()).fotos;
    };
    assert.deepEqual(await list([{ type: 'file', name: 'torta-a-1.webp' }, { type: 'file', name: 'LEEME.md' }, { type: 'dir', name: 'x' }]), ['/assets/subidas/torta-a-1.webp']);
    assert.deepEqual(await list(null), []);
});
