
// inventario.js
'use strict';

const PAGE = 'inventario';

const EMPTY_TEXT = '-'
let origen_button;
let destino_button;
let origenError;
let destinoError;

$(document).ready(() => {
    const $moveButton = $('#move-btn');
    const $moveModalButton = $('#move-modal-btn');
    const $moveModal = $('#move-modal');
    const $moveError = $('#move-error');
    const $moveQuantity = $('#move-quantity');
    const $moveNewDestinationBatch = $('#move-newDestinationBatch');
    const $moveNewDestinationBatchName = $('#move-newDestinationBatchName');

    chargeContainers();
    setSelectMoveButton();
    setMoveModal();
    setMoveModalButton();
    setMoveButton();

    function setSelectMoveButton() {
        $(document).on('click', '.select-move-btn', function() {
            const row = $(this).closest('tr');
            // volumen : string
            const volumen = row.find('td:eq(2)').text();
            // capacity : string
            const capacity = row.find('td:eq(3)').text();
            // isEmpty : boolean
            const isEmpty = volumen === EMPTY_TEXT;
            // isFull : boolean
            const isFull = function() {
                if (isEmpty)
                    return false;
                else
                    return parseInt(volumen, 10) >= parseInt(capacity, 10);
            }();

            const currentState = $(this).data('state');

            if (currentState === 'normal') {
                if (origen_button === null) {
                    setOrigen($(this), isEmpty)
                } else if (destino_button === null) {
                    setDestino($(this), isFull)
                } else {
                    setNormal(origen_button);
                    setOrigen($(this), isEmpty);
                    setNormal(destino_button);
                    destino_button = null;
                }
            } else if (currentState === 'origen') {
                if (destino_button !== null) {
                    setOrigen(destino_button, isEmpty);
                } else {
                    origen_button = null;
                }
                setDestino($(this), isFull);
            } else {
                setNormal($(this));
                destino_button = null;
            }

            updateMoveButton();
        });
    }

    function setOrigen(button, isEmpty) {
        button.data('state', 'origen');
        origen_button = button;
        origenError = isEmpty;
        button.empty();
        if (isEmpty) {
            button.append(`
                <div class="move-action action origen d-flex align-items-center">
                    ORIGEN
                    <img src="img/warning.png" class="alert-icon">
                </div>
            `);
        } else {
            button.append('<div class="move-action action origen d-flex align-items-center">ORIGEN</div>');
        }
    }

    function setDestino(button, isFull) {
        button.data('state', 'destino');
        destino_button = button;
        destinoError = isFull;
        button.empty();
        if (isFull) {
            button.append(`
                <div class="move-action action destino d-flex align-items-center">
                    DESTINO
                    <img src="img/warning.png" class="alert-icon">
                </div>
            `);
        } else {
            button.append('<div class="move-action action destino d-flex align-items-center">DESTINO</div>');
        }
    }

    function setNormal(button) {
        button.data('state', 'normal');
        button.empty();
        button.append('<img src="img/mover.png" class="action move-action">');
    }

    function updateMoveButton() {
        if (origen_button && destino_button && !origenError && !destinoError)
            $moveModalButton.removeClass('disabled');
        else
            $moveModalButton.addClass('disabled');

    }

    // Cuando el modal $moveModal se cierra, se oculta el div $moveError y se limpia el campo $moveQuantity
    function setMoveModal() {
        $moveModal.on('hidden.bs.modal', function() {
            $moveError.empty();
            $moveQuantity.val('');
            $moveNewDestinationBatch.hide();
            $moveNewDestinationBatchName.val('');
        });
    }

    function setMoveModalButton() {
        $moveModalButton.click(function() {
            if ($(this).hasClass('disabled') || origen_button === null || destino_button === null)
                return;
            const destinationVolumeString = destino_button.closest('tr').find('td:eq(2)').text();
            const destinationVolume = parseInt(destinationVolumeString, 10);
            if (isNaN(destinationVolume) || destinationVolume === 0)
                $moveNewDestinationBatch.show();
        });
    }

    function setMoveButton() {
        const $moveError = $('#move-error');
        const $moveQuantity = $('#move-quantity');
        function clearModal() {
            $moveError.empty();
        }

        function setAlert(message) {
            clearModal();
            $moveError.append(
                `<div class="alert alert-danger" role="alert">
                    ${message}
                </div>`
            );
        }

        $moveButton.click(function() {
            if ($(this).hasClass('disabled') || origen_button === null || destino_button === null)
                return;

            const origenVolumenString = origen_button.closest('tr').find('td:eq(2)').text();
            let origenVolumen = parseInt(origenVolumenString, 10);
            if (isNaN(origenVolumen))
                origenVolumen = 0;
            const destinoVolumenString = destino_button.closest('tr').find('td:eq(2)').text();
            let destinoVolumen = parseInt(destinoVolumenString, 10);
            if (isNaN(destinoVolumen))
                destinoVolumen = 0;
            const destinoCapacityString = destino_button.closest('tr').find('td:eq(3)').text();
            const destinoCapacity = parseInt(destinoCapacityString, 10);
            const quantityString = $moveQuantity.val();
            const quantity = parseInt(quantityString, 10);
            if (isNaN(quantity)) {
                setAlert(`La cantidad ingresada no es válida`);
                return;
            }

            const spareCapacity = destinoCapacity - destinoVolumen;

            const origen = origen_button.closest('tr').find('td:eq(0)').text();
            const destino = destino_button.closest('tr').find('td:eq(0)').text();

            // <DEBUG> Imprimir las variables: origen, origenVolumen, destino, destinoVolumen, spareCapacity, quantity
            // console.log(
            //     `Evento: Mover vino` + '\n' +
            //     `- Origen: ${origen}, Volumen: ${origenVolumen}` + '\n' +
            //     `- Destino: ${destino}, Volumen: ${destinoVolumen}, Espacio libre: ${spareCapacity}`+ '\n' +
            //     `- Quantity: ${quantity}`
            // );
            // </DEBUG>

            if (origenVolumen < quantity)
                setAlert(`No hay suficiente vino en ${origen} (origen)`);
            else if (spareCapacity < quantity)
                setAlert(`No hay suficiente espacio en ${destino} (destino)`);
            else {
                const $moveModal = $('#move-modal');
                let data = {
                    origen: origen,
                    destino: destino,
                    quantity: quantity
                };
                if (destinoVolumen === 0)
                    data.destinationBatchName = $('#move-newDestinationBatchName').val();
                // <DEBUG> Imprimir la variable data
                log(data, 'data');
                // </DEBUG>
                let url;
                if (destinoVolumen === 0)
                    url = '/move-empty';
                else
                    url = '/move-partial';
                $.ajax({
                    method: 'POST',
                    url: url,
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function() {
                        $moveModal.modal('hide');
                        chargeContainers();
                    },
                    error: function(xhr) {
                        $moveModal.modal('hide');
                        const info = `No se ha podido mover el vino desde ${origen} a ${destino}`;
                            let reason = 'Razón desconocida';
                            if (xhr.responseJSON && xhr.responseJSON.text)
                                reason = xhr.responseJSON.text;
                            let message = 'Detected Error';
                            message += `\n- On: Request '${url}'`;
                            message += `\n- Info: ${info}`;
                            message += `\n- Reason: ${reason}`
                            console.error(message);
                    }
                });
            }
        });
    }
});

