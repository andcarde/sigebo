
// login.js
'use strict';

// import showAlertModal function from './modal-error.js'
// import log from './log-utils.js'

$(document).ready(() => {
    const $petition = $('#login-btn');
    const $email = $('#email');
    const $password = $('#password');
    
    setPetitionButton();
    tryShowError();

    function setPetitionButton() {
        $petition.on('click', function() {
            const email = $email.val();
            const password = $password.val();
            const data = { email, password };
            login(data)
        });
    }
    
    function login(data) {
        const url = '/crear-sesion';
        $.ajax({
            method: 'POST',
            url: url,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                window.location.href = response.redirectUrl;
            },
            error: function (error) {
                const title = error.responseJSON.title;
                const message = error.responseJSON.message;
                // <DEBUG>
                log(title, 'title');
                log(message, 'message');
                // </DEBUG>
                showAlertModal(title, message);
            }
        });
    }

    function tryShowError() {
        const errorCookie = $.cookie('error');
        if (errorCookie) {
            const error = JSON.parse(errorCookie);
            // Using jQuery Cookie to remove the cookie
            $.removeCookie('error', { path: '/' });
            // Show error message in a modal
            showAlertModal(error.title, error.message);
        }
    }
});