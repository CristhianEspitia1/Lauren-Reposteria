'use strict';
/* Selection stays on this device. Catalog prices are never read from storage. */
const BY_ID = Object.fromEntries(PRODUCTS.map(p=>[p.id,p]));
const MONEY = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
const money = n => MONEY.format(n);
const priceLabel = n => n===null?'Precio por confirmar':money(n);
const $ = id => document.getElementById(id);
const STORAGE_KEY = 'lauren-alfajores-presentaciones-v1';
const isProduct = id => typeof id==='string' && Object.hasOwn(BY_ID,id);
const variantFor = (id,variant) => isProduct(id) && typeof variant==='string' ? BY_ID[id].variants.find(v=>v.id===variant) : undefined;
const lineKey = (id,variant,flavors) => `${id}:${variant}${flavors?':'+BOX_FLAVORS.filter(f=>flavors[f.id]>0).map(f=>`${f.id}=${flavors[f.id]}`).join(','):''}`;
const emptyBoxFlavors = () => Object.fromEntries(BOX_FLAVORS.map(f=>[f.id,0]));
function normalizeBoxFlavors(variant,flavors,{legacy=false}={}){
  const capacity=variantFor('cajas',variant)?.units;
  if(!capacity)return null;
  if(legacy&&flavors===undefined)return {...emptyBoxFlavors(),arequipe:capacity};
  if(!flavors||typeof flavors!=='object'||Array.isArray(flavors))return null;
  if(Object.keys(flavors).some(id=>!BOX_FLAVORS.some(f=>f.id===id)))return null;
  const selection=emptyBoxFlavors();
  for(const f of BOX_FLAVORS){
    const qty=Object.hasOwn(flavors,f.id)?flavors[f.id]:0;
    if(!Number.isInteger(qty)||qty<0||qty>capacity)return null;
    selection[f.id]=qty;
  }
  return Object.values(selection).reduce((sum,qty)=>sum+qty,0)===capacity?selection:null;
}
function boxFlavorSummary(flavors){return BOX_FLAVORS.filter(f=>flavors[f.id]>0).map(f=>`${flavors[f.id]} × ${f.name}`).join(' · ');}
let cart = loadCart();
let selectedBox = '6';
let boxFlavors = emptyBoxFlavors();
let activeProduct = null;
let activeVariant = null;
let toastTimer;

