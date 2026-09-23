'use strict';
// Presentaciones base: fotos del usuario y js/catalog-data.js del proyecto.
// Las nuevas cajas de 3/6/12 alfajores de 5 cm y sabores proceden del encargo
// actual del usuario. Sus precios aún no están definidos.
// La selección sigue siendo una demo local, sin pedidos ni cobros.
const BOX_FLAVORS = [
  {id:'arequipe',name:'Arequipe clásico'},
  {id:'nutella',name:'Nutella'},
  {id:'chocolate',name:'Chocolate'},
  {id:'chocolate-negro',name:'Cubierto de chocolate negro'},
  {id:'chocolate-blanco',name:'Cubierto de chocolate blanco'}
];
const PRODUCTS = [
  {
    id:'arequipe', name:'Alfajor original', title:'Arequipe<br>original.', short:'El original',
    image:'assets/presentaciones/clasico.webp', background:'#f2e8dc', minQty:6,
    description:'Dos tapas suaves de maicena y un centro generoso de arequipe.',
    detail:'Alfajor de maicena y arequipe, empacado individualmente.',
    note:'Mínimo 6 unidades del mismo tamaño.',
    variants:[
      {id:'pequeno',label:'Pequeño · 3 cm',price:2000},
      {id:'mediano',label:'Mediano · 4 cm',price:3000},
      {id:'grande',label:'Grande · 5 cm',price:4000}
    ]
  },
  {
    id:'minis', name:'Vaso de mini alfajores', title:'Pequeñitos.<br>Irresistibles.', short:'Vaso de minis',
    image:'assets/presentaciones/minis.webp', background:'#eeeaf3', minQty:1,
    imageWidth:1024, imageHeight:1536,
    description:'Un vaso con 30 minis de maicena y arequipe para tener cerquita.',
    detail:'Mini alfajores de maicena y arequipe en vaso.',
    variants:[{id:'vaso',label:'Vaso · 30 minis',price:27000}]
  },
  {
    id:'torta', name:'Torta de alfajor', title:'Un antojo<br>en grande.', short:'Torta de alfajor',
    image:'assets/presentaciones/torta.webp', alternateImage:'assets/presentaciones/torta-regalo.webp', alternateLabel:'En su empaque',
    background:'#f5e6eb', minQty:1,
    description:'Capas de maicena y arequipe, coronadas con mini alfajores.',
    detail:'Torta de maicena con tres capas de relleno de arequipe.',
    note:'La decoración se muestra como referencia de presentación.',
    variants:[
      {id:'personal',label:'Personal · 8 cm',price:25000},
      {id:'4-6',label:'4–6 porciones · 11 cm',price:38000},
      {id:'6-8',label:'6–8 porciones · 13 cm',price:45000},
      {id:'10-12',label:'10–12 porciones · 16 cm',price:60000}
    ]
  },
  {
    id:'bolsitas', name:'Bolsitas de mini alfajores', title:'Pequeños<br>detalles.', short:'Bolsitas de minis',
    image:'assets/presentaciones/bolsitas.webp', background:'#ece2f1', minQty:6,
    description:'Bolsitas de 3 o 6 minis, listas para regalar.',
    detail:'Mini alfajores de maicena y arequipe de 2 cm, en bolsitas con lazo.',
    note:'Mínimo 6 bolsitas de la misma presentación.',
    variants:[
      {id:'mini-3',label:'Bolsita · 3 minis',price:3000},
      {id:'mini-6',label:'Bolsita · 6 minis',price:5000}
    ]
  },
  {
    id:'cajas', name:'Caja de alfajores', title:'Una caja.<br>Mucho amor.', short:'Caja de alfajores',
    image:'assets/presentaciones/caja.webp', alternateImage:'assets/presentaciones/cajas.webp', alternateLabel:'Más cajas',
    background:'#dfd0ee', minQty:1,
    description:'Cajas de 3, 6 o 12 alfajores de 5 cm para compartir o regalar.',
    detail:'Combina tus sabores en una caja de 3, 6 o 12 alfajores. Todos de 5 cm.',
    note:'El precio de estas presentaciones está por confirmar.',
    variants:[
      {id:'3',label:'Caja de 3 · 5 cm',units:3,price:null},
      {id:'6',label:'Caja de 6 · 5 cm',units:6,price:null},
      {id:'12',label:'Caja de 12 · 5 cm',units:12,price:null}
    ]
  }
];
