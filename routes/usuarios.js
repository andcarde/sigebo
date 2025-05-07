
// usuarios.js
'use strict';

const express = require('express');
const path = require('path');
const router = express.Router();
const Controller = require('../business/controller');
const Contenedor = require('../entities/contenedor');
const Lote = require('../entities/lote');
const Variedad = require('../entities/variedad');
const Bodega = require('../entities/bodega');
const Analitica = require('../entities/analitica');
const { validateValues } = require('../utils/validation-utils');
/* <DEBUG/> */ const superCreateLogger = require('../utils/debug-utils.js');
/* <DEBUG/> */ const createLogger = superCreateLogger('usuarios');

const moveError = new Error('Error al mover el vino. Pruebe más tarde.');

router.get('/inventario', (request, response) => {
    if (!request.session.idBodega)
        return response.redirect('/bodegas');
    else
        response.status(200).sendFile(path.join(__dirname, '..', 'public', 'inventario.html'));
});

router.get('/bodegas', (request, response) => {
    response.status(200).sendFile(path.join(__dirname, '..', 'public', 'bodegas.html'));
});

router.get('/parcelas', (request, response) => {
    if (!request.session.idBodega)
        return response.redirect('/bodegas');
    else
        response.status(200).sendFile(path.join(__dirname, '..', 'public', 'parcelas.html'));
});

router.post('/get-containers', (request, response) => {
    checkBodegaSession(request, response, () => {
        const idBodega = request.session.idBodega;
        Controller.getContainers(idBodega, (error, containers) => {
            if (error)
                response.status(500).json({ text: error.message });
            else
                Controller.getBatches(idBodega, (error, batches) => {
                    if (error)
                        response.status(500).json({ text: error.message });
                    else
                        response.status(200).json({ containers, batches });
                });
        });
    });
});

function checkBodegaSession(request, response, callback) {
    if (!request.session.idBodega)
        return response.redirect('/bodegas');
    return callback();
}

router.post('/create-containers', (request, response) => {
    /* <DEBUG/> */ const {logPosition, logMessage, logElement} = createLogger('/create-containers');
    /* <DEBUG/> */ logMessage(69, 'Creando contenedores');
    checkBodegaSession(request, response, () => {
        /* <DEBUG/> */ logPosition(71);
        const [error, containers] = Contenedor.validate(request.body);
        /* <DEBUG/> */ logElement(73, error, 'error');
        /* <DEBUG/> */ logElement(74, containers, 'containers');
        if (error)
            return response.status(400).json({ text: error });
        const idBodega = request.session.idBodega;
        for (let container of containers)
            container.idBodega = idBodega;
        /* <DEBUG/> */ logPosition(80);
        createContainers(containers, (error) => {
            if (error)
                return response.status(500).json({ text: error.message });
            else
                return response.status(200).send();
        });
    });
});

function createContainers(containers, callback) {
    /* <DEBUG/> */ const {logPosition} = createLogger('createContainers');
    /* <DEBUG/> */ logPosition(92);
    if (containers.length === 0)
        return callback(null);
    else {
        const container = containers.pop();
        const contenedor = new Contenedor({
            nombre: container.name,
            max_volumen: container.capacity,
            id_bodega: container.idBodega,
            tipo: container.type
        });
        return Controller.createContainer(contenedor, (error) => {
            if (error)
                return callback(error);
            else
                return createContainers(containers, callback);
        });
    }
}

router.post('/select-bodega', (request, response) => {
    checkAccess(request, response, () => {
        const idBodega = request.body.idBodega;
        request.session.idBodega = idBodega;
        response.status(200).send();
    });
});

function checkAccess(request, response, callback) {
    const idUsuario = request.session.usuario.id;
    const idBodega = request.body.idBodega;
    const errorCallback = (error) => response.status(500).json({ text: error.message });
    Controller.checkAccess(idUsuario, idBodega, errorCallback, callback);
}

router.post('/get-bodegas', (request, response) => {
    const idUsuario = request.session.usuario.id;
    Controller.getBodegas(idUsuario, (error, bodegas) => {
        if (error)
            response.status(500).json({ text: error.message });
        else
            response.status(200).json(bodegas);
    });
});

