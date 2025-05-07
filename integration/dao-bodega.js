
// dao-usuarios.js
'use strict';

const DAOUtil = require('../utils/dao-utils');
const Bodega = require('../entities/bodega');

const tableName = 'bodegas'
const transform = Bodega.transform;

class DAOBodega {

    static insertBodega(usuario, callback) {
        let query = 'INSERT INTO `bodegas` (`nombre`, `administrador`) ';
        query += 'VALUES (?, ?) ';
        const interrogation = [usuario.nombre, usuario.administrador];
        DAOUtil.write(query, interrogation, callback);
    }

    static readBodega(id, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE id = ? AND active = 1;`;
        const interrogation = [id];
        DAOUtil.readOne(query, interrogation, transform, callback);
    }

    static readBodegasByAdministrador(administrator, callback) {
        let query = 'SELECT * FROM `' + tableName + '` WHERE administrador = ? AND active = 1;';
        const interrogation = [administrator];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static deleteBodega(idWinery, callback) {
        let query = `UPDATE \`${tableName}\` SET active = 0 WHERE id = ?;`;
        const interrogation = [idWinery];
        DAOUtil.write(query, interrogation, callback);
    }

    static readBodegasByNameAndOwner(name, administrator, callback) {
        let query = 'SELECT * FROM `' + tableName + '` WHERE nombre = ? AND administrador = ? AND active = 1;';
        const interrogation = [name, administrator];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static readBodegaByNameAndOwner(name, administrator, callback) {
        this.readBodegasByNameAndOwner(name, administrator, (error, winerys) => {
            DAOUtil.one(error, winerys, callback)
        });
    };
}

module.exports = DAOBodega;