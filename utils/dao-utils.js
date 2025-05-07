
// dao-utils.js
'use strict';

const getConnection = require('../pool');

const sinConexionMessage = 'Database Error: Sin conexión a la base de datos';
const operacionFallidaMessage = 'Database Error: Operación fallida';
const objetoInvalidoMessage = 'Database Error: Operación fallida';

class DAOUtil {
    
    static write(query, interrogation, callback) {
        getConnection(function(err, connection) {
            if (err) {
                callback(new Error(sinConexionMessage));
            } else {
                connection.query(query, interrogation, function(queryErr, rows) {
                    connection.release();
                    if (queryErr) {
                        callback(new Error(operacionFallidaMessage));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

    static read(query, interrogation, transform, callback) {
        getConnection(function(error, connection) {
            if (error)
                callback(new Error(sinConexionMessage), null)
            else {
                connection.query(query, interrogation, (error, rows) => {
                    connection.release();
                    if (error || rows === undefined) {
                        callback(new Error(operacionFallidaMessage), null);
                    }
                    else if (Array.isArray(rows)) {
                        const instances = transform(rows);
                        callback(null, instances);
                    } else
                        callback(new Error(objetoInvalidoMessage), null);
                });
            }
        });
    }

    // Read all instances of a table including the active attribute
    static readAll(query, interrogation, transform, callback) {
        const transformMoreActive = (rows) => {
            const instances = transform(rows).map(instance => {
                const row = rows.find(row => row.id === instance.id);
                instance.active = !!row.active;
                return instance;
            });
            return instances;
        };
        DAOUtil.read(query, interrogation, transformMoreActive, callback);
    }

    static one(error, array, callback) {
        if (error)
            callback(error, null);
        else if (array.length === 0)
            callback(null, null);
        else
            callback(null, array[0]);
    }

    static readOneAttribute(query, interrogation, attribute, callback) {
        getConnection(function(error, connection) {
            if (error)
                callback(new Error(sinConexionMessage), null)
            else {
                connection.query(query, interrogation, (error, rows) => {
                    connection.release();
                    if (error || rows === undefined)
                        callback(new Error(operacionFallidaMessage), null);
                    else if (Array.isArray(rows)) {
                        callback(null, rows[0][attribute]);
                    } else
                        callback(new Error(objetoInvalidoMessage), null);
                });
            }
        });
    }

    static readOne(query, interrogation, transform, callback) {
        DAOUtil.read(query, interrogation, transform, 
            (error, instances) => DAOUtil.one(error, instances, callback)
        );
    }

    static readAllOne(query, interrogation, transform, callback) {
        DAOUtil.readAll(query, interrogation, transform, 
            (error, instances) => DAOUtil.one(error, instances, callback)
        );
    }
}

module.exports = DAOUtil;