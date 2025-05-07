
// outwine.js
'use strict';

// import showAlertModal function from './modal-error.js'
// import create$$ function from './section-utils.js'
// import chargeContainers function from './inventario.js'

$(document).ready(() => {
    const section = 'outwine';
    const $$ = create$$(section);
    
    const $modal = setOutWineModal();
    setShowButton($modal);
    setPetitionButton($modal);

    function setShowButton($modal) {
        $(document).on('click', '.outlet-show', function() {
            const $row = $(this).closest('tr');
            const batchName = $row.find('td').eq(0).text();
            $modal.data('batchName', batchName);
            $modal.modal('show');
        });
    }

    function setOutWineModal() {
        const html = `
        <div class="modal fade" id="outwine-modal" tabindex="-1" aria-labelledby="outwine-modalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="outwine-modalLabel">Salida de vino</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label for="quantity" class="form-label">Cantidad:</label>
                        <input type="text" class="form-control" id="outwine-quantity" name="quantity"  placeholder="litros" 
                            aria-label="Cantidad" />
                        <div id="outwine-quantityError"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-cancel" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="outwine-petition">Confirmar</button>
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
        });
        return $modal;
    }

    function setPetitionButton($modal) {
        $(document).on('click', '#outwine-petition', function() {
            const quantity = parseInt($$('quantity').val(), 10);
            const batchName = $modal.data('batchName');
            const data = {
                quantity,
                batchName,
            };
            $modal.modal('hide');
            makePetition(data);
        });
    }

    function makePetition(data) {
        const url = '/outlet';
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function() {
                const title = 'Aviso';
                const message = 'Salida realizada';
                showAlertModal(title, message);
                chargeContainers();
            },
            error: function(xhr) {
                const info = 'Failed to out wine';
                let title = 'Error';
                let message = info;
                if (xhr.responseJSON && xhr.responseJSON.text)
                    message = xhr.responseJSON.text;
                showAlertModal(title, message);
            }
        });
    }
});