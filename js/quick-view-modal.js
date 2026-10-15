/** Ficha de producto accesible, con opciones y precios del catálogo compartido. */
(() => {
    'use strict';
    const { escape: esc, icon, imageAttributes, setImageSource, wa } = LaurenUI;
    class QuickViewModal {
        constructor() {
            this.dialog = document.getElementById('productDialog');
            LaurenUI.dialogEvents(this.dialog);
            this.dialog.addEventListener('close', () => {
                if (this.editIndex !== null) {
                    this.editIndex = null;
                    window.cartUI?.open();
                }
            });
            this.editIndex = null;
        }
        open(id, config = {}) {
            const product = Catalog.get(id);
            if (!product) return;
            this.product = product;
            this.editIndex = config.editIndex ?? null;
            this.selection = { ...Catalog.defaults(product), ...config.selection };
            this.personal = { ...config.personal };
            this.quantity = config.quantity || Catalog.minimum(product);
            this.render();
            LaurenUI.open(this.dialog);
        }
        render() {
            const p = this.product;
            const images = [...new Set([p.mainImage, ...(p.images || [])])];
            const quoteOnly = Catalog.quoteOnly(p);
            this.dialog.innerHTML = `
                <button class="icon-button dialog-close" type="button" data-close-dialog aria-label="Cerrar producto">${icon('close')}</button>
                <div class="product-dialog-layout">
                    <div class="product-visual">
                        <img id="productMainImage" ${imageAttributes(images[0], '(max-width: 760px) 90vw, 490px')} alt="${esc(p.name)}" width="720" height="900">
                        ${images.length > 1 ? `<div class="product-thumbnails" aria-label="Vistas del producto">${images.map((src, i) => `<button type="button" data-image="${i}" aria-label="Ver imagen ${i + 1} de ${esc(p.name)}" aria-pressed="${i === 0}"><img ${imageAttributes(src, '52px')} alt="" width="52" height="64" loading="lazy"></button>`).join('')}</div>` : ''}
                    </div>
                    <form class="product-form" novalidate>
                        <div class="dialog-scroll">
                            <div class="product-dialog-heading"><h2 id="productTitle">${esc(p.name)}</h2></div>
                            <p class="product-dialog-description">${esc(p.description)}</p>
                            ${p.includes?.length ? `<section class="product-includes" aria-labelledby="productIncludesTitle"><h3 id="productIncludesTitle">Qué incluye</h3><ul>${p.includes.map(text => `<li>${esc(text)}</li>`).join('')}</ul></section>` : ''}
                            <div class="product-options">${Catalog.options(p).slice().sort((a, b) => (a.id === 'porciones' ? -1 : b.id === 'porciones' ? 1 : 0)).map(option => this.optionHTML(option)).join('')}</div>
                            <div class="personal-fields">${this.personalHTML()}</div>
                            ${(p.notes || []).map(note => `<p class="field-note">${esc(note)}</p>`).join('')}
                        </div>
                        <div class="product-order">
                            ${!quoteOnly ? `<div class="quantity-price" data-order-priced><div><label class="quantity-label" for="productQuantity">${esc(p.quantityLabel || 'Cantidad de esta presentación')}</label><div class="quantity-control"><button type="button" class="icon-button" data-quantity="-1" aria-label="Reducir cantidad">${icon('minus')}</button><input id="productQuantity" type="number" inputmode="numeric" min="${Catalog.minimum(p)}" max="${Catalog.maximum}" step="1" value="${this.quantity}" aria-describedby="quantityError"><button type="button" class="icon-button" data-quantity="1" aria-label="Aumentar cantidad">${icon('plus')}</button></div></div><div class="order-total" aria-live="polite" aria-atomic="true"><span>Total · COP</span><strong id="productTotal"></strong><small id="productBreakdown"></small></div></div>` : ''}
                            <p class="field-note" data-order-quote hidden>${quoteOnly ? 'Confirma el diseño y su valor con nuestro equipo.' : 'Esta elección se cotiza por WhatsApp: te contamos el valor y la disponibilidad.'}</p>
                            <p id="quantityError" class="field-error" hidden></p>
                            <p id="productError" class="field-error" role="alert" hidden></p>
                            <button class="btn" type="submit" data-order-submit></button>
                            <p class="field-note">Confirmamos disponibilidad y entrega por WhatsApp.</p>
                        </div>
                    </form>
                </div>`;
            this.dialog.querySelectorAll('[data-image]').forEach(button => {
                button.addEventListener('click', () => {
                    const image = this.dialog.querySelector('#productMainImage');
                    setImageSource(image, images[Number(button.dataset.image)]);
                    image.alt = `${p.name}, imagen ${Number(button.dataset.image) + 1}`;
                    this.dialog.querySelectorAll('[data-image]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
                });
            });
            this.dialog.querySelectorAll('[data-option-input]').forEach(input => input.addEventListener('change', () => this.optionChange(input)));
            this.bindPersonal();
            this.dialog.querySelectorAll('[data-quantity]').forEach(button => button.addEventListener('click', () => {
                this.quantity = Math.min(Catalog.maximum, Math.max(Catalog.minimum(p), this.quantity + Number(button.dataset.quantity)));
                this.dialog.querySelector('#productQuantity').value = this.quantity;
                this.updateTotal();
            }));
            this.dialog.querySelector('#productQuantity')?.addEventListener('input', event => {
                this.quantity = Number(event.target.value);
                this.updateTotal();
            });
            this.dialog.querySelector('form').addEventListener('submit', event => { event.preventDefault(); this.submit(); });
            this.updateDependencies();
            this.updateTotal();
        }
        optionHTML(option) {
            const selected = this.selection[option.id];
            const errorId = `option-error-${option.id}`;
            const note = option.multiple ? `Elige hasta ${option.maxSelection || 1} colores.` : option.note || '';
            let controls;
            if (option.type === 'toggle') {
                controls = `<label class="toggle-option"><input data-option-input="${esc(option.id)}" type="checkbox" ${selected ? 'checked' : ''} aria-describedby="${errorId}"><span class="toggle-mark" aria-hidden="true">${icon('check')}</span><span>Agregar${typeof option.priceModifier === 'number' ? ` · +${Catalog.money(option.priceModifier)}` : ''}</span></label>`;
            } else {
                controls = `<div class="choice-list">${(option.choices || []).map((choice, index) => {
                    const checked = option.multiple ? selected?.includes(choice.value) : selected === choice.value;
                    const optionPrice = typeof choice.price === 'number' ? ` · ${Catalog.money(choice.price)}${choice.perUnit ? ' c/u' : ''}` : '';
                    return `<label class="choice"><input type="${option.multiple ? 'checkbox' : 'radio'}" name="option-${esc(option.id)}" value="${esc(choice.value)}" data-option-input="${esc(option.id)}" ${checked ? 'checked' : ''} aria-describedby="${errorId}"><span>${esc(choice.label)}${optionPrice}</span></label>`;
                }).join('')}</div>`;
            }
            return `<fieldset class="option-group" data-option-group="${esc(option.id)}"><legend>${esc(option.label)}${!option.required ? '<span class="field-optional">Opcional</span>' : ''}</legend>${controls}${note ? `<p class="field-note">${esc(note)}</p>` : ''}<p id="${errorId}" class="field-error" hidden></p></fieldset>`;
        }
        personalHTML() {
            return Catalog.fields(this.product, this.selection).map(field => `<div class="personal-field" data-personal-field="${esc(field.id)}"><label for="personal-${esc(field.id)}">${esc(field.label)}${!field.required ? '<span class="field-optional">Opcional</span>' : ''}</label><input id="personal-${esc(field.id)}" data-personal="${esc(field.id)}" type="text" value="${esc(this.personal[field.id] || '')}" maxlength="${field.maxLength || 100}" placeholder="${esc(field.placeholder || '')}" ${field.required ? 'aria-required="true"' : ''} aria-describedby="personal-error-${esc(field.id)}"><p class="character-count" data-counter="${esc(field.id)}">${String(this.personal[field.id] || '').length} / ${field.maxLength || 100}</p>${field.note ? `<p class="field-note">${esc(field.note)}</p>` : ''}<p id="personal-error-${esc(field.id)}" class="field-error" hidden></p></div>`).join('');
        }
        bindPersonal() {
            this.dialog.querySelectorAll('[data-personal]').forEach(input => input.addEventListener('input', () => {
                this.personal[input.dataset.personal] = input.value;
                this.dialog.querySelector(`[data-counter="${input.dataset.personal}"]`).textContent = `${input.value.length} / ${input.maxLength}`;
                input.removeAttribute('aria-invalid');
                this.dialog.querySelector(`#personal-error-${input.dataset.personal}`).hidden = true;
            }));
        }
        optionChange(input) {
            const option = this.product.options.find(o => o.id === input.dataset.optionInput);
            if (option.type === 'toggle') this.selection[option.id] = input.checked;
            else if (option.multiple) {
                const selected = Array.from(this.dialog.querySelectorAll(`[data-option-input="${option.id}"]:checked`)).map(el => el.value);
                if (selected.length > option.maxSelection) {
                    input.checked = false;
                    const error = this.dialog.querySelector(`#option-error-${option.id}`);
                    error.textContent = `Puedes elegir hasta ${option.maxSelection} colores. Desmarca uno para cambiarlo.`;
                    error.hidden = false;
                    return;
                }
                this.selection[option.id] = selected;
            } else this.selection[option.id] = input.value;
            this.dialog.querySelector(`#option-error-${option.id}`).hidden = true;
            this.updateDependencies();
            if (this.product.personalization?.dependsOn === option.id) {
                this.dialog.querySelector('.personal-fields').innerHTML = this.personalHTML();
                this.bindPersonal();
            }
            this.updateTotal();
        }
        updateDependencies() {
            this.dialog.querySelectorAll('[data-option-group]').forEach(group => {
                const option = this.product.options.find(o => o.id === group.dataset.optionGroup);
                const visible = Catalog.visible(option, this.selection);
                group.hidden = !visible;
                group.disabled = !visible;
            });
        }
        updateTotal() {
            // Con precio: cantidad, total y «Agregar a mi pedido». Sin precio: se consulta por WhatsApp.
            const quote = Catalog.quote(this.product, this.selection);
            const priced = this.dialog.querySelector('[data-order-priced]');
            if (priced) priced.hidden = quote;
            this.dialog.querySelector('[data-order-quote]').hidden = !quote;
            this.dialog.querySelector('[data-order-submit]').innerHTML = `${quote ? 'Consultar por WhatsApp' : this.editIndex !== null ? 'Guardar cambios' : 'Agregar a mi pedido'} ${icon(quote ? 'diagonal' : 'plus')}`;
            const output = this.dialog.querySelector('#productTotal');
            if (!output || quote) { const error = this.dialog.querySelector('#quantityError'); if (error) error.hidden = true; return; }
            const valid = Number.isInteger(this.quantity) && this.quantity >= Catalog.minimum(this.product) && this.quantity <= Catalog.maximum;
            const unit = Catalog.price(this.product, this.selection);
            const known = valid && Number.isSafeInteger(unit);
            output.textContent = known ? Catalog.money(unit * this.quantity) : '—';
            // Desglose visible: cuántas presentaciones, a qué precio y cuántas unidades suman.
            const pack = Catalog.choices(this.product, this.selection).some(o => o.id === 'cantidad') && Number(this.selection.cantidad);
            const units = pack ? ` · ${pack * this.quantity} unidades` : '';
            this.dialog.querySelector('#productBreakdown').textContent = known && (this.quantity > 1 || units) ? `${this.quantity} × ${Catalog.money(unit)}${units}` : '';
            const error = this.dialog.querySelector('#quantityError');
            error.hidden = valid;
            error.textContent = `Elige una cantidad entre ${Catalog.minimum(this.product)} y ${Catalog.maximum}.`;
            this.dialog.querySelector('[data-quantity="-1"]').disabled = this.quantity <= Catalog.minimum(this.product);
            this.dialog.querySelector('[data-quantity="1"]').disabled = this.quantity >= Catalog.maximum;
        }
        submit() {
            const errors = Catalog.validate(this.product, this.selection, this.personal);
            this.dialog.querySelectorAll('.field-error').forEach(error => { error.hidden = true; });
            this.dialog.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
            for (const error of errors) {
                const element = this.dialog.querySelector(`#personal-error-${error.id}`) || this.dialog.querySelector(`#option-error-${error.id}`);
                if (element) { element.hidden = false; element.textContent = error.message; }
                const input = this.dialog.querySelector(`[data-personal="${error.id}"]`) || this.dialog.querySelector(`[data-option-input="${error.id}"]`);
                input?.setAttribute('aria-invalid', 'true');
            }
            if (errors.length) { this.dialog.querySelector('[aria-invalid=true]')?.focus(); return; }
            if (Catalog.quote(this.product, this.selection)) {
                const details = Object.entries(Catalog.summary(this.product, this.selection)).map(([k,v]) => `${k}: ${v}`).join('\n');
                const message = [`Hola, Laura. Quisiera cotizar ${this.product.name}${Catalog.quoteOnly(this.product) ? ' para mi torta' : ''}.`, details, Catalog.personalText(this.product, this.selection, this.personal), '¿Me cuentas el valor y si está disponible?'].filter(Boolean).join('\n');
                window.open(wa(message), '_blank', 'noopener,noreferrer');
                return;
            }
            this.updateTotal();
            if (!Number.isInteger(this.quantity) || this.quantity < Catalog.minimum(this.product) || this.quantity > Catalog.maximum) { this.dialog.querySelector('#productQuantity').focus(); return; }
            const saved = cartManager.addItem({ id: this.product.id, quantity: this.quantity, selection: this.selection, personal: this.personal }, this.editIndex);
            if (!saved) {
                const error = this.dialog.querySelector('#productError');
                error.textContent = 'No pudimos agregar esa cantidad. Revisa tu pedido: el máximo es 99 de la misma presentación.';
                error.hidden = false;
                return;
            }
            const editing = this.editIndex !== null;
            LaurenUI.close(this.dialog);
            if (!editing) LaurenUI.toast('Agregado a tu pedido.', { label: 'Ver pedido', run: () => window.cartUI.open() });
        }
    }
    window.quickView = new QuickViewModal();
})();
