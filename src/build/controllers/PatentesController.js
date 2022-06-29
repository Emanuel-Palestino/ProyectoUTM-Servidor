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
            let respuestaColaboradores;
            //una patente
            let respuesta = yield database_1.default.query(`SELECT P.idPatente, P.nombrePatente, P.registro, P.obtencion, P.resumen, P.comprobante FROM patentes as P INNER JOIN profesorYpatente AS PP ON PP.idPatente=P.idPatente WHERE PP.idProfesor=${idProfesor} AND P.registro >= '${fechaIni}' AND P.registro <= '${fechaFin}' AND PP.esInterno=1`);
            //todos sus colaboradores
            for (let i = 0; i < respuesta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT idProfesor, esInterno FROM profesorYpatente WHERE idPatente = ? ORDER BY pos', [respuesta[i].idPatente]);
                let aux = [];
                for (let j = 0; j < respuesta2.length; j++) {
                    if (respuesta2[j].esInterno == 1) {
                        respuestaColaboradores = yield database_1.default.query(`SELECT PP.idProfesor, P.nombreProfesor, PP.esInterno FROM profesores AS P INNER JOIN profesorYpatente PP ON PP.idProfesor = P.idProfesor WHERE PP.esInterno=1 AND P.idProfesor = ${respuesta2[j].idProfesor} AND PP.idPatente=${respuesta[i].idPatente}`);
                    }
                    else {
                        respuestaColaboradores = yield database_1.default.query(`SELECT PP.idProfesor, EP.nombreExterno AS nombreProfesor, PP.esInterno FROM externosPatente AS EP INNER JOIN profesorYpatente PP ON PP.idProfesor = EP.idExternoPatente WHERE PP.esInterno=0 AND EP.idExternoPatente = ${respuesta2[j].idProfesor} AND PP.idPatente=${respuesta[i].idPatente}`);
                    }
                    aux.push(respuestaColaboradores[0]);
                }
                respuesta[i].colaboradores = aux;
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
            const resp = yield database_1.default.query(`SELECT EP.idExternoPatente, EP.nombreExterno FROM ((patentes as P INNER JOIN profesorYpatente PP ON P.idPatente=PP.idPatente AND PP.idProfesor=${idProfesor} AND PP.esInterno=1) INNER JOIN profesorYpatente PP2 ON PP2.idPatente=P.idPatente) INNER JOIN externosPatente EP ON EP.idExternoPatente=PP2.idProfesor AND PP2.esInterno=0`);
            res.json(resp);
        });
    }
    listPatentesByCarreraByPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idCarrera, fechaIni, fechaFin } = req.params;
            let consulta = yield database_1.default.query(`SELECT DISTINCT P.idPatente, P.nombrePatente, P.registro, P.obtencion, P.resumen, P.comprobante FROM (patentes P INNER JOIN profesorYpatente PP ON P.registro>='${fechaIni}' AND P.obtencion<='${fechaFin}' AND P.idPatente=PP.idPatente) INNER JOIN profesores PR ON PP.idProfesor=PR.idProfesor AND PR.idCarrera=${idCarrera}`);
            for (let i = 0; i < consulta.length; i++) {
                const respuesta2 = yield database_1.default.query('SELECT idProfesor, esInterno FROM profesorYpatente WHERE idPatente =?  ORDER BY pos', [consulta[i].idPatente]);
                consulta[i].colaboradores = respuesta2;
                for (let j = 0; j < respuesta2.length; j++) {
                    if (respuesta2[j].esInterno == 1) {
                        const colaborador = yield database_1.default.query('SELECT nombreProfesor,idProfesor FROM profesores WHERE idProfesor = ?', [respuesta2[j].idProfesor]);
                        const esInterno = yield database_1.default.query('SELECT esInterno,pos from profesorYpatente WHERE idProfesor=? AND idPatente=? AND esInterno=1', [respuesta2[j].idProfesor, consulta[i].idPatente]);
                        colaborador[0].esInterno = esInterno[0].esInterno;
                        colaborador[0].pos = esInterno[0].pos;
                        consulta[i].colaboradores[j] = colaborador[0];
                    }
                    else {
                        const colaborador = yield database_1.default.query('SELECT nombreExterno AS nombreProfesor,idExternoPatente AS idProfesor FROM externosPatente WHERE idExternoPatente = ?', [respuesta2[j].idProfesor]);
                        const esInterno2 = yield database_1.default.query('SELECT esInterno, pos from profesorYpatente WHERE idProfesor=? AND idPatente=? AND esInterno=0', [respuesta2[j].idProfesor, consulta[i].idPatente]);
                        colaborador[0].esInterno = esInterno2[0].esInterno;
                        colaborador[0].pos = esInterno2[0].pos;
                        consulta[i].colaboradores[j] = colaborador[0];
                    }
                }
            }
            res.json(consulta);
        });
    }
    listColaboradoresExternosExistentesSinColaboracionPatentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idProfesor } = req.params;
            const respExternos = yield database_1.default.query(`SELECT idExternoPatente, nombreExterno from externosPatente where idExternoPatente NOT IN (SELECT idProfesor FROM profesorypatente WHERE idPatente IN (SELECT idPatente FROM profesorypatente WHERE idProfesor = ${idProfesor} and esinterno = 1)and esInterno=0);`);
            res.json(respExternos);
        });
    }
    updatePrioridadesOfColaboradoresByPatente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idPatente } = req.params;
            let resp;
            for (let i = 0; i < req.body.length; i++) {
                const profesorYpatente = req.body[i];
                resp = yield database_1.default.query("UPDATE profesorypatente set ? WHERE idPatente= ? AND idProfesor= ?", [profesorYpatente, idPatente, profesorYpatente.idProfesor]);
            }
            res.json(resp);
        });
    }
    listProfesoresByInstitutoSinColaboradoresInternosByPatente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idInstituto, idPatente } = req.params;
            const resp = yield database_1.default.query(`SELECT idProfesor,nombreProfesor,correo,nivel,idCarrera,grado,tipo,nombreApa,idInstituto FROM profesores WHERE idInstituto=${idInstituto} and idProfesor NOT IN (SELECT idProfesor FROM profesorYPatente WHERE idPatente=${idPatente});`);
            res.json(resp);
        });
    }
    createColaboradorExternoPatente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idPatente } = req.params;
            let externo = {
                "correoExterno": req.body.correoExterno,
                "nombreExterno": req.body.nombreExterno,
            };
            const consulta = yield database_1.default.query("INSERT INTO externosPatente set ?", externo);
            let t_patente = {
                "idProfesor": consulta.insertId,
                "idPatente": idPatente,
                "pos": req.body.pos,
                "esInterno": 0
            };
            const resp_tabla = yield database_1.default.query('INSERT INTO profesorYpatente SET ?', t_patente);
            res.json(resp_tabla);
        });
    }
    addColaboradoresPatenteUTM(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idPatente } = req.params;
            const profesores = req.body;
            let resp;
            for (let i = 0; i < profesores.length; i++) {
                let profesor = profesores[i];
                profesor.esInterno = 1;
                profesor.idPatente = idPatente;
                resp = yield database_1.default.query("INSERT INTO profesorYpatente set ?", profesor);
            }
            res.json(resp);
        });
    }
}
exports.patentesController = new PatentesController();
