
// parcelas.js
'use strict';

const PAGE = 'parcelas';

let parcelas = [];
let variedades = [];

$(document).ready(function() {
    // Realiza la petición AJAX para obtener los datos de las parcelas
    $.ajax({
        url: '/get-parcelas',
        method: 'GET',
        success: function(data) {
            parcelas = data;
            cargarParcelas(parcelas);
        },
        error: function(error) {
            console.error('Error al obtener las parcelas:', error);
        }
    });

    function cargarParcelas(parcelas) {
        const vinas = $('#viñas');
        // Limpia el contenido existente
        vinas.empty(); 

        const groupButton = $('<button>Abrir</button>');
        const resumenButton = $('<button>Resumen</button>');

        const plotActions = $('<div class="plot-actions"></div>');
        const nuevaEntradaButton = $('<button>Nueva Entrada</button>');
        const modificarButton = $('<button>Modificar</button>');
        const estadisticasButton = $('<button>Estadísticas</button>');
        plotActions.append(nuevaEntradaButton, modificarButton, estadisticasButton);

        parcelas.forEach(function(grupo) {
            let groupHeader = $('<div class="group-header"></div>');
            const groupTitle = $('<h2>Grupo: ' + grupo.nombre + '</h2>');

            groupHeader.append(groupButton, groupTitle, resumenButton);
            vinas.append(groupHeader);

            grupo.parcelas.forEach(function(parcela) {
                let ul = $('<ul>Viña: ' + parcela.nombre + '</ul>');
                ul.append(plotActions);
                vinas.append(ul);
            });
        });
    }
});

function actualizarVariedades() {
    $.ajax({
        url: '/get-variedades',
        method: 'GET',
        success: function(data) {
            variedades = data;
        },
        error: function(error) {
            console.error('Error al obtener las variedades:', error);
        }
    });
}

class Parcela {
    // unsigned int id;
    id;
    // string(32) nombre;
    nombre;
    // map<string(32), unsigned int> variedadesCantidad;
    variedadesCantidad;
    Parcela(id, nombre, variedadesCantidad) {
        this.id = id;
        this.nombre = nombre;
        this.variedadesCantidad = variedadesCantidad;
    }
}

// Modificar el modal parcela para que tenga campos dinámicos de pares variedad-cantidad
function cargarModalParcela(parcela) {
    const modal = $('#modal-parcela');
    const modalTitle = modal.find('.modal-title');
    const modalBody = modal.find('.modal-body');
    const modalFooter = modal.find('.modal-footer');

    modalTitle.text('Modificar Parcela: ' + parcela.nombre);

    // Limpia el contenido existente
    modalBody.empty();

    // Crea los campos de variedad y cantidad
    parcela.variedadesCantidad.forEach(function(variedad, cantidad) {
        const div = $('<div class="form-group"></div>');
        const label = $('<label for="' + variedad + '">Variedad</label>');
        const input = $('<input type="text" class="form-control" id="' + variedad + '" value="' + cantidad + '">');
        div.append(label, input);
        modalBody.append(div);
    });

    // Crea el botón de guardar
    const guardarButton = $('<button type="button" class="btn btn-primary">Guardar</button>');
    modalFooter.append(guardarButton);
}