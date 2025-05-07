
// controller.js
'use strict';

const DAOUsuario = require('../integration/dao-usuario.js');
const DAOBodega = require('../integration/dao-bodega.js');
const DAOAcceso = require('../integration/dao-acceso.js');
const DAOParcela = require('../integration/dao-parcela.js');
const DAOVariedad = require('../integration/dao-variedad.js');
const DAOLote = require('../integration/dao-lote.js');
const DAOContenedor = require('../integration/dao-contenedor.js');
const DAOAnaliticas = require('../integration/dao-analiticas.js');
const DAOOperacion = require('../integration/dao-operacion.js');
const DAOSalida = require('../integration/dao-salida.js');
const Lote = require('../entities/lote.js');
const Salida = require('../entities/salida.js');
const Operacion = require('../entities/operacion.js');
const {isNull} = require('../utils/validation-utils.js');
/* <DEBUG/> */ const superCreateLogger = require('../utils/debug-utils.js');
// class Operation {
//     #Own properties
//     id
//     tipo
//     fecha
//     volumen
//     #Foreign properties
//     id_usuario
//     id_lote_origen
//     id_contenedor_origen
//     id_lote_destino
//     id_contenedor_destino
// }

/* <DEBUG/> */ const createLogger = superCreateLogger('controller');

// Parámetros de entrada:
// - idBodega: Número entero positivo. Identificador de la bodega.
// - originContainerName: String(32). Nombre del depósito de origen.
// - destinationContainerName: String(32). Nombre del depósito de destino.
// - quantity: Número entero positivo. Cantidad de vino a mover.

// Precondiciones:
// - idBodega es un número entero positivo.
// - quantity is a positive integer.
// - origin_location, destination_location are strings(32) not empty.
// - origin_location != destination_location.

// Restricciones:
// - El contenedor de origen debe existir.
// - El contenedor de destino debe existir.
// - El volumen del lote del contenedor de destino debe ser menor o igual a la capacidad del contenedor menos el volumen a transferir.
// - El volumen del lote del contenedor de origen debe ser mayor o igual al volumen a transferir.

// Funciones:
// - DAOContenedor.getContenedorByName() : Contenedor | null
// - DAOLote.getLoteByName() : Lote | null

// Clases:
// - Contenedor {
//   + id
//   + nombre  
//   + max_volumen
//   + tipo
//
//   + vendor
//   + purchaseDate
//   + manufacturer
//   + manufacturerDate
//
//   + id_bodega
//   + id_lote
//   + nombre_lote
//   + volumen
// }
// - Lote {
//   + id
//   + nombre
//   + parcela
//   + variedades
//   + volumen
// }

// · Operaciones de escritura
// Si no se cumplen las restricciones o se produce un error se devuelve 'callback(error)'.
// Si el error es declarado tendrá un mensaje apropiado.
// Si se cumplen se realiza la operación. En caso de éxito termina con 'callback(null)'.

class Controller {

    static moveWineToEmptyContainer(idUsuario, idBodega, originContainerName, destinationContainerName, quantity, destinationBatchName, callback) {
        Controller.getContainersToMove(idBodega, originContainerName, destinationContainerName, quantity,
            (error, originTank, destinationTank, originBatch) => {
                if (error)
                    return callback(error);
                if (destinationTank.nombre_lote !== null)
                    return callback(new Error('El depósito de destino no está vacío.'));

                // Comprobar si existe un lote con nombre 'destinationBatchName'
                DAOLote.readLoteByName(destinationBatchName, (error, destinationBatch) => {
                    // Error al obtener el lote del depósito de destino
                    if (error)
                        return callback(new Error('Error al comprobar el nombre del lote de destino.'));
                    if (destinationBatch)
                        return callback(new Error('Ya existe un lote con el nombre indicado.'));
                    
                    destinationBatch = new Lote({
                        nombre: destinationBatchName,
                        parcela: originBatch.parcela,
                        variedades: originBatch.variedades,
                        volumen: 0,
                        contenedor: destinationContainerName,
                        bodega_id: idBodega
                    });

                    DAOLote.insertLote(destinationBatch, (error) => {
                        if (error)
                            return callback(new Error('Error al insertar el lote de destino.'));

                        DAOLote.readLoteByName(destinationBatchName, (error, destinationBatch) => {
                            if (error)
                                return callback(new Error('Error al obtener el nuevo lote de destino.'));
                        
                            Controller.moveWine(idUsuario, originTank, destinationTank, originBatch, destinationBatch, quantity, callback);
                        });
                    });
                });
            }
        );
    }

