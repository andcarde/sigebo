
// lote.js
'use strict';

// Definición de la entidad Lote
// Lote {
//     id: int(11),
//     nombre: varchar(32),
//     variedades: varchar(256),
//     volumen: int(10)
// }

const Variedad = require('./variedad');
const trySet = require('../utils/null-utils');
/* <DEBUG/> */ const superCreateLogger = require('../utils/debug-utils.js');
/* <DEBUG/> */ const createLogger = superCreateLogger('lote');

class Lote {
    
    constructor(param = {}) {
        this.id = trySet(param.id);
        this.nombre = trySet(param.nombre);
        this.parcela = trySet(param.parcela);
        this.variedades = trySet(param.variedades);
        this.volumen = trySet(param.volumen);
        this.bodega_id = trySet(param.bodega_id);
        this.contenedor = trySet(param.contenedor);
    }

    static transform(rows) {
        /* <DEBUG/> */ const {logElement} = createLogger('transform');
        return rows.map(row => {
            logElement(31, row.variedades, 'row.variedades');
            return new Lote({
                id: row.id,
                nombre: row.nombre,
                parcela: row.parcela,
                variedades: row.variedades,
                volumen: row.volumen,
                bodega_id: row.bodega_id,
                contenedor: row.contenedor
            });
        });
    }
}

module.exports = Lote;