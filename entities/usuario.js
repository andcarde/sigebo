
// usuario.js
'use strict';

// Definición de la entidad Usuario
// Usuario {
//     id: int(10),
//     email: varchar(32),
//     password: varchar(32),
//     name: varchar(32),
//     surname1: varchar(32),
//     surname2: varchar(32)
//     active: tinyint(1)
// }

const trySet = require('../utils/null-utils');

class Usuario {

    constructor(param = {}) {
        this.id = trySet(param.id);
        this.email = trySet(param.email);
        this.password = trySet(param.password);
        this.name = trySet(param.name);
        this.surname1 = trySet(param.surname1);
        this.surname2 = trySet(param.surname2);
        this.active = trySet(param.active);
    }

    static transform(rows) {
        return rows.map(row => {
            return new Usuario({
                id: row.id,
                email: row.email,
                password: row.password,
                name: row.name,
                surname1: row.surname1,
                surname2: row.surname2,
                active: row.active,
            });
        });
    }
}

module.exports = Usuario;