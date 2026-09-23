import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../public/catalog.js', import.meta.url), 'utf8') + '\n' + readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
function demo({stored='[]',blocked=false,clipboard=true,copyFallback=false}={}) {
  const nodes = new Map();
  const copied = [];
  const downloads = [];
  let saved = stored;
  const element = id => {
    if (!nodes.has(id)) nodes.set(id, {
      id, innerHTML:'',textContent:'',value:'',disabled:false,scrollTop:0,isConnected:true,
      style:{setProperty(){}},
      classList:{add(){},remove(){},toggle(){}},setAttribute(){},appendChild(){},
      focus(){document.activeElement=this;},select(){this.selectionStart=0;this.selectionEnd=this.value.length;},
      addEventListener(){},showModal(){},close(){},contains(){return false;},
      click(){downloads.push({filename:this.download,url:this.href});},remove(){}
    });
    return nodes.get(id);
  };
  const document = {
    getElementById:element,
    querySelector:s=>s==='dialog[open]'?null:element(s),
    querySelectorAll:()=>[],addEventListener(){},body:element('body'),
    createElement:()=>element('created'),execCommand:()=>copyFallback
  };
  const context=vm.createContext({document,Intl,console,Blob,URL,setTimeout:()=>0,clearTimeout(){},
    navigator:{clipboard:clipboard?{async writeText(text){if(clipboard==='denied')throw Error('NotAllowedError');copied.push(text);}}:undefined},
    window:{isSecureContext:true},
    localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;},setItem(k,v){if(blocked)throw Error('blocked');saved=v;}}
  });
  vm.runInContext(source,context);
  return {run:code=>vm.runInContext(code,context),nodes,copied,downloads,saved:()=>saved};
}

