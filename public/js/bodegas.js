
// bodegas.js
'use strict';

// import logError functions from './log-utils.js'
// import validateValues function from './validate-utils.js'

$(document).ready(function() {
    const $winerys = $('#winerys');
    const $show = $('#winery-show');
    const $modal = initCreateWineryModal();

    const $create = $('#winery-create');
    const $name = $('#winery-name');
    const $alert = $('#winery-alert');

    chargeWinerys();
    setCreateWineryModal();
    setCreateWineryButton();
    setDeleteWineryButton();
    
    $winerys.on('click', '.winery-select', function() {
        const id = $(this).data('winery-id');
        selectWinery(id);
    });

    function initCreateWineryModal() {
        const id = 'winery-modal';

        const html = `
            <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="winery-modalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="winery-modalLabel">Crear Bodega</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="name" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="winery-name" name="name" required>
                            </div>
                            <div id="winery-alert" class="alert alert-danger d-none" role="alert">
                                <!-- Dynamically completed -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="winery-create">Crear</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add the modal to the body
        $('body').append(html);

        return $(`#${id}`);
    }

    function setCreateWineryModal() {
        // Show the modal when the button is clicked
        $show.on('click', function() {
            $modal.modal('show');
        });
        // Clear the modal when it is hidden
        $modal.on('hidden.bs.modal', function() {
            $name.val('');
        });
    }

    function setCreateWineryButton() {
        $create.on('click', function() {
            const name = $name.val();
            const data = { name };
            if (!validateCreateWineryData(data))
                return;
            const url = '/create-winery';
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function() {
                    $modal.modal('hide');
                    chargeWinerys();
                },
                error: function(xhr) {
                    $modal.modal('hide');

                    const info = 'Failed to create winery';
                    logError(info, url, xhr);
                    let title = 'Error';
                    let message = info;
                    if (xhr.responseJSON && xhr.responseJSON.text)
                        message = xhr.responseJSON.text;
                    showAlertModal(title, message);
                }
            });
        });
    }

    function validateCreateWineryData(data) {
        if (!validateValues([
            [data.name, 'string(1, 32)']
        ])) {
            setAlert('The name is required and must be between 1 and 32 characters');
            return false;
        }
        return true;
    }

    function setAlert(message) {
        $alert.text(message);
        $alert.show();
    }
    
    // Get the wineries from the server and set them in the view
    function chargeWinerys() {
        const url = '/get-bodegas';
        $.ajax({
            url: url,
            method: 'POST',
            success: function(data) {
                setWinerys(data);
            },
            error: function(xhr) {
                const info = 'Failed to charge wineries';
                logError(info, url, xhr);
            }
        });
    }

    function setWinerys(winerys) {
        $winerys.empty();
        winerys.forEach(winery => {
            const card = `
                <div class="row winery-row">
                    <div class="col-10">
                        <button class='winery-select' data-winery-id="${winery.id}">
                            <div class="my-card">
                                <div class="card-body">
                                    <h5>${winery.nombre}</h5>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div class="col-2 winery-bin">
                        <button class="winery-delete" data-winery-id="${winery.id}">
                            <img class="bin rounded-circle" src="/img/bin.jpg" alt="delete">
                        </button>
                    </div>
                </div>
            `;
            // const card = `
            //     <button data-winery-id="${winery.id}">
            //         <div class="col-4 offset-2 offset-md-2 col-md-4">
            //             <div class="card">
            //                 <div class="card-body">
            //                     <h5 class="card-title">${winery.nombre}</h5>
            //                 </div>
            //             </div>
            //         </div>
            //     </button>
            //     <button data-winery-id="${winery.id}">
            //         <div class="col col-md-4">
            //             <p>Borrar</p>
            //         </div>
            //     </button>
            // `;
            $winerys.append(card);
        });

        const minPadding = 5;
        let maxHeight = 0;
        $('.winery-row').each(function() {
            const height = $(this).height();
            if (height > maxHeight)
                maxHeight = height;
            const cardHeight = $(this).find('.my-card').height();
            const cardPadding = $(this).find('.my-card').css('padding');
            const totalCardHeight = cardHeight + parseInt(cardPadding) * 2;
            let padding = (maxHeight - totalCardHeight) / 2;
            if (padding < minPadding)
                padding = minPadding;
            $(this).css({
                'padding-top': padding + 'px',
                'padding-bottom': padding + 'px'
            });
        });
    }
    
    function selectWinery(id) {
        const url = '/select-bodega';
        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ idBodega: id }),
            success: function() {
                // Redirect to '/inventario'
                window.location.href = '/inventario';
            },
            error: function(xhr) {
                const info = 'Failed to select winery';
                logError(info, url, xhr);
            }
        });
    }

    function setDeleteWineryButton() {
        $winerys.on('click', '.winery-delete', function() {
            const id = $(this).data('winery-id');
            const url = '/delete-winery';
            const data = { idBodega: id };
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function() {
                    chargeWinerys();
                    const title = 'Aviso';
                    const message = 'La bodega ha sido eliminada correctamente';
                    showAlertModal(title, message);
                },
                error: function(xhr) {                  
                    const info = 'Failed to delete winery';
                    logError(info, url, xhr);
                    let title = 'Error';
                    let message = info;
                    if (xhr.responseJSON && xhr.responseJSON.text)
                        message = xhr.responseJSON.text;
                    showAlertModal(title, message);
                }
            });
        });
    }

    $(window).resize(function() {
        if ($(window).width() < 1100) {
            $('#winerys').css({
                'margin-left': '0rem',
                'margin-right': '0rem'
            });
        } else {
            $('#winerys').css({
                'margin-left': '',
                'margin-right': ''
            });
        }
    }).resize();
});