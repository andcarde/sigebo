
// bodega.js
'use strict';

const trySet = require('../utils/null-utils');
/* <DEBUG/> */ const superCreateLogger = require('../utils/debug-utils.js');
/* <DEBUG/> */ const createLogger = superCreateLogger('bodega');

class Bodega {

    constructor(param = {}) {
        this.id = trySet(param.id);
        this.nombre = trySet(param.nombre);
        this.administrador = trySet(param.administrador);
    }

    // <DEPRECATED>
    // log() {
    //     const className = this.constructor.name;
    //     log(this, className);
    // }
    // </DEPRECATED>

    static transform(rows) {
        /* <DEBUG/> */ const {logElement} = createLogger('transform');
        /* <DEBUG/> */ logElement(26, rows, `rows(length: ${rows.length})`);

        return rows.map(row => {
            return new Bodega({
                id: row.id,
                nombre: row.nombre,
                administrador: row.administrador,
            });
        });
    }
}

module.exports = Bodega;