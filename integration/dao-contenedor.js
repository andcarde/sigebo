
// dao-contenedores.js
'use strict';

const DAOUtil = require('../utils/dao-utils');
const Contenedor = require('../entities/contenedor');

const tableName = 'contenedores'
const transform = Contenedor.transform;

class DAOContenedor {

    static insertContenedor(instance, callback) {
        const keys = Object.keys(instance);
        const columns = keys.map(key => `\`${key}\``).join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        let query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
        const interrogation = keys.map(key => instance[key]);
        DAOUtil.write(query, interrogation, callback);
    }

    static deleteContenedor(id, callback) {
        let query = `UPDATE \`${tableName}\` SET active = 0 WHERE id = ?;`;
        const interrogation = [id];
        DAOUtil.write(query, interrogation, callback);
    }

    static alterLote(id, lote, callback) {
        if (lote === null)
            lote = { id: null, nombre: null, volumen: null };
        let query = `UPDATE \`${tableName}\` SET id_lote = ?, nombre_lote = ?, volumen = ? WHERE id = ? AND active = 1;`;
        const interrogation = [lote.id, lote.nombre, lote.volumen, id];
        DAOUtil.write(query, interrogation, callback);
    }

    static readContenedorById(id, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE id = ? AND active = 1;`;
        const interrogation = [id];
        DAOUtil.readOne(query, interrogation, transform, callback);
    }

    static readContenedoresByBodega(idBodega, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE id_bodega = ? AND active = 1;`;
        const interrogation = [ idBodega ];
        DAOUtil.read(query, interrogation, transform, callback);
    }

    static readContenedorByName(name, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE nombre = ? AND active = 1;`;
        const interrogation = [name];
        DAOUtil.readOne(query, interrogation, transform, callback);
    }

    static readContenedorByNameAndBodega(name, idBodega, callback) {
        let query = `SELECT * FROM \`${tableName}\` WHERE nombre = ? AND id_bodega = ? AND active = 1;`;
        const interrogation = [name, idBodega];
        DAOUtil.readOne(query, interrogation, transform, callback);
    }
}

module.exports = DAOContenedor;