
// embotellado.js
'use strict';

// import showAlertModal function from './modal-error.js'
// import create$$ function from './section-utils.js'
// import chargeContainers function from './inventario.js'

$(document).ready(() => {
    const section = 'bottling';
    const $$ = create$$(section);
    
    const $modal = setBottlingModal();
    setShowButton($modal);
    setPetitionButton($modal);

    function setShowButton($modal) {
        $(document).on('click', '.bottling-show', function() {
            const $row = $(this).closest('tr');
            const containerName = $row.find('td').eq(0).text();
            $modal.data('originContainerName', containerName);
            $modal.modal('show');
        });
    }

    function setBottlingModal() {
        const html = `
        <div class="modal fade" id="bottling-modal" tabindex="-1" aria-labelledby="bottling-modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="bottling-modalLabel">Embotellar</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="quantity" class="form-label">Cantidad:</label>
                        <input type="text" class="form-control" id="bottling-quantity" name="quantity"  placeholder="litros" 
                            aria-label="Cantidad" />
                        <div id="bottling-quantityError"></div>
                        <label for="batchName" class="form-label">Nombre del nuevo lote:</label>
                        <input type="text" class="form-control" id="bottling-batchName" name="batchName" placeholder="ejemplo: L2024/1" 
                            aria-label="Nombre del nuevo lote" />
                        <div id="bottling-quantityError"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="bottling-petition">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        $('body').append($(html));

        const $modal = $$('modal');
        $modal.on('hidden.bs.modal', function() {
            $$('quantity').val('');
            $$('quantityError').empty();
            $$('batchName').val('');
            $$('batchNameError').empty();
        });
        return $modal;
    }

    function setPetitionButton($modal) {
        $(document).on('click', '#bottling-petition', function() {
            const quantity = parseInt($$('quantity').val(), 10);
            const batchName = $$('batchName').val();
            const originContainerName = $modal.data('originContainerName');
            const data = {
                quantity,
                batchName,
                originContainerName
            };
            $modal.modal('hide');
            makePetition(data);
        });
    }

    function makePetition(data) {
        const url = '/bottling';
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function() {
                const title = 'Aviso';
                const message = 'Embotellado realizado';
                showAlertModal(title, message);
                chargeContainers();
            },
            error: function(xhr) {
                const info = 'Failed to bottling';
                let title = 'Error';
                let message = info;
                if (xhr.responseJSON && xhr.responseJSON.text)
                    message = xhr.responseJSON.text;
                showAlertModal(title, message);
            }
        });
    }
});