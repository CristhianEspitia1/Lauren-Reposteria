import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../worker/fotos/src/index.js';
import { postsFrom, shortText } from '../worker/fotos/src/instagram.js';

const WORKER = 'https://lauren-reposteria.crizczi22.workers.dev';
const CDN = 'https://scontent-mia3-1.cdninstagram.com/v/t51';
const NOW = 1_800_000_000;

const media = [
    { id: '101', media_type: 'VIDEO', media_url: `${CDN}/reel-101.mp4?oe=1`, thumbnail_url: `${CDN}/reel-101.jpg?oe=1`, permalink: 'https://www.instagram.com/reel/AbC101/', caption: 'Torta de cumpleaños lila 🎂✨ para Sofi. Gracias por confiar en nosotros #tortas @sofi' },
    { id: '102', media_type: 'IMAGE', media_url: `${CDN}/foto-102.jpg?oe=1`, permalink: 'https://www.instagram.com/p/AbC102/', caption: '' },
    { id: '103', media_type: 'CAROUSEL_ALBUM', permalink: 'https://www.instagram.com/p/AbC103/', caption: 'Alfajores', children: { data: [{ media_type: 'VIDEO', media_url: `${CDN}/c-103.mp4`, thumbnail_url: `${CDN}/c-103.jpg` }] } },
    // Reel con música con derechos: Instagram no entrega su video.
    { id: '104', media_type: 'VIDEO', thumbnail_url: `${CDN}/reel-104.jpg`, permalink: 'https://www.instagram.com/reel/AbC104/', caption: 'Detalle' },
    { id: '105', media_type: 'IMAGE', media_url: 'https://otro-sitio.com/foto.jpg', permalink: 'https://www.instagram.com/p/AbC105/' },
    { id: '106', media_type: 'IMAGE', media_url: `${CDN}/foto-106.jpg`, permalink: 'javascript:alert(1)' },
    { id: '../107', media_type: 'IMAGE', media_url: `${CDN}/foto-107.jpg`, permalink: 'https://www.instagram.com/p/AbC107/' }
];

/** Workers KV, la API de Instagram y su CDN simulados. */
function fakeWorker({ token = 'llave-1', graph = () => ({ data: media }), cdn } = {}) {
    const store = new Map();
    const kv = {
        async get(key, options) { const value = store.get(key); return value === undefined ? null : options?.type === 'json' ? JSON.parse(value) : value; },
        async put(key, value) { store.set(key, value); },
        async list() { return { keys: [], list_complete: true }; },
        async delete(key) { store.delete(key); }
    };
    const env = { FIREBASE_PROJECT: 'lauren-reposteria', ALLOWED_ORIGINS: 'https://laurenreposteria.com', FOTOS: kv, INSTAGRAM_TOKEN: token };
    const calls = [];
    let clock = NOW;
    const fetchImpl = async (url, init = {}) => {
        url = String(url);
        calls.push({ url, range: init.headers?.Range });
        if (url.startsWith('https://graph.instagram.com/me/media')) {
            const body = graph(new URL(url).searchParams.get('access_token'));
            return body ? Response.json(body) : new Response('{}', { status: 400 });
        }
        if (url.startsWith('https://graph.instagram.com/refresh_access_token')) return Response.json({ access_token: 'llave-renovada', expires_in: 5184000 });
        if (cdn) return cdn(url, init);
        if (url.includes('.mp4')) return new Response('video', { status: init.headers?.Range ? 206 : 200, headers: { 'Content-Type': 'video/mp4', 'Content-Range': 'bytes 0-4/5', 'Accept-Ranges': 'bytes', 'Content-Length': '5', 'Set-Cookie': 'x=1' } });
        return new Response('foto', { headers: { 'Content-Type': 'image/jpeg' } });
    };
    const handler = createHandler({ fetchImpl, now: () => clock });
    const waits = [];
    const ctx = { waitUntil: promise => waits.push(promise) };
    return {
        store, env, calls, waits, tick: seconds => { clock += seconds; },
        call: (path, init) => handler.fetch(new Request(`${WORKER}${path}`, init), env, ctx),
        cron: () => handler.scheduled({}, env, ctx)
    };
}

test('Deja solo publicaciones de Instagram seguras, con texto corto y sin emojis', () => {
    const posts = postsFrom(media);
    assert.deepEqual(posts.map(p => p.id), ['101', '102', '103', '104']);
    assert.equal(posts[0].video, `${CDN}/reel-101.mp4?oe=1`);
    assert.equal(posts[0].imagen, `${CDN}/reel-101.jpg?oe=1`);
    assert.equal(posts[0].texto, 'Torta de cumpleaños lila para Sofi.');
    assert.equal(posts[2].video, `${CDN}/c-103.mp4`, 'el carrusel usa su primer elemento');
    assert.equal(posts[3].video, null, 'sin video, queda la portada');
    assert.equal(postsFrom(null).length, 0);
    assert.equal(shortText('a '.repeat(100)).length <= 121, true);
    assert.match(shortText(`${'Palabra '.repeat(30)}fin`), /…$/);
});

