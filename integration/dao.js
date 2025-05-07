
// dao.js
'use strict';

const DAOUtil = require('../utils/dao-utils');

class DAO {

    static init(callback) {
        let query = 'BEGIN TRANSACTION;';
        const interrogation = [];
        DAOUtil.write(query, interrogation, callback);
    }

    static savepoint(point, callback) {
        let query = `SAVEPOINT ${point};`;
        const interrogation = [point];
        DAOUtil.write(query, interrogation, callback);
    }

    static rollback(point, callback) {
        let query = `ROLLBACK TO SAVEPOINT ${point};`;
        const interrogation = [point];
        DAOUtil.read(query, interrogation, callback);
    }

    static end(callback) {
        let query = 'COMMIT;';
        const interrogation = [];
        DAOUtil.write(query, interrogation, callback);
    }
}

module.exports = DAO;