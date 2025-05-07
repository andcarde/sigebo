
// validate_bottling.test.js
'use strict';

const { validateValues } = require('../utils/validation-utils');
const Tester = require('./tests.js');

function test1(errorCallback) {
    const body = {
        newBatchName: 'L20',
        originBatchName: 'L15',
        quantity: 100
    };

    if (!validateValues([
        [body.newBatchName, 'string(1,32)'],
        [body.originBatchName, 'string(1,32)'],
        [body.quantity, 'posint']
    ]))
        errorCallback(new Error('Incorrect validation'));
    else
        errorCallback(null);
}

const tester = new Tester();
tester.add(test1, 'Validate Bottling');
tester.run();