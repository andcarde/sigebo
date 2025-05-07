
// dao-acceso.js
'use strict';

const DAOUtil = require('../utils/dao-utils');
const Acceso = require('../entities/acceso');
const Bodega = require('../entities/bodega');

const tableName = 'accesos';
const transform = Acceso.transform;
const bodegasTableName = 'bodegas';

class DAOAcceso {
    // Crear acceso
    static crearAcceso(idUsuario, idBodega, level, callback) {
        let query = `INSERT INTO ` + tableName + ` (id_usuario, id_bodega, level) VALUES (?, ?, ?)`;
        const interrogation = [idUsuario, idBodega, level];
        DAOUtil.write(query, interrogation, callback);
    }

    // Eliminar acceso (baja lógica)
    static deleteAcceso(idUsuario, idBodega, callback) {
        let query = `UPDATE \`${tableName}\` SET active = 0 WHERE id_usuario = ? AND id_bodega = ?`;
        const interrogation = [idUsuario, idBodega];
        DAOUtil.write(query, interrogation, callback);
    }

    // Modificar nivel de acceso
    static alterAccessLevel(idUsuario, idBodega, newLevel, callback) {
        let query = `UPDATE \`${tableName}\` SET level = ? WHERE id_usuario = ? AND id_bodega = ? AND active = 1`;
        const interrogation = [newLevel, idUsuario, idBodega, ];
        DAOUtil.write(query, interrogation, callback);
    }

    // Devolver las bodegas a las que tiene acceso un usuario
    static readBodegasByUsuario(idUsuario, callback) {
        let query = `
            SELECT ${bodegasTableName}.*
            FROM ${bodegasTableName} JOIN ${tableName}
            ON ${bodegasTableName}.id = ${tableName}.id_bodega
            WHERE ${tableName}.id_usuario = ? AND ${tableName}.active = 1
            AND ${bodegasTableName}.active = 1;
        `;
        const interrogation = [idUsuario];
        DAOUtil.read(query, interrogation, Bodega.transform, callback); 
    }

    // Mostrar todos los accesos dado un idBodega
    static readAccesosByBodega(idBodega, callback) {
        let query = `SELECT * FROM ${tableName} WHERE id_bodega = ? AND active = 1`;
        const interrogation = [idBodega];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static getAcceso(idUsuario, idBodega, callback) {
        let query = `SELECT * FROM ${tableName} WHERE id_usuario = ? AND id_bodega = ? AND active = 1`;
        const interrogation = [idUsuario, idBodega];
        DAOUtil.read(query, interrogation, transform, (error, accesos) => {
            DAOUtil.one(error, accesos, callback);
        });
    }
}

module.exports = DAOAcceso;