// Publica exclusivamente el artefacto de esta demo en su repositorio de hosting.
// Nunca hace commit, push ni cambia Pages/DNS del repositorio principal.
import { mkdtemp, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PUBLIC_FILES } from './files.mjs';

const repo = 'CristhianEspitia1/Lauren-Alfajores-Demo';
const branch = 'codex/lauren-demo';
const site = new URL('../', import.meta.url);
const run = (command, args, options={}) => execFileSync(command,args,{encoding:'utf8',stdio:['pipe','pipe','pipe'],...options}).trim();
const api = (endpoint, body) => JSON.parse(run('gh',['api',endpoint,...(body?['--method','POST','--input','-']:[])],body?{input:JSON.stringify(body)}:{}));
let repository;
try { repository = api(`repos/${repo}`); }
catch(error) {
  if (!String(error.stderr).includes('404') || !process.argv.includes('--init')) throw error;
  run('gh',['repo','create',repo,'--public','--description','Demo interactiva de alfajores Lauren. Sin pagos ni pedidos reales.']);
  repository = api(`repos/${repo}`);
}
if(repository.full_name!==repo || repository.private || !repository.permissions?.push) {
  throw Error('El destino debe ser el repositorio público independiente autorizado con permiso de escritura.');
}
await import('./package.mjs');
const release = JSON.parse(await readFile(new URL('artifacts/latest-release.json',site),'utf8'));
const temporary = await mkdtemp(path.join(tmpdir(),'lauren-alfajores-deploy-'));
const checkout = path.join(temporary,'hosting');
run('gh',['repo','clone',repo,checkout]);
const git = args => run('git',['-C',checkout,...args]);
let hasHead=true;
try { git(['rev-parse','HEAD']); } catch { hasHead=false; }
if(hasHead) git(['switch',branch]); else git(['switch','--orphan',branch]);
for(const file of PUBLIC_FILES) {
  const destination = path.join(checkout,file);
  await mkdir(path.dirname(destination),{recursive:true});
  await copyFile(path.join(release.directory,file),destination);
}
git(['add','--',...PUBLIC_FILES]);
const changed=git(['diff','--cached','--name-only']);
if(changed) {
  git(['commit','-m','Publish approved Lauren alfajores demo']);
  git(['-c','credential.helper=','-c','credential.helper=!gh auth git-credential','push','origin',`HEAD:refs/heads/${branch}`]);
}
let pages;
try { pages=api(`repos/${repo}/pages`); }
catch(error) {
  if(!String(error.stderr).includes('404'))throw error;
  pages=api(`repos/${repo}/pages`,{build_type:'legacy',source:{branch,path:'/'}});
}
if(pages.source?.branch!==branch || pages.source?.path!=='/' || pages.cname) {
  throw Error('La configuración remota difiere del destino independiente; no se modificó automáticamente.');
}
const result={repository:repository.html_url,branch,commit:git(['rev-parse','HEAD']),url:pages.html_url,status:pages.status,checkout,artifact:release.directory,publishedAt:new Date().toISOString()};
await mkdir(new URL('evidence/',site),{recursive:true});
await writeFile(new URL('evidence/deployment.json',site),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
console.log('Verificar el estado de Pages y la URL antes de anunciar la publicación.');
