
// nuevo_usuario.js
'use strict';

const Controller = require('../business/controller');
const Usuario = require('../integration/usuario');

const user = new Usuario({
    correo: 'tom@gmail.com',
    contrasena: '1234',
    nombre: 'Tom',
    apellido1: 'García',
    apellido2: 'Venegas'
});

Controller.createUsuario(user, (error) => {
    if (error)
        console.log(error);
    else
        console.log('Usuario creado correctamente');
});