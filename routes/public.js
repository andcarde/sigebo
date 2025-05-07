
// public.js
'use strict';

const express = require('express');
const router = express.Router();
const Controller = require('../business/controller');
const Usuario = require('../entities/usuario');

const configuration = require('../config');
const debugMode = configuration.debugMode;

const path = require('path');

/* <DEBUG/> */ const superCreateLogger = require('../utils/debug-utils.js');
/* <DEBUG/> */ const createLogger = superCreateLogger('public');

// Ruta de inicio. Se redirige a la página de login
router.get('/', function (request, response) {
    if (request.session === null) {
        response.redirect('/login');
    }
    else {
        response.redirect('/inventario');
    }
});

// Ruta de registro
router.get('/registro', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'registro.html'));
});
router.post('/registro', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'registro.html'));
});

// Petición de creación de usuarios
router.post('/crear-usuario', (request, response) => {
    /* <DEBUG/> */ const {logElement} = createLogger('/crear-usuario');

    // Obtención de los datos de la solicitud
    const user = new Usuario({
        email: request.body.email,
        password: request.body.password,
        name: request.body.forename,
        surname1: request.body.surname1,
        surname2: request.body.surname2
    });

    /* <DEBUG/> */ logElement(48, request.body, 'Request Body');
    /* <DEBUG/> */ logElement(49, user, 'Usuario');

    Controller.createUsuario(user, (error) => {
        if (error)
            response.status(500).json({ text: error.message });
        else
            response.status(201).json({
                title: 'Registro Completado',
                message: 'Se ha registrado satisfactoriamente. ¡Nos vemos en la aplicación!.'
            });
    });
});

// Ruta para el login
router.get('/login', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Ruta de creación de sessión
router.post('/crear-sesion', (request, response) => {
    const correo = request.body.email;
    const contrasena = request.body.password;

    // usuario : Usuario with 'active' field
    Controller.isLoginCorrect(correo, contrasena, (error, usuario) => {
        if (error)
            response.status(530).json({ title: 'Problema técnico', message: 'Se ha producido un error en el servidor. Pruebe más tarde.' });
        else if (usuario === null)
            response.status(530).json({ title: 'Login incorrecto', message: 'La contraseña no se corresponde con el usuario proporcionado.' });
        else if (!usuario.active)
            response.status(530).json({ title: 'Cuenta eliminada', message: 'Su cuenta ha sido eliminada.' });
        else {
            request.session.usuario = usuario;
            response.status(200).json({ redirectUrl: '/inventario' });
        }
    });
});

module.exports = router;