function loadCart() {
  try {
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    if(!Array.isArray(saved))return [];
    const lines=new Map();
    for(const line of saved.slice(0,50)) {
      if(!line || !variantFor(line.id,line.variant) || !Number.isInteger(line.qty))continue;
      if(line.qty<BY_ID[line.id].minQty || line.qty>99)continue;
      const flavors=line.id==='cajas'?normalizeBoxFlavors(line.variant,line.flavors,{legacy:true}):null;
      if(line.id==='cajas'&&!flavors)continue;
      const key=lineKey(line.id,line.variant,flavors);
      const qty=Math.min(99,(lines.get(key)?.qty||0)+line.qty);
      lines.set(key,{key,id:line.id,variant:line.variant,qty,...(flavors?{flavors}:{})});
    }
    return [...lines.values()];
  } catch (_) {return [];}
}
function saveCart(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));}catch(_){}}
function unitPrice(line){return variantFor(line.id,line.variant).price;}
function lineTotal(line){const price=unitPrice(line);return price===null?null:price*line.qty;}
function cartTotal(){return cart.some(line=>unitPrice(line)===null)?null:cart.reduce((sum,line)=>sum+lineTotal(line),0);}
function numberOfProducts(){return cart.reduce((sum,line)=>sum+line.qty,0);}
function commitCart(){saveCart();renderCart();renderCounts();}
function renderCounts(){
  const count=numberOfProducts();
  $('bag-count').textContent=count;$('mobile-count').textContent=count;
  document.querySelectorAll('[data-action="cart"]').forEach(b=>b.setAttribute('aria-label',`Abrir mi selección, ${count} ${count===1?'producto':'productos'}`));
}
function notify(text){
  clearTimeout(toastTimer);
  const toast=$('toast');
  (document.querySelector('dialog[open]')||document.body).appendChild(toast);
  toast.textContent=text;toast.classList.add('show');
  toastTimer=setTimeout(()=>toast.classList.remove('show'),3000);
}
function closeAll(){document.querySelectorAll('dialog[open]').forEach(d=>d.close());}
function showDialog(id){closeAll();const d=$(id);d.showModal();d.scrollTop=0;}
function productPriceLabel(p){return `${p.variants[0].price!==null&&p.variants.length>1?'Desde ':''}${priceLabel(p.variants[0].price)}`;}
function photoControls(p,scope){
  if(!p.alternateImage)return '';
  return `<div class="photo-options" role="group" aria-label="Vista de ${p.name}"><button data-action="photo" data-id="${p.id}" data-scope="${scope}" data-view="main" aria-pressed="true">${p.id==='cajas'?'La caja':'La torta'}</button><button data-action="photo" data-id="${p.id}" data-scope="${scope}" data-view="alternate" aria-pressed="false">${p.alternateLabel}</button></div>`;
}
function productNote(p){return p.note?`<p class="presentation-note">${p.note}</p>`:'';}
function renderProducts(){
  const visible=PRODUCTS.filter(p=>p.id!=='cajas');
  $('cajas').style.setProperty('--product-color',BY_ID.cajas.background);
  $('flavors-list').innerHTML=visible.map(p=>`<article class="flavor ${p.id==='minis'?'portrait-product':''}" id="${p.id}" aria-labelledby="title-${p.id}" style="--product-color:${p.background}">
    <div class="flavor-inner wrap product-panel"><div class="flavor-visual"><img class="flavor-image" id="photo-section-${p.id}" src="${p.image}" width="${p.imageWidth||1536}" height="${p.imageHeight||1024}" alt="${p.name} de Lauren" loading="lazy">${photoControls(p,'section')}</div>
    <div class="flavor-copy"><h3 id="title-${p.id}">${p.title}</h3><p class="flavor-description">${p.description}</p><p class="flavor-price">${productPriceLabel(p)}<small>COP · ${p.id==='minis'?'por vaso':p.id==='bolsitas'?'por bolsita':p.id==='torta'?'según tamaño':'por unidad'}</small></p>${productNote(p)}<div class="flavor-actions"><button class="button button-outline" data-action="detail" data-id="${p.id}" aria-label="Conocer ${p.name}">Conócelo <span aria-hidden="true">↗</span></button><button class="button button-ink" data-action="detail" data-id="${p.id}" aria-label="Elegir ${p.name}">Elegir <span aria-hidden="true">+</span></button></div></div></div></article>`).join('');
}
function setBox(value){
  if(!variantFor('cajas',value))return;
  selectedBox=value;
  document.querySelectorAll('[data-action="size"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.size===value)));
  document.querySelectorAll('[data-action="size"]').forEach(b=>b.classList.toggle('active',b.dataset.size===value));
  const price=variantFor('cajas',value).price;
  $('box-price').textContent=priceLabel(price);
  $('box-price').classList.toggle('price-pending',price===null);
  $('box-price-unit').hidden=price===null;
}
function showProduct(id){
  if(!isProduct(id))return;
  const p=BY_ID[id];activeProduct=id;activeVariant=id==='cajas'?selectedBox:p.variants[0].id;
  $('product-dialog').classList.toggle('box-builder',id==='cajas');
  if(id==='cajas'){renderBoxBuilder();showDialog('product-dialog');return;}
  $('product-content').innerHTML=`<div class="product-dialog-art ${id==='minis'?'portrait-product':''}" style="background:${p.background}"><img id="photo-detail-${id}" src="${p.image}" alt="${p.name} de Lauren" width="${p.imageWidth||1536}" height="${p.imageHeight||1024}">${photoControls(p,'detail')}</div><div class="product-dialog-copy"><h2 id="product-name">${p.name}</h2><p>${p.detail}</p><fieldset class="variant-options"><legend>${p.variants.length>1?'Elige tu presentación':'Presentación'}</legend>${p.variants.map(v=>`<label class="variant-option"><input type="radio" name="product-variant" value="${v.id}" ${v.id===activeVariant?'checked':''}><span>${v.label}</span><strong>${priceLabel(v.price)}</strong></label>`).join('')}</fieldset>${productNote(p)}<div class="product-selection-total"><span>${p.minQty>1?`Total por ${p.minQty} ${id==='bolsitas'?'bolsitas':'unidades'}`:'Total'}</span><strong id="product-price"></strong></div><button class="button button-ink" data-action="add-product">Añadir ${p.minQty>1?p.minQty+' '+(id==='bolsitas'?'bolsitas':'unidades'):'a mi selección'} <span aria-hidden="true">+</span></button><p class="recipe-note">Selección de referencia. No se envían pedidos ni se realizan cobros.</p></div>`;
  updateProductPrice();showDialog('product-dialog');
}
function updateProductPrice(){
  const variant=variantFor(activeProduct,activeVariant);
  if(variant){
    $('product-price').textContent=priceLabel(variant.price===null?null:variant.price*BY_ID[activeProduct].minQty);
    $('product-price').classList.toggle('price-pending',variant.price===null);
  }
}
function setProductVariant(value){
  if(!variantFor(activeProduct,value))return;
  activeVariant=value;
  if(activeProduct==='cajas'){setBox(value);updateBoxSelection();}
  else updateProductPrice();
}
function renderBoxBuilder(){
  const p=BY_ID.cajas;
  $('product-content').innerHTML=`<div class="product-dialog-art box-builder-art" style="background:${p.background}"><img src="${p.image}" alt="Caja Lauren de referencia" width="1536" height="1024"><p>Presentación de referencia</p></div><div class="product-dialog-copy box-builder-copy"><h2 id="product-name">Arma tu caja.</h2><p class="box-builder-intro">Tus sabores favoritos. Todos de 5 cm.</p><fieldset class="box-capacity-options"><legend>Unidades por caja</legend><div class="box-capacity-choices">${p.variants.map(v=>`<label><input type="radio" name="product-variant" value="${v.id}" ${v.id===activeVariant?'checked':''}><span>${v.units} <small>unidades</small></span></label>`).join('')}</div></fieldset><fieldset class="box-flavor-options" aria-describedby="box-progress"><legend>Combina tus sabores</legend><p id="box-progress" class="box-progress" role="status" aria-live="polite" aria-atomic="true"></p>${BOX_FLAVORS.map(f=>`<div class="box-flavor-row"><span id="box-flavor-${f.id}" class="box-flavor-name">${f.name}</span><div class="stepper" role="group" aria-labelledby="box-flavor-${f.id}"><button data-action="box-minus" data-flavor="${f.id}" aria-label="Quitar un alfajor de ${f.name}">−</button><span id="box-count-${f.id}" aria-label="Unidades de ${f.name}">0</span><button data-action="box-plus" data-flavor="${f.id}" aria-label="Añadir un alfajor de ${f.name}">+</button></div></div>`).join('')}</fieldset><div class="box-builder-footer"><div class="product-selection-total"><span>Por caja</span><strong id="box-selection-price"></strong></div><button id="add-box" class="button button-ink" data-action="add-box" aria-describedby="box-progress">Añadir mi caja <span aria-hidden="true">+</span></button><p class="recipe-note">Selección de referencia. Sin pagos ni pedidos reales.</p></div></div>`;
  updateBoxSelection();
}
function boxSelectedCount(){return BOX_FLAVORS.reduce((sum,f)=>sum+boxFlavors[f.id],0);}
function updateBoxSelection(){
  const variant=variantFor('cajas',activeVariant);
  if(activeProduct!=='cajas'||!variant)return;
  const count=boxSelectedCount(),capacity=variant.units;
  $('box-progress').textContent=count>capacity?`${count} de ${capacity} · Quita ${count-capacity}`:`${count} de ${capacity} elegidos${count===capacity?' · Lista':''}`;
  $('box-progress').classList.toggle('box-overfilled',count>capacity);
  for(const f of BOX_FLAVORS){
    $(`box-count-${f.id}`).textContent=boxFlavors[f.id];
    const minus=document.querySelector(`[data-action="box-minus"][data-flavor="${f.id}"]`);
    const plus=document.querySelector(`[data-action="box-plus"][data-flavor="${f.id}"]`);
    if(minus)minus.disabled=boxFlavors[f.id]===0;
    if(plus)plus.disabled=count>=capacity;
  }
  $('add-box').disabled=count!==capacity;
  $('box-selection-price').textContent=priceLabel(variant.price);
  $('box-selection-price').classList.toggle('price-pending',variant.price===null);
  const focused=document.activeElement;
  if(focused?.disabled&&['box-minus','box-plus'].includes(focused.dataset?.action)){
    const opposite=focused.dataset.action==='box-plus'?'box-minus':'box-plus';
    const next=document.querySelector(`[data-action="${opposite}"][data-flavor="${focused.dataset.flavor}"]`);
    if(next&&!next.disabled)next.focus({preventScroll:true});
  }
}
function changeBoxFlavor(id,delta){
  if(activeProduct!=='cajas'||!BOX_FLAVORS.some(f=>f.id===id)||![-1,1].includes(delta))return;
  const capacity=variantFor('cajas',activeVariant).units;
  if(delta>0&&boxSelectedCount()>=capacity||delta<0&&boxFlavors[id]===0)return;
  boxFlavors[id]+=delta;updateBoxSelection();
}
function selectPhoto(id,scope,view){
  if(!isProduct(id)||!['section','detail','boxes'].includes(scope)||!['main','alternate'].includes(view))return;
  const p=BY_ID[id],src=view==='alternate'?p.alternateImage:p.image;
  const img=$(`photo-${scope}-${id}`);if(!src||!img)return;
  img.src=src;img.alt=`${p.name} de Lauren${view==='alternate'?', '+p.alternateLabel.toLowerCase():''}`;
  document.querySelectorAll(`[data-action="photo"][data-id="${id}"][data-scope="${scope}"]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
}
function addProduct(id,variant,qty,flavorSelection){
  if(!variantFor(id,variant))return false;
  const p=BY_ID[id],amount=qty===undefined?p.minQty:qty;
  if(!Number.isInteger(amount)||amount<p.minQty||amount>99)return false;
  const flavors=id==='cajas'?normalizeBoxFlavors(variant,flavorSelection):null;
  if(id==='cajas'&&!flavors)return false;
  const key=lineKey(id,variant,flavors),existing=cart.find(line=>line.key===key);
  if(existing){
    if(existing.qty+amount>99){notify('Máximo 99 por presentación en esta selección.');return false;}
    existing.qty+=amount;
  }else{
    if(cart.length>=50){notify('La selección alcanzó su límite.');return false;}
    cart.push({key,id,variant,qty:amount,...(flavors?{flavors}:{})});
  }
  commitCart();notify(`${p.short} añadido a tu selección.`);return true;
}
function renderCart(){
  if(!cart.length){
    $('cart-items').innerHTML='<div class="cart-empty"><div class="empty-bag" aria-hidden="true"><img src="assets/brand/lauren-bombon-wordmark.svg" alt="" width="580" height="160"></div><h3>Falta lo más rico.</h3><p>Elige tus alfajores favoritos<br>y guárdalos aquí.</p><button class="button button-ink" data-action="builder">Elige tu primera caja ↗</button></div>';
    $('cart-footer').innerHTML='';return;
  }
  $('cart-items').innerHTML=cart.map((line,i)=>{
    const p=BY_ID[line.id],v=variantFor(line.id,line.variant);
    return `<article class="cart-line"><div class="cart-thumb"><img src="${p.image}" alt="${p.name}"></div><div><h3>${p.name}</h3><p>${v.label}</p>${line.flavors?`<p class="cart-flavors">${boxFlavorSummary(line.flavors)}</p>`:''}<div class="cart-line-bottom"><div class="stepper" aria-label="Cantidad de ${p.name}"><button data-action="cart-minus" data-index="${i}" ${line.qty<=p.minQty?'disabled':''} aria-label="Restar ${p.name}">−</button><span>${line.qty}</span><button data-action="cart-plus" data-index="${i}" ${line.qty>=99?'disabled':''} aria-label="Sumar ${p.name}">+</button></div><strong>${priceLabel(lineTotal(line))}</strong></div><button class="cart-remove" data-action="remove-line" data-index="${i}" aria-label="Quitar ${p.name} de mi selección">Quitar</button></div></article>`;
  }).join('')+'<button class="cart-clear" data-action="clear-cart">Vaciar mi selección</button>';
  $('cart-footer').innerHTML=`<div class="cart-summary"><div class="cart-total"><span>Total de referencia</span><strong class="${cartTotal()===null?'price-pending':''}">${priceLabel(cartTotal())}</strong></div><span class="demo-caption">${numberOfProducts()} ${numberOfProducts()===1?'producto':'productos'} · COP · Envío no calculado</span><button class="button button-ink" data-action="summary">Ver mi resumen <span aria-hidden="true">↗</span></button><p>Esta selección no envía pedidos ni realiza cobros.</p></div>`;
}
function changeQuantity(index,delta){
  if(!Number.isInteger(index)||![-1,1].includes(delta))return;
  const line=cart[index];if(!line)return;
  const qty=line.qty+delta;if(qty<BY_ID[line.id].minQty||qty>99)return;
  line.qty=qty;commitCart();
}
function removeLine(index){if(Number.isInteger(index)&&index>=0&&index<cart.length){cart.splice(index,1);commitCart();}}
function summaryText(){
  const lines=['LAUREN ALFAJORES','Selección de referencia — NO es un pedido confirmado','Precios de referencia en COP',''];
  for(const line of cart){
    const p=BY_ID[line.id],v=variantFor(line.id,line.variant);
    lines.push(`${line.qty} × ${p.name} (${v.label}) — ${priceLabel(lineTotal(line))}`);
    if(line.flavors)lines.push(`  Sabores por caja: ${boxFlavorSummary(line.flavors)}`);
  }
  lines.push('',`TOTAL DE REFERENCIA: ${priceLabel(cartTotal())}${cartTotal()===null?'':' COP'}`,'Envío no calculado.','','No se ha enviado ningún pedido ni realizado ningún cobro.','Confirmar precio final, disponibilidad, ingredientes, alérgenos y entrega con Lauren.');
  return lines.join('\n');
}
function showSummary(){if(!cart.length)return;$('order-summary').value=summaryText();showDialog('summary-dialog');}
async function copySummary(){
  const text=$('order-summary').value;
  try{
    if(!navigator.clipboard||!window.isSecureContext)throw Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);notify('Selección copiada. No se ha enviado ningún pedido.');
  }catch(_){
    const field=$('order-summary');field.focus();field.select();
    try{if(document.execCommand('copy')){notify('Selección copiada.');return;}}catch(_){}
    notify('Texto seleccionado. Usa Ctrl+C o ⌘C para copiarlo.');
  }
}
function downloadSummary(){
  const blob=new Blob([summaryText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='mi-seleccion-lauren.txt';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Resumen guardado. No se ha enviado un pedido.');
}
document.addEventListener('change',event=>{if(event.target.name==='product-variant')setProductVariant(event.target.value);});
document.addEventListener('click',event=>{
  const b=event.target.closest('[data-action]');if(!b||b.disabled)return;
  const {action,id,scope,view}=b.dataset,index=Number(b.dataset.index);
  if(action==='nav'){closeAll();return;}
  if(b.tagName==='A')event.preventDefault();
  switch(action){
    case 'about':showDialog('about-dialog');break;
    case 'menu':showDialog('menu-dialog');break;
    case 'close':closeAll();break;
    case 'detail':showProduct(id);break;
    case 'builder':showProduct('cajas');break;
    case 'size':setBox(b.dataset.size);break;
    case 'photo':selectPhoto(id,scope,view);break;
    case 'box-minus':changeBoxFlavor(b.dataset.flavor,-1);break;
    case 'box-plus':changeBoxFlavor(b.dataset.flavor,1);break;
    case 'add-box':
      if(addProduct('cajas',activeVariant,1,boxFlavors)){boxFlavors=emptyBoxFlavors();showDialog('cart-dialog');}
      break;
    case 'add-product':if(addProduct(activeProduct,activeVariant))showDialog('cart-dialog');break;
    case 'cart':renderCart();showDialog('cart-dialog');break;
    case 'cart-minus':changeQuantity(index,-1);break;
    case 'cart-plus':changeQuantity(index,1);break;
    case 'remove-line':removeLine(index);break;
    case 'clear-cart':cart=[];commitCart();break;
    case 'summary':showSummary();break;
    case 'copy-summary':copySummary();break;
    case 'download-summary':downloadSummary();break;
  }
  if(['cart-plus','cart-minus','remove-line','clear-cart'].includes(action)){
    const dialog=document.querySelector('dialog[open]');
    const same=dialog?.querySelector(`[data-action="${action}"][data-index="${index}"]`);
    const target=same&&!same.disabled?same:dialog?.querySelector('.dialog-close');target?.focus({preventScroll:true});
  }
});
document.querySelectorAll('dialog').forEach(d=>{
  d.addEventListener('click',event=>{if(event.target!==d)return;const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();});
  d.addEventListener('close',()=>{if(d.contains($('toast')))document.body.appendChild($('toast'));});
});
renderProducts();setBox(selectedBox);renderCart();renderCounts();
