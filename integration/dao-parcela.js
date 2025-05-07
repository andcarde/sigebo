
// dao-parcelas.js
'use strict';

const DAOUtil = require('../utils/dao-utils');
const Parcela = require('../entities/parcela');

const tableName = 'parcelas'
const transform = Parcela.transform;

class DAOParcela {

    static insertParcela(parcela, callback) {
        const keys = Object.keys(parcela);
        const columns = keys.map(key => `\`${key}\``).join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        let query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
        const interrogation = keys.map(key => parcela[key]);
        DAOUtil.write(query, interrogation, callback);
    }

    static deleteParcela(id, callback) {
        let query = 'UPDATE `' + tableName + '` SET `active` = 0 WHERE `id` = ?;';
        const interrogation = [id];
        DAOUtil.write(query, interrogation, callback);
    }

    static readParcelaById(id, callback) {
        let query = 'SELECT * FROM `' + tableName + '` WHERE id = ? AND active = 1;';
        const interrogation = [id];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static readParcelaByNameAndBodega(name, idBodega, callback) {
        let query = 'SELECT * FROM `' + tableName + '` WHERE nombre = ? AND id_bodega = ? AND active = 1;';
        const interrogation = [name, idBodega];
        DAOUtil.readOne(query, interrogation, transform, callback);
    }

    static readParcelasByBodega(idBodega, callback) {
        let query = 'SELECT * FROM `' + tableName + '` WHERE id_bodega = ? AND active = 1;';
        const interrogation = [idBodega];
        DAOUtil.read(query, interrogation, transform, callback);
    }
}

module.exports = DAOParcela;