test('precios y mínimos de las presentaciones del catálogo',()=>{
  const d=demo();
  for(const [id,variant,qty,total] of [
    ['arequipe','pequeno',6,12000],['arequipe','grande',6,24000],
    ['minis','vaso',1,27000],['cajas','3',1,null],['cajas','6',1,null],['cajas','12',1,null],
    ['torta','personal',1,25000],['torta','10-12',1,60000],
    ['bolsitas','mini-3',6,18000],['bolsitas','mini-6',6,30000]
  ]){d.run(`cart=[];addProduct('${id}','${variant}',undefined,${id==='cajas'?`{arequipe:${variant}}`:'undefined'})`);assert.equal(d.run('cartTotal()'),total);assert.equal(d.run('numberOfProducts()'),qty);}
  assert.equal(d.run("isProduct('pistacho') || isProduct('cookies') || isProduct('frambuesa')"),false);
});
test('una caja sin precio deja el total por confirmar y conserva los importes conocidos',()=>{
  const d=demo();d.run("addProduct('cajas','6',1,{arequipe:6});addProduct('minis','vaso');addProduct('torta','4-6');addProduct('bolsitas','mini-3')");
  assert.equal(d.run('cartTotal()'),null);assert.equal(d.run('numberOfProducts()'),9);
  assert.equal(d.run('lineTotal(cart[1])'),27000);
  d.run('changeQuantity(0,1)');assert.equal(d.run('cartTotal()'),null);assert.equal(d.run('numberOfProducts()'),10);
  d.run('removeLine(0)');assert.equal(d.run('cartTotal()'),83000);
});
test('las variantes se conservan y no se mezclan entre tamaños',()=>{
  const d=demo();d.run("addProduct('torta','personal');addProduct('torta','10-12');addProduct('torta','personal')");
  assert.equal(d.run('cart.length'),2);assert.equal(d.run('cartTotal()'),110000);
  d.run("showProduct('torta');setProductVariant('6-8')");assert.match(d.nodes.get('product-price').textContent,/45\.000/);
  d.run("setProductVariant('inventado')");assert.equal(d.run('activeVariant'),'6-8');
});
test('respeta mínimo de 6, máximo 99 y eliminación explícita',()=>{
  const d=demo();
  assert.equal(d.run("addProduct('arequipe','pequeno',1)"),false);
  d.run("addProduct('arequipe','pequeno');changeQuantity(0,-1)");assert.equal(d.run('cart[0].qty'),6);
  d.run('for(let i=0;i<110;i++)changeQuantity(0,1)');assert.equal(d.run('cart[0].qty'),99);
  assert.equal(d.run("addProduct('arequipe','pequeno')"),false);
  d.run('removeLine(0)');assert.equal(d.run('cartTotal()'),0);assert.match(d.nodes.get('cart-items').innerHTML,/Falta lo más rico/);
});
test('restauración ignora precios guardados y rechaza sabores retirados',()=>{
  const d=demo({stored:JSON.stringify([
    {id:'cajas',variant:'12',qty:2,price:1},
    {id:'arequipe',variant:'mediano',qty:6,price:0},
    {id:'pistacho',variant:'default',qty:1},
    {type:'box',size:4,selection:['arequipe','pistacho','cookies','frambuesa'],qty:1}
  ])});
  assert.equal(d.run('cartTotal()'),null);assert.equal(d.run('cart.length'),2);
  assert.equal(d.run('unitPrice(cart[0])'),null);assert.equal(d.run('lineTotal(cart[1])'),18000);
  assert.equal(d.run('STORAGE_KEY'),'lauren-alfajores-presentaciones-v1');
});
test('almacenamiento corrupto y bloqueo no interrumpen la selección',()=>{
  for(const stored of ['{broken','null','42','{}','[null,{},true]'])assert.equal(demo({stored}).run('cart.length'),0);
  const d=demo({blocked:true});d.run("addProduct('minis','vaso')");assert.equal(d.run('cartTotal()'),27000);
});
test('rechaza identificadores, variantes y cantidades inválidas',()=>{
  const stored=JSON.stringify([
    {id:'arequipe',variant:'pequeno',qty:1},{id:'minis',variant:'vaso',qty:100},
    {id:'minis',variant:'vaso',qty:1.5},{id:'minis',variant:'vaso',qty:'1'},
    {id:'__proto__',variant:'vaso',qty:1},{id:'toString',variant:'vaso',qty:1},
    {id:['minis'],variant:'vaso',qty:1},{id:'minis',variant:['vaso'],qty:1},
    {id:'minis',variant:'inventado',qty:1}
  ]);
  const d=demo({stored});assert.equal(d.run('cart.length'),0);
  for(const expr of ["addProduct('__proto__','vaso')","addProduct('minis','x')","addProduct('minis','vaso',-1)"])assert.equal(d.run(expr),false);
});
test('resumen identifica el formato, el total y el estado sin pedido',()=>{
  const d=demo();d.run("addProduct('minis','vaso');addProduct('cajas','12',1,{arequipe:12})");
  const summary=d.run('summaryText()');
  for(const text of ['Vaso de mini alfajores','30 minis','Caja de 12 · 5 cm','27.000','Precio por confirmar','COP','NO es un pedido confirmado','No se ha enviado ningún pedido'])assert.ok(summary.includes(text),text);
});
test('copiar y alternativa seleccionada cuando el portapapeles falla',async()=>{
  const d=demo();d.run("addProduct('minis','vaso');showSummary()");await d.run('copySummary()');assert.equal(d.copied[0],d.run('summaryText()'));
  const blocked=demo({clipboard:'denied'});blocked.run("addProduct('minis','vaso');showSummary()");await blocked.run('copySummary()');
  assert.match(blocked.nodes.get('toast').textContent,/Ctrl\+C o ⌘C/);
  const field=blocked.nodes.get('order-summary');assert.equal(field.selectionStart,0);assert.equal(field.selectionEnd,field.value.length);
});
test('descarga texto con el nombre aprobado',()=>{
  const d=demo();d.run("addProduct('minis','vaso');downloadSummary()");assert.equal(d.downloads[0].filename,'mi-seleccion-lauren.txt');assert.match(d.downloads[0].url,/^blob:/);
});

