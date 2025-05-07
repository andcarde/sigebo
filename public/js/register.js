
// register.js
'use strict';

// import showAlertModal function from './modal-error.js'

$(document).ready(() =>{
    $("#register-btn").on("click", () => {
        const user = buildUser();
        if (user)
            requestRegistration(user);
    });
    $("#toggle-password").on("click", togglePassword);
});

function buildUser() {
    const forename = $("#forename").val();
    const surname1 = $("#surname1").val();
    let surname2 = $("#surname2").val();
    const email = $("#email").val();
    const password = $("#password").val();

    // Si 'surname2' está vacío, se asigna un valor nulo
    if (isEmpty(surname2))
        surname2 = null;

    if (!validateForm(forename, surname1, surname2, email, password))
        return null;

    const user = {
        forename: forename,
        surname1: surname1,
        surname2: surname2,
        email: email,
        password: password
    };

    return user;
}

function requestRegistration(user) {
    // Make the petition to the server
    $.ajax({
        type: "POST",
        url: "/crear-usuario",
        data: JSON.stringify(user),
        contentType: "application/json", 
        processData: false,
        success: function (response) {
            showAlertModal(response.title, response.message);
        },
        error: function (error) {
            const DEFAULT_ERROR_TEXT = "Ha ocurrido un error, intente registrarse de nuevo más tarde";
            const text = (() => {
                if (error && error.responseJSON && error.responseJSON.text)
                    return error.responseJSON.text;
                else
                    return DEFAULT_ERROR_TEXT
            })()
            showAlertModal("Problema Técnico", text);
        }
    });
}


// Validate the form fields
function validateForm(nombre, apellido1, apellido2, correo, contrasena) {
    // Validar nombre
    if (isEmpty(nombre)) {
        showAlertModal("Error", "El campo 'Nombre' no puede estar vacío");
        return false;
    }

    if (!isSpacedAlphabeticString(nombre)) {
        showAlertModal("Error", "El campo 'Nombre' solo puede contener letras y no debe haber espacios");
        return false;
    }

    // Validar primer apellido
    if (isEmpty(apellido1)) {
        showAlertModal("Error", "El campo 'Primer Apellido' no puede estar vacío");
        return false;
    }

    if (!isValidAlphabeticString(apellido1)) {
        showAlertModal("Error", "El campo 'Primer Apellido' solo puede contener letras y no debe haber espacios");
        return false;
    }

    // Validar segundo apellido
    if (!isEmpty(apellido2)) {
        if (!isValidAlphabeticString(apellido2)) {
            showAlertModal("Error", "El campo 'Segundo Apellido' solo puede contener letras y no debe haber espacios");
            return false;
        }
    }

    // Validar correo
    if (isEmpty(correo)) {
        showAlertModal("Error", "El campo 'Correo Electrónico' no puede estar vacío");
        return false;
    }

    if (!isValidEmail(correo)) {
        showAlertModal("Error", "El campo 'Correo Electrónico' debe ser un correo");
        return false;
    }

    // Validar contraseña
    if (isEmpty(contrasena)) {
        showAlertModal("Error", "El campo 'Contraseña' no puede estar vacío");
        return false;
    }

    if (contrasena.length < 6) {
        showAlertModal("Error", "La contraseña debe tener al menos 6 caracteres");
        return false;
    }

    return true;  // Retorna true si no hay errores de validación
}

function isValidAlphabeticString(value) {
    // Expresión regular para validar que la cadena solo contenga letras y no haya espacios
    const alphabeticStringRegex = /^[A-Za-zÀ-ÿ]+$/;
    return alphabeticStringRegex.test(value);
}

// Devuelve 'true' si la cadena solo contiene letras y como máximo un espacio entre palabras,
// y 'false' en caso contrario
function isSpacedAlphabeticString(value) {
    const alphabeticStringRegex = /^[A-Za-zÀ-ÿ]+( [A-Za-zÀ-ÿ]+)*$/;
    return alphabeticStringRegex.test(value);
}

function isValidEmail(email) {
    // Expresión regular para validar que el correo sea de formato @<servidor>.<direccion_nacional>
    const ucmEmailRegex = /^[^\s]+@[^\s]+\.[^\s]+$/;
    return ucmEmailRegex.test(email);
}

function isValidNumber(value) {
    // Expresión regular para validar que el valor sea un número
    const numberRegex = /^[0-9]+$/;
    return numberRegex.test(value);
}

function isValidSingleLetter(value) {
    // Expresión regular para validar que el valor sea una sola letra
    const singleLetterRegex = /^[A-Za-zÀ-ÿ]$/;
    return singleLetterRegex.test(value);
}

function isEmpty(value) {
    return value == null || value.trim() === '';
}

function togglePassword() {
    const password = $("#password");
    const togglePasswordIcon = $("#toggle-password");

    const type = password.attr("type") === "password" ? "text" : "password";
    password.attr("type", type);

    if (togglePasswordIcon.hasClass("bi-eye-slash")) {
        togglePasswordIcon.removeClass("bi-eye-slash");
        togglePasswordIcon.addClass("bi-eye");
    } else {
        togglePasswordIcon.removeClass("bi-eye");
        togglePasswordIcon.addClass("bi-eye-slash");
    }
}