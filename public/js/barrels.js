
// barrels.js
'use strict';

// import chargeContainers function from './inventario.js'

$(document).ready(() => {
    const section = 'barrel';
    const $$ = create$$(section);
    const fields = ['capacity', 'name'];

    const $modal = setCreateBarrelModal();

    const $petitionButton = $$('create');
    setPetitionButton();
    
    function setCreateBarrelModal() {
        const modalHtml = `
        <div class="modal fade" id="barrel-modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">Agregar barricas</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="capacity">Capacidad</label>
                        <input type="number" id="barrel-capacity" name="capacity" class="form-control">
                        <label for="name">Nombre</label>
                        <input type="text" id="barrel-name" name="name" class="form-control">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="barrel-create">Agregar</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        $('body').append($(modalHtml));
        const $modal = $$('modal');

        const $show = $$('show');
        // Show the modal when the button is clicked
        $show.on('click', function() {
            $modal.modal('show');
        });
        // Clear the modal when it is hidden
        $modal.on('hidden.bs.modal', function() {
            fields.forEach(field => $$(field).val(''));
        });
        
        return $modal;
    }

    function setPetitionButton() {
        $petitionButton.on('click', function() {
            const barrelData = buildBarrelData();
            makePetition(barrelData, $modal);
        });
    }

    function buildBarrelData() {
        const depositsData = {
            type: 'barrica',
            capacity: $$('capacity').val(),
            name: $$('name').val()
        };
        return depositsData;
    }
});