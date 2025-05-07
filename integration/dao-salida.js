
// dao-salida.js
'use strict';

const DAOUtil = require('../utils/dao-utils.js');
const Salida = require('../entities/salida.js');

const tableName = 'salidas';
const transform = Salida.transform;

class DAOSalida {

    static insertSalida(instance, callback) {
        const keys = Object.keys(instance);
        const columns = keys.map(key => `\`${key}\``).join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        let query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
        const interrogation = keys.map(key => instance[key]);
        DAOUtil.write(query, interrogation, callback);
    }

    static readSalidaByBodegaAndLote(idBodega, nombreLote, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE id_bodega = ? AND nombre_lote = ?;`;
        const interrogation = [idBodega, nombreLote];
        DAOUtil.read(query, interrogation, transform, callback);
    }
}

module.exports = DAOSalida;