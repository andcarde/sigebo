
// dao-operacion.js
'use strict';

const DAOUtil = require('../utils/dao-utils.js');
const Operacion = require('../entities/operacion.js');

const tableName = 'operaciones';
const transform = Operacion.transform;

class DAOOperacion {

    static insertOperacion(instance, callback) {
        const keys = Object.keys(instance);
        const columns = keys.map(key => `\`${key}\``).join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        let query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
        const interrogation = keys.map(key => instance[key]);
        DAOUtil.write(query, interrogation, callback);
    }

    static readOperacionByBodega(idBodega, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE id_bodega = ?;`;
        const interrogation = [idBodega];
        DAOUtil.read(query, interrogation, transform, callback);
    }
}

module.exports = DAOOperacion;