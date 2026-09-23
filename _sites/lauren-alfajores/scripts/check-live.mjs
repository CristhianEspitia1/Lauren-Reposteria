import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PUBLIC_FILES } from './files.mjs';

const site = new URL('../', import.meta.url);
const deployment = JSON.parse(await readFile(new URL('evidence/deployment.json', site),'utf8'));
const base = new URL(deployment.url);
assert.equal(base.origin, 'https://cristhianespitia1.github.io');
assert.equal(base.pathname, '/Lauren-Alfajores-Demo/');
const sha = data => createHash('sha256').update(data).digest('hex');
const files = await Promise.all(PUBLIC_FILES.filter(file => file !== '.nojekyll').map(async file => {
  const url = new URL(file, base);
  url.searchParams.set('v',deployment.commit);
  const response = await fetch(url, {signal:AbortSignal.timeout(20000)});
  const actual = Buffer.from(await response.arrayBuffer());
  const expected = await readFile(new URL(`public/${file}`,site));
  return {file,status:response.status,contentType:response.headers.get('content-type'),bytes:actual.length,sha256:sha(actual),matches:sha(actual)===sha(expected)};
}));
const excluded = await Promise.all(['README.md','tests/demo.test.mjs','reference/editable/index.html','evidence/browser-checks.json','CNAME'].map(async file => {
  const response = await fetch(new URL(file,base), {method:'HEAD',signal:AbortSignal.timeout(20000)});
  return {file,status:response.status};
}));
const result = {url:deployment.url,commit:deployment.commit,checkedAt:new Date().toISOString(),files,excluded};
await writeFile(new URL('evidence/live-http.json',site),JSON.stringify(result,null,2)+'\n');
for(const f of files) {assert.equal(f.status,200,f.file);assert.ok(f.matches,`La URL aún no sirve la versión local: ${f.file}`);}
for(const f of excluded)assert.equal(f.status,404,`Archivo interno publicado: ${f.file}`);
console.log(`OK: ${files.length} recursos públicos idénticos a la entrega; ${excluded.length} rutas internas ausentes (404).`);