router.post('/get-analytics', (request, response) => {
    /* <DEBUG/> */ const {logElement} = createLogger('/get-analytics');
    const batchName = request.body.batchName;
    /* <DEBUG/> */ logElement(129, batchName, 'batchName');
    if (!validateValues([[batchName, 'string(1,32)']]))
        return response.status(400).json({ text: 'Datos inválidos' });
    Controller.getAnalytics(batchName, (error, analytics) => {
        if (error)
            response.status(500).json({ text: error.message });
        else {
            /* <DEBUG/> */ logElement(136, analytics, 'analytics');
            response.status(200).json(analytics);
        }
    });
});

router.post('/get-plots', (request, response) => {
    checkBodegaSession(request, response, () => {
        const idBodega = request.session.idBodega;
        Controller.getPlots(idBodega, (error, plots) => {
            if (error)
                response.status(500).json({ text: error.message });
            else
                response.status(200).json(plots);
        });
    });
});

router.post('/create-analytic', (request, response) => {
    /* <DEBUG/> */ const {logElement} = createLogger('/create-analytic');
    const batchName = request.body.batchName;
    const values = request.body.values;
    const date = request.body.date;

    if (!validateValues([
        [batchName, 'string(1,32)'],
        [values, 'array<array(2)>'],
        [date, 'pastdate']
    ]))
        return response.status(400).json({ text: 'Datos inválidos' });

    values.forEach(value => {
        if (!validateValues([
            // Name of the metric
            [value[0], 'string(1,32)'],
            // Quantity of the metric
            [value[1], 'posnum(4)']
        ]))
            return response.status(400).json({ text: 'Datos inválidos' });
    });

    const analytic = new Analitica({
        valores: Analitica.codify(values),
        fecha: date,
    });

    Controller.createAnalytic(batchName, analytic, (error) => {
        if (error)
            response.status(500).json({ text: error.message });
        else
            response.status(200).send();
    });
});

router.post('/create-winery', (request, response) => {
    /* <DEBUG/> */ const {logElement} = createLogger('/create-winery');
    if (!validateValues([[request.body.name, 'string(1,32)']]))
        return response.status(400).json({ text: 'Datos inválidos' });

    const winery = new Bodega({
        nombre: request.body.name,
        administrador: request.session.usuario.id
    });
    /* <DEBUG/> */ logElement(136, request.session.usuario, 'user');

    Controller.createWinery(winery, (error) => {
        if (error)
            response.status(500).json({ text: error.message });
        else
            response.status(200).send();
    });
});

router.post('/delete-winery', (request, response) => {
    const idUser = request.session.usuario.id;
    const idBodega = request.body.idBodega;
    /* <DEBUG/> */ console.log('idBodega:', idBodega);
    /* <DEBUG/> */ console.log('idUser:', idUser);
    checkAccess(request, response, () => {
        Controller.deleteBodega(idBodega, idUser, (error) => {
            if (error)
                response.status(500).json({ text: error.message });
            else
                response.status(200).send();
        });
    });
});

router.post('/move-empty', (request, response) => {
    const destinationBatchName = request.body.destinationBatchName;
    if (!validateValues([[destinationBatchName, 'string(1,32)']]))
        return response.status(400).json({ text: 'Datos inválidos' });
    
    moveWine(request, response, destinationBatchName);
});

router.post('/move-partial', (request, response) => {
    moveWine(request, response, null);
});

