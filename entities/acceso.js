
// acceso.js
'use strict';

const trySet = require('../utils/null-utils');

class Acceso {

    constructor(param = {}) {
        this.id = trySet(param.id);
        this.nombre = trySet(param.nombre);
        this.administrador = trySet(param.administrador);
    }

    static transform(rows) {
        return rows.map(row => {
            return new Acceso({
                id: row.id,
                nombre: row.nombre,
                administrador: row.administrador,
            });
        });
    }
}

module.exports = Acceso;