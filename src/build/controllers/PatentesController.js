"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patentesController = void 0;
const database_1 = __importDefault(require("../database"));
class PatentesController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query('SELECT * FROM patentes order by idPatente');
            res.json(respuesta);
        });
    }
    listOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let consulta = 'SELECT * FROM patentes WHERE idPatente = ' + id;
            const respuesta = yield database_1.default.query(consulta);
            if (respuesta.length > 0) {
                res.json(respuesta[0]);
                return;
            }
            res.status(404).json({ 'mensaje': 'Patente no encontrada' });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const resp = yield database_1.default.query("INSERT INTO patentes set ?", [req.body]);
            res.json(resp);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM patentes WHERE idPatente = ${id}`);
            res.json(resp);
        });
    }
    actualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("UPDATE patentes set ? WHERE idPatente= ?", [req.body, id]);
            res.json(resp);
        });
    }
    listPatentesByProfesorByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor, fechaIni, fechaFin } = req.params;
            //una patente
            let colaboradores;
            let respuesta = yield database_1.default.query(`SELECT P.idPatente, P.nombrePatente, P.registro, P.obtencion, P.resumen, P.comprobante FROM patentes as P INNER JOIN profesorYPatente PP ON PP.idPatente=P.idPatente WHERE PP.idProfesor=${idProfesor} AND registro >= '${fechaIni}' AND registro <= '${fechaFin}'`);
            //todos sus colaboradores
            for (let i = 0; i < respuesta.length; i++) {
                let respuesta2 = yield database_1.default.query('SELECT idProfesor, esInterno FROM profesorYPatente WHERE idPatente = ? ORDER BY pos', [respuesta[i].idPatente]);
                for (let j = 0; j < respuesta2.length; j++) {
                    if (respuesta2[j].esInterno == 1) {
                        let colaborador = yield database_1.default.query('SELECT nombreExterno FROM externosPatentes WHERE idExternoPatente = ?', [respuesta2[j].idProfesor]);
                        colaboradores[j] = colaborador;
                    }
                    if (respuesta2[j].esInterno == 0) {
                        let colaborador = yield database_1.default.query('SELECT nombreProfesor FROM profesores WHERE idProfesor = ?', [respuesta2[j].idProfesor]);
                        colaboradores[j] = colaborador;
                    }
                }
                respuesta[i].colaboradores = colaboradores;
            }
            res.json(respuesta);
        });
    }
}
exports.patentesController = new PatentesController();
