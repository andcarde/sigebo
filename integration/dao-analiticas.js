
// dao-analiticas.js
'use strict';

const DAOUtil = require('../utils/dao-utils');
const Analitica = require('../entities/analitica.js');

const tableName = 'analiticas'
const transform = Analitica.transform;

class DAOAnalitica {

    static insertAnalitica(instance, callback) {
        const keys = Object.keys(instance);
        const columns = keys.map(key => `\`${key}\``).join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        let query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
        const interrogation = keys.map(key => instance[key]);
        DAOUtil.write(query, interrogation, callback);
    }

    static deleteAnalitica(id, callback) {
        let query = `UPDATE \`${tableName}\` SET active = 0 WHERE id = ?;`;
        const interrogation = [id];
        DAOUtil.write(query, interrogation, callback);
    }

    static readAnaliticasByLote(batchId, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE id_lote = ? AND active = 1;`;
        const interrogation = [batchId];
        DAOUtil.read(query, interrogation, transform, callback);
    }
}

module.exports = DAOAnalitica;