function chargeContainers() {
    origen_button = null;
    destino_button = null;
    origenError = false;
    destinoError = false;

    const $moveModalButton = $('#move-modal-btn');
    $moveModalButton.addClass('disabled');

    const url = '/get-containers';
    $.ajax({
        type: 'POST',
        url: url,
        success: function(data) {
            const containers = data.containers;
            const batches = data.batches;

            function buildEmptyRow(colspan, text) {
                return `
                    <tr>
                        <td colspan="${colspan}">${text}</td>
                    </tr>
                `;
            }
            function clean(string) {
                return (string === undefined || string === null || string === '') ? EMPTY_TEXT : string;
            }
            function buildRow(container) {
                container.nombre_lote = clean(container.nombre_lote);
                container.volumen = clean(container.volumen);
                const isEmptyBatch = container.nombre_lote === EMPTY_TEXT;
                const disabled = isEmptyBatch ? 'disabled' : '';

                const move = 'mover.png';
                const createAnalytic = 'add_analytics.png';
                const showAnalytics = 'show_analytics.png';
                const showBottling = 'show_bottling.png';
                const actions = `
                    <button class="select-move-btn">
                        <img src="img/${move}" class="action move-action">
                    </button>
                    <button class="analytics-showCreation ${disabled}" ${disabled}>
                        <img src="img/${createAnalytic}" class="action">
                    </button>
                    <button class="analytics-showHistory ${disabled}" ${disabled}>
                        <img src="img/${showAnalytics}" class="action">
                    </button>
                    <button class="bottling-show ${disabled}" ${disabled}>
                        <img src="img/${showBottling}" class="action">
                    </button>
                `;
                const row = `
                    <tr>
                        <td>${container.nombre}</td>
                        <td>${container.nombre_lote}</td>
                        <td>${container.volumen}</td>
                        <td>${container.max_volumen}</td>
                        <td>${actions}</td>
                    </tr>
                `;
                return row;
            }
            function buildBottleRow(batch) {
                const outWine = 'outlet.png';
                const actions = `
                    <button class="outlet-show">
                        <img src="img/${outWine}" class="action">
                    </button>
                `;
                const row = `
                    <tr>
                        <td>${batch.nombre}</td>
                        <td>${batch.volumen}</td>
                        <td>${actions}</td>
                    </tr>
                `;
                return row;
            }

            const deposits = $('#deposits');
            const barrels = $('#barrels');
            const bottles = $('#bottles');

            [
                [deposits, 'deposito', 'depósitos'],
                [barrels, 'barrica', 'barricas'],
            ].forEach(type => {
                const [$box, name, text] = type;
                // Default: Without containers
                $box.empty();
                
                if (!containers.hasOwnProperty(name) || containers[name].length === 0)
                    $box.append(buildEmptyRow(5, `No hay ${text}`));
                else
                    containers[name].forEach(container => {
                        $box.append(buildRow(container));
                    });
            });
            const [$box, name, text] = [bottles, 'botella', 'botellas'];
            const bottleBatches = batches.filter(batch => batch.contenedor === name);
            // Default: Without batches
            $box.empty();
            
            if (bottleBatches.length === 0)
                $box.append(buildEmptyRow(3, `No hay ${text}`));
            else
                bottleBatches.forEach(batch => {
                    $box.append(buildBottleRow(batch));
                });

            // Initialize tooltips
            $('.select-move-btn').each(function() {
                $(this).data('state', 'normal');
            });
        },
        error: function(xhr) {
            const info = 'Failed to charge the containers';
            logError(info, url, xhr)
        }
    });
}

// exports chargeContainers function