function moveWine(request, response, destinationBatchName) {
    /* <DEBUG/> */ const {logPosition} = createLogger('moveWine');
    /* <DEBUG/> */ logPosition(151);
    if (!validateMoveWine(request))
        return response.status(400).json({ text: 'Datos inválidos' });
    /* <DEBUG/> */ logPosition(154);

    const idUsuario = request.session.usuario.id;
    const idBodega = request.session.idBodega;
    const origen = request.body.origen;
    const destino = request.body.destino;
    const quantity = request.body.quantity;

    const callback = (error) => {
        if (error)
            response.status(500).json({ text: error.message });
        else {
            /* <DEBUG/> */ logPosition(164);
            response.status(200).send();
        }
    };
    /* <DEBUG/> */ logPosition(168);
    if (destinationBatchName)
        Controller.moveWineToEmptyContainer(idUsuario, idBodega, origen, destino, quantity, destinationBatchName, callback);
    else
        Controller.moveWineToPartialContainer(idUsuario, idBodega, origen, destino, quantity, callback);
}

function validateMoveWine(request) {
    /* <DEBUG/> */ const {logPosition} = createLogger('validateMoveWine');
    /* <DEBUG/> */ logPosition(178);
    return validateValues([
        [request.body.origen, 'string(1,32)'],
        [request.body.destino, 'string(1,32)'],
        [request.body.quantity, 'posint']])
        && request.body.origen !== request.body.destino;
}

router.post('/bottling', (request, response) => {
    /* <DEBUG/> */ const {logElement} = createLogger('bottling');
    /* <DEBUG/> */ logElement(263, request.body, 'request.body');

    if (!validateValues([
        [request.body.batchName, 'string(1,32)'],
        [request.body.originContainerName, 'string(1,32)'],
        [request.body.quantity, 'posint']
    ]))
        return response.status(400).json({ text: 'Datos inválidos' });

    const idUsuario = request.session.usuario.id;
    const idBodega = request.session.idBodega;
    const newBatchName = request.body.batchName;
    const originContainerName = request.body.originContainerName;
    const quantity = request.body.quantity;

    Controller.bottling(idUsuario, idBodega, originContainerName, quantity, newBatchName, (error) => {
        if (error)
            response.status(500).json({ text: error.message });
        else
            response.status(200).send();
    });
});

router.post('/outlet', (request, response) => {
    /* <DEBUG/> */ const {logElement} = createLogger('outlet');
    /* <DEBUG/> */ logElement(263, request.body, 'request.body');
    if (!validateValues([
        [request.body.batchName, 'string(1,32)'],
        [request.body.quantity, 'posint']
    ]))
        return response.status(400).json({ text: 'Datos inválidos' });

    const idUsuario = request.session.usuario.id;
    const idBodega = request.session.idBodega;
    const originBatchName = request.body.batchName;
    const quantity = request.body.quantity;

    Controller.outWine(idUsuario, idBodega, originBatchName, quantity, (error) => {
        if (error)
            response.status(500).json({ text: error.message });
        else
            response.status(200).send();
    });
});

router.get('/trazabilidad', (request, response) => {
    /* <DEBUG/> */ const {logElement} = createLogger('/trazabilidad');
    /* <DEBUG/> */ logElement(313, request.body, 'request.body');
    if (!request.session.idBodega)
        return response.redirect('/bodegas');
    else
        response.status(200).sendFile(path.join(__dirname, '..', 'public', 'trazabilidad.html'));
});

router.post('/lot-traze', (request, response) => {
    const idBodega = request.session.idBodega;
    const lot = request.body.lot;
    Controller.getTraze(idBodega, lot, (error, traze) => {
        if (error)
            response.status(400).json({ text: error.message });
        else
            response.status(200).json(traze);
    });
});

router.post('/entrada-uva', (request, response) => {
    /* <DEBUG/> */ const {logElement} = createLogger('/entrada-uva');
    if (!validateEntradaUva(request))
        return response.status(400).json({ text: 'Datos inválidos' });

    const idUsuario = request.session.usuario.id;
    const idBodega = request.session.idBodega;
    const depositName = request.body.deposito;
    const name = request.body.nombre;
    const plot = request.body.parcela;
    const volume = Variedad.getVolumen(request.body.variedades);
    const grapeVarieties = Variedad.codify(request.body.variedades);

    const lote = new Lote({
        nombre: name,
        parcela: plot,
        variedades: grapeVarieties,
        volumen: volume,
        bodega_id: idBodega,
        contenedor: depositName
    });

    Controller.createGrapeEntry(idUsuario, idBodega, lote, depositName, (error) => {
        if (error)
            response.status(500).json({ text: error.message });
        else
            response.status(200).send();
    });
});

