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
            const { idProfesor } = req.params;
            const resp = yield database_1.default.query("INSERT INTO patentes set ?", [req.body]);
            let dato = {
                idProfesor: idProfesor,
                idPatente: resp.insertId,
                pos: 1,
                esInterno: 1
            };
            const resp2 = yield database_1.default.query('INSERT INTO profesorYpatente SET ?', dato);
            res.json(resp2);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let resp = yield database_1.default.query(`DELETE FROM profesorYpatente WHERE idPatente = ${id}`);
            resp = yield database_1.default.query(`DELETE FROM patentes WHERE idPatente = ${id}`);
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
            let respuesta = yield database_1.default.query(`SELECT P.idPatente, P.nombrePatente, P.registro, P.obtencion, P.resumen, P.comprobante FROM patentes as P INNER JOIN profesorYpatente PP ON PP.idPatente=P.idPatente WHERE PP.idProfesor=${idProfesor} AND registro >= '${fechaIni}' AND registro <= '${fechaFin}' AND esInterno=1`);
            //todos sus colaboradores
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT idProfesor, esInterno FROM profesorYpatente WHERE idPatente = ? ORDER BY pos', [respuesta[i].idPatente]);
                respuesta[i].colaboradores = respuesta2;
                for (let j = 0; j < respuesta2.length; j++) {
                    if (respuesta2[j].esInterno == 1) {
                        const colaborador = yield database_1.default.query('SELECT nombreProfesor AS nombreColaborador FROM profesores WHERE idProfesor = ?', [respuesta2[j].idProfesor]);
                        respuesta[i].colaboradores[j] = colaborador;
                    }
                    else {
                        const colaborador = yield database_1.default.query('SELECT nombreExterno AS nombreColaborador FROM externosPatente WHERE idExternoPatente = ?', [respuesta2[j].idProfesor]);
                        respuesta[i].colaboradores[j] = colaborador;
                    }
                }
            }
            res.json(respuesta);
        });
    }
    listColaboradoresInternosPatentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            const resp = yield database_1.default.query(`SELECT DISTINCT CE.idProfesor, CE.nombreProfesor, CE.idCarrera, CE.idInstituto FROM profesores AS CE INNER JOIN profesorYpatente PYP ON CE.idProfesor = PYP.idProfesor INNER JOIN profesorYpatente P ON P.idPatente = PYP.idPatente WHERE PYP.esInterno = 1  AND P.esInterno = 1 AND P.idProfesor = ${idProfesor} AND CE.idProfesor !=${idProfesor}`);
            res.json(resp);
        });
    }
    colaboradoresExternos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            const resp = yield database_1.default.query(`SELECT EP.idExternoPatente, EP.nombreExterno FROM ((patentes as P INNER JOIN profesorypatente PP ON P.idPatente=PP.idPatente AND PP.idProfesor=${idProfesor} AND PP.esInterno=1) INNER JOIN profesorypatente PP2 ON PP2.idPatente=P.idPatente) INNER JOIN externosPatente EP ON EP.idExternoPatente=PP2.idProfesor AND PP2.esInterno=0`);
            res.json(resp);
        });
    }
}
exports.patentesController = new PatentesController();
