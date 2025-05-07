
// dao-variedades.js
'use strict';

const DAOUtil = require('../utils/dao-utils');
const Variedad = require('../entities/variedad');

const tableName = 'variedades'
const transform = Variedad.transform;

class DAOVariedad {

    static insertVariedad(instance, callback) {
        const keys = Object.keys(instance);
        const columns = keys.map(key => `\`${key}\``).join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        let query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
        const interrogation = keys.map(key => instance[key]);
        DAOUtil.write(query, interrogation, callback);
    }

    static deleteVariedad(id, callback) {
        let query = 'UPDATE `' + tableName + '` SET `active` = 0 WHERE `id` = ?;';
        const interrogation = [id];
        DAOUtil.write(query, interrogation, callback);
    }

    static readVariedadById(id, callback) {
        let query = 'SELECT * FROM `' + tableName + '` WHERE id = ? AND active = 1;';
        const interrogation = [id];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static readVariedadByName(name, callback) {
        let query = 'SELECT * FROM `' + tableName + '` WHERE nombre = ? AND active = 1;';
        const interrogation = [name];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static readVariedades(callback) {
        let query = 'SELECT * FROM `' + tableName + '` WHERE active = 1;';
        const interrogation = [];
        DAOUtil.read(query, interrogation, transform, callback);
    }
}

module.exports = DAOVariedad;