test('Sin llave, la lista va vacía y no consulta a Instagram', async () => {
    const worker = fakeWorker({ token: '' });
    const response = await worker.call('/instagram');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { publicaciones: [] });
    assert.equal(worker.calls.length, 0);
    assert.equal((await worker.call('/instagram/foto/101')).status, 404);
});

test('Lista lo último publicado sin direcciones de Instagram y lo guarda una hora', async () => {
    const worker = fakeWorker();
    const response = await worker.call('/instagram');
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    assert.match(response.headers.get('Cache-Control'), /max-age=600/);
    const { publicaciones } = await response.json();
    assert.deepEqual(publicaciones[0], { id: '101', video: true, enlace: 'https://www.instagram.com/reel/AbC101/', texto: 'Torta de cumpleaños lila para Sofi.' });
    assert.equal(publicaciones[3].video, false);
    assert.ok(!JSON.stringify(publicaciones).includes('cdninstagram'), 'la web nunca ve las direcciones que vencen');

    worker.tick(30 * 60);
    await worker.call('/instagram');
    assert.equal(worker.calls.length, 1, 'dentro de la hora no vuelve a preguntar');
    worker.tick(31 * 60);
    await worker.call('/instagram');
    await Promise.all(worker.waits);
    assert.equal(worker.calls.length, 2, 'pasada la hora, lee de nuevo en segundo plano');
});

test('Si Instagram falla, sigue mostrando lo último que leyó', async () => {
    let fail = false;
    const worker = fakeWorker({ graph: () => fail ? null : { data: media } });
    await worker.call('/instagram');
    fail = true;
    worker.tick(2 * 3600);
    const { publicaciones } = await (await worker.call('/instagram')).json();
    await Promise.all(worker.waits);
    assert.equal(publicaciones.length, 4);
    worker.tick(120);
    assert.equal((await (await worker.call('/instagram')).json()).publicaciones.length, 4);
});

test('Sirve fotos y videos de las publicaciones leídas, con rangos y sin cabeceras de Instagram', async () => {
    const worker = fakeWorker();
    const photo = await worker.call('/instagram/foto/101');
    assert.equal(photo.status, 200);
    assert.equal(photo.headers.get('Content-Type'), 'image/jpeg');
    assert.equal(photo.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.equal(await photo.text(), 'foto');
    const video = await worker.call('/instagram/video/101', { headers: { Range: 'bytes=0-' } });
    assert.equal(video.status, 206);
    assert.equal(video.headers.get('Content-Range'), 'bytes 0-4/5');
    assert.equal(video.headers.get('Set-Cookie'), null);
    assert.equal(worker.calls.at(-1).range, 'bytes=0-');
    assert.equal((await worker.call('/instagram/video/104')).status, 404, 'sin video de Instagram no hay nada que servir');
    assert.equal((await worker.call('/instagram/foto/999')).status, 404, 'solo publicaciones leídas: no es un proxy abierto');
    assert.equal((await worker.call('/instagram/foto/..%2F101')).status, 404);
    assert.equal((await worker.call('/instagram/foto/101', { method: 'POST' })).status, 405);
    assert.ok(worker.calls.every(c => c.url.startsWith('https://graph.instagram.com/') || c.url.startsWith(CDN)));
});

test('Si una dirección de Instagram venció, lee la lista de nuevo y lo intenta otra vez', async () => {
    let round = 0;
    const worker = fakeWorker({
        graph: () => { round++; return { data: media.map(m => ({ ...m, media_url: m.media_url?.replace('oe=1', `oe=${round}`), thumbnail_url: m.thumbnail_url?.replace('oe=1', `oe=${round}`) })) }; },
        cdn: url => url.endsWith('oe=1') ? new Response('vencida', { status: 403 }) : new Response('foto', { headers: { 'Content-Type': 'image/jpeg' } })
    });
    const response = await worker.call('/instagram/foto/101');
    assert.equal(response.status, 200);
    assert.equal(round, 2);
    const odd = fakeWorker({ cdn: () => new Response('<html>', { headers: { 'Content-Type': 'text/html' } }) });
    assert.equal((await odd.call('/instagram/foto/101')).status, 502, 'solo pasa fotos y videos');
});

test('El cron renueva la llave cada semana y la usa; si cambia el secreto, manda el secreto', async () => {
    const used = [];
    const worker = fakeWorker({ graph: token => { used.push(token); return { data: media }; } });
    await worker.cron();
    await Promise.all(worker.waits);
    assert.equal(used.at(-1), 'llave-renovada');
    const refreshes = () => worker.calls.filter(c => c.url.includes('refresh_access_token')).length;
    assert.equal(refreshes(), 1);
    worker.tick(86400);
    await worker.cron();
    await Promise.all(worker.waits);
    assert.equal(refreshes(), 1, 'antes de una semana no la renueva');
    worker.env.INSTAGRAM_TOKEN = 'llave-nueva';
    worker.tick(2 * 3600);
    await worker.call('/instagram');
    await Promise.all(worker.waits);
    assert.equal(used.at(-1), 'llave-nueva');
    assert.ok(!worker.store.get('instagram-llave').includes('llave-nueva'), 'el secreto no se copia a KV');
});
