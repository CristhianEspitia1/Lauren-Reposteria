import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { PUBLIC_FILES } from './files.mjs';
await import('./verify.mjs');
const site = new URL('../', import.meta.url);
const output = new URL(`artifacts/release-${Date.now()}/`, site);
const hashes = {};
for (const file of PUBLIC_FILES) {
  const destination = new URL(file, output);
  await mkdir(new URL('./', destination), {recursive:true});
  await copyFile(new URL(`public/${file}`, site), destination);
  hashes[file] = createHash('sha256').update(await readFile(destination)).digest('hex');
}
await writeFile(new URL('artifacts/latest-release.json', site), JSON.stringify({directory:fileURLToPath(output),sha256:hashes},null,2)+'\n');
console.log(`Artefacto listo (sin compilación): ${fileURLToPath(output)}`);
