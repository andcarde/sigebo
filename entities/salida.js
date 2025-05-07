
// salida.js
'use strict';

const trySet = require('../utils/null-utils');

class Salida {
    constructor(param = {}) {
        this.id = trySet(param.id);
        this.nombre_lote = trySet(param.nombre_lote);
        this.id_bodega = trySet(param.id_bodega);
    }

    static transform(rows) {
        return rows.map(row => {
            return new Salida({
                id: row.id,
                nombre_lote: row.nombre_lote,
                id_bodega: row.id_bodega,
            });
        });
    }
}

module.exports = Salida;