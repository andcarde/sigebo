
// validation-utils.js
'use strict';

function isNull(variable) {
    return variable === undefined || variable === null;
}

function isObject(variable) {
    return !isNull(variable) && typeof variable === 'object';
}

function validate(variable, type) {
    if (type === 'string')
        return isString(variable);
    else if (type.startsWith('string(')) {
        const params = type.match(/\d+/g).map(Number);
        if (params.length === 1)
            return isString(variable, params[0]);
        else if (params.length === 2)
            return isString(variable, params[0], params[1]);
    } else if (type === 'posint')
        return isPositiveInteger(variable);
    else if (type === 'posnum')
        return isPositiveNumber(variable);
    else if (type.startsWith('posnum(')) {
        const params = type.match(/\d+/g).map(Number);
        if (params.length === 1)
            return isPositiveNumber(variable, params[0]);
        else
            return false;
    } else if (type === 'pastdate')
        return isPastDate(variable);     
    else if (type === 'array')
        return Array.isArray(variable);
    else if (type.match(/^array<.+>\(\d+\)$/)) {
        const [innerType, length] = type.match(/^array<(.+)>\((\d+)\)$/).slice(1, 3);
        return Array.isArray(variable) && variable.length === Number(length)
            && variable.every(element => validate(element, innerType));
    } else if (type.startsWith('array<')) {
        const innerType = type.match(/array<(.+)>/)[1];
        return Array.isArray(variable) && variable.every(element => validate(element, innerType));
    } else if (type.startsWith('array(')) {
        const params = type.match(/\d+/g).map(Number);
        if (params.length === 1)
            return Array.isArray(variable) && variable.length === params[0];
    }
    return false;
}

function validateObject(object, variables, types) {
    for (let variable of variables) {
        const type = types.get(variable);
        if (Object.keys(object).includes(variable))
            if (!type || !validate(object[variable], type))
                return false;
    };
    return true;
}

function validateValues(pairs) {
    for (let [value, type] of pairs) {
        if (!type || !validate(value, type))
            return false;
    };
    return true;
}

// Validate that variable is a positive integer
function isPositiveInteger(variable) {
    return (!isNull(variable)
        && typeof variable === 'number'
        && Number.isInteger(variable)
        && variable > 0
    );
}

// Validate that variable is a positive number with a maximum number of decimals
function isPositiveNumber(variable, maxDecimals = Infinity) {
    if (isNull(variable) || typeof variable !== 'number' || variable <= 0)
        return false;
    const decimalPart = variable.toString().split('.')[1];
    return !decimalPart || decimalPart.length <= maxDecimals;
}

function isString(variable, minLength = 0, maxLength = Infinity) {
    return !isNull(variable)
        && typeof variable === 'string'
        && variable.length >= minLength
        && variable.length <= maxLength;
}

function isPastDate(variable) {
    if (isNull(variable)) return false;
    const date = new Date(variable);
    const now = new Date();
    return !isNaN(date.getTime()) && date <= now;
}

module.exports = {isNull, isObject, validateObject, validateValues};