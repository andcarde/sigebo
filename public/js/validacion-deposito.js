
// validacion-deposito.js
'use strict';

$(document).ready(function () {
    const form = $('#nuevoDepositoForm');
    const añadirButton = $('#añadirButton');
    const cancelarButton = $('#cancelarButton');

    // Campos
    const capacidadField = $('#capacidad');
    const tipoField = $('#tipo');
    const diametroBaseField = $('#diametroBase');

    // Validar entrada en tiempo real para el campo Capacidad
    capacidadField.on('keypress', function (e) {
        const char = String.fromCharCode(e.which);

        // Permitir solo números y limitar a 8 dígitos
        if (!/^[0-9]$/.test(char) || $(this).val().length >= 8) {
            e.preventDefault();
        }
    });

    diametroBaseField.on('input', function () {
        let value = $(this).val();
        const cursorPosition = this.selectionStart;
    
        const thereIsPoint = value.includes('.');
    
        // Separar por el punto si existe
        let parts = value.split('.');
    
        // Validar la parte antes del punto (máximo 4 dígitos)
        if (parts[0].length > 4) {
            parts[0] = parts[0].slice(0, 4);
        }
    
        // Validar la parte después del punto (máximo 2 dígitos)
        if (parts.length > 1 && parts[1].length > 2) {
            parts[1] = parts[1].slice(0, 2);
        }
    
        // Reconstruir el valor validado
        let newValue = parts[0]; // Usamos `let` para permitir modificaciones
        if (thereIsPoint) {
            newValue += '.';
            if (parts.length > 1) {
                newValue += parts[1];
            }
        }
    
        // Validar caracteres no numéricos y punto repetido (extra validación al final)
        if (!/^\d*\.?\d*$/.test(value)) {
            newValue = newValue.replace(/[^0-9.]/g, ''); // Eliminar caracteres inválidos
            newValue = newValue.replace(/\.+/g, '.'); // Asegurar que haya como máximo un punto
        }
    
        // Actualizar el campo con el nuevo valor validado
        $(this).val(newValue);
    
        // Restaurar posición del cursor para que no salte
        if (cursorPosition <= newValue.length) {
            this.setSelectionRange(cursorPosition, cursorPosition);
        } else {
            this.setSelectionRange(newValue.length, newValue.length);
        }
    });

    // Restringir entrada a dígitos y un único punto
    diametroBaseField.on('keypress', function (e) {
        const char = String.fromCharCode(e.which);
        const value = $(this).val();

        // Permitir solo dígitos y un único punto
        if (!/^[0-9.]$/.test(char)) {
            e.preventDefault();
        } else if (char === '.' && value.includes('.')) {
            // Evitar introducir más de un punto
            e.preventDefault();
        }
    });

    // Validar el formulario
    const validateForm = () => {
        const isCapacidadValid = capacidadField.val().trim() !== '';
        const isTipoValid = tipoField.val().trim() !== '';

        capacidadField.toggleClass('is-invalid', !isCapacidadValid);
        tipoField.toggleClass('is-invalid', !isTipoValid);

        añadirButton.prop('disabled', !(isCapacidadValid && isTipoValid));
    };

    // Evento: Validar campos obligatorios en tiempo real
    capacidadField.on('input', validateForm);
    tipoField.on('input', validateForm);

    // Evento: Limpiar campos al cancelar
    cancelarButton.on('click', function () {
        form[0].reset(); // Reiniciar el formulario
        añadirButton.prop('disabled', true); // Deshabilitar botón Añadir

        // Quitar mensajes de error
        capacidadField.removeClass('is-invalid');
        tipoField.removeClass('is-invalid');
        diametroBaseField.removeClass('is-invalid');
    });
});