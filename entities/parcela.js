
// parcela.js
'use strict';

const trySet = require('../utils/null-utils');

class Parcela {

    constructor(param = {}) {
        this.id = trySet(param.id);
        this.nombre = trySet(param.nombre);
        this.superficie = trySet(param.superficie);
    }

    static transform(rows) {
        return rows.map(row => {
            return new Parcela({
                id: row.id,
                nombre: row.nombre,
                superficie: row.superficie,
            });
        });
    }
}

module.exports = Parcela;