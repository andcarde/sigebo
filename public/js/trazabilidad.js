
// trazabilidad.js
'use strict';

// import showAlertModal function from './modal-error.js'

class Operacion {
    constructor(id, id_bodega, id_usuario, id_lote_origen, id_contenedor_origen,
            id_lote_destino, id_contenedor_destino, fecha, tipo, volumen) {
        this.id = id;
        this.id_bodega = id_bodega;
        this.id_usuario = id_usuario;
        this.id_lote_origen = id_lote_origen;
        this.nombre_contenedor_origen = id_contenedor_origen;
        this.id_lote_destino = id_lote_destino;
        this.nombre_contenedor_destino = id_contenedor_destino;
        this.fecha = fecha;
        this.tipo = tipo;
        this.volumen = volumen;
    }
}

class Node {
    constructor(operation) {
        this.operation = operation;
        this.children = [];
    }
    addChild(child) {
        this.children.push(child);
    }
    toArray() {
        let children = [];
        for (const child of this.children)
            children.push(child.toArray());
        return [this.operation, children];
    }
    static fromArray(array) {
        const operation = array[0];
        const children = array[1];
        const node = new Node(operation);
        for (const child of children)
            node.addChild(Node.fromArray(child));
        return node;
    }
}

const testRootNode = {
    operation: {
        nombre_contenedor_origen: 'D1',
        fecha: '02/02/2025',
        tipo: 'salida',
        volumen: 3000
    },
    children: [
        {
            operation: {
                nombre_contenedor_origen: 'D3',
                nombre_contenedor_destino: 'D1',
                fecha: '04/11/2024',
                tipo: 'movimiento',
                volumen: 2000
            },
            children: [
                {
                    operation: {
                        nombre_contenedor_destino: 'D3',
                        fecha: '11/09/2024',
                        tipo: 'entrada',
                        volumen: 1000
                    },
                    children: []
                },
                {
                    operation: {
                        nombre_contenedor_destino: 'D3',
                        fecha: '12/09/2024',
                        tipo: 'entrada',
                        volumen: 1000
                    },
                    children: []
                }
            ]
        },
        {
            operation: {
                nombre_contenedor_origen: 'D2',
                nombre_contenedor_destino: 'D1',
                fecha: '08/12/2024',
                tipo: 'movimiento',
                volumen: 1000
            },
            children: [
                {
                    operation: {
                        nombre_contenedor_origen: 'D11',
                        nombre_contenedor_destino: 'D1',
                        fecha: '02/12/2024',
                        tipo: 'movimiento',
                        volumen: 1000
                    },
                    children: [
                        {
                            operation: {
                                nombre_contenedor_destino: 'D11',
                                fecha: '06/09/2024',
                                tipo: 'entrada',
                                volumen: 1000
                            },
                            children: []
                        }
                    ]
                }
            ]
        }
    ]
};

const testVarieties = new Map([
    ['Cabernet Sauvignon', 0.5],
    ['Merlot', 0.3],
    ['Syrah', 0.2]
]);

const testPlots = ['Villafranca', 'La Cuesta', 'El Pinar'];

