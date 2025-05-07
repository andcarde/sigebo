
// dao-usuarios.js
'use strict';

const DAOUtil = require('../utils/dao-utils');
const Usuario = require('../entities/usuario');

const tableName = 'usuarios'
const transform = Usuario.transform

class DAOUsuario {

    static insertUsuario(usuario, callback) {
        let query = `INSERT INTO ${tableName} (email, password, name, surname, surname2) `;
        query += 'VALUES (?, ?, ?, ?, ?) ';
        const interrogation = [
            usuario.correo, usuario.contrasena, usuario.nombre, usuario.apellido1, usuario.apellido2
        ];
        DAOUtil.write(query, interrogation, callback);
    }
    
    static deleteUsuario(idUsuario, callback) {
        let query = `UPDATE ${tableName} SET active = 0 WHERE id = ?;`;
        const interrogation = [idUsuario];
        DAOUtil.write(query, interrogation, callback);
    }

    static readUsuarios(callback) {
        let query = `SELECT * FROM ${tableName} WHERE active = 1;`;
        const interrogation = [];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static readUsuarioById(idUsuario, callback) {
        let query = `SELECT * FROM ${tableName} WHERE idUsuario = ? AND active = 1;`;
        const interrogation = [idUsuario];
        DAOUtil.readOne(query, interrogation, transform, callback);
    }

    static readAllUsuarioByEmail(email, callback) {
        let query = `SELECT * FROM ${tableName} WHERE email = ?`;
        const interrogation = [email];
        DAOUtil.readAllOne(query, interrogation, transform, callback);
    }
}

module.exports = DAOUsuario;