
// contenedor.js
'use strict';

const trySet = require('../utils/null-utils');
const {isNull, isObject, validateObject} = require('../utils/validation-utils.js');
/* <DEBUG/> */ const superCreateLogger = require('../utils/debug-utils.js');
/* <DEBUG/> */ const createLogger = superCreateLogger('contenedor');

class Contenedor {

    constructor(param = {}) {
        this.id = trySet(param.id);
        this.nombre = trySet(param.nombre);
        this.id_lote = trySet(param.id_lote);
        this.nombre_lote = trySet(param.nombre_lote);
        this.volumen = trySet(param.volumen);
        this.max_volumen = trySet(param.max_volumen);
        this.id_bodega = trySet(param.id_bodega);
        this.tipo = trySet(param.tipo);
    }

    static validate(containersData) {
        /* <DEBUG/> */ const {logPosition, logElement} = createLogger('validate');
        /* <DEBUG/> */ logPosition(24);
        if (!isObject(containersData))
            return ['FormatError: containersData is not an object', null];
        let containers = [];
        let skeleton = {};
        
        const everMandatoryFields = ['capacity', 'type'];
        const singleMandatoryFields = ['name'];
        const multipleMandatoryFields = ['quantity', 'serie', 'firstIdNumber'];
        const optionalFields = ['baseDiameter', 'purchaseDate', 'vendor', 'manufacturer', 'manufacturerDate'];
        const isSingle = Object.keys(containersData).includes('name');
        const sometimesMandatoryFields = isSingle ? singleMandatoryFields : multipleMandatoryFields;
        const mandatoryFields = everMandatoryFields.concat(sometimesMandatoryFields);
        const allFields = optionalFields.concat(mandatoryFields);
        const types = new Map();
        types.set('capacity', 'posint');
        types.set('type', 'string');
        types.set('name', 'string');
        types.set('quantity', 'posint');
        types.set('serie', 'string');
        types.set('firstIdNumber', 'posint');
        types.set('baseDiameter', 'posnum(2)');
        types.set('purchaseDate', 'pastdate');
        types.set('vendor', 'string');
        types.set('manufacturer', 'string');
        types.set('manufacturerDate', 'pastdate');
        /* <DEBUG/> */ logPosition(52);

        if (validateObject(containersData, allFields, types))
            return ['FormatError: containersData fields are not valid', null];
        /* <DEBUG/> */ logElement(58, containersData, 'containersData');
        
        for (let field of mandatoryFields) {
            if (isNull(containersData[field]))
                return [`FormatError: Missing mandatory field: ${field}`, null];
        }
        /* <DEBUG/> */ logPosition(72);
        everMandatoryFields.forEach((field) => {
            skeleton[field] = containersData[field]
        });
        optionalFields.forEach((field) => {
            if (!isNull(containersData[field]))
                skeleton[field] = containersData[field]
        });
        /* <DEBUG/> */ logPosition(76);
        if (isSingle) {
            const name = containersData['name'];
            containers.push(createContainer(name, skeleton));
        } else {
            const quantity = containersData['quantity'];
            const serie =  containersData['serie'];
            const firstIdNumber = parseInt(containersData['firstIdNumber'], 10);
            for (let i = 0; i < quantity; i++) {
                // name : string
                const name = `${serie}${firstIdNumber + i}`;
                containers.push(createContainer(name, skeleton));
            }
        }
        /* <DEBUG/> */ logPosition(90);
        return [null, containers];
    }

    static transform(rows) {
        return rows.map(row => {
            const contenedor = new Contenedor({
                id: row.id,
                nombre: row.nombre,
                id_lote: row.id_lote,
                nombre_lote: row.nombre_lote,
                volumen: row.volumen,
                max_volumen: row.max_volumen,
                id_bodega: row.id_bodega,
                tipo: row.tipo,
            });
            return contenedor;
        });
    }
}

function createContainer(name, skeleton) {
    let container = {
        name: name
    };
    Object.keys(skeleton).forEach((key) => {
        container[key] = skeleton[key]
    });
    return container;
}


module.exports = Contenedor;