
// null-utils.js
'use strict';

// Check if a variable is null or undefined.
function trySet(variable, getValue=() => variable) {
    return (variable === null || variable === undefined) ? null : getValue();
}

module.exports = trySet;