$(document).ready(function() {
    setSearchType();
    setSearch();
    setOffset();
    chargeLocalTraze(testRootNode);
    chargePlots(testPlots);
    chargeVarieties(testVarieties);

    function setSearchType() {
        $('#searchType').on('change', function() {
            const searchType = $('#searchType').val();
            const idLabel = $('#idLabel');
            idLabel.text(searchType === 'Lote' ? 'ID Lote:' : 'ID Contenedor:');
        });
    }

    function setSearch() {
        $('#traze-search').on('click', function() {
            const searchType = $('#searchType').val();
            if (searchType === 'Contenedor') {
                // Show alert saying that the search is not available
                alert('La trazabilidad por contenedor aún no está disponible');
            } else {
                const lot = $('#searchValue').val();

                // AYAX petition to the server to get the operations
                const url = '/lot-traze';
                const data = { lot };
                $.ajax({
                    url,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(traze) {
                        chargePlots(traze.plots);
                        chargeVarieties(traze.varieties);
                        const rootNode = Node.fromArray(traze.root);
                        chargeTraze(rootNode);
                    },
                    error: function(xhr) {
                        const info = 'Failed to charge traze';
                        let title = 'Error';
                        let message = info;
                        if (xhr.responseJSON && xhr.responseJSON.text)
                            message = xhr.responseJSON.text;
                        showAlertModal(title, message);
                    }
                });
            }
        });
    }

    function chargePlots(plots) {
        const $plotSection = $('#plot-section')
        $plotSection.empty();
        // <li class="list-group-item">Villafranca</li>
        for (const plot of plots)
            $plotSection.append(`<li class="list-group-item">${plot}</li>`);
    }

    function chargeVarieties(varieties) {
        const $varietySection = $('#variety-section');
        $varietySection.empty();
        // Convert the Map to an array and sort by frequency in descending order
        const sortedVarieties = Array.from(varieties.entries()).sort((a, b) => b[1] - a[1]);
        for (const [variety, frequency] of sortedVarieties) {
            const percentage = (frequency * 100).toFixed(1);
            $varietySection.append(`<li class="list-group-item">${percentage}% ${variety}</li>`);
        }
    }

    function chargeTraze(rootNode) {
        function addOperation(operation) {
            let name = '';
            if (operation.tipo === 'entrada')
                name = `Entrada de ${operation.nombre_contenedor_destino}`;
            else if (operation.tipo === 'movimiento')
                name = `Movimiento de ${operation.nombre_contenedor_origen} a ${operation.nombre_contenedor_destino}`;
            else if (operation.tipo === 'salida')
                name = `Salida de ${operation.nombre_contenedor_origen}`;
            
            const formattedDate = new Date(operation.fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            $('#lot-section').append(`
                <div class="alert alert-warning">
                    <span>
                        <p class="d-inline">${name}</p>
                        <p class="d-inline">&nbsp;&nbsp; - &nbsp;&nbsp;</p>
                        <p class="d-inline">${operation.volumen} litros</p>
                        <p class="d-inline">&nbsp;&nbsp; - &nbsp;&nbsp;</p>
                        <p class="d-inline">${formattedDate}</p>
                    </span>
                </div>`
            );
        }

        $('#lot-section').empty();
        function addNode(node) {
            const operation = node.operation;
            addOperation(operation);
            const children = node.children;
            children.forEach(child => addNode(child));
        }
        addNode(rootNode);
        addIcons();
    }

    // Agregar iconos dinámicamente a las operaciones
    function addIcons() {
        $('#lot-section div span').each(function() {
            // First <p> span element
            const name = $(this).find('p').first();
            const text = name.text();
            let icon = '';
            if (text.includes('Entrada'))
                icon = '<i class="bi bi-box-arrow-in-down"></i> ';
            else if (text.includes('Movimiento'))
                icon = '<i class="bi bi-arrow-right"></i> ';
            else if (text.includes('Salida'))
                icon = '<i class="bi bi-truck"></i> ';
            name.before(`<p class="d-inline">${icon}</p>`);
        });
    }

    function setOffset() {
        function updateOffset() {
            if ($(window).width() < 767)
                $('#search-label').removeClass('offset-md-2');
            else
                $('#search-label').addClass('offset-md-2');
        }

        $(window).resize(updateOffset);
        updateOffset();
    }

    function chargeLocalTraze(rootNode) {
        function formatDate(date) {
            /* DEBUG: Check if the date is in the format 'dd/mm/yyyy' */
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(date.trim()))
                return date;

            return new Date(date).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        function createAlert(alertClass, text, volume, date) {
            function buildElement(string) {
                return `<p class="d-inline">${string}</p>`;
            }

            const separator = buildElement('&nbsp;&nbsp; - &nbsp;&nbsp;');
            const alertDiv = `
                <div class="alert ${alertClass}">
                    <span>
                        ${buildElement(text)}
                        ${separator}
                        ${buildElement(`${volume} litros`)}
                        ${separator}
                        ${buildElement(formatDate(date))}
                    </span>
                </div>`;
            return alertDiv;
        }
        function createExit(containerName, volume, date) {
            return createAlert('alert-warning', `Salida de ${containerName}`, volume, date);
        }

        function createMovement(depth, containerName1, containerName2, volume, date) {
            let alertClass = 'alert-secondary';
            if (depth % 2 === 0)
                alertClass = 'alert-info';
            return createAlert(alertClass, `Movimiento de ${containerName1} a ${containerName2}`, volume, date);
        }

        function createEntry(containerName, volume, date) {
            return createAlert('alert-success', `Entrada a ${containerName}`, volume, date);
        }

        function addOperation(operation, depth) {
            let alertDiv;
            if (operation.tipo === 'entrada')
                alertDiv = createEntry(operation.nombre_contenedor_destino, operation.volumen, operation.fecha);
            else if (operation.tipo === 'movimiento')
                alertDiv = createMovement(depth, operation.nombre_contenedor_origen, operation.nombre_contenedor_destino, operation.volumen, operation.fecha);
            else
                alertDiv = createExit(operation.nombre_contenedor_origen, operation.volumen, operation.fecha);
            // Add a left margin to the alert div as the depth
            alertDiv = $(alertDiv).css('margin-left', `${2 * depth}rem`);
            $('#lot-section').append(alertDiv);
        }

        function addNode(node, depth) {
            const operation = node.operation;
            addOperation(operation, depth);
            const children = node.children;
            children.forEach(child => addNode(child, depth + 1));
        }

        $('#lot-section').empty();
        addNode(rootNode, 0);
        addIcons();
    }
});