test('las cajas solo admiten 3, 6 o 12 alfajores y una combinación completa',()=>{
  const d=demo();
  for(const size of ['3','6','12'])assert.equal(d.run(`addProduct('cajas','${size}',1,{arequipe:${size}})`),true);
  for(const call of [
    "addProduct('cajas','4',1,{arequipe:4})", "addProduct('cajas','8',1,{arequipe:8})",
    "addProduct('cajas','3')", "addProduct('cajas','3',1,{arequipe:2})",
    "addProduct('cajas','3',1,{arequipe:4})", "addProduct('cajas','3',1,{nutella:1.5,chocolate:1.5})",
    "addProduct('cajas','3',1,{arequipe:'3'})", "addProduct('cajas','3',1,{pistacho:3})"
  ])assert.equal(d.run(call),false,call);
});
test('el selector conserva la mezcla al reducir capacidad y exige corregir el exceso',()=>{
  const d=demo();
  d.run("showProduct('cajas');for(let i=0;i<4;i++)changeBoxFlavor('nutella',1);changeBoxFlavor('chocolate',1);changeBoxFlavor('arequipe',1)");
  assert.equal(d.run('boxSelectedCount()'),6);assert.equal(d.nodes.get('add-box').disabled,false);
  d.run("changeBoxFlavor('nutella',1)");assert.equal(d.run('boxSelectedCount()'),6);
  d.run("setProductVariant('3')");assert.equal(d.run('boxSelectedCount()'),6);assert.equal(d.nodes.get('add-box').disabled,true);
  assert.match(d.nodes.get('box-progress').textContent,/Quita 3/);
  d.run("for(let i=0;i<3;i++)changeBoxFlavor('nutella',-1)");assert.equal(d.nodes.get('add-box').disabled,false);
  assert.equal(d.run("addProduct('cajas',activeVariant,1,boxFlavors)"),true);
  assert.match(d.run('summaryText()'),/1 × Nutella/);
});
test('mezclas diferentes se guardan por separado y mezclas equivalentes se agrupan',()=>{
  const d=demo();
  d.run("addProduct('cajas','3',1,{arequipe:2,nutella:1});addProduct('cajas','3',1,{nutella:1,arequipe:2});addProduct('cajas','3',1,{'chocolate-negro':2,'chocolate-blanco':1})");
  assert.equal(d.run('cart.length'),2);assert.equal(d.run('cart[0].qty'),2);assert.equal(d.run('numberOfProducts()'),3);
  const restored=demo({stored:d.saved()});
  assert.equal(restored.run('cart.length'),2);assert.equal(restored.run('cart[1].flavors["chocolate-negro"]'),2);
  assert.match(restored.run('summaryText()'),/Sabores por caja: 2 × Arequipe clásico · 1 × Nutella/);
  assert.match(restored.run('summaryText()'),/Cubierto de chocolate blanco/);
  assert.equal(restored.run('cartTotal()'),null);
});
test('la restauración descarta mezclas inválidas y conserva las cajas clásicas anteriores',()=>{
  const d=demo({stored:JSON.stringify([
    {id:'cajas',variant:'3',qty:1,flavors:{arequipe:2}},
    {id:'cajas',variant:'6',qty:1,flavors:{nutella:7}},
    {id:'cajas',variant:'3',qty:1,flavors:{inventado:3}},
    {id:'cajas',variant:'3',qty:1,flavors:null},
    {id:'cajas',variant:'6',qty:1,price:1}
  ])});
  assert.equal(d.run('cart.length'),1);assert.equal(d.run('cart[0].flavors.arequipe'),6);
  assert.equal(d.run('unitPrice(cart[0])'),null);
  assert.equal(d.run("normalizeBoxFlavors('3',JSON.parse('{\"__proto__\":3}'))"),null);
});
