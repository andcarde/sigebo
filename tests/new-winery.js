
// nueva_bodega.test.js
'use strict';

const test_name = 'New Winery'
const Controller = require('../business/controller');
const Bodega = require('../entities/bodega');
const {stringify} = require('../utils/log-utils');

const bodega = new Bodega({
    nombre: 'Juan Carlos',
    administrador: 1
});

console.log('Test iniciado');

Controller.createWinery(bodega,
    (error) => {
        if (error) {
            console.log(`Error en Test ${test_name}. \n- ${error}`);
        } else {
            console.log('Test Correcto. Bodega insertada correctamente');
            Controller.readBodegaByNameAndOwner(bodega.nombre, bodega.administrador,
                (error, returned_bodega) => {
                    if (error)
                        console.log(`Error en Test ${test_name}. \n- ${error}`);
                    else if (returned_bodega === null) {
                        console.log(`Error en Test ${test_name}`);
                        console.log('- Error: No se ha retornado ninguna bodega');
                    }
                    else if (returned_bodega.nombre !== bodega.nombre || returned_bodega.administrador !== bodega.administrador) {
                        console.log('Bodega insertada:')
                        console.log('- ' + stringify(bodega));
                        console.log('Bodega retornada:')
                        console.log('- ' + stringify(returned_bodega));
                        console.log(`Error en Test ${test_name}`);
                        console.log('- Error: La bodega retornada no corresponde con la insertada');
                    } else {
                        console.log(stringify(returned_bodega));
                        console.log('Test Correcto. Bodega recuperada correctamente');
                        Controller.deleteBodega(returned_bodega.id, returned_bodega.administrador,
                            (error) => {
                                if (error)
                                    console.log(`Error en Test ${test_name}. \n- ${error}`);
                                else
                                    console.log('Test Correcto. Bodega eliminada correctamente');
                            }
                        );
                    }
                }
            );            
        }
    }
);