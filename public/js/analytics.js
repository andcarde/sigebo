
// analytics.js
'use strict';

// import PairContainer, PairContainer.getOptions functions from './input-pair.js';

const metrics = ['Acidez total', 'Acidez volátil', 'Ácido cítrico', 'Azúcares residuales',
    'Dióxido de azufre libre', 'Dióxido de azufre total', 'Densidad', 'pH',
    'Sulfatos', 'Alcohol'];

// analysis : array<array<pair<string, int>>>
let analytics;
// index : int
let index = 0;

$(document).ready(() => {
    const section = 'analytics';
    const $$ = create$$(section);

    let batchName = null;
    let $creationModal = null;
    let $createButton = null;
    let pairContainer = null;
    let $inputDate = null;
    
    const $historyModal = setHistoryModal();
    const $next = $$('next');
    const $previous = $$('previous');

    // Set showCreationButton on click event
    $(document).on('click', '.analytics-showCreation', function() {
        const $row = $(this).closest('tr');
        batchName = $row.find('td').eq(1).text();

        setCreationModal();
        
        $createButton.on('click', function() {
            const values = pairContainer.getOptions();
            const date = $inputDate.val();
            const data = {
                values,
                date,
                batchName
            }
            createAnalytic(data);
        });
        $creationModal.modal('show');
    });

    // Set showHistoryButton on click event
    $(document).on('click', '.analytics-showHistory', function() {
        const $row = $(this).closest('tr');
        const batchName = $row.find('td').eq(1).text();
        chargeAnalytics(batchName);
    });

    function setCreationModal() {
        const html = `
            <div class="modal fade" id="analytics-creation" tabindex="-1" aria-labelledby="analytics-creationLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="analytics-creationLabel">Crear análitica</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="date" class="form-label">Fecha</label>
                                <input type="date" class="form-control" id="analytics-inputDate" name="date" required>
                            </div>
                            <div class="mb-3">
                                <div id="analytics-pairContainer"></div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" id="analytics-create">Crear</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('body').append($(html));

        $creationModal = $$('creation');
        $createButton = $$('create');
        $inputDate = $$('inputDate');

        const $container = $$('pairContainer');
        const validate = (isValid) => {
            if (isValid)
                $createButton.removeAttr('disabled');
            else
                $createButton.attr('disabled', 'disabled');
        };
        pairContainer = new PairContainer(section, $container, metrics, validate);
        
        $creationModal.on('hidden.bs.modal', function() {
            // Remove the modal from the DOM
            $creationModal.remove();
        });
    }

    function setHistoryModal() {
        const html = `
            <div class="modal fade" id="analytics-history" tabindex="-1" aria-labelledby="analytics-historyLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="analytics-historyLabel">Historial de analíticas</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-3">
                                <div class="col-6">
                                    <p class="fw-bold">Lote: <span id="analytics-batchName" class="text-muted"></span></p>
                                </div>
                                <div class="col-6 text-end">
                                    <p class="fw-bold">Fecha: <span id="analytics-date" class="text-muted"></span></p>
                                </div>
                            </div>
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>Métrica</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="analytics-previous">Anterior</button>
                            <button type="button" class="btn btn-primary" id="analytics-next">Siguiente</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('body').append($(html));

        $$('next').on('click', function() {
            index++;
            updateHistoryModal();
        });
        $$('previous').on('click', function() {
            index--;
            updateHistoryModal();
        });

        const $historyModal = $$('history');
        $historyModal.on('hidden.bs.modal', function() {
            index = 0;
        });
        return $historyModal;
    }

    function createAnalytic(data) {
        const url = '/create-analytic';
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function() {
                $creationModal.modal('hide');
                const title = 'Aviso';
                const message = 'Análitica creada correctamente';
                showAlertModal(title, message);
            },
            error: function(xhr) {
                $creationModal.modal('hide');
                const info = 'Failed to create analytic';
                let title = 'Error';
                let message = info;
                if (xhr.responseJSON && xhr.responseJSON.text)
                    message = xhr.responseJSON.text;
                showAlertModal(title, message);
            }
        });
    }

    function chargeAnalytics(batchName) {
        const url = '/get-analytics';
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ batchName }),
            success: function(response) {
                // Sort analytics by date
                analytics = response.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                if (analytics.length === 0) {
                    const title = 'Aviso';
                    const message = 'No hay ninguna análitica registrada para este lote';
                    showAlertModal(title, message);
                } else {
                    initHistoryModal(batchName);
                    $historyModal.modal('show');
                }
            },
            error: function(xhr) {
                const info = 'Failed to charge analytics';
                let title = 'Error';
                let message = info;
                if (xhr.responseJSON && xhr.responseJSON.text)
                    message = xhr.responseJSON.text;
                showAlertModal(title, message);
            }
        });
    }

    function initHistoryModal(batchName) {
        const $batchName = $$('batchName');
        $batchName.text(batchName);
        updateHistoryModal();
    }

    function updateHistoryModal() {
        updateNextAndPrevious();
        const analytic = analytics[index];
        const $date = $$('date');
        const date = new Date(analytic.fecha);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        $date.text(formattedDate);
        const $table = $historyModal.find('tbody');
        $table.empty();
        for (const [metric, value] of analytic.valores) {
            const $tr = $(`
                <tr>
                    <td>${metric}</td>
                    <td>${value}</td>
                </tr>
            `);
            $table.append($tr);
        }
    }

    function updateNextAndPrevious() {
        if (index === 0)
            $previous.addClass('disabled');
        else
            $previous.removeClass('disabled');
        if (index === analytics.length - 1)
            $next.addClass('disabled');
        else
            $next.removeClass('disabled');
    }
});