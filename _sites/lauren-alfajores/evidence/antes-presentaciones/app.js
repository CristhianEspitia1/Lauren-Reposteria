'use strict';
/* Lauren — local interactive concept. No checkout, analytics or network writes.
   Product facts and pricing below are illustrative and must be approved before launch. */
const PRODUCTS = [
  {id:'arequipe', name:'Arequipe original', title:'Arequipe<br>original.', short:'Arequipe', price:6500, image:'assets/arequipe-original-v2.webp', background:'#f2e8dc', badge:'EL CLÁSICO', description:'Dos tapas de vainilla y un centro generoso de arequipe. Así de simple. Así de irresistible.', recipe:'Tapas de vainilla y relleno de arequipe. Imagen generada a partir del alfajor original de Lauren; la textura y las proporciones mostradas son ilustrativas.'},
  {id:'pistacho', name:'Pistacho & blanco', title:'Pistacho<br>& blanco.', short:'Pistacho', price:7500, image:'assets/pistacho-original-v2.webp', background:'#eeeaf3', badge:'PARA DESCUBRIR', description:'Crema de pistacho y chocolate blanco entre tapas suaves de vainilla. Un antojo un poquito diferente.', recipe:'Tapas de vainilla y crema de pistacho con chocolate blanco. Es una propuesta de sabor basada en la forma del alfajor original, no una ficha técnica de producción.'},
  {id:'cookies', name:'Cookies & cream', title:'Cookies<br>& cream.', short:'Cookies & cream', price:7000, image:'assets/cookies-original-v2.webp', background:'#ece2f1', badge:'DOBLE ANTOJO', description:'Tapas suaves de vainilla. Crema y trocitos de galleta por dentro. Para quienes nunca tienen suficiente.', recipe:'Tapas de vainilla y crema con trocitos de galleta de chocolate. Variación conceptual del alfajor original; receta por desarrollar y validar con Lauren.'},
  {id:'frambuesa', name:'Frambuesa & vainilla', title:'Frambuesa<br>& vainilla.', short:'Frambuesa', price:7000, image:'assets/frambuesa-original-v2.webp', background:'#f5e6eb', badge:'EL TOQUE FRUTAL', description:'Un centro cremoso de frambuesa entre tapas de vainilla. Dulce, un poquito ácido y nada aburrido.', recipe:'Tapas de vainilla y relleno cremoso de frambuesa. Variación conceptual del alfajor original; la formulación final aún no está confirmada.'}
];
const BY_ID = Object.fromEntries(PRODUCTS.map(p=>[p.id,p]));
const isProduct = id => typeof id === 'string' && Object.hasOwn(BY_ID, id);
const MONEY = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0});
const money = n => MONEY.format(n);
const $ = id => document.getElementById(id);
const STORAGE_KEY = 'lauren-alfajores-propuesta-v2';
let boxSize = 4;
let boxSelection = [];
let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.slice(0,50).flatMap((line,i) => {
      if (!line || !Number.isInteger(line.qty) || line.qty<1 || line.qty>99) return [];
      if (line.type==='single' && isProduct(line.id)) return [{key:'s-'+line.id,type:'single',id:line.id,qty:line.qty}];
      if (line.type==='box' && [4,6,12].includes(line.size) && Array.isArray(line.selection) && line.selection.length===line.size && line.selection.every(isProduct)) {
        return [{key:'b-restored-'+i,type:'box',size:line.size,selection:[...line.selection],qty:line.qty}];
      }
      return [];
    });
  } catch (_) { return []; }
}
function saveCart() { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(cart)); } catch (_) { /* File mode or privacy settings may disable storage. */ } }
function productPrice(ids) { return ids.reduce((sum,id)=>sum+BY_ID[id].price,0); }
function unitPrice(line) { return line.type==='single'?BY_ID[line.id].price:productPrice(line.selection); }
function cartTotal() { return cart.reduce((sum,line)=>sum+unitPrice(line)*line.qty,0); }
function numberOfTreats() { return cart.reduce((sum,line)=>sum+line.qty*(line.type==='box'?line.size:1),0); }
function composition(ids) { return PRODUCTS.map(p=>({name:p.name,count:ids.filter(id=>id===p.id).length})).filter(p=>p.count).map(p=>`${p.count} × ${p.name}`).join(' · '); }
function commitCart() { saveCart(); renderCart(); renderCounts(); }
function renderCounts() {
  const count=numberOfTreats();
  $('bag-count').textContent=count;
  $('mobile-count').textContent=count;
  document.querySelectorAll('[data-action="cart"]').forEach(b=>b.setAttribute('aria-label',`Abrir mi selección, ${count} alfajores`));
}
function notify(text) {
  clearTimeout(toastTimer);
  const toast=$('toast');
  const active=document.querySelector('dialog[open]');
  (active || document.body).appendChild(toast);
  toast.textContent=text;
  toast.classList.add('show');
  toastTimer=setTimeout(()=>toast.classList.remove('show'),3000);
}
function closeAll() { document.querySelectorAll('dialog[open]').forEach(d=>d.close()); }
function showDialog(id) { closeAll(); const d=$(id); d.showModal(); d.scrollTop=0; }

