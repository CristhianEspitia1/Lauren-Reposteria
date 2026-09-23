'use strict';
const proposals = Object.fromEntries([...document.querySelectorAll('[data-select]')]
  .map(button => [button.dataset.select, button.textContent]));

function selectLogo(id, scroll = false) {
  if (!Object.hasOwn(proposals, id)) return;
  const logo = document.getElementById('preview-logo');
  logo.src = `${id}.svg`;
  logo.alt = `${proposals[id]}, propuesta de logo en la cabecera`;
  document.getElementById('preview-seal').src = `${id}.svg`;
  document.getElementById('preview-caption').textContent = `Viendo: ${proposals[id]}`;
  document.querySelectorAll('[data-select]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.select === id));
  });
  if (scroll) document.getElementById('en-la-web').scrollIntoView({block: 'start'});
}

document.querySelectorAll('[data-logo]').forEach(button => {
  button.addEventListener('click', () => selectLogo(button.dataset.logo, true));
});
document.querySelectorAll('[data-select]').forEach(button => {
  button.addEventListener('click', () => selectLogo(button.dataset.select));
});