    static moveWineToPartialContainer(idUsuario, idBodega, originContainerName, destinationContainerName, quantity, callback) {
        Controller.getContainersToMove(idBodega, originContainerName, destinationContainerName, quantity,
            (error, originTank, destinationTank, originBatch) => {
                if (error)
                    return callback(error);

                // Obtener el lote del depósito de destino
                DAOLote.readLoteByName(destinationTank.nombre_lote, (error, destinationBatch) => {
                    // Error al obtener el lote del depósito de destino
                    if (error || !destinationBatch)
                        return callback(new Error('Error al obtener el lote del depósito de destino.'));

                    Controller.moveWine(idUsuario, originTank, destinationTank, originBatch, destinationBatch, quantity, callback);
                });
            }
        );
    }

    static getContainersToMove(idBodega, originContainerName, destinationContainerName, quantity, callback) {
        // Obtener el depósito de origen
        DAOContenedor.readContenedorByNameAndBodega(originContainerName, idBodega, (error, originTank) => {
            // Error al obtener el depósito de origen
            if (error)
                return callback(new Error('Error al obtener el depósito de origen.'));
            // Error: El depósito de origen no existe
            if (!originTank)
                return callback(new Error('El depósito de origen no existe.'));
            // Error: El depósito de origen no pertenece a la bodega seleccionada
            if (originTank.id_bodega !== idBodega)
                return callback(new Error('El depósito de origen no pertenece a la bodega seleccionada.'));
            // Error: El depósito de origen no tiene suficiente cantidad para transferir
            if (originTank.volumen < quantity)
                return callback(new Error('El depósito de origen no tiene suficiente cantidad para transferir.'));

            // Obtener el depósito de destino
            DAOContenedor.readContenedorByNameAndBodega(destinationContainerName, idBodega, (error, destinationTank) => {
                // Error al obtener el depósito de destino
                if (error)
                    return callback(new Error('Error al obtener el depósito de destino.'));
                // Error: El depósito de destino no existe
                if (!destinationTank)
                    return callback(new Error('El depósito de destino no existe.'));
                // Error: El depósito de destino no pertenece a la bodega seleccionada
                if (destinationTank.id_bodega !== idBodega)
                    return callback(new Error('El depósito de destino no pertenece a la bodega seleccionada.'));
                // Error: El depósito de destino no tiene suficiente espacio para transferir la cantidad indicada
                const destinationVolume = isNull(destinationTank.volumen) ? 0 : destinationTank.volumen; 
                if (destinationTank.max_volumen - destinationVolume < quantity)
                    return callback(new Error('El depósito de destino no tiene suficiente espacio para transferir la cantidad indicada.'));

                // Obtener el lote del depósito de origen
                DAOLote.readLoteByName(originTank.nombre_lote, (error, originBatch) => {
                    // Error al obtener el lote del depósito de origen
                    if (error || !originBatch)
                        return callback(new Error('Error al obtener el lote del depósito de origen.'));

                    return callback(error, originTank, destinationTank, originBatch);
                });
            });
        });
    }

    
    // Nota: String(32): String tal que String.length <= 32.
    static moveWine(idUsuario, originTank, destinationTank, originBatch, destinationBatch, quantity, callback) {
        /* <DEBUG/> */ const {logElement} = createLogger('moveWine');
        // <DEBUG>
        logElement(194, originTank.volumen, 'originTankVolume');
        logElement(195, destinationTank.volumen, 'destinationTankVolume');
        logElement(196, originBatch.volumen, 'originBatchVolume (pre-addition)');
        logElement(197, destinationBatch.volumen, 'destinationBatchVolume (pre-addition)');
        logElement(198, quantity, 'quantity');
        // </DEBUG>
        // · Moviendo 'quantity' unidades de originTank a destinationTank
        originBatch.volumen -= quantity;
        destinationBatch.volumen += quantity;
        // <DEBUG>
        logElement(204, originBatch.volumen, 'originBatchVolume (post-addition)');
        logElement(205, destinationBatch.volumen, 'destinationBatchVolume (post-addition)');
        // </DEBUG>

        // Actualizar el volumen del lote del depósito de destino
        DAOLote.alterVolumen(destinationBatch.id, destinationBatch.volumen, (error) => {
            // Error al actualizar el volumen del lote del depósito de destino
            if (error)
                return callback(new Error('Error al actualizar el volumen del lote del depósito de destino.'));

            // Actualizar el volumen del depósito de destino
            DAOContenedor.alterLote(destinationTank.id, destinationBatch, (error) => {
                // Error al actualizar el volumen del depósito de destino
                if (error)
                    return callback(new Error('Error al actualizar el volumen del depósito de destino.'));
        
                // Actualizar el volumen del lote del depósito de origen
                DAOLote.alterVolumen(originBatch.id, originBatch.volumen, (error) => {
                    // Error al actualizar el volumen del lote del depósito de origen
                    if (error)
                        return callback(new Error('Error al actualizar el volumen del lote del depósito de origen.'));

                    const originBatchId = originBatch.id;
                    const shouldDeleteBatch = originBatch.volumen === 0;
                    if (shouldDeleteBatch)
                        originBatch = null;

                    // Actualizar el volumen del depósito de origen
                    DAOContenedor.alterLote(originTank.id, originBatch, (error) => {
                        // Error al actualizar el volumen del depósito de origen
                        if (error)
                            return callback(new Error('Error al actualizar el volumen del depósito de origen.'));

                        function insertOperation() {
                            DAOOperacion.insertOperacion(new Operacion({
                                id_bodega: originTank.id_bodega,
                                id_usuario: idUsuario,
                                id_lote_origen: originBatchId,
                                id_contenedor_origen: originTank.id,
                                id_lote_destino: destinationBatch.id,
                                id_contenedor_destino: destinationTank.id,
                                fecha: new Date(),
                                tipo: 'movimiento',
                                volumen: quantity
                            }), callback);
                        }

                        if (!shouldDeleteBatch)
                            // Operación exitosa
                            return insertOperation();
                        
                        DAOLote.deleteLote(deleteBatchId, (error) => {
                            if (error)
                                return callback(new Error('Error al eliminar el lote del depósito de origen.'));

                            return insertOperation();
                        });
                            
                    });  
                });
            });
        });
    }

