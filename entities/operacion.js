
// operacion.js
'use strict';

// · Definición de la entidad
// Operacion {
//     id: INT(11) [Null: No] [Primary Key]
//     id_bodega: INT(11) [Null: No] [Foreing Key: Bodega.id]
//     id_usuario: INT(11) [Null: No] [Foreing Key: Usuario.id]
//     id_lote_origen: INT(11) [Null: Sí] [Foreing Key: Lote.id]
//     id_contenedor_origen: INT(11) [Null: Sí] [Foreing Key: Lote.id]
//     id_lote_destino: INT(11) [Null: Sí] [Foreing Key: Lote.id]
//     id_contenedor_destino: INT(11) [Null: Sí] [Foreing Key: Lote.id]
//     fecha: DATE [Null: No]
//     tipo: VARCHAR(32) [Null: No] [Enum: 'entrada', 'movimiento', 'salida']
//     volumen: INT(11) [Atributos: Unsigned]
// }

const trySet = require('../utils/null-utils');
/* <DEBUG/> */ const superCreateLogger = require('../utils/debug-utils.js');
/* <DEBUG/> */ const createLogger = superCreateLogger('operacion');

class Operacion {
    constructor(param = {}) {
        this.id = trySet(param.id);
        this.id_bodega = trySet(param.id_bodega);
        this.id_usuario = trySet(param.id_usuario);
        this.id_lote_origen = trySet(param.id_lote_origen);
        this.id_contenedor_origen = trySet(param.id_contenedor_origen);
        this.id_lote_destino = trySet(param.id_lote_destino);
        this.id_contenedor_destino = trySet(param.id_contenedor_destino);
        this.fecha = trySet(param.fecha);
        this.tipo = trySet(param.tipo);
        this.volumen = trySet(param.volumen);
    }

    static transform(rows) {
        /* <DEBUG/> */ const {logPosition} = createLogger('transform');
        return rows.map(row => {
            logPosition(36);
            return new Operacion({
                id: row.id,
                id_bodega: row.id_bodega,
                id_usuario: row.id_usuario,
                id_lote_origen: row.id_lote_origen,
                id_contenedor_origen: row.id_contenedor_origen,
                id_lote_destino: row.id_lote_destino,
                id_contenedor_destino: row.id_contenedor_destino,
                fecha: row.fecha,
                tipo: row.tipo,
                volumen: row.volumen
            });
        });
    }
}

module.exports = Operacion;