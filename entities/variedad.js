
// variedad.js
'use strict';

const trySet = require('../utils/null-utils');

class Variedad {

    constructor(param = {}) {
        this.id = trySet(param.id);
        this.nombre = trySet(param.nombre);
    }

    // Transforma un Map con formato Variedades en string
    static codify(map) {
        let string = '';
        for (const [key, value] of map)
            string += `${key}:${value},`;
        string = string.slice(0, -1);
        return string;
    }

    // Calculate the volumen given a grapeVarieties Map class
    static getVolumen(map) {
        let volumen = 0;
        for (const [key, value] of map) {
            volumen += parseInt(value);
        }
        return volumen; 
    }

    // Transforma un string con formato Variedades en Map
    static decodify(string) {
        let map = new Map();
        let array = string.split(',');
        array.forEach(element => {
            const [key, value] = element.split(':');
            map.set(key, value);
        });
        return map;
    }

    static transform(rows) {
        return rows.map(row => {
            return new Variedad({
                id: row.id,
                nombre: row.nombre
            });
        });
    }
}

module.exports = Variedad;