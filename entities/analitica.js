
// analitica.js
'use strict';

// Definición de la entidad Analitica
// Analitica {
//     id: int(11),
//     valores: varchar(128),
//     fecha: date,
//     id_lote: int(11),
// }

const trySet = require('../utils/null-utils');

class Analitica {
    
    constructor(param = {}) {
        this.id = trySet(param.id);
        this.valores = trySet(param.valores);
        this.fecha = trySet(param.fecha);
        this.id_lote = trySet(param.id_lote);
    }

    static codify(measurements) {
        let encodedString = '';
        measurements.forEach(measurement => {
            // measurement: [metric, quantity]
            encodedString += `${measurement[0]}:${measurement[1]},`;
        });
        encodedString = encodedString.slice(0, -1);
        return encodedString;
    }

    static decodify(encodedString) {
        let decodedArray = [];
        const pairs = encodedString.split(',');
        pairs.forEach(pair => {
            const [key, value] = pair.split(':');
            decodedArray.push([key, value]);
        });
        return decodedArray;
    }

    static transform(rows) {
        return rows.map(row => {
            return new Analitica({
                id: row.id,
                valores: Analitica.decodify(row.valores),
                fecha: row.fecha,
                id_lote: row.id_lote,
            });
        });
    }
}

module.exports = Analitica;