// validateEntradaUva
function validateEntradaUva(request) {
    /* <DEBUG/> */ const {logMessage} = createLogger('validateEntradaUva');
    const name = request.body.nombre;
    const deposit = request.body.deposito;
    const plot = request.body.parcela;
    const grapeVarieties = request.body.variedades;
    
    // Validate that name is a string and has at most 32 characters
    if (!name || typeof name !== 'string' || name.length === 0 || name.length > 32) {
        /* <DEBUG/> */ logMessage(218, 'Client Error: Invalid field name');
        return false;
    }
    // Validate that plot is a string and has at most 32 characters
    if (!plot || typeof plot !== 'string' || plot.length === 0 || plot.length > 32) {
        /* <DEBUG/> */ logMessage(223, 'Client Error: Invalid field plot');
        return false;
    }
    // Validate that deposit is a string and has at most 32 characters
    if (!deposit || typeof deposit !== 'string' || deposit.length === 0 || deposit.length > 32) {
        /* <DEBUG/> */ logMessage(228, 'Client Error: Invalid field deposit');
        return false;
    }
    // Validate grapeVarieties
    return validateGrapeVarietiesMap(grapeVarieties);    
}

function validateGrapeVarietiesMap(grapeVarieties) {
    /* <DEBUG/> */ const {logMessage} = createLogger('validateGrapeVarietiesMap');
    // Validate that grapeVarieties exists
    if (!grapeVarieties) {
        /* <DEBUG/> */ logMessage(239, 'Client Error: Missing required field grapeVarieties');
        return false;
    }
    try {
        // Convert grapeVarieties to a Map
        grapeVarieties = new Map(grapeVarieties);
    } catch (error) {
        /* <DEBUG/> */ logMessage(246, 'Client Error: While converting field grapeVarieties to Map');
        return false;
    }

    // Validate that grapeVarieties is an object
    if (typeof grapeVarieties !== 'object') {
        /* <DEBUG/> */ logMessage(252, 'Client Error: Field grapeVarieties is not an object');
        return false;
    }
    // Validate that grapeVarieties is instance of Map
    if (!(grapeVarieties instanceof Map)) {
        /* <DEBUG/> */ logMessage(257, 'Client Error: Field grapeVarieties is not an instance of Map');
        return false;
    }
    // Validate that grapeVarieties is not empty
    if (grapeVarieties.size === 0) {
        /* <DEBUG/> */ logMessage(262, 'Client Error: Field grapeVarieties is empty');
        return false;
    }

    const INT11_MAX_VALUE = 2147483647;
    
    for (const [grapeVariety, quantity] of grapeVarieties) {
        // Validate that grapeVariety is a string with at most 32 characters
        if (typeof grapeVariety !== 'string' || grapeVariety.length === 0 || grapeVariety.length > 32) {
            /* <DEBUG/> */ logMessage(271, 'Client Error: Invalid subfield grapeVariety');
            return false;
        }
        // Validate that quantity is a positive integer
        if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0 || quantity > INT11_MAX_VALUE) {
            /* <DEBUG/> */ logMessage(276, 'Client Error: Invalid subfield quantity');
            return false;
        }
    };

    return true;
}

// · Función alternativa para validar variedades cuando vienen en un objeto
// function validateGrapeVarietiesObject(grapeVarieties) {
//     // Validate that grapeVarieties is an object 
//     if (typeof grapeVarieties !== 'object')
//         return false;

//     // With strings as keys and positive integers as values
//     return Object.entries(grapeVarieties).every(([grapeVariety, quantity]) => {
//         // Validate that grapeVariety is a string with at most 32 characters
//         if (!(typeof grapeVariety === 'string' && grapeVariety.length > 0 && grapeVariety <= 32))
//             return false;
//         // Validate that quantity is a positive integer
//         if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0)
//             return false;
//         return true;
//     });
// }

module.exports = router;