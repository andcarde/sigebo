
// log-utils.js
'use strict';

function buildPosition(file, _function, line) {
    return `${file}.js ln. ${line} ${_function}`;
}

function logPosition(file, _function, line) {
    console.log(`> ${buildPosition(file, _function, line)}`);
}

function logMessage(file, _function, line, message) {
    console.log(`> ${message} (${buildPosition(file, _function, line)})`);
}

function logElement(file, _function, line, object, name='') {
    logPosition(file, _function, line);
    console.log(stringify(object, 0, true, name));
}

function tabulation(level) {
    let string = '';
    for (let i = 0; i < level; i++)
        string += '\t';
    return string;
}

function stringify(object, level=0, first=true, name='') {
    const nextLevel = level + 1;

    let string = '';
    if (first)
        string += tabulation(level);
    if (name)
        string += name + ': ';
    
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
    // Si el objeto es una función, imprime 'function'
    if (typeof object === 'function')
        return string + 'function';
    // Si el objeto es un símbolo, imprime 'symbol'
    if (typeof object === 'symbol')
        return string + 'symbol';
    // Si el objeto no es un objeto, imprime 'unknown'
    if (typeof object !== 'object')
        return string + 'unknown';
    // Si el objeto es un array, imprime los elementos del array
    if (Array.isArray(object)) {
        string += `Array {`;
        for (let i = 0; i < object.length; i++)
            string += '\n' + stringify(object[i], nextLevel, true, `Element ${i}`) + ',';
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
    const className = object.constructor ? object.constructor.name : 'Object';
    string += `${className} {`;
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

// Use example:
// /* <DEBUG/> */ const {logPosition, logMessage, logElement} = require('../utils/log-utils');
// /* <DEBUG/> */ logElement('bodega', 'transform', 24, rows, `rows(length: ${rows.length})`);
// <DEBUG>
// logMessage('controller', 'isLoginCorrect', 303, 'Intento de login fallido');
// if (usuario === null)
//     console.log('    - El correo no corresponde a ningún usuario');
// else
//     console.log(`    - Las contraseñas no coinciden: ${usuario.password} != ${contrasena}`);
// </DEBUG>

module.exports = {
    logPosition,
    logMessage,
    logElement,
    stringify
}