    static createNuevaEntradaUva(idUsuario, idBodega, entrada, callback) {
        const nombreLote = entrada.nombreLote;
        const cantidad = entrada.cantidad;
        const nombreDeposito = entrada.nombreDeposito;
        const nombreVariedad = entrada.nombreVariedad;
        const nombreParcela = entrada.nombreParcela;

        if (cantidad <= 0) {
            callback(new Error('La cantidad introducida debe ser positiva'));
        } else {
            DAOLote.readLoteByName(nombreLote, (error, lote) => {
                if (error) {
                    callback(error);
                } else if (lote !== null) {
                    callback(new Error('El nombre de lote está en uso'));
                } else {
                    DAOContenedor.readContenedorByNameAndBodega(nombreDeposito, idBodega, (error, deposito) => {
                        if (error) {
                            callback(error);
                        } else if (deposito === null) {
                            callback(new Error('El depósito seleccionado no existe'));
                        } else if (deposito.lote !== null) {
                            callback(new Error('El depósito seleccionado está ocupado'));
                        } else {
                            DAOVariedad.readVariedadByName(nombreVariedad, (error, variedad) => {
                                if (error) {
                                    callback(error);
                                } else if (deposito === null) {
                                    callback(new Error('La variedad seleccionada no existe'));
                                } else {
                                    DAOParcela.readParcelaByNameAndBodega(nombreParcela, deposito.id_bodega, (error, parcela) => {
                                        if (error) {
                                            callback(error);
                                        } else if (deposito === null) {
                                            callback(new Error('La parcela seleccionada no existe'));
                                        } else {
                                            DAOLote.insertLote(nombreLote, cantidad, nombreParcela, nombreVariedad, (error) => {
                                                if (error) {
                                                    callback(error);
                                                } else {
                                                    DAOLote.readLoteByName(nombreLote, (error, lote) => {
                                                        if (error) {
                                                            callback(error);
                                                        } else {
                                                            DAOContenedor.setLote(lote.id, (error) => {
                                                                if (error)
                                                                    return callback(error);

                                                                DAOOperacion.insertOperacion(new Operacion({
                                                                    id_bodega: deposito.id_bodega,
                                                                    id_usuario: idUsuario,
                                                                    id_lote_origen: null,
                                                                    id_contenedor_origen: null,
                                                                    id_lote_destino: lote.id,
                                                                    id_contenedor_destino: deposito.id,
                                                                    fecha: new Date(),
                                                                    tipo: 'entrada',
                                                                    volumen: cantidad
                                                                }), callback);
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    
    static createUsuario(usuarioAspirante, callback) {
        DAOUsuario.readAllUsuarioByEmail(usuarioAspirante.email, (error, usuario) => {
            if (error)
                callback(new Error('Se ha producido un error al crear el usuario. Pruebe más tarde.'));
            else if (usuario === null)
                DAOUsuario.insertUsuario(usuarioAspirante, callback);
            else
                callback(new Error('Ya existe un usuario con el email proporcionado'));
        });
    }

    static createWinery(newWinery, callback) {
        DAOBodega.readBodegasByAdministrador(newWinery.administrador, (error, wineries) => {
            if (error)
                return callback(error);
            const matchingWineries = wineries.filter((winery) => {
                return winery.nombre === newWinery.nombre 
            });
            if (matchingWineries.length > 0)
                return callback(new Error('Ya existe una bodega con el mismo nombre'));
            else {
                DAOBodega.insertBodega(newWinery, (error) => {
                    if (error)
                        return callback(new Error('No se ha podido insertar la bodega'));
                    else {
                        DAOBodega.readBodegaByNameAndOwner(newWinery.nombre, newWinery.administrador,
                            (error, winery) => {
                                if (error)
                                    return callback(error);
                                else
                                    DAOAcceso.crearAcceso(winery.administrador, winery.id, 1, callback);
                            }
                        );
                    }
                });
            }
        });
    }

    static deleteBodega(idWinery, administrador, callback) {
        /* <DEBUG/> */ const {logPosition} = createLogger('deleteBodega');
        /* <DEBUG/> */ logPosition(384);
        const genericError = new Error('No se ha podido eliminar la bodega');
        DAOBodega.readBodega(idWinery, (error, bodega) => {
            /* <DEBUG/> */ logPosition(387);
            if (error)
                callback(genericError);
            else if (bodega === null)
                callback(new Error('La bodega seleccionada no existe'));
            else if (bodega.administrador !== administrador)
                callback(new Error('No tiene permisos para eliminar la bodega'));
            else {
                DAOBodega.deleteBodega(idWinery, (error) => {
                    /* <DEBUG/> */ logPosition(396);
                    if (error)
                        callback(genericError);
                    else {
                        /* <DEBUG/> */ logPosition(400);
                        DAOAcceso.deleteAcceso(administrador, idWinery, (error) => {
                            if (error)
                                callback(genericError);
                            else
                                callback(null);
                        });
                    }
                });
            }
        });
    }

    static readBodegaByNameAndOwner(nombre, administrador, callback) {
        DAOBodega.readBodegaByNameAndOwner(nombre, administrador, (error, bodega) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, bodega)
        });
    }

    static readBodegasByOwner(administrador, callback) {
        DAOBodega.readBodegasByAdministrador(administrador, callback);
    }

    static isLoginCorrect(correo, contrasena, callback) {
        DAOUsuario.readAllUsuarioByEmail(correo, (error, usuario) => {
            if (error)
                callback(error, null);
            else if (usuario === null || usuario.password !== contrasena) {
                return callback(null, null);
            } else
                return callback(null, usuario);
        })
    }

    static getContainers(idBodega, callback) {
        DAOContenedor.readContenedoresByBodega(idBodega, (error, containers) => {
            if (error)
                return callback(error, null);
            else {
                const containersDictionary = {};
                containers.map((container) => {
                    const type = container.tipo;
                    if (containersDictionary.hasOwnProperty(type))
                        containersDictionary[type].push(container);
                    else
                    containersDictionary[type] = [container];
                });
                return callback(null, containersDictionary);
            }  
        });
    }

    static getBatches(idBodega, callback) {
        DAOLote.readLotesByBodega(idBodega, callback);
    }

    static checkAccess(idUsuario, idBodega, errorCallback, goodCallback) {  
        DAOAcceso.getAcceso(idUsuario, idBodega, (error, acceso) => {
            if (error)
                return errorCallback(error);
            else if (acceso === null) {
                const message = 'No tiene acceso a la bodega seleccionada';
                error = new Error(message);
                return errorCallback(error);
            } else
                return goodCallback();
        });
    }

    static getBodegas(idUsuario, callback) {
        DAOAcceso.readBodegasByUsuario(idUsuario, (error, bodegas) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, bodegas);
        });
    }

    static createContainer(container, callback) {
        DAOContenedor.readContenedorByNameAndBodega(container.nombre, container.id_bodega, (error, contenedor) => {
            if (error)
                return callback(new Error('Error al acceder a los contenedores.'));
            else if (contenedor !== null)
                return callback(new Error('El nombre del contenedor seleccionado ya está en uso.'));
            else
                DAOContenedor.insertContenedor(container, callback);
        });
    }

    static createGrapeEntry(idUsuario, idBodega, lote, depositName, callback) {
        /* DEBUG */ const {logElement} = createLogger('createGrapeEntry');
        DAOContenedor.readContenedorByNameAndBodega(depositName, idBodega, (error, deposito) => {
            if (error)
                return callback(new Error('Error al obtener el depósito seleccionado.'));
            else if (deposito === null)
                return callback(new Error('El depósito seleccionado no existe.'));
            else if (deposito.nombre_lote !== null) {
                return callback(new Error('El depósito seleccionado está ocupado.'));
            } else
                DAOLote.readLoteByName(lote.nombre, (error, readBatch) => {
                    if (error)
                        return callback(new Error('Error al obtener el lote.'));
                    else if (readBatch !== null) {
                        return callback(new Error('El nombre de lote está en uso.'));
                    } else {
                        /* <DEBUG/> */ logElement(502, lote, 'lote');
                        /* <DEBUG/> */ logElement(502, deposito, 'deposito');
                        DAOParcela.readParcelaByNameAndBodega(lote.parcela, deposito.id_bodega, (error, parcela) => {
                            if (error)
                                return callback(new Error('Error al obtener la parcela.'));
                            else if (parcela === null)
                                return callback(new Error('La parcela seleccionada no existe.'));
                            else
                                lote.parcela = parcela.id;
                                /* <DEBUG/> */ logElement(508, lote, 'lote');
                                DAOLote.insertLote(lote, (error) => {
                                    if (error)
                                        return callback(new Error('Error al insertar el lote.'));
                                    else
                                        DAOLote.readLoteByName(lote.nombre, (error, insertBatch) => {
                                            if (error)
                                                return callback(new Error('Error al obtener el lote insertado.'));
                                            else
                                                DAOContenedor.alterLote(deposito.id, insertBatch, (error) => {
                                                    if (error)
                                                        return callback(new Error('Error al actualizar el depósito.'));
                                                    else {
                                                        const operacion = new Operacion({
                                                            id_bodega: idBodega,
                                                            id_usuario: idUsuario,
                                                            id_lote_origen: null,
                                                            id_contenedor_origen: null,
                                                            id_lote_destino: insertBatch.id,
                                                            id_contenedor_destino: deposito.id,
                                                            fecha: new Date(),
                                                            tipo: 'entrada',
                                                            volumen: lote.volumen
                                                        });
                                                        DAOOperacion.insertOperacion(operacion, (error) => {
                                                            if (error)
                                                                return callback(new Error('Error al insertar la operación.'));
                                                            else
                                                                return callback(null);
                                                        });
                                                    }
                                                });
                                        });
                                });
                        });
                    }
                });
        });
    }

    static getAnalytics(bacthName, callback) {
        DAOLote.readLoteByName(bacthName, (error, batch) => {
            if (error)
                return callback(error, null);
            else if (batch === null)
                return callback(new Error('El lote seleccionado no existe'), null);
            else
                DAOAnaliticas.readAnaliticasByLote(batch.id, (error, analytics) => {
                    if (error)
                        return callback(error, null);
                    else
                        return callback(null, analytics);
                });
        });
    }

    static outWine(idUsuario, idBodega, originBatchName, quantity, callback) {
        /* <DEBUG/> */ const {logPosition, logElement} = createLogger('outWine');
        /* <DEBUG/> */ logPosition(565);
        /* <DEBUG/> */ logElement(567, originBatchName, 'originBatchName');
        DAOLote.readLoteByName(originBatchName, (error, originBatch) => {
            /* <DEBUG/> */ logElement(567, originBatch, 'originBatch');
            if (error)
                return callback(error);
            else if (originBatch === null || originBatch.bodega_id !== idBodega)
                return callback(new Error('El lote seleccionado no existe'));
            else if (originBatch.contenedor !== 'botella')
                return callback(new Error('El lote seleccionado no está embotellado'));
            else if (originBatch.volumen < quantity)
                return callback(new Error('El lote seleccionado no tiene suficiente cantidad para embotellar'));

            const checkCallback = (error) => {
                if (error)
                    return callback(new Error('Error al insertar el nuevo lote'));
                else {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hour = String(now.getHours()).padStart(2, '0');
                    const minute = String(now.getMinutes()).padStart(2, '0');
                    const second = String(now.getSeconds()).padStart(2, '0');
                    // Date format: AAAA.MM.DD.HH.MM.SS
                    const date = `${year}.${month}.${day}.${hour}.${minute}.${second}`;
                    const newBatchName = originBatchName + '-' + date;

                    const exitBatch = new Lote({
                        nombre: newBatchName,
                        parcela: originBatch.parcela,
                        variedades: originBatch.variedades,
                        volumen: quantity,
                        bodega_id: idBodega,
                        contenedor: null
                    });

                    logElement(592, exitBatch, 'exitBatch');
                    
                    DAOLote.insertLote(exitBatch, (error) => {
                        if (error)
                            return callback(new Error('Error al insertar el lote de salida'));

                        DAOLote.readLoteByName(newBatchName, (error, newBatch) => {
                            if (error)
                                return callback(new Error('Error al acceder al lote de salida'));

                            const operacion = new Operacion({
                                id_bodega: idBodega,
                                id_usuario: idUsuario,
                                id_lote_origen: originBatch.id,
                                id_contenedor_origen: null,
                                id_lote_destino: newBatch.id,
                                id_contenedor_destino: null,
                                fecha: now,
                                tipo: 'salida',
                                volumen: quantity
                            });
                            DAOOperacion.insertOperacion(operacion, (error) => {
                                if (error)
                                    return callback(new Error('Error al insertar la operación de salida'));

                                const salida = new Salida({
                                    id: newBatch.id,
                                    nombre_lote: newBatchName,
                                    id_bodega: idBodega,
                                });
                                DAOSalida.insertSalida(salida, callback);
                            });
                        });
                    });
                }
            };

            originBatch.volumen -= quantity;
            if (originBatch.volumen === 0)
                DAOLote.deleteLote(originBatch.id, checkCallback);
            else
                DAOLote.alterVolumen(originBatch.id, originBatch.volumen, checkCallback);
        });
    }

    static bottling(idUsuario, idBodega, originContainerName, quantity, newBatchName, callback) {
        /* <DEBUG/> */ const {logPosition, logElement} = createLogger('bottling');
        /* <DEBUG/> */ logPosition(607);
        DAOContenedor.readContenedorByNameAndBodega(originContainerName, idBodega, (error, originContainer) => {
            if (error)
                return callback(error);
            else if (originContainer === null || originContainer.id_bodega !== idBodega)
                return callback(new Error('El depósito seleccionado no existe'));
            else if (originContainer.nombre_lote === null)
                return callback(new Error('El depósito seleccionado está vacío'));

            /* <DEBUG/> */ logElement(616, originContainer, 'originContainer');
            const originBatchName = originContainer.nombre_lote;
            DAOLote.readLoteByName(originBatchName, (error, originBatch) => {
                /* <DEBUG/> */ logElement(619, originBatch, 'originBatch');
                if (error)
                    return callback(error);
                else if (originBatch === null || originBatch.bodega_id !== idBodega)
                    return callback(new Error('El lote seleccionado no existe'));
                else if (originBatch.volumen < quantity)
                    return callback(new Error('El lote seleccionado no tiene suficiente cantidad para embotellar'));

                const newBatch = new Lote({
                    nombre: newBatchName,
                    parcela: originBatch.parcela,
                    variedades: originBatch.variedades,
                    volumen: quantity,
                    bodega_id: idBodega,
                    contenedor: 'botella'
                });
                DAOLote.insertLote(newBatch, (error) => {
                    if (error)
                        return callback(new Error('Error al insertar el nuevo lote'));

                    const originBatchId = originBatch.id;
                    if (originBatch.volumen === quantity)
                        originBatch = null;
                    else
                        originBatch.volumen -= quantity;

                    DAOContenedor.alterLote(originContainer.id, originBatch, (error) => {
                        if (error)
                            return callback(new Error('Error al insertar el nuevo lote'));

                        const checkCallback = (error) => {
                            if (error)
                                return callback(new Error('Error al insertar el nuevo lote'));
                            else {
                                DAOLote.readLoteByName(newBatchName, (error, newBatch) => {
                                    if (error)
                                        return callback(new Error('Error al insertar el nuevo lote'));

                                    const operacion = new Operacion({
                                        id_bodega: idBodega,
                                        id_usuario: idUsuario,
                                        id_lote_origen: originBatchId,
                                        id_contenedor_origen: originContainer.id,
                                        id_lote_destino: newBatch.id,
                                        id_contenedor_destino: 'botella',
                                        fecha: new Date(),
                                        tipo: 'movimiento',
                                        volumen: quantity
                                    });

                                    DAOOperacion.insertOperacion(operacion, callback);
                                });
                            }
                        };

                        if (originBatch === null)
                            DAOLote.deleteLote(originBatchId, checkCallback);
                        else
                            DAOLote.alterVolumen(originBatch.id, originBatch.volumen, checkCallback);
                    });
                });
            });
        });
    }

    static createAnalytic(batchName, analytic, callback) {
        DAOLote.readLoteByName(batchName, (error, batch) => {
            if (error)
                return callback(error, null);
            else if (batch === null)
                return callback(new Error('El lote seleccionado no existe'), null);
            else {
                analytic.id_lote = batch.id;
                DAOAnaliticas.insertAnalitica(analytic, callback);
            }
        });
    }

    static getTraze(idBodega, batchName, callback) {
        class Node {
            constructor(operation) {
                this.operation = operation;
                this.children = [];
            }
            addChild(child) {
                this.children.push(child);
            }
            toArray() {
                let children = [];
                for (const child of this.children)
                    children.push(child.toArray());
                return [this.operation, children];
            }
            static fromArray(array) {
                const operation = array[0];
                const children = array[1];
                const node = new Node(operation);
                for (const child of children)
                    node.addChild(Node.fromArray(child));
                return node;
            }
            getLeafs() {
                if (this.operation.tipo === 'entrada')
                    return [this];
                let leafs = [];
                for (const child of this.children)
                    leafs = leafs.concat(child.getLeafs());
                return leafs;
            }
        }
        function buildTraze(idBatch, operations) {        
            function addBranch(node) {
                const father = node.operation.id_lote_origen;
                const date = node.operation.fecha;
                const branches = operations.filter(
                    operation => operation.id_lote_destino === father && operation.fecha <= date);
                for (const branch of branches) {
                    let child = new Node(branch);
                    if (branch.tipo === 'movimiento')
                        addBranch(child);
                    node.addChild(child);
                }
            }
            
            const outlet = operations.find(
                operation => operation.id_lote_destino === idBatch);
            const rootNode = new Node(outlet);
            addBranch(rootNode);

            let entryBatchesIds = rootNode.getLeafs().map(leaf => leaf.operation.id_lote_destino);
            // Ordenar de menor a mayor
            entryBatchesIds.sort((a, b) => a - b);
            
            DAOLote.readLotesByBodega(idBodega, (error, batches) => {
                if (error)
                    return callback(new Error('Error al obtener los lotes de entrada'), null);

                // Ordenar de menor a mayor
                batches.sort((a, b) => a.id - b.id);

                let plotsSet = new Set();
                let entryIndex = 0;
                let generalIndex = 0;
                let entryBatchId = entryBatchesIds[entryIndex];
                let batch = batches[generalIndex];
                while (generalIndex < batches.length && entryIndex < entryBatchesIds.length) {
                    if (batch.id === entryBatchId) {
                        plotsSet.add(batch.parcela);
                        generalIndex++;
                        batch = batches[generalIndex];
                        entryIndex++;
                        entryBatchId = entryBatchesIds[entryIndex];
                    } else if (batch.id > entryBatchId) {
                        entryIndex++;
                        entryBatchId = entryBatchesIds[entryIndex];
                    } else if (batch.id < entryBatchId) {
                        generalIndex++;
                        batch = batches[generalIndex];
                    }
                }
            
                const traze = {
                    root: rootNode.toArray(),
                    plots: [],
                    varieties: [],
                };
                return [null, traze];
            });
        }

        DAOOperacion.readOperacionByBodega(idBodega, (error, operations) => {
            if (error)
                return callback(new Error('Error al obtener las operaciones'), null);
            // nombre_lote_destino
            DAOSalida.readSalidaByBodegaAndLote(idBodega, batchName, (error, exit) => {
                if (error)
                    return callback(new Error('Error al obtener las salidas'), null);
                if (exit === null)
                    return callback(new Error('El lote seleccionado no ha sido vendido'), null);
                const [newError, traze] = buildTraze(exit.id, operations);
                return callback(newError, traze);
            });
        });
    }

    static getPlots(idBodega, callback) {
        DAOParcela.readParcelasByBodega(idBodega, callback);
    }
}

module.exports = Controller;