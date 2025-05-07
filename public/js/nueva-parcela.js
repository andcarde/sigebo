
// nueva-parcela.js
'use strict';

const assignedIDs = [];

$(document).ready(() => {
    ModalParcela.init();

    // Cierra el modal al hacer clic en el botón de cerrar
    $('.nueva-parcela-modal-close-btn').on('click', () => {
        ModalParcela.closeModal();
    });
});

// Módulo ModalParcela
const ModalParcela = (function() {
    const $$ = create$$('createPlot');
    const $idInput = $$('id');
    const $aliasInput = $$('alias');
    const $idError = $$('idError');
    const $cancelButton = $$('cancelar');
    const $confirmButton = $$('petition');
    const $modal = $$('modal');
    const $cantidadVariedadContainer = $$('varieties-box');
    const cantidadVariedadContainer = '#varieties-box';
    const cantidadInput = '.cantidad-input';
    // Selector para el nuevo select
    const variedadSelect = '.form-select';

    const header = `
        <div class="row field-column">
            <div class="col-6">Superficie</div>
            <div class="col-6">Variedad</div>
        </div>
    `;

    const newRow = `
        <div class="cantidad-variedad-row row mb-3">
            <input type="number" class="cantidad-input form-control col" min="1" placeholder="CANTIDAD">
            <select class="form-select col" size="2">
                <option value="albillo">Albillo</option>
                <option value="maturana">Maturana</option>
                <option value="merlot">Merlot</option>
                <option value="tempranillo">Tempranillo</option>
            </select>
        </div>
    `;

    function init() {
        bindUIActions();
        resetModalFields();
    }

    function bindUIActions() {
        $idInput.on('input', validateID);
        $cantidadVariedadContainer.on('input', cantidadInput, checkRowCompletion);
        $cantidadVariedadContainer.on('change', `${variedadSelect} option`, checkRowCompletion);

        $confirmButton.on('click', handleConfirm);
        $cancelButton.on('click', closeModal);
    }

    function validateID() {
        const idValue = $idInput.val();
        const isIDAssigned = assignedIDs.includes(idValue);
        $idError.text(isIDAssigned ? 'Este ID ya existe.' : '');
        toggleConfirmButton();
    }

    function checkRowCompletion() {
        const lastRow = $(`${cantidadVariedadContainer} .cantidad-variedad-row:last-child`);
        const cantidadInput = lastRow.find(cantidadInput).val();
        const selectSelected = lastRow.find(`${variedadSelect} option:checked`).length > 0;

        if (cantidadInput > 0 && selectSelected)
            addNewRow();
        toggleConfirmButton();
    }

    function addNewRow() {
        $cantidadVariedadContainer.append(newRow);
    }

    function toggleConfirmButton() {
        const idFilled = $idInput.val() !== '' && !$idError.text();
        const quantityChecked = $(`${cantidadVariedadContainer} ${cantidadInput}`).filter(function () {
            return this.value > 0;
        }).length > 0;

        $confirmButton.prop('disabled', !(idFilled && quantityChecked));
    }

    function handleConfirm() {
        const newID = $idInput.val();
        if (!assignedIDs.includes(newID)) {
            assignedIDs.push(newID);
            closeModal();
        }
    }

    function closeModal() {
        $modal.modal('hide');
        resetModalFields();
    }

    function resetModalFields() {
        $idInput.val('');
        $aliasInput.val('');
        $idError.text('');
        const html = header + newRow;
        $cantidadVariedadContainer.html(html);
        $confirmButton.prop('disabled', true);
    }

    return {
        init,
        closeModal // Hacer accesible el método closeModal
    };
})();