
// log-utils.js
'use strict';

function log(object, name='') {
    console.log(stringify(object, 0, true, name));
}

function stringify(object, level=0, first=true, name='') {
    let string = '';
    if (first)
        string += tabulation(level);
    if (name)
        string += name + ': ';

    const DEPTH_LIMIT = 10;
    if (level > DEPTH_LIMIT)
        return string + '<Depth Limit Reached>';
    
    // · Tipos primitivos

    // Si el objeto es nulo, imprime 'null'
    if (object === null)
        return string + 'null';

    // Si el objeto es indefinido, imprime 'undefined'
    if (object === undefined)
        return string + 'undefined';

    // Si el objeto es un número, imprime el número
    if (typeof object === 'number')
        return string + object.toString();

    // Si el objeto es un string, imprime el string
    if (typeof object === 'string')
        return string + object;

    // Si el objeto es un booleano, imprime 'true' o 'false'
    if (typeof object === 'boolean')
        return string + (object ? 'true' : 'false');

    // · Tipos derivados
    const nextLevel = level + 1;

    // Si el objeto es un array, imprime los elementos del array
    if (Array.isArray(object)) {
        string += `Array {`;
        for (let i = 0; i < object.length; i++)
            string += '\n' + stringify(object[i], `Element ${i}`, nextLevel) + ',';
        if (object.length > 0)
            string = string.slice(0, -1);
        return string + '\n' + tabulation(level) + '}';
    }

    // Si el objeto es un Map, imprime sus pares clave-valor
    if (object instanceof Map) {
        string += `Map {`;
        for (const [key, value] of object) {
            string += '\n' + stringify(key, nextLevel) + ': ';
            string += stringify(value, nextLevel, false) + ',';
        }
        if (object.size > 0)
            string = string.slice(0, -1);
        return string + '\n' + tabulation(level) + '}';
    }

    // Si el objeto es un Set, imprime sus elementos
    if (object instanceof Set) {
        string += `Set {`;
        for (const value of object)
            string += '\n' + stringify(value, nextLevel) + ',';
        if (object.size > 0)
            string = string.slice(0, -1);
        return string + '\n' + tabulation(level) + '}';
    }

    // Si el objeto es un objeto estándar, imprime las propiedades del objeto
    string += `Object {`;
    for (let key in object) {
        if (object[key] != null) {
            string += '\n' + stringify(key, nextLevel) + ': ';
            let string2 = '';
            if (key === 'foto')
                string2 = '<photo>'
            else
                string2 = object[key]
            string += stringify(string2, nextLevel, false);
            string += ',';
        }
    }
    if (Object.keys(object).length > 0)
        string = string.slice(0, -1);
    return string + '\n' + tabulation(level) + '}';
}

function tabulation(level) {
    let string = '';
    for (let i = 0; i < level; i++) {
        string += '\t';
    }
    return string;
}

function logError(info, url, xhr) {
    const reason = (xhr.responseJSON && xhr.responseJSON.text) ?
        xhr.responseJSON.text : 'Unknown';
    const message = `Error: ${info}`
        + `\n- On: Request '${url}'`
        + `\n- Reason: ${reason}`;
    console.error(message);
}

// exports log, logError functions