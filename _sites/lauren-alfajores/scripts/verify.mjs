import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PUBLIC_FILES } from './files.mjs';

const site = new URL('../', import.meta.url);
const provenance = JSON.parse(await readFile(new URL('reference/provenance.json', site)));
for (const [file, hash] of Object.entries(provenance.sha256)) {
  const original = await readFile(new URL(`reference/editable/${file}`, site));
  assert.equal(createHash('sha256').update(original).digest('hex'), hash, `Original alterado: ${file}`);
  if (file === 'styles.css' || file.startsWith('assets/')) {
    assert.deepEqual(await readFile(new URL(`public/${file}`, site)), original, `Diseño o imagen alterados: ${file}`);
  }
}
const files = (await readdir(new URL('public/', site), {recursive:true,withFileTypes:true}))
  .filter(f => f.isFile() && !f.name.startsWith('._')).length;
assert.equal(files, PUBLIC_FILES.length, 'El directorio público contiene archivos adicionales');
for (const file of PUBLIC_FILES) await readFile(new URL(`public/${file}`, site));
const html = await readFile(new URL('public/index.html', site), 'utf8');
assert.match(html, /name="robots" content="noindex, nofollow, noarchive"/);
assert.match(html, /href="brand.css"/);
const brand = await readFile(new URL('public/brand.css', site), 'utf8');
for (const font of ['coiny','outfit']) {
  assert.ok(brand.includes(`assets/fonts/${font}-latin.woff2`), `Fuente local no declarada: ${font}`);
}
for (const script of ['app.js','catalog.js','config.js']) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(`public/${script}`, site))], {stdio:'inherit'});
  assert.equal(result.status, 0);
}
console.log(`OK: referencia, CSS e imágenes originales intactos; sintaxis y lista pública de ${PUBLIC_FILES.length} archivos verificadas.`);
