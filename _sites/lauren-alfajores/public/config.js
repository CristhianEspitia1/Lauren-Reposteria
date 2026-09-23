'use strict';
// Configuración pública. No colocar secretos ni datos personales aquí.
// Esta entrega permanece en modo demostración; no existe un canal de ventas.
const LAUREN_CONFIG = Object.freeze({
  demo: true,
  canonicalUrl: 'https://cristhianespitia1.github.io/Lauren-Alfajores-Demo/',
  contacts: Object.freeze({ whatsapp: null, email: null, instagram: null })
});

if (LAUREN_CONFIG.canonicalUrl) {
  const canonical = new URL(LAUREN_CONFIG.canonicalUrl);
  if (canonical.protocol === 'https:') {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonical.href;
    document.head.appendChild(link);
  }
}
