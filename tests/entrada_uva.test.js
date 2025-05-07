
// entrada_uva.test.js
'use strict';

const DAOParcelas = require('../integration/dao-parcela');
const Controller = require('../business/controller');
const superCreateLogger = require('../utils/debug-utils.js');
const createLogger = superCreateLogger('entrada-uva.test');
const Tester = require('./tests.js');

const parcela = 'La Cañada';

const test1 = (errorCallback) => {
    const {logElement} = createLogger('test1');
    DAOParcelas.readParcelaByName(parcela, (error, parcela) => {
        if (!error)
            logElement(16, parcela, 'parcela');
        return errorCallback(error);
    });
}

const test2 = (errorCallback) => {
    const grapeVarieties = new Map();
    grapeVarieties.set('Albillo', 700);
    grapeVarieties.set('Maturana', 300);

    const lote = {
        nombre: 'L2025/1',
        parcela: parcela,
        variedades: grapeVarieties,
    };
    const idBodega = 1;
    const depositName = 'A1';

    Controller.createGrapeEntry(idBodega, lote, depositName, errorCallback);
};

const tester = new Tester();
tester.add(test1, 'Read Plot');
tester.add(test2, 'Grape Entry');
tester.run();