function renderFlavors() {
  $('flavors-list').innerHTML=PRODUCTS.map((p,i)=>`
    <article class="flavor" id="${p.id}" style="background:${p.background}" aria-labelledby="title-${p.id}">
      <div class="flavor-inner wrap">
        <div class="flavor-visual"><span class="flavor-index">0${i+1} / 04</span><img class="flavor-image" src="${p.image}" width="465" height="325" alt="Vista conceptual del alfajor ${p.name}" loading="lazy"></div>
        <div class="flavor-copy"><span class="flavor-badge">${p.badge}</span><h3 id="title-${p.id}">${p.title}</h3><p class="flavor-description">${p.description}</p><p class="flavor-price">${money(p.price)}<small>COP · por unidad</small></p><div class="flavor-actions"><button class="button button-outline" data-action="detail" data-id="${p.id}" aria-label="Conocer ${p.name}">Conócelo <span aria-hidden="true">↗</span></button><button class="button button-ink" data-action="add-single" data-id="${p.id}" aria-label="Añadir ${p.name} a mi selección">Añadir <span aria-hidden="true">+</span></button></div></div>
      </div>
    </article>`).join('');
}
function renderTray() {
  $('box-tray').className='box-tray'+(boxSize===6?' six':boxSize===12?' twelve':'');
  $('box-tray').innerHTML=Array.from({length:boxSize},(_,i)=>`<div class="box-cell"><img src="${PRODUCTS[i%4].image}" alt="" width="145" height="97" loading="lazy"></div>`).join('');
  document.querySelector('.box-visual').setAttribute('aria-label',`Representación conceptual de una caja Lauren con ${boxSize} alfajores`);
  document.querySelectorAll('.box-sizes button').forEach(b=>{const on=Number(b.dataset.size)===boxSize;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
}
function setSize(size) {
  if (![4,6,12].includes(size)) return;
  if (boxSelection.length>size) { notify(`Retira ${boxSelection.length-size} alfajores antes de elegir una caja de ${size}.`); return; }
  boxSize=size; renderTray(); renderBuilder();
}
function renderBuilder() {
  const count=boxSelection.length;
  $('builder-sizes').innerHTML=[4,6,12].map(size=>`<button data-action="size" data-size="${size}" class="${size===boxSize?'active':''}" aria-pressed="${size===boxSize}">${size} alfajores</button>`).join('');
  $('selection-count').textContent=`${count} de ${boxSize} alfajores elegidos`;
  $('builder-slots').className='builder-slots'+(boxSize===4?' four':'');
  $('builder-slots').innerHTML=Array.from({length:boxSize},(_,i)=> {
    const p=BY_ID[boxSelection[i]];
    return p?`<div class="slot filled"><img src="${p.image}" alt="${p.name}"><button data-action="remove-slot" data-index="${i}" aria-label="Quitar ${p.name} de la caja">×</button></div>`:`<div class="slot" aria-label="Espacio ${i+1} vacío"><span aria-hidden="true">+</span></div>`;
  }).join('');
  $('builder-products').innerHTML=PRODUCTS.map(p=>{
    const n=boxSelection.filter(id=>id===p.id).length;
    return `<div class="builder-product"><img src="${p.image}" alt="${p.name}" width="100" height="90"><div><h3>${p.short}</h3><p>${money(p.price)} por unidad</p><div class="stepper" aria-label="Cantidad de ${p.name}"><button data-action="box-minus" data-id="${p.id}" ${n===0?'disabled':''} aria-label="Quitar ${p.name}">−</button><span aria-live="polite">${n}</span><button data-action="box-plus" data-id="${p.id}" ${count>=boxSize?'disabled':''} aria-label="Elegir ${p.name}">+</button></div></div></div>`;
  }).join('');
  $('builder-total').textContent=money(productPrice(boxSelection));
  const add=$('add-box');
  add.disabled=count!==boxSize;
  add.textContent=count===boxSize?'Añadir caja a mi selección':`Elige ${boxSize-count} más`;
}
function openBuilder() { renderBuilder(); showDialog('builder-dialog'); }
function addSingle(id) {
  if (!isProduct(id)) return;
  const existing=cart.find(l=>l.type==='single'&&l.id===id);
  if(existing) {
    if(existing.qty>=99) { notify('Máximo 99 unidades por sabor en esta demo.'); return; }
    existing.qty++;
  } else {
    if(cart.length>=50) { notify('La selección alcanzó el límite de esta demo.'); return; }
    cart.push({key:'s-'+id,type:'single',id,qty:1});
  }
  commitCart(); notify(`${BY_ID[id].short} añadido a tu selección.`);
}
function addBox() {
  if(boxSelection.length!==boxSize) return;
  if(cart.length>=50) { notify('La selección alcanzó el límite de esta demo.'); return; }
  cart.push({key:'b-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),type:'box',size:boxSize,selection:[...boxSelection],qty:1});
  boxSelection=[]; commitCart(); renderBuilder(); showDialog('cart-dialog');
}
function showProduct(id) {
  if(!isProduct(id)) return;
  const p=BY_ID[id];
  $('product-content').innerHTML=`<div class="product-dialog-art" style="background:${p.background}"><img src="${p.image}" alt="Alfajor ${p.name}, imagen conceptual" width="375" height="244"></div><div class="product-dialog-copy"><span class="eyebrow">${p.badge}</span><h2 id="product-name">${p.title}</h2><p>${p.description}</p><h3>La idea de la receta</h3><p>${p.recipe}</p><p class="recipe-note">Imagen y receta de muestra. Ingredientes, alérgenos, conservación y disponibilidad pendientes de validación por Lauren.</p><span class="product-dialog-price">${money(p.price)}<small>COP · precio de muestra</small></span><button class="button button-ink" data-action="add-single" data-id="${p.id}">Añadir a mi selección <span aria-hidden="true">+</span></button></div>`;
  showDialog('product-dialog');
}
function renderCart() {
  if(!cart.length) {
    $('cart-items').innerHTML='<div class="cart-empty"><div class="empty-bag" aria-hidden="true">lauren.</div><h3>Falta lo más rico.</h3><p>Elige un alfajor o arma una caja<br>con tus sabores favoritos.</p><button class="button button-ink" data-action="builder">Arma tu primera caja ↗</button></div>';
    $('cart-footer').innerHTML=''; return;
  }
  $('cart-items').innerHTML=cart.map((line,i)=>{
    const single=line.type==='single';
    const p=single?BY_ID[line.id]:null;
    return `<article class="cart-line"><div class="cart-thumb">${single?`<img src="${p.image}" alt="${p.name}">`:`<div class="cart-box-icon"><span>×${line.size}</span>lauren</div>`}</div><div><h3>${single?p.name:`Caja de ${line.size} alfajores`}</h3><p>${single?'Alfajor individual':composition(line.selection)}</p><div class="cart-line-bottom"><div class="stepper" aria-label="Cantidad de ${single?p.name:'cajas'}"><button data-action="cart-minus" data-index="${i}" aria-label="Restar ${single?p.name:'una caja'}">−</button><span>${line.qty}</span><button data-action="cart-plus" data-index="${i}" ${line.qty>=99?'disabled':''} aria-label="Sumar ${single?p.name:'una caja'}">+</button></div><strong>${money(unitPrice(line)*line.qty)}</strong></div></div></article>`;
  }).join('')+'<button class="cart-clear" data-action="clear-cart">Vaciar mi selección</button>';
  $('cart-footer').innerHTML=`<div class="cart-summary"><div class="cart-total"><span>Total de muestra</span><strong>${money(cartTotal())}</strong></div><span class="demo-caption">${numberOfTreats()} alfajores · COP · Envío no calculado</span><button class="button button-ink" data-action="summary">Ver mi resumen <span aria-hidden="true">↗</span></button><p>Precios ilustrativos. Esta demo no envía pedidos ni realiza cobros.</p></div>`;
}
function changeQuantity(index,delta) {
  const line=cart[index]; if(!line)return;
  const next=line.qty+delta;
  if(next>99)return;
  if(next<=0)cart.splice(index,1); else line.qty=next;
  commitCart();
}
function summaryText() {
  const lines=['LAUREN REPOSTERÍA','Selección de muestra — NO es un pedido confirmado',''];
  for(const line of cart) {
    if(line.type==='single') lines.push(`${line.qty} × ${BY_ID[line.id].name} — ${money(unitPrice(line)*line.qty)}`);
    else { lines.push(`${line.qty} × Caja de ${line.size} alfajores — ${money(unitPrice(line)*line.qty)}`); lines.push(`  Contenido de cada caja: ${composition(line.selection)}`); }
  }
  lines.push('',`${numberOfTreats()} alfajores en total`,`TOTAL DE MUESTRA: ${money(cartTotal())} COP`,'Envío no calculado.','', 'Sabores, imágenes y precios ilustrativos.','No se ha enviado ningún pedido ni realizado ningún cobro.','Disponibilidad, ingredientes, alérgenos y condiciones finales pendientes de confirmar con Lauren.');
  return lines.join('\n');
}
function showSummary() { if(!cart.length)return; $('order-summary').value=summaryText(); showDialog('summary-dialog'); }
async function copySummary() {
  const text=$('order-summary').value;
  try {
    if(!navigator.clipboard || !window.isSecureContext)throw new Error('Clipboard not available');
    await navigator.clipboard.writeText(text);
    notify('Selección copiada. No se ha enviado ningún pedido.');
  } catch (_) {
    const field=$('order-summary'); field.focus(); field.select();
    try { if(document.execCommand('copy')) { notify('Selección copiada.'); return; } } catch (_) {}
    notify('Texto seleccionado. Usa Ctrl+C o ⌘C para copiarlo.');
  }
}
function downloadSummary() {
  const blob=new Blob([summaryText()],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='mi-seleccion-lauren.txt'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  notify('Resumen guardado. No se ha enviado un pedido.');
}

// Delegation makes all dynamically rendered controls work in the standalone file as well.
document.addEventListener('click',event=>{
  const b=event.target.closest('[data-action]'); if(!b || b.disabled)return;
  const action=b.dataset.action;
  const id=b.dataset.id;
  const index=Number(b.dataset.index);
  if(action==='nav'){closeAll();return;}
  if(b.tagName==='A')event.preventDefault();
  switch(action) {
    case 'about':showDialog('about-dialog');break;
    case 'menu':showDialog('menu-dialog');break;
    case 'close':closeAll();break;
    case 'detail':showProduct(id);break;
    case 'builder':openBuilder();break;
    case 'size':setSize(Number(b.dataset.size));break;
    case 'add-single':addSingle(id);break;
    case 'box-plus':if(isProduct(id)&&boxSelection.length<boxSize){boxSelection.push(id);renderBuilder();}break;
    case 'box-minus':{const pos=boxSelection.lastIndexOf(id);if(pos!==-1){boxSelection.splice(pos,1);renderBuilder();}break;}
    case 'remove-slot':if(index>=0&&index<boxSelection.length){boxSelection.splice(index,1);renderBuilder();}break;
    case 'reset-builder':boxSelection=[];renderBuilder();break;
    case 'add-box':addBox();break;
    case 'cart':renderCart();showDialog('cart-dialog');break;
    case 'cart-minus':changeQuantity(index,-1);break;
    case 'cart-plus':changeQuantity(index,1);break;
    case 'clear-cart':cart=[];commitCart();break;
    case 'summary':showSummary();break;
    case 'copy-summary':copySummary();break;
    case 'download-summary':downloadSummary();break;
  }
  // Preserve keyboard focus after rebuilding a quantity or size control.
  if(['box-plus','box-minus','size','cart-plus','cart-minus','remove-slot'].includes(action)) {
    const active=document.querySelector('dialog[open]') || document;
    const selector=`[data-action="${action}"]`+(id?`[data-id="${id}"]`:b.dataset.size?`[data-size="${b.dataset.size}"]`:b.dataset.index?`[data-index="${b.dataset.index}"]`:'');
    let next=active.querySelector(selector);
    if(!next || next.disabled) {
      const opposite={'box-plus':'box-minus','box-minus':'box-plus','cart-plus':'cart-minus','cart-minus':'cart-plus'}[action];
      next=opposite?active.querySelector(`[data-action="${opposite}"]`+(id?`[data-id="${id}"]`:`[data-index="${index}"]`)):null;
      if(!next || next.disabled)next=active.querySelector('.dialog-close');
    }
    if(next&&!next.disabled)next.focus({preventScroll:true});
  }
});
document.querySelectorAll('dialog').forEach(d=>{
  d.addEventListener('click',event=>{
    if(event.target!==d)return;
    const r=d.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();
  });
  d.addEventListener('close',()=>{if(d.contains($('toast')))document.body.appendChild($('toast'));});
});
renderFlavors(); renderTray(); renderBuilder(); renderCart(); renderCounts();
