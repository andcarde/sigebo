
// entrada-uva.js
'use strict';

// import log, logError functions from './log-utils.js'
// import chargeContainers function from './inventario.js'

// Parcela : { name : string, area : number, id : string }
// parcelas : array<Parcela>
let parcelas = null;
// variedades : array<string>
let variedades = null;

// Variable para almacenar el valor anterior
let previousValue = null;

// variedadesSeleccionadas : Set<string>
// Array que almacenará las variedades seleccionadas
let variedadesSeleccionadas = null;

$(document).ready(() => {
    const $modal = $('#entrada-uva-modal');

    // Mostrar el modal al hacer clic en el botón de nueva entrada de uva
    $('#nueva-entrada-btn').on('click', () => {
        inicializarModal();
    });

    setEntradaUvaButton();

    $(document).on('focus', '.variedad-select', function() {
        // Almacenar el valor actual al recibir el foco
        previousValue = $(this).val();
    });

    function configurarCantidadInput() {
        $(document).on('input change', '.cantidad-input', function () {
            // Obtener el valor actual y eliminar caracteres no numéricos
            let valor = $(this).val().replace(/[^0-9]/g, '');
    
            // Convertir el valor a número para la validación
            let cantidad = parseInt(valor, 10);
    
            // Si el valor es 0 o vacío
            if (isNaN(cantidad) || cantidad <= 0) {
                // Limpiar el campo para mostrar el placeholder
                $(this).val('');
            } else {
                // Actualizar el campo con la cantidad
                $(this).val(cantidad);
            }
        });
    }

    // Configuración inicial del modal
    function inicializarModal() {
        cargarParcelas((data) => {
            parcelas = data;
            variedades = cargarVariedades();
            variedadesSeleccionadas = new Set();

            // Cargar parcelas y variedades en los selectores, incluyendo la opción de vacío
            cargarOpcionesSelector('#selector-parcela', parcelas.map(p => p.nombre), true);
            cargarOpcionesSelector('#selector-variedad', variedades, true);

            // Restablecer campos
            $('#entry-name').val('');
            $('#entry-deposit').val('');
            $('#parcela-detalles').text('');

            // Configurar eventos de cambio
            $('#entry-name').on('input', verificarCampos);
            $('#entry-deposit').on('input', verificarCampos);
            $('#selector-parcela').on('change', actualizarDetallesParcela);

            // Limpiar secciones de variedades adicionales
            $('#variedades-container').empty();
            agregarParVariedadCantidad();

            // Configurar el botón de confirmar
            $('#nueva-entrada-uva-confirmar').prop('disabled', true);

            $(document).on('change', '.variedad-select', function() {
                // Obtener el nuevo valor del selector modificado
                const currentValue = $(this).val(); 

                if (currentValue !== previousValue) {
                    const changedSelector = $(this);
                
                    // Si no se ha seleccionado la opción vacía,
                    // eliminar del resto de selectores la variedad seleccionada
                    if (currentValue !== '') {
                        variedadesSeleccionadas.add(currentValue);

                        // Eliminar la opción seleccionada
                        $('.variedad-select').each(function() {
                            const selector = $(this);
                            
                            if (!selector.is(changedSelector))
                                selector.find(`option[value="${currentValue}"]`).remove();
                        });
                    }
                    
                    // Si la opción anterior no era vacía, agregarla al resto de selectores
                    if (previousValue !== '') {
                        variedadesSeleccionadas.delete(previousValue);

                        // Agregar la opción deseleccionada
                        $('.variedad-select').each(function() {
                            const selector = $(this);

                            // Comprueba si no es el selector modificado y si la opción previa no existe
                            if (!selector.is(changedSelector) && selector.find(`option[value="${previousValue}"]`).length === 0)
                                selector.append(`<option value="${previousValue}">${previousValue}</option>`);
                        });
                    }

                    // Actualizar el valor anterior para el próximo cambio
                    previousValue = currentValue;

                    intentarAgregarNuevoPar();
                }
            });

            configurarCantidadInput();
            $modal.show();
        });
    }

    // Cargar opciones en un selector
    function cargarOpcionesSelector(selectorId, opciones, incluirVacio = false) {
        const selector = $(selectorId);
        selector.empty();
        if (incluirVacio)
            selector.append('<option value="">Vacío</option>');
        opciones.forEach(opcion => {
            selector.append(`<option value="${opcion}">${opcion}</option>`);
        });
    }

    // Actualizar los detalles de la parcela (superficie e ID) según el selector
    function actualizarDetallesParcela() {
        const parcelaSeleccionada = $('#selector-parcela').val();
        const parcela = parcelas.find(p => p.nombre === parcelaSeleccionada);
        
        if (parcela) {
            $('#parcela-detalles').text(`Superficie: ${parcela.superficie}m²   ID: ${parcela.id}`);
        } else {
            $('#parcela-detalles').text('');
        }

        verificarCampos(); // Verificar si se debe habilitar el botón de confirmar
    }

    // Agregar un par de entrada de variedad y cantidad
    function agregarParVariedadCantidad() {
        // Crear un nuevo selector de variedades sin las ya seleccionadas
        const opcionesVariedades = variedades.filter(variedad => !variedadesSeleccionadas.has(variedad))
                .map(variedad => `<option value="${variedad}">${variedad}</option>`).join('');
        
        const nuevaFila = $(`
            <div class="row mb-3 variedad-cantidad-par">
                <div class="col-6 mx-auto">
                    <input type="number" class="form-control text-center cantidad-input" placeholder="Cantidad (kg)">
                </div>
                <div class="col-6 mx-auto">
                    <select class="form-select variedad-select">
                        <option value="">Vacío</option>
                        ${opcionesVariedades}
                    </select>
                </div>
            </div>
        `);
        
        $('#variedades-container').append(nuevaFila);

        // Asignar eventos de cambio a los nuevos campos
        nuevaFila.find('.cantidad-input').on('input', verificarCampos);
        nuevaFila.find('.variedad-select').on('change', verificarCampos);
    }

    // Verificar los campos para habilitar el botón de confirmar
    function verificarCampos() {
        const name = $('#entry-name').val();
        const deposito = $('#entry-deposit').val();
        const parcela = $('#selector-parcela').val();
        const paresValidos = $('.variedad-cantidad-par').toArray().some(par => {
            const cantidad = $(par).find('.cantidad-input').val();
            const variedad = $(par).find('.variedad-select').val();
            return cantidad && variedad;
        });
        const paresIncompletos = $('.variedad-cantidad-par').toArray().some(par => {
            const cantidad = $(par).find('.cantidad-input').val();
            const variedad = $(par).find('.variedad-select').val();
            return (!cantidad && variedad) || (!variedad && cantidad);
        });

        const debeDesactivar = !name || !deposito || !parcela || !paresValidos || paresIncompletos;
        // Habilitar el botón de confirmar si hay una parcela seleccionada y al menos un par válido
        $('#nueva-entrada-uva-confirmar').prop('disabled', debeDesactivar);
    }

    // Restablecer el modal al cancelar
    $('#nueva-entrada-uva-cancelar').on('click', () => {
        $('#entrada-uva-modal').hide();
    });

    // Evento de añadir un nuevo par de variedad y cantidad
    $(document).on('input change', '.cantidad-input', intentarAgregarNuevoPar);

    function intentarAgregarNuevoPar() {
        if (variedades.length > variedadesSeleccionadas.size) {
            // todosParesLlenos : boolean
            const todosParesLlenos = $('.variedad-cantidad-par').toArray().every(par => {
                // cantidad : string
                const cantidad = $(par).find('.cantidad-input').val();
                // variedad : string
                const variedad = $(par).find('.variedad-select').val();
                return cantidad && variedad;
            });

            // Agregar un nuevo par si todos los actuales están llenos
            if (todosParesLlenos) {
                agregarParVariedadCantidad();
            }
        }
    }

    function setEntradaUvaButton() {
        $('#nueva-entrada-uva-confirmar').on('click', confirmarEntradaUva);
    }
    
    // Función para enviar la entrada de uva
    function confirmarEntradaUva() {
        // nombre : string
        const nombre = $('#entry-name').val();
        // deposito : string
        const deposito = $('#entry-deposit').val();
        // parcela : string
        const parcela = $('#selector-parcela').val();
        // variedades : map<string, int>
        let variedades = new Map();
        $('.variedad-cantidad-par').toArray().forEach(par => {
            // cantidad : int
            const cantidad = parseInt($(par).find('.cantidad-input').val(), 10);
            // variedad : string
            const variedad = $(par).find('.variedad-select').val();
            if (!isNaN(cantidad) && variedad)
                variedades.set(variedad, cantidad);
        });
        // variedades : array<array<string, int>>
        variedades = Array.from(variedades);
    
        const entrada = { nombre, deposito, parcela, variedades };
        pedirEntradaUva(entrada);
    }
    
    // Función para enviar la entrada de uva al servidor
    function pedirEntradaUva(entrada) {
        // Petición AJAX para enviar la entrada de uva
        const url = '/entrada-uva';
        $.ajax({
            method: 'POST',
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(entrada),
            success: function(data) {
                $modal.modal('hide');
                chargeContainers();
            },
            error: function(xhr) {
                $modal.modal('hide');
    
                const info = 'Failed to process the entry of grapes';
                logError(info, url, xhr)
            }
        });
    }
});

// Funciones de carga simulada
function cargarParcelas(callback) {
    const url = '/get-plots';
    $.ajax({
        method: 'POST',
        url,
        success: function(data) {
            return callback(data);
        },
        error: function(xhr) {
            $modal.modal('hide');
            const info = 'Failed to retrieve the plots';
            logError(info, url, xhr);
        }
    });
}

function cargarVariedades() {
    return ['Albillo', 'Tempranillo', 'Maturana'];
}