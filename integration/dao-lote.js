
// dao-lotes.js
'use strict';

const DAOUtil = require('../utils/dao-utils');
const Lote = require('../entities/lote');

const tableName = 'lotes'
const transform = Lote.transform;

class DAOLote {

    static insertLote(instance, callback) {
        const keys = Object.keys(instance);
        const columns = keys.map(key => `\`${key}\``).join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        let query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
        const interrogation = keys.map(key => instance[key]);
        DAOUtil.write(query, interrogation, callback);
    }

    static deleteLote(id, callback) {
        let query = `UPDATE \`${tableName}\` SET active = 0 WHERE id = ?;`;
        const interrogation = [id];
        DAOUtil.write(query, interrogation, callback);
    }

    static readLoteById(id, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE id = ? AND active = 1;`;
        const interrogation = [id];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static readLoteByName(name, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE nombre = ? AND active = 1;`;
        const interrogation = [name];
        DAOUtil.readOne(query, interrogation, transform, callback);
    }

    static readLotes(callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE active = 1;`;
        const interrogation = [];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static readLotesByBodega(idBodega, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE bodega_id = ? AND active = 1;`;
        const interrogation = [idBodega];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static alterVolumen(id, volumen, callback) {
        let query = `UPDATE \`${tableName}\` SET volumen = ? WHERE id = ? AND active = 1;`;
        const interrogation = [volumen, id];
        DAOUtil.write(query, interrogation, callback);
    }
}

module.exports = DAOLote;